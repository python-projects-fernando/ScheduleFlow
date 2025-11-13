from typing import Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import and_, select
from backend.application.interfaces.repositories import AppointmentRepository as IAppointmentRepository
from backend.core.models import Appointment as CoreAppointment, AppointmentStatus
from backend.core.value_objects import TimeSlot, Email
from ..database.models import AppointmentModel
from datetime import datetime
import uuid

class AppointmentRepository(IAppointmentRepository):
    def __init__(self, db_session: AsyncSession):
        self.db_session = db_session

    async def save(self, appointment: CoreAppointment) -> CoreAppointment:
        db_appointment = AppointmentModel(
            id=uuid.UUID(appointment.id) if appointment.id else None,
            client_name=appointment.client_name,
            client_email=appointment.client_email.value,
            client_phone=appointment.client_phone,
            service_type=appointment.service_type,
            scheduled_start=appointment.scheduled_slot.start,
            scheduled_end=appointment.scheduled_slot.end,
            status=appointment.status,
            cancellation_token=str(uuid.uuid4()) if appointment.id is None else appointment.id
        )

        self.db_session.add(db_appointment)
        await self.db_session.commit()
        await self.db_session.refresh(db_appointment)

        return self._to_domain_entity(db_appointment)

    async def find_by_id(self, appointment_id: str) -> Optional[CoreAppointment]:
        result = await self.db_session.execute(
            select(AppointmentModel).where(AppointmentModel.id == uuid.UUID(appointment_id))
        )
        db_appointment = result.scalar_one_or_none()

        if not db_appointment:
            return None

        return self._to_domain_entity(db_appointment)

    async def find_by_token(self, token: str) -> Optional[CoreAppointment]:
        result = await self.db_session.execute(
            select(AppointmentModel).where(AppointmentModel.cancellation_token == token)
        )
        db_appointment = result.scalar_one_or_none()

        if not db_appointment:
            return None

        return self._to_domain_entity(db_appointment)

    async def find_scheduled_between(self, start: datetime, end: datetime) -> List[CoreAppointment]:
        result = await self.db_session.execute(
            select(AppointmentModel).where(
                and_(
                    AppointmentModel.status == AppointmentStatus.SCHEDULED,
                    AppointmentModel.scheduled_start < end,
                    AppointmentModel.scheduled_end > start
                )
            )
        )
        db_appointments = result.scalars().all()

        return [self._to_domain_entity(appt) for appt in db_appointments]

    async def update(self, appointment: CoreAppointment) -> CoreAppointment:
        result = await self.db_session.execute(
            select(AppointmentModel).where(AppointmentModel.id == uuid.UUID(appointment.id))
        )
        db_appointment = result.scalar_one_or_none()

        if not db_appointment:
            raise ValueError(f"Appointment with id {appointment.id} not found")

        db_appointment.client_name = appointment.client_name
        db_appointment.client_email = appointment.client_email.value
        db_appointment.client_phone = appointment.client_phone
        db_appointment.service_type = appointment.service_type
        db_appointment.scheduled_start = appointment.scheduled_slot.start
        db_appointment.scheduled_end = appointment.scheduled_slot.end
        db_appointment.status = appointment.status
        db_appointment.updated_at = datetime.utcnow()

        await self.db_session.commit()
        await self.db_session.refresh(db_appointment)

        return self._to_domain_entity(db_appointment)

    async def delete(self, appointment_id: str) -> bool:
        result = await self.db_session.execute(
            select(AppointmentModel).where(AppointmentModel.id == uuid.UUID(appointment_id))
        )
        db_appointment = result.scalar_one_or_none()

        if not db_appointment:
            return False

        await self.db_session.delete(db_appointment)
        await self.db_session.commit()
        return True

    def _to_domain_entity(self, db_appointment: AppointmentModel) -> CoreAppointment:

        return CoreAppointment(
            id=str(db_appointment.id),
            client_name=db_appointment.client_name,
            client_email=Email(db_appointment.client_email),
            client_phone=db_appointment.client_phone,
            service_type=db_appointment.service_type,
            scheduled_slot=TimeSlot(
                start=db_appointment.scheduled_start,
                end=db_appointment.scheduled_end
            ),
            status=db_appointment.status,
            created_at=db_appointment.created_at,
            updated_at=db_appointment.updated_at
        )