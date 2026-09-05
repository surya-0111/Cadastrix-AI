from typing import Any

from geoalchemy2.shape import to_shape
from shapely.geometry import mapping


def postgis_to_geojson(geometry: Any) -> dict[str, Any]:
    """
    Convert a GeoAlchemy/PostGIS geometry value into GeoJSON.
    """

    shapely_geometry = to_shape(geometry)

    return mapping(shapely_geometry)