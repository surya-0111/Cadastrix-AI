import json

import pytest
from shapely.geometry import Polygon

from app.utils.geojson_utils import (
    geojson_feature_to_geometry,
    load_geojson,
    validate_geometry,
    validate_geometry_type,
)


def test_load_geojson(tmp_path) -> None:
    path = tmp_path / "test.geojson"

    data = {
        "type": "FeatureCollection",
        "features": [],
    }

    path.write_text(
        json.dumps(data),
        encoding="utf-8",
    )

    result = load_geojson(path)

    assert result["type"] == "FeatureCollection"
    assert result["features"] == []


def test_geojson_feature_to_geometry() -> None:
    feature = {
        "type": "Feature",
        "geometry": {
            "type": "Polygon",
            "coordinates": [
                [
                    [0, 0],
                    [10, 0],
                    [10, 10],
                    [0, 0],
                ]
            ],
        },
        "properties": {},
    }

    geometry = geojson_feature_to_geometry(
        feature
    )

    assert geometry.geom_type == "Polygon"


def test_invalid_geometry() -> None:
    geometry = Polygon()

    with pytest.raises(ValueError):
        validate_geometry(geometry)


def test_geometry_type_validation() -> None:
    feature = {
        "type": "Feature",
        "geometry": {
            "type": "LineString",
            "coordinates": [
                [0, 0],
                [1, 1],
            ],
        },
    }

    geometry = geojson_feature_to_geometry(
        feature
    )

    with pytest.raises(ValueError):
        validate_geometry_type(
            geometry,
            {"Polygon"},
        )