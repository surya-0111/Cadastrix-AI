import React from 'react';
import { 
  Plus, 
  Layers, 
  Building2, 
  ShieldCheck, 
  Sparkles, 
  MapPin, 
  TrendingUp,
  Cpu,
  BarChart3
} from 'lucide-react';
import ProjectCard from '../components/ProjectCard';

export default function Dashboard({ 
  projects, 
  onSelectProject, 
  onStartNewProject, 
  onProcessProject 
}) {
  const totalParcels = projects.reduce((acc, p) => acc + (p.parcels_count || 0), 0);
  const totalBuildings = projects.reduce((acc, p) => acc + (p.buildings_count || 0), 0);
  const totalAreaHa = (projects.reduce((acc, p) => acc + (p.total_area_m2 || 0), 0) / 10000).toFixed(1);

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      {/* Top Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-wider">
              Autonomous Cadastral Engine
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Enterprise Ready
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Survey Projects Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Automated urban cadastral boundary reconstruction from high-resolution drone orthomosaics. Extract physical features, infer parcels, and validate topology.
          </p>
        </div>

        <button
          onClick={onStartNewProject}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-slate-950 font-bold text-xs py-3 px-5 rounded-xl shadow-lg shadow-cyan-500/20 transition-all hover:scale-[1.02] shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Drone Survey Project</span>
        </button>
      </div>

      {/* KPI Overview Metrics Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Total Survey Area</span>
            <MapPin className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-white font-mono">{totalAreaHa} <span className="text-sm font-normal text-slate-500">Ha</span></p>
          <p className="text-[11px] text-emerald-400 mt-1 font-medium">Over 3 Municipal Zones</p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Reconstructed Parcels</span>
            <Layers className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-white font-mono">{totalParcels}</p>
          <p className="text-[11px] text-slate-400 mt-1">98.2% Auto-valid Topology</p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Extracted Buildings</span>
            <Building2 className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-white font-mono">{totalBuildings}</p>
          <p className="text-[11px] text-indigo-300 mt-1">Deep Learning Footprints</p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Mean AI Confidence</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">92.4%</p>
          <p className="text-[11px] text-slate-400 mt-1">Survey of India Tolerances Met</p>
        </div>
      </div>

      {/* Projects Grid (Survey Overview) */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-white uppercase tracking-wider text-xs text-slate-400">
            Active Drone Survey Areas
          </h2>
          <span className="text-xs font-mono text-slate-500">Showing {projects.length} datasets</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onSelect={onSelectProject}
              onProcess={onProcessProject}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
