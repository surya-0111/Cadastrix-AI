from app.schemas.validation import (
    ParcelValidationItem,
)


def test_valid_parcel_validation_item() -> None:
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

    assert result.validity_status == "VALID"
    assert result.review_status == "PENDING"


def test_invalid_parcel_validation_item() -> None:
    result = ParcelValidationItem(
        parcel_id=2,
        parcel_code="P-002",
        validity_status="INVALID",
        review_status="PENDING",
        geometry_errors=[
            "Self-intersection detected."
        ],
        measurement_errors=[],
        is_duplicate=False,
        overlap_area_m2=0.0,
    )

    assert result.validity_status == "INVALID"
    assert result.review_status == "PENDING"