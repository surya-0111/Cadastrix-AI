import { useState, useEffect, useRef } from "react";
import {
  Play, Pause, RotateCcw, Maximize2, Layers, Eye, EyeOff,
  ChevronLeft, ChevronRight, ZoomIn, ZoomOut, SlidersHorizontal,
  Building2, Road, MapPin, AlertTriangle, CheckCircle2, Cpu, Download,
  Upload, AlertCircle, FileText
} from "lucide-react";
import { PROCESSING_LOGS, IMAGE_TILES } from "../data/mockData";
import { downloadJson } from "../utils/actions";
import { exportAIProcessingPdf } from "../utils/pdfGenerator";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import ProgressBar from "../components/ui/ProgressBar";
import { useCadastra } from "../context/CadastraContext";

interface AIProcessingProps {
  onToast: (msg: string, type?: "success" | "error" | "info" | "warning") => void;
}

// SVG urban texture generator for tile previews
function UrbanTileSVG({ seed, overlay }: { seed: number; overlay?: boolean }) {
  const buildings: { x: number; y: number; w: number; h: number }[] = [];
  const rng = (s: number) => {
    const x = Math.sin(s) * 10000;
    return x - Math.floor(x);
  };
  for (let i = 0; i < 18; i++) {
    buildings.push({
      x: 10 + (rng(seed + i * 7) * 260),
      y: 10 + (rng(seed + i * 13) * 180),
      w: 18 + rng(seed + i * 3) * 26,
      h: 14 + rng(seed + i * 5) * 22,
    });
  }
  return (
    <svg viewBox="0 0 300 220" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
      <defs>
        <pattern id={`urban-grid-${seed}`} width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(30,60,100,0.3)" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="300" height="220" fill="#080e1a" />
      <rect width="300" height="220" fill={`url(#urban-grid-${seed})`} />

      {/* Roads */}
      <path d="M 0 110 Q 150 100 300 120" stroke="rgba(59,130,246,0.35)" strokeWidth="12" fill="none" />
      <path d="M 130 0 L 140 220" stroke="rgba(59,130,246,0.35)" strokeWidth="9" fill="none" />

      {/* Base buildings */}
      {buildings.map((b, i) => (
        <rect
          key={i}
          x={b.x}
          y={b.y}
          width={b.w}
          height={b.h}
          fill="rgba(30,60,100,0.5)"
          stroke="rgba(30,60,100,0.8)"
          strokeWidth="0.5"
          rx="1"
        />
      ))}

      {/* AI vector overlay */}
      {overlay && (
        <>
          {buildings.slice(0, 14).map((b, i) => (
            <rect
              key={`ov-${i}`}
              x={b.x}
              y={b.y}
              width={b.w}
              height={b.h}
              fill="rgba(0,212,255,0.18)"
              stroke="#00d4ff"
              strokeWidth="1.2"
              rx="1"
            />
          ))}
          <path d="M 0 110 Q 150 100 300 120" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4 2" fill="none" />
          <path d="M 130 0 L 140 220" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4 2" fill="none" />
          {/* Anomaly circle */}
          <circle cx="210" cy="80" r="14" fill="rgba(245,158,11,0.2)" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3 2" />
        </>
      )}
    </svg>
  );
}

// Scanning laser line animation
function ScanAnimation() {
  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden"
      style={{ background: "linear-gradient(180deg, transparent 0%, rgba(0,212,255,0.06) 50%, transparent 100%)" }}
    >
      <div
        className="w-full h-0.5 bg-gradient-to-r from-transparent via-[#00d4ff] to-transparent shadow-[0_0_8px_#00d4ff]"
        style={{ animation: "scan-line 3s linear infinite" }}
      />
    </div>
  );
}

const EXTRACTION_STEPS = [
  { id: "ingest", label: "Ingesting imagery", progress: 100, status: "done" },
  { id: "segment", label: "Segmenting rooftops", progress: 100, status: "done" },
  { id: "roads", label: "Vectorizing roads", progress: 73, status: "active" },
  { id: "parcels", label: "Reconciling parcel geometry", progress: 100, status: "done" },
  { id: "topology", label: "Topology validation", progress: 100, status: "done" },
];

