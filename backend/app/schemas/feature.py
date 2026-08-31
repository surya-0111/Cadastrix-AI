from datetime import datetime
from typing import Any

from pydantic import BaseModel


class FeatureResponse(BaseModel):
    """Feature metadata and GeoJSON geometry."""

    id: int
    project_id: int
    processing_job_id: int
    feature_type: str
    confidence: float | None
    geometry: dict[str, Any]
    created_at: datetime