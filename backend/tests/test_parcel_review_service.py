import pytest
from unittest.mock import MagicMock

from app.models.parcel import Parcel
from app.services.parcel_review_service import (
    ParcelReviewError,
    review_parcel,
)


def test_review_must_be_approved_or_rejected() -> None:
    db = MagicMock()

    with pytest.raises(ParcelReviewError):
        review_parcel(
            db=db,
            parcel_id=1,
            review_status="PENDING",
        )


def test_review_missing_parcel() -> None:
    db = MagicMock()

    db.scalars.return_value.first.return_value = None

    with pytest.raises(ParcelReviewError):
        review_parcel(
            db=db,
            parcel_id=999,
            review_status="APPROVED",
        )


def test_review_pending_parcel() -> None:
    db = MagicMock()

    parcel = MagicMock(spec=Parcel)
    parcel.id = 1
    parcel.review_status = "PENDING"

    db.scalars.return_value.first.return_value = parcel

    result = review_parcel(
        db=db,
        parcel_id=1,
        review_status="APPROVED",
        review_comment="Boundary reviewed.",
    )

    assert result is parcel
    assert parcel.review_status == "APPROVED"
    assert parcel.review_comment == (
        "Boundary reviewed."
    )

    db.commit.assert_called_once()
    db.refresh.assert_called_once_with(parcel)


def test_already_reviewed_parcel_cannot_be_reviewed_again() -> None:
    db = MagicMock()

    parcel = MagicMock(spec=Parcel)
    parcel.id = 1
    parcel.review_status = "APPROVED"

    db.scalars.return_value.first.return_value = parcel

    with pytest.raises(ParcelReviewError):
        review_parcel(
            db=db,
            parcel_id=1,
            review_status="REJECTED",
        )

    db.commit.assert_not_called()