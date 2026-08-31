import logging

from sqlalchemy.orm import Session
from app.services.feature_service import ingest_features
from app.services.parcel_service import ingest_parcels
from app.core.processing import ProcessingStatus
from app.db.session import SessionLocal
from app.services.pipeline_service import PipelineService
from app.services.processing_service import (
    get_processing_job,
    update_processing_status,
)


logger = logging.getLogger(__name__)


def run_processing_job(job_id: int) -> None:
    """
    Execute a processing job in the background.

    The actual ML and GIS implementations are currently
    represented through PipelineService integration points.
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

        # --------------------------------------------------
        # 1. PREPROCESSING
        # --------------------------------------------------

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

        # Create the pipeline after the job has been validated.
        pipeline = PipelineService()

        # --------------------------------------------------
        # 2. AI PROCESSING
        # --------------------------------------------------

        logger.info(
            "Job %s: AI processing",
            job_id,
        )

        job = update_processing_status(
            db=db,
            job=job,
            status=ProcessingStatus.AI_PROCESSING,
            progress=35,
            current_step="Running feature extraction",
        )

        ml_result = pipeline.run_ml(
            job.imagery.file_path,
        )

        logger.info(
            "Job %s: extracted %s buildings and %s roads",
            job_id,
            ml_result.building_count,
            ml_result.road_count,
        )

        # --------------------------------------------------
        # Store AI-generated features
        # --------------------------------------------------

        logger.info(
            "Job %s: storing AI-generated features",
            job_id,
        )

        features = ingest_features(
            db=db,
            geojson_path=ml_result.building_output_path,
            project_id=job.project_id,
            processing_job_id=job.id,
            source_crs=ml_result.source_crs,
        )

        logger.info(
            "Job %s: stored %s features",
            job_id,
            len(features),
        )

        # --------------------------------------------------
        # 3. GIS PROCESSING
        # --------------------------------------------------

        logger.info(
            "Job %s: GIS processing",
            job_id,
        )

        job = update_processing_status(
            db=db,
            job=job,
            status=ProcessingStatus.GIS_PROCESSING,
            progress=65,
            current_step="Generating geospatial features",
        )

        gis_result = pipeline.run_gis(
            ml_result,
        )

        logger.info(
            "Job %s: generated %s parcels",
            job_id,
            gis_result.parcel_count,
        )

        # --------------------------------------------------
        # Store generated parcels
        # --------------------------------------------------

        logger.info(
            "Job %s: storing generated parcels",
            job_id,
        )

        parcels = ingest_parcels(
            db=db,
            geojson_path=gis_result.parcel_output_path,
            project_id=job.project_id,
            processing_job_id=job.id,
            source_crs=gis_result.source_crs,
        )

        logger.info(
            "Job %s: stored %s parcels",
            job_id,
            len(parcels),
        )

        # --------------------------------------------------
        # 4. VALIDATION
        # --------------------------------------------------

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

        # Topology validation will be added later.

        # --------------------------------------------------
        # 5. COMPLETED
        # --------------------------------------------------

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

    except Exception as exc:
        logger.exception(
            "Processing job %s failed",
            job_id,
        )

        try:
            job = get_processing_job(
                db,
                job_id,
            )

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