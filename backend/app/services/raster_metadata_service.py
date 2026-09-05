from pathlib import Path
from typing import Any

from app.utils.raster_utils import (
    extract_raster_metadata,
    validate_raster_metadata,
)


def get_raster_metadata(
    file_path: str | Path,
) -> dict[str, Any]:
    """
    Extract and validate raster metadata for the application.
    """

    metadata = extract_raster_metadata(file_path)

    validate_raster_metadata(metadata)

    return metadata