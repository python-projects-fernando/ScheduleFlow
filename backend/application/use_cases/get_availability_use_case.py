from datetime import datetime, timedelta
from typing import TYPE_CHECKING
from backend.application.dtos.get_availability_request import GetAvailabilityRequest
from backend.application.dtos.get_availability_response import GetAvailabilityResponse
from backend.application.dtos.service_summary_dto import ServiceSummaryDTO
from backend.application.dtos.time_slot_dto import TimeSlotDTO
from backend.application.interfaces.repositories.appointment_repository import AppointmentRepository
from backend.application.interfaces.repositories.service_repository import ServiceRepository
from backend.core.models.service_type import ServiceType
from backend.core.value_objects.time_slot import TimeSlot

if TYPE_CHECKING:
    pass

class GetAvailabilityUseCase:
    def __init__(self, appointment_repo: AppointmentRepository, service_repo: ServiceRepository):
        self.appointment_repo = appointment_repo
        self.service_repo = service_repo

    async def execute(self, request: GetAvailabilityRequest) -> GetAvailabilityResponse:
        service_type = request.service_type
        start_date = request.start_date
        end_date = request.end_date

        # slot_duration_minutes = 30
        # slot_duration = timedelta(minutes=slot_duration_minutes)

        available_services_list = await self.service_repo.find_by_type(service_type)
        if not available_services_list:
            return GetAvailabilityResponse(
                service_type=service_type,
                time_slots=[],
                available_services=[]
            )

        representative_service = available_services_list[0]
        slot_duration_minutes = representative_service.duration_minutes
        slot_duration = timedelta(minutes=slot_duration_minutes)

        service_ids = [service.id for service in available_services_list]

        scheduled_appointments = []
        for sid in service_ids:
            appointments_for_service = await self.appointment_repo.find_scheduled_between(
                start=start_date,
                end=end_date,
                service_id=sid
            )
            scheduled_appointments.extend(appointments_for_service)

        time_slots = []
        current_start = start_date

        while current_start < end_date:
            current_end = current_start + slot_duration

            is_available = True
            for scheduled_appt in scheduled_appointments:
                requested_slot_vo = TimeSlot(start=current_start, end=current_end)
                existing_slot_vo = scheduled_appt.scheduled_slot

                if requested_slot_vo.overlaps(existing_slot_vo):
                    is_available = False
                    break

            time_slot_dto = TimeSlotDTO(start=current_start, end=current_end, is_available=is_available)
            time_slots.append(time_slot_dto)

            current_start = current_end

        available_services_dtos = []
        for service in available_services_list:
            available_services_dtos.append(
                ServiceSummaryDTO(
                    id=service.id,
                    name=service.name,
                    description=service.description,
                    duration_minutes=service.duration_minutes,
                    price=service.price,
                    service_type=service.service_type,
                    created_at=service.created_at,
                    updated_at=service.updated_at
                )
            )

        return GetAvailabilityResponse(
            service_type=service_type,
            time_slots=time_slots,
            available_services=available_services_dtos
        )

# from datetime import datetime, timedelta
# from backend.application.dtos.get_availability_request import GetAvailabilityRequest
# from backend.application.dtos.get_availability_response import GetAvailabilityResponse
# from backend.application.dtos.time_slot_dto import TimeSlotDTO
# from backend.application.interfaces.repositories.appointment_repository import AppointmentRepository
# from backend.application.interfaces.repositories.service_repository import ServiceRepository
# from backend.core.models.service_type import ServiceType
# from backend.core.value_objects.time_slot import TimeSlot
#
#
# class GetAvailabilityUseCase:
#     def __init__(self, appointment_repo: AppointmentRepository, service_repo: ServiceRepository):
#         self.appointment_repo = appointment_repo
#         self.service_repo = service_repo
#
#     async def execute(self, request: GetAvailabilityRequest) -> GetAvailabilityResponse:
#         service_type = request.service_type
#         start_date = request.start_date
#         end_date = request.end_date
#
#         slot_duration_minutes = 30
#         slot_duration = timedelta(minutes=slot_duration_minutes)
#
#         scheduled_appointments = await self.appointment_repo.find_scheduled_between(
#             start=start_date,
#             end=end_date,
#             service_type=service_type
#         )
#
#         time_slots = []
#         current_start = start_date
#
#         while current_start < end_date:
#             current_end = current_start + slot_duration
#
#             is_available = True
#             for scheduled_appt in scheduled_appointments:
#                 requested_slot_vo = TimeSlot(start=current_start, end=current_end)
#                 existing_slot_vo = scheduled_appt.scheduled_slot
#
#                 if requested_slot_vo.overlaps(existing_slot_vo):
#                     is_available = False
#                     break
#
#             time_slot_dto = TimeSlotDTO(start=current_start, end=current_end, is_available=is_available)
#             time_slots.append(time_slot_dto)
#
#             current_start = current_end
#
#         return GetAvailabilityResponse(
#             service_type=service_type,
#             time_slots=time_slots
#         )