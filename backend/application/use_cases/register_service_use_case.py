# backend/application/use_cases/create_service_use_case.py
from typing import TYPE_CHECKING
from backend.application.dtos.register_service_request import RegisterServiceRequest
from backend.application.dtos.register_service_response import RegisterServiceResponse
from backend.application.interfaces.repositories.service_repository import ServiceRepository
from backend.core.models.service import Service
import uuid

if TYPE_CHECKING:
    pass

class RegisterServiceUseCase:
    def __init__(self, service_repo: ServiceRepository):
        self.service_repo = service_repo

    async def execute(self, request: RegisterServiceRequest) -> RegisterServiceResponse:
        try:
            new_service = Service(
                id=str(uuid.uuid4()),
                name=request.name,
                description=request.description,
                duration_minutes=request.duration_minutes,
                price=request.price,
                service_type=request.service_type
            )

            saved_service = await self.service_repo.save(new_service)

            return RegisterServiceResponse(
                success=True,
                message="Service created successfully",
                service_id=saved_service.id
            )
        except ValueError as e:
            return RegisterServiceResponse(
                success=False,
                message=f"Validation error: {str(e)}",
                error_code="VALIDATION_ERROR"
            )
        except Exception:
            return RegisterServiceResponse(
                success=False,
                message="An internal error occurred while creating the service.",
                error_code="INTERNAL_ERROR"
            )
