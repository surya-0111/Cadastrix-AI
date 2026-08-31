import pytest

from app.schemas.spatial import BoundingBox


def test_valid_bounding_box() -> None:
    bbox = BoundingBox(
        min_lon=77.59,
        min_lat=12.97,
        max_lon=77.60,
        max_lat=12.98,
    )

    assert bbox.min_lon == 77.59
    assert bbox.max_lat == 12.98


def test_invalid_longitude_order() -> None:
    with pytest.raises(ValueError):
        BoundingBox(
            min_lon=77.60,
            min_lat=12.97,
            max_lon=77.59,
            max_lat=12.98,
        )


def test_invalid_latitude_order() -> None:
    with pytest.raises(ValueError):
        BoundingBox(
            min_lon=77.59,
            min_lat=12.98,
            max_lon=77.60,
            max_lat=12.97,
        )