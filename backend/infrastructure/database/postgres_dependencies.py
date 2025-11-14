from typing import AsyncGenerator
from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from backend.infrastructure.database.postgres_config import async_sessionmaker_instance
from backend.infrastructure.repositories.postgres_appointment_repository import PostgresAppointmentRepository
# Importe outros repositórios conforme forem criados
# from backend.infrastructure.repositories.postgres_service_repository import PostgresServiceRepository

async def get_db_session() -> AsyncGenerator[AsyncSession, None]:
    """Provides a database session for dependency injection."""
    async with async_sessionmaker_instance() as session:
        yield session

def get_postgres_appointment_repository(session: AsyncSession = Depends(get_db_session)):
    """Factory function to provide PostgresAppointmentRepository."""
    return PostgresAppointmentRepository(session)

# Adicione funções semelhantes para outros repositórios conforme necessário
# def get_postgres_service_repository(session: AsyncSession = Depends(get_db_session)):
#     return PostgresServiceRepository(session)