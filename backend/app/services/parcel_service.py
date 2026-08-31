from pathlib import Path

from sqlalchemy.orm import Session

from app.models.parcel import Parcel
from app.utils.geojson_utils import (
    geojson_feature_to_geometry,
    load_geojson,
    validate_geometry,
    validate_geometry_type,
)


def ingest_parcels(
    db: Session,
    geojson_path: str | Path,
    project_id: int,
    processing_job_id: int,
    source_crs: str,
) -> list[Parcel]:
    """
    Read GIS-generated parcel GeoJSON and prepare it
    for PostGIS insertion.
    """

    data = load_geojson(geojson_path)

    created_parcels: list[Parcel] = []

    for index, feature_data in enumerate(
        data["features"],
        start=1,
    ):
        geometry = geojson_feature_to_geometry(
            feature_data
        )

        validate_geometry(
            geometry
        )

        validate_geometry_type(
            geometry,
            {"Polygon"},
        )

        properties = (
            feature_data.get("properties") or {}
        )

        parcel_code = properties.get(
            "parcel_code",
            f"P-{processing_job_id}-{index:04d}",
        )

        confidence = properties.get(
            "confidence"
        )

        area_m2 = properties.get(
            "area_m2"
        )

        perimeter_m = properties.get(
            "perimeter_m"
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
            geometry=geometry.wkt,
        )

        db.add(parcel)
        created_parcels.append(parcel)

    db.commit()

    for parcel in created_parcels:
        db.refresh(parcel)

    return created_parcels