from dataclasses import dataclass
from datetime import datetime, timezone
from typing import Optional
from backend.core.value_objects.email import Email
from backend.core.value_objects.hashed_password import HashedPassword
import uuid

@dataclass
class User:
    id: Optional[str]
    name: str
    email: Email
    phone: Optional[str] = None
    hashed_password: HashedPassword = None
    created_at: datetime = None
    updated_at: datetime = None

    def __post_init__(self):
        if not self.name.strip():
            raise ValueError("User name cannot be empty")

        if self.phone and not ''.join(filter(str.isdigit, self.phone)):
            raise ValueError("Phone number must contain at least one digit")

        if self.hashed_password is not None and not isinstance(self.hashed_password, HashedPassword):
            raise ValueError("hashed_password must be an instance of HashedPassword VO or None")

        if self.id is None:
            self.id = str(uuid.uuid4())

        if self.created_at is None:
            self.created_at = datetime.now(timezone.utc)

        if self.updated_at is None:
            self.updated_at = datetime.now(timezone.utc)

    def update_profile(self, name: Optional[str] = None, email: Optional[Email] = None, phone: Optional[str] = None):
        if name is not None:
            self.name = name.strip()
            if not self.name:
                raise ValueError("Name cannot be empty after update")

        if email is not None:
            self.email = email

        if phone is not None:
            if phone and not ''.join(filter(str.isdigit, phone)):
                raise ValueError("Phone number must contain at least one digit after update")
            self.phone = phone

        self.updated_at = datetime.now(timezone.utc)

    def set_password(self, password_hash_value: str):
        if not password_hash_value:
            raise ValueError("Password hash cannot be empty")
        self.hashed_password = HashedPassword(value=password_hash_value)
        self.updated_at = datetime.now(timezone.utc)
