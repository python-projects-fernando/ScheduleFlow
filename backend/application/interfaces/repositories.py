from datetime import datetime
from abc import ABC, abstractmethod
from typing import Optional, List
from backend.core.models import Appointment, Service
from backend.core.value_objects import TimeSlot

class AppointmentRepository(ABC):
    @abstractmethod
    async def save(self, appointment: Appointment) -> Appointment:
        pass

    @abstractmethod
    async def update(self, appointment: Appointment) -> Appointment:
        pass

    @abstractmethod
    async def delete(self, appointment_id: str) -> bool:
        pass

    @abstractmethod
    async def find_by_id(self, appointment_id: str) -> Optional[Appointment]:
        pass

    @abstractmethod
    async def find_by_token(self, token:str) -> Optional[Appointment]:
        pass

    @abstractmethod
    async def find_scheduled_between(self, start:datetime, end: datetime) -> List[Appointment]:
        pass



class ServiceRepository(ABC):
    @abstractmethod
    async def find_by_type(self, service_type: 'ServiceType') -> Optional[Service]:
        pass

    @abstractmethod
    async def list_all(self) -> List[Service]:
        pass
