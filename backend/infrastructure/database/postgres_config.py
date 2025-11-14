import os
from dotenv import load_dotenv
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./fallback_test.db")

engine = create_async_engine(DATABASE_URL, echo=True)
async_sessionmaker_instance = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)