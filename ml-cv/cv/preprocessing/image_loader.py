from pathlib import Path

def validate_image_path(image_path: str) -> bool:
    """Check whether the input image exists."""
    return Path(image_path).is_file()
