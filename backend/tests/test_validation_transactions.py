from unittest.mock import MagicMock

from app.schemas.validation import (
    ParcelValidationItem,
)
from app.services.validation_service import (
    persist_parcel_validation,
)


def test_persist_parcel_validation_commits() -> None:
    db = MagicMock()

    parcel = MagicMock()
    parcel.id = 1

    db.scalars.return_value.all.return_value = [
        parcel
    ]

    result = ParcelValidationItem(
        parcel_id=1,
        parcel_code="P-001",
        validity_status="VALID",
        review_status="PENDING",
        geometry_errors=[],
        measurement_errors=[],
        is_duplicate=False,
        overlap_area_m2=0.0,
    )

    persist_parcel_validation(
        db=db,
        results=[result],
    )

    assert parcel.validity_status == "VALID"
    assert parcel.review_status == "PENDING"

    db.commit.assert_called_once()