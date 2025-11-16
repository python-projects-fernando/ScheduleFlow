from abc import ABC, abstractmethod
from datetime import datetime
from typing import List, Optional

from backend.core.models.appointment import Appointment
from backend.core.models.appointment_status import AppointmentStatus
from backend.core.models.service_type import ServiceType


class AppointmentRepository(ABC):

    @abstractmethod
    async def save(self, appointment: Appointment) -> Appointment:
        pass

    @abstractmethod
    async def find_scheduled_between(self, start: datetime, end: datetime, service_id: str) -> List[Appointment]:
        pass

    @abstractmethod
    async def find_scheduled_between_for_user(self, user_id: str, start: datetime, end: datetime) -> List[Appointment]:
        pass

    @abstractmethod
    async def find_by_user_id(self, user_id: str) -> List[Appointment]:
        pass

    @abstractmethod
    async def find_all_filtered(
            self,
            status: Optional[AppointmentStatus] = None,
            service_type: Optional[ServiceType] = None,
            date_from: Optional[datetime] = None,
            date_to: Optional[datetime] = None
    ) -> List[Appointment]:
        pass

    @abstractmethod
    async def find_by_view_token(self, token: str) -> Optional[Appointment]:
        pass

    @abstractmethod
    async def find_by_cancellation_token(self, token: str) -> Optional[Appointment]:
        pass

    @abstractmethod
    async def update(self, appointment: Appointment) -> Appointment:
        pass
