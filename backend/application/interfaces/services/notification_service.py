from abc import ABC, abstractmethod
from typing import Dict, Any

class NotificationService(ABC):

    @abstractmethod
    async def send_appointment_confirmation(self, recipient: str, details: Dict[str, Any]) -> bool:
        pass

    @abstractmethod
    async def send_appointment_reminder(self, recipient: str, details: Dict[str, Any]) -> bool:
        pass

    @abstractmethod
    async def send_appointment_cancellation(self, recipient: str, details: Dict[str, Any]) -> bool:
        pass
