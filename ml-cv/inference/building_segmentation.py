import json
import sys
from pathlib import Path

import numpy as np
import rasterio
from rasterio.features import shapes
from rasterio.windows import Window
from shapely.geometry import shape, mapping

# Allow importing from ml-cv
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from inference.predictor import SegmentationPredictor


INPUT = Path(r"backend\drone_real.tif")
MASK_OUTPUT = Path(r"backend\storage\ml\building_mask.tif")
GEOJSON_OUTPUT = Path(r"backend\storage\ml\buildings.geojson")
CHECKPOINT = Path(r"ml-cv\models\building\building_unet.pth")

TILE_SIZE = 512
THRESHOLD = 0.5
MIN_AREA = 100


def main():
    print("=" * 60)
    print("CADASTRIX-AI TRAINED BUILDING INFERENCE")
    print("=" * 60)

    MASK_OUTPUT.parent.mkdir(parents=True, exist_ok=True)

    predictor = SegmentationPredictor(
        checkpoint=CHECKPOINT
    )

    with rasterio.open(INPUT) as src:
        if src.count < 3:
            raise ValueError("GeoTIFF must contain at least 3 bands.")

        width = src.width
        height = src.height

        tiles_x = (width + TILE_SIZE - 1) // TILE_SIZE
        tiles_y = (height + TILE_SIZE - 1) // TILE_SIZE
        total_tiles = tiles_x * tiles_y

        print("INPUT:", INPUT)
        print("SIZE:", width, "x", height)
        print("CRS:", src.crs)
        print("TILES:", total_tiles)

        profile = src.profile.copy()
        profile.update(
            driver="GTiff",
            dtype="uint8",
            count=1,
            compress="lzw",
            nodata=0,
            photometric="MINISBLACK",
        )

        profile.pop("interleave", None)
        profile.pop("blockxsize", None)
        profile.pop("blockysize", None)

        with rasterio.open(
            MASK_OUTPUT,
            "w",
            **profile,
        ) as dst:

            tile_no = 0

            for y in range(0, height, TILE_SIZE):
                for x in range(0, width, TILE_SIZE):

                    tile_no += 1

                    w = min(TILE_SIZE, width - x)
                    h = min(TILE_SIZE, height - y)

                    window = Window(x, y, w, h)

                    image = src.read(
                        [1, 2, 3],
                        window=window,
                    ).transpose(1, 2, 0)

                    probabilities = predictor.predict(image)

                    mask = (
                        probabilities >= THRESHOLD
                    ).astype(np.uint8)

                    dst.write(
                        mask,
                        1,
                        window=window,
                    )

                    if tile_no % 25 == 0 or tile_no == total_tiles:
                        print(
                            f"Processed {tile_no}/{total_tiles} tiles"
                        )

    print()
    print("MASK COMPLETE:", MASK_OUTPUT)

    # Vectorize in tiles to avoid loading the full raster into RAM.
    print("VECTORISING BUILDINGS...")

    features = []

    with rasterio.open(MASK_OUTPUT) as src:
        transform = src.transform
        crs = src.crs

        for y in range(0, height, TILE_SIZE):
            for x in range(0, width, TILE_SIZE):

                w = min(TILE_SIZE, width - x)
                h = min(TILE_SIZE, height - y)

                window = Window(x, y, w, h)

                mask = src.read(
                    1,
                    window=window,
                )

                if not mask.any():
                    continue

                window_transform = (
                    rasterio.windows.transform(
                        window,
                        transform,
                    )
                )

                for geom, value in shapes(
                    mask,
                    mask=mask.astype(bool),
                    transform=window_transform,
                ):
                    if value != 1:
                        continue

                    polygon = shape(geom)

                    if polygon.is_empty:
                        continue

                    if polygon.area < MIN_AREA:
                        continue

                    features.append(
                        {
                            "type": "Feature",
                            "properties": {
                                "class": "building",
                                "confidence": THRESHOLD,
                            },
                            "geometry": mapping(polygon),
                        }
                    )

    geojson = {
        "type": "FeatureCollection",
        "features": features,
    }

    if crs:
        geojson["crs"] = {
            "type": "name",
            "properties": {
                "name": crs.to_string()
            },
        }

    GEOJSON_OUTPUT.write_text(
        json.dumps(geojson),
        encoding="utf-8",
    )

    print()
    print("=" * 60)
    print("INFERENCE COMPLETE")
    print("=" * 60)
    print("MASK:", MASK_OUTPUT)
    print("GEOJSON:", GEOJSON_OUTPUT)
    print("BUILDINGS:", len(features))


if __name__ == "__main__":
    main()