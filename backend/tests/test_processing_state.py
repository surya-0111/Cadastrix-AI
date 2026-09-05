import pytest

from app.core.processing import (
    ProcessingStatus,
    is_valid_transition,
    validate_transition,
)


def test_valid_transition() -> None:
    assert is_valid_transition(
        ProcessingStatus.QUEUED,
        ProcessingStatus.PREPROCESSING,
    )


def test_invalid_transition() -> None:
    assert not is_valid_transition(
        ProcessingStatus.QUEUED,
        ProcessingStatus.COMPLETED,
    )


def test_validation_accepts_valid_transition() -> None:
    validate_transition(
        ProcessingStatus.PREPROCESSING,
        ProcessingStatus.AI_PROCESSING,
    )


def test_validation_rejects_invalid_transition() -> None:
    with pytest.raises(ValueError):
        validate_transition(
            ProcessingStatus.COMPLETED,
            ProcessingStatus.AI_PROCESSING,
        )


def test_completed_has_no_outgoing_transitions() -> None:
    assert not is_valid_transition(
        ProcessingStatus.COMPLETED,
        ProcessingStatus.FAILED,
    )


def test_cancelled_has_no_outgoing_transitions() -> None:
    assert not is_valid_transition(
        ProcessingStatus.CANCELLED,
        ProcessingStatus.PREPROCESSING,
    )