from pathlib import Path
import sys
import tempfile

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware

PROJECT_ROOT = Path(__file__).resolve().parent.parent
ML_CV_PATH = PROJECT_ROOT / "ml-cv"
sys.path.insert(0, str(ML_CV_PATH))

from main import process_geotiff


app = FastAPI(
    title="Cadastrix-AI ML-CV API",
    version="1.0.0",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {
        "message": "Cadastrix-AI ML-CV API is running",
        "status": "ok",
    }


@app.get("/api/health")
def health():
    return {
        "status": "healthy",
        "service": "ml-cv",
    }


@app.get("/api/projects")
def get_projects():
    return {
        "projects": [
            {
                "id": "proj-001",
                "name": "Chennai Cadastral Mapping",
                "status": "active",
                "description": "AI-assisted cadastral boundary detection.",
            }
        ]
    }


@app.get("/api/projects/{project_id}/features")
def get_project_features(project_id: str):
    if project_id != "proj-001":
        raise HTTPException(
            status_code=404,
            detail="Project not found.",
        )

    return {
        "project_id": project_id,
        "features": [],
    }


@app.post("/api/process")
async def process_image(file: UploadFile = File(...)):

    if not file.filename:
        raise HTTPException(
            status_code=400,
            detail="No file provided.",
        )

    if not file.filename.lower().endswith((".tif", ".tiff")):
        raise HTTPException(
            status_code=400,
            detail="Only GeoTIFF (.tif/.tiff) files are supported.",
        )

    suffix = Path(file.filename).suffix.lower()

    try:
        file_bytes = await file.read()

        if not file_bytes:
            raise HTTPException(
                status_code=400,
                detail="Uploaded file is empty.",
            )

        with tempfile.NamedTemporaryFile(
            suffix=suffix,
            delete=False,
        ) as temp_file:
            temp_file.write(file_bytes)
            temp_path = Path(temp_file.name)

        try:
            polygons = process_geotiff(
                str(temp_path),
                min_polygon_area=1e-8,
                method="baseline",
            )

            return {
                "success": True,
                "filename": file.filename,
                "polygon_count": len(polygons),
                "polygons": polygons,
            }

        finally:
            temp_path.unlink(missing_ok=True)

    except HTTPException:
        raise

    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"ML-CV processing failed: {exc}",
        ) from exc