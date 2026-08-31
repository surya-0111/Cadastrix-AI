from dataclasses import dataclass
from pathlib import Path
from tempfile import TemporaryDirectory


@dataclass
class MLResult:
    """Result returned by the ML/CV pipeline."""

    building_output_path: str
    road_output_path: str
    building_count: int
    road_count: int


class MLClient:
    """
    Interface between the backend and the ML/CV pipeline.

    This is currently a mock implementation.
    """

    def __init__(self, output_dir: str | Path = "./storage/mock/ml") -> None:
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(
            parents=True,
            exist_ok=True,
        )

    def extract_features(
        self,
        imagery_path: str | Path,
    ) -> MLResult:
        """
        Run the ML/CV feature extraction pipeline.
        """

        path = Path(imagery_path)

        if not path.exists():
            raise FileNotFoundError(
                f"Imagery file not found: {path}"
            )

        building_output = self.output_dir / "buildings.geojson"
        road_output = self.output_dir / "roads.geojson"

        building_output.write_text(
            '{"type":"FeatureCollection","features":[]}',
            encoding="utf-8",
        )

        road_output.write_text(
            '{"type":"FeatureCollection","features":[]}',
            encoding="utf-8",
        )

        return MLResult(
            building_output_path=str(building_output),
            road_output_path=str(road_output),
            building_count=0,
            road_count=0,
        )