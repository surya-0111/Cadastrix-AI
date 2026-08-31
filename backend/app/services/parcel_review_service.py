from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.parcel_status import ParcelReviewStatus
from app.models.parcel import Parcel


ALLOWED_REVIEW_STATUSES = {
    ParcelReviewStatus.APPROVED.value,
    ParcelReviewStatus.REJECTED.value,
}


class ParcelReviewError(Exception):
    """Raised when a parcel review operation is invalid."""


def review_parcel(
    db: Session,
    parcel_id: int,
    review_status: str,
    review_comment: str | None = None,
) -> Parcel:
    """
    Apply a human review decision to a parcel.

    Allowed transitions:

        PENDING -> APPROVED
        PENDING -> REJECTED
    """

    if review_status not in ALLOWED_REVIEW_STATUSES:
        raise ParcelReviewError(
            "Review status must be APPROVED or REJECTED."
        )

    statement = select(Parcel).where(
        Parcel.id == parcel_id
    )

    parcel = db.scalars(statement).first()

    if parcel is None:
        raise ParcelReviewError(
            f"Parcel {parcel_id} not found."
        )

    current_status = parcel.review_status

    if current_status != ParcelReviewStatus.PENDING.value:
        raise ParcelReviewError(
            f"Parcel {parcel_id} has already been reviewed."
        )

    parcel.review_status = review_status
    parcel.review_comment = review_comment

    db.commit()
    db.refresh(parcel)

    return parcel

def get_parcel_review(
    db: Session,
    parcel_id: int,
) -> Parcel | None:
    """
    Return the parcel used for review inspection.
    """

    statement = select(Parcel).where(
        Parcel.id == parcel_id
    )

    return db.scalars(statement).first()