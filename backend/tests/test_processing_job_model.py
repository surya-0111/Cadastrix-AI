from app.models.processing_job import ProcessingJob


def test_processing_job_table_name() -> None:
    assert ProcessingJob.__tablename__ == "processing_jobs"


def test_processing_job_columns() -> None:
    columns = ProcessingJob.__table__.columns

    assert "id" in columns
    assert "project_id" in columns
    assert "imagery_id" in columns
    assert "status" in columns
    assert "current_step" in columns
    assert "progress" in columns
    assert "error_message" in columns
    assert "started_at" in columns
    assert "completed_at" in columns
    assert "created_at" in columns
    assert "updated_at" in columns