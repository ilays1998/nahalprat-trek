from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from datetime import datetime
import uuid

db = SQLAlchemy()
migrate = Migrate()

class AppUser(db.Model):
    __tablename__ = 'app_user'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), unique=True, nullable=False)
    name = db.Column(db.String(128))
    password_hash = db.Column(db.String(255), nullable=True)  # For email/password users
    is_verified = db.Column(db.Boolean, default=False)  # Email verification status
    verification_token = db.Column(db.String(255), nullable=True)  # Email verification token
    auth_method = db.Column(db.String(16), default='google')  # 'google' or 'email'
    role = db.Column(db.String(16), default='user')  # 'user' or 'admin'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    last_seen = db.Column(db.DateTime)

class TrekDate(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date, nullable=False)
    available_spots = db.Column(db.Integer, default=20)  # Single package system
    season = db.Column(db.String(16))
    weather_notes = db.Column(db.Text)

class Booking(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('app_user.id'), nullable=False)
    first_name = db.Column(db.String(64), nullable=False)
    last_name = db.Column(db.String(64), nullable=False)
    email = db.Column(db.String(255), nullable=False)
    phone = db.Column(db.String(32), nullable=False)
    package_type = db.Column(db.String(16), nullable=False, default='standard')  # single standard package
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

class Visitor(db.Model):
    __tablename__ = 'visitor'
    
    id = db.Column(db.Integer, primary_key=True)
    visitor_id = db.Column(db.String(36), unique=True, nullable=False, index=True)  # UUID from cookie
    user_id = db.Column(db.Integer, db.ForeignKey('app_user.id'), nullable=True)  # NULL for anonymous visitors
    first_visit = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    last_visit = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    visit_count = db.Column(db.Integer, default=1, nullable=False)
    ip_address = db.Column(db.String(45))  # IPv6 can be up to 45 chars
    region = db.Column(db.String(255))
    country = db.Column(db.String(2))  # ISO country code
    city = db.Column(db.String(255))
    user_agent = db.Column(db.String(512))  # Browser/device info
    referrer = db.Column(db.String(512))  # Where they came from
    
    user = db.relationship("AppUser", backref="visitor_sessions")

class Package(db.Model):
    __tablename__ = 'package'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64), unique=True, nullable=False)  # e.g. "standard"
    description = db.Column(db.Text)
    price_per_person = db.Column(db.Integer, nullable=False)
    currency = db.Column(db.String(8), default='ILS')
    active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
