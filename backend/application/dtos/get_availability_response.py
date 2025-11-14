from pydantic import BaseModel
from typing import List
from backend.core.models.service_type import ServiceType
from .time_slot_dto import TimeSlotDTO

class GetAvailabilityResponse(BaseModel):
    service_type: ServiceType
    time_slots: List[TimeSlotDTO]