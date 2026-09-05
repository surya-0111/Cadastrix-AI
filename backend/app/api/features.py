from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi import Query
from app.schemas.geojson import GeoJSONFeatureCollection
from app.utils.geojson_builders import (
    build_feature_collection,
    build_feature_feature,
)
from app.schemas.spatial import BoundingBox
from app.services.feature_service import (
    get_project_features_in_bbox,
)
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

@router.get(
    "/projects/{project_id}/features/bbox",
    response_model=list[FeatureResponse],
)
def list_project_features_in_bbox(
    project_id: int,
    min_lon: float = Query(...),
    min_lat: float = Query(...),
    max_lon: float = Query(...),
    max_lat: float = Query(...),
    db: Session = Depends(get_database),
) -> list[FeatureResponse]:
    """Return features intersecting a geographic bounding box."""

    bbox = BoundingBox(
        min_lon=min_lon,
        min_lat=min_lat,
        max_lon=max_lon,
        max_lat=max_lat,
    )

    project = get_project(
        db,
        project_id,
    )

    if project is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Project {project_id} not found",
        )

    features = get_project_features_in_bbox(
        db=db,
        project_id=project_id,
        min_lon=bbox.min_lon,
        min_lat=bbox.min_lat,
        max_lon=bbox.max_lon,
        max_lat=bbox.max_lat,
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
    "/projects/{project_id}/features/map",
    response_model=GeoJSONFeatureCollection,
)
def list_project_features_map(
    project_id: int,
    min_lon: float = Query(...),
    min_lat: float = Query(...),
    max_lon: float = Query(...),
    max_lat: float = Query(...),
    limit: int = Query(
        1000,
        ge=1,
        le=5000,
    ),
    db: Session = Depends(get_database),
) -> GeoJSONFeatureCollection:
    """
    Return project features as a GeoJSON FeatureCollection.
    """

    bbox = BoundingBox(
        min_lon=min_lon,
        min_lat=min_lat,
        max_lon=max_lon,
        max_lat=max_lat,
    )

    project = get_project(
        db,
        project_id,
    )

    if project is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Project {project_id} not found",
        )

    features = get_project_features_in_bbox(
        db=db,
        project_id=project_id,
        min_lon=bbox.min_lon,
        min_lat=bbox.min_lat,
        max_lon=bbox.max_lon,
        max_lat=bbox.max_lat,
    )

    geojson_features = [
        build_feature_feature(feature)
        for feature in features
    ]

    return build_feature_collection(
        geojson_features
    )