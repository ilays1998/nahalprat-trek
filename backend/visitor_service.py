"""
Visitor tracking service using cookies
Tracks both anonymous and authenticated visitors
"""
from flask import request, make_response
from models import db, Visitor
from utils import get_ip_info
from datetime import datetime
import uuid

VISITOR_COOKIE_NAME = 'visitor_id'
VISITOR_COOKIE_MAX_AGE = 365 * 24 * 60 * 60  # 1 year in seconds

def get_or_create_visitor_id():
    """Get visitor_id from cookie or generate a new one"""
    visitor_id = request.cookies.get(VISITOR_COOKIE_NAME)
    
    if not visitor_id:
        # Generate new UUID for new visitor
        visitor_id = str(uuid.uuid4())
    
    return visitor_id

def get_request_info():
    """Extract request information for visitor tracking"""
    # Get IP address (handle proxies)
    if request.headers.get('X-Forwarded-For'):
        ip_address = request.headers.get('X-Forwarded-For').split(',')[0].strip()
    else:
        ip_address = request.remote_addr or 'unknown'
    
    print(f"Captured IP address: {ip_address}")
    
    user_agent = request.headers.get('User-Agent', '')[:512]
    referrer = request.headers.get('Referer', '')[:512]
    
    return {
        'ip_address': ip_address,
        'user_agent': user_agent,
        'referrer': referrer
    }

def track_visitor(user_id=None):
    """
    Track visitor activity
    
    Args:
        user_id: Optional user_id if visitor is authenticated
    
    Returns:
        visitor_id: The visitor's UUID
    """
    visitor_id = get_or_create_visitor_id()
    request_info = get_request_info()
    
    try:
        # Find existing visitor or create new one
        visitor = Visitor.query.filter_by(visitor_id=visitor_id).first()
        
        if visitor:
            # Update existing visitor
            visitor.last_visit = datetime.utcnow()
            visitor.visit_count += 1
            visitor.ip_address = request_info['ip_address']
            
            # Update user_id if user logged in
            if user_id and not visitor.user_id:
                visitor.user_id = user_id
        else:
            # Create new visitor record
            ip_info = get_ip_info(request_info['ip_address'])
            
            visitor = Visitor(
                visitor_id=visitor_id,
                user_id=user_id,
                ip_address=request_info['ip_address'],
                user_agent=request_info['user_agent'],
                referrer=request_info['referrer'],
                region=ip_info.get('region') if ip_info else None,
                country=ip_info.get('country') if ip_info else None,
                city=ip_info.get('city') if ip_info else None,
                visit_count=1
            )
            db.session.add(visitor)
        
        db.session.commit()
        return visitor_id
        
    except Exception as e:
        db.session.rollback()
        print(f"Error tracking visitor: {e}")
        return visitor_id

def set_visitor_cookie(response, visitor_id):
    """
    Set visitor cookie on response
    
    Args:
        response: Flask response object
        visitor_id: UUID to set as cookie value
    """
    response.set_cookie(
        VISITOR_COOKIE_NAME,
        visitor_id,
        max_age=VISITOR_COOKIE_MAX_AGE,
        httponly=True,
        secure=False,  # Set to True in production with HTTPS
        samesite='Lax'
    )
    return response

def get_visitor_stats(visitor_id):
    """Get statistics for a specific visitor"""
    visitor = Visitor.query.filter_by(visitor_id=visitor_id).first()
    if visitor:
        return {
            'visitor_id': visitor.visitor_id,
            'first_visit': visitor.first_visit.isoformat() if visitor.first_visit else None,
            'last_visit': visitor.last_visit.isoformat() if visitor.last_visit else None,
            'visit_count': visitor.visit_count,
            'is_authenticated': visitor.user_id is not None
        }
    return None
