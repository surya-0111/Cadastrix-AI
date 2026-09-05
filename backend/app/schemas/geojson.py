from typing import Any
from pydantic import BaseModel, Field


class GeoJSONFeature(BaseModel):
    """A single GeoJSON feature."""

    type: str = "Feature"
    id: int
    properties: dict[str, Any]
    geometry: dict[str, Any]


class GeoJSONFeatureCollection(BaseModel):
    """A GeoJSON FeatureCollection."""

    type: str = "FeatureCollection"
    features: list[GeoJSONFeature]
    properties: dict[str, Any] = Field(
        default_factory=dict
    )