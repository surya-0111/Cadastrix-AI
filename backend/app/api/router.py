from fastapi import APIRouter, Depends
from app.api.projects import router as projects_router
from sqlalchemy import text
from sqlalchemy.orm import Session
from app.api.imagery import router as imagery_router
from app.api.processing import router as processing_router
from app.api.features import router as features_router
from app.api.parcels import router as parcels_router

from app.dependencies.database import get_database

api_router = APIRouter(prefix="/api")

api_router.include_router(projects_router)
api_router.include_router(imagery_router)
api_router.include_router(processing_router)
api_router.include_router(features_router)
api_router.include_router(parcels_router)


@api_router.get("/database/health", tags=["Database"])
def database_health(
    db: Session = Depends(get_database),
) -> dict[str, str]:
    db.execute(text("SELECT 1"))

    postgis_version = db.execute(
        text("SELECT PostGIS_Version()")
    ).scalar_one()

    return {
        "status": "ok",
        "database": "connected",
        "postgis_version": postgis_version,
    }