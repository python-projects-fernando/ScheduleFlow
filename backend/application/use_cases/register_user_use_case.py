from typing import TYPE_CHECKING
from backend.application.dtos.register_user_request import RegisterUserRequest
from backend.application.dtos.register_user_response import RegisterUserResponse
from backend.application.interfaces.repositories.user_repository import UserRepository
from backend.core.models.user import User
from backend.core.value_objects.email import Email
from backend.core.value_objects.hashed_password import HashedPassword
import bcrypt

if TYPE_CHECKING:
    pass

class RegisterUserUseCase:
    def __init__(self, user_repo: UserRepository):
        self.user_repo = user_repo

    async def execute(self, request: RegisterUserRequest) -> RegisterUserResponse:
        try:
            if len(request.password) < 8:
                raise ValueError("Password must be at least 8 characters long")

            salt = bcrypt.gensalt()
            password_hash_bytes = bcrypt.hashpw(request.password.encode('utf-8'), salt)
            password_hash_str = password_hash_bytes.decode('utf-8')

            user_entity = User(
                id=None,
                name=request.name,
                email=Email(request.email),
                phone=request.phone,
                hashed_password=HashedPassword(value=password_hash_str)
            )

            saved_user = await self.user_repo.save(user_entity)

            return RegisterUserResponse(
                success=True,
                message="User registered successfully",
                user_id=saved_user.id
            )

        except ValueError as e:
            return RegisterUserResponse(
                success=False,
                message=f"Validation error: {str(e)}",
                error_code="VALIDATION_ERROR"
            )

        except Exception as e:
            error_msg = str(e).lower()
            if "duplicate" in error_msg and "email" in error_msg:
                return RegisterUserResponse(
                    success=False,
                    message="A user with this email address already exists.",
                    error_code="EMAIL_DUPLICATED"
                )
            return RegisterUserResponse(
                success=False,
                message="An internal error occurred while registering the user.",
                error_code="INTERNAL_ERROR"
            )
