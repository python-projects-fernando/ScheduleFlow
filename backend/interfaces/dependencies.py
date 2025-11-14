from typing import Annotated
from fastapi import Depends

from backend.application.use_cases.book_appointment_use_case import BookAppointmentUseCase
from backend.application.use_cases.get_availability_use_case import GetAvailabilityUseCase
from backend.infrastructure.database.postgres_dependencies import get_postgres_appointment_repository
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
