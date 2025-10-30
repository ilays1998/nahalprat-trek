"""
update_expired_orders.py
---------------------------------
Scheduled job to cancel old pending bookings whose trek date has already passed.
This script can run as a Render cron job or internally via APScheduler.
"""

import os
import sys
from datetime import date
from dotenv import load_dotenv

# Load environment variables (for local testing)
load_dotenv()

# Ensure the app package can be imported (important for Render + cron context)
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from app import create_app
from models import db, Booking
from flask import current_app


def cancel_expired_pending_bookings():
    """Find all pending bookings where trek_date <= today and cancel them."""
    today = date.today()

    expired_bookings = Booking.query.filter(
        Booking.trek_date <= today,
        Booking.status == 'pending'
    ).all()

    if not expired_bookings:
        current_app.logger.info(f"[CRON] No expired pending bookings found at {today}.")
        return

    for booking in expired_bookings:
        current_app.logger.info(
            f"[CRON] ❌ Cancelling booking {booking.id} ({booking.email}) - trek date {booking.trek_date}"
        )
        booking.status = 'cancelled'

    db.session.commit()
    current_app.logger.info(
        f"[CRON] ✅ Updated {len(expired_bookings)} expired bookings to 'cancelled' on {today}."
    )


if __name__ == "__main__":
    # Create the Flask app and run the function inside app context
    app = create_app()

    with app.app_context():
        app.logger.info("[CRON] Manual run of cancel_expired_pending_bookings started.")
        try:
            cancel_expired_pending_bookings()
            app.logger.info("[CRON] Manual run completed successfully.")
        except Exception as e:
            app.logger.error(f"[CRON] Error while running cancel_expired_pending_bookings: {e}")
