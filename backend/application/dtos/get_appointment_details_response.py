from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from backend.core.models.service_type import ServiceType
from backend.core.models.appointment_status import AppointmentStatus

class GetAppointmentDetailsResponse(BaseModel):
    success: bool
    message: str
    appointment_id: Optional[str] = None
    client_name: Optional[str] = None
    client_email: Optional[str] = None
    client_phone: Optional[str] = None
    service_name: Optional[str] = None
    service_description: Optional[str] = None
    service_duration_minutes: Optional[int] = None
    service_price: Optional[float] = None
    service_type: Optional[ServiceType] = None
    scheduled_start: Optional[datetime] = None
    scheduled_end: Optional[datetime] = None
    status: Optional[AppointmentStatus] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    error_code: Optional[str] = None
