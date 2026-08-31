from datetime import datetime

from pydantic import BaseModel, ConfigDict


class ImageryResponse(BaseModel):
    """Imagery metadata returned by the API."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    project_id: int
    original_filename: str
    stored_filename: str
    file_size: int
    file_type: str
    width: int | None
    height: int | None
    band_count: int | None
    crs: str | None
    min_x: float | None
    min_y: float | None
    max_x: float | None
    max_y: float | None
    status: str
    created_at: datetime
    updated_at: datetime