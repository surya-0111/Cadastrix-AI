import numpy as np
import rasterio
from rasterio.transform import from_origin

from app.utils.raster_utils import (
    extract_raster_metadata,
    validate_raster_metadata,
)


def create_test_geotiff(path) -> None:
    """Create a small georeferenced GeoTIFF for testing."""

    data = np.ones((10, 20), dtype=np.uint8)

    transform = from_origin(
        500000,
        1500000,
        10,
        10,
    )

    with rasterio.open(
        path,
        "w",
        driver="GTiff",
        width=20,
        height=10,
        count=3,
        dtype="uint8",
        crs="EPSG:32644",
        transform=transform,
    ) as dataset:
        for band in range(1, 4):
            dataset.write(data, band)


def test_extract_raster_metadata(tmp_path) -> None:
    raster_path = tmp_path / "sample.tif"

    create_test_geotiff(raster_path)

    metadata = extract_raster_metadata(raster_path)

    assert metadata["width"] == 20
    assert metadata["height"] == 10
    assert metadata["band_count"] == 3
    assert metadata["crs"] == "EPSG:32644"


def test_validate_raster_metadata(tmp_path) -> None:
    raster_path = tmp_path / "sample.tif"

    create_test_geotiff(raster_path)

    metadata = extract_raster_metadata(raster_path)

    validate_raster_metadata(metadata)


def test_missing_raster_file() -> None:
    try:
        extract_raster_metadata("does_not_exist.tif")
    except ValueError as exc:
        assert "does not exist" in str(exc)
    else:
        raise AssertionError(
            "Expected ValueError for missing raster"
        )