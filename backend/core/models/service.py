from dataclasses import dataclass
from typing import Optional


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