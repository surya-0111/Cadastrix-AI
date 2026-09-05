from datetime import datetime
from typing import TYPE_CHECKING

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


class Feature(Base):
    """
    Represents an AI-detected geospatial feature.

    Examples:
        BUILDING
        ROAD
    """

    __tablename__ = "features"

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

    feature_type: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
        index=True,
    )

    confidence: Mapped[float | None] = mapped_column(
        Float,
        nullable=True,
    )

    geometry = mapped_column(
        Geometry(
            geometry_type="GEOMETRY",
            srid=4326,
            spatial_index=True,
        ),
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
    )

    project: Mapped["Project"] = relationship()

    processing_job: Mapped["ProcessingJob"] = relationship(
        back_populates="features",
    )

    def __repr__(self) -> str:
        return (
            f"<Feature("
            f"id={self.id}, "
            f"type={self.feature_type!r}, "
            f"confidence={self.confidence})>"
        )