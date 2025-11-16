from pydantic import BaseModel
from typing import List
from backend.core.models.service_type import ServiceType
from .time_slot_dto import TimeSlotDTO
from .service_summary_dto import ServiceSummaryDTO

class GetAvailabilityResponse(BaseModel):
    service_type: ServiceType
    time_slots: List[TimeSlotDTO]
    available_services: List[ServiceSummaryDTO]
