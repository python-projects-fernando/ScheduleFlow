from pydantic import BaseModel
from typing import Optional

class AdminLoginResponse(BaseModel):
    success: bool
    message: str
    role: str = "admin"
    access_token: Optional[str] = None
    token_type: Optional[str] = None
    error_code: Optional[str] = None