import pytest
from datetime import datetime, timezone
from backend.core.models.service import Service
from backend.core.models.service_type import ServiceType

class TestService:
    def test_service_creation_with_valid_data(self):
        name = "Consulta Cardiologia"
        description = "Consulta de avaliação cardiológica."
        duration_minutes = 60
        service_type = ServiceType.CONSULTATION
        price = 150.00

        service = Service(
            id=None,
            name=name,
            description=description,
            duration_minutes=duration_minutes,
            service_type=service_type,
            price=price
        )

        assert service.name == name
        assert service.description == description
        assert service.duration_minutes == duration_minutes
        assert service.service_type == service_type
        assert service.price == price
        assert service.created_at is not None
        assert service.updated_at is not None

    def test_service_creation_sets_default_timestamps(self):
        name = "Consulta Cardiologia"
        description = "Consulta de avaliação cardiológica."
        duration_minutes = 60
        service_type = ServiceType.CONSULTATION

        before_creation = datetime.now(timezone.utc)
        service = Service(
            id=None,
            name=name,
            description=description,
            duration_minutes=duration_minutes,
            service_type=service_type
        )
        after_creation = datetime.now(timezone.utc)

        assert before_creation <= service.created_at <= after_creation
        assert before_creation <= service.updated_at <= after_creation

    def test_service_creation_fails_without_name(self):
        description = "Consulta de avaliação cardiológica."
        duration_minutes = 60
        service_type = ServiceType.CONSULTATION

        with pytest.raises(ValueError, match="Service name cannot be empty"):
            Service(
                id=None,
                name="",
                description=description,
                duration_minutes=duration_minutes,
                service_type=service_type
            )

        with pytest.raises(ValueError, match="Service name cannot be empty"):
            Service(
                id=None,
                name="   ",
                description=description,
                duration_minutes=duration_minutes,
                service_type=service_type
            )

    def test_service_creation_fails_without_description(self):
        name = "Consulta Cardiologia"
        duration_minutes = 60
        service_type = ServiceType.CONSULTATION

        with pytest.raises(ValueError, match="Service description cannot be empty"):
            Service(
                id=None,
                name=name,
                description="",
                duration_minutes=duration_minutes,
                service_type=service_type
            )

        with pytest.raises(ValueError, match="Service description cannot be empty"):
            Service(
                id=None,
                name=name,
                description="   ",
                duration_minutes=duration_minutes,
                service_type=service_type
            )

    def test_service_creation_fails_with_non_positive_duration(self):
        name = "Consulta Cardiologia"
        description = "Consulta de avaliação cardiológica."
        service_type = ServiceType.CONSULTATION

        with pytest.raises(ValueError, match="Service duration must be positive"):
            Service(
                id=None,
                name=name,
                description=description,
                duration_minutes=0,
                service_type=service_type
            )

        with pytest.raises(ValueError, match="Service duration must be positive"):
            Service(
                id=None,
                name=name,
                description=description,
                duration_minutes=-30,
                service_type=service_type
            )

    def test_service_creation_fails_with_negative_price(self):
        name = "Consulta Cardiologia"
        description = "Consulta de avaliação cardiológica."
        duration_minutes = 60
        service_type = ServiceType.CONSULTATION

        with pytest.raises(ValueError, match="Service price cannot be negative"):
            Service(
                id=None,
                name=name,
                description=description,
                duration_minutes=duration_minutes,
                service_type=service_type,
                price=-50.00
            )

    def test_service_creation_allows_none_price(self):
        name = "Consulta Cardiologia"
        description = "Consulta de avaliação cardiológica."
        duration_minutes = 60
        service_type = ServiceType.CONSULTATION

        service = Service(
            id=None,
            name=name,
            description=description,
            duration_minutes=duration_minutes,
            service_type=service_type,
            price=None
        )

        assert service.price is None

    def test_service_creation_allows_zero_price(self):
        name = "Consulta Cardiologia"
        description = "Consulta de avaliação cardiológica."
        duration_minutes = 60
        service_type = ServiceType.CONSULTATION

        service = Service(
            id=None,
            name=name,
            description=description,
            duration_minutes=duration_minutes,
            service_type=service_type,
            price=0.0
        )

        assert service.price == 0.0
