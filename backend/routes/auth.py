from flask import Blueprint, redirect, url_for, session, jsonify, request
from authlib.integrations.flask_client import OAuth
from models import db, User
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from config import Config
import os

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
        access_token_url='https://accounts.google.com/o/oauth2/token',
        access_token_params=None,
        authorize_url='https://accounts.google.com/o/oauth2/auth',
        authorize_params={'prompt': 'select_account'},
        api_base_url='https://www.googleapis.com/oauth2/v1/',
        client_kwargs={'scope': 'openid email profile'}
    )

@auth_bp.route("/login")
def login():
    redirect_uri = url_for("auth.authorize", _external=True)
    return oauth.google.authorize_redirect(redirect_uri)

@auth_bp.route("/authorize")
def authorize():
    token = oauth.google.authorize_access_token()
    resp = oauth.google.get("userinfo")
    user_info = resp.json()
    email = user_info['email']
    name = user_info.get('name', '')

    user = User.query.filter_by(email=email).first()
    if not user:
        # Make you admin if email matches
        role = "admin" if email == Config.ADMIN_EMAIL else "user"
        user = User(email=email, name=name, role=role)
        db.session.add(user)
        db.session.commit()

    access_token = create_access_token(identity={"id": user.id, "email": user.email, "role": user.role})
    return jsonify(access_token=access_token, user={"email": user.email, "role": user.role, "name": user.name})

@auth_bp.route("/me")
@jwt_required()
def me():
    identity = get_jwt_identity()
    return jsonify(identity)