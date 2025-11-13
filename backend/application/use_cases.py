# backend/application/use_cases.py
from typing import List
from datetime import datetime, timedelta, timezone
import uuid
from .dtos import (
    BookAppointmentRequest, BookAppointmentResponse,
    GetAvailabilityRequest, GetAvailabilityResponse, TimeSlotDTO,
    CancelAppointmentRequest, CancelAppointmentResponse
)
from ..core.models import Appointment, AppointmentStatus, ServiceType
from ..core.value_objects import Email, TimeSlot
from .interfaces.repositories import AppointmentRepository as IAppointmentRepository, ServiceRepository as IServiceRepository
import logging

# Adicione um logger
logger = logging.getLogger(__name__)

class BookAppointmentUseCase:
    def __init__(self, appointment_repo: IAppointmentRepository, service_repo: IServiceRepository):
        self.appointment_repo = appointment_repo
        self.service_repo = service_repo

    async def execute(self, request: BookAppointmentRequest) -> BookAppointmentResponse:
        logger.info("Executando BookAppointmentUseCase com request: %s", request)

        try:
            # Validar se o horário solicitado está disponível
            # 1. Verificar se já existe um agendamento no mesmo horário
            requested_start = request.requested_datetime
            requested_end = requested_start + timedelta(minutes=30)  # Assumindo duração padrão
            logger.info("Buscando agendamentos entre: %s e %s", requested_start, requested_end)

            overlapping_appointments = await self.appointment_repo.find_scheduled_between(
                requested_start,
                requested_end
            )
            logger.info("Encontrados %d agendamentos sobrepostos.", len(overlapping_appointments))

            for appt in overlapping_appointments:
                logger.info("Comparando com agendamento existente: ID %s, Slot: %s - %s", appt.id, appt.scheduled_slot.start, appt.scheduled_slot.end)
                requested_slot = TimeSlot(requested_start, requested_end)
                logger.info("Slot solicitado: %s - %s", requested_slot.start, requested_slot.end)

                # Criação temporária para verificar conflito
                temp_appointment = Appointment(
                    id=None,
                    client_name=request.client_name,
                    client_email=Email(request.client_email),
                    client_phone=request.client_phone,
                    service_type=request.service_type,
                    scheduled_slot=requested_slot
                )
                logger.info("Verificando conflito entre slots: %s e %s", appt.scheduled_slot, temp_appointment.scheduled_slot)
                if appt.is_conflicting_with(temp_appointment): # <-- A falha pode ocorrer aqui
                    logger.info("Conflito detectado. Retornando erro de conflito.")
                    return BookAppointmentResponse(
                        success=False,
                        message="The requested time slot is not available",
                        error_code="TIME_SLOT_CONFLICT"
                    )
                logger.info("Nenhum conflito com este agendamento.")

            # 2. Criar o agendamento
            logger.info("Buscando serviço por tipo: %s", request.service_type)
            service = await self.service_repo.find_by_type(request.service_type)
            if not service:
                logger.error("Tipo de serviço não encontrado: %s", request.service_type)
                return BookAppointmentResponse(
                    success=False,
                    message="Service type not found",
                    error_code="SERVICE_NOT_FOUND"
                )
            logger.info("Serviço encontrado: ID %s, Duração %d min", service.id, service.duration)

            appointment = Appointment(
                id=str(uuid.uuid4()),
                client_name=request.client_name,  # Correto
                client_email=Email(request.client_email),  # Correto
                client_phone=request.client_phone,  # Correto
                service_type=request.service_type,  # Correto
                scheduled_slot=TimeSlot(  # <-- Corrigir aqui
                    start=request.requested_datetime,  # <-- Era: requested_datetime
                    end=request.requested_datetime + timedelta(minutes=service.duration)  # <-- Era: requested_datetime
                )
            )
            logger.info("Agendamento criado no domínio: ID %s", appointment.id)

            # 3. Salvar
            logger.info("Salvando agendamento no repositório.")
            saved_appointment = await self.appointment_repo.save(appointment)
            logger.info("Agendamento salvo com sucesso: ID %s", saved_appointment.id)

            return BookAppointmentResponse(
                success=True,
                message="Appointment booked successfully",
                appointment_id=saved_appointment.id
            )
        except Exception as e:
            logger.exception("Erro inesperado no BookAppointmentUseCase: %s", e)
            raise # Relança para que o endpoint capture e converta em 500


class GetAvailabilityUseCase:
    def __init__(self, appointment_repo: IAppointmentRepository):
        self.appointment_repo = appointment_repo

    async def execute(self, request: GetAvailabilityRequest) -> GetAvailabilityResponse:
        time_slots = []
        current = request.start_date

        while current < request.end_date:
            slot_end = current + timedelta(minutes=30)
            slot = TimeSlot(start=current, end=slot_end)

            is_available = True
            scheduled = await self.appointment_repo.find_scheduled_between(current, slot_end)
            for appt in scheduled:
                if appt.is_conflicting_with(
                        Appointment(
                            id=None,
                            client_name="",
                            client_email=Email("test@example.com"),
                            client_phone=None,
                            service_type=request.service_type,
                            scheduled_slot=slot
                        )
                ):
                    is_available=False
                    break

            time_slots.append(TimeSlotDTO(start=current, end=slot_end, is_available=is_available))
            current = slot_end

            return GetAvailabilityResponse(
                service_type=request.service_type,
                time_slots=time_slots
            )

class CancelAppointmentUseCase:
    def __init__(self, appointment_repo: IAppointmentRepository):
        self.appointment_repo = appointment_repo

    async def execute(self, request: CancelAppointmentRequest) -> CancelAppointmentResponse:

        appointment = await self.appointment_repo.find_by_token(request.cancellation_token)

        if not appointment:
            return CancelAppointmentResponse(
                success=False,
                message="Appointment not found or invalid token"
            )

        if appointment.status != AppointmentStatus.SCHEDULED:
            return CancelAppointmentResponse(
                success=False,
                message="Cannot cancel an appointment that is not scheduled"
            )

        appointment.cancel()
        await self.appointment_repo.update(appointment)

        return CancelAppointmentResponse(
            success=True,
            message="Appointment cancelled successfully"
        )
