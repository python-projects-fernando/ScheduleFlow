import pytest
from backend.core.value_objects.hashed_password import HashedPassword

class TestHashedPassword:

    def test_hashed_password_creation_valid_bcrypt(self):
        valid_bcrypt_hash = "$2b$12$LQY8CUb7bqg9L3U7P6V7nOZK1J2W3X4Y5Z6A7B8C9D0E1F2G3H4I5J6K"
        password = HashedPassword(valid_bcrypt_hash)
        assert password.value == valid_bcrypt_hash

    def test_hashed_password_fails_with_empty_string(self):
        with pytest.raises(ValueError, match="Hashed password cannot be empty"):
            HashedPassword("")

    def test_hashed_password_fails_with_invalid_format(self):
        invalid_hash = "not_a_hash"
        with pytest.raises(ValueError, match="Invalid hashed password format"):
            HashedPassword(invalid_hash)

    def test_hashed_password_fails_with_short_length(self):
        short_hash = "$2b$12$LQY8CUb7bqg9L3U7P6V7n"
        with pytest.raises(ValueError, match="Hashed password seems too short"):
            HashedPassword(short_hash)

    def test_hashed_password_fails_with_wrong_generic_pattern(self):
        wrong_generic = "plain_string_without_dollar_signs"
        with pytest.raises(ValueError, match="Invalid hashed password format"):
            HashedPassword(wrong_generic)
