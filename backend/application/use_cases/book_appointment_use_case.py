from datetime import timedelta
from typing import TYPE_CHECKING
from backend.application.dtos.book_appointment_request import BookAppointmentRequest
from backend.application.dtos.book_appointment_response import BookAppointmentResponse
from backend.application.interfaces.repositories.appointment_repository import AppointmentRepository
from backend.application.interfaces.repositories.service_repository import ServiceRepository
from backend.application.interfaces.repositories.user_repository import UserRepository
from backend.application.interfaces.services.notification_service import NotificationService
from backend.core.models.appointment import Appointment
from backend.core.models.service import Service
from backend.core.value_objects.time_slot import TimeSlot
import uuid
import logging

if TYPE_CHECKING:
    from backend.core.models.appointment_status import AppointmentStatus

logger = logging.getLogger(__name__)

class BookAppointmentUseCase:
    def __init__(self, appointment_repo: AppointmentRepository, user_repo: UserRepository, service_repo: ServiceRepository,
                 notification_service: NotificationService):
        self.appointment_repo = appointment_repo
        self.user_repo = user_repo
        self.service_repo = service_repo
        self.notification_service = notification_service

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

            scheduled_appointments_for_service = await self.appointment_repo.find_scheduled_between(
                start=requested_start,
                end=requested_end,
                service_id=request.service_id
            )

            for existing_appt in scheduled_appointments_for_service:
                requested_slot_vo = TimeSlot(start=requested_start, end=requested_end)
                existing_slot_vo = existing_appt.scheduled_slot

                if requested_slot_vo.overlaps(existing_slot_vo):
                    return BookAppointmentResponse(
                        success=False,
                        message="The requested time slot is not available for this service",
                        error_code="TIME_SLOT_CONFLICT"
                    )

            scheduled_appointments_for_user = await self.appointment_repo.find_scheduled_between_for_user(
                user_id=user_id,
                start=requested_start,
                end=requested_end
            )

            for existing_appt in scheduled_appointments_for_user:
                new_slot = appointment_entity.scheduled_slot
                existing_slot = existing_appt.scheduled_slot

                if new_slot.overlaps(existing_slot):
                    return BookAppointmentResponse(
                        success=False,
                        message="The requested time slot conflicts with another appointment for this user",
                        error_code="USER_TIME_SLOT_CONFLICT"
                    )

            saved_appointment = await self.appointment_repo.save(appointment_entity)

            #---
            user = await self.user_repo.find_by_id(user_id)
            if not user:
                logger.error("User %s not found when sending notification for appointment %s.", user_id,
                             saved_appointment.id)
                return BookAppointmentResponse(
                    success=False,
                    message="Appointment booked, but failed to send confirmation notification due to missing user data.",
                    appointment_id=saved_appointment.id,
                    error_code="USER_DATA_NOT_FOUND_FOR_NOTIFICATION"
                )

            service_name = service.name
            service_description = service.description
            service_duration_minutes = service.duration_minutes
            service_price = service.price
            service_type = service.service_type
            scheduled_start = saved_appointment.scheduled_slot.start
            scheduled_end = saved_appointment.scheduled_slot.end
            status = saved_appointment.status
            view_token = saved_appointment.view_token
            cancellation_token = saved_appointment.cancellation_token

            appointment_details = {
                "client_name": user.name,
                "client_email": user.email.value,
                "service_name": service_name,
                "service_description": service_description,
                "service_duration_minutes": service_duration_minutes,
                "service_price": service_price,
                "service_type": service_type,
                "scheduled_start": scheduled_start,
                "scheduled_end": scheduled_end,
                "status": status,
                "view_token": view_token,
                "cancellation_token": cancellation_token,
            }

            notification_sent = await self.notification_service.send_appointment_confirmation(
                recipient=user.email.value,
                details=appointment_details
            )

            if not notification_sent:
                logger.warning("Failed to send confirmation notification for appointment %s.", saved_appointment.id)

            # ---

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
                message=f"Validation error: {str(e)}",
                # message="An internal error occurred while booking the appointment.",
                error_code="INTERNAL_ERROR"
            )
