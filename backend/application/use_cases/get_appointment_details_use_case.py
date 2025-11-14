from backend.application.dtos.get_appointment_details_request import GetAppointmentDetailsRequest
from backend.application.dtos.get_appointment_details_response import GetAppointmentDetailsResponse
from backend.application.interfaces.repositories.appointment_repository import AppointmentRepository


class GetAppointmentDetailsUseCase:
    def __init__(self, appointment_repo: AppointmentRepository):
        self.appointment_repo = appointment_repo

    async def execute(self, request: GetAppointmentDetailsRequest) -> GetAppointmentDetailsResponse:
        try:
            appointment = await self.appointment_repo.find_by_view_token(request.view_token)

            if not appointment:
                return GetAppointmentDetailsResponse(
                    success=False,
                    message="Appointment not found or invalid token",
                    error_code="APPOINTMENT_NOT_FOUND"
                )

            return GetAppointmentDetailsResponse(
                success=True,
                message="Appointment details retrieved successfully",
                appointment_id=appointment.id,
                client_name=appointment.client_name,
                client_email=appointment.client_email.value,
                client_phone=appointment.client_phone,
                service_type=appointment.service_type,
                scheduled_start=appointment.scheduled_slot.start,
                scheduled_end=appointment.scheduled_slot.end,
                status=appointment.status,
                created_at=appointment.created_at,
                updated_at=appointment.updated_at
            )

        except Exception as e:
            return GetAppointmentDetailsResponse(
                success=False,
                message="An internal error occurred while retrieving appointment details.",
                error_code="INTERNAL_ERROR"
            )