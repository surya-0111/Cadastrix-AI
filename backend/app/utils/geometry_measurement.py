from pyproj import CRS, Transformer
from shapely.geometry.base import BaseGeometry
from shapely.ops import transform


def calculate_projected_measurements(
    geometry: BaseGeometry,
    source_crs: str,
    measurement_crs: str,
) -> tuple[float, float]:
    """
    Calculate area and perimeter in a projected CRS.

    Returns:
        (area_m2, perimeter_m)
    """

    source = CRS.from_user_input(
        source_crs
    )

    target = CRS.from_user_input(
        measurement_crs
    )

    transformer = Transformer.from_crs(
        source,
        target,
        always_xy=True,
    )

    projected_geometry = transform(
        transformer.transform,
        geometry,
    )

    area_m2 = projected_geometry.area
    perimeter_m = projected_geometry.length

    return area_m2, perimeter_m