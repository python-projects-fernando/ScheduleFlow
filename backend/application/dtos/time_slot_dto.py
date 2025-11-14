from pydantic import BaseModel
from datetime import datetime

class TimeSlotDTO(BaseModel):
    start: datetime
    end: datetime
    is_available: bool