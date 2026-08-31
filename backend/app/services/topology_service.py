from sqlalchemy import text
from sqlalchemy.orm import Session


OVERLAP_TOLERANCE_M2 = 1.0
MEASUREMENT_SRID = 32643


def find_duplicate_parcels(
    db: Session,
    project_id: int,
    processing_job_id: int,
) -> list[tuple[int, int]]:
    """
    Find pairs of parcels from the same processing job
    that have equal geometry.
    """

    query = text(
        """
        SELECT
            p1.id AS parcel_a,
            p2.id AS parcel_b
        FROM parcels p1
        JOIN parcels p2
            ON p1.id < p2.id
        WHERE
            p1.project_id = :project_id
            AND p2.project_id = :project_id
            AND p1.processing_job_id = :processing_job_id
            AND p2.processing_job_id = :processing_job_id
            AND ST_Equals(
                p1.geometry,
                p2.geometry
            )
        ORDER BY
            p1.id,
            p2.id
        """
    )

    result = db.execute(
        query,
        {
            "project_id": project_id,
            "processing_job_id": processing_job_id,
        },
    )

    return [
        (row.parcel_a, row.parcel_b)
        for row in result
    ]


def find_overlapping_parcels(
    db: Session,
    project_id: int,
    processing_job_id: int,
) -> list[tuple[int, int]]:
    """
    Find pairs of parcels from the same processing job
    that spatially overlap.
    """

    query = text(
        """
        SELECT
            p1.id AS parcel_a,
            p2.id AS parcel_b
        FROM parcels p1
        JOIN parcels p2
            ON p1.id < p2.id
        WHERE
            p1.project_id = :project_id
            AND p2.project_id = :project_id
            AND p1.processing_job_id = :processing_job_id
            AND p2.processing_job_id = :processing_job_id
            AND ST_Overlaps(
                p1.geometry,
                p2.geometry
            )
        ORDER BY
            p1.id,
            p2.id
        """
    )

    result = db.execute(
        query,
        {
            "project_id": project_id,
            "processing_job_id": processing_job_id,
        },
    )

    return [
        (row.parcel_a, row.parcel_b)
        for row in result
    ]


def calculate_overlap_area(
    db: Session,
    parcel_a: int,
    parcel_b: int,
    measurement_srid: int = MEASUREMENT_SRID,
) -> float:
    """
    Calculate overlap area in square metres.
    """

    query = text(
        """
        SELECT
            ST_Area(
                ST_Transform(
                    ST_Intersection(
                        p1.geometry,
                        p2.geometry
                    ),
                    :measurement_srid
                )
            )
        FROM parcels p1
        JOIN parcels p2
            ON p1.id = :parcel_a
            AND p2.id = :parcel_b
        """
    )

    result = db.execute(
        query,
        {
            "parcel_a": parcel_a,
            "parcel_b": parcel_b,
            "measurement_srid": measurement_srid,
        },
    )

    return float(result.scalar_one())


def find_significant_overlaps(
    db: Session,
    project_id: int,
    processing_job_id: int,
    tolerance_m2: float = OVERLAP_TOLERANCE_M2,
    measurement_srid: int = MEASUREMENT_SRID,
) -> list[tuple[int, int, float]]:
    """
    Find parcel pairs from the same processing job whose
    overlap area exceeds the configured tolerance.

    Returns:
        List of (parcel_a_id, parcel_b_id, overlap_area_m2).
    """

    query = text(
        """
        SELECT
            p1.id AS parcel_a,
            p2.id AS parcel_b,
            ST_Area(
                ST_Transform(
                    ST_Intersection(
                        p1.geometry,
                        p2.geometry
                    ),
                    :measurement_srid
                )
            ) AS overlap_area_m2
        FROM parcels p1
        JOIN parcels p2
            ON p1.id < p2.id
        WHERE
            p1.project_id = :project_id
            AND p2.project_id = :project_id
            AND p1.processing_job_id = :processing_job_id
            AND p2.processing_job_id = :processing_job_id
            AND ST_Overlaps(
                p1.geometry,
                p2.geometry
            )
            AND ST_Area(
                ST_Transform(
                    ST_Intersection(
                        p1.geometry,
                        p2.geometry
                    ),
                    :measurement_srid
                )
            ) > :tolerance_m2
        ORDER BY
            overlap_area_m2 DESC,
            p1.id,
            p2.id
        """
    )

    result = db.execute(
        query,
        {
            "project_id": project_id,
            "processing_job_id": processing_job_id,
            "measurement_srid": measurement_srid,
            "tolerance_m2": tolerance_m2,
        },
    )

    return [
        (
            row.parcel_a,
            row.parcel_b,
            float(row.overlap_area_m2),
        )
        for row in result
    ]

def find_parcel_gaps(
    db: Session,
    project_id: int,
    processing_job_id: int,
    boundary_wkt: str,
    boundary_srid: int = 4326,
    measurement_srid: int = MEASUREMENT_SRID,
    tolerance_m2: float = 1.0,
) -> list[float]:
    """
    Find uncovered areas inside a supplied survey boundary.

    The parcel geometries are unioned first. The uncovered
    portion of the boundary is then calculated using ST_Difference.

    Returns:
        List of gap areas in square metres.
    """

    query = text(
        """
        WITH parcel_union AS (
            SELECT
                ST_UnaryUnion(
                    ST_Collect(
                        p.geometry
                    )
                ) AS geometry
            FROM parcels p
            WHERE
                p.project_id = :project_id
                AND p.processing_job_id = :processing_job_id
        ),
        boundary AS (
            SELECT
                ST_GeomFromText(
                    :boundary_wkt,
                    :boundary_srid
                ) AS geometry
        ),
        gaps AS (
            SELECT
                ST_CollectionExtract(
                    ST_Difference(
                        boundary.geometry,
                        COALESCE(
                            parcel_union.geometry,
                            ST_GeomFromText(
                                'GEOMETRYCOLLECTION EMPTY',
                                :boundary_srid
                            )
                        )
                    ),
                    3
                ) AS geometry
            FROM boundary
            CROSS JOIN parcel_union
        )
        SELECT
            ST_Area(
                ST_Transform(
                    (dumped.geom),
                    :measurement_srid
                )
            ) AS gap_area_m2
        FROM gaps
        CROSS JOIN LATERAL ST_Dump(
            gaps.geometry
        ) AS dumped
        WHERE
            NOT ST_IsEmpty(dumped.geom)
            AND ST_Area(
                ST_Transform(
                    dumped.geom,
                    :measurement_srid
                )
            ) > :tolerance_m2
        ORDER BY
            gap_area_m2 DESC
        """
    )

    result = db.execute(
        query,
        {
            "project_id": project_id,
            "processing_job_id": processing_job_id,
            "boundary_wkt": boundary_wkt,
            "boundary_srid": boundary_srid,
            "measurement_srid": measurement_srid,
            "tolerance_m2": tolerance_m2,
        },
    )

    return [
        float(row.gap_area_m2)
        for row in result
    ]