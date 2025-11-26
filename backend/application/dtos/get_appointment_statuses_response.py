from pydantic import BaseModel
from typing import List
from backend.core.models.appointment_status import AppointmentStatus

class GetAppointmentStatusesResponse(BaseModel):
    success: bool
    message: str
    statuses: List[str]

    @classmethod
    def from_enum(cls):
        status_values = [status.value for status in AppointmentStatus]
        return cls(
            success=True,
            message="Appointment statuses retrieved successfully",
            statuses=status_values
        )
