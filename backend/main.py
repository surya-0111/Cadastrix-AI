from pathlib import Path
import sys
import tempfile

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware

# Project root
PROJECT_ROOT = Path(__file__).resolve().parent.parent

# Add ml-cv folder to Python path
ML_CV_PATH = PROJECT_ROOT / "ml-cv"
sys.path.insert(0, str(ML_CV_PATH))

# Import ML-CV pipeline
from main import process_geotiff


# Create FastAPI application
app = FastAPI(
    title="Cadastrix-AI ML-CV API",
    version="1.0.0",
)


# Enable frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    """API root endpoint."""
    return {
        "message": "Cadastrix-AI ML-CV API is running",
        "status": "ok",
    }


@app.get("/api/health")
def health():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "service": "ml-cv",
    }


@app.post("/api/process")
async def process_image(file: UploadFile = File(...)):
    """
    Upload a GeoTIFF and process it through the ML-CV pipeline.
    """

    # Check filename
    if not file.filename:
        raise HTTPException(
            status_code=400,
            detail="No file provided.",
        )

    # Only allow GeoTIFF files
    if not file.filename.lower().endswith((".tif", ".tiff")):
        raise HTTPException(
            status_code=400,
            detail="Only GeoTIFF (.tif/.tiff) files are supported.",
        )

    suffix = Path(file.filename).suffix.lower()

    try:
        # Read uploaded file
        file_bytes = await file.read()

        if not file_bytes:
            raise HTTPException(
                status_code=400,
                detail="Uploaded file is empty.",
            )

        # Create temporary GeoTIFF
        with tempfile.NamedTemporaryFile(
            suffix=suffix,
            delete=False,
        ) as temp_file:
            temp_file.write(file_bytes)
            temp_path = Path(temp_file.name)

        try:
            # Run ML-CV pipeline
            polygons = process_geotiff(
                str(temp_path),
                min_polygon_area=1e-8,
                method="baseline",
            )

            # Return results
            return {
                "success": True,
                "filename": file.filename,
                "polygon_count": len(polygons),
                "polygons": polygons,
            }

        finally:
            # Delete temporary file
            temp_path.unlink(missing_ok=True)

    except HTTPException:
        raise

    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"ML-CV processing failed: {exc}",
                ) from exc
