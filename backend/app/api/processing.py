from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi import BackgroundTasks
from app.dependencies.database import get_database
from app.schemas.processing import ProcessingJobResponse
from app.services.imagery_service import get_imagery
from app.services.processing_service import (
    create_processing_job,
    get_processing_job,
    get_project_processing_jobs,
)
from app.services.project_service import get_project
from app.workers.processing_worker import run_processing_job


router = APIRouter(
    tags=["Processing"],
)


@router.post(
    "/projects/{project_id}/imagery/{imagery_id}/process",
    response_model=ProcessingJobResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_processing_job_endpoint(
    project_id: int,
    imagery_id: int,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_database),
) -> ProcessingJobResponse:
    """
    Create a queued processing job for an imagery file.
    """

    project = get_project(db, project_id)

    if project is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Project {project_id} not found",
        )

    imagery = get_imagery(db, imagery_id)

    if imagery is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Imagery {imagery_id} not found",
        )

    if imagery.project_id != project_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                f"Imagery {imagery_id} does not belong "
                f"to project {project_id}"
            ),
        )

    job = create_processing_job(
        db=db,
        project_id=project_id,
        imagery=imagery,
    )

    background_tasks.add_task(
        run_processing_job,
        job.id,
    )

    return job


@router.get(
    "/processing/{job_id}",
    response_model=ProcessingJobResponse,
)
def get_processing_job_endpoint(
    job_id: int,
    db: Session = Depends(get_database),
) -> ProcessingJobResponse:
    """Return a processing job by ID."""

    job = get_processing_job(db, job_id)

    if job is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Processing job {job_id} not found",
        )

    return job


@router.get(
    "/projects/{project_id}/processing",
    response_model=list[ProcessingJobResponse],
)
def list_project_processing_jobs_endpoint(
    project_id: int,
    db: Session = Depends(get_database),
) -> list[ProcessingJobResponse]:
    """Return all processing jobs for a project."""

    project = get_project(db, project_id)

    if project is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Project {project_id} not found",
        )

    return get_project_processing_jobs(
        db,
        project_id,
    )