from shapely.geometry.base import BaseGeometry
from shapely.ops import transform
from pyproj import CRS, Transformer


DEFAULT_STORAGE_CRS = "EPSG:4326"


def transform_geometry(
    geometry: BaseGeometry,
    source_crs: str,
    target_crs: str = DEFAULT_STORAGE_CRS,
) -> BaseGeometry:
    """
    Transform geometry from one CRS to another.
    """

    try:
        source = CRS.from_user_input(source_crs)
        target = CRS.from_user_input(target_crs)

        transformer = Transformer.from_crs(
            source,
            target,
            always_xy=True,
        )

        transformed = transform(
            transformer.transform,
            geometry,
        )

    except Exception as exc:
        raise ValueError(
            f"Unable to transform geometry "
            f"from {source_crs} to {target_crs}"
        ) from exc

    return transformed