from typing import TYPE_CHECKING
from backend.application.dtos.list_my_appointments_response import ListMyAppointmentsResponse
from backend.application.dtos.appointment_summary_dto import AppointmentSummaryDTO
from backend.application.interfaces.repositories.appointment_repository import AppointmentRepository
from backend.application.interfaces.repositories.user_repository import UserRepository
from backend.core.models.appointment import Appointment as CoreAppointment

if TYPE_CHECKING:
    pass

class ListMyAppointmentsUseCase:
    def __init__(self, appointment_repo: AppointmentRepository):
        self.appointment_repo = appointment_repo

    async def execute(self, user_id: str) -> ListMyAppointmentsResponse:
        try:
            appointments = await self.appointment_repo.find_by_user_id(user_id)

            appointment_summaries = []
            for appt in appointments:
                appointment_summaries.append(
                    AppointmentSummaryDTO(
                        id=appt.id,
                        service_type=appt.service_type,
                        scheduled_start=appt.scheduled_slot.start,
                        scheduled_end=appt.scheduled_slot.end,
                        status=appt.status,
                        view_token=appt.view_token,
                        cancellation_token=appt.cancellation_token,
                        created_at=appt.created_at,
                        updated_at=appt.updated_at
                    )
                )

            return ListMyAppointmentsResponse(
                success=True,
                message="Appointments retrieved successfully",
                appointments=appointment_summaries,
                total_count=len(appointment_summaries)
            )

        except Exception:
            return ListMyAppointmentsResponse(
                success=False,
                message="An internal error occurred while retrieving appointments.",
                appointments=[],
                total_count=0,
                error_code="INTERNAL_ERROR"
            )
