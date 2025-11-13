from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from backend.application.use_cases import CancelAppointmentUseCase
from backend.application.dtos import CancelAppointmentRequest, CancelAppointmentResponse
from backend.infrastructure.database.session import get_db_session
from backend.infrastructure.repositories.appointment_repository import AppointmentRepository
from backend.interfaces.api.auth_routes import get_current_admin

router = APIRouter()

async def get_cancel_use_case(db: AsyncSession = Depends(get_db_session)):
    appointment_repo = AppointmentRepository(db)
    return CancelAppointmentUseCase(appointment_repo)

@router.get("/appointments")
async def list_appointments(current_admin: str = Depends(get_current_admin)):

    return {"message": "List appointments endpoint"}

@router.post("/appointments/{appointment_id}/cancel", response_model=CancelAppointmentResponse)
async def cancel_appointment(
    appointment_id: str,
    request: CancelAppointmentRequest,
    use_case: CancelAppointmentUseCase = Depends(get_cancel_use_case),
    current_admin: str = Depends(get_current_admin)
):

    try:
        return await use_case.execute(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")