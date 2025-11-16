from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.core.models.service import Service
from backend.core.models.service_type import ServiceType
from backend.infrastructure.database.postgres_config import engine
from backend.infrastructure.models.base import Base
from backend.infrastructure.repositories.postgres_service_repository import PostgresServiceRepository
from backend.interfaces.api.booking_routes import router as booking_router
from backend.interfaces.api.auth_routes import router as auth_router
from backend.interfaces.api.admin_routes import router as admin_router
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# @asynccontextmanager
# async def lifespan(app: FastAPI):
#     logger.info("Initializing database tables...")
#     async with engine.begin() as conn:
#         await conn.run_sync(Base.metadata.create_all)
#     logger.info("Database tables initialized.")
#     yield
#     logger.info("Shutting down...")

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Initializing database tables...")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    logger.info("Database tables initialized.")

    logger.info("Checking for initial services...")
    from backend.infrastructure.database.postgres_config import async_sessionmaker_instance
    async with async_sessionmaker_instance() as session:
        service_repo = PostgresServiceRepository(session)

        initial_services = [
            Service(
                id=None,
                name="Initial Cardiology Consultation",
                description="First consultation with a cardiologist, including medical history review and basic examination.",
                duration_minutes=45,
                price=180.00,
                service_type=ServiceType.CONSULTATION
            ),
            Service(
                id=None,
                name="Follow-up Cardiology Visit",
                description="Regular check-up appointment for ongoing cardiac care.",
                duration_minutes=30,
                price=120.00,
                service_type=ServiceType.FOLLOW_UP
            ),
            Service(
                id=None,
                name="Dermatology Consultation",
                description="Consultation with a dermatologist for skin, hair, and nail conditions.",
                duration_minutes=45,
                price=150.00,
                service_type=ServiceType.CONSULTATION
            ),
            Service(
                id=None,
                name="Physical Therapy Session",
                description="Therapeutic exercise and rehabilitation session.",
                duration_minutes=30,
                price=100.00,
                service_type=ServiceType.FOLLOW_UP
            ),
            Service(
                id=None,
                name="Emergency Medical Consultation",
                description="Urgent consultation for unexpected health issues.",
                duration_minutes=90,
                price=250.00,
                service_type=ServiceType.EMERGENCY
            )
        ]

        for service_data in initial_services:
            existing_service = await service_repo.find_by_name(service_data.name)
            if not existing_service:
                logger.info("Creating initial service: %s", service_data.name)
                await service_repo.save(service_data)
            else:
                logger.info("Service %s already exists, skipping creation.", service_data.name)

    logger.info("Initial services checked/created.")
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
app.include_router(auth_router, prefix="/api")
app.include_router(admin_router, prefix="/api")

@app.get("/")
async def root():
    return {"message": "ScheduleFlow API is running!"}