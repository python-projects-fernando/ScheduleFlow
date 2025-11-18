from pydantic import BaseModel
from typing import Optional
class RegisterServiceResponse(BaseModel):
    success: bool
    message: str
    service_id: Optional[str] = None
    error_code: Optional[str] = None