from pydantic import BaseModel, Field
from pydantic import model_validator

class BoundingBox(BaseModel):
    """Geographic bounding box in EPSG:4326."""

    min_lon: float = Field(..., ge=-180, le=180)
    min_lat: float = Field(..., ge=-90, le=90)
    max_lon: float = Field(..., ge=-180, le=180)
    max_lat: float = Field(..., ge=-90, le=90)

    @model_validator(mode="after")
    def validate_bounds(self) -> "BoundingBox":
        if self.min_lon >= self.max_lon:
            raise ValueError(
                "min_lon must be less than max_lon."
            )

        if self.min_lat >= self.max_lat:
            raise ValueError(
                "min_lat must be less than max_lat."
            )

        return self