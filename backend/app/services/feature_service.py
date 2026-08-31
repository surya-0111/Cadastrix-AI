from pathlib import Path
from typing import Any

from geoalchemy2 import WKTElement
from sqlalchemy.orm import Session

from app.models.feature import Feature
from app.utils.crs_utils import transform_geometry
from app.utils.geojson_utils import (
    geojson_feature_to_geometry,
    load_geojson,
    validate_geometry,
    validate_geometry_type,
)


DEFAULT_STORAGE_CRS = "EPSG:4326"


def ingest_features(
    db: Session,
    geojson_path: str | Path,
    project_id: int,
    processing_job_id: int,
    source_crs: str,
) -> list[Feature]:
    """
    Read AI-generated GeoJSON features, validate their geometry,
    transform them into the storage CRS, and persist them in PostGIS.
    """

    data = load_geojson(geojson_path)

    created_features: list[Feature] = []

    try:
        for feature_data in data["features"]:
            geometry = geojson_feature_to_geometry(
                feature_data
            )

            validate_geometry(geometry)

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

            # Convert from the source CRS to the application's
            # canonical storage CRS.
            if source_crs != DEFAULT_STORAGE_CRS:
                geometry = transform_geometry(
                    geometry,
                    source_crs=source_crs,
                    target_crs=DEFAULT_STORAGE_CRS,
                )

            properties: dict[str, Any] = (
                feature_data.get("properties") or {}
            )

            feature_type = properties.get(
                "feature_type",
                "UNKNOWN",
            )

            confidence = properties.get(
                "confidence",
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
                geometry=WKTElement(
                    geometry.wkt,
                    srid=4326,
                ),
            )

            db.add(feature)
            created_features.append(feature)

        db.commit()

        for feature in created_features:
            db.refresh(feature)

        return created_features

    except Exception:
        db.rollback()
        raise