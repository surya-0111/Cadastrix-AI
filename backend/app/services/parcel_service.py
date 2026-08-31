from pathlib import Path
from typing import Any

from geoalchemy2 import WKTElement
from sqlalchemy.orm import Session

from app.models.parcel import Parcel
from app.utils.crs_utils import transform_geometry
from app.utils.geojson_utils import (
    geojson_feature_to_geometry,
    load_geojson,
    validate_geometry,
    validate_geometry_type,
)


DEFAULT_STORAGE_CRS = "EPSG:4326"


def ingest_parcels(
    db: Session,
    geojson_path: str | Path,
    project_id: int,
    processing_job_id: int,
    source_crs: str,
) -> list[Parcel]:
    """
    Read GIS-generated parcel GeoJSON, validate the geometries,
    transform them into the storage CRS, and persist them in PostGIS.
    """

    data = load_geojson(geojson_path)

    created_parcels: list[Parcel] = []

    try:
        for index, feature_data in enumerate(
            data["features"],
            start=1,
        ):
            geometry = geojson_feature_to_geometry(
                feature_data
            )

            validate_geometry(geometry)

            validate_geometry_type(
                geometry,
                {"Polygon"},
            )

            if source_crs != DEFAULT_STORAGE_CRS:
                geometry = transform_geometry(
                    geometry,
                    source_crs=source_crs,
                    target_crs=DEFAULT_STORAGE_CRS,
                )

            properties: dict[str, Any] = (
                feature_data.get("properties") or {}
            )

            parcel_code = properties.get(
                "parcel_code",
                f"P-{processing_job_id}-{index:04d}",
            )

            confidence = properties.get(
                "confidence",
            )

            area_m2 = properties.get(
                "area_m2",
            )

            perimeter_m = properties.get(
                "perimeter_m",
            )

            parcel = Parcel(
                project_id=project_id,
                processing_job_id=processing_job_id,
                parcel_code=str(parcel_code),
                area_m2=(
                    float(area_m2)
                    if area_m2 is not None
                    else None
                ),
                perimeter_m=(
                    float(perimeter_m)
                    if perimeter_m is not None
                    else None
                ),
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

            db.add(parcel)
            created_parcels.append(parcel)

        db.commit()

        for parcel in created_parcels:
            db.refresh(parcel)

        return created_parcels

    except Exception:
        db.rollback()
        raise

from sqlalchemy import select


def get_project_parcels(
    db: Session,
    project_id: int,
) -> list[Parcel]:
    """Return all parcels belonging to a project."""

    statement = (
        select(Parcel)
        .where(Parcel.project_id == project_id)
        .order_by(Parcel.id.asc())
    )

    return list(
        db.scalars(statement).all()
    )


def get_parcel(
    db: Session,
    parcel_id: int,
) -> Parcel | None:
    """Return a parcel by ID."""

    statement = select(Parcel).where(
        Parcel.id == parcel_id
    )

    return db.scalars(statement).first()