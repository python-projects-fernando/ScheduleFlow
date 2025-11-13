import pytest
from unittest.mock import AsyncMock
from backend.application.use_cases import BookAppointmentUseCase
from backend.application.dtos import BookAppointmentRequest
from backend.application.interfaces.repositories import AppointmentRepository as IAppointmentRepository, ServiceRepository as IServiceRepository
from backend.core.models import ServiceType
from datetime import datetime, timedelta, timezone

@pytest.mark.asyncio
async def test_book_appointment_success(mock_appointment, mock_service):
    # Mock das *interfaces* de repositório
    mock_appointment_repo = AsyncMock(spec=IAppointmentRepository)
    mock_service_repo = AsyncMock(spec=IServiceRepository)

    # Configurar o mock para retornar um serviço
    mock_service_repo.find_by_type.return_value = mock_service

    # Configurar o mock para retornar lista vazia de agendamentos conflitantes
    # Garantir que os objetos retornados também sejam offset-aware se necessário
    mock_appointment_repo.find_scheduled_between.return_value = []

    # Configurar o mock para retornar o agendamento salvo
    mock_appointment_repo.save.return_value = mock_appointment

    use_case = BookAppointmentUseCase(mock_appointment_repo, mock_service_repo)

    request = BookAppointmentRequest(
        client_name="John Doe",
        client_email="john@example.com",
        client_phone="1234567890",
        service_type=ServiceType.CONSULTATION,
        requested_datetime=datetime.now(timezone.utc) + timedelta(hours=1) # Offset-aware
    )

    response = await use_case.execute(request)

    assert response.success is True
    assert response.appointment_id == mock_appointment.id
    mock_appointment_repo.save.assert_called_once()

@pytest.mark.asyncio
async def test_book_appointment_conflict(mock_appointment, mock_service):
    # Mock do repositório
    mock_appointment_repo = AsyncMock(spec=IAppointmentRepository) # Usar spec
    mock_service_repo = AsyncMock(spec=IServiceRepository) # Usar spec

    mock_service_repo.find_by_type.return_value = mock_service

    # Simular um agendamento conflitante
    # O mock_appointment já está com datetime offset-aware graças ao fixture
    # Certifique-se de que o objeto retornado por find_scheduled_between também esteja correto
    mock_appointment_repo.find_scheduled_between.return_value = [mock_appointment]

    use_case = BookAppointmentUseCase(mock_appointment_repo, mock_service_repo)

    # Garantir que 'request' é um objeto BookAppointmentRequest válido com datetime offset-aware
    request = BookAppointmentRequest(
        client_name="Jane Doe",
        client_email="jane@example.com",
        client_phone="0987654321",
        service_type=ServiceType.CONSULTATION,
        requested_datetime=datetime.now(timezone.utc) + timedelta(hours=1) # Offset-aware
    )

    response = await use_case.execute(request)

    assert response.success is False
    assert "not available" in response.message
    mock_appointment_repo.save.assert_not_called()