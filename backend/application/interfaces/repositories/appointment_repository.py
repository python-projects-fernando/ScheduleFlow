from abc import ABC, abstractmethod
from backend.core.models.appointment import Appointment

class AppointmentRepository(ABC):

    @abstractmethod
    async def save(self, appointment: Appointment) -> Appointment:
        pass