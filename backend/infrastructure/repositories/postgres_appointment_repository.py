from datetime import datetime
from typing import List, Optional
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
            user_id = uuid.UUID(appointment.user_id),
            service_type=appointment.service_type,
            scheduled_start=appointment.scheduled_slot.start,
            scheduled_end=appointment.scheduled_slot.end,
            status=appointment.status,
            view_token=appointment.view_token,
            cancellation_token=appointment.cancellation_token,
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
                    user_id=str(db_app.user_id),
                    service_type=db_app.service_type,
                    scheduled_slot=TimeSlot(start=db_app.scheduled_start, end=db_app.scheduled_end),
                    status=db_app.status,
                    created_at=db_app.created_at,
                    updated_at=db_app.updated_at
                )
            )
        return domain_appointments

    async def find_by_user_id(self, user_id: str) -> List[Appointment]:
        try:
            user_uuid = uuid.UUID(user_id)
        except ValueError:
            return []

        stmt = select(AppointmentModel).where(AppointmentModel.user_id == user_uuid)
        result = await self.db_session.execute(stmt)
        db_appointments = result.scalars().all()

        domain_appointments = []
        for db_app in db_appointments:
            domain_appointments.append(self._to_domain_entity(db_app))

        return domain_appointments

    async def find_all_filtered(
            self,
            status: Optional[AppointmentStatus] = None,
            service_type: Optional[ServiceType] = None,
            date_from: Optional[datetime] = None,
            date_to: Optional[datetime] = None
    ) -> List[Appointment]:

        stmt = select(AppointmentModel)

        conditions = []
        if status is not None:
            conditions.append(AppointmentModel.status == status)
        if service_type is not None:
            conditions.append(AppointmentModel.service_type == service_type)
        if date_from is not None:
            conditions.append(AppointmentModel.scheduled_end > date_from)
        if date_to is not None:
            conditions.append(AppointmentModel.scheduled_start < date_to)

        if conditions:
            stmt = stmt.where(and_(*conditions))

        result = await self.db_session.execute(stmt)
        db_appointments = result.scalars().all()

        domain_appointments = []
        for db_app in db_appointments:
            domain_appointments.append(self._to_domain_entity(db_app))

        return domain_appointments


    async def find_by_view_token(self, token: str) -> Optional[Appointment]:
        stmt = select(AppointmentModel).where(AppointmentModel.view_token == token)
        result = await self.db_session.execute(stmt)
        db_appointment = result.scalar_one_or_none()

        if not db_appointment:
            return None

        return self._to_domain_entity(db_appointment)

    async def find_by_cancellation_token(self, token: str) -> Optional[Appointment]:
        stmt = select(AppointmentModel).where(AppointmentModel.cancellation_token == token)
        result = await self.db_session.execute(stmt)
        db_appointment = result.scalar_one_or_none()

        if not db_appointment:
            return None

        return self._to_domain_entity(db_appointment)

    async def update(self, appointment: Appointment) -> Appointment:
        stmt = select(AppointmentModel).where(AppointmentModel.id == uuid.UUID(appointment.id))
        result = await self.db_session.execute(stmt)
        db_appointment = result.scalar_one()

        db_appointment.status = appointment.status
        db_appointment.updated_at = appointment.updated_at

        await self.db_session.commit()
        await self.db_session.refresh(db_appointment)

        return self._to_domain_entity(db_appointment)

    def _to_domain_entity(self, db_appointment: AppointmentModel) -> Appointment:
        return Appointment(
            id=str(db_appointment.id),
            user_id=str(db_appointment.user_id),
            service_type=db_appointment.service_type,
            scheduled_slot=TimeSlot(
                start=db_appointment.scheduled_start,
                end=db_appointment.scheduled_end
            ),
            status=db_appointment.status,
            cancellation_token=db_appointment.cancellation_token,
            created_at=db_appointment.created_at,
            updated_at=db_appointment.updated_at,
        )