from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class ProjectCreate(BaseModel):
    """Request body for creating a project."""

    name: str = Field(
        ...,
        min_length=1,
        max_length=150,
        description="Name of the cadastral mapping project",
    )

    description: str | None = Field(
        default=None,
        description="Optional project description",
    )


class ProjectUpdate(BaseModel):
    """Request body for updating a project."""

    name: str | None = Field(
        default=None,
        min_length=1,
        max_length=150,
    )

    description: str | None = None

    status: str | None = Field(
        default=None,
        min_length=1,
        max_length=30,
    )


class ProjectResponse(BaseModel):
    """Project representation returned by the API."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    description: str | None
    status: str
    created_at: datetime
    updated_at: datetime