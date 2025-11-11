from dataclasses import dataclass
from datetime import datetime
from typing import Optional
from email_validator import validate_email, EmailNotValidError

@dataclass(frozen=True)
class Email:
    value: str

    def __post_init__(self):
        try:
            validated = validate_email(self.value)
            object.__setattr__(self, "value", validated["email"])
        except  EmailNotValidError:
            raise ValueError(f"Invalid email: {self.value}")

@dataclass(frozen=True)
class TimeSlot:
    start: datetime
    end: datetime

    def __post_init__(self):
        if self.start >= self.end:
            raise ValueError("Start time must be before end time")

    def overlaps(self, other: 'TimeSlot') -> bool:
        return self.start < other.end and other.start < self.end

    def contains(self, dt:datetime) -> bool:
        return self.start <= dt <= self.end


@dataclass(frozen=True)
class ServiceDuration:
    minutes: int

    def __post_init__(self):
        if self.minutes <= 0:
            raise ValueError("Service duration must be positive")
        if self.minutes % 15 != 0:
            raise ValueError("Service duration should be a multiple of 15 minutes")