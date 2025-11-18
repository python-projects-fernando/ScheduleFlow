from pydantic import BaseModel
from backend.core.models.service_type import ServiceType
class RegisterServiceRequest(BaseModel):
    name: str
    description: str
    duration_minutes: int
    price: float | None = None
    service_type: ServiceType