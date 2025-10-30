from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Booking, TrekDate, AppUser
from datetime import date, datetime
from config import Config
from sqlalchemy import desc, asc
import logging
from email_utils import email_service

bookings_bp = Blueprint("bookings", __name__)

# List bookings (own, or all if admin)
@bookings_bp.route("/", methods=["GET"], strict_slashes=False)
@jwt_required()
def list_bookings():
    try:
        # Get the current user from JWT token
        user = AppUser.query.get_or_404(get_jwt_identity())
        logging.debug(f"User role: {user.role}")
        
        # Start with base query
        query = Booking.query
        
        # Check if this is an admin request
        is_admin_request = request.args.get('admin') == 'true'
        logging.debug(f"Is admin request: {is_admin_request}")
        
        # Handle user_id filter
        user_id_param = request.args.get('user_id')
        logging.debug(f"User ID param: {user_id_param}")
        
        if is_admin_request:
            # Verify user is actually an admin
            if user.role != 'admin':
                return jsonify({"error": "Unauthorized"}), 403
            # Admin request - no user_id filter needed
            logging.debug("Admin request - no user_id filter applied")
        elif user_id_param:
            try:
                user_id = int(user_id_param)
                # Only allow users to see their own bookings unless they're admin
                if user_id != user.id and user.role != 'admin':
                    return jsonify({"error": "Unauthorized"}), 403
                query = query.filter_by(user_id=user_id)
            except ValueError:
                return jsonify({"error": "Invalid user_id parameter"}), 400
        else:
            # No user_id provided, show user's own bookings
            query = query.filter_by(user_id=user.id)
        
        # Apply sorting if requested
        sort_param = request.args.get('sort')
        if sort_param:
            if sort_param.startswith('-'):
                query = query.order_by(desc(getattr(Booking, sort_param[1:])))
            else:
                query = query.order_by(asc(getattr(Booking, sort_param)))
        
        bookings = query.all()
        result = [serialize_booking(booking) for booking in bookings]
        logging.debug(f"Returning {len(result)} bookings")
        return jsonify(result)
    except Exception as e:
        logging.error(f"Error in list_bookings: {str(e)}")
        return jsonify({"error": str(e)}), 500

# Create booking
@bookings_bp.route("/", methods=["POST"], strict_slashes=False)
@jwt_required()
def create_booking():
    user_id = get_jwt_identity()
    user = AppUser.query.get(int(user_id))
    data = request.json

    # Parse trek date from ISO string (yyyy-mm-dd)
    try:
        trek_date_value = datetime.strptime(data['trek_date'], '%Y-%m-%d').date()
    except Exception:
        return jsonify({"error": "Invalid trek_date format, expected YYYY-MM-DD"}), 400

    # Check trek date & spots
    trekdate = TrekDate.query.filter_by(start_date=trek_date_value).first()
    if not trekdate:
        return jsonify({"error": "No such trek date"}), 400

    # Check available spots (single package system)
    if trekdate.available_spots < data['participants_count']:
        return jsonify({"error": "Not enough spots"}), 400

    # Decrement spots
    trekdate.available_spots -= data['participants_count']

    booking = Booking(
        user_id=user.id,
        first_name=data['first_name'],
        last_name=data['last_name'],
        email=data['email'],
        phone=data['phone'],
        package_type='standard',  # Single package system
        trek_date=trek_date_value,
        participants_count=data['participants_count'],
        total_price=1000 * data['participants_count'],  # Fixed price: 1000 NIS per person
        special_requests=data.get('special_requests'),
        emergency_contact_name=data.get('emergency_contact_name'),
        emergency_contact_phone=data.get('emergency_contact_phone'),
        language=data.get('language', 'he')
    )
    db.session.add(booking)
    db.session.commit()
    db.session.add(trekdate)  # update spots
    db.session.commit()
    
    # Send email notifications
    booking_dict = serialize_booking(booking)
    try:
        # Send confirmation email to customer
        email_service.send_booking_confirmation(booking_dict)
        # Send notification to admin
        email_service.send_admin_booking_notification(booking_dict)
        logging.info(f"Booking emails sent successfully for booking {booking.id}")
    except Exception as e:
        logging.error(f"Failed to send booking emails for booking {booking.id}: {str(e)}")
    
    return jsonify(booking_dict)

