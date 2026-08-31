import json
from pathlib import Path
from typing import Any

from shapely.geometry import shape
from shapely.geometry.base import BaseGeometry


def load_geojson(
    file_path: str | Path,
) -> dict[str, Any]:
    """
    Load a GeoJSON file from disk.
    """

    path = Path(file_path)

    if not path.exists():
        raise ValueError(
            f"GeoJSON file does not exist: {path}"
        )

    try:
        with path.open(
            "r",
            encoding="utf-8",
        ) as file:
            data = json.load(file)
    except json.JSONDecodeError as exc:
        raise ValueError(
            f"Invalid GeoJSON JSON: {path.name}"
        ) from exc

    if data.get("type") != "FeatureCollection":
        raise ValueError(
            "GeoJSON must be a FeatureCollection"
        )

    if not isinstance(data.get("features"), list):
        raise ValueError(
            "GeoJSON FeatureCollection must contain a features array"
        )

    return data


def geojson_feature_to_geometry(
    feature: dict[str, Any],
) -> BaseGeometry:
    """
    Convert one GeoJSON feature into a Shapely geometry.
    """

    geometry = feature.get("geometry")

    if geometry is None:
        raise ValueError(
            "GeoJSON feature is missing geometry"
        )

    try:
        shapely_geometry = shape(geometry)
    except Exception as exc:
        raise ValueError(
            "Unable to convert GeoJSON geometry"
        ) from exc

    if shapely_geometry.is_empty:
        raise ValueError(
            "GeoJSON feature contains an empty geometry"
        )

    return shapely_geometry

def validate_geometry(
    geometry: BaseGeometry,
) -> None:
    """
    Validate a Shapely geometry before database insertion.
    """

    if geometry.is_empty:
        raise ValueError(
            "Geometry must not be empty"
        )

    if not geometry.is_valid:
        raise ValueError(
            "Geometry is not valid"
        )

def validate_geometry_type(
    geometry: BaseGeometry,
    allowed_types: set[str],
) -> None:
    """
    Validate that the geometry type is supported.
    """

    if geometry.geom_type not in allowed_types:
        allowed = ", ".join(sorted(allowed_types))

        raise ValueError(
            f"Unsupported geometry type "
            f"'{geometry.geom_type}'. "
            f"Allowed types: {allowed}"
        )