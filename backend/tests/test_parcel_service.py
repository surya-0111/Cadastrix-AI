from pathlib import Path

from sqlalchemy import text

from app.db.session import SessionLocal
from app.services.parcel_service import ingest_parcels


def test_ingest_parcels() -> None:
    db = SessionLocal()

    geojson_path = (
        Path(__file__).parent
        / "test_data"
        / "parcel_sample.geojson"
    )

    try:
        parcels = ingest_parcels(
            db=db,
            geojson_path=geojson_path,
            project_id=5,
            processing_job_id=2,
            source_crs="EPSG:4326",
        )

        assert len(parcels) == 1

        parcel = parcels[0]

        assert parcel.id is not None
        assert parcel.parcel_code == "P-TEST-001"
        assert parcel.area_m2 == 1250.5
        assert parcel.confidence == 0.92

        result = db.execute(
            text(
                """
                SELECT
                    ST_SRID(geometry),
                    ST_GeometryType(geometry)
                FROM parcels
                WHERE id = :parcel_id
                """
            ),
            {"parcel_id": parcel.id},
        ).one()

        assert result[0] == 4326
        assert result[1] == "ST_Polygon"

    finally:
        db.execute(
            text(
                """
                DELETE FROM parcels
                WHERE processing_job_id = :job_id
                """
            ),
            {"job_id": 2},
        )

        db.commit()
        db.close()