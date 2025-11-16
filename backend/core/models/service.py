from dataclasses import dataclass
from datetime import datetime, timezone
from typing import Optional
from enum import Enum
import uuid
from .service_type import ServiceType

@dataclass
class Service:
    id: Optional[str]
    name: str
    description: str
    duration_minutes: int
    service_type: ServiceType
    price: Optional[float] = None
    created_at: datetime = None
    updated_at: datetime = None

    def __post_init__(self):
        if not self.name.strip():
            raise ValueError("Service name cannot be empty")
        if not self.description.strip():
            raise ValueError("Service description cannot be empty")
        if self.duration_minutes <= 0:
            raise ValueError("Service duration must be positive")
        if self.price is not None and self.price < 0:
            raise ValueError("Service price cannot be negative")
        if self.created_at is None:
            self.created_at = datetime.now(timezone.utc)
        if self.updated_at is None:
            self.updated_at = datetime.now(timezone.utc)
