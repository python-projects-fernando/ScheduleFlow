from typing import TYPE_CHECKING
from backend.application.dtos.list_all_appointments_request import ListAllAppointmentsRequest
from backend.application.dtos.list_all_appointments_response import ListAllAppointmentsResponse
from backend.application.dtos.admin_appointment_summary_dto import AdminAppointmentSummaryDTO
from backend.application.interfaces.repositories.appointment_repository import AppointmentRepository
from backend.application.interfaces.repositories.user_repository import UserRepository
from backend.application.interfaces.repositories.service_repository import ServiceRepository

if TYPE_CHECKING:
    pass

class ListAllAppointmentsUseCase:
    def __init__(self, appointment_repo: AppointmentRepository, user_repo: UserRepository, service_repo: ServiceRepository):
        self.appointment_repo = appointment_repo
        self.user_repo = user_repo
        self.service_repo = service_repo

    async def execute(self, request: ListAllAppointmentsRequest) -> ListAllAppointmentsResponse:
        appointments = await self.appointment_repo.find_all_filtered(
            status=request.status,
            service_type=request.service_type,
            date_from=request.date_from,
            date_to=request.date_to
        )

        appointment_summaries = []
        for appt in appointments:
            user = await self.user_repo.find_by_id(appt.user_id)

            if not user:
                user_name = "Unknown User"
                user_email = "unknown@example.com"
                user_phone = None
            else:
                user_name = user.name
                user_email = user.email.value
                user_phone = user.phone

            service = await self.service_repo.find_by_id(appt.service_id)

            if not service:
                service_name = "Unknown Service"
                service_description = None
                service_duration_minutes = None
                service_price = None
                service_type_detail = None
            else:
                service_name = service.name
                service_description = service.description
                service_duration_minutes = int(service.duration_minutes)
                service_price = service.price
                service_type_detail = service.service_type

            summary_dto = AdminAppointmentSummaryDTO(
                id=appt.id,
                user_id=appt.user_id,
                service_id=appt.service_id,
                client_name=user_name,
                client_email=user_email,
                client_phone=user_phone,
                service_name=service_name,
                service_description=service_description,
                service_duration_minutes=service_duration_minutes,
                service_price=service_price,
                service_type=service_type_detail,
                scheduled_start=appt.scheduled_slot.start,
                scheduled_end=appt.scheduled_slot.end,
                status=appt.status,
                view_token=appt.view_token,
                cancellation_token=appt.cancellation_token,
                created_at=appt.created_at,
                updated_at=appt.updated_at
            )
            appointment_summaries.append(summary_dto)

            appointment_summaries.sort(key=lambda dto: dto.scheduled_start, reverse=True)

        return ListAllAppointmentsResponse(
            success=True,
            message="Appointments retrieved successfully",
            appointments=appointment_summaries,
            total_count=len(appointment_summaries)
        )
