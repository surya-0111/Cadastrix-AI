import numpy as np
import rasterio
from rasterio.transform import from_origin


output = "sample_drone.tif"

data = np.ones((100, 100), dtype=np.uint8)

transform = from_origin(
    500000,
    1500000,
    10,
    10,
)

with rasterio.open(
    output,
    "w",
    driver="GTiff",
    width=100,
    height=100,
    count=3,
    dtype="uint8",
    crs="EPSG:32644",
    transform=transform,
) as dataset:
    for band in range(1, 4):
        dataset.write(data, band)

print(f"Created {output}")