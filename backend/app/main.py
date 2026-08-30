from fastapi import FastAPI

from app.api.router import api_router
from app.core.logging import configure_logging

configure_logging()

app = FastAPI(
    title="Cadastral AI Backend",
    description="Backend API for SIH26012 - AI-Based Urban Parcel & Cadastral Feature Extraction",
    version="0.1.0",
)

app.include_router(api_router)


@app.get("/health", tags=["Health"])
async def health_check() -> dict[str, str]:
    """Return the health status of the backend."""
    return {
        "status": "ok",
        "service": "cadastral-ai-backend",
        "version": "0.1.0",
    }