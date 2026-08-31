from datetime import datetime, timezone

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.imagery import Imagery
from app.models.processing_job import ProcessingJob


def create_processing_job(
    db: Session,
    project_id: int,
    imagery: Imagery,
) -> ProcessingJob:
    """
    Create a new queued processing job for an imagery file.
    """

    job = ProcessingJob(
        project_id=project_id,
        imagery_id=imagery.id,
        status="QUEUED",
        current_step=None,
        progress=0,
    )

    db.add(job)
    db.commit()
    db.refresh(job)

    return job


def get_processing_job(
    db: Session,
    job_id: int,
) -> ProcessingJob | None:
    """Retrieve a processing job by ID."""

    statement = select(ProcessingJob).where(
        ProcessingJob.id == job_id
    )

    return db.scalars(statement).first()


def get_project_processing_jobs(
    db: Session,
    project_id: int,
) -> list[ProcessingJob]:
    """Return all processing jobs belonging to a project."""

    statement = (
        select(ProcessingJob)
        .where(ProcessingJob.project_id == project_id)
        .order_by(ProcessingJob.id.desc())
    )

    return list(db.scalars(statement).all())


def update_processing_status(
    db: Session,
    job: ProcessingJob,
    status: str,
    progress: int,
    current_step: str | None = None,
    error_message: str | None = None,
) -> ProcessingJob:
    """
    Update processing state.

    This will be used later by the background worker.
    """

    job.status = status
    job.progress = progress
    job.current_step = current_step
    job.error_message = error_message

    if status == "PREPROCESSING" and job.started_at is None:
        job.started_at = datetime.now(timezone.utc)

    if status in {"COMPLETED", "FAILED", "CANCELLED"}:
        job.completed_at = datetime.now(timezone.utc)

    db.commit()
    db.refresh(job)

    return job