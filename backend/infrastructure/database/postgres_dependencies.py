from typing import AsyncGenerator
from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from backend.infrastructure.database.postgres_config import async_sessionmaker_instance
from backend.infrastructure.repositories.postgres_appointment_repository import PostgresAppointmentRepository
from backend.infrastructure.repositories.postgres_service_repository import PostgresServiceRepository
from backend.infrastructure.repositories.postgres_user_repository import PostgresUserRepository

async def get_db_session() -> AsyncGenerator[AsyncSession, None]:
    async with async_sessionmaker_instance() as session:
        yield session

def get_postgres_appointment_repository(session: AsyncSession = Depends(get_db_session)):
    return PostgresAppointmentRepository(session)

def get_postgres_user_repository(session: AsyncSession = Depends(get_db_session)):
    return PostgresUserRepository(session)

def get_postgres_service_repository(session: AsyncSession = Depends(get_db_session)):
    return PostgresServiceRepository(session)

