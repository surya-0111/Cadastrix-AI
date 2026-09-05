from shapely.geometry.base import BaseGeometry

from app.schemas.validation import (
    GeometryValidationResult,
    MeasurementValidationResult,
)
from app.utils.geometry_measurement import (
    calculate_projected_measurements,
)
from app.utils.geometry_validation import (
    validate_measurements,
    validate_polygon,
)
from app.schemas.validation import (
    DuplicateParcelPair,
    OverlapViolation,
    ParcelValidationReport,
)
from geoalchemy2.shape import to_shape
from sqlalchemy import select

from app.models.parcel import Parcel
from app.schemas.validation import ParcelValidationItem
from app.services.topology_service import (
    calculate_overlap_area,
    find_duplicate_parcels,
    find_overlapping_parcels,
    find_parcel_gaps,
    find_significant_overlaps,
)
from app.utils.geometry_validation import validate_polygon
from sqlalchemy.orm import Session
from geoalchemy2.shape import to_shape
from sqlalchemy import select
from app.schemas.validation import (
    ParcelValidationDetailResponse,
)
from app.utils.postgis_utils import postgis_to_geojson
from app.models.parcel import Parcel
from app.schemas.validation import (
    ParcelValidationItem,
)


def validate_parcel_geometry(
    geometry: BaseGeometry,
) -> GeometryValidationResult:
    """
    Validate a cadastral parcel geometry.
    """

    errors = validate_polygon(
        geometry
    )

    return GeometryValidationResult(
        valid=len(errors) == 0,
        errors=errors,
    )


def validate_parcel_measurements(
    geometry: BaseGeometry,
    source_crs: str,
    measurement_crs: str,
) -> MeasurementValidationResult:
    """
    Calculate and validate parcel area and perimeter.
    """

    area_m2, perimeter_m = (
        calculate_projected_measurements(
            geometry=geometry,
            source_crs=source_crs,
            measurement_crs=measurement_crs,
        )
    )

    errors = validate_measurements(
        area_m2=area_m2,
        perimeter_m=perimeter_m,
    )

    return MeasurementValidationResult(
        valid=len(errors) == 0,
        area_m2=area_m2,
        perimeter_m=perimeter_m,
        errors=errors,
    )

def build_validation_report(
    geometry_errors: list[str],
    measurement_errors: list[str],
    duplicate_pairs: list[tuple[int, int]],
    overlap_violations: list[tuple[int, int, float]],
    gap_areas_m2: list[float],
) -> ParcelValidationReport:
    """
    Combine all parcel validation checks into one report.
    """

    duplicates = [
        DuplicateParcelPair(
            parcel_a=parcel_a,
            parcel_b=parcel_b,
        )
        for parcel_a, parcel_b in duplicate_pairs
    ]

    overlaps = [
        OverlapViolation(
            parcel_a=parcel_a,
            parcel_b=parcel_b,
            overlap_area_m2=overlap_area,
        )
        for parcel_a, parcel_b, overlap_area
        in overlap_violations
    ]

    total_errors = (
        len(geometry_errors)
        + len(measurement_errors)
        + len(duplicates)
        + len(overlaps)
        + len(gap_areas_m2)
    )

    invalid = bool(
        geometry_errors
        or measurement_errors
        or duplicates
    )

    review_required = bool(
        overlaps
        or gap_areas_m2
    )

    if invalid:
        overall_status = "INVALID"
    elif review_required:
        overall_status = "REVIEW_REQUIRED"
    else:
        overall_status = "VALID"

    return ParcelValidationReport(
        status=overall_status,
        valid=not invalid,
        review_required=review_required,
        geometry_errors=geometry_errors,
        measurement_errors=measurement_errors,
        duplicate_pairs=duplicates,
        overlap_violations=overlaps,
        gap_areas_m2=gap_areas_m2,
        total_errors=total_errors,
    )

def validate_processing_job(
    db: Session,
    project_id: int,
    processing_job_id: int,
    boundary_wkt: str,
    geometry_errors: list[str] | None = None,
    measurement_errors: list[str] | None = None,
) -> ParcelValidationReport:
    """
    Run the complete validation suite for a processing job.
    """

    geometry_errors = geometry_errors or []
    measurement_errors = measurement_errors or []

    duplicate_pairs = find_duplicate_parcels(
        db=db,
        project_id=project_id,
        processing_job_id=processing_job_id,
    )

    overlap_violations = find_significant_overlaps(
        db=db,
        project_id=project_id,
        processing_job_id=processing_job_id,
    )

    gap_areas_m2 = find_parcel_gaps(
        db=db,
        project_id=project_id,
        processing_job_id=processing_job_id,
        boundary_wkt=boundary_wkt,
        tolerance_m2=1.0,
    )

    return build_validation_report(
        geometry_errors=geometry_errors,
        measurement_errors=measurement_errors,
        duplicate_pairs=duplicate_pairs,
        overlap_violations=overlap_violations,
        gap_areas_m2=gap_areas_m2,
    )




