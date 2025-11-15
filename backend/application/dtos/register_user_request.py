from pydantic import BaseModel, EmailStr
from typing import Optional

class RegisterUserRequest(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    password: str
