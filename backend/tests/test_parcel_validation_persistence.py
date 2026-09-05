from app.schemas.validation import (
    ParcelValidationItem,
)


def test_validation_result_values() -> None:
    valid_result = ParcelValidationItem(
        parcel_id=1,
        parcel_code="P-001",
        validity_status="VALID",
        review_status="PENDING",
        geometry_errors=[],
        measurement_errors=[],
        is_duplicate=False,
        overlap_area_m2=0.0,
    )

    invalid_result = ParcelValidationItem(
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

    assert valid_result.validity_status == "VALID"
    assert invalid_result.validity_status == "INVALID"

    assert valid_result.review_status == "PENDING"
    assert invalid_result.review_status == "PENDING"