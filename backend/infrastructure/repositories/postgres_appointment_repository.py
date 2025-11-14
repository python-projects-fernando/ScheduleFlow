from datetime import datetime
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_
from backend.application.interfaces.repositories.appointment_repository import AppointmentRepository
from backend.core.models.appointment import Appointment
from backend.core.models.appointment_status import AppointmentStatus
from backend.core.models.service_type import ServiceType
from backend.core.value_objects.email import Email
from backend.core.value_objects.time_slot import TimeSlot
from backend.infrastructure.models.appointment_model import AppointmentModel
import uuid

class PostgresAppointmentRepository(AppointmentRepository):

    def __init__(self, db_session: AsyncSession):
        self.db_session = db_session

    async def save(self, appointment: Appointment) -> Appointment:
        db_appointment = AppointmentModel(
            id=uuid.UUID(appointment.id) if appointment.id else None,
            client_name=appointment.client_name,
            client_email=appointment.client_email.value,
            client_phone=appointment.client_phone,
            service_type=appointment.service_type,
            scheduled_start=appointment.scheduled_slot.start,
            scheduled_end=appointment.scheduled_slot.end,
            status=appointment.status,
            created_at=appointment.created_at,
            updated_at=appointment.updated_at
        )

        self.db_session.add(db_appointment)
        await self.db_session.commit()
        await self.db_session.refresh(db_appointment)

        if not appointment.id:
            appointment.id = str(db_appointment.id)
        return appointment

    async def find_scheduled_between(self, start: datetime, end: datetime, service_type: ServiceType) -> List[Appointment]:
        stmt = select(AppointmentModel).where(
            and_(
                AppointmentModel.status == AppointmentStatus.SCHEDULED,
                AppointmentModel.service_type == service_type,
                AppointmentModel.scheduled_start < end,
                AppointmentModel.scheduled_end > start
            )
        )

        result = await self.db_session.execute(stmt)
        db_appointments = result.scalars().all()

        domain_appointments = []
        for db_app in db_appointments:
            domain_appointments.append(
                Appointment(
                    id=str(db_app.id),
                    client_name=db_app.client_name,
                    client_email=Email(db_app.client_email),
                    client_phone=db_app.client_phone,
                    service_type=db_app.service_type,
                    scheduled_slot=TimeSlot(start=db_app.scheduled_start, end=db_app.scheduled_end),
                    status=db_app.status,
                    created_at=db_app.created_at,
                    updated_at=db_app.updated_at
                )
            )
        return domain_appointments