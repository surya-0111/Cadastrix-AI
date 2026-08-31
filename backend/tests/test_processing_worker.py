from unittest.mock import MagicMock, patch

from app.core.processing import ProcessingStatus
from app.models.processing_job import ProcessingJob
from app.workers.processing_worker import run_processing_job


def test_worker_processes_job_successfully() -> None:
    job = ProcessingJob(
        id=1,
        project_id=1,
        imagery_id=1,
        status=ProcessingStatus.QUEUED.value,
        progress=0,
    )

    mock_db = MagicMock()

    with patch(
        "app.workers.processing_worker.SessionLocal",
        return_value=mock_db,
    ), patch(
        "app.workers.processing_worker.get_processing_job",
        return_value=job,
    ), patch(
        "app.workers.processing_worker.update_processing_status",
        side_effect=[
            job,
            job,
            job,
            job,
            job,
        ],
    ) as mock_update:

        run_processing_job(1)

    assert mock_update.call_count == 5

    calls = mock_update.call_args_list

    assert calls[0].kwargs["status"] == ProcessingStatus.PREPROCESSING
    assert calls[1].kwargs["status"] == ProcessingStatus.AI_PROCESSING
    assert calls[2].kwargs["status"] == ProcessingStatus.GIS_PROCESSING
    assert calls[3].kwargs["status"] == ProcessingStatus.VALIDATING
    assert calls[4].kwargs["status"] == ProcessingStatus.COMPLETED