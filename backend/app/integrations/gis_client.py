from dataclasses import dataclass
from pathlib import Path


@dataclass
class GISResult:
    """Result returned by the GIS processing pipeline."""

    parcel_output_path: str
    feature_output_path: str
    parcel_count: int
    source_crs: str


class GISClient:
    """
    Interface between the backend and GIS processing pipeline.

    This is currently a mock implementation.
    """

    def __init__(
        self,
        output_dir: str | Path = "./storage/mock/gis",
    ) -> None:
        self.output_dir = Path(output_dir)

        self.output_dir.mkdir(
            parents=True,
            exist_ok=True,
        )

    def build_parcels(
        self,
        building_path: str | Path,
        road_path: str | Path,
    ) -> GISResult:
        """
        Generate preliminary cadastral parcels.
        """

        building_file = Path(building_path)
        road_file = Path(road_path)

        if not building_file.exists():
            raise FileNotFoundError(
                f"Building output not found: {building_file}"
            )

        if not road_file.exists():
            raise FileNotFoundError(
                f"Road output not found: {road_file}"
            )

        parcel_output = (
            self.output_dir / "parcels.geojson"
        )

        feature_output = (
            self.output_dir / "features.geojson"
        )

        parcel_output.write_text(
            """
            {
            "type": "FeatureCollection",
            "features": [
                {
                "type": "Feature",
                "properties": {
                "parcel_code": "P-MOCK-001",
                "confidence": 0.92,
                "area_m2": 10000.0,
                "perimeter_m": 400.0
            },
            "geometry": {
                "type": "Polygon",
                "coordinates": [
                [
                [77.5940, 12.9710],
                [77.6040, 12.9710],
                [77.6040, 12.9810],
                [77.5940, 12.9710]
              ]
            ]
          }
        }
      ]
    }
    """,
            encoding="utf-8",
        )

        feature_output.write_text(
            '{"type":"FeatureCollection","features":[]}',
            encoding="utf-8",
        )

        return GISResult(
            parcel_output_path=str(
                parcel_output
            ),
            feature_output_path=str(
                feature_output
            ),
            parcel_count=1,
            source_crs="EPSG:4326",
        )