from pathlib import Path

import rasterio
from rasterio.windows import Window


def tile_geotiff(
    image_path: str,
    output_dir: str,
    tile_size: int = 512,
    overlap: int = 64,
) -> int:
    """
    Split a GeoTIFF into overlapping GeoTIFF tiles while preserving
    CRS, transform, bands, dtype, and other important raster metadata.

    Args:
        image_path: Path to the input GeoTIFF.
        output_dir: Directory where tiles will be written.
        tile_size: Maximum tile width and height in pixels.
        overlap: Number of overlapping pixels between adjacent tiles.

    Returns:
        Number of tiles created.

    Raises:
        FileNotFoundError: If the input image does not exist.
        ValueError: If tile parameters are invalid or CRS is missing.
    """
    image_file = Path(image_path)

    if not image_file.is_file():
        raise FileNotFoundError(f"Image not found: {image_path}")

    if tile_size <= 0:
        raise ValueError("tile_size must be greater than 0")

    if overlap < 0 or overlap >= tile_size:
        raise ValueError(
            "overlap must be >= 0 and smaller than tile_size"
        )

    output_path = Path(output_dir)
    output_path.mkdir(parents=True, exist_ok=True)

    with rasterio.open(image_file) as src:
        if src.crs is None:
            raise ValueError("Input GeoTIFF must contain a CRS.")

        width = src.width
        height = src.height
        step = tile_size - overlap
        tile_count = 0

        for top in range(0, height, step):
            for left in range(0, width, step):
                tile_width = min(tile_size, width - left)
                tile_height = min(tile_size, height - top)

                if tile_width <= 0 or tile_height <= 0:
                    continue

                window = Window(
                    col_off=left,
                    row_off=top,
                    width=tile_width,
                    height=tile_height,
                )

                tile_transform = src.window_transform(window)

                profile = src.profile.copy()
                profile.update(
                    driver="GTiff",
                    width=tile_width,
                    height=tile_height,
                    transform=tile_transform,
                    crs=src.crs,
                )

                tile_name = f"tile_{tile_count:04d}.tif"
                tile_path = output_path / tile_name

                with rasterio.open(tile_path, "w", **profile) as dst:
                    dst.write(src.read(window=window))

                tile_count += 1

    return tile_count