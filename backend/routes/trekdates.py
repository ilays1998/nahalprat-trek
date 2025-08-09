from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, TrekDate, AppUser
from datetime import date

trekdates_bp = Blueprint("trekdates", __name__)

@trekdates_bp.route("/", methods=["GET"], strict_slashes=False)
def list_trekdates():
    # Return all trekdates, only future+present ones
    today = date.today()
    
    # Get sort parameter
    sort_param = request.args.get('sort', 'start_date')
    
    # Build query
    query = TrekDate.query.filter(TrekDate.end_date >= today)
    
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
    data = request.json
    td = TrekDate(
        start_date=data['start_date'],
        end_date=data['end_date'],
        available_spots_basic=data.get('available_spots_basic', 12),
        available_spots_pro=data.get('available_spots_pro', 8),
        available_spots_premium=data.get('available_spots_premium', 4),
        season=data.get('season'),
        weather_notes=data.get('weather_notes')
    )
    db.session.add(td)
    db.session.commit()
    return jsonify(serialize_trekdate(td))

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