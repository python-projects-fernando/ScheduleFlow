import os
import bcrypt
from datetime import datetime, timedelta, timezone
from jose import jwt, JWTError
from backend.application.dtos.admin_login_request import AdminLoginRequest
from backend.application.dtos.admin_login_response import AdminLoginResponse

ADMIN_USERNAME = os.getenv("ADMIN_USERNAME", "admin_user")
ADMIN_PASSWORD_HASH = bcrypt.hashpw(os.getenv("ADMIN_PASSWORD", "default_password").encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
SECRET_KEY = os.getenv("SECRET_KEY", "your-default-secret-key-change-me-in-production!")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

class AdminLoginUseCase:
    async def execute(self, request: AdminLoginRequest) -> AdminLoginResponse:
        try:
            input_username = request.username
            input_password = request.password.encode('utf-8')

            if input_username != ADMIN_USERNAME:
                return AdminLoginResponse(
                    success=False,
                    message="Invalid username or password",
                    error_code="INVALID_CREDENTIALS"
                )

            stored_hash_bytes = ADMIN_PASSWORD_HASH.encode('utf-8')

            if not bcrypt.checkpw(input_password, stored_hash_bytes):
                return AdminLoginResponse(
                    success=False,
                    message="Invalid username or password",
                    error_code="INVALID_CREDENTIALS"
                )

            expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
            token_data = {
                "sub": input_username,
                "role": "admin",
                "exp": expire.timestamp()
            }
            access_token = jwt.encode(token_data, SECRET_KEY, algorithm=ALGORITHM)

            return AdminLoginResponse(
                success=True,
                message="Admin login successful",
                access_token=access_token,
                token_type="bearer"
            )

        except JWTError:
            return AdminLoginResponse(
                success=False,
                message="An error occurred during admin login (token generation).",
                error_code="TOKEN_GENERATION_ERROR"
            )
        except Exception:
            return AdminLoginResponse(
                success=False,
                message="An internal error occurred during admin login.",
                error_code="INTERNAL_ERROR"
            )
