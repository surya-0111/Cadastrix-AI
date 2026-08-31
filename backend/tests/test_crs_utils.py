from shapely.geometry import Point

from app.utils.crs_utils import transform_geometry


def test_transform_geometry() -> None:
    point = Point(
        500000,
        1500000,
    )

    transformed = transform_geometry(
        point,
        source_crs="EPSG:32644",
        target_crs="EPSG:4326",
    )

    assert transformed.geom_type == "Point"
    assert transformed.x != point.x
    assert transformed.y != point.y