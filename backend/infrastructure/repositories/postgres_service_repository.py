from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from backend.application.interfaces.repositories.service_repository import ServiceRepository
from backend.core.models.service import Service
from backend.infrastructure.models.service_model import ServiceModel
from backend.core.models.service_type import ServiceType
from typing import Optional
import uuid

class PostgresServiceRepository(ServiceRepository):

    def __init__(self, db_session: AsyncSession):
        self.db_session = db_session

    async def save(self, service: Service) -> Service:
        db_service = ServiceModel(
            id=uuid.UUID(service.id) if service.id else None,
            name=service.name,
            description=service.description,
            duration_minutes=service.duration_minutes,
            price=service.price,
            service_type=service.service_type
        )

        self.db_session.add(db_service)
        await self.db_session.commit()
        await self.db_session.refresh(db_service)

        if not service.id:
            service.id = str(db_service.id)
        return service

    async def find_by_id(self, service_id: str) -> Optional[Service]:
        try:
            service_uuid = uuid.UUID(service_id)
        except ValueError:
            return None

        stmt = select(ServiceModel).where(ServiceModel.id == service_uuid)
        result = await self.db_session.execute(stmt)
        db_service = result.scalar_one_or_none()

        if not db_service:
            return None

        return self._to_domain_entity(db_service)

    async def find_by_type(self, service_type: ServiceType) -> Optional[Service]:
        stmt = select(ServiceModel).where(ServiceModel.service_type == service_type)
        result = await self.db_session.execute(stmt)
        db_service = result.scalar_one_or_none()

        if not db_service:
            return None

        return self._to_domain_entity(db_service)

    async def find_by_name(self, name: str) -> Optional[Service]:
        stmt = select(ServiceModel).where(ServiceModel.name == name)
        result = await self.db_session.execute(stmt)
        db_service = result.scalar_one_or_none()

        if not db_service:
            return None

        return self._to_domain_entity(db_service)

    def _to_domain_entity(self, db_service: ServiceModel) -> Service:
        return Service(
            id=str(db_service.id),
            name=db_service.name,
            description=db_service.description,
            duration_minutes=db_service.duration_minutes,
            price=db_service.price,
            service_type=db_service.service_type,
            created_at=db_service.created_at,
            updated_at=db_service.updated_at
        )
