import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Config:
    # Server Configuration - Change port here
    # Use Render's PORT env var if available, otherwise use BACKEND_PORT, fallback to 5001
    BACKEND_PORT = int(os.environ.get("PORT") or os.environ.get("BACKEND_PORT", "5001"))
    FRONTEND_PORT = int(os.environ.get("FRONTEND_PORT", "3000"))

    # Prefer explicit URLs from env (e.g., on Render), then fallback to localhost ports
    # Get the host IP from environment or default to 0.0.0.0 to listen on all interfaces
    BACKEND_HOST = os.environ.get("BACKEND_HOST", "0.0.0.0")
    BACKEND_URL = os.environ.get("BACKEND_URL") or os.environ.get("RENDER_EXTERNAL_URL") or f"http://{BACKEND_HOST}:{BACKEND_PORT}"
    # Prefer explicit FRONTEND_URL, otherwise allow constructing from FRONTEND_HOST (e.g., from Render blueprint),
    # else fall back to localhost port
    _frontend_host = os.environ.get("FRONTEND_HOST")
    FRONTEND_URL = (
        os.environ.get("FRONTEND_URL")
        or (f"https://{_frontend_host}" if _frontend_host else None)
        or f"http://localhost:{FRONTEND_PORT}"
    )
    API_BASE_URL = f"{BACKEND_URL}/api"
    
    # Flask Configuration
    SECRET_KEY = os.environ.get("SECRET_KEY")
    SQLALCHEMY_DATABASE_URI = os.environ.get("SQLALCHEMY_DATABASE_URI")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    # Use separate secret for JWT for security isolation
    JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY")
    
    # JWT Cookie Configuration
    JWT_TOKEN_LOCATION = ['cookies']
    # Auto-detect production: if using HTTPS URLs, enable secure cookies
    _is_production = BACKEND_URL.startswith('https://') or FRONTEND_URL.startswith('https://')
    JWT_COOKIE_SECURE = _is_production  # True in production with HTTPS
    JWT_COOKIE_CSRF_PROTECT = False  # Disable CSRF for simplicity; enable in production if needed
    JWT_COOKIE_SAMESITE = 'None' if _is_production else 'Lax'  # 'None' for cross-origin in production
    JWT_ACCESS_COOKIE_NAME = 'access_token_cookie'
    JWT_ACCESS_COOKIE_PATH = '/'
    # Cookie domain - Use env var for cross-subdomain sharing, fallback to None for same-domain
    JWT_COOKIE_DOMAIN = os.environ.get("JWT_COOKIE_DOMAIN")
    
    # OAuth Configuration
    GOOGLE_CLIENT_ID = os.environ.get("GOOGLE_CLIENT_ID")
    GOOGLE_CLIENT_SECRET = os.environ.get("GOOGLE_CLIENT_SECRET")
    # OAuth Redirect URI - configurable for different environments
    OAUTH_REDIRECT_URI = os.environ.get("OAUTH_REDIRECT_URI") or f"{API_BASE_URL}/auth/authorize"
    ADMIN_EMAIL = os.environ.get("ADMIN_EMAIL")

    # CORS configuration
    CORS_ORIGINS = [origin.strip() for origin in os.environ.get("CORS_ORIGINS", "").split(",") if origin.strip()] or [FRONTEND_URL]
    
    # IP Geolocation Configuration
    IPGEOLOCATION_API_KEY = os.environ.get("IPGEOLOCATION_API_KEY")