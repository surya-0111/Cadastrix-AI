from dataclasses import dataclass
from pathlib import Path

import geopandas as gpd


# ============================================================
# PROJECT PATHS
# ============================================================

PROJECT_ROOT = Path(__file__).resolve().parents[3]


@dataclass
class GISResult:
    """Result returned by the GIS processing pipeline."""

    parcel_output_path: str
    feature_output_path: str
    parcel_count: int
    source_crs: str


class GISClient:
    """
    GIS processing interface.

    Builds preliminary parcel candidates from extracted
    building and road features.
    """

    def __init__(
        self,
        output_dir: str | Path | None = None,
    ) -> None:

        if output_dir is None:
            output_dir = (
                PROJECT_ROOT
                / "backend"
                / "storage"
                / "gis"
            )

        self.output_dir = Path(output_dir)

        if not self.output_dir.is_absolute():
            self.output_dir = (
                PROJECT_ROOT / self.output_dir
            )

        self.output_dir.mkdir(
            parents=True,
            exist_ok=True,
        )

    def build_parcels(
        self,
        building_path: str | Path,
        road_path: str | Path,
    ) -> GISResult:

        building_file = Path(building_path)
        road_file = Path(road_path)

        if not building_file.exists():
            raise FileNotFoundError(
                f"Building output not found: {building_file}"
            )

        if not road_file.exists():
            raise FileNotFoundError(
                f"Road output not found: {road_file}"
            )

        buildings = gpd.read_file(building_file)

        if buildings.empty:
            raise ValueError(
                "No building features available "
                "for parcel reconstruction."
            )

        source_crs = (
            buildings.crs.to_string()
            if buildings.crs
            else "UNKNOWN"
        )

        # Ensure geometries are valid.
        buildings = buildings[
            buildings.geometry.notna()
        ].copy()

        buildings = buildings[
            ~buildings.geometry.is_empty
        ].copy()

        buildings["geometry"] = (
            buildings.geometry.buffer(0)
        )

        # ----------------------------------------------------
        # Preliminary parcel candidates
        # ----------------------------------------------------
        # NOTE:
        # This is NOT legal cadastral boundary reconstruction.
        # It creates a preliminary candidate around each
        # extracted building.
        # ----------------------------------------------------

        parcels = []

        for index, row in buildings.iterrows():

            geometry = row.geometry

            if geometry is None or geometry.is_empty:
                continue

            candidate = geometry.buffer(5)

            if candidate.is_empty:
                continue

            parcels.append(
                {
                    "parcel_code": (
                        f"P-{len(parcels) + 1:05d}"
                    ),
                    "feature_type": (
                        "PARCEL_CANDIDATE"
                    ),
                    "source_building": int(index),
                    "area_m2": float(candidate.area),
                    "perimeter_m": float(candidate.length),
                    "geometry": candidate,
                }
            )

        parcel_gdf = gpd.GeoDataFrame(
            parcels,
            geometry="geometry",
            crs=buildings.crs,
        )

        # Remove invalid/empty candidates.
        if not parcel_gdf.empty:

            parcel_gdf = parcel_gdf[
                parcel_gdf.geometry.notna()
            ]

            parcel_gdf = parcel_gdf[
                ~parcel_gdf.geometry.is_empty
            ]

            parcel_gdf["geometry"] = (
                parcel_gdf.geometry.buffer(0)
            )

        parcel_output = (
            self.output_dir / "parcels.geojson"
        )

        feature_output = (
            self.output_dir / "features.geojson"
        )

        if parcel_gdf.empty:

            parcel_gdf = gpd.GeoDataFrame(
                {
                    "parcel_code": [],
                    "feature_type": [],
                    "area_m2": [],
                    "perimeter_m": [],
                    "geometry": [],
                },
                geometry="geometry",
                crs=buildings.crs,
            )

        parcel_gdf.to_file(
            parcel_output,
            driver="GeoJSON",
        )

        # Preserve extracted buildings as GIS features.
        buildings.to_file(
            feature_output,
            driver="GeoJSON",
        )

        print("=" * 60)
        print("GIS PARCEL RECONSTRUCTION COMPLETE")
        print("BUILDINGS:", len(buildings))
        print(
            "PARCEL CANDIDATES:",
            len(parcel_gdf),
        )
        print("CRS:", source_crs)
        print(
            "PARCEL OUTPUT:",
            parcel_output,
        )
        print(
            "FEATURE OUTPUT:",
            feature_output,
        )
        print("=" * 60)

        return GISResult(
            parcel_output_path=str(
                parcel_output
            ),
            feature_output_path=str(
                feature_output
            ),
            parcel_count=len(parcel_gdf),
            source_crs=source_crs,
        )