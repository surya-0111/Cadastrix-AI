from pathlib import Path

import cv2
import numpy as np
import rasterio


INPUT = Path(r"backend\drone_real.tif")
MASK_OUTPUT = Path(r"backend\storage\ml\road_mask.tif")

TILE_SIZE = 512


def process_tile(image):
    image = image.astype(np.uint8)

    hsv = cv2.cvtColor(image, cv2.COLOR_RGB2HSV)
    h, s, v = cv2.split(hsv)

    mask = (
        (s < 80)
        & (v > 70)
        & (v < 240)
    ).astype(np.uint8) * 255

    kernel = np.ones((5, 5), np.uint8)
    mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, kernel)
    mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, kernel)

    return (mask > 0).astype(np.uint8)


def main():
    print("=" * 60)
    print("CADASTRIX-AI ROAD EXTRACTION BASELINE")
    print("=" * 60)

    MASK_OUTPUT.parent.mkdir(parents=True, exist_ok=True)

    with rasterio.open(INPUT) as src:
        if src.count < 3:
            raise ValueError("GeoTIFF must contain at least 3 bands.")

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

        with rasterio.open(MASK_OUTPUT, "w", **profile) as dst:
            total = 0

            for y in range(0, src.height, TILE_SIZE):
                for x in range(0, src.width, TILE_SIZE):
                    w = min(TILE_SIZE, src.width - x)
                    h = min(TILE_SIZE, src.height - y)

                    window = rasterio.windows.Window(x, y, w, h)

                    image = src.read(
                        [1, 2, 3],
                        window=window,
                    ).transpose(1, 2, 0)

                    mask = process_tile(image)

                    dst.write(mask, 1, window=window)

                    total += 1

                    if total % 100 == 0:
                        print(f"Processed {total} road tiles")

    print("=" * 60)
    print("ROAD EXTRACTION COMPLETE")
    print("MASK:", MASK_OUTPUT)
    print("=" * 60)


if __name__ == "__main__":
    main()