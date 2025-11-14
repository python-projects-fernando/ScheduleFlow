from dataclasses import dataclass
from email_validator import validate_email, EmailNotValidError

@dataclass(frozen=True)
class Email:
    value: str

    def __post_init__(self):
        try:
            validated = validate_email(self.value, check_deliverability=False)
            normalized_email = validated.normalized
            object.__setattr__(self, "value", normalized_email)
        except EmailNotValidError:
            raise ValueError(f"Invalid email: {self.value}")