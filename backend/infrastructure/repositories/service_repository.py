from typing import Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from backend.application.interfaces.repositories import ServiceRepository as IServiceRepository
from backend.core.models import Service as CoreService, ServiceType
from ..database.models import ServiceModel
import uuid

class ServiceRepository(IServiceRepository):
    def __init__(self, db_session: AsyncSession):
        self.db_session = db_session

    async def find_by_type(self, service_type: ServiceType) -> Optional[CoreService]:
        result = await self.db_session.execute(
            select(ServiceModel).where(ServiceModel.name == service_type.value)
        )
        db_service = result.scalar_one_or_none()

        if not db_service:
            return None

        return self._to_domain_entity(db_service)

    async def list_all(self) -> List[CoreService]:
        result = await self.db_session.execute(select(ServiceModel))
        db_services = result.scalars().all()
        return [self._to_domain_entity(service) for service in db_services]

    def _to_domain_entity(self, db_service: ServiceModel) -> CoreService:
        return CoreService(
            id=str(db_service.id),
            name=db_service.name,
            description=db_service.description,
            duration=db_service.duration,
            price=db_service.price / 100 if db_service.price else None
        )