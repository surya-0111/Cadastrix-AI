from shapely.geometry import Polygon
from shapely.geometry import LineString
from app.services.validation_service import (
    validate_parcel_geometry,
)

from app.services.validation_service import (
    validate_parcel_measurements,
)


def test_parcel_measurement_validation() -> None:
    geometry = Polygon(
        [
            (77.5940, 12.9710),
            (77.5950, 12.9710),
            (77.5950, 12.9720),
            (77.5940, 12.9710),
        ]
    )

    result = validate_parcel_measurements(
        geometry=geometry,
        source_crs="EPSG:4326",
        measurement_crs="EPSG:32643",
    )

    assert result.valid is True
    assert result.area_m2 > 0
    assert result.perimeter_m > 0
    assert result.errors == []


def test_valid_parcel_geometry() -> None:
    geometry = Polygon(
        [
            (77.5940, 12.9710),
            (77.5950, 12.9710),
            (77.5950, 12.9720),
            (77.5940, 12.9710),
        ]
    )

    result = validate_parcel_geometry(
        geometry
    )

    assert result.valid is True
    assert result.errors == []

def test_invalid_self_intersecting_polygon() -> None:
    geometry = Polygon(
        [
            (0, 0),
            (2, 2),
            (0, 2),
            (2, 0),
            (0, 0),
        ]
    )

    result = validate_parcel_geometry(
        geometry
    )

    assert result.valid is False
    assert len(result.errors) > 0

def test_zero_area_polygon() -> None:
    geometry = Polygon(
        [
            (0, 0),
            (1, 0),
            (2, 0),
            (0, 0),
        ]
    )

    result = validate_parcel_geometry(
        geometry
    )

    assert result.valid is False
    assert any(
        "area" in error.lower()
        for error in result.errors
    )

def test_non_polygon_geometry() -> None:
    geometry = LineString(
        [
            (77.5940, 12.9710),
            (77.5950, 12.9720),
        ]
    )

    result = validate_parcel_geometry(
        geometry
    )

    assert result.valid is False
    assert any(
        "expected polygon" in error.lower()
        for error in result.errors
    )