from typing import Annotated
from fastapi import Depends
import os
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError

from backend.application.interfaces.repositories.service_repository import ServiceRepository
from backend.application.interfaces.repositories.user_repository import UserRepository
from backend.application.use_cases.admin_login_use_case import AdminLoginUseCase
from backend.application.use_cases.book_appointment_use_case import BookAppointmentUseCase
from backend.application.use_cases.cancel_appointment_use_case import CancelAppointmentUseCase
from backend.application.use_cases.get_appointment_details_use_case import GetAppointmentDetailsUseCase
from backend.application.use_cases.get_availability_use_case import GetAvailabilityUseCase
from backend.application.use_cases.list_all_appointments_use_case import ListAllAppointmentsUseCase
from backend.application.use_cases.list_my_appointments_use_case import ListMyAppointmentsUseCase
from backend.application.use_cases.login_use_case import LoginUseCase
from backend.application.use_cases.register_user_use_case import RegisterUserUseCase
from backend.core.models.user import User
from backend.infrastructure.database.postgres_dependencies import get_postgres_appointment_repository, \
    get_postgres_user_repository, get_postgres_service_repository
from backend.application.interfaces.repositories.appointment_repository import AppointmentRepository


def get_book_appointment_use_case(
    appointment_repo: Annotated[AppointmentRepository, Depends(get_postgres_appointment_repository)],
    service_repo: Annotated[ServiceRepository, Depends(get_postgres_service_repository)]
) -> BookAppointmentUseCase:
    return BookAppointmentUseCase(appointment_repo=appointment_repo, service_repo=service_repo)


def get_get_availability_use_case(
    appointment_repo: Annotated[AppointmentRepository, Depends(get_postgres_appointment_repository)],
    service_repo: Annotated[ServiceRepository, Depends(get_postgres_service_repository)]

) -> GetAvailabilityUseCase:
    return GetAvailabilityUseCase(appointment_repo=appointment_repo,service_repo=service_repo)

def get_get_appointment_details_use_case(
    appointment_repo: Annotated[AppointmentRepository, Depends(get_postgres_appointment_repository)],
    user_repo: Annotated[UserRepository, Depends(get_postgres_user_repository)],
    service_repo: Annotated[ServiceRepository, Depends(get_postgres_service_repository)]
) -> GetAppointmentDetailsUseCase:
    return GetAppointmentDetailsUseCase(appointment_repo=appointment_repo, user_repo=user_repo, service_repo=service_repo)


def get_cancel_appointment_use_case(
        appointment_repo: Annotated[
        AppointmentRepository, Depends(get_postgres_appointment_repository)
    ]
) -> CancelAppointmentUseCase:
    return CancelAppointmentUseCase(appointment_repo=appointment_repo)

def get_list_my_appointments_use_case(
    appointment_repo: Annotated[AppointmentRepository, Depends(get_postgres_appointment_repository)],
    service_repo: Annotated[ServiceRepository, Depends(get_postgres_service_repository)]
) -> ListMyAppointmentsUseCase:
    return ListMyAppointmentsUseCase(appointment_repo=appointment_repo, service_repo=service_repo)

def get_register_user_use_case(
    user_repo: Annotated[UserRepository, Depends(get_postgres_user_repository)]
) -> RegisterUserUseCase:
    return RegisterUserUseCase(user_repo=user_repo)

def get_login_use_case(
    user_repo: Annotated[UserRepository, Depends(get_postgres_user_repository)]
) -> LoginUseCase:
    return LoginUseCase(user_repo=user_repo)

def get_list_all_appointments_use_case(
    appointment_repo: Annotated[AppointmentRepository, Depends(get_postgres_appointment_repository)],
    user_repo: Annotated[UserRepository, Depends(get_postgres_user_repository)],
    service_repo: Annotated[ServiceRepository, Depends(get_postgres_service_repository)]
) -> ListAllAppointmentsUseCase:
    return ListAllAppointmentsUseCase(appointment_repo=appointment_repo, user_repo=user_repo, service_repo=service_repo)



from dotenv import load_dotenv
load_dotenv()
security_scheme = HTTPBearer()

SECRET_KEY = os.getenv("SECRET_KEY", "your-default-secret-key-change-me-in-production!")
ALGORITHM = "HS256"

async def get_current_admin(
    credentials: HTTPAuthorizationCredentials = Depends(security_scheme)
) -> str:
    unauthorized_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate admin credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        token_role: str = payload.get("role")

        if user_id is None or token_role != "admin":
            raise unauthorized_exception
    except JWTError:
        raise unauthorized_exception

    return user_id


def get_admin_login_use_case():
    return AdminLoginUseCase()


async def get_current_logged_in_user(
    credentials: Annotated[HTTPAuthorizationCredentials,Depends(security_scheme)],
    user_repo: Annotated[UserRepository, Depends(get_postgres_user_repository)]


) -> User:
    unauthorized_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(
            credentials.credentials,
            SECRET_KEY,
            algorithms=[ALGORITHM],
            options={"require": ["exp"]}
        )
        user_id = payload.get("sub")
        token_role = payload.get("role")
        if user_id is None or token_role != "user":
            raise unauthorized_exception
    except JWTError:
        raise unauthorized_exception

    user = await user_repo.find_by_id(user_id)
    if user is None:
        raise unauthorized_exception

    return user
