from dataclasses import dataclass
from datetime import datetime
from typing import Optional
from backend.core.models import AppointmentStatus, ServiceType
from backend.core.value_objects import Email

@dataclass
class BookAppointmentRequest:
    client_name: str
    client_email: str
    client_phone: Optional[str]
    service_type = ServiceType
    requested_datetime: datetime

@dataclass
class BookAppointmentResponse:
    success: bool
    message: str
    appointment_id: Optional[str] = None
    error_code: Optional[str] = None

@dataclass
class TimeSlotDTO:
    start: datetime
    end: datetime
    is_available: bool

@dataclass
class GetAvailabilityRequest:
    service_type: ServiceType
    start_date: datetime
    end_date: datetime

@dataclass
class GetAvailabilityResponse:
    service_type: ServiceType
    time_slots: list[TimeSlotDTO]

@dataclass
class CancelAppointmentRequest:
    appointment_id: str
    cancellation_token: str

@dataclass
class CancelAppointmentResponse:
    success: bool
    message: str