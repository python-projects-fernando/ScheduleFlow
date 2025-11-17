import pytest
from datetime import datetime, timezone
import uuid
from backend.core.models.user import User
from backend.core.value_objects.email import Email
from backend.core.value_objects.hashed_password import HashedPassword

class TestUser:

    def test_user_creation_with_valid_data(self):
        name = "Fulano de Tal"
        email = Email("fulano@example.com")
        phone = "+5511999998888"
        password_hash_value = "$2b$12$LQY8CUb7bqg9L3U7P6V7nOZK1J2W3X4Y5Z6A7B8C9D0E1F2G3H4I5J6K"
        password_hash = HashedPassword(password_hash_value)

        user = User(
            id=None,
            name=name,
            email=email,
            phone=phone,
            hashed_password=password_hash
        )

        assert user.name == name
        assert user.email == email
        assert user.phone == phone
        assert user.hashed_password.value == password_hash_value
        assert user.id is not None
        assert uuid.UUID(user.id)
        assert user.created_at is not None
        assert user.updated_at is not None

    def test_user_creation_sets_default_timestamps(self):
        name = "Fulano de Tal"
        email = Email("fulano@example.com")

        before_creation = datetime.now(timezone.utc)
        user = User(id=None, name=name, email=email)
        after_creation = datetime.now(timezone.utc)

        assert before_creation <= user.created_at <= after_creation
        assert before_creation <= user.updated_at <= after_creation

    def test_user_creation_generates_id(self):
        name = "Fulano de Tal"
        email = Email("fulano@example.com")

        user = User(id=None, name=name, email=email)

        assert user.id is not None
        assert uuid.UUID(user.id)

    def test_user_creation_fails_without_name(self):
        email = Email("fulano@example.com")

        with pytest.raises(ValueError, match="User name cannot be empty"):
            User(id=None, name="", email=email)

        with pytest.raises(ValueError, match="User name cannot be empty"):
            User(id=None, name="   ", email=email)

    def test_user_creation_allows_none_phone(self):
        name = "Fulano de Tal"
        email = Email("fulano@example.com")

        user = User(id=None, name=name, email=email, phone=None)

        assert user.phone is None

    def test_user_creation_allows_none_hashed_password(self):
        name = "Fulano de Tal"
        email = Email("fulano@example.com")

        user = User(id=None, name=name, email=email, hashed_password=None)

        assert user.hashed_password is None

    def test_user_creation_fails_with_invalid_hashed_password_type(self):
        name = "Fulano de Tal"
        email = Email("fulano@example.com")

        with pytest.raises(ValueError, match="hashed_password must be an instance of HashedPassword VO or None"):
            User(id=None, name=name, email=email, hashed_password="not_a_hashed_password_vo")

    def test_update_profile_name(self):
        original_name = "Fulano de Tal"
        email = Email("fulano@example.com")
        user = User(id=None, name=original_name, email=email)

        new_name = "Fulano Atualizado"
        user.update_profile(name=new_name)

        assert user.name == new_name.strip()
        assert user.updated_at > user.created_at

    def test_update_profile_name_fails_with_empty_after_update(self):
        original_name = "Fulano de Tal"
        email = Email("fulano@example.com")
        user = User(id=None, name=original_name, email=email)

        with pytest.raises(ValueError, match="Name cannot be empty after update"):
            user.update_profile(name="")

        with pytest.raises(ValueError, match="Name cannot be empty after update"):
            user.update_profile(name="   ")

    def test_update_profile_email(self):
        original_name = "Fulano de Tal"
        original_email = Email("fulano@example.com")
        user = User(id=None, name=original_name, email=original_email)

        new_email = Email("beltrano@example.com")
        user.update_profile(email=new_email)

        assert user.email == new_email
        assert user.updated_at > user.created_at

    def test_update_profile_phone(self):
        original_name = "Fulano de Tal"
        email = Email("fulano@example.com")
        original_phone = "+5511999998888"
        user = User(id=None, name=original_name, email=email, phone=original_phone)

        new_phone = "+5511911112222"
        user.update_profile(phone=new_phone)

        assert user.phone == new_phone
        assert user.updated_at > user.created_at

    def test_update_profile_multiple_fields(self):
        original_name = "Fulano de Tal"
        original_email = Email("fulano@example.com")
        original_phone = "+5511999998888"
        user = User(id=None, name=original_name, email=original_email, phone=original_phone)

        new_name = "Beltrano da Silva"
        new_email = Email("beltrano.silva@example.com")
        new_phone = "+5511911113333"

        user.update_profile(name=new_name, email=new_email, phone=new_phone)

        assert user.name == new_name.strip()
        assert user.email == new_email
        assert user.phone == new_phone
        assert user.updated_at > user.created_at

    def test_set_password_valid_hash(self):
        name = "Fulano de Tal"
        email = Email("fulano@example.com")
        user = User(id=None, name=name, email=email)

        password_hash_value = "$2b$12$UQY8CUb7bqg9L3U7P6V7nOZK1J2W3X4Y5Z6A7B8C9D0E1F2G3H4I5J6L"
        user.set_password(password_hash_value)

        assert user.hashed_password.value == password_hash_value
        assert isinstance(user.hashed_password, HashedPassword)
        assert user.updated_at > user.created_at

    def test_set_password_fails_with_empty_hash(self):
        name = "Fulano de Tal"
        email = Email("fulano@example.com")
        user = User(id=None, name=name, email=email)

        with pytest.raises(ValueError, match="Password hash cannot be empty"):
            user.set_password("")

        with pytest.raises(ValueError, match="Password hash cannot be empty"):
            user.set_password(None)
