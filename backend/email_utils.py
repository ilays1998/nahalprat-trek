import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
import logging
import time
import socket
from typing import Dict, Any, Optional

logger = logging.getLogger(__name__)

class EmailService:
    """Centralized email service for all application notifications"""
    
    def __init__(self):
        self.smtp_server = os.getenv('SMTP_SERVER', 'smtp.gmail.com')
        self.smtp_port = int(os.getenv('SMTP_PORT', '587'))
        self.smtp_username = os.getenv('SMTP_USERNAME')
        self.smtp_password = os.getenv('SMTP_PASSWORD')
        self.contact_email = os.getenv('CONTACT_EMAIL', 'treknahalprat@gmail.com')
        self.timeout = 10  # 10 second timeout for SMTP connections
        self.max_retries = 1  # Maximum retry attempts
        
        if not self.smtp_username or not self.smtp_password:
            logger.error("SMTP credentials not configured")
    
    def test_connection(self) -> bool:
        """Test SMTP connection without sending an email"""
        if not self.smtp_username or not self.smtp_password:
            logger.error("Cannot test connection - SMTP credentials not configured")
            return False
            
        try:
            server = smtplib.SMTP(self.smtp_server, self.smtp_port, timeout=self.timeout)
            server.starttls()
            server.login(self.smtp_username, self.smtp_password)
            server.quit()
            logger.info("SMTP connection test successful")
            return True
        except Exception as e:
            logger.error(f"SMTP connection test failed: {str(e)}")
            return False
    
    def _send_email(self, to_email: str, subject: str, body: str, html_body: Optional[str] = None) -> bool:
        """Base method for sending emails with timeout and retry logic"""
        if not self.smtp_username or not self.smtp_password:
            logger.error("Email service not configured")
            return False
        
        # Prepare message
        msg = MIMEMultipart('alternative')
        msg['From'] = self.smtp_username
        msg['To'] = to_email
        msg['Subject'] = subject
        
        # Add plain text part
        msg.attach(MIMEText(body, 'plain'))
        
        # Add HTML part if provided
        if html_body:
            msg.attach(MIMEText(html_body, 'html'))
        
        # Retry logic
        for attempt in range(self.max_retries + 1):
            try:
                logger.info(f"Attempting to send email to {to_email} (attempt {attempt + 1}/{self.max_retries + 1})")
                
                # Create server connection with timeout
                server = smtplib.SMTP(self.smtp_server, self.smtp_port, timeout=self.timeout)
                
                # Enable debug logging for the first attempt
                if attempt == 0:
                    server.set_debuglevel(0)  # Set to 1 for verbose debugging
                
                # Start TLS with timeout
                server.starttls()
                
                # Login with credentials
                server.login(self.smtp_username, self.smtp_password)
                
                # Send email
                text = msg.as_string()
                server.sendmail(self.smtp_username, to_email, text)
                server.quit()
                
                logger.info(f"Email sent successfully to {to_email} on attempt {attempt + 1}")
                return True
                
            except socket.timeout:
                logger.warning(f"SMTP connection timeout on attempt {attempt + 1} for {to_email}")
            except socket.gaierror as e:
                logger.error(f"DNS resolution failed for SMTP server: {str(e)}")
                break  # Don't retry DNS failures
            except smtplib.SMTPAuthenticationError as e:
                logger.error(f"SMTP authentication failed: {str(e)}")
                break  # Don't retry auth failures
            except smtplib.SMTPConnectError as e:
                logger.warning(f"SMTP connection failed on attempt {attempt + 1}: {str(e)}")
            except smtplib.SMTPException as e:
                logger.warning(f"SMTP error on attempt {attempt + 1}: {str(e)}")
            except Exception as e:
                logger.error(f"Unexpected error sending email on attempt {attempt + 1}: {str(e)}")
            
            # Wait before retry (exponential backoff)
            if attempt < self.max_retries:
                wait_time = 2 ** attempt  # 1s, 2s, 4s...
                logger.info(f"Waiting {wait_time} seconds before retry...")
                time.sleep(wait_time)
        
        logger.error(f"Failed to send email to {to_email} after {self.max_retries + 1} attempts")
        return False
    
    def send_contact_confirmation(self, sender_email: str, sender_name: str) -> bool:
        """Send confirmation email for contact form submissions"""
        subject = "Thank you for contacting Nahal Prat Trek"
        
        body = f"""
Dear {sender_name},

Thank you for contacting Nahal Prat Trek! We have received your message and will get back to you as soon as possible.

Our team typically responds within 24 hours during business days. If you have any additional questions or need to provide more information, feel free to reply directly to this email.

We appreciate your interest in our trekking experiences and look forward to helping you plan your adventure!

Best regards,
The Nahal Prat Trek Team

---
This is an automated confirmation email, but you can reply directly to this message and we will receive it.
        """
        
        return self._send_email(sender_email, subject, body)
    
    def send_booking_confirmation(self, booking_data: Dict[str, Any]) -> bool:
        """Send booking confirmation email to customer"""
        customer_email = booking_data['email']
        customer_name = f"{booking_data['first_name']} {booking_data['last_name']}"
        
        subject = "Booking Confirmation - Nahal Prat Trek"
        
        body = f"""
Dear {customer_name},

Thank you for booking your trek with Nahal Prat Trek! We have received your booking request and are processing it now.

BOOKING DETAILS:
----------------
Name: {customer_name}
Email: {customer_email}
Phone: {booking_data.get('phone', 'N/A')}
Package: {booking_data['package_type'].title()}
Trek Date: {booking_data['trek_date']}
Number of Participants: {booking_data['participants_count']}
Total Price: ₪{booking_data['total_price']:,}

{f"Special Requests: {booking_data['special_requests']}" if booking_data.get('special_requests') else ""}

NEXT STEPS:
-----------
• Our team will review your booking within 24 hours
• You will receive a confirmation email once your booking is approved
• Payment instructions will be provided upon confirmation

If you have any questions or need to make changes to your booking, please reply to this email or contact us directly.

We're excited to have you join us for an amazing adventure in Nahal Prat!

Best regards,
The Nahal Prat Trek Team

---
Booking ID: This will be provided once your booking is confirmed
        """
        
        return self._send_email(customer_email, subject, body)
    
    def send_booking_approval(self, booking_data: Dict[str, Any], booking_id: int) -> bool:
        """Send booking approval email to customer"""
        customer_email = booking_data['email']
        customer_name = f"{booking_data['first_name']} {booking_data['last_name']}"
        
        subject = "Booking Approved - Nahal Prat Trek"
        
        body = f"""
Dear {customer_name},

Great news! Your booking for Nahal Prat Trek has been APPROVED and confirmed.

CONFIRMED BOOKING DETAILS:
--------------------------
Booking ID: #{booking_id}
Name: {customer_name}
Package: {booking_data['package_type'].title()}
Trek Date: {booking_data['trek_date']}
Number of Participants: {booking_data['participants_count']}
Total Price: ₪{booking_data['total_price']:,}

PAYMENT INFORMATION:
--------------------
Please complete your payment by transferring the total amount to:
• Bank Account: [Account details will be provided separately]
• Payment deadline: [Date will be provided]

WHAT TO BRING:
--------------
• Comfortable hiking shoes
• Weather-appropriate clothing
• Water bottle
• Sunscreen and hat
• Camera for those amazing views!

MEETING POINT:
--------------
Detailed meeting point and timing information will be sent 3 days before your trek date.

If you have any questions or need to make any changes, please contact us as soon as possible.

We can't wait to share this incredible experience with you!

Best regards,
The Nahal Prat Trek Team

Contact: {self.contact_email}
        """
        
        return self._send_email(customer_email, subject, body)
    
    def send_booking_cancellation(self, booking_data: Dict[str, Any], booking_id: int, reason: str = "") -> bool:
        """Send booking cancellation email to customer"""
        customer_email = booking_data['email']
        customer_name = f"{booking_data['first_name']} {booking_data['last_name']}"
        
        subject = "Booking Cancelled - Nahal Prat Trek"
        
        body = f"""
Dear {customer_name},

We regret to inform you that your booking for Nahal Prat Trek has been cancelled.

CANCELLED BOOKING DETAILS:
--------------------------
Booking ID: #{booking_id}
Name: {customer_name}
Package: {booking_data['package_type'].title()}
Trek Date: {booking_data['trek_date']}
Number of Participants: {booking_data['participants_count']}

{f"Reason for Cancellation: {reason}" if reason else ""}

REFUND INFORMATION:
-------------------
If you have already made a payment, we will process your refund according to our cancellation policy. Our team will contact you separately regarding the refund process.

We sincerely apologize for any inconvenience this may cause. If you would like to reschedule for another date, please don't hesitate to contact us and we'll do our best to accommodate you.

If you have any questions or concerns, please reply to this email or contact us directly.

Best regards,
The Nahal Prat Trek Team

Contact: {self.contact_email}
        """
        
        return self._send_email(customer_email, subject, body)
    
    def send_admin_booking_notification(self, booking_data: Dict[str, Any]) -> bool:
        """Send new booking notification to admin"""
        subject = f"New Booking Request - {booking_data['first_name']} {booking_data['last_name']}"
        
        body = f"""
New booking request received from Nahal Prat Trek website:

CUSTOMER DETAILS:
-----------------
Name: {booking_data['first_name']} {booking_data['last_name']}
Email: {booking_data['email']}
Phone: {booking_data.get('phone', 'N/A')}

BOOKING DETAILS:
----------------
Package: {booking_data['package_type'].title()}
Trek Date: {booking_data['trek_date']}
Number of Participants: {booking_data['participants_count']}
Total Price: ₪{booking_data['total_price']:,}

Emergency Contact: {booking_data.get('emergency_contact_name', 'N/A')} - {booking_data.get('emergency_contact_phone', 'N/A')}

{f"Special Requests: {booking_data['special_requests']}" if booking_data.get('special_requests') else "No special requests"}

ACTION REQUIRED:
----------------
Please review this booking request in the admin panel and approve or decline it.

---
This email was sent automatically from the Nahal Prat Trek booking system.
        """
        
        return self._send_email(self.contact_email, subject, body)

    def send_email_verification(self, user_email: str, user_name: str, verification_token: str) -> bool:
        """Send email verification link to new user"""
        from config import Config
        
        verification_url = f"{Config.FRONTEND_URL}/verify-email?token={verification_token}"
        
        subject = "Verify Your Email - Nahal Prat Trek"
        
        body = f"""
Welcome to Nahal Prat Trek, {user_name}!

Thank you for creating an account with us. To complete your registration and access all features, please verify your email address by clicking the link below:

{verification_url}

This verification link will expire in 24 hours. If you didn't create an account with us, please ignore this email.

Once your email is verified, you'll be able to:
• Book trekking experiences
• Manage your bookings
• Receive important updates about your adventures

If you have any questions or need assistance, feel free to contact us.

Best regards,
The Nahal Prat Trek Team

Contact: {self.contact_email}

---
If the link above doesn't work, copy and paste this URL into your browser:
{verification_url}
        """
        
        html_body = f"""
        <html>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #B45309;">Welcome to Nahal Prat Trek!</h1>
            </div>
            
            <p>Hi {user_name},</p>
            
            <p>Thank you for creating an account with us. To complete your registration and access all features, please verify your email address by clicking the button below:</p>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="{verification_url}" 
                   style="background-color: #B45309; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
                    Verify Email Address
                </a>
            </div>
            
            <p><strong>This verification link will expire in 24 hours.</strong></p>
            
            <p>Once your email is verified, you'll be able to:</p>
            <ul>
                <li>Book trekking experiences</li>
                <li>Manage your bookings</li>
                <li>Receive important updates about your adventures</li>
            </ul>
            
            <p>If you didn't create an account with us, please ignore this email.</p>
            
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
            
            <p style="font-size: 12px; color: #666;">
                If the button above doesn't work, copy and paste this link into your browser:<br>
                <a href="{verification_url}">{verification_url}</a>
            </p>
            
            <p style="font-size: 12px; color: #666;">
                Best regards,<br>
                The Nahal Prat Trek Team<br>
                Contact: {self.contact_email}
            </p>
        </body>
        </html>
        """
        
        return self._send_email(user_email, subject, body, html_body)

# Create a singleton instance
email_service = EmailService()