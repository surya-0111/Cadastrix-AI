import { useState, useCallback } from "react";
import { Upload, Map, CloudUpload, CheckCircle, Circle, RefreshCw, Building2, Route, TrendingUp, Clock, FileType, Globe, Maximize2, Activity } from "lucide-react";
import { PROJECT, PIPELINE_STEPS, ACTIVITY } from "../data/mock";

interface DashboardProps {
  onNavigate: (view: "processing" | "webgis") => void;
}

function StatCard({ label, value, accent }: { label: string; value: string | number; accent?: boolean }) {
  return (
    <div className="p-4 rounded-lg" style={{ background: "rgba(10,22,40,0.6)", border: "1px solid rgba(34,211,238,0.1)" }}>
      <div className="text-[11px] text-slate-500 uppercase tracking-widest mb-1" style={{ fontFamily: "JetBrains Mono" }}>{label}</div>
      <div className={`text-2xl font-bold ${accent ? "text-cyan-400" : "text-white"}`} style={{ fontFamily: "Inter" }}>{value}</div>
    </div>
  );
}

function PipelineStep({ step, index, total }: { step: typeof PIPELINE_STEPS[0]; index: number; total: number }) {
  const isLast = index === total - 1;
  const done = step.status === "done";
  const active = step.status === "active";
  const pending = step.status === "pending";

  return (
    <div className="flex flex-col items-center flex-1 min-w-0">
      <div className="flex items-center w-full">
        {/* connector left */}
        <div className={`h-px flex-1 ${index === 0 ? "opacity-0" : done || active ? "bg-cyan-400" : "bg-slate-700"}`} />
        {/* node */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all
          ${done ? "border-cyan-400 bg-cyan-400/20 text-cyan-400" : active ? "border-cyan-400 bg-navy-800 text-cyan-400 animate-pulse" : "border-slate-700 bg-navy-900 text-slate-600"}`}
          style={{ background: done ? "rgba(34,211,238,0.15)" : active ? "rgba(5,13,26,0.8)" : "rgba(5,13,26,0.4)" }}>
          {done ? <CheckCircle size={14} /> : active ? <RefreshCw size={14} className="animate-spin" /> : <Circle size={10} />}
        </div>
        {/* connector right */}
        <div className={`h-px flex-1 ${isLast ? "opacity-0" : done ? "bg-cyan-400" : "bg-slate-700"}`} />
      </div>
      <div className="mt-2 text-center">
        <div className={`text-[10px] font-medium ${done ? "text-cyan-400" : active ? "text-white" : "text-slate-600"}`} style={{ fontFamily: "JetBrains Mono" }}>
          {step.label}
        </div>
        {active && "progress" in step && (
          <div className="text-[10px] text-cyan-400 mt-0.5" style={{ fontFamily: "JetBrains Mono" }}>{step.progress}%</div>
        )}
      </div>
    </div>
  );
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadState, setUploadState] = useState<"idle" | "uploading" | "done">("idle");

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setUploadState("uploading");
    setTimeout(() => setUploadState("done"), 2000);
  }, []);

  const handleFileInput = useCallback(() => {
    setUploadState("uploading");
    setTimeout(() => setUploadState("done"), 2000);
  }, []);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-4 md:p-6 space-y-6 max-w-screen-2xl mx-auto">

        {/* Header */}
        <div className="flex flex-wrap items-start gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "Inter", letterSpacing: "-0.02em" }}>
                Urban Survey – Chennai
              </h1>
              <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold flex items-center gap-1.5"
                style={{ background: "rgba(34,211,238,0.12)", border: "1px solid rgba(34,211,238,0.3)", color: "#22d3ee", fontFamily: "JetBrains Mono" }}>
                <Circle size={6} className="fill-cyan-400 animate-pulse" />
                PROCESSING
              </span>
            </div>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">{PROJECT.description}</p>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <button
              onClick={() => onNavigate("webgis")}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white transition-all focus:outline-none focus-visible:ring-1 focus-visible:ring-cyan-400"
              style={{ background: "rgba(10,22,40,0.8)", border: "1px solid rgba(34,211,238,0.2)" }}
            >
              <Map size={14} />
              <span className="hidden sm:inline">Open WebGIS</span>
            </button>
            <label className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer transition-all focus-within:ring-1 focus-within:ring-cyan-400"
              style={{ background: "linear-gradient(135deg, #0891b2 0%, #22d3ee 100%)", color: "#050d1a" }}>
              <CloudUpload size={14} />
              <span className="hidden sm:inline">Upload Drone Data</span>
              <input type="file" className="sr-only" onChange={handleFileInput} accept=".tiff,.tif,.geotiff" />
            </label>
          </div>
        </div>

        {/* Metadata chips */}
        <div className="flex flex-wrap gap-2">
          {[
            { icon: FileType, text: PROJECT.sourceType },
            { icon: Globe, text: PROJECT.crs },
            { icon: Maximize2, text: PROJECT.area },
            { icon: TrendingUp, text: PROJECT.resolution },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-1.5 px-3 py-1.5 rounded text-[11px] text-slate-400"
              style={{ background: "rgba(10,22,40,0.6)", border: "1px solid rgba(255,255,255,0.07)", fontFamily: "JetBrains Mono" }}>
              <Icon size={11} className="text-slate-500" />
              {text}
            </div>
          ))}
        </div>

        {/* Pipeline */}
        <div className="p-4 md:p-5 rounded-xl" style={{ background: "rgba(10,22,40,0.5)", border: "1px solid rgba(34,211,238,0.1)" }}>
          <div className="flex items-center gap-2 mb-5">
            <Activity size={14} className="text-cyan-400" />
            <span className="text-[11px] font-semibold text-slate-400 tracking-widest uppercase" style={{ fontFamily: "JetBrains Mono" }}>
              Extraction Pipeline Status
            </span>
          </div>
          <div className="flex items-start overflow-x-auto pb-2">
            {PIPELINE_STEPS.map((step, i) => (
              <PipelineStep key={step.id} step={step} index={i} total={PIPELINE_STEPS.length} />
            ))}
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          <StatCard label="Feature Inventory" value={PROJECT.featureInventory} />
          <StatCard label="Validated Features" value={PROJECT.validatedFeatures} />
          <StatCard label="Topological Repairs" value={PROJECT.topologicalRepairs} />
          <StatCard label="Manual Verification" value={PROJECT.manualVerification} accent />
          <StatCard label="Buildings" value={PROJECT.buildings.toLocaleString()} />
          <StatCard label="Road Segments" value={PROJECT.roadSegments} />
          <StatCard label="Statistical Confidence" value={`${PROJECT.confidence}%`} accent />
          <StatCard label="Processing Duration" value={PROJECT.processingDuration} />
        </div>

        {/* Bottom row: activity + upload */}
        <div className="grid md:grid-cols-2 gap-4">

          {/* Live activity */}
          <div className="rounded-xl overflow-hidden" style={{ background: "rgba(10,22,40,0.5)", border: "1px solid rgba(34,211,238,0.1)" }}>
            <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: "rgba(34,211,238,0.08)" }}>
              <div className="flex items-center gap-2">
                <Circle size={6} className="fill-cyan-400 text-cyan-400 animate-pulse" />
                <span className="text-[11px] font-semibold text-cyan-400 tracking-widest uppercase" style={{ fontFamily: "JetBrains Mono" }}>Live Stream</span>
              </div>
            </div>
            <div className="p-4 space-y-2 max-h-72 overflow-y-auto">
              {ACTIVITY.map((item, i) => (
                <div key={i} className="flex gap-2 text-[11px]" style={{ fontFamily: "JetBrains Mono" }}>
                  <span className="text-slate-600 flex-shrink-0">{item.time}</span>
                  <span className={item.type === "warn" ? "text-amber-400" : item.type === "system" ? "text-blue-400" : "text-slate-400"}>
                    {item.message}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Upload dropzone */}
          <div className="rounded-xl p-4" style={{ background: "rgba(10,22,40,0.5)", border: "1px solid rgba(34,211,238,0.1)" }}>
            <div className="text-[11px] font-semibold text-slate-400 tracking-widest uppercase mb-3" style={{ fontFamily: "JetBrains Mono" }}>
              Upload Drone Data
            </div>
            <label
              className={`flex flex-col items-center justify-center h-48 rounded-lg cursor-pointer transition-all border-2 border-dashed ${
                isDragging ? "border-cyan-400 bg-cyan-400/8" : "border-slate-700 hover:border-slate-500"
              }`}
              onDragEnter={() => setIsDragging(true)}
              onDragLeave={() => setIsDragging(false)}
              onDragOver={e => e.preventDefault()}
              onDrop={handleDrop}
            >
              {uploadState === "idle" && (
                <>
                  <Upload size={24} className={`mb-3 ${isDragging ? "text-cyan-400" : "text-slate-600"}`} />
                  <div className="text-sm text-slate-400 text-center">Drop GeoTIFF or orthomosaic here</div>
                  <div className="text-[11px] text-slate-600 mt-1" style={{ fontFamily: "JetBrains Mono" }}>.tiff · .geotiff · .img · .jp2</div>
                </>
              )}
              {uploadState === "uploading" && (
                <div className="flex flex-col items-center gap-3">
                  <RefreshCw size={24} className="text-cyan-400 animate-spin" />
                  <span className="text-sm text-cyan-400">Uploading…</span>
                  <div className="w-48 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full bg-cyan-400 rounded-full animate-pulse w-2/3" />
                  </div>
                </div>
              )}
              {uploadState === "done" && (
                <div className="flex flex-col items-center gap-2">
                  <CheckCircle size={24} className="text-green-400" />
                  <span className="text-sm text-green-400 font-medium">Upload complete</span>
                  <span className="text-[11px] text-slate-500" style={{ fontFamily: "JetBrains Mono" }}>Queued for preprocessing</span>
                </div>
              )}
              <input type="file" className="sr-only" onChange={handleFileInput} accept=".tiff,.tif,.geotiff" />
            </label>

            {/* Quick stats */}
            <div className="mt-3 grid grid-cols-3 gap-2">
              {[
                { icon: Building2, label: "Buildings", value: "1,284" },
                { icon: Route, label: "Roads", value: "842" },
                { icon: Clock, label: "Est. time", value: "~02h" },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex flex-col items-center py-2 rounded" style={{ background: "rgba(5,13,26,0.5)", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <Icon size={12} className="text-slate-500 mb-1" />
                  <div className="text-xs font-semibold text-white">{value}</div>
                  <div className="text-[10px] text-slate-500">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
