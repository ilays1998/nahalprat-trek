from dotenv import load_dotenv
load_dotenv()
from flask import Flask
from config import Config
from models import db, migrate
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from apscheduler.schedulers.background import BackgroundScheduler


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
         supports_credentials=True,
         expose_headers=['Set-Cookie'])
    
    # Initialize JWT
    jwt = JWTManager(app)

    @jwt.unauthorized_loader
    def missing_token(reason):
        app.logger.info(f"JWT missing/unauthorized: {reason}")
        return {"msg": "Missing or invalid token"}, 401

    @jwt.invalid_token_loader
    def invalid_token(reason):
        app.logger.info(f"JWT invalid: {reason}")
        return {"msg": "Invalid token"}, 401

    @jwt.expired_token_loader
    def expired_token(jwt_header, jwt_data):
        app.logger.info("JWT expired")
        return {"msg": "Token has expired"}, 401

    @jwt.needs_fresh_token_loader
    def needs_fresh(jwt_header, jwt_data):
        app.logger.info("JWT not fresh")
        return {"msg": "Fresh token required"}, 401

    # Initialize visitor tracking middleware
    from visitor_middleware import init_visitor_tracking
    init_visitor_tracking(app)

    # Register routes
    from routes.auth import auth_bp
    from routes.bookings import bookings_bp
    from routes.trekdates import trekdates_bp
    from routes.contact import contact_bp
    from routes.packages import packages_bp
    
    app.register_blueprint(packages_bp, url_prefix="/api/packages")
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(bookings_bp, url_prefix='/api/bookings')
    app.register_blueprint(trekdates_bp, url_prefix='/api/trekdates')
    app.register_blueprint(contact_bp, url_prefix='/api')

    
    # 🕒 Schedule daily job: cancel expired pending bookings
    from scripts.update_expired_orders import cancel_expired_pending_bookings
    from datetime import datetime

    scheduler = BackgroundScheduler(daemon=True)

    def run_safely():
        """Run the cancel task inside app context with proper logging"""
        with app.app_context():
            app.logger.info(f"[CRON] Running cancel_expired_pending_bookings at {datetime.now()}")
            try:
                cancel_expired_pending_bookings()
                app.logger.info("[CRON] cancel_expired_pending_bookings completed successfully.")
            except Exception as e:
                app.logger.error(f"[CRON] Error running cancel_expired_pending_bookings: {e}")

    # Run once a day at 3:00 AM server time
    scheduler.add_job(run_safely, 'cron', hour=3, minute=0)
    scheduler.start()
    app.logger.info("[CRON] APScheduler started (runs daily at 03:00).")


    return app

if __name__ == "__main__":
    import os
    app = create_app()
    # Use Render's PORT environment variable, fallback to Config.BACKEND_PORT for local development
    port = int(os.environ.get("PORT", Config.BACKEND_PORT))
    app.run(host='0.0.0.0', debug=True, port=port)