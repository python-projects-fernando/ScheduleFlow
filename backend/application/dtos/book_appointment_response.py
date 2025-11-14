from pydantic import BaseModel
from typing import Optional

class BookAppointmentResponse(BaseModel):
    success: bool
    message: str
    appointment_id: Optional[str] = None
    view_token: Optional[str] = None
    cancellation_token: Optional[str] = None
    error_code: Optional[str] = None