const DETECTION_CARDS = [
  { label: "Building Detection", count: 1847, confidence: 94.2, color: "#00d4ff", icon: <Building2 size={14} />, status: "complete" },
  { label: "Road Detection", count: 74, confidence: 88.6, color: "#3b82f6", icon: <Road size={14} />, status: "active" },
  { label: "Parcel Reconstruction", count: 312, confidence: 72.1, color: "#8b5cf6", icon: <MapPin size={14} />, status: "active" },
  { label: "Topology Validation", count: 0, confidence: 0, color: "#f59e0b", icon: <AlertTriangle size={14} />, status: "pending" },
];

export default function AIProcessing({ onToast }: AIProcessingProps) {
  const {
    navigateTo,
    processedGeoJson,
    processingStatus,
    processingError,
    uploadedFileName,
    polygonCount,
    processGeoTiff,
    resetProcessing,
  } = useCadastra();

  const [running, setRunning] = useState(true);
  const [selectedTile, setSelectedTile] = useState(2);
  const [showOverlay, setShowOverlay] = useState(true);
  const [compareMode, setCompareMode] = useState(false);
  const [sliderX, setSliderX] = useState(50);
  const [logs, setLogs] = useState(PROCESSING_LOGS.slice(0, 10));
  const [selectedFeature, setSelectedFeature] = useState<string | null>("BLD-001847");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(100);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Controlled log generation and simulation pause/resume
  useEffect(() => {
    if (!running) return;

    const interval = setInterval(() => {
      setLogs(prev => {
        const remaining = PROCESSING_LOGS.slice(prev.length);
        if (remaining.length > 0) {
          const next = [...prev, remaining[0]];
          setTimeout(() => {
            logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: "smooth" });
          }, 50);
          return next;
        }
        return prev;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [running]);

  const currentTile = IMAGE_TILES[selectedTile];
  const logColor = { info: "text-[#7a9cc0]", warn: "text-[#f59e0b]", error: "text-[#ef4444]", success: "text-[#10b981]" };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await processGeoTiff(file);
    }
  };

  const handleTogglePlayPause = () => {
    setRunning(prev => {
      const next = !prev;
      onToast(next ? "AI Inference resumed" : "AI Inference paused", next ? "info" : "warning");
      return next;
    });
  };

  const exportResults = () => {
    if (processedGeoJson) {
      downloadJson("cadastrix-ai-results.geojson", processedGeoJson);
      onToast("Exported real ML-CV GeoJSON results", "success");
    } else {
      downloadJson("cadastra-ai-results.json", {
        tile: currentTile,
        selectedFeature,
        zoom,
        overlay: showOverlay,
        logs,
      });
      onToast("AI results exported as JSON", "success");
    }
  };

  const exportPdf = () => {
    exportAIProcessingPdf({
      tileName: currentTile.label,
      coords: currentTile.coords,
      res: currentTile.res,
      status: running ? "Running Inference" : "Paused",
      confidence: currentTile.confidence || 87.4,
      buildingCount: 1847,
      roadCount: 74,
      parcelCount: 312,
      logs,
    });
    onToast("Generated AI Inference PDF Report", "success");
  };

  const resetPipeline = () => {
    resetProcessing();
    setLogs(PROCESSING_LOGS.slice(0, 10));
    setSelectedTile(0);
    setSelectedFeature("BLD-001847");
    setZoom(100);
    setCompareMode(false);
    setShowOverlay(true);
    setSliderX(50);
    setRunning(false);
    onToast("Pipeline reset to initial state", "success");
  };

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) await canvasRef.current?.requestFullscreen();
      else await document.exitFullscreen();
    } catch {
      onToast("Fullscreen is not available in this browser", "error");
    }
  };

  return (
    <div className="h-full overflow-y-auto p-4 lg:p-6 flex flex-col gap-5 bg-[#080e1a]">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="text-xs text-[#4a6a8a] font-mono uppercase tracking-wider mb-1">
            Cadastrix-AI · ML-CV Boundary Extraction Engine
          </div>
          <h1 className="text-xl font-semibold text-[#e2eaf4]">AI Analysis Workspace</h1>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {/* Pause / Resume Button */}
          <Button
            variant={running ? "secondary" : "primary"}
            size="sm"
            icon={running ? <Pause size={13} /> : <Play size={13} />}
            onClick={handleTogglePlayPause}
          >
            {running ? "Pause" : "Resume"}
          </Button>

          <Button
            variant="primary"
            size="sm"
            icon={<Upload size={13} />}
            onClick={() => fileInputRef.current?.click()}
            disabled={processingStatus === "processing"}
          >
            {processingStatus === "processing" ? "Processing..." : "Upload GeoTIFF"}
          </Button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".tif,.tiff"
            className="hidden"
            onChange={handleFileChange}
          />

          <Button variant="ghost" size="sm" icon={<FileText size={13} />} onClick={exportPdf}>
            PDF Report
          </Button>

          <Button variant="ghost" size="sm" icon={<Download size={13} />} onClick={exportResults}>
            {processedGeoJson ? "Export GeoJSON" : "Export JSON"}
          </Button>

          <Button variant="outline" size="sm" icon={<RotateCcw size={13} />} onClick={resetPipeline}>
            Reset
          </Button>

          <Button
            variant="secondary"
            size="sm"
            icon={<MapPin size={13} />}
            onClick={() => navigateTo("webgis")}
          >
            Open in WebGIS
          </Button>
        </div>
      </div>

      {/* Paused State Banner */}
      {!running && (
        <div className="bg-[rgba(245,158,11,0.1)] border border-[rgba(245,158,11,0.35)] rounded-xl p-3.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-3 h-3 rounded-full bg-[#f59e0b]" />
            <span className="text-xs font-semibold text-[#f59e0b]">
              AI INFERENCE PAUSED — Pipeline and log stream are currently suspended.
            </span>
          </div>
          <Button variant="primary" size="sm" icon={<Play size={12} />} onClick={handleTogglePlayPause}>
            Resume Pipeline
          </Button>
        </div>
      )}

      {/* Real Processing Status Banner */}
      {processingStatus === "processing" && (
        <div className="bg-[#0d1f38] border border-[rgba(0,212,255,0.4)] rounded-xl p-4 flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-[#00d4ff] border-t-transparent rounded-full animate-spin flex-shrink-0" />
          <div className="flex-1">
            <div className="text-sm font-semibold text-[#00d4ff]">
              Running Real ML-CV Pipeline on {uploadedFileName}...
            </div>
            <div className="text-xs text-[#7a9cc0]">
              Preprocessing → Canny edge detection → Polygonization → WGS84 Reprojection
            </div>
          </div>
        </div>
      )}

      {processingStatus === "success" && (
        <div className="bg-[rgba(16,185,129,0.1)] border border-[rgba(16,185,129,0.4)] rounded-xl p-4 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[rgba(16,185,129,0.2)] border border-[rgba(16,185,129,0.4)] flex items-center justify-center text-[#10b981]">
              <CheckCircle2 size={18} />
            </div>
            <div>
              <div className="text-sm font-semibold text-[#e2eaf4]">
                ML-CV Extraction Complete: {polygonCount} Polygons Extracted
              </div>
              <div className="text-xs text-[#7a9cc0] font-mono">
                Source: {uploadedFileName} · CRS: WGS84 (EPSG:4326) · GeoJSON Ready
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="primary" size="sm" icon={<MapPin size={13} />} onClick={() => navigateTo("webgis")}>
              View in WebGIS
            </Button>
            <Button variant="outline" size="sm" icon={<Download size={13} />} onClick={exportResults}>
              Download GeoJSON
            </Button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Main analysis canvas */}
        <div className="xl:col-span-2 flex flex-col gap-4">

          {/* Image canvas */}
          <div className="bg-[#0d1526] border border-[rgba(30,60,100,0.5)] rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-[rgba(30,60,100,0.4)] flex items-center gap-3 flex-wrap">
              <span className="text-xs font-semibold text-[#e2eaf4]">{currentTile.label}</span>
              <span className="text-[10px] font-mono text-[#4a6a8a]">{currentTile.coords}</span>
              <span className="text-[10px] font-mono text-[#4a6a8a]">{currentTile.res}</span>
              <div className="ml-auto flex items-center gap-2">
                <button onClick={() => setZoom(z => Math.max(50, z - 25))} className="p-1.5 rounded text-[#4a6a8a] hover:text-[#00d4ff] hover:bg-[rgba(0,212,255,0.08)]"><ZoomOut size={13} /></button>
                <span className="text-[10px] font-mono text-[#7a9cc0] w-10 text-center">{zoom}%</span>
                <button onClick={() => setZoom(z => Math.min(200, z + 25))} className="p-1.5 rounded text-[#4a6a8a] hover:text-[#00d4ff] hover:bg-[rgba(0,212,255,0.08)]"><ZoomIn size={13} /></button>
                <button onClick={() => setCompareMode(v => !v)} className={`p-1.5 rounded text-[11px] font-mono transition-colors ${compareMode ? "text-[#00d4ff] bg-[rgba(0,212,255,0.1)]" : "text-[#4a6a8a] hover:text-[#7a9cc0]"}`}>
                  <SlidersHorizontal size={13} />
                </button>
                <button onClick={() => setShowOverlay(v => !v)} className={`p-1.5 rounded transition-colors ${showOverlay ? "text-[#00d4ff] bg-[rgba(0,212,255,0.1)]" : "text-[#4a6a8a] hover:text-[#7a9cc0]"}`}>
                  {showOverlay ? <Eye size={13} /> : <EyeOff size={13} />}
                </button>
                <button onClick={toggleFullscreen} className="p-1.5 rounded text-[#4a6a8a] hover:text-[#7a9cc0]" title="Fullscreen"><Maximize2 size={13} /></button>
              </div>
            </div>

            <div ref={canvasRef} className="relative bg-[#080e1a]" style={{ height: "340px", overflow: "hidden" }}>
              {compareMode ? (
                <div className="relative w-full h-full select-none">
                  <div className="absolute inset-0">
                    <div style={{ transform: `scale(${zoom / 100})`, transformOrigin: "center", width: "100%", height: "100%" }}><UrbanTileSVG seed={selectedTile * 31 + 7} overlay={false} /></div>
                  </div>
                  <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `inset(0 ${100 - sliderX}% 0 0)` }}>
                    <div style={{ transform: `scale(${zoom / 100})`, transformOrigin: "center", width: "100%", height: "100%" }}><UrbanTileSVG seed={selectedTile * 31 + 7} overlay={true} /></div>
                  </div>
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-white cursor-ew-resize z-10 flex items-center justify-center"
                    style={{ left: `${sliderX}%` }}
                    onMouseDown={e => {
                      const el = e.currentTarget.parentElement!;
                      const move = (ev: MouseEvent) => {
                        const rect = el.getBoundingClientRect();
                        setSliderX(Math.max(10, Math.min(90, ((ev.clientX - rect.left) / rect.width) * 100)));
                      };
                      window.addEventListener("mousemove", move);
                      window.addEventListener("mouseup", () => window.removeEventListener("mousemove", move), { once: true });
                    }}
                  >
                    <div className="w-6 h-6 rounded-full bg-white border-2 border-[#080e1a] flex items-center justify-center shadow-lg">
                      <ChevronLeft size={8} className="text-[#080e1a]" />
                      <ChevronRight size={8} className="text-[#080e1a]" />
                    </div>
                  </div>
                  <div className="absolute top-3 left-3 bg-[rgba(8,14,26,0.8)] border border-[rgba(30,60,100,0.5)] rounded px-2 py-0.5 text-[10px] font-mono text-[#7a9cc0]">Original</div>
                  <div className="absolute top-3 right-3 bg-[rgba(8,14,26,0.8)] border border-[rgba(0,212,255,0.3)] rounded px-2 py-0.5 text-[10px] font-mono text-[#00d4ff]">AI Inference</div>
                </div>
              ) : (
                <div className="w-full h-full relative">
                  <div style={{ transform: `scale(${zoom / 100})`, transformOrigin: "center", width: "100%", height: "100%" }}><UrbanTileSVG seed={selectedTile * 31 + 7} overlay={showOverlay} /></div>
                  {running && currentTile.status === "analyzing" && <ScanAnimation />}
                  
                  {/* Layer legend */}
                  {showOverlay && (
                    <div className="absolute bottom-3 left-3 flex flex-col gap-1 bg-[rgba(8,14,26,0.85)] border border-[rgba(30,60,100,0.5)] rounded-lg p-2">
                      {[
                        { color: "#00d4ff", label: "Buildings" },
                        { color: "#3b82f6", label: "Roads" },
                        { color: "#8b5cf6", label: "Parcels" },
                        { color: "#f59e0b", label: "Anomalies" },
                      ].map(l => (
                        <div key={l.label} className="flex items-center gap-1.5 text-[10px] font-mono">
                          <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: `${l.color}30`, border: `1px solid ${l.color}` }} />
                          <span className="text-[#7a9cc0]">{l.label}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Tile info */}
                  <div className="absolute top-3 right-3 bg-[rgba(8,14,26,0.85)] border border-[rgba(30,60,100,0.5)] rounded-lg p-2">
                    <div className="text-[10px] font-mono text-[#7a9cc0]">{currentTile.id}</div>
                    {currentTile.confidence > 0 && (
                      <div className="text-[11px] font-mono text-[#10b981]">{currentTile.confidence}% conf.</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Tile strip */}
          <div className="bg-[#0d1526] border border-[rgba(30,60,100,0.5)] rounded-xl p-4">
            <div className="text-xs font-semibold text-[#7a9cc0] uppercase tracking-wider mb-3">Survey Flight Zones</div>
            <div className="flex gap-3 overflow-x-auto pb-1">
              {IMAGE_TILES.map((tile, i) => (
                <div
                  key={tile.id}
                  onClick={() => setSelectedTile(i)}
                  className={`flex-shrink-0 w-24 cursor-pointer rounded-lg overflow-hidden border transition-all ${
                    i === selectedTile ? "border-[#00d4ff] shadow-[0_0_0_1px_rgba(0,212,255,0.3)]" : "border-[rgba(30,60,100,0.5)] hover:border-[rgba(30,60,100,0.8)]"
                  }`}
                >
                  <div className="relative h-16">
                    <UrbanTileSVG seed={i * 31 + 7} overlay={tile.status === "complete"} />
                    {running && tile.status === "analyzing" && (
                      <div className="absolute inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.4)]">
                        <div className="w-4 h-4 border-2 border-[#00d4ff] border-t-transparent rounded-full animate-spin" />
                      </div>
                    )}
                    {tile.status === "queued" && (
                      <div className="absolute inset-0 bg-[rgba(8,14,26,0.6)] flex items-center justify-center">
                        <span className="text-[9px] font-mono text-[#4a6a8a]">Queued</span>
                      </div>
                    )}
                  </div>
                  <div className="px-2 py-1.5 bg-[#111e33]">
                    <div className="text-[9px] font-mono text-[#7a9cc0] truncate">{tile.label}</div>
                    {tile.confidence > 0 && (
                      <div className="text-[9px] font-mono text-[#10b981]">{tile.confidence}%</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Detection visual cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {DETECTION_CARDS.map(card => (
              <div key={card.label} className="bg-[#0d1526] border border-[rgba(30,60,100,0.5)] rounded-xl overflow-hidden">
                <div className="h-20 relative">
                  <UrbanTileSVG seed={card.label.charCodeAt(0)} overlay={card.status !== "pending"} />
                  {card.status === "pending" && (
                    <div className="absolute inset-0 flex items-center justify-center bg-[rgba(8,14,26,0.5)]">
                      <span className="text-[10px] font-mono text-[#4a6a8a]">Pending</span>
                    </div>
                  )}
                  {running && card.status === "active" && (
                    <div className="absolute top-1 right-1">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: card.color, animation: "pulse-scan 1.5s ease-in-out infinite" }} />
                    </div>
                  )}
                </div>
                <div className="p-2.5">
                  <div className="text-[10px] font-semibold text-[#7a9cc0] mb-1">{card.label}</div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-mono font-medium" style={{ color: card.color }}>
                      {card.count > 0 ? card.count.toLocaleString() : "—"}
                    </span>
                    {card.confidence > 0 && (
                      <span className="text-[10px] font-mono text-[#4a6a8a]">{card.confidence}%</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right panel */}
        <div className="flex flex-col gap-4">

          {/* Pipeline status */}
          <div className="bg-[#0d1526] border border-[rgba(30,60,100,0.5)] rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-semibold text-[#7a9cc0] uppercase tracking-wider flex items-center gap-1.5">
                <Cpu size={11} /> Extraction Pipeline
              </h3>
              {running ? (
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#00d4ff]">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#00d4ff] animate-pulse" />
                  Live Inference
                </div>
              ) : (
                <Badge variant="amber">Paused</Badge>
              )}
            </div>
            <div className="flex flex-col gap-3">
              {EXTRACTION_STEPS.map(step => (
                <div key={step.id}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5">
                      {step.status === "done" && <CheckCircle2 size={11} className="text-[#10b981]" />}
                      {step.status === "active" && (
                        <div className={`w-2.5 h-2.5 rounded-full border border-[#00d4ff] border-t-transparent ${running ? "animate-spin" : ""}`} />
                      )}
                      {step.status === "pending" && <div className="w-2.5 h-2.5 rounded-full border border-[#4a6a8a]" />}
                      <span className={`text-xs ${step.status === "pending" ? "text-[#4a6a8a]" : "text-[#7a9cc0]"}`}>{step.label}</span>
                    </div>
                    <span className="text-[10px] font-mono text-[#4a6a8a]">{step.progress}%</span>
                  </div>
                  <ProgressBar
                    value={step.progress}
                    color={step.status === "done" ? "#10b981" : step.status === "active" ? "#00d4ff" : "#1e3c64"}
                    height={3}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Model confidence */}
          <div className="bg-[#0d1526] border border-[rgba(30,60,100,0.5)] rounded-xl p-4">
            <h3 className="text-xs font-semibold text-[#7a9cc0] uppercase tracking-wider mb-3">Model Confidence</h3>
            <div className="text-center mb-3">
              <div className="text-3xl font-mono font-semibold text-[#10b981]">87.4%</div>
              <div className="text-[10px] text-[#4a6a8a] font-mono">CadastraNet v4.2 · Zone AN-C3</div>
            </div>
            <div className="flex flex-col gap-2">
              {[
                { label: "Buildings", v: 94, color: "#00d4ff" },
                { label: "Roads", v: 89, color: "#3b82f6" },
                { label: "Parcels", v: 72, color: "#8b5cf6" },
              ].map(m => (
                <div key={m.label} className="flex items-center gap-2">
                  <span className="text-[10px] text-[#7a9cc0] w-14">{m.label}</span>
                  <ProgressBar value={m.v} color={m.color} height={4} showLabel className="flex-1" />
                </div>
              ))}
            </div>
          </div>

          {/* Processing logs */}
          <div className="bg-[#0d1526] border border-[rgba(30,60,100,0.5)] rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-[rgba(30,60,100,0.4)] flex items-center justify-between">
              <h3 className="text-xs font-semibold text-[#7a9cc0] uppercase tracking-wider">Processing Stream Log</h3>
              <Badge variant={running ? "cyan" : "amber"} dot>{running ? "Running" : "Paused"}</Badge>
            </div>
            <div ref={logRef} className="overflow-y-auto" style={{ maxHeight: "180px" }}>
              {logs.map((log, i) => (
                <div key={i} className="px-3 py-1.5 flex gap-2 text-[10px] font-mono border-b border-[rgba(30,60,100,0.15)] last:border-0">
                  <span className="text-[#4a6a8a] flex-shrink-0">{log.time}</span>
                  <span className={logColor[log.level] + " flex-1"}>{log.message}</span>
                </div>
              ))}
              {running && (
                <div className="px-3 py-1.5 flex items-center gap-2 text-[10px] font-mono text-[#00d4ff]">
                  <span className="animate-pulse">█</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
