from abc import ABC, abstractmethod
from typing import List, Optional
from backend.core.models.service import Service
from backend.core.models.service_type import ServiceType

class ServiceRepository(ABC):

    @abstractmethod
    async def save(self, service: Service) -> Service:
        pass

    @abstractmethod
    async def find_by_id(self, service_id: str) -> Optional[Service]:
        pass

    @abstractmethod
    async def find_by_type(self, service_type: ServiceType) -> Optional[Service]:
        pass

    @abstractmethod
    async def find_by_name(self, name: str) -> Optional[Service]:
        pass
