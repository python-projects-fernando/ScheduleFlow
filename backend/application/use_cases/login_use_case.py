from typing import TYPE_CHECKING
from datetime import datetime, timedelta, timezone
from jose import jwt, JWTError
import bcrypt
import os
from backend.application.dtos.login_request import LoginRequest
from backend.application.dtos.login_response import LoginResponse
from backend.application.interfaces.repositories.user_repository import UserRepository
from backend.core.models.user import User

if TYPE_CHECKING:
    pass

SECRET_KEY = os.getenv("SECRET_KEY", "your-default-secret-key-change-me-in-production!")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

class LoginUseCase:
    def __init__(self, user_repo: UserRepository):
        self.user_repo = user_repo

    async def execute(self, request: LoginRequest) -> LoginResponse:
        try:
            user = await self.user_repo.find_by_email(request.email)

            if not user:
                return LoginResponse(
                    success=False,
                    message="Invalid email or password",
                    error_code="INVALID_CREDENTIALS"
                )

            stored_hash = user.hashed_password.value
            provided_password = request.password.encode("utf-8")

            if not bcrypt.checkpw(provided_password, stored_hash.encode("utf-8")):
                return LoginResponse(
                    success=False,
                    message="Invalid email or password",
                    error_code="INVALID_CREDENTIALS"
                )

            expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

            token_data = {
                "sub": user.id,
                "role": "user",
                "email": user.email.value,
                "exp": expire.timestamp(),
            }

            access_token = jwt.encode(token_data, SECRET_KEY, algorithm=ALGORITHM)

            return LoginResponse(
                success=True,
                message="Login successful",
                access_token=access_token,
                token_type="bearer",
                user_id=user.id
            )

        except JWTError:
            return LoginResponse(
                success=False,
                message="An error occurred during login (token generation).",
                error_code="TOKEN_GENERATION_ERROR"
            )

        except Exception:
            return LoginResponse(
                success=False,
                message="An internal error occurred while logging in.",
                error_code="INTERNAL_ERROR"
            )
