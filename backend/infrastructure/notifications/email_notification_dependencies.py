from backend.application.interfaces.services.notification_service import NotificationService
from backend.infrastructure.services.smtp_notification_service import SMTPNotificationService

smtp_service = SMTPNotificationService()

def get_notification_service() -> NotificationService:
    return smtp_service
