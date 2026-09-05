from fastapi import APIRouter, HTTPException, status
from sqlalchemy import text

from app.db.session import SessionLocal


router = APIRouter(
    tags=["Health"],
)


@router.get("/health")
def health_check() -> dict[str, str]:
    return {
        "status": "ok",
        "service": "cadastral-ai-backend",
        "version": "0.1.0",
    }


@router.get("/ready")
def readiness_check() -> dict[str, str]:
    db = SessionLocal()

    try:
        db.execute(text("SELECT 1"))

        return {
            "status": "ready",
        }

    except Exception:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Service is not ready.",
        )

    finally:
        db.close()