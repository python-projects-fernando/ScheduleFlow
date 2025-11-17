import pytest
from datetime import datetime, timezone, timedelta
from backend.core.value_objects.time_slot import TimeSlot

class TestTimeSlot:

    def test_time_slot_creation_valid(self):
        start = datetime(2023, 1, 1, 10, 0, tzinfo=timezone.utc)
        end = datetime(2023, 1, 1, 11, 0, tzinfo=timezone.utc)
        slot = TimeSlot(start, end)
        assert slot.start == start
        assert slot.end == end

    def test_time_slot_creation_auto_sets_timezone(self):
        start_naive = datetime(2023, 1, 1, 10, 0)
        end_naive = datetime(2023, 1, 1, 11, 0)
        slot = TimeSlot(start_naive, end_naive)
        assert slot.start.tzinfo is timezone.utc
        assert slot.end.tzinfo is timezone.utc
        assert slot.start.replace(tzinfo=None) == start_naive
        assert slot.end.replace(tzinfo=None) == end_naive

    def test_time_slot_invalid_start_after_end(self):
        start = datetime(2023, 1, 1, 11, 0, tzinfo=timezone.utc)
        end = datetime(2023, 1, 1, 10, 0, tzinfo=timezone.utc)
        with pytest.raises(ValueError, match="Start time must be before end time"):
            TimeSlot(start, end)

    def test_time_slot_invalid_start_equal_end(self):
        start = datetime(2023, 1, 1, 10, 0, tzinfo=timezone.utc)
        end = datetime(2023, 1, 1, 10, 0, tzinfo=timezone.utc)
        with pytest.raises(ValueError, match="Start time must be before end time"):
            TimeSlot(start, end)

    def test_overlaps_true_partial_overlap_start(self):
        slot1 = TimeSlot(
            datetime(2023, 1, 1, 10, 0, tzinfo=timezone.utc),
            datetime(2023, 1, 1, 12, 0, tzinfo=timezone.utc)
        )
        slot2 = TimeSlot(
            datetime(2023, 1, 1, 11, 0, tzinfo=timezone.utc),
            datetime(2023, 1, 1, 13, 0, tzinfo=timezone.utc)
        )
        assert slot1.overlaps(slot2)
        assert slot2.overlaps(slot1)

    def test_overlaps_true_partial_overlap_end(self):
        slot1 = TimeSlot(
            datetime(2023, 1, 1, 10, 0, tzinfo=timezone.utc),
            datetime(2023, 1, 1, 12, 0, tzinfo=timezone.utc)
        )
        slot2 = TimeSlot(
            datetime(2023, 1, 1, 9, 0, tzinfo=timezone.utc),
            datetime(2023, 1, 1, 11, 0, tzinfo=timezone.utc)
        )
        assert slot1.overlaps(slot2)
        assert slot2.overlaps(slot1)

    def test_overlaps_true_exact_overlap(self):
        slot1 = TimeSlot(
            datetime(2023, 1, 1, 10, 0, tzinfo=timezone.utc),
            datetime(2023, 1, 1, 12, 0, tzinfo=timezone.utc)
        )
        slot2 = TimeSlot(
            datetime(2023, 1, 1, 10, 0, tzinfo=timezone.utc),
            datetime(2023, 1, 1, 12, 0, tzinfo=timezone.utc)
        )
        assert slot1.overlaps(slot2)
        assert slot2.overlaps(slot1)

    def test_overlaps_true_fully_contained(self):
        slot1 = TimeSlot(
            datetime(2023, 1, 1, 10, 0, tzinfo=timezone.utc),
            datetime(2023, 1, 1, 13, 0, tzinfo=timezone.utc)
        )
        slot2 = TimeSlot(
            datetime(2023, 1, 1, 11, 0, tzinfo=timezone.utc),
            datetime(2023, 1, 1, 12, 0, tzinfo=timezone.utc)
        )
        assert slot1.overlaps(slot2)
        assert slot2.overlaps(slot1)

    def test_overlaps_true_fully_containing(self):
        slot1 = TimeSlot(
            datetime(2023, 1, 1, 11, 0, tzinfo=timezone.utc),
            datetime(2023, 1, 1, 12, 0, tzinfo=timezone.utc)
        )
        slot2 = TimeSlot(
            datetime(2023, 1, 1, 10, 0, tzinfo=timezone.utc),
            datetime(2023, 1, 1, 13, 0, tzinfo=timezone.utc)
        )
        assert slot1.overlaps(slot2)
        assert slot2.overlaps(slot1)

    def test_overlaps_false_no_overlap(self):
        slot1 = TimeSlot(
            datetime(2023, 1, 1, 10, 0, tzinfo=timezone.utc),
            datetime(2023, 1, 1, 11, 0, tzinfo=timezone.utc)
        )
        slot2 = TimeSlot(
            datetime(2023, 1, 1, 11, 0, tzinfo=timezone.utc),
            datetime(2023, 1, 1, 12, 0, tzinfo=timezone.utc)
        )
        assert not slot1.overlaps(slot2)
        assert not slot2.overlaps(slot1)

    def test_overlaps_false_gap(self):
        slot1 = TimeSlot(
            datetime(2023, 1, 1, 10, 0, tzinfo=timezone.utc),
            datetime(2023, 1, 1, 11, 0, tzinfo=timezone.utc)
        )
        slot2 = TimeSlot(
            datetime(2023, 1, 1, 12, 0, tzinfo=timezone.utc),
            datetime(2023, 1, 1, 13, 0, tzinfo=timezone.utc)
        )
        assert not slot1.overlaps(slot2)
        assert not slot2.overlaps(slot1)

    def test_contains_true(self):
        slot = TimeSlot(
            datetime(2023, 1, 1, 10, 0, tzinfo=timezone.utc),
            datetime(2023, 1, 1, 12, 0, tzinfo=timezone.utc)
        )
        dt_inside = datetime(2023, 1, 1, 11, 0, tzinfo=timezone.utc)
        assert slot.contains(dt_inside)

    def test_contains_false_before(self):
        slot = TimeSlot(
            datetime(2023, 1, 1, 10, 0, tzinfo=timezone.utc),
            datetime(2023, 1, 1, 12, 0, tzinfo=timezone.utc)
        )
        dt_before = datetime(2023, 1, 1, 9, 0, tzinfo=timezone.utc)
        assert not slot.contains(dt_before)

    def test_contains_false_after(self):
        slot = TimeSlot(
            datetime(2023, 1, 1, 10, 0, tzinfo=timezone.utc),
            datetime(2023, 1, 1, 12, 0, tzinfo=timezone.utc)
        )
        dt_after = datetime(2023, 1, 1, 13, 0, tzinfo=timezone.utc)
        assert not slot.contains(dt_after)

    def test_contains_edge_start_inclusive(self):
        slot = TimeSlot(
            datetime(2023, 1, 1, 10, 0, tzinfo=timezone.utc),
            datetime(2023, 1, 1, 12, 0, tzinfo=timezone.utc)
        )
        dt_start = datetime(2023, 1, 1, 10, 0, tzinfo=timezone.utc)
        assert slot.contains(dt_start)

    def test_contains_edge_end_inclusive(self):
        slot = TimeSlot(
            datetime(2023, 1, 1, 10, 0, tzinfo=timezone.utc),
            datetime(2023, 1, 1, 12, 0, tzinfo=timezone.utc)
        )
        dt_end = datetime(2023, 1, 1, 12, 0, tzinfo=timezone.utc)
        assert slot.contains(dt_end)

    def test_contains_auto_sets_timezone(self):
        slot = TimeSlot(
            datetime(2023, 1, 1, 10, 0, tzinfo=timezone.utc),
            datetime(2023, 1, 1, 12, 0, tzinfo=timezone.utc)
        )
        dt_naive = datetime(2023, 1, 1, 11, 0)
        assert slot.contains(dt_naive)
