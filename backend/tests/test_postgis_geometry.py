from sqlalchemy import text

from app.db.session import engine


def test_postgis_accepts_geometry() -> None:
    wkt = "POINT(77.5946 12.9716)"

    with engine.begin() as connection:
        result = connection.execute(
            text(
                """
                SELECT
                    ST_SRID(
                        ST_GeomFromText(:wkt, 4326)
                    )
                """
            ),
            {"wkt": wkt},
        )

        srid = result.scalar_one()

    assert srid == 4326