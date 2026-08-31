from app.schemas.geojson import GeoJSONFeature
from app.utils.geojson_builders import (
    build_feature_collection,
)


def test_build_feature_collection() -> None:
    feature = GeoJSONFeature(
        id=1,
        properties={
            "parcel_code": "P-001",
        },
        geometry={
            "type": "Polygon",
            "coordinates": [
                [
                    [77.5940, 12.9710],
                    [77.5950, 12.9710],
                    [77.5950, 12.9730],
                    [77.5940, 12.9730],
                    [77.5940, 12.9710],
                ]
            ],
        },
    )

    collection = build_feature_collection(
        [feature]
    )

    assert collection.type == "FeatureCollection"
    assert len(collection.features) == 1
    assert collection.features[0].id == 1
    assert collection.features[0].type == "Feature"
    assert (
        collection.features[0].properties["parcel_code"]
        == "P-001"
    )