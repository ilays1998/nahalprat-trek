# Email Notifications for Nahal Prat Trek Booking System

## Overview
This document outlines the email notification system implemented for the Nahal Prat Trek booking system. The system sends automated emails for booking lifecycle events to improve customer experience and operational efficiency.

## Email Notifications Implemented

### 1. Booking Confirmation Email (Step 1)
**Trigger:** When a customer submits a new booking request
**Recipients:** Customer + Admin
**Purpose:** Confirm receipt of booking request

**Customer Email Contains:**
- Booking details (name, package, date, participants, price)
- Special requests
- Emergency contact information
- Next steps information
- Expected timeline for confirmation

**Admin Email Contains:**
- New booking notification
- Complete customer details
- Action required notice
- Link to admin panel (when available)

### 2. Booking Approval Email (Step 2)
**Trigger:** When admin changes booking status from 'pending' to 'confirmed'
**Recipient:** Customer
**Purpose:** Notify customer of booking approval

**Email Contains:**
- Confirmed booking details with booking ID
- Payment information and instructions
- What to bring on the trek
- Meeting point information (3 days before trek)
- Contact information for questions

### 3. Booking Cancellation Email (Step 3)
**Trigger:** When booking status changes to 'cancelled' or booking is deleted
**Recipient:** Customer
**Purpose:** Notify customer of cancellation

**Email Contains:**
- Cancelled booking details
- Cancellation reason (if provided)
- Refund information and policy
- Options to reschedule
- Contact information for support

## Technical Implementation

### Backend Components

#### 1. Email Service (`email_utils.py`)
```python
class EmailService:
    def send_booking_confirmation(booking_data: Dict) -> bool
    def send_booking_approval(booking_data: Dict, booking_id: int) -> bool
    def send_booking_cancellation(booking_data: Dict, booking_id: int, reason: str) -> bool
    def send_admin_booking_notification(booking_data: Dict) -> bool
    def send_contact_confirmation(sender_email: str, sender_name: str) -> bool
```

#### 2. Updated Booking Routes (`routes/bookings.py`)
- **POST /bookings**: Sends confirmation + admin notification emails
- **PUT /bookings/{id}**: Sends approval/cancellation emails based on status change
- **DELETE /bookings/{id}**: Sends cancellation email before deletion

### Frontend Components

#### 1. Booking Form (`pages/booking.js`)
- Updated success message to mention email confirmation
- Improved user feedback about email notifications

#### 2. Admin Interface (`pages/mybooking.js`)
- Added cancellation reason input for admin-initiated cancellations
- Improved booking management with email-aware actions
- Better user experience for cancellation workflow

## Environment Configuration

Required environment variables in backend:
```bash
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password
CONTACT_EMAIL=treknahalprat@gmail.com
```

## Email Templates

All emails use plain text format for maximum compatibility. Templates include:
- Professional branding ("Nahal Prat Trek Team")
- Clear structure with sections
- Call-to-action information
- Contact details
- Automated signature with reply instructions

## Error Handling

- Email failures are logged but don't prevent booking operations
- Graceful degradation: if email fails, booking still succeeds
- Detailed logging for troubleshooting email issues
- No user-facing errors for email failures (improves UX)

## Security Considerations

- Email credentials stored as environment variables
- No sensitive data in email logs
- SMTP connection uses TLS encryption
- Email addresses validated before sending

## Future Enhancements

1. **HTML Email Templates**: Rich formatting for better visual appeal
2. **Email Queue System**: Background processing for high-volume periods
3. **Email Preferences**: Allow customers to opt-out of certain notifications
4. **SMS Notifications**: Alternative communication channel
5. **Email Analytics**: Track open rates and engagement
6. **Multi-language Support**: Email templates in Hebrew and English
7. **Calendar Invites**: Attach .ics files for trek dates

## Testing

To test email functionality:

1. **Development Setup**:
   ```bash
   # Set up email credentials in .env file
   SMTP_USERNAME=your-test-email@gmail.com
   SMTP_PASSWORD=your-app-password
   ```

2. **Test Scenarios**:
   - Create a new booking (tests confirmation emails)
   - Approve a pending booking (tests approval email)
   - Cancel a booking with reason (tests cancellation email)
   - Delete a booking (tests deletion cancellation email)

3. **Verification**:
   - Check customer email inbox
   - Check admin email inbox
   - Verify email content accuracy
   - Test with different languages
   - Test with special characters in names/messages

## Troubleshooting

**Common Issues:**

1. **Emails not sending**:
   - Check SMTP credentials
   - Verify Gmail app password (not regular password)
   - Check firewall/network restrictions

2. **Emails in spam folder**:
   - Add sender to contacts
   - Use proper SPF/DKIM records
   - Monitor sender reputation

3. **Missing content**:
   - Check booking data serialization
   - Verify template variables
   - Check for encoding issues

**Logs to Check:**
```bash
# Backend logs for email operations
grep -i "email" backend/logs/app.log
grep -i "smtp" backend/logs/app.log
```

## Integration with Existing Features

- **Contact Form**: Now uses shared email service
- **User Authentication**: User data pre-fills email templates
- **Admin Panel**: Email notifications integrated with booking management
- **Booking Status**: Email triggers based on status changes
- **Data Validation**: Email addresses validated before sending

This email system significantly improves the customer experience by providing timely, relevant communications throughout the booking lifecycle while streamlining administrative operations.