from sqlalchemy import text
from shapely.geometry import Polygon

from app.db.session import SessionLocal
from app.models.feature import Feature


def test_insert_feature_geometry() -> None:
    db = SessionLocal()

    try:
        geometry = Polygon(
            [
                (77.5940, 12.9710),
                (77.5950, 12.9710),
                (77.5950, 12.9720),
                (77.5940, 12.9710),
            ]
        )

        feature = Feature(
            project_id=5,
            processing_job_id=2,
            feature_type="BUILDING",
            confidence=0.95,
            geometry=geometry.wkt,
        )

        db.add(feature)
        db.commit()
        db.refresh(feature)

        result = db.execute(
            text(
                """
                SELECT
                    ST_SRID(geometry),
                    ST_GeometryType(geometry)
                FROM features
                WHERE id = :feature_id
                """
            ),
            {"feature_id": feature.id},
        ).one()

        assert result[0] == 4326
        assert result[1] == "ST_Polygon"

    finally:
        if "feature" in locals() and feature.id is not None:
            db.delete(feature)
            db.commit()

        db.close()