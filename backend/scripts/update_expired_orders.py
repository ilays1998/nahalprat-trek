"""
update_expired_orders.py
---------------------------------
Scheduled job to cancel old pending bookings whose trek date has already passed.
This script is designed to run as a Render cron job.
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
from models import db, Booking, TrekDate

def cancel_expired_pending_bookings():
    """Find all pending bookings where trek_date < today and cancel them."""
    today = date.today()

    expired_bookings = Booking.query.filter(
        Booking.trek_date <= today,
        Booking.status == 'pending'
    ).all()

    if not expired_bookings:
        print(f"No expired pending bookings found at {today}.")
        return

    for booking in expired_bookings:
        print(f"❌ Cancelling booking {booking.id} ({booking.email}) - trek date {booking.trek_date}")
        booking.status = 'cancelled'

    db.session.commit()
    print(f"✅ Updated {len(expired_bookings)} expired bookings to 'cancelled' on {today}.")

if __name__ == "__main__":
    app = create_app()

    # Use Flask app context so SQLAlchemy works
    with app.app_context():
        cancel_expired_pending_bookings()
