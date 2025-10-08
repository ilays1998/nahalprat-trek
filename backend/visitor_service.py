"""
Visitor tracking service using cookies
Tracks both anonymous and authenticated visitors
"""
from flask import request, make_response
from models import db, Visitor
from utils import get_ip_info
from datetime import datetime, timedelta
import uuid

VISITOR_COOKIE_NAME = 'visitor_id'
VISITOR_COOKIE_MAX_AGE = 365 * 24 * 60 * 60  # 1 year in seconds
DUPLICATE_THRESHOLD_MINUTES = 5  # Consider same IP within 5 minutes as same visitor

def get_or_create_visitor_id():
    """
    Get visitor_id from cookie or find existing visitor by IP/timeframe
    This prevents duplicate visitor creation during rapid requests
    """
    # First, try to get from cookie
    visitor_id = request.cookies.get(VISITOR_COOKIE_NAME)
    
    if visitor_id:
        # Validate that this visitor ID exists in database
        existing_visitor = Visitor.query.filter_by(visitor_id=visitor_id).first()
        if existing_visitor:
            return visitor_id
    
    # No valid cookie found, check for recent visitor with same IP
    ip_address = get_client_ip()
    recent_threshold = datetime.utcnow() - timedelta(minutes=DUPLICATE_THRESHOLD_MINUTES)
    
    recent_visitor = Visitor.query.filter(
        Visitor.ip_address == ip_address,
        Visitor.first_visit >= recent_threshold
    ).order_by(Visitor.first_visit.desc()).first()
    
    if recent_visitor:
        # Reuse existing recent visitor
        return recent_visitor.visitor_id
    
    # Generate new UUID for genuinely new visitor
    return str(uuid.uuid4())

def get_client_ip():
    """Extract client IP address handling proxies properly"""
    if request.headers.get('X-Forwarded-For'):
        ip_address = request.headers.get('X-Forwarded-For').split(',')[0].strip()
    elif request.headers.get('X-Real-IP'):
        ip_address = request.headers.get('X-Real-IP')
    else:
        ip_address = request.remote_addr or 'unknown'
    
    return ip_address

def get_request_info():
    """Extract request information for visitor tracking"""
    ip_address = get_client_ip()
    
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
    Track visitor activity with robust duplicate prevention
    
    Args:
        user_id: Optional user_id if visitor is authenticated
    
    Returns:
        visitor_id: The visitor's UUID
    """
    from flask import g
    visitor_id = getattr(g, 'visitor_id', None)
    
    if not visitor_id:
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
            
            # Update user_id if user logged in and not already set
            if user_id and not visitor.user_id:
                visitor.user_id = user_id
                print(f"Updated visitor {visitor_id} with user_id {user_id}")
        else:
            # Double-check for duplicates before creating new visitor
            # This prevents race conditions during rapid requests
            recent_threshold = datetime.utcnow() - timedelta(minutes=DUPLICATE_THRESHOLD_MINUTES)
            duplicate_visitor = Visitor.query.filter(
                Visitor.ip_address == request_info['ip_address'],
                Visitor.first_visit >= recent_threshold,
                Visitor.user_agent == request_info['user_agent'][:512]
            ).first()
            
            if duplicate_visitor:
                # Use existing visitor instead of creating new one
                print(f"Found duplicate visitor for IP {request_info['ip_address']}, using existing visitor_id: {duplicate_visitor.visitor_id}")
                visitor_id = duplicate_visitor.visitor_id
                visitor = duplicate_visitor
                visitor.last_visit = datetime.utcnow()
                visitor.visit_count += 1
                
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
                print(f"Created new visitor {visitor_id} for IP {request_info['ip_address']}")
        
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

def merge_duplicate_visitors(dry_run=True):
    """
    Merge duplicate visitors based on IP address and timeframe
    
    Args:
        dry_run: If True, only report what would be merged without making changes
    
    Returns:
        dict: Statistics about duplicates found and merged
    """
    duplicates_found = 0
    duplicates_merged = 0
    
    try:
        # Find visitors with same IP within the threshold timeframe
        threshold = timedelta(minutes=DUPLICATE_THRESHOLD_MINUTES)
        
        # Group visitors by IP address
        ip_groups = db.session.query(Visitor.ip_address).group_by(Visitor.ip_address).having(
            db.func.count(Visitor.id) > 1
        ).all()
        
        for (ip_address,) in ip_groups:
            # Get all visitors for this IP, ordered by first_visit
            visitors = Visitor.query.filter_by(ip_address=ip_address).order_by(
                Visitor.first_visit.asc()
            ).all()
            
            # Group visitors that are within threshold of each other
            groups = []
            current_group = [visitors[0]]
            
            for visitor in visitors[1:]:
                # If this visitor is within threshold of the last in current group
                time_diff = visitor.first_visit - current_group[-1].first_visit
                if time_diff <= threshold:
                    current_group.append(visitor)
                else:
                    # Start new group
                    if len(current_group) > 1:
                        groups.append(current_group)
                    current_group = [visitor]
            
            # Add the last group if it has duplicates
            if len(current_group) > 1:
                groups.append(current_group)
            
            # Merge duplicates in each group
            for group in groups:
                if len(group) > 1:
                    duplicates_found += len(group) - 1
                    
                    if not dry_run:
                        # Keep the earliest visitor, merge data from others
                        primary_visitor = group[0]
                        
                        total_visits = sum(v.visit_count for v in group)
                        latest_visit = max(v.last_visit for v in group)
                        
                        # Update primary visitor with merged data
                        primary_visitor.visit_count = total_visits
                        primary_visitor.last_visit = latest_visit
                        
                        # If any visitor has user_id, use it
                        for visitor in group:
                            if visitor.user_id and not primary_visitor.user_id:
                                primary_visitor.user_id = visitor.user_id
                                break
                        
                        # Delete duplicate visitors
                        for visitor in group[1:]:
                            db.session.delete(visitor)
                            duplicates_merged += 1
        
        if not dry_run:
            db.session.commit()
            
        return {
            'duplicates_found': duplicates_found,
            'duplicates_merged': duplicates_merged,
            'dry_run': dry_run
        }
        
    except Exception as e:
        db.session.rollback()
        print(f"Error merging duplicate visitors: {e}")
        return {'error': str(e)}
