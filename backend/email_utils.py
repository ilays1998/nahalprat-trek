import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
import logging
import time
import socket
import re
from typing import Dict, Any, Optional

logger = logging.getLogger(__name__)

def _build_bilingual_email(hebrew_title: str, english_title: str, 
                           hebrew_content: list, english_content: list,
                           footer_text: str = "") -> tuple[str, str]:
    """
    Build bilingual email content (Hebrew + English) in both plain text and HTML formats.
    Returns tuple of (plain_text_body, html_body).
    
    Args:
        hebrew_title: Hebrew email title
        english_title: English email title
        hebrew_content: List of content items (strings or dicts with 'type' and 'data')
        english_content: List of content items (strings or dicts with 'type' and 'data')
        footer_text: Optional footer text
    """
    # Build plain text
    plain_lines = ["An English version of this message follows the Hebrew one.", ""]
    
    # Hebrew plain text
    for item in hebrew_content:
        if isinstance(item, str):
            # Strip HTML tags from plain text (e.g., <br> -> newline)
            text_item = re.sub(r'<br\s*/?>', '\n', item)
            text_item = re.sub(r'<[^>]+>', '', text_item)
            plain_lines.append(text_item)
        elif isinstance(item, dict):
            if item.get('type') == 'list':
                plain_lines.append(item['title'])
                plain_lines.append("-" * len(item['title']))
                for list_item in item['items']:
                    plain_lines.append(f"• {list_item}")
            elif item.get('type') == 'details':
                plain_lines.append(item['title'])
                plain_lines.append("-" * len(item['title']))
                for key, value in item['details'].items():
                    if value:
                        plain_lines.append(f"{key}: {value}")
                    else:
                        plain_lines.append(key)
        plain_lines.append("")
    
    plain_lines.append("---")
    plain_lines.append("")
    
    # English plain text
    for item in english_content:
        if isinstance(item, str):
            # Strip HTML tags from plain text (e.g., <br> -> newline)
            text_item = re.sub(r'<br\s*/?>', '\n', item)
            text_item = re.sub(r'<[^>]+>', '', text_item)
            plain_lines.append(text_item)
        elif isinstance(item, dict):
            if item.get('type') == 'list':
                plain_lines.append(item['title'])
                plain_lines.append("-" * len(item['title']))
                for list_item in item['items']:
                    plain_lines.append(f"• {list_item}")
            elif item.get('type') == 'details':
                plain_lines.append(item['title'])
                plain_lines.append("-" * len(item['title']))
                for key, value in item['details'].items():
                    if value:
                        plain_lines.append(f"{key}: {value}")
                    else:
                        plain_lines.append(key)
        plain_lines.append("")
    
    if footer_text:
        plain_lines.append(footer_text)
    
    plain_text = "\n".join(plain_lines)
    
    # Build HTML
    html_parts = [f"""
        <html>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #B45309;">{hebrew_title}</h1>
                <h2 style="color: #B45309;">{english_title}</h2>
            </div>
            
            <p><strong>An English version of this message follows the Hebrew one.</strong></p>
            
            <div dir="rtl" style="text-align: right; border: 1px solid #ddd; padding: 15px; margin: 20px 0; background-color: #f9f9f9;">
"""]
    
    # Hebrew HTML
    for item in hebrew_content:
        if isinstance(item, str):
            # Keep HTML tags in HTML content
            html_parts.append(f"                <p>{item}</p>")
        elif isinstance(item, dict):
            if item.get('type') == 'list':
                html_parts.append(f"                <h3>{item['title']}</h3>")
                html_parts.append("                <ul>")
                for list_item in item['items']:
                    html_parts.append(f"                    <li>{list_item}</li>")
                html_parts.append("                </ul>")
            elif item.get('type') == 'details':
                html_parts.append(f"                <h3>{item['title']}</h3>")
                html_parts.append("                <p>")
                detail_lines = []
                for key, value in item['details'].items():
                    if value:
                        detail_lines.append(f"{key}: {value}")
                    else:
                        detail_lines.append(key)
                html_parts.append("<br>\n".join(f"                {line}" for line in detail_lines))
                html_parts.append("                </p>")
    
    html_parts.append("""            </div>
            
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
            
            <div style="text-align: left;">
""")
    
    # English HTML
    for item in english_content:
        if isinstance(item, str):
            # Keep HTML tags in HTML content
            html_parts.append(f"                <p>{item}</p>")
        elif isinstance(item, dict):
            if item.get('type') == 'list':
                html_parts.append(f"                <h3>{item['title']}</h3>")
                html_parts.append("                <ul>")
                for list_item in item['items']:
                    html_parts.append(f"                    <li>{list_item}</li>")
                html_parts.append("                </ul>")
            elif item.get('type') == 'details':
                html_parts.append(f"                <h3>{item['title']}</h3>")
                html_parts.append("                <p>")
                detail_lines = []
                for key, value in item['details'].items():
                    if value:
                        detail_lines.append(f"{key}: {value}")
                    else:
                        detail_lines.append(key)
                html_parts.append("<br>\n".join(f"                {line}" for line in detail_lines))
                html_parts.append("                </p>")
    
    if footer_text:
        html_parts.append(f"""            </div>
            
            <p style="font-size: 12px; color: #666; text-align: center;">
                {footer_text}
            </p>
""")
    else:
        html_parts.append("            </div>\n")
    
    html_parts.append("""        </body>
        </html>
        """)
    
    html_text = "\n".join(html_parts)
    
    return plain_text, html_text

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
        subject = "Thank you for contacting Nahal Prat Trek / תודה על פנייתך לטרק נחל פרת"
        
        hebrew_content = [
            f"שלום {sender_name},",
            "תודה על פנייתך לטרק נחל פרת! קיבלנו את הודעתך ונחזור אליך בהקדם האפשרי.",
            "הצוות שלנו בדרך כלל מגיב תוך 24 שעות. אם יש לך שאלות נוספות או שאתה מעוניין לספק מידע נוסף, אנא השב ישירות למייל הזה.",
            "אנחנו מעריכים את העניין שלך בחווית הטיול שלנו ומצפים לעזור לך לתכנן את ההרפתקה שלך!",
            "בברכה,<br>צוות טרק נחל פרת"
        ]
        
        english_content = [
            f"Dear {sender_name},",
            "Thank you for contacting Nahal Prat Trek! We have received your message and will get back to you as soon as possible.",
            "Our team typically responds within 24 hours during business days. If you have any additional questions or need to provide more information, feel free to reply directly to this email.",
            "We appreciate your interest in our trekking experiences and look forward to helping you plan your adventure!",
            "Best regards,<br>The Nahal Prat Trek Team"
        ]
        
        body, html_body = _build_bilingual_email(
            hebrew_title="תודה על פנייתך לטרק נחל פרת!",
            english_title="Thank you for contacting Nahal Prat Trek!",
            hebrew_content=hebrew_content,
            english_content=english_content,
            footer_text="This is an automated confirmation email, but you can reply directly to this message and we will receive it."
        )
        
        return self._send_email(sender_email, subject, body, html_body)
    
    def send_booking_confirmation(self, booking_data: Dict[str, Any]) -> bool:
        """Send booking confirmation email to customer"""
        customer_email = booking_data['email']
        customer_name = f"{booking_data['first_name']} {booking_data['last_name']}"
        advance_payment = 200 * booking_data['participants_count']
        
        subject = "Booking Request Received - Nahal Prat Trek / קיבלנו את ההזמנה שלך - טרק נחל פרת"
        
        hebrew_content = [
            f"שלום {customer_name},",
            "תודה על הזמנת הטיול שלך עם טרק נחל פרת!",
            "<strong>שימו לב זהו איננו אישור סופי.</strong> המקומות ישמרו עבורך למשך 48 שעות. יש לבצע את השלבים הבאים על מנת להבטיח את מקומך בטרק.",
            {
                'type': 'list',
                'title': 'השלבים הבאים:',
                'items': [
                    f"יש לשלם מקדמה של ₪{advance_payment:,} (200 ש\"ח למשתתף)",
                    "לאחר קבלת התשלום, ההזמנה תאושר תוך 48 שעות לכל היותר",
                    "תקבל אישור הזמנה במייל ובאתר"
                ]
            },
            {
                'type': 'details',
                'title': 'פרטי חשבון בנק להעברה:',
                'details': {
                    'עילי סופר': '',
                    'ONE ZERO בנק': '',
                    'מספר בנק': '18',
                    'מספר סניף': '001',
                    'מספר חשבון': '221926619'
                }
            },
            {
                'type': 'details',
                'title': 'פרטי ההזמנה:',
                'details': {
                    'שם': customer_name,
                    'אימייל': customer_email,
                    'טלפון': booking_data.get('phone', 'לא צוין'),
                    'חבילה': booking_data['package_type'].title(),
                    'תאריך הטיול': booking_data['trek_date'],
                    'מספר משתתפים': str(booking_data['participants_count']),
                    'מחיר כולל': f"₪{booking_data['total_price']:,}"
                }
            },
            f"בקשות מיוחדות: {booking_data['special_requests']}" if booking_data.get('special_requests') else None,
            "אם יש לך שאלות נוספות או שאתה מעוניין לבצע שינויים בהזמנה, אנא השב למייל הזה או פנה אלינו באמצעות האתר.",
            "אנחנו מצפים כבר לארח אותך אצלנו להרפתקה מדהימה בנחל פרת!",
            "בברכה,<br>צוות טרק נחל פרת"
        ]
        # Filter out None values
        hebrew_content = [item for item in hebrew_content if item is not None]
        
        english_content = [
            f"Dear {customer_name},",
            "Thank you for booking your trek with Nahal Prat Trek!",
            "Please note this is not a final confirmation. Your spots will be held for 48 hours. Please follow the next steps to secure your spots on the trek.",
            {
                'type': 'list',
                'title': 'NEXT STEPS:',
                'items': [
                    f"Please pay an advance payment of ₪{advance_payment:,} (200 NIS per participant)",
                    "After payment is received, your booking will be confirmed within 48 hours at most",
                    "You will receive booking confirmation via email and on the website"
                ]
            },
            {
                'type': 'details',
                'title': 'PAYMENT INFORMATION:',
                'details': {
                    'Name': 'Ilay Soffer',
                    'ONE ZERO': '',
                    'Bank Number': '18',
                    'Branch Number': '001',
                    'Account number': '221926619',
                    'IBAN Number': 'IL080180010000221926619',
                    'Swift Code': 'DIGIILIT'
                }
            },
            {
                'type': 'details',
                'title': 'BOOKING DETAILS:',
                'details': {
                    'Name': customer_name,
                    'Email': customer_email,
                    'Phone': booking_data.get('phone', 'N/A'),
                    'Package': booking_data['package_type'].title(),
                    'Trek Date': booking_data['trek_date'],
                    'Number of Participants': str(booking_data['participants_count']),
                    'Total Price': f"₪{booking_data['total_price']:,}"
                }
            },
            f"Special Requests: {booking_data['special_requests']}" if booking_data.get('special_requests') else None,
            "If you have any questions or need to make changes to your booking, please reply to this email or contact us through the website.",
            "We're excited to have you join us for an amazing adventure in Nahal Prat!",
            "Best regards,<br>The Nahal Prat Trek Team"
        ]
        # Filter out None values
        english_content = [item for item in english_content if item is not None]
        
        body, html_body = _build_bilingual_email(
            hebrew_title="בקשת הזמנה התקבלה - טרק נחל פרת",
            english_title="Booking Request Received - Nahal Prat Trek",
            hebrew_content=hebrew_content,
            english_content=english_content,
            footer_text=f"Contact: {self.contact_email}"
        )
        
        return self._send_email(customer_email, subject, body, html_body)
    
    def send_booking_approval(self, booking_data: Dict[str, Any], booking_id: int) -> bool:
        """Send booking approval email to customer"""
        customer_email = booking_data['email']
        customer_name = f"{booking_data['first_name']} {booking_data['last_name']}"
        
        subject = "Booking Approved - Nahal Prat Trek / הזמנה אושרה - טרק נחל פרת"
        
        hebrew_content = [
            f"שלום {customer_name},",
            "חדשות טובות! ההזמנה שלך לטרק נחל פרת אושרה!",
            {
                'type': 'details',
                'title': 'פרטי ההזמנה:',
                'details': {
                    'מספר הזמנה': f"#{booking_id}",
                    'שם': customer_name,
                    'חבילה': booking_data['package_type'].title(),
                    'תאריך הטיול': booking_data['trek_date'],
                    'מספר משתתפים': str(booking_data['participants_count']),
                    'מחיר כולל': f"₪{booking_data['total_price']:,}"
                }
            },
            {
                'type': 'list',
                'title': 'מה להביא:',
                'items': [
                    'נעלי הליכה נוחות',
                    'ביגוד מתאים למזג האוויר',
                    'מים',
                    'קרם הגנה וכובע',
                    'מצלמה לתצלומים מדהימים!'
                ]
            },
            "ניצור איתך קשר בהקדם לגבי נקודת המפגש וזמני ההתחלה.",
            "אם יש לך שאלות או בקשות, אנא צור איתנו קשר בהקדם האפשרי.",
            "אנחנו לא יכולים לחכות לחלוק איתך את החוויה המדהימה הזו!",
            "בברכה,<br>צוות טרק נחל פרת"
        ]
        
        english_content = [
            f"Dear {customer_name},",
            "Great news! Your booking for Nahal Prat Trek has been APPROVED and confirmed.",
            {
                'type': 'details',
                'title': 'CONFIRMED BOOKING DETAILS:',
                'details': {
                    'Booking ID': f"#{booking_id}",
                    'Name': customer_name,
                    'Package': booking_data['package_type'].title(),
                    'Trek Date': booking_data['trek_date'],
                    'Number of Participants': str(booking_data['participants_count']),
                    'Total Price': f"₪{booking_data['total_price']:,}"
                }
            },
            {
                'type': 'list',
                'title': 'WHAT TO BRING:',
                'items': [
                    'Comfortable hiking shoes',
                    'Weather-appropriate clothing',
                    'Water',
                    'Sunscreen and hat',
                    'Camera for those amazing views!'
                ]
            },
            "We will contact you shortly regarding the meeting point and start times.",
            "If you have any questions or requests, please contact us as soon as possible.",
            "We can't wait to share this incredible experience with you!",
            "Best regards,<br>The Nahal Prat Trek Team"
        ]
        
        body, html_body = _build_bilingual_email(
            hebrew_title="הזמנה אושרה - טרק נחל פרת",
            english_title="Booking Approved - Nahal Prat Trek",
            hebrew_content=hebrew_content,
            english_content=english_content,
            footer_text=f"Contact: {self.contact_email}"
        )
        
        return self._send_email(customer_email, subject, body, html_body)
    
    def send_booking_cancellation(self, booking_data: Dict[str, Any], booking_id: int, reason: str = "") -> bool:
        """Send booking cancellation email to customer"""
        customer_email = booking_data['email']
        customer_name = f"{booking_data['first_name']} {booking_data['last_name']}"
        
        subject = "Booking Cancelled - Nahal Prat Trek / הזמנה בוטלה - טרק נחל פרת"
        
        hebrew_content = [
            f"שלום {customer_name},",
            "אנו מצטערים להודיע לך שההזמנה שלך לטרק נחל פרת בוטלה.",
            {
                'type': 'details',
                'title': 'פרטי ההזמנה שבוטלה:',
                'details': {
                    'מספר הזמנה': f"#{booking_id}",
                    'שם': customer_name,
                    'חבילה': booking_data['package_type'].title(),
                    'תאריך הטיול': booking_data['trek_date'],
                    'מספר משתתפים': str(booking_data['participants_count'])
                }
            },
            f"סיבת הביטול: {reason}" if reason else None,
            "אם כבר שילמת, נעבד את ההחזר שלך לפי מדיניות הביטול שלנו. הצוות שלנו יצור איתך קשר בנפרד לגבי תהליך ההחזר.",
            "אנו מתנצלים בכנות על כל אי נוחות שזה עלול לגרום. אם תרצה לקבוע מועד אחר, אנא אל תהסס ליצור איתנו קשר ונעשה כמיטב יכולתנו לעזור לך.",
            "אם יש לך שאלות או חששות, אנא השב למייל הזה או צור איתנו קשר ישירות.",
            "בברכה,<br>צוות טרק נחל פרת"
        ]
        # Filter out None values
        hebrew_content = [item for item in hebrew_content if item is not None]
        
        english_content = [
            f"Dear {customer_name},",
            "We regret to inform you that your booking for Nahal Prat Trek has been cancelled.",
            {
                'type': 'details',
                'title': 'CANCELLED BOOKING DETAILS:',
                'details': {
                    'Booking ID': f"#{booking_id}",
                    'Name': customer_name,
                    'Package': booking_data['package_type'].title(),
                    'Trek Date': booking_data['trek_date'],
                    'Number of Participants': str(booking_data['participants_count'])
                }
            },
            f"Reason for Cancellation: {reason}" if reason else None,
            "If you have already made a payment, we will process your refund according to our cancellation policy. Our team will contact you separately regarding the refund process.",
            "We sincerely apologize for any inconvenience this may cause. If you would like to reschedule for another date, please don't hesitate to contact us and we'll do our best to accommodate you.",
            "If you have any questions or concerns, please reply to this email or contact us directly.",
            "Best regards,<br>The Nahal Prat Trek Team"
        ]
        # Filter out None values
        english_content = [item for item in english_content if item is not None]
        
        body, html_body = _build_bilingual_email(
            hebrew_title="הזמנה בוטלה - טרק נחל פרת",
            english_title="Booking Cancelled - Nahal Prat Trek",
            hebrew_content=hebrew_content,
            english_content=english_content,
            footer_text=f"Contact: {self.contact_email}"
        )
        
        return self._send_email(customer_email, subject, body, html_body)
    
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

    def send_admin_booking_approval_notification(self, booking_data: Dict[str, Any], booking_id: int) -> bool:
        """Send booking approval notification to admin"""
        customer_name = f"{booking_data['first_name']} {booking_data['last_name']}"
        subject = f"Booking Approved - {customer_name} (#{booking_id})"
        
        body = f"""
Booking has been approved for customer:

CUSTOMER DETAILS:
-----------------
Name: {customer_name}
Email: {booking_data['email']}
Phone: {booking_data.get('phone', 'N/A')}

APPROVED BOOKING DETAILS:
------------------------
Booking ID: #{booking_id}
Package: {booking_data['package_type'].title()}
Trek Date: {booking_data['trek_date']}
Number of Participants: {booking_data['participants_count']}
Total Price: ₪{booking_data['total_price']:,}

Emergency Contact: {booking_data.get('emergency_contact_name', 'N/A')} - {booking_data.get('emergency_contact_phone', 'N/A')}

{f"Special Requests: {booking_data['special_requests']}" if booking_data.get('special_requests') else "No special requests"}

---
This email was sent automatically from the Nahal Prat Trek booking system.
        """
        
        return self._send_email(self.contact_email, subject, body)

    def send_admin_booking_cancellation_notification(self, booking_data: Dict[str, Any], booking_id: int, reason: str = "") -> bool:
        """Send booking cancellation notification to admin"""
        customer_name = f"{booking_data['first_name']} {booking_data['last_name']}"
        subject = f"Booking Cancelled - {customer_name} (#{booking_id})"
        
        body = f"""
Booking has been cancelled for customer:

CUSTOMER DETAILS:
-----------------
Name: {customer_name}
Email: {booking_data['email']}
Phone: {booking_data.get('phone', 'N/A')}

CANCELLED BOOKING DETAILS:
--------------------------
Booking ID: #{booking_id}
Package: {booking_data['package_type'].title()}
Trek Date: {booking_data['trek_date']}
Number of Participants: {booking_data['participants_count']}
Total Price: ₪{booking_data['total_price']:,}

{f"Reason for Cancellation: {reason}" if reason else "No reason provided"}

Emergency Contact: {booking_data.get('emergency_contact_name', 'N/A')} - {booking_data.get('emergency_contact_phone', 'N/A')}

{f"Special Requests: {booking_data['special_requests']}" if booking_data.get('special_requests') else "No special requests"}

ACTION REQUIRED:
----------------
Process refund if payment was made according to cancellation policy.

---
This email was sent automatically from the Nahal Prat Trek booking system.
        """
        
        return self._send_email(self.contact_email, subject, body)

    def send_email_verification(self, user_email: str, user_name: str, verification_token: str) -> bool:
        """Send email verification link to new user"""
        from config import Config
        
        verification_url = f"{Config.FRONTEND_URL}/verify-email?token={verification_token}"
        
        subject = "Verify Your Email - Nahal Prat Trek / אמת את כתובת המייל שלך - טרק נחל פרת"
        
        body = f"""
An English version of this message follows the Hebrew one.

ברוכים הבאים לטרק נחל פרת, {user_name}!

תודה על יצירת חשבון איתנו. כדי להשלים את הרישום שלך ולגשת לכל התכונות, אנא אמת את כתובת המייל שלך על ידי לחיצה על הלינק למטה:

{verification_url}

קישור האימות הזה יפוג תוך 24 שעות. אם לא יצרת חשבון איתנו, אנא התעלם מהמייל הזה.

לאחר שהמייל שלך יאומת, תוכל:
• לבצע הזמנות לטרק
• לנהל את ההזמנות שלך
• לקבל עדכונים חשובים על ההרפתקאות שלך

אם יש לך שאלות נוספות, תרגיש חופשי ליצור איתנו קשר.

בברכה,
צוות טרק נחל פרת

---

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
                <h1 style="color: #B45309;">ברוכים הבאים לטרק נחל פרת!</h1>
                <h2 style="color: #B45309;">Welcome to Nahal Prat Trek!</h2>
            </div>
            
            <p>שלום {user_name},</p>
            <p>Hi {user_name},</p>
            
            <p>תודה על יצירת חשבון איתנו. כדי להשלים את הרישום שלך ולגשת לכל התכונות, אנא אמת את כתובת המייל שלך על ידי לחיצה על הכפתור למטה:</p>
            <p>Thank you for creating an account with us. To complete your registration and access all features, please verify your email address by clicking the button below:</p>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="{verification_url}" 
                   style="background-color: #B45309; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
                    אמת כתובת מייל / Verify Email Address
                </a>
            </div>
            
            <p><strong>קישור האימות הזה יפוג תוך 24 שעות.</strong></p>
            <p><strong>This verification link will expire in 24 hours.</strong></p>
            
            <p>לאחר שהמייל שלך יאומת, תוכל:</p>
            <p>Once your email is verified, you'll be able to:</p>
            <ul>
                <li>לבצע הזמנות לטרק / Book trekking experiences</li>
                <li>לנהל את ההזמנות שלך / Manage your bookings</li>
                <li>לקבל עדכונים חשובים על ההרפתקאות שלך / Receive important updates about your adventures</li>
            </ul>
            
            <p>אם לא יצרת חשבון איתנו, אנא התעלם מהמייל הזה.</p>
            <p>If you didn't create an account with us, please ignore this email.</p>
            
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
            
            <p style="font-size: 12px; color: #666;">
                אם הכפתור למעלה לא עובד, העתק והדבק את הקישור הזה בדפדפן שלך:<br>
                If the button above doesn't work, copy and paste this link into your browser:<br>
                <a href="{verification_url}">{verification_url}</a>
            </p>
            
            <p style="font-size: 12px; color: #666;">
                בברכה / Best regards,<br>
                צוות טרק נחל פרת / The Nahal Prat Trek Team<br>
                Contact: {self.contact_email}
            </p>
        </body>
        </html>
        """
        
        return self._send_email(user_email, subject, body, html_body)

# Create a singleton instance
email_service = EmailService()