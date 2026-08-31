from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.dependencies.database import get_database
from app.schemas.parcel import ParcelResponse
from app.services.parcel_service import (
    get_parcel,
    get_project_parcels,
)
from app.services.project_service import get_project
from app.utils.postgis_utils import postgis_to_geojson


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