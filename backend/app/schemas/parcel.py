from datetime import datetime
from typing import Any

from pydantic import BaseModel


class ParcelResponse(BaseModel):
    """Parcel metadata and GeoJSON geometry."""

    id: int
    project_id: int
    processing_job_id: int
    parcel_code: str
    area_m2: float | None
    perimeter_m: float | None
    confidence: float | None
    validity_status: str
    review_status: str
    geometry: dict[str, Any]
    created_at: datetime
    updated_at: datetime