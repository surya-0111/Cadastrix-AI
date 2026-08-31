import logging

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from starlette.middleware.trustedhost import TrustedHostMiddleware

from app.api.router import api_router
from app.core.config import get_settings


logger = logging.getLogger(__name__)

settings = get_settings()


app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    debug=settings.debug,
)


# --------------------------------------------------
# CORS
# --------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --------------------------------------------------
# Trusted hosts
# --------------------------------------------------

app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=[
        "localhost",
        "127.0.0.1",
        "testserver",
    ],
)


# --------------------------------------------------
# Global unexpected-error handler
# --------------------------------------------------

@app.exception_handler(Exception)
async def unhandled_exception_handler(
    request: Request,
    exc: Exception,
) -> JSONResponse:
    """
    Handle unexpected API errors without exposing
    internal implementation details to clients.
    """

    logger.exception(
        "Unhandled API exception: %s %s",
        request.method,
        request.url.path,
        exc_info=exc,
    )

    return JSONResponse(
        status_code=500,
        content={
            "detail": "Internal server error.",
        },
    )


# --------------------------------------------------
# API routers
# --------------------------------------------------

app.include_router(api_router)

# Health endpoints:
#   /health
#   /ready