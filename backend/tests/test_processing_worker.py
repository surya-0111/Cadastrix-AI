from unittest.mock import MagicMock, patch

from app.core.processing import ProcessingStatus
from app.models.processing_job import ProcessingJob
from app.workers.processing_worker import run_processing_job


def test_worker_processes_job_successfully() -> None:
    # Mock the job instead of creating a real SQLAlchemy object.
    job = MagicMock(spec=ProcessingJob)

    job.id = 1
    job.project_id = 1
    job.imagery_id = 1
    job.status = ProcessingStatus.QUEUED.value
    job.progress = 0

    # Mock the related imagery object.
    job.imagery = MagicMock()
    job.imagery.file_path = "test/data/sample.tif"

    mock_db = MagicMock()

    # Mock ML result.
    mock_ml_result = MagicMock()
    mock_ml_result.building_output_path = "test/data/buildings.geojson"
    mock_ml_result.road_output_path = "test/data/roads.geojson"
    mock_ml_result.building_count = 10
    mock_ml_result.road_count = 2

    # Mock GIS result.
    mock_gis_result = MagicMock()
    mock_gis_result.parcel_output_path = "test/data/parcels.geojson"
    mock_gis_result.feature_output_path = "test/data/features.geojson"
    mock_gis_result.parcel_count = 8

    # Mock pipeline.
    mock_pipeline = MagicMock()
    mock_pipeline.run_ml.return_value = mock_ml_result
    mock_pipeline.run_gis.return_value = mock_gis_result

    with patch(
        "app.workers.processing_worker.SessionLocal",
        return_value=mock_db,
    ), patch(
        "app.workers.processing_worker.get_processing_job",
        return_value=job,
    ), patch(
        "app.workers.processing_worker.update_processing_status",
        side_effect=[
            job,  # PREPROCESSING
            job,  # AI_PROCESSING
            job,  # GIS_PROCESSING
            job,  # VALIDATING
            job,  # COMPLETED
        ],
    ) as mock_update, patch(
        "app.workers.processing_worker.PipelineService",
        return_value=mock_pipeline,
    ):

        run_processing_job(1)

    # Worker should perform five status transitions.
    assert mock_update.call_count == 5

    calls = mock_update.call_args_list

    assert (
        calls[0].kwargs["status"]
        == ProcessingStatus.PREPROCESSING
    )

    assert (
        calls[1].kwargs["status"]
        == ProcessingStatus.AI_PROCESSING
    )

    assert (
        calls[2].kwargs["status"]
        == ProcessingStatus.GIS_PROCESSING
    )

    assert (
        calls[3].kwargs["status"]
        == ProcessingStatus.VALIDATING
    )

    assert (
        calls[4].kwargs["status"]
        == ProcessingStatus.COMPLETED
    )

    # Verify ML was called with the imagery path.
    mock_pipeline.run_ml.assert_called_once_with(
        "test/data/sample.tif"
    )

    # Verify GIS received the ML result.
    mock_pipeline.run_gis.assert_called_once_with(
        mock_ml_result
    )