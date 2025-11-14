from abc import ABC, abstractmethod
from datetime import datetime
from typing import List

from backend.core.models.appointment import Appointment
from backend.core.models.service_type import ServiceType


class AppointmentRepository(ABC):

    @abstractmethod
    async def save(self, appointment: Appointment) -> Appointment:
        pass

    @abstractmethod
    async def find_scheduled_between(self, start: datetime, end: datetime, service_type: ServiceType) -> List[
        Appointment]:
        pass