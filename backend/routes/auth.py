from flask import Blueprint, redirect, url_for, session, jsonify, request
from authlib.integrations.flask_client import OAuth
from models import db, AppUser, UserLogin
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from config import Config
from utils import get_ip_info
import os
import json
from datetime import timedelta, datetime

auth_bp = Blueprint("auth", __name__)
oauth = OAuth()

@auth_bp.record_once
def on_load(state):
    app = state.app
    oauth.init_app(app)
    oauth.register(
        name='google',
        client_id=Config.GOOGLE_CLIENT_ID,
        client_secret=Config.GOOGLE_CLIENT_SECRET,
        access_token_url='https://oauth2.googleapis.com/token',
        authorize_url='https://accounts.google.com/o/oauth2/v2/auth',
        api_base_url='https://www.googleapis.com/',
        client_kwargs={
            'scope': 'email profile',  # Removed 'openid' to avoid ID token validation
            'token_endpoint_auth_method': 'client_secret_post'
        }
    )

@auth_bp.route("/login")
def login():
    redirect_uri = url_for("auth.authorize", _external=True)
    return oauth.google.authorize_redirect(redirect_uri)

@auth_bp.route("/authorize")
def authorize():
    try:
        token = oauth.google.authorize_access_token()
        # Use the access token to get user info
        resp = oauth.google.get('oauth2/v2/userinfo', token=token)
        user_info = resp.json()
        email = user_info['email']
        name = user_info.get('name', '')
    except Exception as e:
        print(f"OAuth error: {e}")
        return redirect(f"{Config.FRONTEND_URL}/login-error")

    user = AppUser.query.filter_by(email=email).first()
    if not user:
        # Make you admin if email matches
        role = "admin" if email == Config.ADMIN_EMAIL else "user"
        user = AppUser(email=email, name=name, role=role)
        db.session.add(user)
        db.session.commit()

    # Update last_seen and create login record
    user.last_seen = datetime.utcnow()
    
    # Get client IP address
    ip_address = request.headers.get('X-Forwarded-For', request.remote_addr)
    if ip_address:
        # If X-Forwarded-For contains multiple IPs, take the first one
        ip_address = ip_address.split(',')[0].strip()
    
    # Get geolocation info
    ip_info = get_ip_info(ip_address)
    
    # Create login record
    login = UserLogin(
        user_id=user.id,
        ip_address=ip_address,
        region=ip_info.get('region') if ip_info else None,
        country=ip_info.get('country') if ip_info else None,
        city=ip_info.get('city') if ip_info else None
    )
    db.session.add(login)
    db.session.commit()

    # Flask-JWT-Extended expects identity to be a simple value, not an object
    expires_delta = timedelta(minutes=int(os.environ.get("JWT_ACCESS_TOKEN_EXPIRES_MINUTES", "15")))
    access_token = create_access_token(identity=str(user.id), expires_delta=expires_delta)
    
    # Redirect to frontend with token and user data
    frontend_callback_url = f"{Config.FRONTEND_URL}/auth/callback"
    user_data = {"email": user.email, "role": user.role, "name": user.name}
    
    # Encode user data for URL
    import urllib.parse
    encoded_user_data = urllib.parse.quote(json.dumps(user_data))
    
    callback_url = f"{frontend_callback_url}?access_token={access_token}&user={encoded_user_data}"
    return redirect(callback_url)

@auth_bp.route("/me")
@jwt_required()
def me():
    try:
        user_id = get_jwt_identity()
        
        # Look up the user by ID
        user = AppUser.query.get(int(user_id))
        if not user:
            return jsonify({"error": "User not found"}), 404
            
        user_data = {
            "id": user.id,
            "email": user.email,
            "name": user.name,
            "role": user.role
        }
        return jsonify(user_data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500