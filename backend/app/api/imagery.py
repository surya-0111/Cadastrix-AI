from fastapi import (
    APIRouter,
    Depends,
    File,
    HTTPException,
    UploadFile,
    status,
)
from sqlalchemy.orm import Session

from app.dependencies.database import get_database
from app.schemas.imagery import ImageryResponse
from app.services.imagery_service import (
    delete_imagery,
    get_imagery,
    get_project_imagery,
    upload_imagery,
)
from app.services.project_service import get_project


router = APIRouter(
    tags=["Imagery"],
)


@router.post(
    "/projects/{project_id}/imagery",
    response_model=ImageryResponse,
    status_code=status.HTTP_201_CREATED,
)
async def upload_imagery_endpoint(
    project_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_database),
) -> ImageryResponse:
    """Upload and register a GeoTIFF drone image."""

    project = get_project(db, project_id)

    if project is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Project {project_id} not found",
        )

    try:
        return await upload_imagery(
            db=db,
            project_id=project_id,
            upload_file=file,
        )
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc


@router.get(
    "/projects/{project_id}/imagery",
    response_model=list[ImageryResponse],
)
def list_project_imagery_endpoint(
    project_id: int,
    db: Session = Depends(get_database),
) -> list[ImageryResponse]:
    """Return all imagery belonging to a project."""

    project = get_project(db, project_id)

    if project is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Project {project_id} not found",
        )

    return get_project_imagery(db, project_id)


@router.get(
    "/imagery/{imagery_id}",
    response_model=ImageryResponse,
)
def get_imagery_endpoint(
    imagery_id: int,
    db: Session = Depends(get_database),
) -> ImageryResponse:
    """Return imagery metadata by ID."""

    imagery = get_imagery(db, imagery_id)

    if imagery is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Imagery {imagery_id} not found",
        )

    return imagery


@router.delete(
    "/imagery/{imagery_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_imagery_endpoint(
    imagery_id: int,
    db: Session = Depends(get_database),
) -> None:
    """Delete an imagery record and its stored file."""

    imagery = get_imagery(db, imagery_id)

    if imagery is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Imagery {imagery_id} not found",
        )

    delete_imagery(db, imagery)