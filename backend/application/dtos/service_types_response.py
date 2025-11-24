from pydantic import BaseModel
from typing import List
from backend.core.models.service_type import ServiceType

class ServiceTypesResponse(BaseModel):
    types: List[str]

    @classmethod
    def from_enum(cls):
        return cls(types=[member.value for member in ServiceType])
