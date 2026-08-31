from pathlib import Path

from sqlalchemy import text

from app.db.session import SessionLocal
from app.services.feature_service import ingest_features


def test_ingest_features() -> None:
    db = SessionLocal()

    geojson_path = (
        Path(__file__).parent
        / "test_data"
        / "building_sample.geojson"
    )

    try:
        features = ingest_features(
            db=db,
            geojson_path=geojson_path,
            project_id=5,
            processing_job_id=2,
            source_crs="EPSG:4326",
        )

        assert len(features) == 2

        for feature in features:
            assert feature.id is not None
            assert feature.feature_type == "BUILDING"

        result = db.execute(
            text(
                """
                SELECT
                    COUNT(*),
                    MIN(ST_SRID(geometry)),
                    MIN(ST_GeometryType(geometry))
                FROM features
                WHERE processing_job_id = :job_id
                """
            ),
            {"job_id": 2},
        ).one()

        assert result[0] == 2
        assert result[1] == 4326
        assert result[2] == "ST_Polygon"

    finally:
        db.execute(
            text(
                """
                DELETE FROM features
                WHERE processing_job_id = :job_id
                """
            ),
            {"job_id": 2},
        )

        db.commit()
        db.close()