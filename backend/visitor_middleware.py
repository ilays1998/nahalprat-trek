"""
Visitor tracking middleware
Automatically tracks all visitors to the site
"""
from flask import request, g
from visitor_service import get_or_create_visitor_id, track_visitor, set_visitor_cookie

def init_visitor_tracking(app):
    """Initialize visitor tracking middleware"""
    
    @app.before_request
    def before_request_visitor_tracking():
        """Track visitor before each request"""
        # Skip tracking for static files and certain endpoints
        if request.path.startswith('/static/') or request.path == '/favicon.ico':
            return
        
        # Get or create visitor ID
        visitor_id = get_or_create_visitor_id()
        
        # Store in Flask's g object for access during request
        g.visitor_id = visitor_id
    
    @app.after_request
    def after_request_visitor_tracking(response):
        """Set visitor cookie and track visit after each request"""
        # Skip tracking for static files
        if request.path.startswith('/static/') or request.path == '/favicon.ico':
            return response
        
        # Only track on successful GET requests to avoid duplicate tracking
        if request.method == 'GET' and response.status_code < 400:
            visitor_id = getattr(g, 'visitor_id', None)
            
            if visitor_id:
                # Track the visitor (async in production)
                track_visitor()
                
                # Set the visitor cookie
                set_visitor_cookie(response, visitor_id)
        
        return response
