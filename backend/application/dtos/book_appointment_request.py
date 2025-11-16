from pydantic import BaseModel
from datetime import datetime


class BookAppointmentRequest(BaseModel):
    service_id: str
    requested_datetime: datetime