from dataclasses import dataclass
import re

@dataclass(frozen=True)
class HashedPassword:
    value: str

    def __post_init__(self):
        if not self.value:
            raise ValueError("Hashed password cannot be empty")

        bcrypt_pattern = r'^\$2[ayb]\$\d{2}\$[A-Za-z0-9./]{53}$'
        if not re.match(bcrypt_pattern, self.value):
            generic_pattern = r'^\$[^$]+\$[^$]+\$.*$'
            if not re.match(generic_pattern, self.value):
                raise ValueError(f"Invalid hashed password format: {self.value}")

        if len(self.value) < 60:
            raise ValueError(f"Hashed password seems too short: {len(self.value)} characters")
