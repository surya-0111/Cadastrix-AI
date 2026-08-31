from pydantic import BaseModel


class GeometryValidationResult(BaseModel):
    """Result of basic geometry validation."""

    valid: bool
    errors: list[str]


class MeasurementValidationResult(BaseModel):
    """Result of area/perimeter validation."""

    valid: bool
    area_m2: float
    perimeter_m: float
    errors: list[str]


class DuplicateParcelPair(BaseModel):
    """Two parcels with identical geometry."""

    parcel_a: int
    parcel_b: int


class OverlapViolation(BaseModel):
    """Two parcels with significant spatial overlap."""

    parcel_a: int
    parcel_b: int
    overlap_area_m2: float


class ParcelValidationReport(BaseModel):
    """Complete validation result for a processing job."""

    status: str

    valid: bool
    review_required: bool

    geometry_errors: list[str]
    measurement_errors: list[str]

    duplicate_pairs: list[DuplicateParcelPair]
    overlap_violations: list[OverlapViolation]

    gap_areas_m2: list[float]

    total_errors: int

class ParcelValidationItem(BaseModel):
    """Validation result for one parcel."""

    parcel_id: int
    parcel_code: str

    validity_status: str
    review_status: str

    geometry_errors: list[str]
    measurement_errors: list[str]

    is_duplicate: bool
    overlap_area_m2: float

class ParcelReviewRequest(BaseModel):
    """Human review decision for a parcel."""

    review_status: str
    review_comment: str | None = None

class ParcelReviewResponse(BaseModel):
    """Response after a human review decision."""

    parcel_id: int
    parcel_code: str
    validity_status: str
    review_status: str
    review_comment: str | None