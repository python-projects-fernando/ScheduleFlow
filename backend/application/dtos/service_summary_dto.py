from pydantic import BaseModel
from datetime import datetime
from backend.core.models.service_type import ServiceType

class ServiceSummaryDTO(BaseModel):
    id: str
    name: str
    description: str
    duration_minutes: int
    price: float | None = None
    service_type: ServiceType
    created_at: datetime | None = None
    updated_at: datetime | None = None
