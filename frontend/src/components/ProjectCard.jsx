import React from 'react';
import { 
  MapPin, 
  Calendar, 
  Layers, 
  Building2, 
  Route, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight,
  ExternalLink
} from 'lucide-react';

export default function ProjectCard({ project, onSelect, onProcess }) {
  const isComplete = project.status === 'Completed';

  return (
    <div className="bg-slate-900/80 border border-slate-800 hover:border-blue-500/50 rounded-2xl p-6 transition-all duration-200 hover:shadow-xl hover:shadow-blue-500/5 flex flex-col justify-between group">
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
              {project.crs}
            </span>
            <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
              {project.name}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">{project.subtext}</p>
          </div>
          <span
            className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
              isComplete
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : 'bg-amber-500/10 text-amber-400 border-amber-500/30 animate-pulse'
            }`}
          >
            {project.status}
          </span>
        </div>

        {/* Location & Date */}
        <div className="flex items-center gap-4 text-xs text-slate-400 mb-5 pb-4 border-b border-slate-800/80">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-blue-400" />
            <span>{project.location}</span>
          </div>
          <div className="flex items-center gap-1.5 font-mono text-[11px]">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span>{project.date}</span>
          </div>
        </div>

        {/* Extracted Metrics Grid */}
        <div className="grid grid-cols-3 gap-2.5 mb-5">
          <div className="bg-slate-950/70 border border-slate-800/60 p-2.5 rounded-xl">
            <div className="flex items-center gap-1 text-slate-500 text-[10px] uppercase font-semibold">
              <Layers className="w-3 h-3 text-cyan-400" />
              <span>Parcels</span>
            </div>
            <p className="text-base font-bold text-white mt-1 font-mono">{project.parcels_count}</p>
            <p className="text-[10px] text-slate-500">{(project.total_area_m2 / 10000).toFixed(1)} Hectares</p>
          </div>

          <div className="bg-slate-950/70 border border-slate-800/60 p-2.5 rounded-xl">
            <div className="flex items-center gap-1 text-slate-500 text-[10px] uppercase font-semibold">
              <Building2 className="w-3 h-3 text-blue-400" />
              <span>Buildings</span>
            </div>
            <p className="text-base font-bold text-white mt-1 font-mono">{project.buildings_count}</p>
            <p className="text-[10px] text-emerald-400 font-medium">AI Footprints</p>
          </div>

          <div className="bg-slate-950/70 border border-slate-800/60 p-2.5 rounded-xl">
            <div className="flex items-center gap-1 text-slate-500 text-[10px] uppercase font-semibold">
              <Route className="w-3 h-3 text-amber-400" />
              <span>Roads</span>
            </div>
            <p className="text-base font-bold text-white mt-1 font-mono">{project.roads_km} km</p>
            <p className="text-[10px] text-slate-500">Network</p>
          </div>
        </div>

        {/* Topology Health Status */}
        <div className="bg-slate-950/40 rounded-xl p-3 border border-slate-800/60 mb-5">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-slate-400 font-medium">Cadastral Topology Health</span>
            <span className="text-emerald-400 font-mono text-[11px] font-semibold">
              {project.valid_parcels}/{project.parcels_count} Valid
            </span>
          </div>
          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden flex">
            <div
              style={{ width: `${(project.valid_parcels / Math.max(1, project.parcels_count)) * 100}%` }}
              className="bg-emerald-500"
            ></div>
            <div
              style={{ width: `${(project.repaired_parcels / Math.max(1, project.parcels_count)) * 100}%` }}
              className="bg-blue-400"
            ></div>
            <div
              style={{ width: `${(project.review_parcels / Math.max(1, project.parcels_count)) * 100}%` }}
              className="bg-amber-400"
            ></div>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-2 font-mono">
            <span className="flex items-center gap-1 text-emerald-400">
              <CheckCircle2 className="w-3 h-3" /> {project.valid_parcels} valid
            </span>
            {project.repaired_parcels > 0 && (
              <span className="text-blue-400">+{project.repaired_parcels} repaired</span>
            )}
            {project.review_parcels > 0 && (
              <span className="flex items-center gap-1 text-amber-400">
                <AlertTriangle className="w-3 h-3" /> {project.review_parcels} need review
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex items-center gap-2 pt-2">
        {isComplete ? (
          <button
            onClick={() => onSelect(project)}
            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold py-2.5 px-4 rounded-xl shadow-lg shadow-blue-600/20 transition-colors"
          >
            <span>Open WebGIS Viewer</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        ) : (
          <button
            onClick={() => onProcess(project)}
            className="flex-1 flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold py-2.5 px-4 rounded-xl shadow-lg shadow-amber-600/20 transition-colors"
          >
            <span>Run Pipeline</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
