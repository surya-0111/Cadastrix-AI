from pathlib import Path

from app.integrations.gis_client import (
    GISClient,
    GISResult,
)
from app.integrations.ml_client import (
    MLClient,
    MLResult,
)


class PipelineService:
    """
    Coordinates the ML and GIS processing stages.
    """

    def __init__(
        self,
        ml_client: MLClient | None = None,
        gis_client: GISClient | None = None,
    ) -> None:
        self.ml_client = ml_client or MLClient()
        self.gis_client = gis_client or GISClient()

    def run_ml(
        self,
        imagery_path: str | Path,
    ) -> MLResult:
        """Run the ML feature extraction stage."""

        return self.ml_client.extract_features(
            imagery_path,
        )

    def run_gis(
        self,
        ml_result: MLResult,
    ) -> GISResult:
        """Run the GIS parcel reconstruction stage."""

        return self.gis_client.build_parcels(
            building_path=ml_result.building_output_path,
            road_path=ml_result.road_output_path,
        )