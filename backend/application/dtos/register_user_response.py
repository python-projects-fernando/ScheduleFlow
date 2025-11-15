from pydantic import BaseModel
from typing import Optional

class RegisterUserResponse(BaseModel):
    success: bool
    message: str
    user_id: Optional[str] = None
    error_code: Optional[str] = None
