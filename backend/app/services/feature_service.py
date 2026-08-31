from pathlib import Path
from typing import Any

from geoalchemy2 import WKTElement
from sqlalchemy.orm import Session
from sqlalchemy import text
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

from sqlalchemy import select


def get_project_features(
    db: Session,
    project_id: int,
) -> list[Feature]:
    """Return all features belonging to a project."""

    statement = (
        select(Feature)
        .where(Feature.project_id == project_id)
        .order_by(Feature.id.asc())
    )

    return list(
        db.scalars(statement).all()
    )


def get_feature(
    db: Session,
    feature_id: int,
) -> Feature | None:
    """Return a feature by ID."""

    statement = select(Feature).where(
        Feature.id == feature_id
    )

    return db.scalars(statement).first()

def get_project_features_in_bbox(
    db: Session,
    project_id: int,
    min_lon: float,
    min_lat: float,
    max_lon: float,
    max_lat: float,
    limit: int = 1000,
) -> list[Feature]:
    """
    Return features from a project that intersect
    the supplied EPSG:4326 bounding box.
    """

    query = text(
        """
        SELECT *
        FROM features
        WHERE
            project_id = :project_id
            AND ST_Intersects(
                geometry,
                ST_MakeEnvelope(
                    :min_lon,
                    :min_lat,
                    :max_lon,
                    :max_lat,
                    4326
                )
            )
        ORDER BY id
        LIMIT :limit
        """
    )

    result = db.execute(
        query,
        {
            "project_id": project_id,
            "min_lon": min_lon,
            "min_lat": min_lat,
            "max_lon": max_lon,
            "max_lat": max_lat,
            "limit": limit,
        },
    )

    feature_ids = [
        row.id
        for row in result
    ]

    if not feature_ids:
        return []

    from sqlalchemy import select

    statement = select(Feature).where(
        Feature.id.in_(feature_ids)
    ).order_by(Feature.id)

    return list(
        db.scalars(statement).all()
    )