from pydantic import BaseModel
from typing import List
from .appointment_summary_dto import AppointmentSummaryDTO

class ListMyAppointmentsResponse(BaseModel):
    success: bool
    message: str
    appointments: List[AppointmentSummaryDTO]
    total_count: int
    error_code: str | None = None
