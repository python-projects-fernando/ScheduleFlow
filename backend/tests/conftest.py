# backend/tests/conftest.py
import pytest
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from backend.infrastructure.database.models import Base
from backend.infrastructure.database.session import get_db_session
from backend.core.value_objects import Email, TimeSlot
from backend.core.models import Appointment, Service, AppointmentStatus, ServiceType
from datetime import datetime, timedelta, timezone # Adicionando timezone
from unittest.mock import AsyncMock, MagicMock

# Engine para banco de dados em memória (SQLite) para testes
TEST_DATABASE_URL = "sqlite+aiosqlite:///:memory:"

@pytest.fixture
async def test_engine():
    engine = create_async_engine(TEST_DATABASE_URL, echo=True)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield engine
    await engine.dispose()

@pytest.fixture
async def test_session(test_engine):
    async_session = sessionmaker(test_engine, class_=AsyncSession, expire_on_commit=False)
    async with async_session() as session:
        yield session

@pytest.fixture
def mock_email():
    return Email("test@example.com")

@pytest.fixture
def mock_appointment(mock_email):
    # Corrigir para usar timezone.utc
    start_time = datetime.now(timezone.utc) + timedelta(hours=1)
    end_time = start_time + timedelta(minutes=30)
    return Appointment(
        id="123e4567-e89b-12d3-a456-426614174000",
        client_name="John Doe",
        client_email=mock_email,
        client_phone="1234567890", # Corrigido para dígitos
        service_type=ServiceType.CONSULTATION,
        # Usar TimeSlot com datetime offset-aware
        scheduled_slot=TimeSlot(
            start=start_time,
            end=end_time
        )
    )

@pytest.fixture
def mock_service():
    return Service(
        id="123e4567-e89b-12d3-a456-426614174001",
        name="Consultation",
        description="Initial consultation",
        duration=30,
        price=100.0
    )