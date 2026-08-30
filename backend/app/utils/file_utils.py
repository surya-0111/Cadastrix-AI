from pathlib import Path
from uuid import uuid4


ALLOWED_EXTENSIONS = {".tif", ".tiff"}


def get_file_extension(filename: str) -> str:
    """Return a normalized file extension."""
    return Path(filename).suffix.lower()


def validate_file_extension(filename: str) -> None:
    """Validate that the file has an allowed extension."""
    extension = get_file_extension(filename)

    if extension not in ALLOWED_EXTENSIONS:
        allowed = ", ".join(sorted(ALLOWED_EXTENSIONS))
        raise ValueError(
            f"Unsupported file type '{extension}'. "
            f"Allowed types: {allowed}"
        )


def generate_stored_filename(original_filename: str) -> str:
    """Generate a unique safe filename while preserving the extension."""
    extension = get_file_extension(original_filename)

    return f"{uuid4()}{extension}"