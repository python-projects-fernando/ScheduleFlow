from dataclasses import dataclass
@dataclass(frozen=True)
class ServiceDuration:
    minutes: int

    def __post_init__(self):
        if self.minutes <= 0:
            raise ValueError("Service duration must be positive")
        if self.minutes % 15 != 0:
            raise ValueError("Service duration should be a multiple of 15 minutes")