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

def test_bbox_limit_must_be_positive() -> None:
    from fastapi import Query

    limit = Query(
        1000,
        ge=1,
        le=5000,
    )

    assert limit.default == 1000