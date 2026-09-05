from pathlib import Path
from typing import Any

import rasterio


def extract_raster_metadata(file_path: str | Path) -> dict[str, Any]:
    """
    Extract essential geospatial metadata from a raster file.

    Args:
        file_path: Path to the raster/GeoTIFF file.

    Returns:
        Dictionary containing raster dimensions, bands, CRS and bounds.

    Raises:
        ValueError: If the raster cannot be read.
    """
    path = Path(file_path)

    if not path.exists():
        raise ValueError(f"Raster file does not exist: {path}")

    try:
        with rasterio.open(path) as dataset:
            bounds = dataset.bounds

            crs = None

            if dataset.crs:
                epsg_code = dataset.crs.to_epsg()

                if epsg_code is not None:
                    crs = f"EPSG:{epsg_code}"
                else:
                    crs = dataset.crs.to_wkt()

            return {
                "width": dataset.width,
                "height": dataset.height,
                "band_count": dataset.count,
                "crs": crs,
                "min_x": bounds.left,
                "min_y": bounds.bottom,
                "max_x": bounds.right,
                "max_y": bounds.top,
            }

    except rasterio.errors.RasterioError as exc:
        raise ValueError(
            f"Unable to read raster file: {path}"
        ) from exc

def validate_raster_metadata(metadata: dict[str, Any]) -> None:
    """
    Validate the basic metadata required by the cadastral pipeline.
    """

    if metadata["width"] <= 0:
        raise ValueError("Raster width must be greater than zero")

    if metadata["height"] <= 0:
        raise ValueError("Raster height must be greater than zero")

    if metadata["band_count"] <= 0:
        raise ValueError("Raster must contain at least one band")

    if metadata["crs"] is None:
        raise ValueError("Raster does not contain a CRS")