import pytest
from backend.core.value_objects import Email, TimeSlot, ServiceDuration
from datetime import datetime, timedelta, timezone
from email_validator import EmailNotValidError

def test_email_creation_valid():
    email = Email("test@example.com")
    assert email.value == "test@example.com"

def test_email_normalization():
    email = Email("Test@EXAMPLE.COM")
    assert email.value == "Test@example.com"

def test_email_invalid():
    with pytest.raises(ValueError):
        Email("invalid-email")

# def test_time_slot_creation():
#     start = datetime.now()
#     end = start + timedelta(minutes=30)
#     slot = TimeSlot(start, end)
#     assert slot.start == start
#     assert slot.end == end

def test_time_slot_creation():
    start = datetime.now(timezone.utc) # Corrigido: Use timezone.utc
    end = start + timedelta(minutes=30)
    slot = TimeSlot(start, end)
    # A comparação agora deve funcionar, pois ambos são offset-aware (ou ambos offset-naive se não forçarmos no __post_init__)
    # Mas como nosso __post_init__ força o UTC, a comparação funciona assim:
    assert slot.start == start # start agora é aware, slot.start também é aware e igual após __post_init__
    assert slot.end == end

def test_time_slot_invalid():
    start = datetime.now()
    end = start - timedelta(minutes=30)
    with pytest.raises(ValueError):
        TimeSlot(start, end)

def test_time_slot_overlaps():
    slot1 = TimeSlot(datetime(2023, 1, 1, 10, 0), datetime(2023, 1, 1, 11, 0))
    slot2 = TimeSlot(datetime(2023, 1, 1, 10, 30), datetime(2023, 1, 1, 11, 30))
    assert slot1.overlaps(slot2)

def test_time_slot_no_overlap():
    slot1 = TimeSlot(datetime(2023, 1, 1, 10, 0), datetime(2023, 1, 1, 11, 0))
    slot2 = TimeSlot(datetime(2023, 1, 1, 11, 0), datetime(2023, 1, 1, 12, 0))
    assert not slot1.overlaps(slot2)

def test_service_duration_valid():
    duration = ServiceDuration(30)
    assert duration.minutes == 30

def test_service_duration_invalid_negative():
    with pytest.raises(ValueError):
        ServiceDuration(-15)

def test_service_duration_invalid_not_multiple_of_15():
    with pytest.raises(ValueError):
        ServiceDuration(25)