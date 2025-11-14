from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.infrastructure.database.postgres_config import engine
from backend.infrastructure.models.base import Base
from backend.interfaces.api.booking_routes import router as booking_router
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Initializing database tables...")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    logger.info("Database tables initialized.")
    yield
    logger.info("Shutting down...")

app = FastAPI(
    title="ScheduleFlow API",
    description="Automated scheduling system for appointments and bookings.",
    version="0.1.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(booking_router, prefix="/api")

@app.get("/")
async def root():
    return {"message": "ScheduleFlow API is running!"}