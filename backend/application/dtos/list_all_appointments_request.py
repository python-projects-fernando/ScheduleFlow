from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from backend.core.models.appointment_status import AppointmentStatus
from backend.core.models.service_type import ServiceType

class ListAllAppointmentsRequest(BaseModel):
    status: Optional[AppointmentStatus] = None
    service_type: Optional[ServiceType] = None
    date_from: Optional[datetime] = None
    date_to: Optional[datetime] = None
