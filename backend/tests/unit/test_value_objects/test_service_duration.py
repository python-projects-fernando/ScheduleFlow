import pytest
from backend.core.value_objects.service_duration import ServiceDuration

class TestServiceDuration:

    def test_service_duration_creation_valid(self):
        duration = ServiceDuration(30)
        assert duration.minutes == 30

    def test_service_duration_fails_with_negative_minutes(self):
        with pytest.raises(ValueError, match="Service duration must be positive"):
            ServiceDuration(-15)

    def test_service_duration_fails_with_zero_minutes(self):
        with pytest.raises(ValueError, match="Service duration must be positive"):
            ServiceDuration(0)

    def test_service_duration_fails_with_non_multiple_of_15(self):
        with pytest.raises(ValueError, match="Service duration should be a multiple of 15 minutes"):
            ServiceDuration(25)

    def test_service_duration_fails_with_negative_non_multiple_of_15(self):
        with pytest.raises(ValueError):
            ServiceDuration(-10)