# Update booking (owner or admin)
@bookings_bp.route('/<int:booking_id>', methods=['PUT'], strict_slashes=False)
@jwt_required()
def update_booking(booking_id: int):
    user_id = get_jwt_identity()
    user = AppUser.query.get(int(user_id))
    data = request.json or {}

    booking = Booking.query.get_or_404(booking_id)

    # Only owner or admin can update
    if not user or (user.role != 'admin' and booking.user_id != user.id):
        return jsonify({"error": "Forbidden"}), 403

    # Track original status for email notifications
    original_status = booking.status

    # === Enforce 3-day cancellation window for non-admin users ===
    if 'status' in data and data['status'] == 'cancelled' and user.role != 'admin':
        today = date.today()
        days_until = (booking.trek_date - today).days
        if days_until < 3:
            return jsonify({
                "error": "Cancellation window has passed. Cancellations are allowed up to 3 days before the trek date."
            }), 400
    
    # Allow updating limited fields (status for now)
    if 'status' in data:
        booking.status = data['status']

    db.session.add(booking)
    db.session.commit()
    
    # Send email notifications for status changes
    if 'status' in data and data['status'] != original_status:
        booking_dict = serialize_booking(booking)
        try:
            if data['status'] == 'confirmed':
                # Send approval email
                email_service.send_booking_approval(booking_dict, booking.id)
                logging.info(f"Booking approval email sent for booking {booking.id}")
            elif data['status'] == 'cancelled':
                # Send cancellation email
                cancellation_reason = data.get('cancellation_reason', '')
                email_service.send_booking_cancellation(booking_dict, booking.id, cancellation_reason)
                logging.info(f"Booking cancellation email sent for booking {booking.id}")
        except Exception as e:
            logging.error(f"Failed to send status change email for booking {booking.id}: {str(e)}")

    return jsonify(serialize_booking(booking))

# Delete booking (owner or admin)
@bookings_bp.route('/<int:booking_id>', methods=['DELETE'], strict_slashes=False)
@jwt_required()
def delete_booking(booking_id: int):
    user_id = get_jwt_identity()
    user = AppUser.query.get(int(user_id))

    booking = Booking.query.get_or_404(booking_id)

    # Only owner or admin can delete
    if not user or (user.role != 'admin' and booking.user_id != user.id):
        return jsonify({"error": "Forbidden"}), 403

    # Send cancellation email before deleting
    booking_dict = serialize_booking(booking)
    try:
        cancellation_reason = request.json.get('cancellation_reason', 'Booking cancelled') if request.json else 'Booking cancelled'
        email_service.send_booking_cancellation(booking_dict, booking.id, cancellation_reason)
        logging.info(f"Booking cancellation email sent for deleted booking {booking.id}")
    except Exception as e:
        logging.error(f"Failed to send cancellation email for deleted booking {booking.id}: {str(e)}")

    db.session.delete(booking)
    db.session.commit()

    return jsonify({"success": True})

# Helpers
def serialize_booking(b):
    return {
        "id": b.id,
        "first_name": b.first_name,
        "last_name": b.last_name,
        "email": b.email,
        "phone": b.phone,
        "package_type": b.package_type,
        "trek_date": b.trek_date.isoformat(),
        "participants_count": b.participants_count,
        "total_price": b.total_price,
        "status": b.status,
        "special_requests": b.special_requests,
        "emergency_contact_name": b.emergency_contact_name,
        "emergency_contact_phone": b.emergency_contact_phone,
        "language": b.language,
        "created_date": b.created_date.isoformat(),
        "user_id": b.user_id,
    }