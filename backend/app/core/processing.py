from enum import Enum


class ProcessingStatus(str, Enum):
    """Allowed states for a processing job."""

    QUEUED = "QUEUED"
    PREPROCESSING = "PREPROCESSING"
    AI_PROCESSING = "AI_PROCESSING"
    GIS_PROCESSING = "GIS_PROCESSING"
    VALIDATING = "VALIDATING"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"
    CANCELLED = "CANCELLED"


ALLOWED_PROCESSING_TRANSITIONS: dict[
    ProcessingStatus,
    set[ProcessingStatus],
] = {
    ProcessingStatus.QUEUED: {
        ProcessingStatus.PREPROCESSING,
        ProcessingStatus.CANCELLED,
        ProcessingStatus.FAILED,
    },
    ProcessingStatus.PREPROCESSING: {
        ProcessingStatus.AI_PROCESSING,
        ProcessingStatus.CANCELLED,
        ProcessingStatus.FAILED,
    },
    ProcessingStatus.AI_PROCESSING: {
        ProcessingStatus.GIS_PROCESSING,
        ProcessingStatus.CANCELLED,
        ProcessingStatus.FAILED,
    },
    ProcessingStatus.GIS_PROCESSING: {
        ProcessingStatus.VALIDATING,
        ProcessingStatus.CANCELLED,
        ProcessingStatus.FAILED,
    },
    ProcessingStatus.VALIDATING: {
        ProcessingStatus.COMPLETED,
        ProcessingStatus.FAILED,
    },
    ProcessingStatus.COMPLETED: set(),
    ProcessingStatus.FAILED: set(),
    ProcessingStatus.CANCELLED: set(),
}

def is_valid_transition(
    current: ProcessingStatus,
    target: ProcessingStatus,
) -> bool:
    """Return whether a processing status transition is allowed."""

    return target in ALLOWED_PROCESSING_TRANSITIONS.get(
        current,
        set(),
    )

def validate_transition(
    current: ProcessingStatus,
    target: ProcessingStatus,
) -> None:
    """
    Validate a processing status transition.

    Raises:
        ValueError: If the transition is not allowed.
    """

    if not is_valid_transition(current, target):
        raise ValueError(
            f"Invalid processing transition: "
            f"{current.value} -> {target.value}"
        )