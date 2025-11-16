from pydantic import BaseModel
from datetime import datetime
from backend.core.models.service_type import ServiceType
from backend.core.models.appointment_status import AppointmentStatus

class AdminAppointmentSummaryDTO(BaseModel):
    id: str
    client_name: str
    client_email: str
    client_phone: str | None = None
    service_type: ServiceType
    scheduled_start: datetime
    scheduled_end: datetime
    status: AppointmentStatus
    view_token: str
    cancellation_token: str
    created_at: datetime
    updated_at: datetime