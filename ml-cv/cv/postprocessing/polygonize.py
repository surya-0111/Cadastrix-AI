from typing import Any

import cv2
import numpy as np
import rasterio
from rasterio.features import shapes
from shapely.geometry import shape


def mask_to_polygons(
    mask: np.ndarray,
    transform: Any,
    min_area: float = 10.0,
) -> list[dict]:
    """
    Convert a binary raster mask into geospatial polygons.

    Args:
        mask: Binary mask with shape (H, W).
        transform: Rasterio affine transform.
        min_area: Minimum polygon area to keep.

    Returns:
        List of GeoJSON-compatible polygon dictionaries.
    """

    if mask is None:
        raise ValueError("Mask cannot be None.")

    if mask.size == 0:
        raise ValueError("Mask is empty.")

    if mask.ndim != 2:
        raise ValueError("Mask must be a 2D array.")

    binary_mask = (mask > 0).astype(np.uint8)

    polygons = []

    for geometry, value in shapes(
        binary_mask,
        mask=binary_mask,
        transform=transform,
    ):
        if value != 1:
            continue

        polygon = shape(geometry)

        if polygon.is_valid and polygon.area >= min_area:
            polygons.append(polygon.__geo_interface__)

    return polygons