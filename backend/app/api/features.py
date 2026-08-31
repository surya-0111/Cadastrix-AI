from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.dependencies.database import get_database
from app.schemas.feature import FeatureResponse
from app.services.feature_service import (
    get_feature,
    get_project_features,
)
from app.services.project_service import get_project
from app.utils.postgis_utils import postgis_to_geojson


router = APIRouter(
    tags=["Features"],
)


@router.get(
    "/projects/{project_id}/features",
    response_model=list[FeatureResponse],
)
def list_project_features(
    project_id: int,
    db: Session = Depends(get_database),
) -> list[FeatureResponse]:
    """Return all AI-generated features for a project."""

    project = get_project(db, project_id)

    if project is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Project {project_id} not found",
        )

    features = get_project_features(
        db,
        project_id,
    )

    return [
        FeatureResponse(
            id=feature.id,
            project_id=feature.project_id,
            processing_job_id=feature.processing_job_id,
            feature_type=feature.feature_type,
            confidence=feature.confidence,
            geometry=postgis_to_geojson(
                feature.geometry
            ),
            created_at=feature.created_at,
        )
        for feature in features
    ]


@router.get(
    "/features/{feature_id}",
    response_model=FeatureResponse,
)
def get_feature_endpoint(
    feature_id: int,
    db: Session = Depends(get_database),
) -> FeatureResponse:
    """Return a single feature."""

    feature = get_feature(
        db,
        feature_id,
    )

    if feature is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Feature {feature_id} not found",
        )

    return FeatureResponse(
        id=feature.id,
        project_id=feature.project_id,
        processing_job_id=feature.processing_job_id,
        feature_type=feature.feature_type,
        confidence=feature.confidence,
        geometry=postgis_to_geojson(
            feature.geometry
        ),
        created_at=feature.created_at,
    )