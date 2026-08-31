from app.services.validation_service import (
    build_validation_report,
)


def test_valid_report() -> None:
    report = build_validation_report(
        geometry_errors=[],
        measurement_errors=[],
        duplicate_pairs=[],
        overlap_violations=[],
        gap_areas_m2=[],
    )

    assert report.status == "VALID"
    assert report.valid is True
    assert report.review_required is False
    assert report.total_errors == 0


def test_invalid_geometry_report() -> None:
    report = build_validation_report(
        geometry_errors=[
            "Self-intersection detected."
        ],
        measurement_errors=[],
        duplicate_pairs=[],
        overlap_violations=[],
        gap_areas_m2=[],
    )

    assert report.status == "INVALID"
    assert report.valid is False
    assert report.review_required is False
    assert report.total_errors == 1


def test_duplicate_report() -> None:
    report = build_validation_report(
        geometry_errors=[],
        measurement_errors=[],
        duplicate_pairs=[
            (1, 2),
        ],
        overlap_violations=[],
        gap_areas_m2=[],
    )

    assert report.status == "INVALID"
    assert report.valid is False
    assert report.review_required is False


def test_overlap_report() -> None:
    report = build_validation_report(
        geometry_errors=[],
        measurement_errors=[],
        duplicate_pairs=[],
        overlap_violations=[
            (1, 2, 25.5),
        ],
        gap_areas_m2=[],
    )

    assert report.status == "REVIEW_REQUIRED"
    assert report.valid is True
    assert report.review_required is True


def test_gap_report() -> None:
    report = build_validation_report(
        geometry_errors=[],
        measurement_errors=[],
        duplicate_pairs=[],
        overlap_violations=[],
        gap_areas_m2=[
            120.5,
        ],
    )

    assert report.status == "REVIEW_REQUIRED"
    assert report.valid is True
    assert report.review_required is True


def test_invalid_takes_priority_over_review() -> None:
    report = build_validation_report(
        geometry_errors=[
            "Invalid geometry."
        ],
        measurement_errors=[],
        duplicate_pairs=[],
        overlap_violations=[
            (1, 2, 25.5),
        ],
        gap_areas_m2=[
            120.5,
        ],
    )

    assert report.status == "INVALID"
    assert report.valid is False
    assert report.review_required is True