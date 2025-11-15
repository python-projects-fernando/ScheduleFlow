from typing import Annotated
from fastapi import Depends
import os
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from backend.application.interfaces.repositories.user_repository import UserRepository
from backend.application.use_cases.admin_login_use_case import AdminLoginUseCase
from backend.application.use_cases.book_appointment_use_case import BookAppointmentUseCase
from backend.application.use_cases.cancel_appointment_use_case import CancelAppointmentUseCase
from backend.application.use_cases.get_appointment_details_use_case import GetAppointmentDetailsUseCase
from backend.application.use_cases.get_availability_use_case import GetAvailabilityUseCase
from backend.application.use_cases.login_use_case import LoginUseCase
from backend.application.use_cases.register_user_use_case import RegisterUserUseCase
from backend.infrastructure.database.postgres_dependencies import get_postgres_appointment_repository, \
    get_postgres_user_repository
from backend.application.interfaces.repositories.appointment_repository import AppointmentRepository


def get_book_appointment_use_case(
    appointment_repo: Annotated[
        AppointmentRepository, Depends(get_postgres_appointment_repository)
    ]
) -> BookAppointmentUseCase:
    return BookAppointmentUseCase(appointment_repo=appointment_repo)


def get_get_availability_use_case(
    appointment_repo: Annotated[
        AppointmentRepository, Depends(get_postgres_appointment_repository)
    ]
) -> GetAvailabilityUseCase:
    return GetAvailabilityUseCase(appointment_repo=appointment_repo)

def get_get_appointment_details_use_case(
    appointment_repo: Annotated[
        AppointmentRepository, Depends(get_postgres_appointment_repository)
    ]
) -> GetAppointmentDetailsUseCase:
    return GetAppointmentDetailsUseCase(appointment_repo=appointment_repo)

def get_cancel_appointment_use_case(
        appointment_repo: Annotated[
        AppointmentRepository, Depends(get_postgres_appointment_repository)
    ]
) -> CancelAppointmentUseCase:
    return CancelAppointmentUseCase(appointment_repo=appointment_repo)

def get_register_user_use_case(
    user_repo: Annotated[UserRepository, Depends(get_postgres_user_repository)]
) -> RegisterUserUseCase:
    return RegisterUserUseCase(user_repo=user_repo)

def get_login_use_case(
    user_repo: Annotated[UserRepository, Depends(get_postgres_user_repository)]
) -> LoginUseCase:
    return LoginUseCase(user_repo=user_repo)


from dotenv import load_dotenv
load_dotenv()
security_scheme = HTTPBearer()

def get_current_admin(credentials: HTTPAuthorizationCredentials = Depends(security_scheme)):
    admin_token = os.getenv("ADMIN_API_TOKEN", "admin123")
    if credentials.credentials != admin_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid admin authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return credentials.credentials

def get_admin_login_use_case():
    return AdminLoginUseCase()