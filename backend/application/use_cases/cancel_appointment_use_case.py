from typing import TYPE_CHECKING
from backend.application.dtos.cancel_appointment_request import CancelAppointmentRequest
from backend.application.dtos.cancel_appointment_response import CancelAppointmentResponse
from backend.application.interfaces.repositories.appointment_repository import AppointmentRepository
from backend.core.models.appointment_status import AppointmentStatus

if TYPE_CHECKING:
    pass

class CancelAppointmentUseCase:
    def __init__(self, appointment_repo: AppointmentRepository):
        self.appointment_repo = appointment_repo

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