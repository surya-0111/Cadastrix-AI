from pathlib import Path

from fastapi import UploadFile

from app.core.config import get_settings
from app.utils.file_utils import (
    generate_stored_filename,
    validate_file_extension,
)


settings = get_settings()


async def save_upload_file(
    upload_file: UploadFile,
    project_id: int,
) -> tuple[str, int]:
    """
    Validate and save an uploaded imagery file.

    Returns:
        Tuple containing stored relative path and file size.
    """

    if not upload_file.filename:
        raise ValueError("Uploaded file must have a filename")

    validate_file_extension(upload_file.filename)

    project_dir = (
        Path(settings.upload_dir)
        / "projects"
        / str(project_id)
        / "imagery"
    )

    project_dir.mkdir(
        parents=True,
        exist_ok=True,
    )

    stored_filename = generate_stored_filename(
        upload_file.filename,
    )

    destination = project_dir / stored_filename

    max_size = settings.max_upload_size_mb * 1024 * 1024
    total_size = 0

    try:
        with destination.open("wb") as output:
            while chunk := await upload_file.read(1024 * 1024):
                total_size += len(chunk)

                if total_size > max_size:
                    destination.unlink(missing_ok=True)

                    raise ValueError(
                        f"File exceeds the maximum size of "
                        f"{settings.max_upload_size_mb} MB"
                    )

                output.write(chunk)

    except Exception:
        destination.unlink(missing_ok=True)
        raise

    return str(destination), total_size