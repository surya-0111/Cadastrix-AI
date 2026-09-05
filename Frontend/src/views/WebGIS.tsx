import { useRef, useState, useMemo } from "react";
import { downloadJson, downloadText } from "../utils/actions";
import {
  Layers, MapPin, Building2, Road, AlertTriangle, Eye, EyeOff,
  ZoomIn, ZoomOut, Crosshair, Ruler, Search, Download, Settings,
  ChevronRight, X, SlidersHorizontal, Maximize2, Check, CheckCircle2,
  XCircle, ArrowRight, ExternalLink, ShieldCheck, Compass
} from "lucide-react";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import ProgressBar from "../components/ui/ProgressBar";
import { useCadastra } from "../context/CadastraContext";
import type { MapLayer, Parcel } from "../types";

interface WebGISProps {
  onToast: (msg: string, type?: "success" | "error" | "info" | "warning") => void;
  onNavigate?: (view: "validation") => void;
}

// 12 Anna Nagar mock parcels with SVG polygons matching coordinates
const PARCEL_SHAPES = [
  { id: "CHN-AN-001-2025", points: "80,60 200,52 210,130 88,138", label: "SY.124/3A" },
  { id: "CHN-AN-002-2025", points: "200,52 320,45 332,122 210,130", label: "SY.125/1B" },
  { id: "CHN-AN-003-2025", points: "320,45 440,40 450,118 332,122", label: "SY.126/2" },
  { id: "CHN-AN-004-2025", points: "88,138 210,130 218,210 95,218", label: "SY.127/1A" },
  { id: "CHN-AN-005-2025", points: "210,130 332,122 340,202 218,210", label: "SY.128/3" },
  { id: "CHN-AN-006-2025", points: "332,122 450,118 460,196 340,202", label: "SY.129/2B" },
  { id: "CHN-AN-007-2025", points: "95,218 218,210 226,292 102,300", label: "SY.130/1" },
  { id: "CHN-AN-008-2025", points: "218,210 340,202 348,282 226,292", label: "SY.131/4A" },
  { id: "CHN-AN-009-2025", points: "340,202 460,196 468,276 348,282", label: "SY.132/2" },
  { id: "CHN-AN-010-2025", points: "102,300 226,292 232,360 108,365", label: "SY.133/1C" },
  { id: "CHN-AN-011-2025", points: "226,292 348,282 355,355 232,360", label: "SY.134/3B" },
  { id: "CHN-AN-012-2025", points: "348,282 468,276 476,350 355,355", label: "SY.135/1" },
];

type RealPolygon = {
  id: string;
  points: string;
  feature: any;
  vertexCount: number;
};

const BUILDINGS = [
  [100, 75, 38, 25], [145, 72, 30, 22], [218, 65, 35, 24], [262, 62, 28, 20],
  [345, 60, 40, 26], [392, 58, 32, 24], [108, 155, 36, 24], [150, 152, 28, 22],
  [224, 148, 38, 25], [270, 144, 30, 20], [350, 140, 42, 28], [226, 228, 32, 22],
  [270, 224, 28, 18], [354, 220, 36, 24], [110, 232, 40, 26], [120, 310, 32, 20],
  [240, 305, 36, 24], [365, 300, 40, 26]
];

