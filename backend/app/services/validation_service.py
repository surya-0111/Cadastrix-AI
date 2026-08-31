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