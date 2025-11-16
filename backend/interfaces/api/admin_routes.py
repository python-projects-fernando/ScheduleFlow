from fastapi import APIRouter, Depends, HTTPException, status
from typing import Annotated
from backend.application.dtos.list_all_appointments_request import ListAllAppointmentsRequest
from backend.application.dtos.list_all_appointments_response import ListAllAppointmentsResponse
from backend.application.use_cases.list_all_appointments_use_case import ListAllAppointmentsUseCase
from backend.interfaces.dependencies import get_list_all_appointments_use_case, get_current_admin
from backend.core.models.user import User
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/admin", tags=["admin"])

@router.get("/appointments", response_model=ListAllAppointmentsResponse)
async def list_all_appointments(
    current_admin: User = Depends(get_current_admin),
    request: ListAllAppointmentsRequest = Depends(),
    use_case: ListAllAppointmentsUseCase = Depends(get_list_all_appointments_use_case)
):
    try:
        response = await use_case.execute(request)

        if not response.success:
            status_code_map = {
                "INTERNAL_ERROR": 500,
            }
            status_code = status_code_map.get(response.error_code, 500)
            logger.error("UseCase returned error in list_all_appointments: %s - %s", response.error_code, response.message)
            raise HTTPException(status_code=status_code, detail=response.message)

        return response

    except HTTPException:
        raise
    except Exception as e:
        logger.exception("Unexpected error while fetching all appointments: %s", e)
        raise HTTPException(status_code=500, detail="Internal server error while fetching appointments.")
