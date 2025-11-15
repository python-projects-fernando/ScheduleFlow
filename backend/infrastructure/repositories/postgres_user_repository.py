from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from backend.application.interfaces.repositories.user_repository import UserRepository
from backend.core.models.user import User
from backend.infrastructure.models.user_model import UserModel
from backend.core.value_objects.email import Email
from backend.core.value_objects.hashed_password import HashedPassword
import uuid
from typing import Optional

class PostgresUserRepository(UserRepository):

    def __init__(self, db_session: AsyncSession):
        self.db_session = db_session

    async def save(self, user: User) -> User:
        db_user = UserModel(
            id=uuid.UUID(user.id) if user.id else None,
            name=user.name,
            email=user.email.value,
            phone=user.phone,
            hashed_password=user.hashed_password.value
        )

        self.db_session.add(db_user)
        await self.db_session.commit()
        await self.db_session.refresh(db_user)

        if not user.id:
            user.id = str(db_user.id)

        user.updated_at = db_user.updated_at

        return user

    async def find_by_email(self, email_str: str) -> Optional[User]:
        stmt = select(UserModel).where(UserModel.email == email_str)
        result = await self.db_session.execute(stmt)
        db_user = result.scalar_one_or_none()

        if not db_user:
            return None

        return User(
            id=str(db_user.id),
            name=db_user.name,
            email=Email(db_user.email),
            phone=db_user.phone,
            hashed_password=HashedPassword(db_user.hashed_password),
            created_at=db_user.created_at,
            updated_at=db_user.updated_at
        )
