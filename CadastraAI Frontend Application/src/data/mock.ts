export const PROJECT = {
  id: "PRJ-2024-CHN-001",
  name: "Urban Survey – Chennai",
  region: "Tamil Nadu, India",
  status: "processing" as const,
  description: "Autonomous cadastral feature extraction and topological reconciliation from georeferenced orthomosaics.",
  crs: "EPSG:3857",
  area: "18.42 km²",
  resolution: "5cm/pixel",
  sourceType: "Orthorectified GeoTIFF",
  createdAt: "2024-08-12",
  updatedAt: "2024-08-31",
  featureInventory: 127,
  validatedFeatures: 121,
  topologicalRepairs: 4,
  manualVerification: 2,
  buildings: 1284,
  roadSegments: 842,
  confidence: 92.8,
  processingDuration: "08:42",
};

export const PIPELINE_STEPS = [
  { id: "upload", label: "Upload", status: "done" as const },
  { id: "preprocess", label: "Preprocess", status: "done" as const },
  { id: "building", label: "Building Detection", status: "done" as const },
  { id: "road", label: "Road Detection", status: "done" as const },
  { id: "parcel", label: "Parcel Recon", status: "active" as const, progress: 42 },
  { id: "topology", label: "Topology Validation", status: "pending" as const },
  { id: "review", label: "Human Review", status: "pending" as const },
  { id: "export", label: "Export", status: "pending" as const },
];

export const ACTIVITY = [
  { time: "09:14:22", type: "info", message: "Tile sector Alpha-9 geometry serialized: 34 features." },
  { time: "09:14:18", type: "info", message: "Tile sector Alpha-8 geometry serialized: 12 features." },
  { time: "09:13:55", type: "warn", message: "Confidence threshold violation [0.62 < 0.85] on Cluster A." },
  { time: "09:13:41", type: "info", message: "Applying Douglas-Peucker simplification (tolerance: 0.5m)…" },
  { time: "09:13:09", type: "info", message: "Tile sector Alpha-7: 45 feature geometries serialized." },
  { time: "09:12:31", type: "system", message: "Initiating topological reconciliation: resolving self-intersections…" },
  { time: "09:11:57", type: "info", message: "Road extraction complete: 842 linear segments vectorized." },
  { time: "09:09:33", type: "info", message: "Building footprints: 4,281 planimetric polygons via ResNet-50-UNet." },
  { time: "09:05:10", type: "system", message: "Spatial tessellation: 168 discrete extents generated." },
  { time: "09:00:00", type: "system", message: "TELEMETRY: Initializing compute node GPU-03 [CUDA 12.1]…" },
];

export const AI_PIPELINE_STEPS = [
  {
    id: "preprocess",
    label: "Image Preprocessing",
    status: "done" as const,
    description: "Radiometric normalisation and atmospheric correction sequence complete.",
  },
  {
    id: "tiling",
    label: "Tiling",
    status: "done" as const,
    description: "Spatial tessellation: 168 discrete processing extents generated.",
  },
  {
    id: "building",
    label: "Building Extraction",
    status: "done" as const,
    description: "Geospatial inference: 4,281 planimetric footprints identified via ResNet-50-U-Net.",
  },
  {
    id: "road",
    label: "Road Extraction",
    status: "done" as const,
    description: "Linear feature vectorisation and graph-theory topology generation complete.",
  },
  {
    id: "postprocess",
    label: "Feature Post-processing",
    status: "active" as const,
    description: "Douglas-Peucker simplification and topological reconciliation in progress.",
    progress: 72,
  },
  {
    id: "parcel",
    label: "Parcel Reconstruction",
    status: "pending" as const,
    description: "Cadastral division of boundary geometry and land-use inference.",
  },
];

export const PROCESS_LOG = [
  { type: "telemetry", text: "Initializing compute node GPU-03 [CUDA 12.1]..." },
  { type: "telemetry", text: "Loading weights: model_v4.2_urban_segmentation.pt" },
  { type: "system", text: "VRAM Allocation: 12.4GB / 24GB [OK]" },
  { type: "telemetry", text: "Executing inference pipeline on Sector 4..." },
  { type: "info", text: "CRS Transformation: EPSG:4326 (WGS84) → EPSG:3857 (Web Mercator)" },
  { type: "telemetry", text: "Tile 121: 34 feature geometries serialized." },
  { type: "telemetry", text: "Tile 122: 12 feature geometries serialized." },
  { type: "info", text: "> Applying Douglas-Peucker simplification (tolerance: 0.5m)..." },
  { type: "telemetry", text: "Tile 123: 45 feature geometries serialized." },
  { type: "warn", text: "[WARNING] Tile 124: Confidence threshold violation [0.62 < 0.85] on Cluster A." },
  { type: "info", text: "> Initiating topological reconciliation: resolving self-intersections..." },
];

