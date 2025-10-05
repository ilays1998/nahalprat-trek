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
        """Prepare visitor tracking before each request"""
        # Skip tracking for static files and certain endpoints
        if request.path.startswith('/static/') or request.path == '/favicon.ico':
            return
        
        # Get or create visitor ID (with improved duplicate prevention)
        visitor_id = get_or_create_visitor_id()
        
        # Store in Flask's g object for access during request
        g.visitor_id = visitor_id
    
    @app.after_request
    def after_request_visitor_tracking(response):
        """Set visitor cookie and track visit after each request"""
        # Skip tracking for static files
        if request.path.startswith('/static/') or request.path == '/favicon.ico':
            return response
        
        # Track on successful requests only
        if response.status_code < 400:
            visitor_id = getattr(g, 'visitor_id', None)
            
            if visitor_id:
                # Get user_id if user is authenticated
                from flask_jwt_extended import get_jwt_identity
                try:
                    user_id = get_jwt_identity()
                except:
                    user_id = None
                
                # Track the visitor with improved duplicate handling
                actual_visitor_id = track_visitor(user_id)
                
                # Update g.visitor_id in case it was changed due to duplicate merging
                g.visitor_id = actual_visitor_id
                
                # Set the visitor cookie with the actual visitor ID
                set_visitor_cookie(response, actual_visitor_id)
        
        return response
