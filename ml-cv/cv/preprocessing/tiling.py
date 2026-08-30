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
    Split a GeoTIFF into overlapping GeoTIFF tiles.

    Geospatial metadata such as CRS and spatial transform
    is preserved for every generated tile.
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

    tile_count = 0
    step = tile_size - overlap

    with rasterio.open(image_file) as src:

        for top in range(0, src.height, step):
            for left in range(0, src.width, step):

                width = min(tile_size, src.width - left)
                height = min(tile_size, src.height - top)

                window = Window(
                    left,
                    top,
                    width,
                    height,
                )

                tile_transform = src.window_transform(window)

                tile_data = src.read(window=window)

                profile = src.profile.copy()

                profile.update(
                    {
                        "height": height,
                        "width": width,
                        "transform": tile_transform,
                    }
                )

                tile_name = f"tile_{tile_count:04d}.tif"

                tile_path = output_path / tile_name

                with rasterio.open(
                    tile_path,
                    "w",
                    **profile,
                ) as dst:
                    dst.write(tile_data)

                tile_count += 1

    return tile_count