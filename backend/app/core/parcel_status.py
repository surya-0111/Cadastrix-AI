from enum import Enum


class ParcelValidityStatus(str, Enum):
    """Machine-generated parcel validity states."""

    VALID = "VALID"
    INVALID = "INVALID"


class ParcelReviewStatus(str, Enum):
    """Human review workflow states."""

    PENDING = "PENDING"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"