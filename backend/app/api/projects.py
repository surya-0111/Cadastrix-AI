from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.dependencies.database import get_database
from app.schemas.project import (
    ProjectCreate,
    ProjectResponse,
    ProjectUpdate,
)
from app.services.project_service import (
    create_project,
    delete_project,
    get_project,
    get_projects,
    update_project,
)


router = APIRouter(
    prefix="/projects",
    tags=["Projects"],
)


@router.post(
    "",
    response_model=ProjectResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_project_endpoint(
    project_data: ProjectCreate,
    db: Session = Depends(get_database),
) -> ProjectResponse:
    """Create a new cadastral mapping project."""

    return create_project(db, project_data)


@router.get(
    "",
    response_model=list[ProjectResponse],
)
def list_projects_endpoint(
    db: Session = Depends(get_database),
) -> list[ProjectResponse]:
    """Return all projects."""

    return get_projects(db)


@router.get(
    "/{project_id}",
    response_model=ProjectResponse,
)
def get_project_endpoint(
    project_id: int,
    db: Session = Depends(get_database),
) -> ProjectResponse:
    """Return a project by ID."""

    project = get_project(db, project_id)

    if project is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Project {project_id} not found",
        )

    return project


@router.patch(
    "/{project_id}",
    response_model=ProjectResponse,
)
def update_project_endpoint(
    project_id: int,
    project_data: ProjectUpdate,
    db: Session = Depends(get_database),
) -> ProjectResponse:
    """Update an existing project."""

    project = get_project(db, project_id)

    if project is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Project {project_id} not found",
        )

    return update_project(db, project, project_data)


@router.delete(
    "/{project_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_project_endpoint(
    project_id: int,
    db: Session = Depends(get_database),
) -> None:
    """Delete a project."""

    project = get_project(db, project_id)

    if project is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Project {project_id} not found",
        )

    delete_project(db, project)