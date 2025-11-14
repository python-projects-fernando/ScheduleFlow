from pydantic import BaseModel
from typing import Optional

class CancelAppointmentResponse(BaseModel):
    success: bool
    message: str
    error_code: Optional[str] = None