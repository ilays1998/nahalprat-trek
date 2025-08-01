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
    db.init_app(app)
    migrate.init_app(app, db)
    CORS(app, supports_credentials=True)
    
    # Initialize JWT
    jwt = JWTManager(app)

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
    app.run(debug=True, port=Config.BACKEND_PORT)