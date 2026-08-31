from typing import Any

from app.schemas.geojson import (
    GeoJSONFeature,
    GeoJSONFeatureCollection,
)
from app.utils.postgis_utils import postgis_to_geojson


def build_parcel_feature(
    parcel: Any,
) -> GeoJSONFeature:
    """
    Convert a parcel ORM object into a GeoJSON Feature.
    """

    return GeoJSONFeature(
        type="Feature",
        id=parcel.id,
        properties={
            "parcel_code": parcel.parcel_code,
            "project_id": parcel.project_id,
            "processing_job_id": parcel.processing_job_id,
            "area_m2": parcel.area_m2,
            "perimeter_m": parcel.perimeter_m,
            "confidence": parcel.confidence,
            "validity_status": parcel.validity_status,
            "review_status": parcel.review_status,
            "review_comment": parcel.review_comment,
        },
        geometry=postgis_to_geojson(
            parcel.geometry
        ),
    )


def build_feature_feature(
    feature: Any,
) -> GeoJSONFeature:
    """
    Convert a stored feature ORM object into a GeoJSON Feature.
    """

    return GeoJSONFeature(
        type="Feature",
        id=feature.id,
        properties={
            "feature_type": feature.feature_type,
            "project_id": feature.project_id,
            "processing_job_id": feature.processing_job_id,
            "confidence": feature.confidence,
        },
        geometry=postgis_to_geojson(
            feature.geometry
        ),
    )


def build_feature_collection(
    features: list[GeoJSONFeature],
) -> GeoJSONFeatureCollection:
    """
    Build a GeoJSON FeatureCollection.
    """

    return GeoJSONFeatureCollection(
        type="FeatureCollection",
        features=features,
    )