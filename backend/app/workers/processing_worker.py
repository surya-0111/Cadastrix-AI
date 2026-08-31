import logging

from sqlalchemy.orm import Session

from app.core.processing import ProcessingStatus
from app.db.session import SessionLocal
from app.services.processing_service import (
    get_processing_job,
    update_processing_status,
)


logger = logging.getLogger(__name__)


def run_processing_job(job_id: int) -> None:
    """
    Execute a processing job in the background.

    This is the MVP worker implementation.
    Actual AI and GIS operations will be plugged in later.
    """

    logger.info("Starting processing job %s", job_id)

    db: Session = SessionLocal()

    try:
        job = get_processing_job(db, job_id)

        if job is None:
            logger.error(
                "Processing job %s was not found",
                job_id,
            )
            return

        logger.info(
            "Job %s: preprocessing",
            job_id,
        )

        job = update_processing_status(
            db=db,
            job=job,
            status=ProcessingStatus.PREPROCESSING,
            progress=15,
            current_step="Preparing imagery",
        )

        logger.info(
            "Job %s: AI processing",
            job_id,
        )

        job = update_processing_status(
            db=db,
            job=job,
            status=ProcessingStatus.AI_PROCESSING,
            progress=50,
            current_step="Running feature extraction",
        )

        logger.info(
            "Job %s: GIS processing",
            job_id,
        )

        job = update_processing_status(
            db=db,
            job=job,
            status=ProcessingStatus.GIS_PROCESSING,
            progress=75,
            current_step="Generating geospatial features",
        )

        logger.info(
            "Job %s: validation",
            job_id,
        )

        job = update_processing_status(
            db=db,
            job=job,
            status=ProcessingStatus.VALIDATING,
            progress=90,
            current_step="Validating generated geometry",
        )

        logger.info(
            "Job %s: completing",
            job_id,
        )

        update_processing_status(
            db=db,
            job=job,
            status=ProcessingStatus.COMPLETED,
            progress=100,
            current_step="Processing completed",
        )

        logger.info(
            "Processing job %s completed successfully",
            job_id,
        )

    except Exception as exc:
        logger.exception(
            "Processing job %s failed",
            job_id,
        )

        try:
            job = get_processing_job(db, job_id)

            if job is not None:
                update_processing_status(
                    db=db,
                    job=job,
                    status=ProcessingStatus.FAILED,
                    progress=job.progress,
                    current_step="Processing failed",
                    error_message=str(exc),
                )

        except Exception:
            logger.exception(
                "Failed to mark processing job %s as FAILED",
                job_id,
            )

    finally:
        db.close()