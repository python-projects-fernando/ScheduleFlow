from typing import TYPE_CHECKING
from backend.application.dtos.cancel_appointment_request import CancelAppointmentRequest
from backend.application.dtos.cancel_appointment_response import CancelAppointmentResponse
from backend.application.interfaces.repositories.appointment_repository import AppointmentRepository
from backend.application.interfaces.repositories.service_repository import ServiceRepository
from backend.application.interfaces.repositories.user_repository import UserRepository
from backend.application.interfaces.services.notification_service import NotificationService
from backend.core.models.appointment_status import AppointmentStatus

if TYPE_CHECKING:
    pass

class CancelAppointmentUseCase:
    def __init__(self, appointment_repo: AppointmentRepository, user_repo: UserRepository, service_repo: ServiceRepository,
                 notification_service: NotificationService):
        self.appointment_repo = appointment_repo
        self.user_repo = user_repo
        self.service_repo = service_repo
        self.notification_service = notification_service

    async def execute(self, request: CancelAppointmentRequest) -> CancelAppointmentResponse:
        try:
            appointment = await self.appointment_repo.find_by_cancellation_token(request.cancellation_token)

            if not appointment:
                return CancelAppointmentResponse(
                    success=False,
                    message="Appointment not found or invalid token",
                    error_code="APPOINTMENT_NOT_FOUND"
                )

            if appointment.status != AppointmentStatus.SCHEDULED:
                return CancelAppointmentResponse(
                    success=False,
                    message="Cannot cancel an appointment that is not scheduled",
                    error_code="INVALID_STATUS_FOR_CANCELLATION"
                )

            appointment.cancel()

            await self.appointment_repo.update(appointment)

            #---

            user = await self.user_repo.find_by_id(appointment.user_id)
            if not user:
                user_name = "Unknown User"
                user_email_value = "unknown@example.com"
            else:
                user_name = user.name
                user_email_value = user.email.value

            service = await self.service_repo.find_by_id(appointment.service_id)
            if not service:
                service_name = "Unknown Service"
                service_type = None
                service_description = "N/A"
            else:
                service_name = service.name
                service_type = service.service_type
                service_description = service.description

            appointment_details_for_email = {
                "client_name": user_name,
                "client_email": user_email_value,
                "service_name": service_name,
                "service_type": service_type,
                "service_description": service_description,
                "appointment_id": appointment.id,
                "scheduled_start": appointment.scheduled_slot.start,
                "scheduled_end": appointment.scheduled_slot.end,
                "status": appointment.status,
                "cancellation_token": appointment.cancellation_token,
                "view_token": appointment.view_token,
                "created_at": appointment.created_at,
                "updated_at": appointment.updated_at
            }

            notification_sent = await self.notification_service.send_appointment_cancellation(
                recipient=user_email_value,
                details=appointment_details_for_email
            )

            if not notification_sent:
                pass

            #---

            return CancelAppointmentResponse(
                success=True,
                message="Appointment cancelled successfully"
            )

        except ValueError as e:
            return CancelAppointmentResponse(
                success=False,
                message=f"Validation error during cancellation: {str(e)}",
                error_code="VALIDATION_ERROR"
            )
        except Exception as e:
            return CancelAppointmentResponse(
                success=False,
                message="An internal error occurred while cancelling the appointment.",
                error_code="INTERNAL_ERROR"
            )