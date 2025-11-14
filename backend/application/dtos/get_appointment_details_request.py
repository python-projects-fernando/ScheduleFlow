from pydantic import BaseModel

class GetAppointmentDetailsRequest(BaseModel):
    view_token: str