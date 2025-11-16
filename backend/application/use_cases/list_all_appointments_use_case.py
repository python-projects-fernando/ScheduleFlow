
# backend/application/use_cases/list_all_appointment_use_case.py
from typing import TYPE_CHECKING
import logging # Importar logging
from backend.application.dtos.list_all_appointments_request import ListAllAppointmentsRequest
from backend.application.dtos.list_all_appointments_response import ListAllAppointmentsResponse
from backend.application.dtos.admin_appointment_summary_dto import AdminAppointmentSummaryDTO
from backend.application.interfaces.repositories.appointment_repository import AppointmentRepository
from backend.application.interfaces.repositories.user_repository import UserRepository

if TYPE_CHECKING:
    pass

# Obter um logger para este módulo
logger = logging.getLogger(__name__)

class ListAllAppointmentsUseCase:
    def __init__(self, appointment_repo: AppointmentRepository, user_repo: UserRepository):
        self.appointment_repo = appointment_repo
        self.user_repo = user_repo

    async def execute(self, request: ListAllAppointmentsRequest) -> ListAllAppointmentsResponse:
        try:
            logger.info("Executando ListAllAppointmentsUseCase com request: %s", request)

            appointments = await self.appointment_repo.find_all_filtered(
                status=request.status,
                service_type=request.service_type,
                date_from=request.date_from,
                date_to=request.date_to
            )
            logger.info("Encontrados %d agendamentos no intervalo.", len(appointments))

            appointment_summaries = []
            for i, appt in enumerate(appointments):
                logger.info("Processando agendamento %d/%d: ID %s, UserID %s", i+1, len(appointments), appt.id, appt.user_id)

                # Buscar dados do cliente associado ao agendamento
                user = await self.user_repo.find_by_id(appt.user_id)

                if not user:
                    logger.warning("Usuário com ID %s não encontrado para o agendamento %s. Usando dados padrão.", appt.user_id, appt.id)
                    user_name = "Unknown User"
                    user_email = "unknown@example.com"
                    user_phone = None
                else:
                    logger.info("Dados do usuário encontrados para agendamento %s: Nome %s", appt.id, user.name)
                    user_name = user.name
                    user_email = user.email.value # Acessando o valor do VO Email
                    user_phone = user.phone

                # Criar DTO de resumo do agendamento
                summary_dto = AdminAppointmentSummaryDTO(
                    id=appt.id,
                    client_name=user_name,
                    client_email=user_email,
                    client_phone=user_phone,
                    service_type=appt.service_type,
                    scheduled_start=appt.scheduled_slot.start,
                    scheduled_end=appt.scheduled_slot.end,
                    status=appt.status,
                    view_token=appt.view_token,
                    cancellation_token=appt.cancellation_token,
                    created_at=appt.created_at,
                    updated_at=appt.updated_at
                )
                appointment_summaries.append(summary_dto)

            logger.info("Construída lista de %d summaries para resposta.", len(appointment_summaries))
            return ListAllAppointmentsResponse(
                success=True,
                message="Appointments retrieved successfully",
                appointments=appointment_summaries,
                total_count=len(appointment_summaries)
            )

        except Exception as e: # Capturar a exceção específica
            # Logar a exceção com traceback
            logger.exception("Erro inesperado no ListAllAppointmentsUseCase: %s", e)
            # Retornar resposta de erro
            return ListAllAppointmentsResponse(
                success=False,
                message="An internal error occurred while retrieving appointments.",
                appointments=[],
                total_count=0,
                error_code="INTERNAL_ERROR"
            )

# from typing import TYPE_CHECKING
# from backend.application.dtos.list_all_appointments_request import ListAllAppointmentsRequest
# from backend.application.dtos.list_all_appointments_response import ListAllAppointmentsResponse
# from backend.application.dtos.admin_appointment_summary_dto import AdminAppointmentSummaryDTO
# from backend.application.interfaces.repositories.appointment_repository import AppointmentRepository
# from backend.application.interfaces.repositories.user_repository import UserRepository
#
#
# if TYPE_CHECKING:
#     pass
#
# class ListAllAppointmentsUseCase:
#     def __init__(self, appointment_repo: AppointmentRepository, user_repo: UserRepository):
#         self.appointment_repo = appointment_repo
#         self.user_repo = user_repo
#
#     async def execute(self, request: ListAllAppointmentsRequest) -> ListAllAppointmentsResponse:
#         try:
#             appointments = await self.appointment_repo.find_all_filtered(
#                 status=request.status,
#                 service_type=request.service_type,
#                 date_from=request.date_from,
#                 date_to=request.date_to
#             )
#
#             appointment_summaries = []
#             for appt in appointments:
#                 user = await self.user_repo.find_by_id(appt.user_id)
#
#                 if not user:
#                     user_name = "Unknown User"
#                     user_email = "unknown@example.com"
#                     user_phone = None
#                 else:
#                     user_name = user.name
#                     user_email = user.email.value
#                     user_phone = user.phone
#
#                 appointment_summaries.append(
#                     AdminAppointmentSummaryDTO(
#                         id=appt.id,
#                         client_name=user_name,
#                         client_email=user_email,
#                         client_phone=user_phone,
#                         service_type=appt.service_type,
#                         scheduled_start=appt.scheduled_slot.start,
#                         scheduled_end=appt.scheduled_slot.end,
#                         status=appt.status,
#                         created_at=appt.created_at,
#                         updated_at=appt.updated_at
#                     )
#                 )
#
#             return ListAllAppointmentsResponse(
#                 success=True,
#                 message="Appointments retrieved successfully",
#                 appointments=appointment_summaries,
#                 total_count=len(appointment_summaries)
#             )
#
#         except Exception:
#             return ListAllAppointmentsResponse(
#                 success=False,
#                 message="An internal error occurred while retrieving appointments.",
#                 appointments=[],
#                 total_count=0,
#                 error_code="INTERNAL_ERROR"
#             )
