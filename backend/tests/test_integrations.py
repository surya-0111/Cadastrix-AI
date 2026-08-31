from pathlib import Path

from app.integrations.gis_client import GISClient
from app.integrations.ml_client import MLClient
from app.services.pipeline_service import PipelineService


def test_ml_client_creates_outputs(tmp_path) -> None:
    imagery = tmp_path / "sample.tif"
    imagery.write_bytes(b"test")

    client = MLClient(
        output_dir=tmp_path / "ml",
    )

    result = client.extract_features(
        imagery,
    )

    assert Path(result.building_output_path).exists()
    assert Path(result.road_output_path).exists()


def test_gis_client_creates_outputs(tmp_path) -> None:
    buildings = tmp_path / "buildings.geojson"
    roads = tmp_path / "roads.geojson"

    buildings.write_text(
        '{"type":"FeatureCollection","features":[]}',
        encoding="utf-8",
    )

    roads.write_text(
        '{"type":"FeatureCollection","features":[]}',
        encoding="utf-8",
    )

    client = GISClient(
        output_dir=tmp_path / "gis",
    )

    result = client.build_parcels(
        buildings,
        roads,
    )

    assert Path(result.parcel_output_path).exists()
    assert Path(result.feature_output_path).exists()


def test_pipeline_runs_ml_then_gis(tmp_path) -> None:
    imagery = tmp_path / "sample.tif"
    imagery.write_bytes(b"test")

    pipeline = PipelineService(
        ml_client=MLClient(
            output_dir=tmp_path / "ml",
        ),
        gis_client=GISClient(
            output_dir=tmp_path / "gis",
        ),
    )

    ml_result = pipeline.run_ml(
        imagery,
    )

    gis_result = pipeline.run_gis(
        ml_result,
    )

    assert Path(ml_result.building_output_path).exists()
    assert Path(gis_result.parcel_output_path).exists()