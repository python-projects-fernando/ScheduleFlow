from datetime import datetime, timedelta
from backend.application.dtos.get_availability_request import GetAvailabilityRequest
from backend.application.dtos.get_availability_response import GetAvailabilityResponse
from backend.application.dtos.time_slot_dto import TimeSlotDTO
from backend.application.interfaces.repositories.appointment_repository import AppointmentRepository
from backend.core.models.service_type import ServiceType
from backend.core.value_objects.time_slot import TimeSlot


class GetAvailabilityUseCase:
    def __init__(self, appointment_repo: AppointmentRepository):
        self.appointment_repo = appointment_repo

    async def execute(self, request: GetAvailabilityRequest) -> GetAvailabilityResponse:
        service_type = request.service_type
        start_date = request.start_date
        end_date = request.end_date

        slot_duration_minutes = 30
        slot_duration = timedelta(minutes=slot_duration_minutes)

        scheduled_appointments = await self.appointment_repo.find_scheduled_between(
            start=start_date,
            end=end_date,
            service_type=service_type
        )

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

        return GetAvailabilityResponse(
            service_type=service_type,
            time_slots=time_slots
        )