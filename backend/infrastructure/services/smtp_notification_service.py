import smtplib
import ssl
from datetime import datetime, timezone, timedelta
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from backend.application.interfaces.services.notification_service import NotificationService
import logging
import os
from typing import Dict, Any



logger = logging.getLogger(__name__)

class SMTPNotificationService(NotificationService):
    def __init__(self):
        self.smtp_server = os.getenv("SMTP_SERVER", "smtp.gmail.com")
        self.smtp_port = int(os.getenv("SMTP_PORT", 587))
        self.sender_email = os.getenv("EMAIL_ADDRESS")
        self.sender_password = os.getenv("EMAIL_PASSWORD")

        # logger.warning(f"---------------> { self.sender_email} e {self.sender_password}")

        if not self.sender_email or not self.sender_password:
            logger.warning("SMTP credentials (EMAIL_ADDRESS, EMAIL_PASSWORD) not found in environment variables. Email sending will be disabled.")

    async def send_appointment_confirmation(self, recipient: str, details: Dict[str, Any]) -> bool:
        return await self._send_email(recipient, details, "Appointment Confirmation", self._create_text_body, self._create_html_body)

    async def send_appointment_reminder(self, recipient: str, details: Dict[str, Any]) -> bool:
        return await self._send_email(recipient, details, "Appointment Reminder", self._create_text_reminder_body, self._create_html_reminder_body)

    async def send_appointment_cancellation(self, recipient: str, details: Dict[str, Any]) -> bool:
        return await self._send_email(recipient, details, "Appointment Cancellation", self._create_text_cancellation_body, self._create_html_cancellation_body)

    async def _send_email(self, recipient_email: str, details: Dict[str, Any], subject_prefix: str, body_text_func, body_html_func) -> bool:
        if not self.sender_email or not self.sender_password:
            logger.error(f"Cannot send {subject_prefix.lower()}: SMTP credentials are not configured.")
            return False

        try:
            message = MIMEMultipart("alternative")
            subject = f"{subject_prefix} - {details.get('service_name', 'Service')}"
            message["Subject"] = subject
            message["From"] = self.sender_email
            message["To"] = recipient_email

            text_body = body_text_func(details)
            html_body = body_html_func(details)

            part1 = MIMEText(text_body, "plain")
            part2 = MIMEText(html_body, "html")

            message.attach(part1)
            message.attach(part2)

            context = ssl.create_default_context()
            context.check_hostname = False
            context.verify_mode = ssl.CERT_NONE

            with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
                server.starttls(context=context)
                server.login(self.sender_email, self.sender_password)
                server.sendmail(self.sender_email, recipient_email, message.as_string())

            logger.info(f"Confirmation email sent to {recipient_email}")
            return True

        except Exception as e:
            logger.exception(f"Error sending {subject_prefix.lower()} email to {recipient_email}: {e}")
            return False

    def _create_text_body(self, details: Dict[str, Any]) -> str:
        return f"""
        Hello {details.get('client_name', 'Client')},

        Your appointment has been confirmed successfully!

        Appointment Details:
        - Service: {details.get('service_name')}
        - Description: {details.get('service_description', 'N/A')}
        - Date and Time: {details.get('scheduled_start').strftime('%Y-%m-%d %H:%M')} - {details.get('scheduled_end').strftime('%H:%M')}
        - Duration: {details.get('service_duration_minutes')} minutes
        - Price: $ {details.get('service_price', 0.0):.2f}
        - Type: {details.get('service_type').value if details.get('service_type') else 'N/A'}
        - Status: {details.get('status').value if details.get('status') else 'N/A'}
        - View Token: {details.get('view_token')}
        - Cancellation Token: {details.get('cancellation_token')}
        - View Details: {details.get('view_link')}
        - Cancel Appointment: {details.get('cancel_link')}

        Thank you for choosing our services!

        Best regards,
        ScheduleFlow Team
        """

    def _create_html_body(self, details: Dict[str, Any]) -> str:
        return f"""
        <html>
          <body>
            <h2>Hello {details.get('client_name', 'Client')}!</h2>
            <p>Your appointment has been <strong>confirmed</strong> successfully!</p>
            <h3>Appointment Details:</h3>
            <ul>
              <li><strong>Service:</strong> {details.get('service_name')}</li>
              <li><strong>Description:</strong> {details.get('service_description', 'N/A')}</li>
              <li><strong>Date and Time:</strong> {details.get('scheduled_start').strftime('%Y-%m-%d %H:%M')} - {details.get('scheduled_end').strftime('%H:%M')}</li>
              <li><strong>Duration:</strong> {details.get('service_duration_minutes')} minutes</li>
              <li><strong>Price:</strong> $ {details.get('service_price', 0.0):.2f}</li>
              <li><strong>Type:</strong> {details.get('service_type').value if details.get('service_type') else 'N/A'}</li>
              <li><strong>Status:</strong> {details.get('status').value if details.get('status') else 'N/A'}</li>
              <li><strong>View Token:</strong> {details.get('view_token')}</li>
              <li><strong>Cancellation Token:</strong> {details.get('cancellation_token')}</li>
              <li><strong>View Details:</strong> <a href="{ details.get('view_link') }">Click here to view details</a></li>
              <li><strong>Cancel Appointment:</strong> <a href="{ details.get('cancel_link') }">Click here to cancel</a></li>
            </ul>
            <p>Thank you for choosing our services!</p>
            <p>Best regards,<br>
            ScheduleFlow Team</p>
          </body>
        </html>
        """

    def _create_text_reminder_body(self, details: Dict[str, Any]) -> str:
        return f"""
        Hello {details.get('client_name', 'Client')},

        This is a reminder for your upcoming appointment.

        Appointment Details:
        - Service: {details.get('service_name')}
        - Date and Time: {details.get('scheduled_start').strftime('%Y-%m-%d %H:%M')} - {details.get('scheduled_end').strftime('%H:%M')}
        - View Token: {details.get('view_token')}
        - Cancellation Token: {details.get('cancellation_token')}

        Best regards,
        ScheduleFlow Team
        """

    def _create_html_reminder_body(self, details: Dict[str, Any]) -> str:
        return f"""
        <html>
          <body>
            <h2>Hello {details.get('client_name', 'Client')}!</h2>
            <p>This is a <strong>reminder</strong> for your upcoming appointment.</p>
            <h3>Appointment Details:</h3>
            <ul>
              <li><strong>Service:</strong> {details.get('service_name')}</li>
              <li><strong>Date and Time:</strong> {details.get('scheduled_start').strftime('%Y-%m-%d %H:%M')} - {details.get('scheduled_end').strftime('%H:%M')}</li>
              <li><strong>View Token:</strong> {details.get('view_token')}</li>
              <li><strong>Cancellation Token:</strong> {details.get('cancellation_token')}</li>
            </ul>
            <p>Best regards,<br>
            ScheduleFlow Team</p>
          </body>
        </html>
        """

    def _create_text_cancellation_body(self, details: Dict[str, Any]) -> str:

        local_offset = timedelta(hours=-3)
        local_tz = timezone(local_offset)

        local_start_str = ""
        local_end_str = ""
        if isinstance(details.get('scheduled_start'), datetime):
            local_start = details['scheduled_start'].astimezone(local_tz)
            local_start_str = local_start.strftime('%Y-%m-%d %H:%M')
        if isinstance(details.get('scheduled_end'), datetime):
            local_end = details['scheduled_end'].astimezone(local_tz)
            local_end_str = local_end.strftime('%Y-%m-%d %H:%M')


        formatted_end_time = self._format_end_time_for_display(local_start_str, local_end_str)

        return f"""
        Hello {details.get('client_name', 'Client')},

        Your appointment has been cancelled.

        Appointment Details:
        - Service: {details.get('service_name')}
        - Date and Time: {local_start_str} - {formatted_end_time}
        - Reason: {details.get('cancellation_reason', 'N/A')}

        Best regards,
        ScheduleFlow Team
        """

    def _create_html_cancellation_body(self, details: Dict[str, Any]) -> str:

        local_offset = timedelta(hours=-3)
        local_tz = timezone(local_offset)

        local_start_str = ""
        local_end_str = ""
        if isinstance(details.get('scheduled_start'), datetime):
            local_start = details['scheduled_start'].astimezone(local_tz)
            local_start_str = local_start.strftime('%Y-%m-%d %H:%M')
        if isinstance(details.get('scheduled_end'), datetime):
            local_end = details['scheduled_end'].astimezone(local_tz)
            local_end_str = local_end.strftime('%Y-%m-%d %H:%M')


        formatted_end_time = self._format_end_time_for_display(local_start_str, local_end_str)


        return f"""
        <html>
          <body>
            <h2>Hello {details.get('client_name', 'Client')}!</h2>
            <p>Your appointment has been <strong>cancelled</strong>.</p>
            <h3>Appointment Details:</h3>
            <ul>
              <li><strong>Service:</strong> {details.get('service_name')}</li>
              <li><strong>Date and Time:</strong> {local_start_str} - {formatted_end_time}</li>
              <li><strong>Reason:</strong> {details.get('cancellation_reason', 'N/A')}</li>
            </ul>
            <p>Best regards,<br>
            ScheduleFlow Team</p>
          </body>
        </html>
        """

    def _format_end_time_for_display(self, start_str: str, end_str: str) -> str:

        start_date_part = start_str.split(' ')[0] if start_str else ""
        end_date_part = end_str.split(' ')[0] if end_str else ""


        if start_date_part and end_date_part and start_date_part == end_date_part:

            return end_str.split(' ')[1]
        else:

            return end_str

    # def _create_text_cancellation_body(self, details: Dict[str, Any]) -> str:
    #     return f"""
    #     Hello {details.get('client_name', 'Client')},
    #
    #     Your appointment has been cancelled.
    #
    #     Appointment Details:
    #     - Service: {details.get('service_name')}
    #     - Date and Time: {details.get('scheduled_start').strftime('%Y-%m-%d %H:%M')} - {details.get('scheduled_end').strftime('%H:%M')}
    #     - Reason: {details.get('cancellation_reason', 'N/A')}
    #
    #     Best regards,
    #     ScheduleFlow Team
    #     """
    #
    # def _create_html_cancellation_body(self, details: Dict[str, Any]) -> str:
    #     return f"""
    #     <html>
    #       <body>
    #         <h2>Hello {details.get('client_name', 'Client')}!</h2>
    #         <p>Your appointment has been <strong>cancelled</strong>.</p>
    #         <h3>Appointment Details:</h3>
    #         <ul>
    #           <li><strong>Service:</strong> {details.get('service_name')}</li>
    #           <li><strong>Date and Time:</strong> {details.get('scheduled_start').strftime('%Y-%m-%d %H:%M')} - {details.get('scheduled_end').strftime('%H:%M')}</li>
    #           <li><strong>Reason:</strong> {details.get('cancellation_reason', 'N/A')}</li>
    #         </ul>
    #         <p>Best regards,<br>
    #         ScheduleFlow Team</p>
    #       </body>
    #     </html>
    #     """
