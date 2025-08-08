from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from datetime import datetime

db = SQLAlchemy()
migrate = Migrate()

class AppUser(db.Model):
    __tablename__ = 'app_user'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), unique=True, nullable=False)
    name = db.Column(db.String(128))
    role = db.Column(db.String(16), default='user')  # 'user' or 'admin'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class TrekDate(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date, nullable=False)
    available_spots_basic = db.Column(db.Integer, default=12)
    available_spots_pro = db.Column(db.Integer, default=8)
    available_spots_premium = db.Column(db.Integer, default=4)
    season = db.Column(db.String(16))
    weather_notes = db.Column(db.Text)

class Booking(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('app_user.id'), nullable=False)
    first_name = db.Column(db.String(64), nullable=False)
    last_name = db.Column(db.String(64), nullable=False)
    email = db.Column(db.String(255), nullable=False)
    phone = db.Column(db.String(32), nullable=False)
    package_type = db.Column(db.String(16), nullable=False)  # basic, pro, premium
    trek_date = db.Column(db.Date, nullable=False)
    participants_count = db.Column(db.Integer, default=1)
    total_price = db.Column(db.Integer)
    status = db.Column(db.String(16), default='pending')  # pending, confirmed, cancelled
    special_requests = db.Column(db.Text)
    emergency_contact_name = db.Column(db.String(64))
    emergency_contact_phone = db.Column(db.String(32))
    language = db.Column(db.String(4), default='he')
    created_date = db.Column(db.DateTime, default=datetime.utcnow)
    user = db.relationship("AppUser", backref="bookings")