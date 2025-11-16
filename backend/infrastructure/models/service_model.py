from sqlalchemy import Column, String, DateTime, Integer, Float, Enum as SQLEnum, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
import uuid
from backend.core.models.service_type import ServiceType
from backend.infrastructure.models.base import Base

class ServiceModel(Base):
    __tablename__ = "services"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    duration_minutes = Column(Integer, nullable=False)
    price = Column(Float, nullable=True)
    service_type = Column(SQLEnum(ServiceType), nullable=False)
    created_at = Column(DateTime(timezone=True), default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), default=func.now(), onupdate=func.now(), nullable=False)
