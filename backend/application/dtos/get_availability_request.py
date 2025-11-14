from pydantic import BaseModel, Field
from datetime import datetime
from backend.core.models.service_type import ServiceType

class GetAvailabilityRequest(BaseModel):
    service_type: ServiceType = Field(..., description="Type of service to check availability for")
    start_date: datetime = Field(..., description="Start of the time range to check (ISO 8601 format)")
    end_date: datetime = Field(..., description="End of the time range to check (ISO 8601 format)")

    def __init__(self, **data):
        super().__init__(**data)
        if self.start_date >= self.end_date:
            raise ValueError("start_date must be before end_date")
