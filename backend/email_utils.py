import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
import logging
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
        
        if not self.smtp_username or not self.smtp_password:
            logger.error("SMTP credentials not configured")
    
    def _send_email(self, to_email: str, subject: str, body: str, html_body: Optional[str] = None) -> bool:
        """Base method for sending emails"""
        try:
            if not self.smtp_username or not self.smtp_password:
                logger.error("Email service not configured")
                return False
            
            msg = MIMEMultipart('alternative')
            msg['From'] = self.smtp_username
            msg['To'] = to_email
            msg['Subject'] = subject
            
            # Add plain text part
            msg.attach(MIMEText(body, 'plain'))
            
            # Add HTML part if provided
            if html_body:
                msg.attach(MIMEText(html_body, 'html'))
            
            # Send email
            server = smtplib.SMTP(self.smtp_server, self.smtp_port)
            server.starttls()
            server.login(self.smtp_username, self.smtp_password)
            text = msg.as_string()
            server.sendmail(self.smtp_username, to_email, text)
            server.quit()
            
            logger.info(f"Email sent successfully to {to_email}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to send email to {to_email}: {str(e)}")
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

# Create a singleton instance
email_service = EmailService()