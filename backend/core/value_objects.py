# backend/core/value_objects.py
from dataclasses import dataclass
from datetime import datetime, timezone
from typing import Optional
from email_validator import validate_email, EmailNotValidError

@dataclass(frozen=True)
class Email:
    value: str

    def __post_init__(self):
        try:
            validated = validate_email(self.value, check_deliverability=False)
            normalized_email = validated.normalized # Corrigir de .email
            object.__setattr__(self, "value", normalized_email)
        except EmailNotValidError:
            raise ValueError(f"Invalid email: {self.value}")

@dataclass(frozen=True)
class TimeSlot:
    start: datetime
    end: datetime

    def __post_init__(self):
        # Converter para offset-aware (UTC) se necessário
        if self.start.tzinfo is None:
            object.__setattr__(self, "start", self.start.replace(tzinfo=timezone.utc))
        if self.end.tzinfo is None:
            object.__setattr__(self, "end", self.end.replace(tzinfo=timezone.utc))

        if self.start >= self.end:
            raise ValueError("Start time must be before end time")

    def overlaps(self, other: 'TimeSlot') -> bool:
        """Check if this time slot overlaps with another."""
        return self.start < other.end and other.start < self.end

    def contains(self, dt: datetime) -> bool:
        """Check if a datetime falls within this time slot."""
        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=timezone.utc)
        return self.start <= dt <= self.end

@dataclass(frozen=True)
class ServiceDuration:
    minutes: int

    def __post_init__(self):
        if self.minutes <= 0:
            raise ValueError("Service duration must be positive")
        if self.minutes % 15 != 0:
            raise ValueError("Service duration should be a multiple of 15 minutes")