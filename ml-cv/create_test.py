import rasterio
import numpy as np
from rasterio.transform import from_origin
p = r"C:\Users\evara\Downloads\test.tif"
data = np.random.randint(0, 255, (3, 256, 256), dtype=np.uint8)
profile = {
    "driver": "GTiff",
    "height": 256,
    "width": 256,
    "count": 3,
    "dtype": "uint8",
    "crs": "EPSG:4326",
    "transform": from_origin(80.20, 13.10, 0.0001, 0.0001),
}
with rasterio.open(p, "w", **profile) as dst:
    dst.write(data)
print("CREATED:", p)
