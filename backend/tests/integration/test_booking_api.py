import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from backend.infrastructure.database.models import Base
from backend.interfaces.main import app
from datetime import datetime, timezone, timedelta
import uuid
from sqlalchemy import select
import sys
import traceback

# Corrigido: fixture síncrona que retorna o AsyncEngine
@pytest.fixture
def async_test_engine():
    engine = create_async_engine("sqlite+aiosqlite:///:memory:", echo=True)
    yield engine
    import asyncio
    asyncio.run(engine.dispose())

# Fixture síncrona para a sessão
@pytest.fixture
def async_test_session(async_test_engine):
    async_session = sessionmaker(async_test_engine, class_=AsyncSession, expire_on_commit=False)
    session_instance = async_session()

    import asyncio
    async def create_tables():
        async with async_test_engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)

    asyncio.run(create_tables())

    yield session_instance
    import asyncio
    asyncio.run(session_instance.close())

# Corrigido: fixture síncrona que retorna o AsyncClient configurado para o app FastAPI
@pytest.fixture
def client(async_test_engine):
    from backend.infrastructure.database.session import get_db_session
    from fastapi.testclient import TestClient # Importar TestClient
    from httpx import ASGITransport # Importar ASGITransport

    # Função para substituir a dependência get_db_session
    async def override_get_db_session():
        async_session = sessionmaker(async_test_engine, class_=AsyncSession, expire_on_commit=False)
        async with async_session() as session:
            yield session

    app.dependency_overrides[get_db_session] = override_get_db_session

    # Criar o transporte ASGI para o app FastAPI
    transport = ASGITransport(app=app)
    # Criar o AsyncClient com o transporte
    client_instance = AsyncClient(transport=transport, base_url="http://testserver") # Usar transport, não app
    yield client_instance

    app.dependency_overrides.clear()
    import asyncio
    asyncio.run(client_instance.aclose())

@pytest.mark.asyncio
async def test_create_appointment_success(client, async_test_session):
    from backend.core.models import ServiceType
    from backend.infrastructure.database.models import ServiceModel

    service = ServiceModel(
        id=uuid.uuid4(),
        name=ServiceType.CONSULTATION.value,
        description="Initial consultation",
        duration=30,
        price=10000
    )
    async_test_session.add(service)
    await async_test_session.commit()
    await async_test_session.refresh(service)

    appointment_data = {
        "client_name": "John Doe",
        "client_email": "john.doe@example.com",
        "client_phone": "1234567890",
        "service_type": ServiceType.CONSULTATION.value,
        "requested_datetime": "2025-01-01T10:00:00Z"
    }

    response = await client.post("/api/booking/book", json=appointment_data)

    assert response.status_code == 200
    response_data = response.json()
    assert response_data["success"] is True
    assert "appointment_id" in response_data
    assert response_data["appointment_id"] is not None

    from backend.infrastructure.database.models import AppointmentModel
    result = await async_test_session.execute(
        select(AppointmentModel).where(AppointmentModel.id == uuid.UUID(response_data["appointment_id"]))
    )
    saved_appointment = result.scalar_one_or_none()
    assert saved_appointment is not None
    assert saved_appointment.client_name == "John Doe"

@pytest.mark.asyncio
async def test_create_appointment_conflict(client, async_test_session):
    from backend.core.models import ServiceType, AppointmentStatus
    from backend.infrastructure.database.models import ServiceModel, AppointmentModel

    service = ServiceModel(
        id=uuid.uuid4(),
        name=ServiceType.CONSULTATION.value,
        description="Initial consultation",
        duration=30,
        price=10000
    )
    async_test_session.add(service)

    conflicting_start = datetime(2025, 1, 1, 10, 0, tzinfo=timezone.utc)
    conflicting_end = conflicting_start + timedelta(minutes=30)

    existing_appointment = AppointmentModel(
        id=uuid.uuid4(),
        client_name="Jane Doe",
        client_email="jane.doe@example.com",
        client_phone="0987654321",
        service_type=ServiceType.CONSULTATION,
        scheduled_start=conflicting_start,
        scheduled_end=conflicting_end,
        status=AppointmentStatus.SCHEDULED
    )
    async_test_session.add(existing_appointment)

    await async_test_session.commit()
    await async_test_session.refresh(service)
    await async_test_session.refresh(existing_appointment)

    appointment_data = {
        "client_name": "John Doe",
        "client_email": "john.doe@example.com",
        "client_phone": "1234567890",
        "service_type": ServiceType.CONSULTATION.value,
        "requested_datetime": "2025-01-01T10:15:00Z"
    }

    # Ação: Fazer a requisição POST
    response = await client.post("/api/booking/book", json=appointment_data)

    # Asserções para o Modelo 1 (HTTPException para erros de negócio)
    assert response.status_code == 400 # Espera-se 400 Bad Request
    response_data = response.json()
    # O corpo da resposta para HTTPException é {"detail": "mensagem"}
    assert "detail" in response_data # Verifica se a chave 'detail' está presente
    assert "not available" in response_data["detail"] # Verifica a mensagem de conflito

# ... outros testes