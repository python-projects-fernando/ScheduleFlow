from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from backend.application.use_cases import BookAppointmentUseCase
from backend.application.dtos import (
    BookAppointmentRequest, BookAppointmentResponse
)
from backend.infrastructure.database.session import get_db_session
from backend.infrastructure.repositories.appointment_repository import AppointmentRepository
from backend.infrastructure.repositories.service_repository import ServiceRepository
import logging

# Adicione um logger
logger = logging.getLogger(__name__)

router = APIRouter()

async def get_appointment_use_case(db: AsyncSession = Depends(get_db_session)):
    appointment_repo = AppointmentRepository(db)
    service_repo = ServiceRepository(db)
    return BookAppointmentUseCase(appointment_repo, service_repo)

@router.post("/book", response_model=BookAppointmentResponse)
async def book_appointment(
    request: BookAppointmentRequest,
    use_case: BookAppointmentUseCase = Depends(get_appointment_use_case)
):
    try:
        # Tente executar o use case
        response = await use_case.execute(request)
        if not response.success:
            # Se o use case reportar falha (como conflito), retorne erro 400
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=response.message)
        return response
    except HTTPException:
        # Se for uma HTTPException já lançada (como acima ou em outro lugar do use_case),
        # apenas relance para o FastAPI tratar.
        raise
    except Exception as e:
        # Captura qualquer outra exceção (TypeError, ValueError, etc.)
        # Registra a exceção com traceback
        logger.exception("Erro inesperado ao tentar agendar consulta: %s", e)
        # Lança uma HTTPException 500 para o cliente
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Erro interno do servidor.")

# ... outros endpoints ...