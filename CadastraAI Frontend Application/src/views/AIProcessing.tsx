import { useState, useEffect } from "react";
import { CheckCircle, RefreshCw, Circle, StopCircle, ChevronRight, AlertTriangle } from "lucide-react";
import { AI_PIPELINE_STEPS, PROCESS_LOG } from "../data/mock";

const TILES_COLS = 14;
const TILES_ROWS = 12;
const TOTAL_TILES = TILES_COLS * TILES_ROWS;

export default function AIProcessing() {
  const [activeTile, setActiveTile] = useState(41);
  const [log, setLog] = useState(PROCESS_LOG);
  const [progress, setProgress] = useState(72);
  const [tilesProcessed, setTilesProcessed] = useState(124);
  const [abortModal, setAbortModal] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => Math.min(100, p + 0.1));
      setTilesProcessed(t => Math.min(TOTAL_TILES, t + (Math.random() > 0.7 ? 1 : 0)));
      setActiveTile(t => (t + (Math.random() > 0.8 ? 1 : 0)) % TOTAL_TILES);
    }, 800);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const entries = [
        { type: "telemetry", text: `Tile ${tilesProcessed + 1}: ${Math.floor(Math.random() * 50) + 10} feature geometries serialized.` },
        { type: "info", text: `> Processing sector ${String.fromCharCode(65 + Math.floor(Math.random() * 6))}-${Math.floor(Math.random() * 9) + 1}...` },
      ];
      setLog(prev => [entries[Math.floor(Math.random() * entries.length)], ...prev.slice(0, 20)]);
    }, 2400);
    return () => clearInterval(interval);
  }, [tilesProcessed]);

  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      <div className="p-4 md:p-5 flex-shrink-0 flex items-start justify-between flex-wrap gap-3"
        style={{ borderBottom: "1px solid rgba(34,211,238,0.08)" }}>
        <div>
          <h1 className="text-xl font-bold text-white" style={{ fontFamily: "Inter", letterSpacing: "-0.02em" }}>
            Feature Extraction Engine: Active Pipeline
          </h1>
          <div className="text-[11px] text-slate-500 mt-0.5" style={{ fontFamily: "JetBrains Mono" }}>
            JOB ID: X-7794-B &nbsp;// REGION: SECTOR 4
          </div>
        </div>
        <button
          onClick={() => setAbortModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-red-400 hover:text-white hover:bg-red-500 transition-all focus:outline-none focus-visible:ring-1 focus-visible:ring-red-400"
          style={{ border: "1px solid rgba(248,113,113,0.3)", background: "rgba(248,113,113,0.08)" }}
        >
          <StopCircle size={14} />
          Abort Process
        </button>
      </div>

      <div className="flex-1 overflow-hidden grid md:grid-cols-[280px,1fr,260px] lg:grid-cols-[300px,1fr,280px] gap-0">

        {/* Left: tile grid */}
        <div className="hidden md:flex flex-col border-r" style={{ borderColor: "rgba(34,211,238,0.08)" }}>
          <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: "rgba(34,211,238,0.08)" }}>
            <span className="text-[10px] font-semibold text-slate-500 tracking-widest uppercase" style={{ fontFamily: "JetBrains Mono" }}>Source Imagery</span>
            <span className="text-[10px] text-cyan-400" style={{ fontFamily: "JetBrains Mono" }}>Tiled GeoTIFF</span>
          </div>
          <div className="flex-1 overflow-y-auto p-3">
            <div
              className="grid gap-px"
              style={{ gridTemplateColumns: `repeat(${TILES_COLS}, 1fr)` }}
              role="grid"
              aria-label="Processing tile grid"
            >
              {Array.from({ length: TOTAL_TILES }).map((_, i) => {
                const processed = i < tilesProcessed;
                const isActive = i === activeTile;
                const col = String.fromCharCode(65 + (i % TILES_COLS));
                const row = Math.floor(i / TILES_COLS) + 1;
                return (
                  <button
                    key={i}
                    title={`Tile ${col}-${row}`}
                    onClick={() => setActiveTile(i)}
                    className={`aspect-square transition-colors focus:outline-none ${
                      isActive ? "ring-1 ring-cyan-400 z-10 relative" :
                      processed ? "hover:opacity-80" : ""
                    }`}
                    style={{
                      background: isActive ? "rgba(34,211,238,0.6)" :
                        processed ? `rgba(34,211,238,${0.08 + Math.random() * 0.12})` :
                        "rgba(10,22,40,0.4)",
                    }}
                  />
                );
              })}
            </div>
            <div className="mt-2 text-[10px] text-slate-500 text-center" style={{ fontFamily: "JetBrains Mono" }}>
              TILE_{String.fromCharCode(65 + (activeTile % TILES_COLS))}{Math.floor(activeTile / TILES_COLS) + 1} ACTIVE
            </div>
          </div>
        </div>

        {/* Center: pipeline steps */}
        <div className="flex flex-col overflow-y-auto">
          <div className="px-4 py-3 border-b flex items-center justify-between flex-shrink-0" style={{ borderColor: "rgba(34,211,238,0.08)" }}>
            <span className="text-[10px] font-semibold text-slate-500 tracking-widest uppercase" style={{ fontFamily: "JetBrains Mono" }}>Pipeline Status</span>
            <div className="flex items-center gap-1.5">
              <Circle size={6} className="fill-cyan-400 animate-pulse" />
              <span className="text-[10px] font-semibold text-cyan-400" style={{ fontFamily: "JetBrains Mono" }}>ACTIVE</span>
            </div>
          </div>
          <div className="flex-1 p-4 space-y-2">
            {AI_PIPELINE_STEPS.map((step) => {
              const done = step.status === "done";
              const active = step.status === "active";
              return (
                <div
                  key={step.id}
                  className={`rounded-lg p-4 transition-all ${active ? "ring-1 ring-cyan-400" : ""}`}
                  style={{
                    background: active ? "rgba(34,211,238,0.06)" : done ? "rgba(10,22,40,0.4)" : "rgba(5,13,26,0.3)",
                    border: `1px solid ${active ? "rgba(34,211,238,0.3)" : done ? "rgba(34,211,238,0.12)" : "rgba(255,255,255,0.05)"}`,
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                      done ? "bg-cyan-400/20 text-cyan-400" : active ? "text-cyan-400" : "text-slate-600"
                    }`}>
                      {done ? <CheckCircle size={16} /> : active ? <RefreshCw size={16} className="animate-spin" /> : <Circle size={10} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`text-sm font-semibold ${done ? "text-slate-300" : active ? "text-white" : "text-slate-600"}`} style={{ fontFamily: "Inter" }}>
                          {step.label}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          done ? "text-cyan-400 bg-cyan-400/10" : active ? "text-cyan-400 bg-cyan-400/15" : "text-slate-600 bg-slate-800/50"
                        }`} style={{ fontFamily: "JetBrains Mono" }}>
                          {step.status === "done" ? "DONE" : step.status === "active" ? "ACTIVE" : "PENDING"}
                        </span>
                      </div>
                      <p className={`text-xs mt-1 ${done || active ? "text-slate-400" : "text-slate-700"}`}>{step.description}</p>
                      {active && "progress" in step && (
                        <div className="mt-2">
                          <div className="h-1 rounded-full bg-slate-800 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-cyan-300 transition-all duration-500"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: metrics + log */}
        <div className="hidden lg:flex flex-col border-l overflow-hidden" style={{ borderColor: "rgba(34,211,238,0.08)" }}>
          {/* Live metrics */}
          <div className="p-4 border-b flex-shrink-0" style={{ borderColor: "rgba(34,211,238,0.08)" }}>
            <div className="text-[10px] font-semibold text-slate-500 tracking-widest uppercase mb-3" style={{ fontFamily: "JetBrains Mono" }}>
              Live Metrics
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Overall Progress", value: `${progress.toFixed(0)}%`, accent: true },
                { label: "Tiles Processed", value: `${tilesProcessed} /168` },
                { label: "Est. Remaining", value: "01:42" },
                { label: "Confidence S.", value: "92.8%" },
              ].map(({ label, value, accent }) => (
                <div key={label} className="rounded p-2.5" style={{ background: "rgba(5,13,26,0.5)", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <div className="text-[9px] text-slate-600 uppercase tracking-widest" style={{ fontFamily: "JetBrains Mono" }}>{label}</div>
                  <div className={`text-lg font-bold mt-0.5 ${accent ? "text-cyan-400" : "text-white"}`} style={{ fontFamily: "JetBrains Mono" }}>{value}</div>
                </div>
              ))}
            </div>
            {/* System load */}
            <div className="mt-3">
              <div className="flex justify-between text-[10px] text-slate-500 mb-1" style={{ fontFamily: "JetBrains Mono" }}>
                <span>SYSTEM LOAD</span>
                <span>85% CPU / 14GB VRAM</span>
              </div>
              <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-400" style={{ width: "85%" }} />
              </div>
            </div>
          </div>

          {/* Process log */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="px-4 py-3 border-b flex-shrink-0" style={{ borderColor: "rgba(34,211,238,0.08)" }}>
              <span className="text-[10px] font-semibold text-slate-500 tracking-widest uppercase" style={{ fontFamily: "JetBrains Mono" }}>Process Log</span>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-1.5 font-mono text-[10px]" style={{ fontFamily: "JetBrains Mono" }}>
              {log.map((entry, i) => (
                <div key={i} className={
                  entry.type === "warn" ? "text-amber-400" :
                  entry.type === "system" ? "text-blue-400" :
                  entry.type === "telemetry" ? "text-slate-400" :
                  "text-slate-300"
                }>
                  {entry.type === "warn" && <span className="inline-block px-1 mr-1 bg-amber-400/20 rounded text-amber-400">[WARNING]</span>}
                  {entry.type === "telemetry" && <span className="text-cyan-600">[TELEMETRY] </span>}
                  {entry.type === "system" && <span className="text-blue-400">[SYSTEM] </span>}
                  {entry.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Abort modal */}
      {abortModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}>
          <div className="rounded-xl p-6 max-w-sm w-full" style={{ background: "#0a1628", border: "1px solid rgba(248,113,113,0.3)" }}>
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle size={20} className="text-red-400 flex-shrink-0" />
              <h2 className="text-base font-semibold text-white">Abort Processing?</h2>
            </div>
            <p className="text-sm text-slate-400 mb-5">
              Aborting will stop the current pipeline at Tile {tilesProcessed}. Partial results will be saved. This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setAbortModal(false)}
                className="flex-1 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white transition-colors focus:outline-none"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
              >
                Continue
              </button>
              <button
                onClick={() => setAbortModal(false)}
                className="flex-1 py-2 rounded-lg text-sm font-semibold text-white bg-red-500 hover:bg-red-600 transition-colors focus:outline-none"
              >
                Abort
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
