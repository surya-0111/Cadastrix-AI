import rasterio
from rasterio.windows import Window


def tile_image(
    image_path,
    output_dir,
    tile_size=512,
    stride=None,
):
    """
    Split a GeoTIFF into fixed-size tiles.

    Returns:
        list of generated tile paths
    """

    if stride is None:
        stride = tile_size

    output_dir = str(output_dir)

    import os
    os.makedirs(output_dir, exist_ok=True)

    tile_paths = []

    with rasterio.open(image_path) as src:

        width = src.width
        height = src.height

        tile_id = 0

        for y in range(0, height, stride):
            for x in range(0, width, stride):

                w = min(tile_size, width - x)
                h = min(tile_size, height - y)

                # Skip incomplete edge tiles for now
                if w != tile_size or h != tile_size:
                    continue

                window = Window(x, y, tile_size, tile_size)

                data = src.read(window=window)

                profile = src.profile.copy()
                profile.update(
                    width=tile_size,
                    height=tile_size,
                    transform=rasterio.windows.transform(
                        window,
                        src.transform
                    )
                )

                tile_path = os.path.join(
                    output_dir,
                    f"tile_{tile_id:06d}.tif"
                )

                with rasterio.open(
                    tile_path,
                    "w",
                    **profile
                ) as dst:
                    dst.write(data)

                tile_paths.append(tile_path)

                tile_id += 1

    return tile_paths