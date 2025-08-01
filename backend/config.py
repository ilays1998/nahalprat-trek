import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Config:
    # Server Configuration - Change port here
    BACKEND_PORT = int(os.environ.get("BACKEND_PORT", "5001"))
    FRONTEND_PORT = int(os.environ.get("FRONTEND_PORT", "3000"))
    
    # URLs based on ports
    BACKEND_URL = f"http://localhost:{BACKEND_PORT}"
    FRONTEND_URL = f"http://localhost:{FRONTEND_PORT}"
    API_BASE_URL = f"{BACKEND_URL}/api"
    
    # Flask Configuration
    SECRET_KEY = os.environ.get("SECRET_KEY")
    SQLALCHEMY_DATABASE_URI = os.environ.get("SQLALCHEMY_DATABASE_URI")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    # Use the same secret for both Flask and JWT to ensure compatibility
    JWT_SECRET_KEY = SECRET_KEY
    
    # OAuth Configuration
    GOOGLE_CLIENT_ID = os.environ.get("GOOGLE_CLIENT_ID")
    GOOGLE_CLIENT_SECRET = os.environ.get("GOOGLE_CLIENT_SECRET")
    ADMIN_EMAIL = os.environ.get("ADMIN_EMAIL")