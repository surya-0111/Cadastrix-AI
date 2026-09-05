from dataclasses import dataclass
from pathlib import Path
import json
import sys

import numpy as np
import rasterio
from rasterio.features import shapes
from rasterio.windows import Window
from shapely.geometry import shape, mapping


# ============================================================
# PROJECT PATHS
# ============================================================

PROJECT_ROOT = Path(__file__).resolve().parents[3]
ML_CV_ROOT = PROJECT_ROOT / "ml-cv"

if str(ML_CV_ROOT) not in sys.path:
    sys.path.insert(0, str(ML_CV_ROOT))

from inference.predictor import SegmentationPredictor


# ============================================================
# RESULT
# ============================================================

@dataclass
class MLResult:
    """Result returned by the ML/CV pipeline."""

    building_output_path: str
    road_output_path: str
    building_count: int
    road_count: int
    source_crs: str


# ============================================================
# ML CLIENT
# ============================================================

class MLClient:
    """
    Interface between the backend and the ML/CV pipeline.

    Building:
        Trained U-Net segmentation model.

    Roads:
        Existing classical-CV road baseline.
    """

    def __init__(
        self,
        output_dir: str | Path | None = None,
        checkpoint: str | Path | None = None,
    ) -> None:

        # ----------------------------------------------------
        # Always use project-relative absolute paths
        # ----------------------------------------------------

        if output_dir is None:
            output_dir = PROJECT_ROOT / "backend" / "storage" / "ml"

        if checkpoint is None:
            checkpoint = (
                PROJECT_ROOT
                / "ml-cv"
                / "models"
                / "building"
                / "building_unet.pth"
            )

        self.output_dir = Path(output_dir)

        if not self.output_dir.is_absolute():
            self.output_dir = PROJECT_ROOT / self.output_dir

        self.output_dir.mkdir(
            parents=True,
            exist_ok=True,
        )

        self.checkpoint = Path(checkpoint)

        if not self.checkpoint.is_absolute():
            self.checkpoint = PROJECT_ROOT / self.checkpoint

        if not self.checkpoint.exists():
            raise FileNotFoundError(
                f"Building model checkpoint not found: "
                f"{self.checkpoint}"
            )

        # ----------------------------------------------------
        # Load trained building model
        # ----------------------------------------------------

        self.predictor = SegmentationPredictor(
            checkpoint=self.checkpoint
        )

    # ========================================================
    # BUILDING SEGMENTATION
    # ========================================================

    def _run_building_inference(
        self,
        imagery_path: Path,
        building_mask_output: Path,
        building_output: Path,
    ) -> tuple[int, str]:

        tile_size = 512
        threshold = 0.5

        features = []

        with rasterio.open(imagery_path) as src:

            if src.count < 3:
                raise ValueError(
                    "Imagery must contain at least 3 bands."
                )

            source_crs = (
                src.crs.to_string()
                if src.crs
                else "UNKNOWN"
            )

            profile = src.profile.copy()

            profile.update(
                driver="GTiff",
                count=1,
                dtype="uint8",
                compress="lzw",
                nodata=0,
                photometric="MINISBLACK",
            )

            # Remove incompatible TIFF metadata
            profile.pop("interleave", None)
            profile.pop("blockxsize", None)
            profile.pop("blockysize", None)

            total_tiles = 0

            with rasterio.open(
                building_mask_output,
                "w",
                **profile,
            ) as dst:

                for row in range(
                    0,
                    src.height,
                    tile_size,
                ):

                    for col in range(
                        0,
                        src.width,
                        tile_size,
                    ):

                        h = min(
                            tile_size,
                            src.height - row,
                        )

                        w = min(
                            tile_size,
                            src.width - col,
                        )

                        window = Window(
                            col,
                            row,
                            w,
                            h,
                        )

                        rgb = src.read(
                            [1, 2, 3],
                            window=window,
                        ).transpose(1, 2, 0)

                        # ------------------------------------
                        # Trained U-Net inference
                        # ------------------------------------

                        probability = (
                            self.predictor.predict(rgb)
                        )

                        mask = (
                            probability >= threshold
                        ).astype(np.uint8)

                        dst.write(
                            mask,
                            1,
                            window=window,
                        )

                        # ------------------------------------
                        # Vectorize building mask
                        # ------------------------------------

                        transform = (
                            src.window_transform(window)
                        )

                        for geom, value in shapes(
                            mask,
                            mask=mask.astype(bool),
                            transform=transform,
                        ):

                            if value != 1:
                                continue

                            polygon = shape(geom)

                            if polygon.is_empty:
                                continue

                            # Ignore tiny objects
                            if polygon.area < 100:
                                continue

                            # Repair invalid geometry
                            if not polygon.is_valid:
                                polygon = polygon.buffer(0)

                            if polygon.is_empty:
                                continue

                            features.append(
                                {
                                    "type": "Feature",
                                    "properties": {
                                        "feature_type": "BUILDING"
                                    },
                                    "geometry": mapping(
                                        polygon
                                    ),
                                }
                            )

                        total_tiles += 1

                        if total_tiles % 100 == 0:
                            print(
                                "ML building tiles:",
                                total_tiles,
                            )

            # -----------------------------------------------
            # Write building GeoJSON
            # -----------------------------------------------

            building_collection = {
                "type": "FeatureCollection",
                "features": features,
            }

            if src.crs:
                building_collection["crs"] = {
                    "type": "name",
                    "properties": {
                        "name": source_crs
                    },
                }

            building_output.write_text(
                json.dumps(
                    building_collection
                ),
                encoding="utf-8",
            )

        return len(features), source_crs

    # ========================================================
    # ROAD BASELINE
    # ========================================================

    def _prepare_road_output(
        self,
        road_output: Path,
        source_crs: str,
    ) -> int:

        # ----------------------------------------------------
        # Prefer already-generated road GeoJSON
        # ----------------------------------------------------

        if road_output.exists():

            try:
                data = json.loads(
                    road_output.read_text(
                        encoding="utf-8"
                    )
                )

                features = data.get(
                    "features",
                    [],
                )

                return len(features)

            except Exception:
                # If existing file is invalid,
                # regenerate it below.
                pass

        existing_road_mask = (
            self.output_dir / "road_mask.tif"
        )

        road_features = []

        if existing_road_mask.exists():

            with rasterio.open(
                existing_road_mask
            ) as road_src:

                road_mask = road_src.read(1)

                road_transform = (
                    road_src.transform
                )

                for geom, value in shapes(
                    road_mask,
                    mask=road_mask > 0,
                    transform=road_transform,
                ):

                    if value == 0:
                        continue

                    geometry = shape(geom)

                    if geometry.is_empty:
                        continue

                    # Ignore tiny noise
                    if geometry.area < 10:
                        continue

                    if not geometry.is_valid:
                        geometry = geometry.buffer(0)

                    if geometry.is_empty:
                        continue

                    road_features.append(
                        {
                            "type": "Feature",
                            "properties": {
                                "feature_type": "ROAD",
                                "method": "CV_BASELINE",
                            },
                            "geometry": mapping(
                                geometry
                            ),
                        }
                    )

        road_collection = {
            "type": "FeatureCollection",
            "features": road_features,
            "crs": {
                "type": "name",
                "properties": {
                    "name": source_crs
                },
            },
        }

        road_output.write_text(
            json.dumps(
                road_collection
            ),
            encoding="utf-8",
        )

        return len(road_features)

    # ========================================================
    # MAIN PIPELINE
    # ========================================================

    def extract_features(
        self,
        imagery_path: str | Path,
    ) -> MLResult:

        path = Path(imagery_path)

        if not path.exists():
            raise FileNotFoundError(
                f"Imagery file not found: {path}"
            )

        building_output = (
            self.output_dir / "buildings.geojson"
        )

        road_output = (
            self.output_dir / "roads.geojson"
        )

        building_mask_output = (
            self.output_dir / "building_mask.tif"
        )

        print("=" * 60)
        print("CADASTRIX-AI ML/CV PIPELINE")
        print("=" * 60)
        print("INPUT:", path)
        print("OUTPUT:", self.output_dir)
        print("MODEL:", self.checkpoint)

        # ----------------------------------------------------
        # Building inference
        # ----------------------------------------------------

        building_count, source_crs = (
            self._run_building_inference(
                imagery_path=path,
                building_mask_output=building_mask_output,
                building_output=building_output,
            )
        )

        # ----------------------------------------------------
        # Road baseline
        # ----------------------------------------------------

        road_count = self._prepare_road_output(
            road_output=road_output,
            source_crs=source_crs,
        )

        # ----------------------------------------------------
        # Final result
        # ----------------------------------------------------

        print("=" * 60)
        print("ML CLIENT COMPLETE")
        print("BUILDINGS:", building_count)
        print("ROADS:", road_count)
        print("BUILDING OUTPUT:", building_output)
        print("ROAD OUTPUT:", road_output)
        print("CRS:", source_crs)
        print("=" * 60)

        return MLResult(
            building_output_path=str(
                building_output
            ),
            road_output_path=str(
                road_output
            ),
            building_count=building_count,
            road_count=road_count,
            source_crs=source_crs,
        )