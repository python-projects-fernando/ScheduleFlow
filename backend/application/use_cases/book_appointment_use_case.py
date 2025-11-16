from datetime import timedelta
from typing import TYPE_CHECKING
from backend.application.dtos.book_appointment_request import BookAppointmentRequest
from backend.application.dtos.book_appointment_response import BookAppointmentResponse
from backend.application.interfaces.repositories.appointment_repository import AppointmentRepository
from backend.application.interfaces.repositories.service_repository import ServiceRepository
from backend.core.models.appointment import Appointment
from backend.core.models.service import Service
from backend.core.value_objects.time_slot import TimeSlot
import uuid

if TYPE_CHECKING:
    from backend.core.models.appointment_status import AppointmentStatus

class BookAppointmentUseCase:
    def __init__(self, appointment_repo: AppointmentRepository, service_repo: ServiceRepository):
        self.appointment_repo = appointment_repo
        self.service_repo = service_repo

    async def execute(self, request: BookAppointmentRequest, user_id: str) -> BookAppointmentResponse:
        try:
            service: Service = await self.service_repo.find_by_id(request.service_id)

            if not service:
                return BookAppointmentResponse(
                    success=False,
                    message="Service not found",
                    error_code="SERVICE_NOT_FOUND"
                )

            duration_minutes = service.duration_minutes
            requested_start = request.requested_datetime
            requested_end = requested_start + timedelta(minutes=duration_minutes)

            appointment_entity = Appointment(
                id=str(uuid.uuid4()),
                user_id=user_id,
                service_id=request.service_id,
                scheduled_slot=TimeSlot(start=requested_start, end=requested_end),
            )

            # overlapping_appointments = await self.appointment_repo.find_scheduled_between(
            #     start=requested_start,
            #     end=requested_end,
            #     service_id=request.service_id
            # )

            overlapping_appointments = await self.appointment_repo.find_scheduled_between_for_user(
                user_id=user_id,
                start=requested_start,
                end=requested_end
            )

            for existing_appt in overlapping_appointments:
                new_slot = appointment_entity.scheduled_slot
                existing_slot = existing_appt.scheduled_slot

                if new_slot.overlaps(existing_slot):
                    return BookAppointmentResponse(
                        success=False,
                        message="The requested time slot is not available for this user",
                        error_code="TIME_SLOT_CONFLICT"
                    )

            saved_appointment = await self.appointment_repo.save(appointment_entity)

            return BookAppointmentResponse(
                success=True,
                message="Appointment booked successfully",
                appointment_id=saved_appointment.id,
                view_token=saved_appointment.view_token,
                cancellation_token=saved_appointment.cancellation_token
            )

        except ValueError as e:
            return BookAppointmentResponse(
                success=False,
                message=f"Validation error: {str(e)}",
                error_code="VALIDATION_ERROR"
            )
        except Exception as e:
            return BookAppointmentResponse(
                success=False,
                message=f"----------------------->>>>>>>>>> error: {str(e)}",
                # message="An internal error occurred while booking the appointment.",
                error_code="INTERNAL_ERROR"
            )
