from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import (
    DateTime,
    ForeignKey,
    Integer,
    String,
    Text,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.session import Base


if TYPE_CHECKING:
    from app.models.feature import Feature
    from app.models.imagery import Imagery
    from app.models.parcel import Parcel
    from app.models.project import Project


class ProcessingJob(Base):
    """
    Represents one processing attempt for an imagery file.
    """

    __tablename__ = "processing_jobs"

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

    imagery_id: Mapped[int] = mapped_column(
        ForeignKey(
            "imagery.id",
            ondelete="CASCADE",
        ),
        nullable=False,
        index=True,
    )

    features: Mapped[list["Feature"]] = relationship(
        back_populates="processing_job",
        cascade="all, delete-orphan",
    )

    parcels: Mapped[list["Parcel"]] = relationship(
        back_populates="processing_job",
        cascade="all, delete-orphan",
    )

    status: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
        default="QUEUED",
        server_default="QUEUED",
        index=True,
    )

    current_step: Mapped[str | None] = mapped_column(
        String(50),
        nullable=True,
    )

    progress: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0,
        server_default="0",
    )

    error_message: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    started_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )

    completed_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
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

    project: Mapped["Project"] = relationship(
        back_populates="processing_jobs",
    )

    imagery: Mapped["Imagery"] = relationship(
        back_populates="processing_jobs",
    )

    def __repr__(self) -> str:
        return (
            f"<ProcessingJob("
            f"id={self.id}, "
            f"status={self.status!r}, "
            f"progress={self.progress})>"
        )