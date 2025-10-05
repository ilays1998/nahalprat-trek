from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, verify_jwt_in_request
import os
import logging
from email_utils import email_service

contact_bp = Blueprint('contact', __name__)
logger = logging.getLogger(__name__)

@contact_bp.route('/contact', methods=['POST'])
def send_contact_email():
    """Send contact form submission via email"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['name', 'email', 'message']
        for field in required_fields:
            if not data.get(field) or not data[field].strip():
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        # Validate email format
        import re
        email_pattern = r'^[^\s@]+@[^\s@]+\.[^\s@]+$'
        if not re.match(email_pattern, data['email']):
            return jsonify({'error': 'Invalid email format'}), 400
        
        # Prepare email content
        name = data['name'].strip()
        email = data['email'].strip()
        phone = data.get('phone', '').strip()
        subject = data.get('subject', '').strip()
        message = data['message'].strip()
        
        # Get recipient email for admin notifications  
        recipient_email = os.getenv('CONTACT_EMAIL', 'treknahalprat@gmail.com')
        
        # Email body for admin notification
        body = f"""
New contact form submission from Nahal Prat Trek website:

Name: {name}
Email: {email}
Phone: {phone if phone else 'Not provided'}
Subject: {subject if subject else 'Not provided'}

Message:
{message}

---
This email was sent from the contact form on the Nahal Prat Trek website.
Reply to: {email}
        """
        
        # Send email to admin using the centralized email service
        try:
            admin_sent = email_service._send_email(
                recipient_email, 
                f"Contact Form: {subject}" if subject else f"Contact Form from {name}",
                body
            )
            
            if not admin_sent:
                logger.error(f"Failed to send contact form email to admin from {email}")
                return jsonify({'error': 'Failed to send email'}), 500
            
            logger.info(f"Contact form email sent successfully from {email}")
            
            # Send confirmation email to sender using email service
            confirmation_sent = email_service.send_contact_confirmation(email, name)
            
            if confirmation_sent:
                return jsonify({'message': 'Email sent successfully and confirmation sent to sender'}), 200
            else:
                return jsonify({'message': 'Email sent successfully but confirmation email failed'}), 200
            
        except Exception as e:
            logger.error(f"Email sending error: {str(e)}")
            return jsonify({'error': 'Failed to send email'}), 500
            
    except Exception as e:
        logger.error(f"Contact form error: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500