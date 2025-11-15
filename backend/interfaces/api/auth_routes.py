from fastapi import APIRouter, Depends, HTTPException
from typing import Annotated
from backend.application.dtos.register_user_request import RegisterUserRequest
from backend.application.dtos.register_user_response import RegisterUserResponse
from backend.application.use_cases.register_user_use_case import RegisterUserUseCase
from backend.interfaces.dependencies import get_register_user_use_case
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", response_model=RegisterUserResponse)
async def register_user(
    request: RegisterUserRequest,
    use_case: Annotated[RegisterUserUseCase, Depends(get_register_user_use_case)]
):
    try:
        response = await use_case.execute(request)
        if not response.success:
            status_code_map = {
                "VALIDATION_ERROR": 400,
                "EMAIL_DUPLICATED": 409,
                "INTERNAL_ERROR": 500,
            }
            status_code = status_code_map.get(response.error_code, 400)
            raise HTTPException(status_code=status_code, detail=response.message)
        return response

    except HTTPException:
        raise
    except Exception as e:
        logger.exception("Unexpected error during user registration: %s", e)
        raise HTTPException(status_code=500, detail="Internal server error during user registration.")
