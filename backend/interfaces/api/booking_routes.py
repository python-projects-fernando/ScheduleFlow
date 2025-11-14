from fastapi import APIRouter, Depends, HTTPException
from typing import Annotated
from backend.application.dtos.book_appointment_request import BookAppointmentRequest
from backend.application.dtos.book_appointment_response import BookAppointmentResponse
from backend.interfaces.dependencies import get_book_appointment_use_case
from backend.application.use_cases.book_appointment_use_case import BookAppointmentUseCase

router = APIRouter(prefix="/booking", tags=["booking"])

@router.post("/", response_model=BookAppointmentResponse)
async def book_appointment(
    request: BookAppointmentRequest,
    use_case: Annotated[BookAppointmentUseCase, Depends(get_book_appointment_use_case)]
):
    response = await use_case.execute(request)

    if not response.success:
        status_code_map = {
            "VALIDATION_ERROR": 400,
            "TIME_SLOT_CONFLICT": 409,
            "SERVICE_NOT_FOUND": 404,
            "INTERNAL_ERROR": 500,
        }
        status_code = status_code_map.get(response.error_code, 400)
        raise HTTPException(status_code=status_code, detail=response.message)

    return response