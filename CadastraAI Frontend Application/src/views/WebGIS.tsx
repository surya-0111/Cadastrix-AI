import { useState, useCallback } from "react";
import { MousePointer2, Hand, ZoomIn, ZoomOut, Maximize2, Minus, Plus, Grid3x3, Layers, SlidersHorizontal, X, AlertTriangle, Check, GitMerge, PenLine, XCircle } from "lucide-react";
import { MAP_LAYERS, PARCELS, type Parcel } from "../data/mock";

type Tool = "select" | "pan" | "zoomin" | "zoomout" | "measure";

// Deterministic parcel geometry for SVG map
const PARCEL_RECTS = [
  { id: "P017", x: 160, y: 100, w: 80, h: 55, fill: "review" },
  { id: "P018", x: 265, y: 85, w: 60, h: 70, fill: "normal" },
  { id: "P019", x: 340, y: 110, w: 90, h: 45, fill: "normal" },
  { id: "P020", x: 155, y: 170, w: 55, h: 65, fill: "normal" },
  { id: "P021", x: 225, y: 175, w: 75, h: 60, fill: "normal" },
  { id: "P022", x: 310, y: 165, w: 65, h: 55, fill: "normal" },
  { id: "P023", x: 390, y: 155, w: 50, h: 65, fill: "normal" },
  { id: "P024", x: 150, y: 250, w: 70, h: 60, fill: "normal" },
  { id: "P025", x: 235, y: 245, w: 80, h: 65, fill: "normal" },
  { id: "P026", x: 330, y: 235, w: 55, h: 70, fill: "normal" },
  { id: "P027", x: 400, y: 230, w: 45, h: 55, fill: "normal" },
  { id: "P028", x: 145, y: 330, w: 100, h: 50, fill: "normal" },
];

const ROAD_PATHS = [
  "M 100 140 L 460 140",
  "M 100 220 L 460 220",
  "M 100 310 L 460 310",
  "M 210 60 L 210 400",
  "M 320 60 L 320 400",
  "M 440 60 L 440 400",
];

const BUILDING_RECTS = [
  { x: 168, y: 108, w: 28, h: 20 },
  { x: 205, y: 108, w: 22, h: 20 },
  { x: 273, y: 95, w: 25, h: 22 },
  { x: 350, y: 118, w: 30, h: 18 },
  { x: 163, y: 180, w: 24, h: 22 },
  { x: 233, y: 183, w: 30, h: 25 },
  { x: 278, y: 183, w: 25, h: 25 },
  { x: 318, y: 173, w: 26, h: 22 },
  { x: 398, y: 163, w: 22, h: 28 },
  { x: 158, y: 258, w: 28, h: 22 },
  { x: 243, y: 253, w: 32, h: 22 },
  { x: 338, y: 243, w: 24, h: 28 },
  { x: 153, y: 338, w: 40, h: 22 },
  { x: 200, y: 338, w: 35, h: 22 },
];

