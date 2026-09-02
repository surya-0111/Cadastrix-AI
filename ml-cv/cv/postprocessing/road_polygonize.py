import numpy as np
import rasterio
from rasterio.features import shapes
from shapely.geometry import shape, mapping
from shapely.ops import unary_union


def road_mask_to_polygons(
    mask: np.ndarray,
    transform,
    crs,
    min_area: float = 10.0,
) -> dict:
    """
    Convert a binary road mask into georeferenced GeoJSON polygons.

    Args:
        mask: 2D binary road mask.
        transform: Rasterio affine transform for the tile.
        crs: CRS of the source raster.
        min_area: Minimum polygon area to retain.

    Returns:
        GeoJSON FeatureCollection containing road polygons.
    """
    if mask is None:
        raise ValueError("Mask cannot be None.")

    if not isinstance(mask, np.ndarray):
        raise ValueError("Mask must be a NumPy array.")

    if mask.ndim != 2:
        raise ValueError("Mask must be a 2D array.")

    if mask.size == 0:
        raise ValueError("Mask is empty.")

    if crs is None:
        raise ValueError("CRS is required.")

    if min_area < 0:
        raise ValueError("min_area must be non-negative.")

    binary = np.where(mask > 0, 1, 0).astype(np.uint8)

    polygons = []

    for geometry, value in shapes(
        binary,
        mask=binary.astype(bool),
        transform=transform,
    ):
        if value != 1:
            continue

        polygon = shape(geometry)

        if polygon.is_empty:
            continue

        if not polygon.is_valid:
            polygon = polygon.buffer(0)

        if polygon.is_empty:
            continue

        if polygon.area < min_area:
            continue

        polygons.append(polygon)

    features = []

    for index, polygon in enumerate(polygons):
        features.append(
            {
                "type": "Feature",
                "properties": {
                    "id": index,
                    "class": "road",
                    "area": float(polygon.area),
                },
                "geometry": mapping(polygon),
            }
        )

    return {
        "type": "FeatureCollection",
        "crs": {
            "type": "name",
            "properties": {
                "name": str(crs),
            },
        },
        "features": features,
    }