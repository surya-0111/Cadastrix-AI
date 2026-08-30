from pathlib import Path
from typing import Any

import rasterio


def validate_image_path(image_path: str) -> bool:
    """Check whether the input image exists."""
    return Path(image_path).is_file()


def load_geotiff(image_path: str) -> dict[str, Any]:
    """
    Load a GeoTIFF and return its raster data and geospatial metadata.

    Args:
        image_path: Path to the GeoTIFF file.

    Returns:
        Dictionary containing raster data and metadata.

    Raises:
        FileNotFoundError: If the input file does not exist.
        ValueError: If the raster has no CRS.
    """
    image_file = Path(image_path)

    if not image_file.is_file():
        raise FileNotFoundError(f"Image not found: {image_path}")

    with rasterio.open(image_file) as src:
        if src.crs is None:
            raise ValueError("GeoTIFF does not contain a CRS.")

        data = src.read()

        return {
            "data": data,
            "crs": src.crs,
            "transform": src.transform,
            "width": src.width,
            "height": src.height,
            "count": src.count,
            "dtype": src.dtypes[0],
            "bounds": src.bounds,
        }