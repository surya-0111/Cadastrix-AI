from logging.config import fileConfig

from alembic import context
from sqlalchemy import engine_from_config, pool

from app.core.config import get_settings
from app.db.session import Base
from app import models  # noqa: F401


# Alembic Config object
config = context.config


# Configure Python logging using alembic.ini
if config.config_file_name is not None:
    fileConfig(config.config_file_name)


# Load application database settings
settings = get_settings()

# Keep the database URL out of alembic.ini.
config.set_main_option(
    "sqlalchemy.url",
    settings.database_url,
)


# SQLAlchemy metadata used by Alembic autogenerate
target_metadata = Base.metadata

def include_object(
    object,
    name,
    type_,
    reflected,
    compare_to,
):
    """
    Prevent Alembic from managing PostGIS system tables.
    """
    if (
        type_ == "table"
        and name == "spatial_ref_sys"
        and reflected
        and compare_to is None
    ):
        return False

    return True


def run_migrations_offline() -> None:
    """Run migrations in offline mode."""

    url = settings.database_url

    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={
            "paramstyle": "named",
        },
    include_object=include_object,
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Run migrations in online mode."""

    connectable = engine_from_config(
        config.get_section(config.config_ini_section),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            include_object=include_object,
    )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()