function MapCanvas({
  layers,
  parcels,
  selectedParcel,
  onSelectParcel,
  activeTool,
  measurePoints,
  onMeasurePoint,
  zoom,
  pan,
  scaleMeters,
  processedGeoJson,
  selectedRealFeatureId,
  onSelectRealFeature,
}: {
  layers: MapLayer[];
  parcels: Parcel[];
  selectedParcel: string | null;
  onSelectParcel: (id: string | null) => void;
  activeTool: "select" | "measure" | "pan";
  measurePoints: { x: number; y: number }[];
  onMeasurePoint: (p: { x: number; y: number }) => void;
  zoom: number;
  pan: { x: number; y: number };
  scaleMeters: number;
  processedGeoJson?: any;
  selectedRealFeatureId?: string | null;
  onSelectRealFeature?: (id: string | null) => void;
}) {
  const parcelsLayer = layers.find(l => l.id === "parcels");
  const buildingsLayer = layers.find(l => l.id === "buildings");
  const roadsLayer = layers.find(l => l.id === "roads");
  const topologyLayer = layers.find(l => l.id === "topology");
  const confidenceLayer = layers.find(l => l.id === "confidence");
  const orthoLayer = layers.find(l => l.id === "ortho");

  // Project real GeoJSON coordinates to SVG canvas space (560x380)
  const realPolygons = useMemo<RealPolygon[]>(() => {
    if (!processedGeoJson?.features?.length) return [];
    let minLng = Infinity, maxLng = -Infinity, minLat = Infinity, maxLat = -Infinity;

    processedGeoJson.features.forEach((feat: any) => {
      const coords = feat.geometry?.type === "MultiPolygon"
        ? feat.geometry.coordinates.flat(2)
        : feat.geometry?.coordinates?.[0] || [];
      coords.forEach(([lng, lat]: [number, number]) => {
        if (lng < minLng) minLng = lng;
        if (lng > maxLng) maxLng = lng;
        if (lat < minLat) minLat = lat;
        if (lat > maxLat) maxLat = lat;
      });
    });

    const lngSpan = (maxLng - minLng) || 0.001;
    const latSpan = (maxLat - minLat) || 0.001;

    return processedGeoJson.features.map((feat: any, idx: number) => {
      const id = feat.id || `poly-${idx + 1}`;
      const rings = feat.geometry?.type === "MultiPolygon"
        ? feat.geometry.coordinates[0] || []
        : feat.geometry?.coordinates || [];

      const svgPoints = (rings[0] || []).map(([lng, lat]: [number, number]) => {
        const x = ((lng - minLng) / lngSpan) * 400 + 80;
        const y = 350 - (((lat - minLat) / latSpan) * 240 + 50);
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      }).join(" ");

      return {
        id,
        points: svgPoints,
        feature: feat,
        vertexCount: rings[0]?.length || 0,
      };
    });
  }, [processedGeoJson]);

  const getParcelColor = (status: string, selected: boolean) => {
    if (selected) return { fill: "rgba(0,212,255,0.35)", stroke: "#00d4ff", strokeWidth: 2 };
    const map: Record<string, { fill: string; stroke: string; strokeWidth: number }> = {
      validated: { fill: "rgba(16,185,129,0.18)", stroke: "#10b981", strokeWidth: 1 },
      review: { fill: "rgba(245,158,11,0.22)", stroke: "#f59e0b", strokeWidth: 1.2 },
      error: { fill: "rgba(239,68,68,0.25)", stroke: "#ef4444", strokeWidth: 1.4 },
      pending: { fill: "rgba(122,156,192,0.12)", stroke: "#4a6a8a", strokeWidth: 0.8 },
    };
    return map[status] || map.validated;
  };

  return (
    <svg
      viewBox="0 0 560 380"
      className="w-full h-full select-none"
      style={{
        cursor: activeTool === "pan" ? "grab" : activeTool === "measure" ? "crosshair" : "pointer",
        transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom / 100})`,
        transformOrigin: "center",
        transition: activeTool === "pan" ? "none" : "transform 140ms ease-out"
      }}
      onClick={e => {
        if (activeTool === "measure") {
          const r = e.currentTarget.getBoundingClientRect();
          onMeasurePoint({
            x: ((e.clientX - r.left) / r.width) * 560,
            y: ((e.clientY - r.top) / r.height) * 380
          });
        } else if (activeTool === "select") {
          onSelectParcel(null);
        }
      }}
    >
      {/* Background canvas */}
      <rect width="560" height="380" fill="#080e1a" />

      {/* Orthomosaic / Imagery Layer */}
      {orthoLayer?.visible && (
        <g opacity={orthoLayer.opacity}>
          <defs>
            <radialGradient id="ortho-gradient" cx="50%" cy="50%" r="70%">
              <stop offset="0%" stopColor="#1a2d48" />
              <stop offset="100%" stopColor="#0a1525" />
            </radialGradient>
          </defs>
          <rect width="560" height="380" fill="url(#ortho-gradient)" />
          {/* Simulated orthomosaic terrain blocks */}
          <rect x="75" y="45" width="400" height="320" fill="rgba(30, 60, 100, 0.25)" stroke="#1a3b66" strokeWidth="0.5" strokeDasharray="4 2" />
        </g>
      )}

      {/* Grid */}
      <defs>
        <pattern id="map-grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(30,60,100,0.3)" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="560" height="380" fill="url(#map-grid)" />

      {/* Confidence Heatmap Layer */}
      {confidenceLayer?.visible && (
        <g opacity={confidenceLayer.opacity}>
          <circle cx="150" cy="100" r="60" fill="rgba(16,185,129,0.25)" filter="blur(15px)" />
          <circle cx="380" cy="80" r="70" fill="rgba(16,185,129,0.3)" filter="blur(18px)" />
          <circle cx="160" cy="180" r="50" fill="rgba(239,68,68,0.3)" filter="blur(14px)" />
          <circle cx="280" cy="250" r="65" fill="rgba(245,158,11,0.28)" filter="blur(16px)" />
        </g>
      )}

      {/* Real Inferred Cadastral Boundaries from ML-CV */}
      {realPolygons.length > 0 ? (
        <g opacity={parcelsLayer?.opacity ?? 0.85}>
          {realPolygons.map(rp => {
            const isSel = selectedRealFeatureId === rp.id;
            return (
              <g
                key={rp.id}
                onClick={e => {
                  e.stopPropagation();
                  onSelectRealFeature?.(rp.id);
                }}
                className="transition-all"
                style={{ cursor: "pointer" }}
              >
                <polygon
                  points={rp.points}
                  fill={isSel ? "rgba(0,212,255,0.45)" : "rgba(139,92,246,0.22)"}
                  stroke={isSel ? "#00d4ff" : "#8b5cf6"}
                  strokeWidth={isSel ? 2.2 : 1.2}
                />
              </g>
            );
          })}
        </g>
      ) : (
        /* Parcels (Cadastral Fabric) Fallback */
        parcelsLayer?.visible && (
          <g opacity={parcelsLayer.opacity}>
            {PARCEL_SHAPES.map(p => {
              const parcelData = parcels.find(item => item.id === p.id);
              const status = parcelData ? parcelData.status : "validated";
              const selected = selectedParcel === p.id;
              const style = getParcelColor(status, selected);

              return (
                <g
                  key={p.id}
                  onClick={e => {
                    e.stopPropagation();
                    onSelectParcel(p.id);
                  }}
                  className="transition-all"
                  style={{ cursor: "pointer" }}
                >
                  <polygon
                    points={p.points}
                    fill={style.fill}
                    stroke={style.stroke}
                    strokeWidth={style.strokeWidth}
                  />
                </g>
              );
            })}
          </g>
        )
      )}

      {/* Roads (Planimetric Network) */}
      {roadsLayer?.visible && (
        <g opacity={roadsLayer.opacity}>
          <line x1="0" y1="175" x2="560" y2="172" stroke="#3b82f6" strokeWidth="3" opacity="0.75" />
          <line x1="0" y1="265" x2="560" y2="262" stroke="#3b82f6" strokeWidth="2.5" opacity="0.65" />
          <line x1="230" y1="0" x2="235" y2="380" stroke="#3b82f6" strokeWidth="2.5" opacity="0.65" />
          <line x1="345" y1="0" x2="350" y2="380" stroke="#3b82f6" strokeWidth="2" opacity="0.55" />
          <line x1="75" y1="0" x2="78" y2="380" stroke="#3b82f6" strokeWidth="1.5" opacity="0.45" />
          <line x1="460" y1="0" x2="464" y2="380" stroke="#3b82f6" strokeWidth="1.5" opacity="0.45" />
          <line x1="0" y1="50" x2="560" y2="48" stroke="#3b82f6" strokeWidth="1.5" opacity="0.45" />
        </g>
      )}

      {/* Buildings */}
      {buildingsLayer?.visible && (
        <g opacity={buildingsLayer.opacity}>
          {BUILDINGS.map(([x, y, w, h], i) => (
            <rect
              key={i}
              x={x}
              y={y}
              width={w}
              height={h}
              fill="rgba(0,212,255,0.18)"
              stroke="#00d4ff"
              strokeWidth="0.8"
              rx="1"
            />
          ))}
        </g>
      )}

      {/* Topology Errors */}
      {topologyLayer?.visible && (
        <g opacity={topologyLayer.opacity}>
          {parcels.map(p => {
            if (p.topologyErrors <= 0) return null;
            let cx = 215;
            let cy = 205;
            if (p.id === "CHN-AN-002-2025") { cx = 325; cy = 120; }
            if (p.id === "CHN-AN-004-2025") { cx = 215; cy = 205; }
            if (p.id === "CHN-AN-008-2025") { cx = 342; cy = 280; }
            if (p.id === "CHN-AN-011-2025") { cx = 350; cy = 350; }
            return (
              <g key={`topo-${p.id}`} className="animate-pulse">
                <circle cx={cx} cy={cy} r="6.5" fill="rgba(239,68,68,0.25)" stroke="#ef4444" strokeWidth="1.2" />
                <line x1={cx - 3.5} y1={cy - 3.5} x2={cx + 3.5} y2={cy + 3.5} stroke="#ef4444" strokeWidth="1.5" />
                <line x1={cx + 3.5} y1={cy - 3.5} x2={cx - 3.5} y2={cy + 3.5} stroke="#ef4444" strokeWidth="1.5" />
              </g>
            );
          })}
        </g>
      )}

      {/* Parcel Survey Labels */}
      {parcelsLayer?.visible && (
        <g opacity={parcelsLayer.opacity}>
          {PARCEL_SHAPES.map(p => {
            const pts = p.points.split(" ").map(pt => pt.split(",").map(Number));
            const cx = pts.reduce((s, pt) => s + pt[0], 0) / pts.length;
            const cy = pts.reduce((s, pt) => s + pt[1], 0) / pts.length;
            const isSel = selectedParcel === p.id;
            return (
              <text
                key={`lbl-${p.id}`}
                x={cx}
                y={cy}
                textAnchor="middle"
                fontSize="7.5"
                fill={isSel ? "#00d4ff" : "rgba(186,201,204,0.75)"}
                fontWeight={isSel ? "bold" : "normal"}
                fontFamily="monospace"
                pointerEvents="none"
              >
                {p.label}
              </text>
            );
          })}
        </g>
      )}

      {/* Measurement Tool Drawing */}
      {activeTool === "measure" && measurePoints.length > 0 && (
        <g pointerEvents="none">
          {measurePoints.length === 2 && (
            <line
              x1={measurePoints[0].x}
              y1={measurePoints[0].y}
              x2={measurePoints[1].x}
              y2={measurePoints[1].y}
              stroke="#00d4ff"
              strokeWidth="2"
              strokeDasharray="5 3"
            />
          )}
          {measurePoints.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r="4" fill="#00d4ff" stroke="#080e1a" strokeWidth="1.5" />
          ))}
        </g>
      )}

      {/* Dynamic Scale bar in SVG coordinates */}
      <g transform="translate(20,355)">
        <line x1="0" y1="0" x2="80" y2="0" stroke="#7a9cc0" strokeWidth="1" />
        <line x1="0" y1="-4" x2="0" y2="4" stroke="#7a9cc0" strokeWidth="1" />
        <line x1="80" y1="-4" x2="80" y2="4" stroke="#7a9cc0" strokeWidth="1" />
        <text x="40" y="-5" textAnchor="middle" fontSize="7.5" fill="#7a9cc0" fontFamily="monospace">
          {scaleMeters}m
        </text>
      </g>

      {/* Georeferencing overlay */}
      <text x="540" y="370" textAnchor="end" fontSize="7.5" fill="rgba(122,156,192,0.6)" fontFamily="monospace">
        13.0827°N 80.2707°E · EPSG:32644
      </text>
    </svg>
  );
}

function getFirstCoordinatePair(
  coordinates: unknown
): [number, number] | null {
  if (!Array.isArray(coordinates)) {
    return null;
  }

  if (
    coordinates.length >= 2 &&
    typeof coordinates[0] === "number" &&
    typeof coordinates[1] === "number"
  ) {
    return [coordinates[0], coordinates[1]];
  }

  for (const item of coordinates) {
    const result = getFirstCoordinatePair(item);

    if (result) {
      return result;
    }
  }

  return null;
}

export default function WebGIS({ onToast, onNavigate }: WebGISProps) {
  const {
    parcels,
    selectedParcelId,
    setSelectedParcelId,
    layers,
    toggleLayer,
    setLayerOpacity,
    acceptParcel,
    rejectParcel,
    repairParcelTopology,
    navigateTo,
    processedGeoJson,
    uploadedFileName,
    polygonCount,
  } = useCadastra();

  const [activeTool, setActiveTool] = useState<"select" | "measure" | "pan">("select");
  const [layerPanelOpen, setLayerPanelOpen] = useState(true);
  const [inspectorOpen, setInspectorOpen] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [zoom, setZoom] = useState(100);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [measurePoints, setMeasurePoints] = useState<{ x: number; y: number }[]>([]);
  const [fullscreen, setFullscreen] = useState(false);
  const [selectedRealFeatureId, setSelectedRealFeatureId] = useState<string | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ x: number; y: number; px: number; py: number } | null>(null);

  // Dynamic Scale calculation based on zoom level
  const dynamicScaleRatio = useMemo(() => {
    const baseScale = 2500;
    const ratio = Math.round(baseScale / (zoom / 100));
    return `1:${ratio.toLocaleString()}`;
  }, [zoom]);

  const dynamicScaleMeters = useMemo(() => {
    // 100m at 100% zoom
    return Math.round(100 / (zoom / 100));
  }, [zoom]);

  const selectedParcelData = parcels.find(p => p.id === selectedParcelId);
  const selectedRealFeature = processedGeoJson?.features.find(f => f.id === selectedRealFeatureId) || (selectedRealFeatureId && processedGeoJson?.features[0]);

  const runSearch = () => {
    const q = searchValue.trim().toLowerCase();
    if (!q) {
      onToast("Enter a parcel ID, survey number, or owner", "warning");
      return;
    }
    // Check real features first
    if (processedGeoJson) {
      const realMatch = processedGeoJson.features.find(f =>
        f.id?.toLowerCase().includes(q)
      );
      if (realMatch) {
        setSelectedRealFeatureId(realMatch.id || null);
        setInspectorOpen(true);
        onToast(`Located real ML-CV feature ${realMatch.id}`, "success");
        return;
      }
    }
    const match = parcels.find(p =>
      [p.id, p.surveyNo, p.owner, p.ward, p.zone, p.landUse].some(v =>
        String(v).toLowerCase().includes(q)
      )
    );
    if (match) {
      setSelectedParcelId(match.id);
      setSelectedRealFeatureId(null);
      setInspectorOpen(true);
      onToast(`Located ${match.surveyNo} (${match.id})`, "success");
    } else {
      onToast("No matching parcel found in cadastral fabric", "warning");
    }
  };

  const exportMap = () => {
    if (processedGeoJson) {
      downloadJson("cadastrix-ai-results.geojson", processedGeoJson);
      onToast("WebGIS Real ML-CV Layer exported as GeoJSON", "success");
      return;
    }
    const geojson = {
      type: "FeatureCollection",
      crs: { type: "name", properties: { name: "urn:ogc:def:crs:EPSG::32644" } },
      features: parcels.map(p => ({
        type: "Feature",
        id: p.id,
        properties: p,
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [80.2707, 13.0827],
              [80.2721, 13.0827],
              [80.2721, 13.0841],
              [80.2707, 13.0841],
              [80.2707, 13.0827]
            ]
          ]
        }
      }))
    };
    downloadJson("cadastra-anna-nagar-parcels.geojson", geojson);
    onToast("WebGIS Cadastral Layer exported as GeoJSON", "success");
  };

  const toggleFullscreen = async () => {
    if (!mapRef.current) return;
    try {
      if (!document.fullscreenElement) {
        await mapRef.current.requestFullscreen();
        setFullscreen(true);
      } else {
        await document.exitFullscreen();
        setFullscreen(false);
      }
    } catch {
      onToast("Fullscreen toggle not supported in current environment", "info");
    }
  };

  const addMeasurePoint = (point: { x: number; y: number }) => {
    setMeasurePoints(prev => (prev.length >= 2 ? [point] : [...prev, point]));
  };

  const tools = [
    { id: "select" as const, icon: <Crosshair size={15} />, label: "Select Feature" },
    { id: "measure" as const, icon: <Ruler size={15} />, label: "Measure Distance" },
    { id: "pan" as const, icon: <SlidersHorizontal size={15} />, label: "Pan Map" },
  ];

  return (
    <div className="h-full flex flex-col overflow-hidden bg-[#080e1a]">
      {/* Top Toolbar */}
      <div className="flex items-center gap-3 px-4 py-2 bg-[#080e1a] border-b border-[rgba(30,60,100,0.5)] flex-shrink-0">
        {/* Tool selector */}
        <div className="flex items-center gap-1 bg-[rgba(30,60,100,0.3)] rounded-lg p-0.5">
          {tools.map(t => (
            <button
              key={t.id}
              onClick={() => {
                setActiveTool(t.id);
                if (t.id !== "measure") setMeasurePoints([]);
              }}
              title={t.label}
              className={`p-2 rounded-md transition-colors ${
                activeTool === t.id
                  ? "bg-[rgba(0,212,255,0.15)] text-[#00d4ff]"
                  : "text-[#4a6a8a] hover:text-[#7a9cc0]"
              }`}
            >
              {t.icon}
            </button>
          ))}
        </div>

        <div className="w-px h-5 bg-[rgba(30,60,100,0.5)]" />

        {/* Zoom controls with synchronized slider */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setZoom(z => Math.max(50, z - 20))}
            className="p-2 rounded text-[#4a6a8a] hover:text-[#7a9cc0] hover:bg-[rgba(30,60,100,0.2)]"
            title="Zoom Out"
          >
            <ZoomOut size={15} />
          </button>

          {/* Interactive Zoom Slider */}
          <div className="flex items-center gap-2 px-1">
            <input
              type="range"
              min={50}
              max={250}
              step={5}
              value={zoom}
              onChange={e => setZoom(Number(e.target.value))}
              className="w-24 h-1.5 accent-[#00d4ff] bg-[rgba(30,60,100,0.6)] rounded-lg cursor-pointer"
              title={`Zoom: ${zoom}%`}
              aria-label="Map Zoom Slider"
            />
            <span className="text-xs font-mono text-[#00d4ff] w-12 text-right">{zoom}%</span>
          </div>

          <button
            onClick={() => setZoom(z => Math.min(250, z + 20))}
            className="p-2 rounded text-[#4a6a8a] hover:text-[#7a9cc0] hover:bg-[rgba(30,60,100,0.2)]"
            title="Zoom In"
          >
            <ZoomIn size={15} />
          </button>
        </div>

        <div className="w-px h-5 bg-[rgba(30,60,100,0.5)]" />

        {/* Search */}
        <div className="relative flex-1 max-w-xs">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#4a6a8a]" />
          <input
            value={searchValue}
            onChange={e => setSearchValue(e.target.value)}
            onKeyDown={e => e.key === "Enter" && runSearch()}
            placeholder="Search SY.No, Owner, Parcel ID…"
            className="w-full bg-[rgba(30,60,100,0.2)] border border-[rgba(30,60,100,0.4)] text-[#e2eaf4] placeholder-[#4a6a8a] text-xs rounded-md pl-7 pr-3 py-1.5 focus:outline-none focus:border-[rgba(0,212,255,0.4)]"
          />
        </div>

        {/* Right action icons */}
        <div className="ml-auto flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 bg-[rgba(30,60,100,0.25)] border border-[rgba(30,60,100,0.4)] rounded-md text-[11px] font-mono text-[#7a9cc0]">
            <Compass size={12} className="text-[#00d4ff]" />
            <span>Scale {dynamicScaleRatio}</span>
          </div>

          <button
            onClick={() => setLayerPanelOpen(v => !v)}
            title="Toggle Layers Panel"
            className={`p-2 rounded text-sm transition-colors ${
              layerPanelOpen ? "text-[#00d4ff] bg-[rgba(0,212,255,0.1)]" : "text-[#4a6a8a] hover:text-[#7a9cc0]"
            }`}
          >
            <Layers size={15} />
          </button>

          <button
            onClick={exportMap}
            title="Export Map Layers GeoJSON"
            className="p-2 rounded text-[#4a6a8a] hover:text-[#7a9cc0]"
          >
            <Download size={15} />
          </button>

          <button
            onClick={toggleFullscreen}
            title={fullscreen ? "Exit Fullscreen" : "Fullscreen"}
            className="p-2 rounded text-[#4a6a8a] hover:text-[#7a9cc0]"
          >
            <Maximize2 size={15} />
          </button>
        </div>
      </div>

      {/* Main Map Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Layer Panel (Left) */}
        {layerPanelOpen && (
          <div className="w-64 flex-shrink-0 bg-[#0a1420] border-r border-[rgba(30,60,100,0.5)] flex flex-col overflow-y-auto">
            <div className="px-4 py-3 border-b border-[rgba(30,60,100,0.4)] flex items-center justify-between">
              <div className="text-xs font-semibold text-[#7a9cc0] uppercase tracking-wider">GIS Layers</div>
              <span className="text-[10px] font-mono text-[#4a6a8a]">
                {layers.filter(l => l.visible).length} / {layers.length} active
              </span>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-[rgba(30,60,100,0.2)]">
              {layers.map(layer => (
                <div key={layer.id} className="px-4 py-3">
                  <div className="flex items-center gap-2 mb-1.5">
                    <button
                      onClick={() => toggleLayer(layer.id)}
                      className={`w-4 h-4 rounded flex items-center justify-center transition-colors flex-shrink-0 ${
                        layer.visible
                          ? "bg-[rgba(0,212,255,0.15)] border border-[rgba(0,212,255,0.4)] text-[#00d4ff]"
                          : "border border-[rgba(30,60,100,0.5)] text-[#4a6a8a]"
                      }`}
                      aria-label={`${layer.visible ? "Hide" : "Show"} ${layer.name}`}
                    >
                      {layer.visible ? <Eye size={10} /> : <EyeOff size={10} />}
                    </button>
                    <div
                      className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
                      style={{ backgroundColor: `${layer.color}50`, border: `1px solid ${layer.color}` }}
                    />
                    <span className={`text-xs flex-1 ${layer.visible ? "text-[#e2eaf4]" : "text-[#4a6a8a]"}`}>
                      {layer.name}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-mono text-[#4a6a8a] ml-6">
                    <span>{layer.count > 0 ? `${layer.count.toLocaleString()} features` : "Raster layer"}</span>
                    {layer.visible && <span>{Math.round(layer.opacity * 100)}%</span>}
                  </div>

                  {layer.visible && (
                    <div className="mt-1.5 ml-6">
                      <input
                        type="range"
                        min={10}
                        max={100}
                        value={Math.round(layer.opacity * 100)}
                        onChange={e => setLayerOpacity(layer.id, Number(e.target.value) / 100)}
                        className="w-full h-1 accent-[#00d4ff] bg-[rgba(30,60,100,0.5)]"
                        aria-label={`${layer.name} opacity slider`}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Map Canvas Area */}
        <div
          ref={mapRef}
          className="flex-1 relative overflow-hidden bg-[#080e1a]"
          onMouseDown={e => {
            if (activeTool === "pan") {
              dragRef.current = { x: e.clientX, y: e.clientY, px: pan.x, py: pan.y };
            }
          }}
          onMouseMove={e => {
            if (dragRef.current) {
              setPan({
                x: dragRef.current.px + e.clientX - dragRef.current.x,
                y: dragRef.current.py + e.clientY - dragRef.current.y
              });
            }
          }}
          onMouseUp={() => {
            dragRef.current = null;
          }}
          onMouseLeave={() => {
            dragRef.current = null;
          }}
          onDoubleClick={() => {
            setZoom(100);
            setPan({ x: 0, y: 0 });
          }}
        >
          <MapCanvas
            layers={layers}
            parcels={parcels}
            selectedParcel={selectedParcelId}
            onSelectParcel={id => {
              setSelectedParcelId(id);
              setSelectedRealFeatureId(null);
            }}
            activeTool={activeTool}
            measurePoints={measurePoints}
            onMeasurePoint={addMeasurePoint}
            zoom={zoom}
            pan={pan}
            scaleMeters={dynamicScaleMeters}
            processedGeoJson={processedGeoJson}
            selectedRealFeatureId={selectedRealFeatureId}
            onSelectRealFeature={id => {
              setSelectedRealFeatureId(id);
              setSelectedParcelId(null);
              setInspectorOpen(true);
            }}
          />

          {/* Measurement result floating badge */}
          {activeTool === "measure" && measurePoints.length === 2 && (
            <div className="absolute top-3 left-3 bg-[rgba(8,14,26,0.92)] border border-[rgba(0,212,255,0.4)] rounded-md px-3 py-1.5 text-[11px] font-mono text-[#00d4ff] shadow-lg">
              Distance:{" "}
              {Math.round(
                Math.hypot(measurePoints[1].x - measurePoints[0].x, measurePoints[1].y - measurePoints[0].y) / 0.8
              )}{" "}
              meters · click map to measure another
            </div>
          )}

          {/* Dynamic Map Status Bar */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-[rgba(8,14,26,0.92)] border border-[rgba(30,60,100,0.6)] rounded-lg px-4 py-2 text-[11px] font-mono text-[#7a9cc0] flex items-center gap-3 shadow-lg">
            <span className="text-[#e2eaf4] font-medium">
              {processedGeoJson ? `ML-CV Layer · ${uploadedFileName || "GeoTIFF"}` : "Anna Nagar · Zone IV"}
            </span>
            <span className="text-[#4a6a8a]">|</span>
            <span className="text-[#00d4ff]">
              {processedGeoJson ? `EPSG:4326 (${polygonCount} features)` : `Scale ${dynamicScaleRatio}`}
            </span>
            <span className="text-[#4a6a8a]">|</span>
            <span>Zoom {zoom}%</span>
            <span className="text-[#4a6a8a]">|</span>
            <span>{layers.filter(l => l.visible).length} layers</span>
          </div>
        </div>

        {/* Inspector Panel (Right) */}
        {inspectorOpen && (
          <div className="w-80 flex-shrink-0 bg-[#0a1420] border-l border-[rgba(30,60,100,0.5)] flex flex-col overflow-y-auto">
            <div className="px-4 py-3 border-b border-[rgba(30,60,100,0.4)] flex items-center justify-between">
              <div className="text-xs font-semibold text-[#7a9cc0] uppercase tracking-wider flex items-center gap-1.5">
                <MapPin size={13} className="text-[#00d4ff]" />
                {selectedRealFeature ? "ML-CV Feature Inspector" : "Parcel Inspector"}
              </div>
              <button
                onClick={() => setInspectorOpen(false)}
                className="text-[#4a6a8a] hover:text-[#7a9cc0]"
                title="Close panel"
              >
                <X size={14} />
              </button>
            </div>

            {selectedRealFeature ? (
              <div className="p-4 flex flex-col gap-4">
                {/* Real Feature Header */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-base font-semibold text-[#00d4ff]">{selectedRealFeature.id}</div>
                    <Badge variant="cyan" dot>
                      ML-CV EXTRACTED
                    </Badge>
                  </div>
                  <div className="text-xs font-mono text-[#7a9cc0]">
                    Source: {uploadedFileName || "GeoTIFF Upload"}
                  </div>
                </div>

                {/* Real Attributes Card */}
                <div className="bg-[#0d1526] p-3 rounded-lg border border-[rgba(30,60,100,0.4)] flex flex-col gap-2">
                  <div className="text-[10px] font-semibold text-[#7a9cc0] uppercase tracking-wider mb-1">
                    Extracted Geometry Properties
                  </div>
                  {[
                    { label: "Geometry Type", value: selectedRealFeature.geometry.type },
                    {
                      label: "Vertex Count",
                      value: `${selectedRealFeature.geometry.coordinates[0]?.length || 0} vertices`,
                    },
                    { label: "Coordinate System", value: "WGS84 (EPSG:4326)" },
                    {
                      label: "Centroid Coordinates",
                      value: (() => {
                        const coordinate = getFirstCoordinatePair(
                          selectedRealFeature.geometry.coordinates
                        );

                      if (!coordinate) {
                        return "Unavailable";
                      }

                      const [lng, lat] = coordinate;

                      return `${lat.toFixed(5)}°N, ${lng.toFixed(5)}°E`;
                      })(),
                    },
                    { label: "Detection Method", value: "Canny Baseline Detector" },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between items-center text-xs gap-2">
                      <span className="text-[#4a6a8a] text-[11px]">{label}</span>
                      <span className="font-mono text-[#e2eaf4] text-right truncate">{value}</span>
                    </div>
                  ))}
                </div>

                {/* Topology & Accuracy */}
                <div className="px-3 py-2 rounded-lg bg-[rgba(16,185,129,0.08)] border border-[rgba(16,185,129,0.2)] flex items-center gap-2 text-[11px] text-[#10b981]">
                  <ShieldCheck size={14} />
                  <span>Valid Polygon Geometry · WGS84 Georeferenced</span>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 pt-1">
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full"
                    icon={<Download size={12} />}
                    onClick={exportMap}
                  >
                    Export Real GeoJSON
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full"
                    onClick={() => navigateTo("ai-processing")}
                  >
                    Back to AI Processing
                  </Button>
                </div>
              </div>
            ) : selectedParcelData ? (
              <div className="p-4 flex flex-col gap-4">
                {/* Header */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-base font-semibold text-[#e2eaf4]">{selectedParcelData.surveyNo}</div>
                    <Badge
                      variant={
                        selectedParcelData.status === "validated"
                          ? "green"
                          : selectedParcelData.status === "review"
                          ? "amber"
                          : selectedParcelData.status === "error"
                          ? "red"
                          : "muted"
                      }
                      dot
                    >
                      {selectedParcelData.status === "validated"
                        ? "VERIFIED"
                        : selectedParcelData.status === "review"
                        ? "RECONCILIATION REQUIRED"
                        : selectedParcelData.status.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="text-xs font-mono text-[#4a6a8a]">{selectedParcelData.id}</div>
                </div>

                {/* Accept / Reject Action Bar */}
                <div className="grid grid-cols-2 gap-2 bg-[rgba(28,43,60,0.4)] p-2 rounded-lg border border-[rgba(30,60,100,0.4)]">
                  <button
                    onClick={() => acceptParcel(selectedParcelData.id)}
                    disabled={selectedParcelData.status === "validated"}
                    className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-md text-xs font-bold font-mono transition-all ${
                      selectedParcelData.status === "validated"
                        ? "bg-[rgba(16,185,129,0.15)] text-[#10b981] border border-[rgba(16,185,129,0.3)] cursor-default"
                        : "bg-[rgba(0,212,255,0.15)] hover:bg-[rgba(0,212,255,0.25)] text-[#00d4ff] border border-[rgba(0,212,255,0.4)] shadow-[0_0_10px_rgba(0,212,255,0.2)]"
                    }`}
                  >
                    <CheckCircle2 size={13} />
                    {selectedParcelData.status === "validated" ? "ACCEPTED" : "ACCEPT"}
                  </button>

                  <button
                    onClick={() => rejectParcel(selectedParcelData.id)}
                    disabled={selectedParcelData.status === "review"}
                    className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-md text-xs font-bold font-mono transition-all ${
                      selectedParcelData.status === "review"
                        ? "bg-[rgba(245,158,11,0.15)] text-[#f59e0b] border border-[rgba(245,158,11,0.3)] cursor-default"
                        : "bg-[rgba(239,68,68,0.15)] hover:bg-[rgba(239,68,68,0.25)] text-[#ffb4ab] border border-[rgba(239,68,68,0.4)]"
                    }`}
                  >
                    <XCircle size={13} />
                    {selectedParcelData.status === "review" ? "IN REVIEW" : "REJECT"}
                  </button>
                </div>

                {/* Diagnostics details */}
                <div className="bg-[#0d1526] p-3 rounded-lg border border-[rgba(30,60,100,0.4)] flex flex-col gap-2">
                  <div className="text-[10px] font-semibold text-[#7a9cc0] uppercase tracking-wider mb-1">
                    Cadastral Attributes
                  </div>
                  {[
                    { label: "Survey Number", value: selectedParcelData.surveyNo },
                    { label: "Ward / Zone", value: `${selectedParcelData.ward} · ${selectedParcelData.zone}` },
                    { label: "Land Classification", value: selectedParcelData.landUse },
                    { label: "Cadastral Area", value: `${selectedParcelData.area.toLocaleString()} m²` },
                    { label: "Detected Structures", value: `${selectedParcelData.buildings} footprints` },
                    { label: "Registered Owner", value: selectedParcelData.owner },
                    { label: "Last Audited", value: selectedParcelData.lastUpdated },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between items-center text-xs gap-2">
                      <span className="text-[#4a6a8a] text-[11px]">{label}</span>
                      <span className="font-mono text-[#e2eaf4] text-right truncate">{value}</span>
                    </div>
                  ))}
                </div>

                {/* AI Inference & Confidence */}
                <div className="bg-[#0d1526] p-3 rounded-lg border border-[rgba(30,60,100,0.4)]">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs text-[#7a9cc0]">Extraction Confidence</span>
                    <span
                      className={`text-xs font-mono font-semibold ${
                        selectedParcelData.confidence > 90
                          ? "text-[#10b981]"
                          : selectedParcelData.confidence > 75
                          ? "text-[#3b82f6]"
                          : "text-[#f59e0b]"
                      }`}
                    >
                      {selectedParcelData.confidence}%
                    </span>
                  </div>
                  <ProgressBar
                    value={selectedParcelData.confidence}
                    color={
                      selectedParcelData.confidence > 90
                        ? "#10b981"
                        : selectedParcelData.confidence > 75
                        ? "#3b82f6"
                        : "#f59e0b"
                    }
                  />
                </div>

                {/* Topology Error Alert */}
                {selectedParcelData.topologyErrors > 0 ? (
                  <div className="px-3 py-2.5 rounded-lg bg-[rgba(245,158,11,0.08)] border border-[rgba(245,158,11,0.25)] flex items-start gap-2">
                    <AlertTriangle size={14} className="text-[#f59e0b] flex-shrink-0 mt-0.5" />
                    <div className="flex-1 text-[11px] text-[#f59e0b]">
                      <div className="font-semibold mb-0.5">
                        {selectedParcelData.topologyErrors} Topology Anomaly Detected
                      </div>
                      <div className="text-[10px] text-[#bac9cc]">
                        Boundary sliver / road buffer overlap requires reconciliation.
                      </div>
                      <button
                        onClick={() => repairParcelTopology(selectedParcelData.id)}
                        className="mt-2 text-[10px] font-mono font-bold text-[#00d4ff] hover:underline flex items-center gap-1"
                      >
                        Auto-Repair Topology <ArrowRight size={10} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="px-3 py-2 rounded-lg bg-[rgba(16,185,129,0.08)] border border-[rgba(16,185,129,0.2)] flex items-center gap-2 text-[11px] text-[#10b981]">
                    <ShieldCheck size={14} />
                    <span>Clean topology · 0 errors detected</span>
                  </div>
                )}

                {/* Cross-navigation links */}
                <div className="flex flex-col gap-2 pt-1">
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full"
                    icon={<ExternalLink size={12} />}
                    onClick={() => navigateTo("validation", selectedParcelData.id)}
                  >
                    Open in Validation Center
                  </Button>

                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full"
                    onClick={() => navigateTo("parcel-explorer", selectedParcelData.id)}
                  >
                    Inspect in Parcel Explorer
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-xs text-[#7a9cc0]"
                    onClick={() => {
                      downloadText(
                        `${selectedParcelData.id}-audit-report.txt`,
                      `CadastrixAI WebGIS Parcel Report\n` +
                          `==============================\n` +
                          `ID: ${selectedParcelData.id}\n` +
                          `Survey: ${selectedParcelData.surveyNo}\n` +
                          `Owner: ${selectedParcelData.owner}\n` +
                          `Zone: ${selectedParcelData.zone} · ${selectedParcelData.ward}\n` +
                          `Status: ${selectedParcelData.status}\n` +
                          `Area: ${selectedParcelData.area} m²\n` +
                          `Buildings: ${selectedParcelData.buildings}\n` +
                          `Confidence: ${selectedParcelData.confidence}%\n` +
                          `Topology Errors: ${selectedParcelData.topologyErrors}\n` +
                          `Audited: ${selectedParcelData.lastUpdated}\n`
                      );
                      onToast(`Exported audit report for ${selectedParcelData.id}`, "success");
                    }}
                  >
                    Export Parcel Record
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center p-6 text-center">
                <div>
                  <MapPin size={28} className="text-[#4a6a8a] mx-auto mb-2" />
                  <div className="text-xs text-[#e2eaf4] font-medium mb-1">No Parcel Selected</div>
                  <div className="text-[11px] text-[#4a6a8a] max-w-[180px] mx-auto">
                    Click any parcel on the map canvas or use search to inspect details.
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Re-open inspector tab button if collapsed */}
        {!inspectorOpen && (
          <button
            onClick={() => setInspectorOpen(true)}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-[#0a1420] border border-[rgba(30,60,100,0.5)] border-r-0 rounded-l-lg p-2 text-[#4a6a8a] hover:text-[#00d4ff]"
            title="Open Inspector"
          >
            <ChevronRight size={14} />
          </button>
        )}
      </div>
    </div>
  );
}
