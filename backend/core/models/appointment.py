import uuid
from dataclasses import dataclass
from datetime import datetime, timezone
from typing import Optional

from backend.core.models.appointment_status import AppointmentStatus
from backend.core.models.service_type import ServiceType
from backend.core.value_objects.email import Email
from backend.core.value_objects.time_slot import TimeSlot

@dataclass
class Appointment:
    id: Optional[str]
    user_id: str
    service_type: ServiceType
    scheduled_slot: TimeSlot
    status: AppointmentStatus = AppointmentStatus.SCHEDULED
    view_token: str = None
    cancellation_token: Optional[str] = None
    created_at: datetime = None
    updated_at: datetime = None


    def __post_init__(self):
        if not self.user_id:  # Validação: user_id é obrigatório
            raise ValueError("User ID cannot be empty")
        if self.created_at is None:
            self.created_at = datetime.now(timezone.utc)
        if self.updated_at is None:
            self.updated_at = datetime.now(timezone.utc)
        if self.view_token is None:
            self.view_token = str(uuid.uuid4())
        if self.cancellation_token is None:
           self.cancellation_token = str(uuid.uuid4())

    def cancel(self) -> None:
        if self.status != AppointmentStatus.SCHEDULED:
             raise ValueError("Cannot cancel an appointment that is not scheduled")
        self.status = AppointmentStatus.CANCELLED
        self.updated_at = datetime.now(timezone.utc)

    def complete(self) -> None:
        if self.status != AppointmentStatus.SCHEDULED:
            raise ValueError("Cannot complete an appointment that is not scheduled")
        self.status = AppointmentStatus.COMPLETED
        self.updated_at = datetime.now(timezone.utc)

    def is_conflicting_with(self, other: 'Appointment') -> bool:
        return self.scheduled_slot.overlaps(other.scheduled_slot)