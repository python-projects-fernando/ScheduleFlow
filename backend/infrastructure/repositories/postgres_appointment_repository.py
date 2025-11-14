from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from backend.application.interfaces.repositories.appointment_repository import AppointmentRepository
from backend.core.models.appointment import Appointment
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

        # Converter de volta para entidade de domínio (opcional, dependendo do uso)
        # return self._to_domain_entity(db_appointment)
        # Ou simplesmente retornar o objeto original, ou o ID gerado:
        # Por exemplo, atualizar o ID do objeto original e retorná-lo:
        if not appointment.id:
            appointment.id = str(db_appointment.id)
        return appointment # Retorna a entidade de domínio modificada com o ID

    # Outros métodos do repositório virão aqui (find_by_id, find_scheduled_between, etc.)
    # async def find_by_id(self, appointment_id: str) -> Optional[CoreAppointment]:
    #     ...
    # async def find_scheduled_between(self, start: datetime, end: datetime) -> List[CoreAppointment]:
    #     ...

    # def _to_domain_entity(self, db_appointment: AppointmentModel) -> CoreAppointment:
    #     ... # Converte o modelo SQLAlchemy para a entidade de domínio