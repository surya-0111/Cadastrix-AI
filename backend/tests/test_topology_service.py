from sqlalchemy import text
from geoalchemy2 import WKTElement

from app.db.session import SessionLocal
from app.models.parcel import Parcel
from app.services.topology_service import (
    calculate_overlap_area,
    find_duplicate_parcels,
    find_overlapping_parcels,
    find_parcel_gaps,
    find_significant_overlaps,
)


def test_duplicate_and_overlap_detection() -> None:
    db = SessionLocal()

    created_ids: list[int] = []

    try:
        # Parcel A
        parcel_a = Parcel(
            project_id=5,
            processing_job_id=2,
            parcel_code="TEST-A",
            confidence=0.95,
            geometry=WKTElement(
                """
                POLYGON((
                    77.5940 12.9710,
                    77.5960 12.9710,
                    77.5960 12.9730,
                    77.5940 12.9730,
                    77.5940 12.9710
                ))
                """,
                srid=4326,
            ),
        )

        # Parcel B - exact duplicate of A
        parcel_b = Parcel(
            project_id=5,
            processing_job_id=2,
            parcel_code="TEST-B",
            confidence=0.95,
            geometry=WKTElement(
                """
                POLYGON((
                    77.5940 12.9710,
                    77.5960 12.9710,
                    77.5960 12.9730,
                    77.5940 12.9730,
                    77.5940 12.9710
                ))
                """,
                srid=4326,
            ),
        )

        # Parcel C - overlaps A/B
        parcel_c = Parcel(
            project_id=5,
            processing_job_id=2,
            parcel_code="TEST-C",
            confidence=0.90,
            geometry=WKTElement(
                """
                POLYGON((
                    77.5950 12.9720,
                    77.5970 12.9720,
                    77.5970 12.9740,
                    77.5950 12.9740,
                    77.5950 12.9720
                ))
                """,
                srid=4326,
            ),
        )

        db.add_all(
            [
                parcel_a,
                parcel_b,
                parcel_c,
            ]
        )

        db.commit()

        db.refresh(parcel_a)
        db.refresh(parcel_b)
        db.refresh(parcel_c)

        created_ids = [
            parcel_a.id,
            parcel_b.id,
            parcel_c.id,
        ]

        # --------------------------------------------------
        # Duplicate detection
        # --------------------------------------------------

        duplicates = find_duplicate_parcels(
            db,
            project_id=5,
            processing_job_id=2,
        )

        assert (
            parcel_a.id,
            parcel_b.id,
        ) in duplicates

        # --------------------------------------------------
        # Overlap detection
        # --------------------------------------------------

        overlaps = find_overlapping_parcels(
            db,
            project_id=5,
            processing_job_id=2,
        )

        assert (
            parcel_a.id,
            parcel_c.id,
        ) in overlaps

        # --------------------------------------------------
        # Overlap area
        # --------------------------------------------------

        overlap_area = calculate_overlap_area(
            db,
            parcel_a=parcel_a.id,
            parcel_b=parcel_c.id,
        )

        assert overlap_area > 0

        # --------------------------------------------------
        # Significant overlap
        # --------------------------------------------------

        significant_overlaps = (
            find_significant_overlaps(
                db,
                project_id=5,
                processing_job_id=2,
                tolerance_m2=0.01,
            )
        )

        assert any(
            pair[0] == parcel_a.id
            and pair[1] == parcel_c.id
            for pair in significant_overlaps
        )

    finally:
        for parcel_id in created_ids:
            db.execute(
                text(
                    """
                    DELETE FROM parcels
                    WHERE id = :parcel_id
                    """
                ),
                {"parcel_id": parcel_id},
            )

        db.commit()
        db.close()

def test_find_parcel_gaps() -> None:
    db = SessionLocal()

    created_ids: list[int] = []

    try:
        parcel_a = Parcel(
            project_id=5,
            processing_job_id=2,
            parcel_code="GAP-A",
            confidence=0.95,
            geometry=WKTElement(
                """
                POLYGON((
                    77.5940 12.9710,
                    77.5960 12.9710,
                    77.5960 12.9730,
                    77.5940 12.9730,
                    77.5940 12.9710
                ))
                """,
                srid=4326,
            ),
        )

        parcel_b = Parcel(
            project_id=5,
            processing_job_id=2,
            parcel_code="GAP-B",
            confidence=0.95,
            geometry=WKTElement(
                """
                POLYGON((
                    77.5970 12.9710,
                    77.5990 12.9710,
                    77.5990 12.9730,
                    77.5970 12.9730,
                    77.5970 12.9710
                ))
                """,
                srid=4326,
            ),
        )

        db.add_all(
            [
                parcel_a,
                parcel_b,
            ]
        )

        db.commit()

        db.refresh(parcel_a)
        db.refresh(parcel_b)

        created_ids = [
            parcel_a.id,
            parcel_b.id,
        ]

        boundary_wkt = """
        POLYGON((
            77.5930 12.9700,
            77.6000 12.9700,
            77.6000 12.9740,
            77.5930 12.9740,
            77.5930 12.9700
        ))
        """

        gaps = find_parcel_gaps(
            db=db,
            project_id=5,
            processing_job_id=2,
            boundary_wkt=boundary_wkt,
            boundary_srid=4326,
            tolerance_m2=0.01,
        )

        assert len(gaps) > 0

        assert all(
            gap > 0
            for gap in gaps
        )

    finally:
        for parcel_id in created_ids:
            db.execute(
                text(
                    """
                    DELETE FROM parcels
                    WHERE id = :parcel_id
                    """
                ),
                {"parcel_id": parcel_id},
            )

        db.commit()
        db.close()