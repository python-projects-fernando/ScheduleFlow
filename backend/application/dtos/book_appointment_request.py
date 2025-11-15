from pydantic import BaseModel
from datetime import datetime
from backend.core.models.service_type import ServiceType


class BookAppointmentRequest(BaseModel):
    service_type: ServiceType
    requested_datetime: datetime