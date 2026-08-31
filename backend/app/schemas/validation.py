from pydantic import BaseModel


class GeometryValidationResult(BaseModel):
    """Result of geometry validation."""

    valid: bool
    errors: list[str]


class MeasurementValidationResult(BaseModel):
    """Result of area/perimeter validation."""

    valid: bool
    area_m2: float
    perimeter_m: float
    errors: list[str]