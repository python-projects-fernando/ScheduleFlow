from datetime import datetime, timezone
from dataclasses import dataclass

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