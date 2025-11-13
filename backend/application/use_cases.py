from typing import List
from datetime import datetime, timedelta, timezone
import uuid
from .dtos import (
    BookAppointmentRequest, BookAppointmentResponse,
    GetAvailabilityRequest, GetAvailabilityResponse, TimeSlotDTO,
    CancelAppointmentRequest, CancelAppointmentResponse
)

from backend.core.models import Appointment, AppointmentStatus, ServiceType
from backend.core.value_objects import Email, TimeSlot
from backend.application.interfaces.repositories import AppointmentRepository as IAppointmentRepository, ServiceRepository as IServiceRepository


class BookAppointmentUseCase:
    def __init__(self, appointment_repo: IAppointmentRepository, service_repo: IServiceRepository):
        self.appointment_repo = appointment_repo
        self.service_repo = service_repo

    async def execute(self, request: BookAppointmentRequest) -> BookAppointmentResponse: # Garantir que 'request' é o primeiro argumento após 'self'
        # Validar se o horário solicitado está disponível
        # 1. Verificar se já existe um agendamento no mesmo horário
        overlapping_appointments = await self.appointment_repo.find_scheduled_between(
            request.requested_datetime,
            request.requested_datetime + timedelta(minutes=30)  # Assumindo duração padrão
        )

        for appt in overlapping_appointments:
            requested_slot = TimeSlot(request.requested_datetime, request.requested_datetime + timedelta(minutes=30))
            # Criação temporária para verificar conflito
            temp_appointment = Appointment(
                id=None,
                client_name=request.client_name,
                client_email=Email(request.client_email),
                client_phone=request.client_phone,
                service_type=request.service_type,
                scheduled_slot=requested_slot
            )
            if appt.is_conflicting_with(temp_appointment):
                return BookAppointmentResponse(
                    success=False,
                    message="The requested time slot is not available",
                    error_code="TIME_SLOT_CONFLICT"
                )

        # 2. Criar o agendamento
        service = await self.service_repo.find_by_type(request.service_type)
        if not service:
            return BookAppointmentResponse(
                success=False,
                message="Service type not found",
                error_code="SERVICE_NOT_FOUND"
            )

        appointment = Appointment(
            id=str(uuid.uuid4()),
            client_name=request.client_name,
            client_email=Email(request.client_email),
            client_phone=request.client_phone,
            service_type=request.service_type,
            scheduled_slot=TimeSlot(
                start=request.requested_datetime,
                end=request.requested_datetime + timedelta(minutes=service.duration) # Usar duração do serviço
            )
        )

        # 3. Salvar
        saved_appointment = await self.appointment_repo.save(appointment)

        return BookAppointmentResponse(
            success=True,
            message="Appointment booked successfully",
            appointment_id=saved_appointment.id
        )

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
