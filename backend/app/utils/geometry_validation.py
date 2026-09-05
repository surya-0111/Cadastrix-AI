from shapely.geometry.base import BaseGeometry


def validate_geometry_basic(
    geometry: BaseGeometry,
) -> list[str]:
    """
    Perform basic geometry quality checks.

    Returns:
        A list of validation error messages.
        An empty list means the geometry passed.
    """

    errors: list[str] = []

    if geometry.is_empty:
        errors.append("Geometry is empty.")
        return errors

    if not geometry.is_valid:
        reason = getattr(
            geometry,
            "is_valid_reason",
            None,
        )

        if callable(reason):
            errors.append(
                f"Geometry is invalid: {reason()}"
            )
        else:
            errors.append(
                "Geometry is invalid."
            )

    if not geometry.is_simple:
        errors.append(
            "Geometry is not simple."
        )

    return errors

from shapely.geometry import Polygon


def validate_polygon(
    geometry: BaseGeometry,
) -> list[str]:
    """
    Validate a polygon for cadastral use.
    """

    errors = validate_geometry_basic(
        geometry
    )

    if geometry.is_empty:
        return errors

    if not isinstance(geometry, Polygon):
        errors.append(
            f"Expected Polygon, got {geometry.geom_type}."
        )

        return errors

    if geometry.area <= 0:
        errors.append(
            "Polygon area must be greater than zero."
        )

    if not geometry.exterior.is_ring:
        errors.append(
            "Polygon exterior ring is not closed."
        )

    return errors

def validate_measurements(
    area_m2: float,
    perimeter_m: float,
    min_area_m2: float = 1.0,
    max_area_m2: float = 1_000_000.0,
) -> list[str]:
    """
    Validate basic parcel measurement sanity.
    """

    errors: list[str] = []

    if area_m2 <= 0:
        errors.append(
            "Area must be greater than zero."
        )

    if perimeter_m <= 0:
        errors.append(
            "Perimeter must be greater than zero."
        )

    if area_m2 < min_area_m2:
        errors.append(
            f"Area is below the minimum "
            f"threshold of {min_area_m2} m²."
        )

    if area_m2 > max_area_m2:
        errors.append(
            f"Area exceeds the maximum "
            f"threshold of {max_area_m2} m²."
        )

    return errors