def validate_single_parcel(
    db: Session,
    parcel: Parcel,
    processing_job_id: int,
) -> ParcelValidationItem:
    """
    Validate one parcel and produce its validation result.
    """

    geometry = to_shape(
        parcel.geometry
    )

    geometry_errors = validate_polygon(
        geometry
    )

    duplicate_pairs = find_duplicate_parcels(
        db=db,
        project_id=parcel.project_id,
        processing_job_id=processing_job_id,
    )

    is_duplicate = any(
        parcel.id in pair
        for pair in duplicate_pairs
    )

    overlap_area_m2 = 0.0

    overlapping_pairs = find_overlapping_parcels(
        db=db,
        project_id=parcel.project_id,
        processing_job_id=processing_job_id,
    )

    for parcel_a, parcel_b in overlapping_pairs:
        if parcel.id not in {
            parcel_a,
            parcel_b,
        }:
            continue

        other_id = (
            parcel_b
            if parcel_a == parcel.id
            else parcel_a
        )

        overlap_area_m2 += calculate_overlap_area(
            db=db,
            parcel_a=parcel.id,
            parcel_b=other_id,
        )

    measurement_errors: list[str] = []

    is_invalid = bool(
        geometry_errors
        or measurement_errors
        or is_duplicate
    )

    return ParcelValidationItem(
        parcel_id=parcel.id,
        parcel_code=parcel.parcel_code,
        validity_status=(
            "INVALID"
            if is_invalid
            else "VALID"
        ),
        review_status="PENDING",
        geometry_errors=geometry_errors,
        measurement_errors=measurement_errors,
        is_duplicate=is_duplicate,
        overlap_area_m2=overlap_area_m2,
    )

def validate_parcels_for_job(
    db: Session,
    processing_job_id: int,
) -> list[ParcelValidationItem]:
    """
    Validate all parcels belonging to a processing job.
    """

    statement = (
        select(Parcel)
        .where(
            Parcel.processing_job_id
            == processing_job_id
        )
        .order_by(Parcel.id)
    )

    parcels = list(
        db.scalars(statement).all()
    )

    duplicate_pairs = find_duplicate_parcels(
        db=db,
        project_id=parcels[0].project_id
        if parcels
        else 0,
        processing_job_id=processing_job_id,
    ) if parcels else []

    overlapping_pairs = find_overlapping_parcels(
        db=db,
        project_id=parcels[0].project_id
        if parcels
        else 0,
        processing_job_id=processing_job_id,
    ) if parcels else []

    duplicate_ids = {
        parcel_id
        for pair in duplicate_pairs
        for parcel_id in pair
    }

    overlap_map: dict[int, float] = {}

    for parcel_a, parcel_b in overlapping_pairs:
        area = calculate_overlap_area(
            db=db,
            parcel_a=parcel_a,
            parcel_b=parcel_b,
        )

        overlap_map[parcel_a] = (
            overlap_map.get(parcel_a, 0.0)
            + area
        )

        overlap_map[parcel_b] = (
            overlap_map.get(parcel_b, 0.0)
            + area
        )

    results: list[ParcelValidationItem] = []

    for parcel in parcels:
        geometry = to_shape(
            parcel.geometry
        )

        geometry_errors = validate_polygon(
            geometry
        )

        is_duplicate = (
            parcel.id in duplicate_ids
        )

        overlap_area_m2 = overlap_map.get(
            parcel.id,
            0.0,
        )

        invalid = bool(
            geometry_errors
            or is_duplicate
        )

        results.append(
            ParcelValidationItem(
                parcel_id=parcel.id,
                parcel_code=parcel.parcel_code,
                validity_status=(
                    "INVALID"
                    if invalid
                    else "VALID"
                ),
                review_status="PENDING",
                geometry_errors=geometry_errors,
                measurement_errors=[],
                is_duplicate=is_duplicate,
                overlap_area_m2=overlap_area_m2,
            )
        )

    return results

def persist_parcel_validation(
    db: Session,
    results: list[ParcelValidationItem],
) -> None:
    """
    Persist validation statuses to the parcels table.
    """

    for result in results:
        statement = select(Parcel).where(
            Parcel.id == result.parcel_id
        )

        parcel = db.scalars(
            statement
        ).first()

        if parcel is None:
            continue

        parcel.validity_status = (
            result.validity_status
        )

        parcel.review_status = (
            result.review_status
        )

    db.commit()

