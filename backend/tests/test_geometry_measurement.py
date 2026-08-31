from shapely.geometry import Polygon

from app.utils.geometry_measurement import (
    calculate_projected_measurements,
)


def test_calculate_projected_measurements() -> None:
    geometry = Polygon(
        [
            (77.5940, 12.9710),
            (77.5950, 12.9710),
            (77.5950, 12.9720),
            (77.5940, 12.9710),
        ]
    )

    area_m2, perimeter_m = (
        calculate_projected_measurements(
            geometry=geometry,
            source_crs="EPSG:4326",
            measurement_crs="EPSG:32643",
        )
    )

    assert area_m2 > 0
    assert perimeter_m > 0