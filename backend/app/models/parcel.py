from datetime import datetime
from typing import TYPE_CHECKING
from sqlalchemy import Text
from geoalchemy2 import Geometry
from sqlalchemy import (
    DateTime,
    Float,
    ForeignKey,
    String,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.session import Base


if TYPE_CHECKING:
    from app.models.processing_job import ProcessingJob
    from app.models.project import Project


class Parcel(Base):
    """
    Represents a preliminary cadastral parcel generated
    by the GIS processing pipeline.
    """

    __tablename__ = "parcels"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        autoincrement=True,
    )

    project_id: Mapped[int] = mapped_column(
        ForeignKey(
            "projects.id",
            ondelete="CASCADE",
        ),
        nullable=False,
        index=True,
    )

    processing_job_id: Mapped[int] = mapped_column(
        ForeignKey(
            "processing_jobs.id",
            ondelete="CASCADE",
        ),
        nullable=False,
        index=True,
    )

    parcel_code: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        index=True,
    )

    area_m2: Mapped[float | None] = mapped_column(
        Float,
        nullable=True,
    )

    perimeter_m: Mapped[float | None] = mapped_column(
        Float,
        nullable=True,
    )

    confidence: Mapped[float | None] = mapped_column(
        Float,
        nullable=True,
    )

    validity_status: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
        default="VALID",
        server_default="VALID",
        index=True,
    )

    review_status: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
        default="PENDING",
        server_default="PENDING",
        index=True,
    )

    geometry = mapped_column(
        Geometry(
            geometry_type="POLYGON",
            srid=4326,
            spatial_index=True,
        ),
        nullable=False,
    )

    review_comment: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
        onupdate=func.now(),
    )

    project: Mapped["Project"] = relationship()

    processing_job: Mapped["ProcessingJob"] = relationship(
        back_populates="parcels",
    )

    def __repr__(self) -> str:
        return (
            f"<Parcel("
            f"id={self.id}, "
            f"code={self.parcel_code!r}, "
            f"status={self.validity_status!r})>"
        )