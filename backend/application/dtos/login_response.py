from pydantic import BaseModel
from typing import Optional

class LoginResponse(BaseModel):
    success: bool
    message: str
    access_token: Optional[str] = None
    token_type: Optional[str] = None
    user_id: Optional[str] = None
    error_code: Optional[str] = None
