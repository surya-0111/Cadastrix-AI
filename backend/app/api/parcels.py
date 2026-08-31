from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi import Query
from app.schemas.spatial import BoundingBox
from app.services.parcel_service import (
    get_project_parcels_in_bbox,
)
from app.dependencies.database import get_database
from app.schemas.parcel import ParcelResponse
from app.services.parcel_service import (
    get_parcel,
    get_project_parcels,
)
from app.services.project_service import get_project
from app.utils.postgis_utils import postgis_to_geojson
from app.schemas.geojson import GeoJSONFeatureCollection
from app.utils.geojson_builders import (
    build_feature_collection,
    build_parcel_feature,
)


router = APIRouter(
    tags=["Parcels"],
)


@router.get(
    "/projects/{project_id}/parcels",
    response_model=list[ParcelResponse],
)
def list_project_parcels(
    project_id: int,
    db: Session = Depends(get_database),
) -> list[ParcelResponse]:
    """Return all generated parcels for a project."""

    project = get_project(db, project_id)

    if project is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Project {project_id} not found",
        )

    parcels = get_project_parcels(
        db,
        project_id,
    )

    return [
        ParcelResponse(
            id=parcel.id,
            project_id=parcel.project_id,
            processing_job_id=parcel.processing_job_id,
            parcel_code=parcel.parcel_code,
            area_m2=parcel.area_m2,
            perimeter_m=parcel.perimeter_m,
            confidence=parcel.confidence,
            validity_status=parcel.validity_status,
            review_status=parcel.review_status,
            geometry=postgis_to_geojson(
                parcel.geometry
            ),
            created_at=parcel.created_at,
            updated_at=parcel.updated_at,
        )
        for parcel in parcels
    ]


@router.get(
    "/parcels/{parcel_id}",
    response_model=ParcelResponse,
)
def get_parcel_endpoint(
    parcel_id: int,
    db: Session = Depends(get_database),
) -> ParcelResponse:
    """Return a single parcel."""

    parcel = get_parcel(
        db,
        parcel_id,
    )

    if parcel is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Parcel {parcel_id} not found",
        )

    return ParcelResponse(
        id=parcel.id,
        project_id=parcel.project_id,
        processing_job_id=parcel.processing_job_id,
        parcel_code=parcel.parcel_code,
        area_m2=parcel.area_m2,
        perimeter_m=parcel.perimeter_m,
        confidence=parcel.confidence,
        validity_status=parcel.validity_status,
        review_status=parcel.review_status,
        geometry=postgis_to_geojson(
            parcel.geometry
        ),
        created_at=parcel.created_at,
        updated_at=parcel.updated_at,
    )

@router.get(
    "/projects/{project_id}/parcels/bbox",
    response_model=list[ParcelResponse],
)
def list_project_parcels_in_bbox(
    project_id: int,
    min_lon: float = Query(...),
    min_lat: float = Query(...),
    max_lon: float = Query(...),
    max_lat: float = Query(...),
    db: Session = Depends(get_database),
) -> list[ParcelResponse]:
    """Return parcels intersecting a geographic bounding box."""

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

    parcels = get_project_parcels_in_bbox(
        db=db,
        project_id=project_id,
        min_lon=bbox.min_lon,
        min_lat=bbox.min_lat,
        max_lon=bbox.max_lon,
        max_lat=bbox.max_lat,
    )

    return [
        ParcelResponse(
            id=parcel.id,
            project_id=parcel.project_id,
            processing_job_id=parcel.processing_job_id,
            parcel_code=parcel.parcel_code,
            area_m2=parcel.area_m2,
            perimeter_m=parcel.perimeter_m,
            confidence=parcel.confidence,
            validity_status=parcel.validity_status,
            review_status=parcel.review_status,
            geometry=postgis_to_geojson(
                parcel.geometry
            ),
            created_at=parcel.created_at,
            updated_at=parcel.updated_at,
        )
        for parcel in parcels
    ]

@router.get(
    "/projects/{project_id}/parcels/map",
    response_model=GeoJSONFeatureCollection,
)
def list_project_parcels_map(
    project_id: int,
    min_lon: float = Query(...),
    min_lat: float = Query(...),
    max_lon: float = Query(...),
    max_lat: float = Query(...),
    db: Session = Depends(get_database),
) -> GeoJSONFeatureCollection:
    """
    Return project parcels as a GeoJSON FeatureCollection.
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

    parcels = get_project_parcels_in_bbox(
        db=db,
        project_id=project_id,
        min_lon=bbox.min_lon,
        min_lat=bbox.min_lat,
        max_lon=bbox.max_lon,
        max_lat=bbox.max_lat,
    )

    features = [
        build_parcel_feature(parcel)
        for parcel in parcels
    ]

    return build_feature_collection(
        features
    )