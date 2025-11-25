import asyncio
from datetime import datetime
from email.message import EmailMessage
import aiosmtplib
import os
from dotenv import load_dotenv

load_dotenv()  # Load EMAIL_ADDRESS and EMAIL_PASSWORD

EMAIL_ADDRESS = os.getenv("EMAIL_ADDRESS")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD")

class NotificationService:

    # -------------------
    # HELPERS FOR FORMATTING
    # -------------------
    def _format_date(self, dt: datetime):
        return dt.strftime("%d/%m/%Y")

    def _format_time(self, dt: datetime):
        return dt.strftime("%I:%M %p")

    def _format_datetime(self, dt: datetime):
        return f"{self._format_date(dt)} at {self._format_time(dt)}"

    # -------------------
    # CORE EMAIL SENDING
    # -------------------
    async def send_email(self, to_email, subject, body):
        import traceback
        message = EmailMessage()
        message["From"] = EMAIL_ADDRESS
        message["To"] = to_email
        message["Subject"] = subject
        message.set_content(body)

        # Debug print for environment variables presence (not actual password)
        print(f"🔍 EMAIL_ADDRESS set: {EMAIL_ADDRESS is not None}", flush=True)
        print(f"🔍 EMAIL_PASSWORD set: {EMAIL_PASSWORD is not None}", flush=True)

        try:
            await aiosmtplib.send(
                message,
                hostname="smtp.gmail.com",
                port=587,
                start_tls=True,
                username=EMAIL_ADDRESS,
                password=EMAIL_PASSWORD
            )
            print(f"✅ Email sent to {to_email} with subject '{subject}'", flush=True)
        except Exception as e:
            print(f"❌ Error sending email to {to_email}: {e}", flush=True)
            traceback.print_exc()

    # -------------------
    # EMAIL TYPES
    # -------------------
    async def send_approval_email(self, visitor_email, visitor_name, staff_name, appointment_time, purpose, department):
        if isinstance(appointment_time, str):
            appointment_time = datetime.strptime(appointment_time, "%Y-%m-%d %H:%M")

        subject = "Visit Request Approved"
        body = f"""
Dear {visitor_name},

Your visit request has been approved.

Staff: {staff_name}
Department: {department}
Date: {self._format_date(appointment_time)}
Time: {self._format_time(appointment_time)}
Purpose: {purpose}

SecureVisit Team
"""
        await self.send_email(visitor_email, subject, body)

    async def send_decline_email(self, visitor_email, visitor_name, staff_name, decline_reason, decline_category, department):
        subject = "Visit Request Declined"
        body = f"""
Dear {visitor_name},

We regret to inform you that your visit request has been declined.

Staff: {staff_name}
Department: {department}
Decline Category: {decline_category}
Reason: {decline_reason}

SecureVisit Team
"""
        await self.send_email(visitor_email, subject, body)

    async def send_reminder_email(self, visitor_email, visitor_name, staff_name, appointment_time, purpose):
        if isinstance(appointment_time, str):
            appointment_time = datetime.strptime(appointment_time, "%Y-%m-%d %H:%M")

        subject = "Appointment Reminder"
        body = f"""
Dear {visitor_name},

This is a reminder for your appointment tomorrow.

Date: {self._format_date(appointment_time)}
Time: {self._format_time(appointment_time)}
Staff: {staff_name}
Purpose: {purpose}

SecureVisit Team
"""
        await self.send_email(visitor_email, subject, body)

    async def notify_staff_new_visitor(self, staff_email, staff_name, visitor_name, purpose, submission_time):
        subject = "New Visitor Request"
        body = f"""
Hello {staff_name},

You have a new visitor request.

Visitor: {visitor_name}
Purpose: {purpose}
Submitted: {self._format_datetime(submission_time)}

Please log in to approve or decline.

SecureVisit Team
"""
        await self.send_email(staff_email, subject, body)

    async def notify_staff_approved(self, staff_email, staff_name, visitor_name, appointment_time, purpose):
        if isinstance(appointment_time, str):
            appointment_time = datetime.strptime(appointment_time, "%Y-%m-%d %H:%M")

        subject = "Appointment Approved"
        body = f"""
Hello {staff_name},

The appointment with {visitor_name} has been approved.

Date: {self._format_date(appointment_time)}
Time: {self._format_time(appointment_time)}
Purpose: {purpose}

SecureVisit Team
"""
        await self.send_email(staff_email, subject, body)

    async def notify_staff_arrival(self, staff_email, staff_name, visitor_name, check_in_time):
        if isinstance(check_in_time, str):
            check_in_time = datetime.strptime(check_in_time, "%Y-%m-%d %H:%M")

        subject = "Visitor Has Arrived"
        body = f"""
Hello {staff_name},

{visitor_name} has checked in at {self._format_time(check_in_time)}.

Please proceed to meet them.

SecureVisit Team
"""
        await self.send_email(staff_email, subject, body)
