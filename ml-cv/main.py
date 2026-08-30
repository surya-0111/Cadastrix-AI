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
) -> list[dict]:
    """
    Run the ML-CV boundary extraction pipeline.

    GeoTIFF
        -> Raster loading
        -> RGB conversion
        -> Boundary detection
        -> Polygonization

    Returns:
        List of GeoJSON-compatible polygon geometries.
    """

    raster = load_geotiff(image_path)

    data = raster["data"]

    if data.shape[0] < 3:
        raise ValueError("Expected a GeoTIFF with at least 3 bands.")

    # Rasterio returns bands-first: (C, H, W).
    # OpenCV expects channels-last: (H, W, C).
    rgb = np.transpose(data[:3], (1, 2, 0))

    mask = detect_boundaries(rgb)

    polygons = mask_to_polygons(
        mask,
        raster["transform"],
        min_area=min_polygon_area,
    )

    return polygons