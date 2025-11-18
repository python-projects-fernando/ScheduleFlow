from fastapi import APIRouter
from backend.application.dtos.service_types_response import ServiceTypesResponse

router = APIRouter(prefix="/services", tags=["services"])

@router.get("/types", response_model=ServiceTypesResponse)
async def get_service_types():
    return ServiceTypesResponse.from_enum()
