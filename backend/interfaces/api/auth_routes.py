from fastapi import APIRouter, Depends, HTTPException
from typing import Annotated

from backend.application.dtos.admin_login_request import AdminLoginRequest
from backend.application.dtos.admin_login_response import AdminLoginResponse
from backend.application.dtos.login_request import LoginRequest
from backend.application.dtos.login_response import LoginResponse
from backend.application.dtos.register_user_request import RegisterUserRequest
from backend.application.dtos.register_user_response import RegisterUserResponse
from backend.application.use_cases.admin_login_use_case import AdminLoginUseCase
from backend.application.use_cases.login_use_case import LoginUseCase
from backend.application.use_cases.register_user_use_case import RegisterUserUseCase
from backend.interfaces.dependencies import get_register_user_use_case, get_login_use_case, get_admin_login_use_case
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/admin/login", response_model=AdminLoginResponse)
async def admin_login(
    request: AdminLoginRequest,
    use_case: Annotated[AdminLoginUseCase, Depends(get_admin_login_use_case)]
):
    try:
        response = await use_case.execute(request)
        if not response.success:
            status_code_map = {
                "INVALID_CREDENTIALS": 401,
                "TOKEN_GENERATION_ERROR": 500,
                "INTERNAL_ERROR": 500,
            }
            status_code = status_code_map.get(response.error_code, 401)
            raise HTTPException(status_code=status_code, detail=response.message)
        return response
    except HTTPException:
        raise
    except Exception as e:
        logger.exception("Unexpected error during admin login: %s", e)
        raise HTTPException(status_code=500, detail="Internal server error during admin login.")


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



@router.post("/login", response_model=LoginResponse)
async def login_user(
    request: LoginRequest,
    use_case: Annotated[LoginUseCase, Depends(get_login_use_case)]
):
    try:
        response = await use_case.execute(request)

        if not response.success:
            status_code_map = {
                "INVALID_CREDENTIALS": 401,
                "VALIDATION_ERROR": 400,
            }
            status_code = status_code_map.get(response.error_code, 400)
            raise HTTPException(status_code=status_code, detail=response.message)

        return response
    except HTTPException:
        raise
    except Exception as e:
        logger.exception("Unexpected error during user login: %s", e)
        raise HTTPException(status_code=500, detail="Internal server error during user login.")