def validate_parcels_for_job(
    db: Session,
    processing_job_id: int,
) -> list[ParcelValidationItem]:
    """
    Validate all parcels belonging to a processing job.
    """

    statement = (
        select(Parcel)
        .where(
            Parcel.processing_job_id
            == processing_job_id
        )
        .order_by(Parcel.id)
    )

    parcels = list(
        db.scalars(statement).all()
    )

    if not parcels:
        return []

    project_id = parcels[0].project_id

    duplicate_pairs = find_duplicate_parcels(
        db=db,
        project_id=project_id,
        processing_job_id=processing_job_id,
    )

    overlapping_pairs = find_overlapping_parcels(
        db=db,
        project_id=project_id,
        processing_job_id=processing_job_id,
    )

    duplicate_ids = {
        parcel_id
        for pair in duplicate_pairs
        for parcel_id in pair
    }

    overlap_map: dict[int, float] = {}

    for parcel_a, parcel_b in overlapping_pairs:
        overlap_area_m2 = calculate_overlap_area(
            db=db,
            parcel_a=parcel_a,
            parcel_b=parcel_b,
        )

        overlap_map[parcel_a] = (
            overlap_map.get(
                parcel_a,
                0.0,
            )
            + overlap_area_m2
        )

        overlap_map[parcel_b] = (
            overlap_map.get(
                parcel_b,
                0.0,
            )
            + overlap_area_m2
        )

    results: list[ParcelValidationItem] = []

    for parcel in parcels:
        geometry = to_shape(
            parcel.geometry
        )

        geometry_errors = validate_polygon(
            geometry
        )

        is_duplicate = (
            parcel.id in duplicate_ids
        )

        overlap_area_m2 = overlap_map.get(
            parcel.id,
            0.0,
        )

        measurement_errors: list[str] = []

        is_invalid = bool(
            geometry_errors
            or measurement_errors
            or is_duplicate
        )

        results.append(
            ParcelValidationItem(
                parcel_id=parcel.id,
                parcel_code=parcel.parcel_code,
                validity_status=(
                    "INVALID"
                    if is_invalid
                    else "VALID"
                ),
                review_status=(
                    "PENDING"
                    if (
                        overlap_area_m2 > 1.0
                        or is_duplicate
                        or geometry_errors
                        or measurement_errors
                    )
                    else "PENDING"
                ),
                geometry_errors=geometry_errors,
                measurement_errors=measurement_errors,
                is_duplicate=is_duplicate,
                overlap_area_m2=overlap_area_m2,
            )
        )

    return results

def persist_parcel_validation(
    db: Session,
    results: list[ParcelValidationItem],
) -> None:
    """
    Persist parcel validation states into PostgreSQL.
    """

    if not results:
        return

    parcel_ids = [
        result.parcel_id
        for result in results
    ]

    statement = select(Parcel).where(
        Parcel.id.in_(parcel_ids)
    )

    parcels = list(
        db.scalars(statement).all()
    )

    parcels_by_id = {
        parcel.id: parcel
        for parcel in parcels
    }

    for result in results:
        parcel = parcels_by_id.get(
            result.parcel_id
        )

        if parcel is None:
            continue

        parcel.validity_status = (
            result.validity_status
        )

        parcel.review_status = (
            result.review_status
        )

    db.commit()

def validate_and_persist_parcels(
    db: Session,
    processing_job_id: int,
) -> list[ParcelValidationItem]:
    """
    Validate all parcels for a processing job and
    persist their machine-generated status.
    """

    results = validate_parcels_for_job(
        db=db,
        processing_job_id=processing_job_id,
    )

    persist_parcel_validation(
        db=db,
        results=results,
    )

    return results

def get_parcel_validation_detail(
    db: Session,
    parcel_id: int,
) -> ParcelValidationDetailResponse | None:
    """
    Return complete validation and review information
    for a single parcel.
    """

    statement = select(Parcel).where(
        Parcel.id == parcel_id
    )

    parcel = db.scalars(
        statement
    ).first()

    if parcel is None:
        return None

    geometry = to_shape(
        parcel.geometry
    )

    geometry_errors = validate_polygon(
        geometry
    )

    duplicate_pairs = find_duplicate_parcels(
        db=db,
        project_id=parcel.project_id,
        processing_job_id=parcel.processing_job_id,
    )

    is_duplicate = any(
        parcel.id in pair
        for pair in duplicate_pairs
    )

    overlap_area_m2 = 0.0

    overlapping_pairs = find_overlapping_parcels(
        db=db,
        project_id=parcel.project_id,
        processing_job_id=parcel.processing_job_id,
    )

    for parcel_a, parcel_b in overlapping_pairs:
        if parcel.id not in {
            parcel_a,
            parcel_b,
        }:
            continue

        other_id = (
            parcel_b
            if parcel_a == parcel.id
            else parcel_a
        )

        overlap_area_m2 += calculate_overlap_area(
            db=db,
            parcel_a=parcel.id,
            parcel_b=other_id,
        )

    review_required = (
        is_duplicate
        or overlap_area_m2 > 1.0
        or bool(geometry_errors)
    )

    return ParcelValidationDetailResponse(
        parcel_id=parcel.id,
        parcel_code=parcel.parcel_code,
        project_id=parcel.project_id,
        processing_job_id=parcel.processing_job_id,
        validity_status=parcel.validity_status,
        review_status=parcel.review_status,
        review_comment=parcel.review_comment,
        geometry=postgis_to_geojson(
            parcel.geometry
        ),
        geometry_errors=geometry_errors,
        measurement_errors=[],
        is_duplicate=is_duplicate,
        overlap_area_m2=overlap_area_m2,
        review_required=review_required,
    )