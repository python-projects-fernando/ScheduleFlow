from pydantic import BaseModel
from datetime import datetime
from backend.core.models.service_type import ServiceType
from backend.core.value_objects.email import Email

class BookAppointmentRequest(BaseModel):
    client_name: str
    client_email: str
    client_phone: str
    service_type: ServiceType
    requested_datetime: datetime