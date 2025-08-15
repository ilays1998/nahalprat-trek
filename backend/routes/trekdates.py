from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, TrekDate, AppUser
from datetime import date, datetime

trekdates_bp = Blueprint("trekdates", __name__)

@trekdates_bp.route("/", methods=["GET"], strict_slashes=False)
def list_trekdates():
    # Return all trekdates, only future+present ones
    today = date.today()
    
    # Get sort parameter
    sort_param = request.args.get('sort', 'start_date')
    
    # Build query - get all trek dates
    query = TrekDate.query
    
    # Handle sorting
    if sort_param == '-start_date':
        query = query.order_by(TrekDate.start_date.desc())
    elif sort_param == 'start_date':
        query = query.order_by(TrekDate.start_date.asc())
    else:
        # Default to ascending start_date
        query = query.order_by(TrekDate.start_date.asc())
    
    trekdates = query.all()
    return jsonify([serialize_trekdate(d) for d in trekdates])

@trekdates_bp.route("/", methods=["POST"], strict_slashes=False)
@jwt_required()
def add_trekdate():
    user_id = get_jwt_identity()
    user = AppUser.query.get(int(user_id))
    if not user or user.role != 'admin':
        return jsonify({"error": "Only admin"}), 403
    data = request.json or {}
    # Parse incoming ISO strings (YYYY-MM-DD)
    try:
        start_date = datetime.strptime(data['start_date'], '%Y-%m-%d').date()
        end_date = datetime.strptime(data['end_date'], '%Y-%m-%d').date()
    except Exception:
        return jsonify({"error": "Invalid date format, expected YYYY-MM-DD"}), 400

    td = TrekDate(
        start_date=start_date,
        end_date=end_date,
        available_spots_basic=data.get('available_spots_basic', 12),
        available_spots_pro=data.get('available_spots_pro', 8),
        available_spots_premium=data.get('available_spots_premium', 4),
        season=data.get('season'),
        weather_notes=data.get('weather_notes')
    )
    db.session.add(td)
    db.session.commit()
    return jsonify(serialize_trekdate(td))

@trekdates_bp.route('/<int:trekdate_id>', methods=['PUT'], strict_slashes=False)
@jwt_required()
def update_trekdate(trekdate_id: int):
    user_id = get_jwt_identity()
    user = AppUser.query.get(int(user_id))
    if not user or user.role != 'admin':
        return jsonify({"error": "Only admin"}), 403

    td = TrekDate.query.get_or_404(trekdate_id)
    data = request.json or {}

    # Update fields if provided
    if 'start_date' in data:
        try:
            td.start_date = datetime.strptime(data['start_date'], '%Y-%m-%d').date()
        except Exception:
            return jsonify({"error": "Invalid start_date format, expected YYYY-MM-DD"}), 400
    if 'end_date' in data:
        try:
            td.end_date = datetime.strptime(data['end_date'], '%Y-%m-%d').date()
        except Exception:
            return jsonify({"error": "Invalid end_date format, expected YYYY-MM-DD"}), 400
    for field in ['available_spots_basic', 'available_spots_pro', 'available_spots_premium', 'season', 'weather_notes']:
        if field in data:
            setattr(td, field, data[field])

    db.session.add(td)
    db.session.commit()
    return jsonify(serialize_trekdate(td))

@trekdates_bp.route('/<int:trekdate_id>', methods=['DELETE'], strict_slashes=False)
@jwt_required()
def delete_trekdate(trekdate_id: int):
    user_id = get_jwt_identity()
    user = AppUser.query.get(int(user_id))
    if not user or user.role != 'admin':
        return jsonify({"error": "Only admin"}), 403

    td = TrekDate.query.get_or_404(trekdate_id)
    
    # Check if trek date is in the past
    today = date.today()
    if td.end_date < today:
        return jsonify({"error": "Cannot delete past trek dates"}), 400
        
    db.session.delete(td)
    db.session.commit()
    return jsonify({"success": True})

def serialize_trekdate(d):
    return {
        "id": d.id,
        "start_date": d.start_date.isoformat(),
        "end_date": d.end_date.isoformat(),
        "available_spots_basic": d.available_spots_basic,
        "available_spots_pro": d.available_spots_pro,
        "available_spots_premium": d.available_spots_premium,
        "season": d.season,
        "weather_notes": d.weather_notes
    }