from datetime import datetime
from geoalchemy2 import Geometry
from sqlalchemy import DateTime, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column

from app.db.session import Base
from typing import TYPE_CHECKING

from sqlalchemy.orm import relationship

if TYPE_CHECKING:
    from app.models.imagery import Imagery
    from app.models.processing_job import ProcessingJob



class Project(Base):
    """
    Represents a cadastral mapping project.
    """

    __tablename__ = "projects"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        autoincrement=True,
    )

    imagery: Mapped[list["Imagery"]] = relationship(
        back_populates="project",
        cascade="all, delete-orphan",
    )

    processing_jobs: Mapped[list["ProcessingJob"]] = relationship(
        back_populates="project",
        cascade="all, delete-orphan",
    )

    name: Mapped[str] = mapped_column(
        String(150),
        nullable=False,
        index=True,
    )

    description: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    status: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
        default="ACTIVE",
        server_default="ACTIVE",
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

    survey_boundary = mapped_column(
        Geometry(
        geometry_type="POLYGON",
        srid=4326,
        spatial_index=True,
        ),
        nullable=True,
    )

    def __repr__(self) -> str:
        return (
            f"<Project(id={self.id}, "
            f"name={self.name!r}, "
            f"status={self.status!r})>"
        )