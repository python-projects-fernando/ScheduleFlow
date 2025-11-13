from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from backend.application.use_cases import BookAppointmentUseCase, GetAvailabilityUseCase
from backend.application.dtos import (
    BookAppointmentRequest, BookAppointmentResponse,
    GetAvailabilityRequest, GetAvailabilityResponse
)
from backend.infrastructure.database.session import get_db_session
from backend.infrastructure.repositories.appointment_repository import AppointmentRepository
from backend.infrastructure.repositories.service_repository import ServiceRepository

router = APIRouter()

async def get_appointment_use_case(db: AsyncSession = Depends(get_db_session)):
    appointment_repo = AppointmentRepository(db)
    service_repo = ServiceRepository(db)
    return BookAppointmentUseCase(appointment_repo, service_repo)

async def get_availability_use_case(db: AsyncSession = Depends(get_db_session)):
    appointment_repo = AppointmentRepository(db)
    return GetAvailabilityUseCase(appointment_repo)

@router.post("/book", response_model=BookAppointmentResponse)
async def book_appointment(
    request: BookAppointmentRequest,
    use_case: BookAppointmentUseCase = Depends(get_appointment_use_case)
):
    try:
        response = await use_case.execute(request)
        if not response.success:
            raise HTTPException(status_code=400, detail=response.message)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")

@router.post("/availability", response_model=GetAvailabilityResponse)
async def get_availability(
    request: GetAvailabilityRequest,
    use_case: GetAvailabilityUseCase = Depends(get_availability_use_case)
):
    try:
        return await use_case.execute(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")