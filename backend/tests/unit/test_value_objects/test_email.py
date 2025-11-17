import pytest
from backend.core.value_objects.email import Email

class TestEmail:

    def test_email_creation_valid(self):
        email = Email("test@example.com")
        assert email.value == "test@example.com"

    def test_email_normalization(self):
        email = Email("Test@EXAMPLE.COM")
        assert email.value == "Test@example.com"

    def test_email_invalid(self):
        with pytest.raises(ValueError):
            Email("invalid-email")

    def test_email_invalid_characters(self):
        with pytest.raises(ValueError):
            Email("test@exam@ple.com")

    def test_email_empty_string(self):
        with pytest.raises(ValueError):
            Email("")
