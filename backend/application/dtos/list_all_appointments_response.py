from pydantic import BaseModel
from typing import List

from .admin_appointment_summary_dto import AdminAppointmentSummaryDTO


class ListAllAppointmentsResponse(BaseModel):
    success: bool
    message: str
    appointments: List[AdminAppointmentSummaryDTO]
    total_count: int
    error_code: str | None = None
