from pathlib import Path

from PIL import Image


def tile_image(
    image_path: str,
    output_dir: str,
    tile_size: int = 512,
    overlap: int = 64,
) -> int:
    """
    Split an image into overlapping tiles.

    Args:
        image_path: Path to the input image.
        output_dir: Folder where tiles will be saved.
        tile_size: Width/height of each square tile.
        overlap: Number of pixels shared between neighboring tiles.

    Returns:
        Number of tiles created.
    """
    image_file = Path(image_path)

    if not image_file.is_file():
        raise FileNotFoundError(f"Image not found: {image_path}")

    if tile_size <= 0:
        raise ValueError("tile_size must be greater than 0")

    if overlap < 0 or overlap >= tile_size:
        raise ValueError("overlap must be >= 0 and smaller than tile_size")

    output_path = Path(output_dir)
    output_path.mkdir(parents=True, exist_ok=True)

    image = Image.open(image_file).convert("RGB")

    width, height = image.size
    step = tile_size - overlap

    tile_count = 0

    for top in range(0, height, step):
        for left in range(0, width, step):
            right = min(left + tile_size, width)
            bottom = min(top + tile_size, height)

            tile = image.crop((left, top, right, bottom))

            tile_name = f"tile_{tile_count:04d}.png"
            tile.save(output_path / tile_name)

            tile_count += 1

    return tile_count
