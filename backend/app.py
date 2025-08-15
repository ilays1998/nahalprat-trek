from dotenv import load_dotenv
load_dotenv()
from flask import Flask
from config import Config
from models import db, migrate
from flask_cors import CORS
from flask_jwt_extended import JWTManager

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    app.url_map.strict_slashes = False
    db.init_app(app)
    migrate.init_app(app, db)
    CORS(app, 
         origins=Config.CORS_ORIGINS,
         methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
         allow_headers=['Content-Type', 'Authorization'],
         supports_credentials=True)
    
    # Initialize JWT
    jwt = JWTManager(app)

    @jwt.unauthorized_loader
    def missing_token(reason):
        app.logger.error(f"JWT missing/unauthorized: {reason}")
        return {"msg": reason}, 401

    @jwt.invalid_token_loader
    def invalid_token(reason):
        app.logger.error(f"JWT invalid: {reason}")
        return {"msg": reason}, 422

    @jwt.expired_token_loader
    def expired_token(jwt_header, jwt_data):
        app.logger.error("JWT expired")
        return {"msg": "Token has expired"}, 401

    @jwt.needs_fresh_token_loader
    def needs_fresh(jwt_header, jwt_data):
        app.logger.error("JWT not fresh")
        return {"msg": "Fresh token required"}, 401

    # Register routes
    from routes.auth import auth_bp
    from routes.bookings import bookings_bp
    from routes.trekdates import trekdates_bp

    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(bookings_bp, url_prefix='/api/bookings')
    app.register_blueprint(trekdates_bp, url_prefix='/api/trekdates')

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(host='0.0.0.0', debug=True, port=Config.BACKEND_PORT)