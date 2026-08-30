from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.project import Project
from app.schemas.project import ProjectCreate, ProjectUpdate


def create_project(
    db: Session,
    project_data: ProjectCreate,
) -> Project:
    """Create and persist a new project."""

    project = Project(
        name=project_data.name,
        description=project_data.description,
    )

    db.add(project)
    db.commit()
    db.refresh(project)

    return project


def get_project(
    db: Session,
    project_id: int,
) -> Project | None:
    """Retrieve a project by ID."""

    statement = select(Project).where(Project.id == project_id)

    return db.scalars(statement).first()


def get_projects(
    db: Session,
) -> list[Project]:
    """Retrieve all projects."""

    statement = select(Project).order_by(Project.id.desc())

    return list(db.scalars(statement).all())


def update_project(
    db: Session,
    project: Project,
    project_data: ProjectUpdate,
) -> Project:
    """Update an existing project."""

    update_data = project_data.model_dump(
        exclude_unset=True,
    )

    for field, value in update_data.items():
        setattr(project, field, value)

    db.commit()
    db.refresh(project)

    return project


def delete_project(
    db: Session,
    project: Project,
) -> None:
    """Delete a project."""

    db.delete(project)
    db.commit()