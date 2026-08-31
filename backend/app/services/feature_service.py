from pathlib import Path
from typing import Any

from sqlalchemy.orm import Session
from app.utils.crs_utils import transform_geometry
from app.models.feature import Feature
from app.utils.geojson_utils import (
    geojson_feature_to_geometry,
    load_geojson,
    validate_geometry,
    validate_geometry_type,
)


def ingest_features(
    db: Session,
    geojson_path: str | Path,
    project_id: int,
    processing_job_id: int,
    source_crs: str,
) -> list[Feature]:
    """
    Read AI-generated GeoJSON features and prepare them
    for PostGIS insertion.
    """

    data = load_geojson(geojson_path)

    created_features: list[Feature] = []

    for feature_data in data["features"]:
        geometry = geojson_feature_to_geometry(
            feature_data
        )

        geometry = transform_geometry(
            geometry,
            source_crs=source_crs,
        )
        validate_geometry(
            geometry
        )

        validate_geometry_type(
            geometry,
            {
                "Point",
                "MultiPoint",
                "LineString",
                "MultiLineString",
                "Polygon",
                "MultiPolygon",
            },
        )

        properties: dict[str, Any] = (
            feature_data.get("properties") or {}
        )

        feature_type = properties.get(
            "feature_type",
            "UNKNOWN",
        )

        confidence = properties.get(
            "confidence"
        )

        feature = Feature(
            project_id=project_id,
            processing_job_id=processing_job_id,
            feature_type=str(feature_type),
            confidence=(
                float(confidence)
                if confidence is not None
                else None
            ),
            geometry=geometry.wkt,
        )

        db.add(feature)
        created_features.append(feature)

    db.commit()

    for feature in created_features:
        db.refresh(feature)

    return created_features