import React from 'react';
import { 
  CheckCircle2, 
  Loader2, 
  Clock, 
  Layers, 
  Building, 
  Route, 
  ShieldAlert, 
  Terminal,
  ArrowRight,
  ExternalLink
} from 'lucide-react';

const PIPELINE_STAGES = [
  { id: 'UPLOADING', label: '1. Orthomosaic Upload & Ingestion', desc: 'Read CRS and validate spatial metadata' },
  { id: 'PREPROCESSING', label: '2. Image Preprocessing & Tiling', desc: '512x512 patches with 20% overlap' },
  { id: 'SEGMENTING', label: '3. Building & Road AI Extraction', desc: 'SegFormer-B3 & deep neural feature masks' },
  { id: 'VECTORISING', label: '4. Feature Vectorization', desc: 'Contour polygonization and smoothing' },
  { id: 'RECONSTRUCTING', label: '5. Parcel Reconstruction Engine', desc: 'Candidate edge inference & closed polygons' },
  { id: 'VALIDATING', label: '6. Topology Validation & Repair', desc: 'Self-intersection checks, overlaps, gaps' },
  { id: 'COMPLETED', label: '7. Cadastral Package Ready', desc: 'Final WebGIS ready for human verification' }
];

export default function ProcessingStatus({ 
  currentStage, 
  progress, 
  stats, 
  onViewInWebGIS,
  logs = []
}) {
  const isCompleted = progress >= 100 || currentStage === 'COMPLETED';

  const getStageState = (stageId, index) => {
    const stageOrder = ['UPLOADING', 'PREPROCESSING', 'SEGMENTING', 'VECTORISING', 'RECONSTRUCTING', 'VALIDATING', 'COMPLETED'];
    const currentIndex = stageOrder.indexOf(currentStage);
    const thisIndex = stageOrder.indexOf(stageId);

    if (isCompleted || thisIndex < currentIndex) return 'done';
    if (thisIndex === currentIndex) return 'active';
    return 'pending';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Banner with Progress Meter */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-blue-400 uppercase font-semibold">
                Autonomous AI & GIS Pipeline
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-blue-500/20 text-blue-300 border border-blue-500/30">
                Phase 6 Modular Monolith
              </span>
            </div>
            <h2 className="text-xl font-bold text-white mt-1">Processing Cadastral Scene</h2>
            <p className="text-xs text-slate-400">
              Transforming raw drone orthomosaic imagery into georeferenced cadastral boundaries
            </p>
          </div>

          <div className="text-right">
            <div className="text-3xl font-extrabold font-mono text-white">
              {progress}%
            </div>
            <p className="text-xs text-slate-400 font-mono">
              {isCompleted ? 'Pipeline Finished' : 'Estimated time: 4s remaining'}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
          <div
            style={{ width: `${progress}%` }}
            className={`h-full rounded-full transition-all duration-300 ${
              isCompleted
                ? 'bg-gradient-to-r from-emerald-500 to-cyan-400 shadow-lg shadow-emerald-500/30'
                : 'bg-gradient-to-r from-blue-600 via-cyan-400 to-emerald-400 animate-pulse'
            }`}
          ></div>
        </div>

        {/* Real-time Counter Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-800">
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-850">
            <span className="text-[10px] font-semibold uppercase text-slate-500 flex items-center gap-1">
              <Layers className="w-3 h-3 text-cyan-400" /> Patches Tiled
            </span>
            <p className="text-lg font-bold text-white font-mono mt-1">{stats?.tiles_processed || 48} / 48</p>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-850">
            <span className="text-[10px] font-semibold uppercase text-slate-500 flex items-center gap-1">
              <Building className="w-3 h-3 text-blue-400" /> Buildings Found
            </span>
            <p className="text-lg font-bold text-white font-mono mt-1">{stats?.buildings_extracted || 214}</p>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-850">
            <span className="text-[10px] font-semibold uppercase text-slate-500 flex items-center gap-1">
              <Route className="w-3 h-3 text-amber-400" /> Road Vectors
            </span>
            <p className="text-lg font-bold text-white font-mono mt-1">{stats?.road_segments || 24} segments</p>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-850">
            <span className="text-[10px] font-semibold uppercase text-slate-500 flex items-center gap-1">
              <ShieldAlert className="w-3 h-3 text-emerald-400" /> Parcels Valid
            </span>
            <p className="text-lg font-bold text-white font-mono mt-1">{stats?.topology_valid || 121} / 127</p>
          </div>
        </div>
      </div>

      {/* 7-Stage Stepper Checklist */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <h3 className="text-sm font-bold text-slate-200 mb-4 uppercase tracking-wider text-[11px] text-slate-400">
          Execution Checkpoints
        </h3>

        <div className="space-y-3">
          {PIPELINE_STAGES.map((stage, idx) => {
            const state = getStageState(stage.id, idx);
            return (
              <div
                key={stage.id}
                className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                  state === 'done'
                    ? 'bg-slate-950/40 border-emerald-500/20 text-slate-300'
                    : state === 'active'
                    ? 'bg-blue-950/30 border-blue-500/50 text-white shadow-md shadow-blue-500/10'
                    : 'bg-slate-950/20 border-slate-850 text-slate-600'
                }`}
              >
                <div className="flex items-center gap-3">
                  {state === 'done' ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  ) : state === 'active' ? (
                    <Loader2 className="w-5 h-5 text-cyan-400 animate-spin shrink-0" />
                  ) : (
                    <Clock className="w-5 h-5 text-slate-600 shrink-0" />
                  )}
                  <div>
                    <h4 className={`text-xs font-semibold ${state === 'active' ? 'text-blue-300' : ''}`}>
                      {stage.label}
                    </h4>
                    <p className="text-[11px] text-slate-500">{stage.desc}</p>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-mono uppercase font-semibold px-2 py-0.5 rounded ${
                    state === 'done'
                      ? 'bg-emerald-500/10 text-emerald-400'
                      : state === 'active'
                      ? 'bg-cyan-500/10 text-cyan-400 animate-pulse'
                      : 'text-slate-600'
                  }`}
                >
                  {state === 'done' ? 'Completed' : state === 'active' ? 'In Progress' : 'Queued'}
                </span>
              </div>
            );
          })}
        </div>

        {/* Action Button When Done */}
        {isCompleted && (
          <div className="mt-6 pt-5 border-t border-slate-800 flex justify-end">
            <button
              onClick={onViewInWebGIS}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-slate-950 font-bold text-xs py-3 px-6 rounded-xl shadow-lg shadow-cyan-500/30 transition-all hover:scale-[1.02]"
            >
              <span>Launch WebGIS Viewer</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Terminal Logs Simulation */}
      <div className="bg-slate-950 border border-slate-850 rounded-2xl p-4 font-mono text-xs text-slate-400">
        <div className="flex items-center gap-2 pb-2.5 mb-2.5 border-b border-slate-850 text-slate-500 text-[11px]">
          <Terminal className="w-3.5 h-3.5 text-cyan-400" />
          <span>System Console Logs</span>
        </div>
        <div className="space-y-1 text-[11px] max-h-36 overflow-y-auto">
          <p className="text-slate-500">[21:40:02] [FastAPI] Incoming job dispatched: Task ID #cad-9102</p>
          <p className="text-cyan-400">[21:40:03] [CV-Worker] Tiling Orthomosaic: 48 tiles generated with 20% overlap</p>
          <p className="text-blue-400">[21:40:04] [PyTorch-ML] Running SegFormer-B3 inference on batch size 8</p>
          <p className="text-slate-300">[21:40:05] [GIS-Engine] Extracting polygon contours & simplifying boundaries (tolerance 0.05m)</p>
          <p className="text-emerald-400">[21:40:06] [Topology] Validation complete: 121 valid, 4 auto-repaired, 2 flagged for review</p>
          {isCompleted && (
            <p className="text-emerald-300 font-semibold">[21:40:07] [PostGIS] Ingested 127 Cadastral Parcels ready for WebGIS visualization.</p>
          )}
        </div>
      </div>
    </div>
  );
}
