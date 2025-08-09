from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Booking, TrekDate, AppUser
from datetime import date, datetime
from config import Config
from sqlalchemy import desc, asc
import logging

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
        result = [booking.to_dict() for booking in bookings]
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

    package_field = f"available_spots_{data['package_type']}"
    if getattr(trekdate, package_field) < data['participants_count']:
        return jsonify({"error": "Not enough spots"}), 400

    # Decrement spots
    setattr(trekdate, package_field, getattr(trekdate, package_field) - data['participants_count'])

    booking = Booking(
        user_id=user.id,
        first_name=data['first_name'],
        last_name=data['last_name'],
        email=data['email'],
        phone=data['phone'],
        package_type=data['package_type'],
        trek_date=trek_date_value,
        participants_count=data['participants_count'],
        total_price=data['total_price'],
        special_requests=data.get('special_requests'),
        emergency_contact_name=data.get('emergency_contact_name'),
        emergency_contact_phone=data.get('emergency_contact_phone'),
        language=data.get('language', 'he')
    )
    db.session.add(booking)
    db.session.commit()
    db.session.add(trekdate)  # update spots
    db.session.commit()
    return jsonify(serialize_booking(booking))

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

    # Allow updating limited fields (status for now)
    if 'status' in data:
        booking.status = data['status']

    db.session.add(booking)
    db.session.commit()

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