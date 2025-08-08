from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Booking, TrekDate, AppUser
from datetime import date
from config import Config

bookings_bp = Blueprint("bookings", __name__)

# List bookings (own, or all if admin)
@bookings_bp.route("/", methods=["GET"])
@jwt_required()
def list_bookings():
    user = get_jwt_identity()
    if user['role'] == 'admin':
        bookings = Booking.query.all()
    else:
        bookings = Booking.query.filter_by(user_id=user['id']).all()
    return jsonify([serialize_booking(b) for b in bookings])

# Create booking
@bookings_bp.route("/", methods=["POST"])
@jwt_required()
def create_booking():
    user = get_jwt_identity()
    data = request.json

    # Check trek date & spots
    trekdate = TrekDate.query.filter_by(start_date=data['trek_date']).first()
    if not trekdate:
        return jsonify({"error": "No such trek date"}), 400

    package_field = f"available_spots_{data['package_type']}"
    if getattr(trekdate, package_field) < data['participants_count']:
        return jsonify({"error": "Not enough spots"}), 400

    # Decrement spots
    setattr(trekdate, package_field, getattr(trekdate, package_field) - data['participants_count'])

    booking = Booking(
        user_id=user['id'],
        first_name=data['first_name'],
        last_name=data['last_name'],
        email=data['email'],
        phone=data['phone'],
        package_type=data['package_type'],
        trek_date=data['trek_date'],
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