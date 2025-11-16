from typing import TYPE_CHECKING
from backend.application.dtos.get_appointment_details_request import GetAppointmentDetailsRequest
from backend.application.dtos.get_appointment_details_response import GetAppointmentDetailsResponse
from backend.application.interfaces.repositories.appointment_repository import AppointmentRepository
from backend.application.interfaces.repositories.user_repository import UserRepository
from backend.application.interfaces.repositories.service_repository import ServiceRepository
from backend.core.models.appointment import Appointment
from backend.core.models.user import User
from backend.core.models.service import Service

if TYPE_CHECKING:
    pass

class GetAppointmentDetailsUseCase:
    def __init__(self, appointment_repo: AppointmentRepository, user_repo: UserRepository, service_repo: ServiceRepository):
        self.appointment_repo = appointment_repo
        self.user_repo = user_repo
        self.service_repo = service_repo

    async def execute(self, request: GetAppointmentDetailsRequest) -> GetAppointmentDetailsResponse:
        try:
            appointment: Appointment = await self.appointment_repo.find_by_view_token(request.view_token)

            if not appointment:
                return GetAppointmentDetailsResponse(
                    success=False,
                    message="Appointment not found or invalid token",
                    error_code="APPOINTMENT_NOT_FOUND"
                )

            user_id = appointment.user_id
            service_id = appointment.service_id

            user: User = await self.user_repo.find_by_id(user_id)

            if not user:
                return GetAppointmentDetailsResponse(
                    success=False,
                    message="Associated user not found. Data inconsistency.",
                    error_code="USER_DATA_INCONSISTENCY"
                )

            service: Service = await self.service_repo.find_by_id(service_id)

            if not service:
                return GetAppointmentDetailsResponse(
                    success=False,
                    message="Associated service not found. Data inconsistency.",
                    error_code="SERVICE_DATA_INCONSISTENCY"
                )

            return GetAppointmentDetailsResponse(
                success=True,
                message="Appointment details retrieved successfully",
                appointment_id=appointment.id,
                client_name=user.name,
                client_email=user.email.value,
                client_phone=user.phone,
                service_name=service.name,
                service_description=service.description,
                service_duration_minutes=service.duration_minutes,
                service_price=service.price,
                service_type=service.service_type,
                scheduled_start=appointment.scheduled_slot.start,
                scheduled_end=appointment.scheduled_slot.end,
                status=appointment.status,
                created_at=appointment.created_at,
                updated_at=appointment.updated_at
            )

        except Exception:
            return GetAppointmentDetailsResponse(
                success=False,
                message="An internal error occurred while retrieving appointment details.",
                error_code="INTERNAL_ERROR"
            )

























# from backend.application.dtos.get_appointment_details_request import GetAppointmentDetailsRequest
# from backend.application.dtos.get_appointment_details_response import GetAppointmentDetailsResponse
# from backend.application.interfaces.repositories.appointment_repository import AppointmentRepository
# from backend.application.interfaces.repositories.user_repository import UserRepository
# import logging
#
# logger = logging.getLogger(__name__)
#
# class GetAppointmentDetailsUseCase:
#     def __init__(self, appointment_repo: AppointmentRepository, user_repo: UserRepository):
#         self.appointment_repo = appointment_repo
#         self.user_repo = user_repo
#
#     async def execute(self, request: GetAppointmentDetailsRequest) -> GetAppointmentDetailsResponse:
#         try:
#             logger.info("Fetching appointment by view token: %s", request.view_token)
#             appointment = await self.appointment_repo.find_by_view_token(request.view_token)
#
#             if not appointment:
#                 logger.warning("Appointment not found for view token: %s", request.view_token)
#                 return GetAppointmentDetailsResponse(
#                     success=False,
#                     message="Appointment not found or invalid token",
#                     error_code="APPOINTMENT_NOT_FOUND"
#                 )
#
#             logger.info("Appointment found with ID: %s, linked to user ID: %s", appointment.id, appointment.user_id)
#             user_id = appointment.user_id
#
#             logger.info("Fetching user by ID: %s", user_id)
#             user = await self.user_repo.find_by_id(user_id)
#
#             if not user:
#                 logger.error("User not found for user ID: %s (associated with appointment ID: %s)", user_id, appointment.id)
#                 return GetAppointmentDetailsResponse(
#                     success=False,
#                     message="Associated user not found. Data inconsistency.",
#                     error_code="USER_DATA_INCONSISTENCY"
#                 )
#
#             logger.info("User found for appointment: %s", user.name)
#             logger.info("Successfully fetched details for appointment ID: %s", appointment.id)
#
#             return GetAppointmentDetailsResponse(
#                 success=True,
#                 message="Appointment details retrieved successfully",
#                 appointment_id=appointment.id,
#                 client_name=user.name,
#                 client_email=user.email.value,
#                 client_phone=user.phone,
#                 service_type=appointment.service_type,
#                 scheduled_start=appointment.scheduled_slot.start,
#                 scheduled_end=appointment.scheduled_slot.end,
#                 status=appointment.status,
#                 created_at=appointment.created_at,
#                 updated_at=appointment.updated_at
#             )
#
#         except Exception as e:
#             logger.exception("An unexpected error occurred in GetAppointmentDetailsUseCase: %s", e)
#             return GetAppointmentDetailsResponse(
#                 success=False,
#                 message="An internal error occurred while retrieving appointment details.",
#                 error_code="INTERNAL_ERROR"
#             )