export default function WebGIS() {
  const [layers, setLayers] = useState(MAP_LAYERS);
  const [activeTool, setActiveTool] = useState<Tool>("select");
  const [selectedParcel, setSelectedParcel] = useState<Parcel | null>(PARCELS[0]);
  const [zoom, setZoom] = useState(100);
  const [layerPanelOpen, setLayerPanelOpen] = useState(true);

  const toggleLayer = useCallback((id: string) => {
    setLayers(prev => prev.map(l => l.id === id ? { ...l, visible: !l.visible } : l));
  }, []);

  const parcelsVisible = layers.find(l => l.id === "cadastral")?.visible;
  const buildingsVisible = layers.find(l => l.id === "planimetric")?.visible;
  const roadsVisible = layers.find(l => l.id === "roads")?.visible;
  const topologyVisible = layers.find(l => l.id === "topology")?.visible;

  const tools: { id: Tool; icon: typeof MousePointer2; label: string }[] = [
    { id: "select", icon: MousePointer2, label: "Select" },
    { id: "pan", icon: Hand, label: "Pan" },
    { id: "zoomin", icon: ZoomIn, label: "Zoom in" },
    { id: "zoomout", icon: ZoomOut, label: "Zoom out" },
    { id: "measure", icon: Maximize2, label: "Measure" },
  ];

  return (
    <div className="flex-1 overflow-hidden flex flex-col relative">
      {/* Toolbar */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 flex flex-col gap-2">
        <div className="flex gap-1 p-1 rounded-lg" style={{ background: "rgba(10,22,40,0.9)", border: "1px solid rgba(34,211,238,0.15)", backdropFilter: "blur(12px)" }}>
          {tools.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setActiveTool(id)}
              title={label}
              aria-label={label}
              aria-pressed={activeTool === id}
              className={`w-9 h-9 rounded flex items-center justify-center transition-all focus:outline-none focus-visible:ring-1 focus-visible:ring-cyan-400 ${
                activeTool === id ? "text-cyan-400 bg-cyan-400/15" : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
              }`}
            >
              <Icon size={15} />
            </button>
          ))}
        </div>
        <div className="flex gap-1 p-1 rounded-lg self-center" style={{ background: "rgba(10,22,40,0.9)", border: "1px solid rgba(34,211,238,0.15)", backdropFilter: "blur(12px)" }}>
          {[Minus, Plus, Grid3x3].map((Icon, i) => (
            <button
              key={i}
              onClick={() => i === 0 ? setZoom(z => Math.max(25, z - 25)) : i === 1 ? setZoom(z => Math.min(400, z + 25)) : null}
              aria-label={i === 0 ? "Zoom out" : i === 1 ? "Zoom in" : "Grid"}
              className="w-9 h-9 rounded flex items-center justify-center text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-all focus:outline-none focus-visible:ring-1 focus-visible:ring-cyan-400"
            >
              <Icon size={15} />
            </button>
          ))}
        </div>
      </div>

      {/* Map area */}
      <div
        className="flex-1 relative overflow-hidden"
        style={{ background: "#0a1822", cursor: activeTool === "pan" ? "grab" : activeTool === "select" ? "crosshair" : "default" }}
      >
        {/* Grid overlay */}
        <svg className="absolute inset-0 w-full h-full opacity-10" preserveAspectRatio="xMidYMid slice">
          <defs>
            <pattern id="smallgrid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#22d3ee" strokeWidth="0.3" />
            </pattern>
            <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
              <rect width="100" height="100" fill="url(#smallgrid)" />
              <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#22d3ee" strokeWidth="0.6" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* Main map SVG */}
        <svg
          viewBox="0 0 600 450"
          className="absolute inset-0 w-full h-full"
          preserveAspectRatio="xMidYMid meet"
          style={{ transform: `scale(${zoom / 100})`, transformOrigin: "center", transition: "transform 0.2s" }}
          aria-label="Cadastral map"
          role="img"
        >
          {/* Roads */}
          {roadsVisible && ROAD_PATHS.map((d, i) => (
            <path key={i} d={d} stroke="#475569" strokeWidth="6" fill="none" strokeLinecap="round" />
          ))}

          {/* Road labels */}
          {roadsVisible && (
            <>
              <text x="120" y="137" fill="#64748b" fontSize="7" fontFamily="JetBrains Mono">ANNA NAGAR ROAD</text>
              <text x="220" y="217" fill="#64748b" fontSize="7" fontFamily="JetBrains Mono">THIRU VI KA ROAD</text>
            </>
          )}

          {/* Parcel fills */}
          {parcelsVisible && PARCEL_RECTS.map((p) => {
            const parcelData = PARCELS.find(pd => pd.id === p.id);
            const isSelected = selectedParcel?.id === p.id;
            const needsReview = parcelData?.geometryStatus === "review";
            const isRepaired = parcelData?.geometryStatus === "repaired";
            return (
              <g key={p.id} onClick={() => setSelectedParcel(parcelData || null)} style={{ cursor: "pointer" }}>
                <rect
                  x={p.x} y={p.y} width={p.w} height={p.h}
                  fill={
                    isSelected ? "rgba(34,211,238,0.25)" :
                    needsReview ? "rgba(248,113,113,0.15)" :
                    isRepaired ? "rgba(251,191,36,0.12)" :
                    "rgba(34,211,238,0.07)"
                  }
                  stroke={
                    isSelected ? "#22d3ee" :
                    needsReview ? "#f87171" :
                    isRepaired ? "#fbbf24" :
                    "rgba(34,211,238,0.4)"
                  }
                  strokeWidth={isSelected ? 1.5 : 0.8}
                />
                {topologyVisible && needsReview && (
                  <circle cx={p.x + p.w - 5} cy={p.y + 5} r="4" fill="#f87171" opacity="0.8" />
                )}
                <text x={p.x + p.w / 2} y={p.y + p.h / 2 + 3} textAnchor="middle" fill={isSelected ? "#22d3ee" : "rgba(34,211,238,0.6)"}
                  fontSize="7" fontFamily="JetBrains Mono">{p.id}</text>
              </g>
            );
          })}

          {/* Buildings */}
          {buildingsVisible && BUILDING_RECTS.map((b, i) => (
            <rect key={i} x={b.x} y={b.y} width={b.w} height={b.h}
              fill="rgba(96,165,250,0.2)" stroke="rgba(96,165,250,0.6)" strokeWidth="0.6" />
          ))}

          {/* Coord display */}
          <text x="560" y="440" textAnchor="end" fill="rgba(34,211,238,0.5)" fontSize="8" fontFamily="JetBrains Mono">
            13.0827°N 80.2707°E
          </text>
        </svg>

        {/* Layer panel */}
        {layerPanelOpen && (
          <div
            className="absolute top-4 left-4 z-10 w-52 rounded-xl overflow-hidden"
            style={{ background: "rgba(8,18,36,0.92)", border: "1px solid rgba(34,211,238,0.15)", backdropFilter: "blur(16px)" }}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: "rgba(34,211,238,0.1)" }}>
              <span className="text-sm font-semibold text-white">Layers</span>
              <button onClick={() => setLayerPanelOpen(false)} className="text-slate-500 hover:text-slate-300 focus:outline-none" aria-label="Close layers">
                <SlidersHorizontal size={14} />
              </button>
            </div>
            <div className="p-3 space-y-1">
              {layers.map((layer) => (
                <label key={layer.id} className="flex items-center gap-2.5 py-1.5 px-1 rounded cursor-pointer hover:bg-white/4 transition-colors">
                  <div
                    className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 transition-all`}
                    style={{
                      background: layer.visible ? layer.color + "33" : "transparent",
                      border: `1.5px solid ${layer.visible ? layer.color : "rgba(100,116,139,0.4)"}`,
                    }}
                    onClick={() => toggleLayer(layer.id)}
                  >
                    {layer.visible && <Check size={10} color={layer.color} />}
                  </div>
                  <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ background: layer.color + "99" }} />
                  <span className="text-xs text-slate-300 truncate" style={{ fontFamily: "Inter" }}>{layer.label}</span>
                  <input type="checkbox" className="sr-only" checked={layer.visible} onChange={() => toggleLayer(layer.id)} aria-label={layer.label} />
                </label>
              ))}
            </div>
          </div>
        )}

        {!layerPanelOpen && (
          <button
            onClick={() => setLayerPanelOpen(true)}
            className="absolute top-4 left-4 z-10 w-9 h-9 rounded-lg flex items-center justify-center text-slate-400 hover:text-cyan-400 transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-cyan-400"
            style={{ background: "rgba(8,18,36,0.9)", border: "1px solid rgba(34,211,238,0.15)", backdropFilter: "blur(12px)" }}
            aria-label="Open layers"
          >
            <Layers size={15} />
          </button>
        )}

        {/* Zoom indicator */}
        <div className="absolute bottom-4 left-4 text-[10px] text-slate-600 px-2 py-1 rounded" style={{ fontFamily: "JetBrains Mono", background: "rgba(5,13,26,0.7)" }}>
          {zoom}% · EPSG:3857
        </div>

        {/* Coord display */}
        <div className="absolute bottom-4 right-4 text-[10px] text-cyan-400/50 px-2 py-1 rounded" style={{ fontFamily: "JetBrains Mono", background: "rgba(5,13,26,0.7)" }}>
          LAT 13.0827 N &nbsp; LON 80.2707 E
        </div>
      </div>

      {/* Inspector panel */}
      {selectedParcel && (
        <div
          className="absolute top-0 right-0 h-full w-72 flex flex-col z-20"
          style={{ background: "rgba(8,18,36,0.95)", borderLeft: "1px solid rgba(34,211,238,0.15)", backdropFilter: "blur(20px)" }}
        >
          <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: "rgba(34,211,238,0.1)" }}>
            <div>
              <h2 className="text-base font-bold text-white" style={{ fontFamily: "Inter" }}>Parcel {selectedParcel.id}</h2>
              {selectedParcel.geometryStatus === "review" && (
                <span className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold text-red-400"
                  style={{ background: "rgba(248,113,113,0.15)", border: "1px solid rgba(248,113,113,0.3)", fontFamily: "JetBrains Mono" }}>
                  <AlertTriangle size={9} />
                  REQUIRES REVIEW
                </span>
              )}
              {selectedParcel.geometryStatus === "valid" && (
                <span className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold text-green-400"
                  style={{ background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.25)", fontFamily: "JetBrains Mono" }}>
                  <Check size={9} />
                  VALID
                </span>
              )}
            </div>
            <button onClick={() => setSelectedParcel(null)} className="text-slate-500 hover:text-slate-300 focus:outline-none focus-visible:ring-1 focus-visible:ring-cyan-400 rounded" aria-label="Close inspector">
              <X size={16} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Basic info */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-[10px] text-slate-600 uppercase tracking-widest" style={{ fontFamily: "JetBrains Mono" }}>Land Type</div>
                <div className="text-sm font-medium text-slate-200 mt-0.5">{selectedParcel.landType}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-600 uppercase tracking-widest" style={{ fontFamily: "JetBrains Mono" }}>Area</div>
                <div className="text-sm font-medium text-cyan-400 mt-0.5" style={{ fontFamily: "JetBrains Mono" }}>{selectedParcel.area.toLocaleString()} m²</div>
              </div>
            </div>

            {/* Inference confidence */}
            <div className="p-3 rounded-lg" style={{ background: "rgba(5,13,26,0.5)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="flex items-center justify-between mb-2">
                <div className="text-[10px] text-slate-500 uppercase tracking-widest" style={{ fontFamily: "JetBrains Mono" }}>Inference Engine Diagnostics</div>
                <span className={`text-[11px] font-bold ${selectedParcel.confidence >= 80 ? "text-cyan-400" : selectedParcel.confidence >= 65 ? "text-amber-400" : "text-red-400"}`}
                  style={{ fontFamily: "JetBrains Mono" }}>{selectedParcel.confidence}% CONF</span>
              </div>
              <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${selectedParcel.confidence >= 80 ? "bg-gradient-to-r from-cyan-500 to-cyan-300" : selectedParcel.confidence >= 65 ? "bg-amber-400" : "bg-red-400"}`}
                  style={{ width: `${selectedParcel.confidence}%` }}
                />
              </div>
              {selectedParcel.geometryStatus === "review" && (
                <div className="mt-2 p-2 rounded text-xs text-amber-400" style={{ background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.2)" }}>
                  Anomaly Detected: Geometric variance exceeding tolerance threshold
                </div>
              )}
            </div>

            {/* Diagnostic tags */}
            <div className="flex flex-wrap gap-2">
              {["Boundary contrast", "Road adjacency"].map(tag => (
                <span key={tag} className="px-2.5 py-1 rounded text-[11px] text-slate-400 cursor-pointer hover:text-slate-200 hover:border-slate-500 transition-colors"
                  style={{ border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)" }}>
                  {tag}
                </span>
              ))}
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-2">
              <div className="grid grid-cols-2 gap-2">
                <button className="flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium text-slate-300 hover:text-white transition-all focus:outline-none focus-visible:ring-1 focus-visible:ring-cyan-400"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
                  <Grid3x3 size={12} />
                  Resegment
                </button>
                <button className="flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium text-slate-300 hover:text-white transition-all focus:outline-none focus-visible:ring-1 focus-visible:ring-cyan-400"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
                  <GitMerge size={12} />
                  Merge
                </button>
              </div>
              <button className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium text-slate-300 hover:text-white transition-all focus:outline-none focus-visible:ring-1 focus-visible:ring-cyan-400"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
                <PenLine size={12} />
                Commit Geometry
              </button>
            </div>
          </div>

          {/* Footer actions */}
          <div className="p-4 border-t grid grid-cols-2 gap-2" style={{ borderColor: "rgba(34,211,238,0.1)" }}>
            <button className="py-2.5 rounded-lg text-sm font-semibold text-red-400 hover:text-white hover:bg-red-500 transition-all focus:outline-none focus-visible:ring-1 focus-visible:ring-red-400"
              style={{ border: "1px solid rgba(248,113,113,0.3)", background: "rgba(248,113,113,0.06)" }}>
              Reject
            </button>
            <button className="py-2.5 rounded-lg text-sm font-semibold text-slate-900 bg-cyan-400 hover:bg-cyan-300 transition-all focus:outline-none focus-visible:ring-1 focus-visible:ring-cyan-400">
              Accept
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
