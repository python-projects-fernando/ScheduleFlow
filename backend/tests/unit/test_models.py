import pytest
from backend.core.models import Appointment, AppointmentStatus, ServiceType
from backend.core.value_objects import Email, TimeSlot
from datetime import datetime, timedelta, timezone

def test_appointment_creation(mock_email):
    appointment = Appointment(
        id="123e4567-e89b-12d3-a456-426614174000",
        client_name="John Doe",
        client_email=mock_email,
        client_phone="+1234567890",
        service_type=ServiceType.CONSULTATION,
        scheduled_slot=TimeSlot(
            start=datetime.utcnow() + timedelta(hours=1),
            end=datetime.utcnow() + timedelta(hours=1, minutes=30)
        )
    )
    assert appointment.client_name == "John Doe"
    assert appointment.client_email.value == "test@example.com"
    assert appointment.status == AppointmentStatus.SCHEDULED

def test_appointment_invalid_name():
    with pytest.raises(ValueError):
        Appointment(
            id="123e4567-e89b-12d3-a456-426614174000",
            client_name="",
            client_email=Email("test@example.com"),
            client_phone="+1234567890",
            service_type=ServiceType.CONSULTATION,
            scheduled_slot=TimeSlot(
                start=datetime.utcnow() + timedelta(hours=1),
                end=datetime.utcnow() + timedelta(hours=1, minutes=30)
            )
        )

def test_appointment_cancel():
    appointment = Appointment(
        id="123e4567-e89b-12d3-a456-426614174000",
        client_name="John Doe",
        client_email=Email("test@example.com"),
        client_phone="+1234567890",
        service_type=ServiceType.CONSULTATION,
        scheduled_slot=TimeSlot(
            start=datetime.utcnow() + timedelta(hours=1),
            end=datetime.utcnow() + timedelta(hours=1, minutes=30)
        )
    )
    appointment.cancel()
    assert appointment.status == AppointmentStatus.CANCELLED

def test_appointment_conflict():
    slot1 = TimeSlot(datetime(2023, 1, 1, 10, 0, tzinfo=timezone.utc), datetime(2023, 1, 1, 11, 0, tzinfo=timezone.utc))
    slot2 = TimeSlot(datetime(2023, 1, 1, 10, 30, tzinfo=timezone.utc), datetime(2023, 1, 1, 11, 30, tzinfo=timezone.utc))

    appt1 = Appointment(
        id="1",
        client_name="John",
        client_email=Email("john@example.com"),
        client_phone="+1 (234) 567-8901",
        service_type=ServiceType.CONSULTATION,
        scheduled_slot=slot1
    )

    appt2 = Appointment(
        id="2",
        client_name="Jane",
        client_email=Email("jane@example.com"),
        client_phone="(098) 765-4321",
        service_type=ServiceType.CONSULTATION,
        scheduled_slot=slot2
    )

    assert appt1.is_conflicting_with(appt2)