from pydantic import BaseModel

class CancelAppointmentRequest(BaseModel):
    cancellation_token: str