export type Parcel = {
  id: string;
  area: number;
  landType: "Residential" | "Commercial" | "Agricultural" | "Industrial" | "Mixed-Use";
  buildings: number;
  confidence: number;
  geometryStatus: "valid" | "review" | "repaired";
  status: "VERIFIED" | "RECONCILIATION REQUIRED" | "REPAIRED" | "PENDING";
  lat: number;
  lng: number;
};

export const PARCELS: Parcel[] = [
  { id: "P017", area: 1245.5, landType: "Residential", buildings: 2, confidence: 93, geometryStatus: "valid", status: "VERIFIED", lat: 13.0827, lng: 80.2707 },
  { id: "P018", area: 890.0, landType: "Commercial", buildings: 1, confidence: 61, geometryStatus: "review", status: "RECONCILIATION REQUIRED", lat: 13.0831, lng: 80.2712 },
  { id: "P019", area: 2100.2, landType: "Agricultural", buildings: 0, confidence: 88, geometryStatus: "repaired", status: "REPAIRED", lat: 13.0840, lng: 80.2695 },
  { id: "P020", area: 450.8, landType: "Residential", buildings: 1, confidence: 98, geometryStatus: "valid", status: "VERIFIED", lat: 13.0819, lng: 80.2720 },
  { id: "P021", area: 15400.0, landType: "Industrial", buildings: 4, confidence: 91, geometryStatus: "valid", status: "VERIFIED", lat: 13.0855, lng: 80.2680 },
  { id: "P022", area: 3210.6, landType: "Mixed-Use", buildings: 6, confidence: 79, geometryStatus: "valid", status: "VERIFIED", lat: 13.0810, lng: 80.2730 },
  { id: "P023", area: 670.3, landType: "Residential", buildings: 1, confidence: 95, geometryStatus: "valid", status: "VERIFIED", lat: 13.0845, lng: 80.2705 },
  { id: "P024", area: 1890.0, landType: "Commercial", buildings: 3, confidence: 72, geometryStatus: "review", status: "RECONCILIATION REQUIRED", lat: 13.0862, lng: 80.2715 },
  { id: "P025", area: 5600.4, landType: "Agricultural", buildings: 0, confidence: 84, geometryStatus: "repaired", status: "REPAIRED", lat: 13.0798, lng: 80.2688 },
  { id: "P026", area: 920.1, landType: "Residential", buildings: 2, confidence: 96, geometryStatus: "valid", status: "VERIFIED", lat: 13.0822, lng: 80.2698 },
  { id: "P027", area: 340.0, landType: "Residential", buildings: 1, confidence: 89, geometryStatus: "valid", status: "VERIFIED", lat: 13.0835, lng: 80.2725 },
  { id: "P028", area: 7800.5, landType: "Industrial", buildings: 8, confidence: 94, geometryStatus: "valid", status: "VERIFIED", lat: 13.0870, lng: 80.2670 },
];

export const MAP_LAYERS = [
  { id: "imagery", label: "Multispectral Imagery", color: "#60a5fa", visible: true },
  { id: "cadastral", label: "Cadastral Fabric", color: "#22d3ee", visible: true },
  { id: "planimetric", label: "Planimetric Features", color: "#60a5fa", visible: true },
  { id: "roads", label: "Roads", color: "#94a3b8", visible: false },
  { id: "confidence", label: "Confidence Heatmap", color: "#f472b6", visible: false },
  { id: "topology", label: "Invalid Topology", color: "#f87171", visible: false },
];

export const GIS_TILES = Array.from({ length: 168 }, (_, i) => ({
  id: `T${String(i + 1).padStart(3, "0")}`,
  col: i % 14,
  row: Math.floor(i / 14),
  processed: i < 124,
  active: i === 41,
}));
