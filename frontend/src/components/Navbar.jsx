import React from 'react';
import { 
  Layers, 
  UploadCloud, 
  Activity, 
  Map, 
  ShieldCheck, 
  FolderGit2, 
  HelpCircle,
  Sparkles
} from 'lucide-react';

export default function Navbar({ activePage, setActivePage, activeProject, isLiveBackend }) {
  return (
    <header className="h-16 bg-slate-900/90 border-b border-slate-800 backdrop-blur-md px-5 flex items-center justify-between z-30 sticky top-0">
      {/* Brand & Project Info */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 p-0.5 shadow-lg shadow-blue-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Layers className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white tracking-tight text-base">Cadastrix AI</span>
              <span className="text-[10px] font-semibold uppercase tracking-wider bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full border border-blue-500/30">
                Cadastral AI
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">Urban Parcel & Feature Extraction</p>
          </div>
        </div>

        {/* Vertical divider */}
        <div className="h-6 w-px bg-slate-800 mx-1 hidden md:block"></div>

        {/* Active Project Tag */}
        {activeProject && (
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-750 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-slate-400">Project:</span>
            <span className="text-slate-200 font-semibold truncate max-w-[200px]">{activeProject.name}</span>
          </div>
        )}
      </div>

      {/* Navigation Tabs */}
      <nav className="flex items-center gap-1 bg-slate-950/60 p-1 rounded-xl border border-slate-800">
        <button
          onClick={() => setActivePage('dashboard')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activePage === 'dashboard'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <FolderGit2 className="w-3.5 h-3.5" />
          Dashboard
        </button>

        <button
          onClick={() => setActivePage('upload')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activePage === 'upload'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <UploadCloud className="w-3.5 h-3.5" />
          Upload Data
        </button>

        <button
          onClick={() => setActivePage('processing')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activePage === 'processing'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          Pipeline
        </button>

        <button
          onClick={() => setActivePage('map')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activePage === 'map'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Map className="w-3.5 h-3.5" />
          WebGIS Map
        </button>
      </nav>

      {/* Mode and Meta */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-md text-[11px] font-mono bg-slate-900 border border-slate-800">
          <span className={`w-1.5 h-1.5 rounded-full ${isLiveBackend ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
          <span className="text-slate-400">{isLiveBackend ? 'FastAPI API: Online' : 'Evaluation Demo Mode'}</span>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-800/40 px-2.5 py-1.5 rounded-lg border border-slate-800">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span className="font-medium text-slate-300">Phase 8 Ready</span>
        </div>
      </div>
    </header>
  );
}
