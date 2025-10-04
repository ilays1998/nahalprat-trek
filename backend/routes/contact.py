from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
import logging
from email_utils import email_service

contact_bp = Blueprint('contact', __name__)
logger = logging.getLogger(__name__)

@contact_bp.route('/contact', methods=['POST'])
@jwt_required()
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
        
        # Get email configuration from environment variables
        smtp_server = os.getenv('SMTP_SERVER', 'smtp.gmail.com')
        smtp_port = int(os.getenv('SMTP_PORT', '587'))
        smtp_username = os.getenv('SMTP_USERNAME')
        smtp_password = os.getenv('SMTP_PASSWORD')
        recipient_email = os.getenv('CONTACT_EMAIL', 'treknahalprat@gmail.com')
        
        if not smtp_username or not smtp_password:
            logger.error("SMTP credentials not configured")
            return jsonify({'error': 'Email service not configured'}), 500
        
        # Create email message
        msg = MIMEMultipart()
        msg['From'] = smtp_username
        msg['To'] = recipient_email
        msg['Subject'] = f"Contact Form: {subject}" if subject else f"Contact Form from {name}"
        
        # Email body
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
        
        msg.attach(MIMEText(body, 'plain'))
        
        # Send email to admin
        try:
            server = smtplib.SMTP(smtp_server, smtp_port)
            server.starttls()
            server.login(smtp_username, smtp_password)
            text = msg.as_string()
            server.sendmail(smtp_username, recipient_email, text)
            server.quit()
            
            logger.info(f"Contact form email sent successfully from {email}")
            
            # Send confirmation email to sender using email service
            confirmation_sent = email_service.send_contact_confirmation(email, name)
            
            if confirmation_sent:
                return jsonify({'message': 'Email sent successfully and confirmation sent to sender'}), 200
            else:
                return jsonify({'message': 'Email sent successfully but confirmation email failed'}), 200
            
        except smtplib.SMTPException as e:
            logger.error(f"SMTP error: {str(e)}")
            return jsonify({'error': 'Failed to send email'}), 500
        except Exception as e:
            logger.error(f"Email sending error: {str(e)}")
            return jsonify({'error': 'Failed to send email'}), 500
            
    except Exception as e:
        logger.error(f"Contact form error: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500