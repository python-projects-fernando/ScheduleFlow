from dataclasses import dataclass
from datetime import datetime, timezone
from typing import Optional
from enum import Enum
from .value_objects import Email, TimeSlot

class AppointmentStatus(Enum):
    SCHEDULED = "scheduled"
    COMPLETED = "completed"
    CANCELLED = "cancelled"
    NO_SHOW = "no_show"

class ServiceType(Enum):
    CONSULTATION = "consultation"
    FOLLOW_UP = "follow_up"
    EMERGENCY = "emergency"

@dataclass
class Service:
    id: Optional[str]
    name: str
    description: str
    duration: int
    price: Optional[float] = None

    def __post_init__(self):
        if self.duration <= 0:
            raise ValueError("Service duration must be positive")
        if self.price is not None and self.price < 0:
            raise ValueError("Service price cannot be negative")

@dataclass
class Appointment:
    id: Optional[str]
    client_name: str
    client_email: Email
    client_phone: Optional[str]
    service_type: ServiceType
    scheduled_slot: TimeSlot
    status: AppointmentStatus = AppointmentStatus.SCHEDULED
    created_at: datetime = None
    updated_at: datetime = None

    def __post_init__(self):
        if not self.client_name.strip():
            raise ValueError("Client name cannot be empty")
        if self.client_phone:
            cleaned_phone = ''.join(filter(str.isdigit, self.client_phone))
            if not cleaned_phone:
                raise ValueError("Phone number must contain at least one digit")
            if len(cleaned_phone) < 10:
                raise ValueError("Phone number seems too short")
        if self.created_at is None:
            self.created_at = datetime.now(timezone.utc)
        if self.updated_at is None:
            self.updated_at = datetime.now(timezone.utc)

    def cancel(self) -> None:
        self.status = AppointmentStatus.CANCELLED
        self.updated_at = datetime.now(timezone.utc)

    def complete(self) -> None:
        if self.status != AppointmentStatus.SCHEDULED:
            raise ValueError("Cannot complete an appointment that is not scheduled")
        self.status = AppointmentStatus.COMPLETED
        self.updated_at = datetime.now(timezone.utc)

    def is_conflicting_with(self, other: 'Appointment') -> bool:
        return self.scheduled_slot.overlaps(other.scheduled_slot)