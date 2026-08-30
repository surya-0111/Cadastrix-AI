from datetime import datetime
from typing import TYPE_CHECKING
from sqlalchemy import (
    BigInteger,
    DateTime,
    ForeignKey,
    String,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.session import Base

if TYPE_CHECKING:
    from app.models.project import Project


class Imagery(Base):
    """
    Represents a drone imagery file uploaded to a project.
    """

    __tablename__ = "imagery"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        autoincrement=True,
    )

    project_id: Mapped[int] = mapped_column(
        ForeignKey("projects.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    original_filename: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    stored_filename: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
        unique=True,
    )

    file_path: Mapped[str] = mapped_column(
        String(1000),
        nullable=False,
        unique=True,
    )

    file_size: Mapped[int] = mapped_column(
        BigInteger,
        nullable=False,
    )

    file_type: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
    )

    width: Mapped[int | None] = mapped_column(
        nullable=True,
    )

    height: Mapped[int | None] = mapped_column(
        nullable=True,
    )

    band_count: Mapped[int | None] = mapped_column(
        nullable=True,
    )

    crs: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )

    min_x: Mapped[float | None] = mapped_column(nullable=True)
    min_y: Mapped[float | None] = mapped_column(nullable=True)
    max_x: Mapped[float | None] = mapped_column(nullable=True)
    max_y: Mapped[float | None] = mapped_column(nullable=True)

    status: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
        default="UPLOADED",
        server_default="UPLOADED",
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
        back_populates="imagery",
    )