from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status, Query

from backend.application.dtos.book_appointment_request import BookAppointmentRequest
from backend.application.dtos.book_appointment_response import BookAppointmentResponse
from backend.application.dtos.cancel_appointment_request import CancelAppointmentRequest
from backend.application.dtos.cancel_appointment_response import CancelAppointmentResponse
from backend.application.dtos.get_appointment_details_request import GetAppointmentDetailsRequest
from backend.application.dtos.get_appointment_details_response import GetAppointmentDetailsResponse
from backend.application.dtos.get_availability_request import GetAvailabilityRequest
from backend.application.dtos.get_availability_response import GetAvailabilityResponse
from backend.application.dtos.list_my_appointments_response import ListMyAppointmentsResponse
from backend.application.use_cases.cancel_appointment_use_case import CancelAppointmentUseCase
from backend.application.use_cases.get_appointment_details_use_case import GetAppointmentDetailsUseCase
from backend.application.use_cases.get_availability_use_case import GetAvailabilityUseCase
from backend.application.use_cases.book_appointment_use_case import BookAppointmentUseCase
from backend.application.use_cases.list_my_appointments_use_case import ListMyAppointmentsUseCase
from backend.core.models.service_type import ServiceType
from backend.core.models.user import User
from backend.interfaces.dependencies import (
    get_book_appointment_use_case,
    get_get_availability_use_case, get_cancel_appointment_use_case, get_get_appointment_details_use_case,
    get_current_logged_in_user, get_list_my_appointments_use_case,
)
import logging
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/booking", tags=["booking"])


@router.post("/", response_model=BookAppointmentResponse)
async def book_appointment(
    request: BookAppointmentRequest,
    current_user: User = Depends(get_current_logged_in_user),
    use_case: BookAppointmentUseCase = Depends(get_book_appointment_use_case)
):
    response = await use_case.execute(request, current_user.id)

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


@router.get("/availability", response_model=GetAvailabilityResponse)
async def get_availability(
    service_type: ServiceType = Query(..., description="Type of service to check availability for"),
    start_date: datetime = Query(..., description="Start of the time range to check (ISO 8601 format)"),
    end_date: datetime = Query(..., description="End of the time range to check (ISO 8601 format)"),
    use_case: GetAvailabilityUseCase = Depends(get_get_availability_use_case)
):
    if start_date >= end_date:
        raise HTTPException(status_code=400, detail="start_date must be before end_date")

    request_data = GetAvailabilityRequest(
        service_type=service_type,
        start_date=start_date,
        end_date=end_date
    )

    try:
        return await use_case.execute(request_data)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=f"Validation error: {str(e)}")
    except Exception:
        raise HTTPException(status_code=500, detail="Internal server error while fetching availability.")

@router.get("/my-appointments", response_model=ListMyAppointmentsResponse)
async def list_my_appointments(
    current_user: User = Depends(get_current_logged_in_user),
    use_case: ListMyAppointmentsUseCase = Depends(get_list_my_appointments_use_case)
):
    try:
        response = await use_case.execute(user_id=current_user.id)

        if not response.success:
            status_code_map = {
                "INTERNAL_ERROR": 500,
            }
            status_code = status_code_map.get(response.error_code, 500)
            logger.error("UseCase returned error in list_my_appointments: %s - %s", response.error_code, response.message)
            raise HTTPException(status_code=status_code, detail=response.message)

        return response

    except HTTPException:
        raise
    except Exception as e:
        logger.exception("Unexpected error while fetching user appointments: %s", e)
        raise HTTPException(status_code=500, detail="Internal server error while fetching appointments.")


@router.post("/cancel", response_model=CancelAppointmentResponse)
async def cancel_appointment(
    request: CancelAppointmentRequest,
    use_case: CancelAppointmentUseCase = Depends(get_cancel_appointment_use_case)
):
    try:
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
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error while cancelling appointment.")


@router.get("/details/{view_token}", response_model=GetAppointmentDetailsResponse)
async def get_appointment_details(
    view_token: str,
    use_case: GetAppointmentDetailsUseCase = Depends(get_get_appointment_details_use_case)
):
    request_dto = GetAppointmentDetailsRequest(view_token=view_token)

    try:
        response = await use_case.execute(request_dto)
        if not response.success:
            status_code_map = {
                "APPOINTMENT_NOT_FOUND": 404,
                "USER_DATA_INCONSISTENCY": 500,
                "VALIDATION_ERROR": 400,
            }
            status_code = status_code_map.get(response.error_code, 400)
            raise HTTPException(status_code=status_code, detail=response.message)

        return response

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error while fetching appointment details.")