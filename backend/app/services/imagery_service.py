from pathlib import Path
from sqlalchemy import select
from fastapi import UploadFile
from sqlalchemy.orm import Session

from app.models.imagery import Imagery
from app.services.storage_service import save_upload_file
from app.utils.raster_utils import (
    extract_raster_metadata,
    validate_raster_metadata,
)


async def upload_imagery(
    db: Session,
    project_id: int,
    upload_file: UploadFile,
) -> Imagery:
    """
    Save an uploaded GeoTIFF, extract its metadata,
    and create the corresponding database record.
    """

    file_path, file_size = await save_upload_file(
        upload_file,
        project_id,
    )

    try:
        metadata = extract_raster_metadata(file_path)
        validate_raster_metadata(metadata)
    except Exception:
        Path(file_path).unlink(missing_ok=True)
        raise

    imagery = Imagery(
        project_id=project_id,
        original_filename=upload_file.filename or "unknown.tif",
        stored_filename=Path(file_path).name,
        file_path=file_path,
        file_size=file_size,
        file_type="GeoTIFF",
        width=metadata["width"],
        height=metadata["height"],
        band_count=metadata["band_count"],
        crs=metadata["crs"],
        min_x=metadata["min_x"],
        min_y=metadata["min_y"],
        max_x=metadata["max_x"],
        max_y=metadata["max_y"],
    )

    db.add(imagery)
    db.commit()
    db.refresh(imagery)

    return imagery

def get_project_imagery(
    db: Session,
    project_id: int,
) -> list[Imagery]:
    """
    Return all imagery belonging to a project.
    """

    statement = (
        select(Imagery)
        .where(Imagery.project_id == project_id)
        .order_by(Imagery.id.desc())
    )

    return list(db.scalars(statement).all())


def get_imagery(
    db: Session,
    imagery_id: int,
) -> Imagery | None:
    """
    Return imagery metadata by ID.
    """

    statement = select(Imagery).where(
        Imagery.id == imagery_id
    )

    return db.scalars(statement).first()


def delete_imagery(
    db: Session,
    imagery: Imagery,
) -> None:
    """
    Delete an imagery database record and its stored file.
    """

    file_path = Path(imagery.file_path)

    db.delete(imagery)
    db.commit()

    file_path.unlink(missing_ok=True)