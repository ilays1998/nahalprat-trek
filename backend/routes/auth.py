from flask import Blueprint, redirect, url_for, session, jsonify, request
from authlib.integrations.flask_client import OAuth
from models import db, AppUser
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from config import Config
from email_utils import email_service
from werkzeug.security import generate_password_hash, check_password_hash
from visitor_service import track_visitor
import os
import json
import uuid
import secrets
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
    # Use configurable redirect URI from environment, with fallback to dynamic URL
    redirect_uri = Config.OAUTH_REDIRECT_URI or url_for("auth.authorize", _external=True)
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
        user = AppUser(
            email=email, 
            name=name, 
            role=role,
            auth_method='google',
            is_verified=True  # Google users are pre-verified
        )
        db.session.add(user)
        db.session.commit()
    else:
        # User exists - check if it's an email auth user trying to use Google
        if user.auth_method == 'email':
            # Allow Google login for existing email users
            # Keep original auth_method but mark as verified since Google verified them
            user.is_verified = True  # Google accounts are always verified
            if not user.name and name:  # Update name from Google if not set
                user.name = name
            db.session.commit()
        # If user.auth_method == 'google', they can already use Google, so just continue

    # Update last_seen and track visitor
    user.last_seen = datetime.utcnow()
    db.session.commit()
    
    # Track visitor with user_id (links anonymous visitor to authenticated user)
    track_visitor(user_id=user.id)

    # Flask-JWT-Extended expects identity to be a simple value, not an object
    expires_delta = timedelta(days=7)  # Longer expiry for cookie-based auth
    access_token = create_access_token(identity=str(user.id), expires_delta=expires_delta)
    
    # Redirect to frontend callback
    frontend_callback_url = f"{Config.FRONTEND_URL}/auth/callback"
    
    # Create response with redirect
    from flask import make_response
    response = make_response(redirect(frontend_callback_url))
    
    # Set JWT token as HttpOnly cookie
    from flask_jwt_extended import set_access_cookies
    set_access_cookies(response, access_token)
    
    return response

@auth_bp.route("/register", methods=["POST"])
def register():
    """Register a new user with email and password"""
    try:
        data = request.get_json()
        email = data.get('email', '').lower().strip()
        password = data.get('password', '')
        name = data.get('name', '').strip()
        
        # Validation
        if not email or not password or not name:
            return jsonify({"error": "Email, password, and name are required"}), 400
            
        if len(password) < 8:
            return jsonify({"error": "Password must be at least 8 characters long"}), 400
            
        # Check if user already exists
        existing_user = AppUser.query.filter_by(email=email).first()
        if existing_user:
            if existing_user.auth_method == 'google':
                return jsonify({
                    "error": "An account with this email already exists via Google login. Please log in with Google, or contact support to link accounts."
                }), 409
            else:
                return jsonify({"error": "User with this email already exists"}), 409
            
        # Generate verification token
        verification_token = secrets.token_urlsafe(32)
        
        # Create new user
        password_hash = generate_password_hash(password)
        role = "admin" if email == Config.ADMIN_EMAIL else "user"
        
        user = AppUser(
            email=email,
            name=name,
            password_hash=password_hash,
            auth_method='email',
            is_verified=False,
            verification_token=verification_token,
            role=role
        )
        
        db.session.add(user)
        db.session.commit()
        
        # Send verification email
        email_sent = email_service.send_email_verification(email, name, verification_token)
        
        if not email_sent:
            # If email fails, still return success but log the error
            print(f"Failed to send verification email to {email}")
        
        return jsonify({
            "message": "Registration successful! Please check your email to verify your account.",
            "email_sent": email_sent
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@auth_bp.route("/verify-email", methods=["POST"])
def verify_email():
    """Verify email address using token"""
    try:
        data = request.get_json()
        token = data.get('token', '')
        
        if not token:
            return jsonify({"error": "Verification token is required"}), 400
            
        # Find user by verification token
        user = AppUser.query.filter_by(verification_token=token).first()
        if not user:
            return jsonify({"error": "Invalid or expired verification token"}), 400
            
        if user.is_verified:
            # Already verified - return success message but don't clear token yet
            # This allows the same link to work multiple times for user convenience
            return jsonify({"message": "Email already verified. You can log in now."}), 200
            
        # Mark user as verified but keep token for now (can be cleared later)
        user.is_verified = True
        db.session.commit()
        
        return jsonify({"message": "Email verified successfully! You can now log in."}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@auth_bp.route("/login-email", methods=["POST"])
def login_email():
    """Login with email and password"""
    try:
        data = request.get_json()
        email = data.get('email', '').lower().strip()
        password = data.get('password', '')
        
        if not email or not password:
            return jsonify({"error": "Email and password are required"}), 400
            
        # Find user by email (regardless of auth_method, but they must have a password)
        user = AppUser.query.filter_by(email=email).first()
        if not user or not user.password_hash:
            return jsonify({"error": "Invalid email or password"}), 401
            
        # Check password
        if not check_password_hash(user.password_hash, password):
            return jsonify({"error": "Invalid email or password"}), 401
            
        # Check if email is verified
        if not user.is_verified:
            return jsonify({
                "error": "Please verify your email address before logging in",
                "needs_verification": True
            }), 401
            
        # Update last_seen and track visitor
        user.last_seen = datetime.utcnow()
        db.session.commit()
        
        # Track visitor with user_id (links anonymous visitor to authenticated user)
        track_visitor(user_id=user.id)
        
        # Create JWT token
        expires_delta = timedelta(days=7)  # Longer expiry for cookie-based auth
        access_token = create_access_token(identity=str(user.id), expires_delta=expires_delta)
        
        user_data = {
            "id": user.id,
            "email": user.email,
            "name": user.name,
            "role": user.role
        }
        
        # Create response and set cookie
        from flask import make_response
        from flask_jwt_extended import set_access_cookies
        response = make_response(jsonify({
            "user": user_data,
            "message": "Login successful"
        }), 200)
        set_access_cookies(response, access_token)
        
        return response
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@auth_bp.route("/resend-verification", methods=["POST"])
def resend_verification():
    """Resend verification email"""
    try:
        data = request.get_json()
        email = data.get('email', '').lower().strip()
        
        if not email:
            return jsonify({"error": "Email is required"}), 400
            
        user = AppUser.query.filter_by(email=email).first()
        if not user or user.auth_method != 'email':
            return jsonify({"error": "User not found or not registered with email/password"}), 404
            
        if user.is_verified:
            return jsonify({"message": "Email already verified"}), 200
            
        # Generate new verification token
        verification_token = secrets.token_urlsafe(32)
        user.verification_token = verification_token
        db.session.commit()
        
        # Send verification email
        email_sent = email_service.send_email_verification(email, user.name, verification_token)
        
        if email_sent:
            return jsonify({"message": "Verification email sent successfully"}), 200
        else:
            return jsonify({"error": "Failed to send verification email"}), 500
            
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

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

@auth_bp.route("/logout", methods=["POST"])
def logout():
    """Logout by clearing the cookie"""
    from flask import make_response
    from flask_jwt_extended import unset_jwt_cookies
    
    response = make_response(jsonify({"message": "Logout successful"}), 200)
    
    # Log the cookie clearing process
    print(f"Clearing JWT cookie. Domain: {Config.JWT_COOKIE_DOMAIN}")
    
    unset_jwt_cookies(response)
    
    # Log response headers to debug
    print(f"Response headers: {dict(response.headers)}")
    
    return response