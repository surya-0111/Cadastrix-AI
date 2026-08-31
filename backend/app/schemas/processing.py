from datetime import datetime

from pydantic import BaseModel, ConfigDict


class ProcessingJobResponse(BaseModel):
    """Processing job information returned by the API."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    project_id: int
    imagery_id: int
    status: str
    current_step: str | None
    progress: int
    error_message: str | None
    started_at: datetime | None
    completed_at: datetime | None
    created_at: datetime
    updated_at: datetime