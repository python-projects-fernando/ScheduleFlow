from sqlalchemy import Column, String, DateTime, Integer, Enum as SQLEnum, Text, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
import uuid
from backend.core.models.appointment_status import AppointmentStatus
from backend.core.models.service_type import ServiceType
from backend.infrastructure.models.base import Base


class AppointmentModel(Base):
    __tablename__ = "appointments"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    client_name = Column(String, nullable=False)
    client_email = Column(String, nullable=False)
    client_phone = Column(String, nullable=True)

    service_type = Column(SQLEnum(ServiceType), nullable=False)

    scheduled_start = Column(DateTime(timezone=True), nullable=False)
    scheduled_end = Column(DateTime(timezone=True), nullable=False)

    status = Column(SQLEnum(AppointmentStatus), default=AppointmentStatus.SCHEDULED)

    cancellation_token = Column(String, unique=True, nullable=True)

    created_at = Column(DateTime(timezone=True), default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), default=func.now(), onupdate=func.now(), nullable=False)