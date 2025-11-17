import pytest
from datetime import datetime, timezone, timedelta
import uuid
from backend.core.models.appointment import Appointment
from backend.core.models.appointment_status import AppointmentStatus
from backend.core.value_objects.time_slot import TimeSlot


class TestAppointment:

    def test_appointment_creation_with_valid_data(self):
        user_id = str(uuid.uuid4())
        service_id = str(uuid.uuid4())
        start_time = datetime.now(timezone.utc)
        end_time = start_time + timedelta(hours=1)
        scheduled_slot = TimeSlot(start=start_time, end=end_time)

        appointment = Appointment(
            id=None,
            user_id=user_id,
            service_id=service_id,
            scheduled_slot=scheduled_slot
        )

        assert appointment.user_id == user_id
        assert appointment.service_id == service_id
        assert appointment.scheduled_slot == scheduled_slot
        assert appointment.status == AppointmentStatus.SCHEDULED
        assert appointment.created_at is not None
        assert appointment.updated_at is not None
        assert appointment.view_token is not None
        assert appointment.cancellation_token is not None
        assert uuid.UUID(appointment.view_token)
        assert uuid.UUID(appointment.cancellation_token)

    def test_appointment_creation_sets_default_timestamps(self):
        user_id = str(uuid.uuid4())
        service_id = str(uuid.uuid4())
        start_time = datetime.now(timezone.utc)
        end_time = start_time + timedelta(hours=1)
        scheduled_slot = TimeSlot(start=start_time, end=end_time)

        before_creation = datetime.now(timezone.utc)
        appointment = Appointment(
            id=None,
            user_id=user_id,
            service_id=service_id,
            scheduled_slot=scheduled_slot
        )
        after_creation = datetime.now(timezone.utc)

        assert before_creation <= appointment.created_at <= after_creation
        assert before_creation <= appointment.updated_at <= after_creation

    def test_appointment_creation_generates_tokens(self):
        user_id = str(uuid.uuid4())
        service_id = str(uuid.uuid4())
        start_time = datetime.now(timezone.utc)
        end_time = start_time + timedelta(hours=1)
        scheduled_slot = TimeSlot(start=start_time, end=end_time)

        appointment = Appointment(
            id=None,
            user_id=user_id,
            service_id=service_id,
            scheduled_slot=scheduled_slot
        )

        assert appointment.view_token != ""
        assert appointment.cancellation_token != ""
        assert appointment.view_token is not None
        assert appointment.cancellation_token is not None

    def test_appointment_creation_fails_without_user_id(self):
        service_id = str(uuid.uuid4())
        start_time = datetime.now(timezone.utc)
        end_time = start_time + timedelta(hours=1)
        scheduled_slot = TimeSlot(start=start_time, end=end_time)

        with pytest.raises(ValueError, match="User ID cannot be empty"):
            Appointment(
                id=None,
                user_id="",
                service_id=service_id,
                scheduled_slot=scheduled_slot
            )

        with pytest.raises(ValueError, match="User ID cannot be empty"):
            Appointment(
                id=None,
                user_id=None,
                service_id=service_id,
                scheduled_slot=scheduled_slot
            )

    def test_appointment_creation_fails_without_service_id(self):
        user_id = str(uuid.uuid4())
        start_time = datetime.now(timezone.utc)
        end_time = start_time + timedelta(hours=1)
        scheduled_slot = TimeSlot(start=start_time, end=end_time)

        with pytest.raises(ValueError, match="Service ID cannot be empty"):
            Appointment(
                id=None,
                user_id=user_id,
                service_id="",
                scheduled_slot=scheduled_slot
            )

        with pytest.raises(ValueError, match="Service ID cannot be empty"):
            Appointment(
                id=None,
                user_id=user_id,
                service_id=None,
                scheduled_slot=scheduled_slot
            )

    def test_cancel_appointment_scheduled(self):
        user_id = str(uuid.uuid4())
        service_id = str(uuid.uuid4())
        start_time = datetime.now(timezone.utc)
        end_time = start_time + timedelta(hours=1)
        scheduled_slot = TimeSlot(start=start_time, end=end_time)

        appointment = Appointment(
            id=None,
            user_id=user_id,
            service_id=service_id,
            scheduled_slot=scheduled_slot
        )

        original_updated_at = appointment.updated_at
        appointment.cancel()

        assert appointment.status == AppointmentStatus.CANCELLED
        assert appointment.updated_at > original_updated_at

    def test_cancel_appointment_not_scheduled_raises_error(self):
        user_id = str(uuid.uuid4())
        service_id = str(uuid.uuid4())
        start_time = datetime.now(timezone.utc)
        end_time = start_time + timedelta(hours=1)
        scheduled_slot = TimeSlot(start=start_time, end=end_time)

        appointment = Appointment(
            id=None,
            user_id=user_id,
            service_id=service_id,
            scheduled_slot=scheduled_slot
        )
        appointment.cancel()

        with pytest.raises(ValueError, match="Cannot cancel an appointment that is not scheduled"):
            appointment.cancel()

        appointment_completed = Appointment(
            id=None,
            user_id=user_id,
            service_id=service_id,
            scheduled_slot=scheduled_slot
        )
        appointment_completed.complete()

        with pytest.raises(ValueError, match="Cannot cancel an appointment that is not scheduled"):
            appointment_completed.cancel()

    def test_complete_appointment_scheduled(self):
        user_id = str(uuid.uuid4())
        service_id = str(uuid.uuid4())
        start_time = datetime.now(timezone.utc)
        end_time = start_time + timedelta(hours=1)
        scheduled_slot = TimeSlot(start=start_time, end=end_time)

        appointment = Appointment(
            id=None,
            user_id=user_id,
            service_id=service_id,
            scheduled_slot=scheduled_slot
        )

        original_updated_at = appointment.updated_at
        appointment.complete()

        assert appointment.status == AppointmentStatus.COMPLETED
        assert appointment.updated_at > original_updated_at

    def test_complete_appointment_not_scheduled_raises_error(self):
        user_id = str(uuid.uuid4())
        service_id = str(uuid.uuid4())
        start_time = datetime.now(timezone.utc)
        end_time = start_time + timedelta(hours=1)
        scheduled_slot = TimeSlot(start=start_time, end=end_time)

        appointment = Appointment(
            id=None,
            user_id=user_id,
            service_id=service_id,
            scheduled_slot=scheduled_slot
        )
        appointment.cancel()

        with pytest.raises(ValueError, match="Cannot complete an appointment that is not scheduled"):
            appointment.complete()

        appointment_completed = Appointment(
            id=None,
            user_id=user_id,
            service_id=service_id,
            scheduled_slot=scheduled_slot
        )
        appointment_completed.complete()

        with pytest.raises(ValueError, match="Cannot complete an appointment that is not scheduled"):
            appointment_completed.complete()

    def test_is_conflicting_with_no_overlap(self):
        user_id = str(uuid.uuid4())
        service_id = str(uuid.uuid4())

        slot1_start = datetime.now(timezone.utc)
        slot1_end = slot1_start + timedelta(hours=1)
        slot2_start = slot1_end
        slot2_end = slot2_start + timedelta(hours=1)

        appt1 = Appointment(
            id=None,
            user_id=user_id,
            service_id=service_id,
            scheduled_slot=TimeSlot(start=slot1_start, end=slot1_end)
        )
        appt2 = Appointment(
            id=None,
            user_id=user_id,
            service_id=service_id,
            scheduled_slot=TimeSlot(start=slot2_start, end=slot2_end)
        )

        assert not appt1.is_conflicting_with(appt2)
        assert not appt2.is_conflicting_with(appt1)

    def test_is_conflicting_with_partial_overlap_start(self):
        user_id = str(uuid.uuid4())
        service_id = str(uuid.uuid4())

        slot1_start = datetime.now(timezone.utc)
        slot1_end = slot1_start + timedelta(hours=2)
        slot2_start = slot1_start + timedelta(minutes=30)
        slot2_end = slot2_start + timedelta(hours=1)

        appt1 = Appointment(
            id=None,
            user_id=user_id,
            service_id=service_id,
            scheduled_slot=TimeSlot(start=slot1_start, end=slot1_end)
        )
        appt2 = Appointment(
            id=None,
            user_id=user_id,
            service_id=service_id,
            scheduled_slot=TimeSlot(start=slot2_start, end=slot2_end)
        )

        assert appt1.is_conflicting_with(appt2)
        assert appt2.is_conflicting_with(appt1)

    def test_is_conflicting_with_partial_overlap_end(self):
        user_id = str(uuid.uuid4())
        service_id = str(uuid.uuid4())

        slot1_start = datetime.now(timezone.utc)
        slot1_end = slot1_start + timedelta(hours=2)
        slot2_start = slot1_start - timedelta(minutes=30)
        slot2_end = slot1_start + timedelta(minutes=30)

        appt1 = Appointment(
            id=None,
            user_id=user_id,
            service_id=service_id,
            scheduled_slot=TimeSlot(start=slot1_start, end=slot1_end)
        )
        appt2 = Appointment(
            id=None,
            user_id=user_id,
            service_id=service_id,
            scheduled_slot=TimeSlot(start=slot2_start, end=slot2_end)
        )

        assert appt1.is_conflicting_with(appt2)
        assert appt2.is_conflicting_with(appt1)

    def test_is_conflicting_with_exact_overlap(self):
        user_id = str(uuid.uuid4())
        service_id = str(uuid.uuid4())

        slot_start = datetime.now(timezone.utc)
        slot_end = slot_start + timedelta(hours=1)

        appt1 = Appointment(
            id=None,
            user_id=user_id,
            service_id=service_id,
            scheduled_slot=TimeSlot(start=slot_start, end=slot_end)
        )
        appt2 = Appointment(
            id=None,
            user_id=user_id,
            service_id=service_id,
            scheduled_slot=TimeSlot(start=slot_start, end=slot_end)
        )

        assert appt1.is_conflicting_with(appt2)
        assert appt2.is_conflicting_with(appt1)

    def test_is_conflicting_with_fully_contained(self):
        user_id = str(uuid.uuid4())
        service_id = str(uuid.uuid4())

        slot1_start = datetime.now(timezone.utc)
        slot1_end = slot1_start + timedelta(hours=3)
        slot2_start = slot1_start + timedelta(minutes=30)
        slot2_end = slot1_end - timedelta(minutes=30)

        appt1 = Appointment(
            id=None,
            user_id=user_id,
            service_id=service_id,
            scheduled_slot=TimeSlot(start=slot1_start, end=slot1_end)
        )
        appt2 = Appointment(
            id=None,
            user_id=user_id,
            service_id=service_id,
            scheduled_slot=TimeSlot(start=slot2_start, end=slot2_end)
        )

        assert appt1.is_conflicting_with(appt2)
        assert appt2.is_conflicting_with(appt1)

    def test_is_conflicting_with_fully_containing(self):
        user_id = str(uuid.uuid4())
        service_id = str(uuid.uuid4())

        slot1_start = datetime.now(timezone.utc)
        slot1_end = slot1_start + timedelta(hours=1)
        slot2_start = slot1_start - timedelta(minutes=30)
        slot2_end = slot1_end + timedelta(minutes=30)

        appt1 = Appointment(
            id=None,
            user_id=user_id,
            service_id=service_id,
            scheduled_slot=TimeSlot(start=slot1_start, end=slot1_end)
        )
        appt2 = Appointment(
            id=None,
            user_id=user_id,
            service_id=service_id,
            scheduled_slot=TimeSlot(start=slot2_start, end=slot2_end)
        )

        assert appt1.is_conflicting_with(appt2)
        assert appt2.is_conflicting_with(appt1)
