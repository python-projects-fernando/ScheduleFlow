from typing import TYPE_CHECKING
from backend.application.dtos.list_my_appointments_response import ListMyAppointmentsResponse
from backend.application.dtos.appointment_summary_dto import AppointmentSummaryDTO
from backend.application.interfaces.repositories.appointment_repository import AppointmentRepository
from backend.application.interfaces.repositories.service_repository import ServiceRepository

if TYPE_CHECKING:
    pass

class ListMyAppointmentsUseCase:
    def __init__(self, appointment_repo: AppointmentRepository, service_repo: ServiceRepository):
        self.appointment_repo = appointment_repo
        self.service_repo = service_repo

    async def execute(self, user_id: str) -> ListMyAppointmentsResponse:
        try:
            appointments = await self.appointment_repo.find_by_user_id(user_id)

            appointment_summaries = []
            for appt in appointments:
                service = await self.service_repo.find_by_id(appt.service_id)

                if service:
                    service_name = service.name
                    service_type = service.service_type
                else:
                    service_name = "Unknown Service"
                    service_type = None

                appointment_summaries.append(
                    AppointmentSummaryDTO(
                        id=appt.id,
                        service_name=service_name,
                        service_type=service_type,
                        scheduled_start=appt.scheduled_slot.start,
                        scheduled_end=appt.scheduled_slot.end,
                        status=appt.status,
                        view_token=appt.view_token,
                        cancellation_token=appt.cancellation_token,
                        created_at=appt.created_at,
                        updated_at=appt.updated_at
                    )
                )

            appointment_summaries.sort(key=lambda dto: dto.scheduled_start)

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