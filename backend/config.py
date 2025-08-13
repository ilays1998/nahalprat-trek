import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Config:
    # Server Configuration - Change port here
    BACKEND_PORT = int(os.environ.get("BACKEND_PORT", "5001"))
    FRONTEND_PORT = int(os.environ.get("FRONTEND_PORT", "3000"))

    # Prefer explicit URLs from env (e.g., on Render), then fallback to localhost ports
    BACKEND_URL = os.environ.get("BACKEND_URL") or os.environ.get("RENDER_EXTERNAL_URL") or f"http://localhost:{BACKEND_PORT}"
    FRONTEND_URL = os.environ.get("FRONTEND_URL") or f"http://localhost:{FRONTEND_PORT}"
    API_BASE_URL = f"{BACKEND_URL}/api"
    
    # Flask Configuration
    SECRET_KEY = os.environ.get("SECRET_KEY")
    SQLALCHEMY_DATABASE_URI = os.environ.get("SQLALCHEMY_DATABASE_URI")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    # Use separate secret for JWT for security isolation
    JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY")
    
    # OAuth Configuration
    GOOGLE_CLIENT_ID = os.environ.get("GOOGLE_CLIENT_ID")
    GOOGLE_CLIENT_SECRET = os.environ.get("GOOGLE_CLIENT_SECRET")
    ADMIN_EMAIL = os.environ.get("ADMIN_EMAIL")

    # CORS configuration
    CORS_ORIGINS = [origin.strip() for origin in os.environ.get("CORS_ORIGINS", "").split(",") if origin.strip()] or [FRONTEND_URL]