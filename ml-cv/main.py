import sys
from pathlib import Path

import numpy as np

sys.path.insert(0, str(Path(__file__).parent))

from cv.inference.boundary_detector import detect_boundaries
from cv.postprocessing.polygonize import mask_to_polygons
from cv.preprocessing.image_loader import load_geotiff


def process_geotiff(
    image_path: str,
    min_polygon_area: float = 1e-8,
    method: str = "baseline",
) -> list[dict]:
    """
    Process a GeoTIFF and extract geospatial polygons.

    Args:
        image_path: Input GeoTIFF.
        min_polygon_area: Minimum polygon area.
        method:
            "baseline" -> classical Canny detector.

    Returns:
        List of GeoJSON-compatible polygon geometries.
    """

    if method not in {"baseline"}:
        raise ValueError(
            f"Unsupported detection method: {method}"
        )

    raster = load_geotiff(image_path)

    data = raster["data"]

    if data.shape[0] < 3:
        raise ValueError(
            "Expected a GeoTIFF with at least 3 bands."
        )

    # Rasterio format:
    # (channels, height, width)
    #
    # OpenCV format:
    # (height, width, channels)
    rgb = np.transpose(data[:3], (1, 2, 0))

    if method == "baseline":
        mask = detect_boundaries(rgb)

    polygons = mask_to_polygons(
        mask,
        raster["transform"],
        min_area=min_polygon_area,
    )

    return polygons