from pathlib import Path

import numpy as np
import rasterio


def load_rgb(image_path: str | Path):
    """Load a 3-band RGB GeoTIFF while preserving geospatial metadata."""

    image_path = Path(image_path)

    if not image_path.exists():
        raise FileNotFoundError(f"Image not found: {image_path}")

    with rasterio.open(image_path) as src:
        image = src.read()

        if src.count < 3:
            raise ValueError("Expected at least 3 image bands.")

        image = image[:3].transpose(1, 2, 0)

        metadata = {
            "crs": src.crs,
            "transform": src.transform,
            "width": src.width,
            "height": src.height,
            "bounds": src.bounds,
            "resolution": src.res,
        }

    return image, metadata