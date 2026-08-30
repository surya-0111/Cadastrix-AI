import React from 'react';
import { 
  Layers, 
  Eye, 
  EyeOff, 
  Sliders, 
  Building2, 
  Route, 
  ShieldAlert, 
  Flame, 
  Image as ImageIcon,
  Map as MapIcon
} from 'lucide-react';

export default function LayerControl({ 
  layers, 
  onToggleLayer, 
  droneOpacity, 
  onChangeDroneOpacity,
  basemap,
  onChangeBasemap,
  stats
}) {
  return (
    <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-4 shadow-2xl backdrop-blur-md w-72 text-xs">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
        <div className="flex items-center gap-2 font-bold text-white">
          <Layers className="w-4 h-4 text-blue-400" />
          <span>Cadastral Layers</span>
        </div>
        <span className="text-[10px] font-mono bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded border border-blue-500/20">
          6 Layers
        </span>
      </div>

      {/* Layer Toggles */}
      <div className="space-y-2.5">
        {/* Drone Image */}
        <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-850">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={layers.drone}
                onChange={() => onToggleLayer('drone')}
                className="rounded border-slate-700 text-blue-600 focus:ring-0 focus:ring-offset-0 bg-slate-900"
              />
              <span className="text-slate-200 font-semibold flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
                Drone Orthomosaic
              </span>
            </label>
            <span className="text-[10px] text-slate-500 font-mono">GeoTIFF</span>
          </div>

          {/* Opacity Slider */}
          {layers.drone && (
            <div className="mt-2.5 pt-2 border-t border-slate-850/80 flex items-center gap-2 text-[11px]">
              <span className="text-slate-400 text-[10px]">Opacity:</span>
              <input
                type="range"
                min="0"
                max="100"
                value={droneOpacity}
                onChange={(e) => onChangeDroneOpacity(parseInt(e.target.value))}
                className="w-full accent-blue-500 h-1 bg-slate-800 rounded-lg cursor-pointer"
              />
              <span className="text-slate-400 font-mono text-[10px] w-7 text-right">
                {droneOpacity}%
              </span>
            </div>
          )}
        </div>

        {/* Parcels */}
        <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950/60 border border-slate-850">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={layers.parcels}
              onChange={() => onToggleLayer('parcels')}
              className="rounded border-slate-700 text-blue-600 focus:ring-0 focus:ring-offset-0 bg-slate-900"
            />
            <span className="text-slate-200 font-semibold flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-blue-500 border border-blue-300"></span>
              Parcels (Cadastre)
            </span>
          </label>
          <span className="text-[10px] text-blue-400 font-mono font-semibold">127</span>
        </div>

        {/* Buildings */}
        <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950/60 border border-slate-850">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={layers.buildings}
              onChange={() => onToggleLayer('buildings')}
              className="rounded border-slate-700 text-blue-600 focus:ring-0 focus:ring-offset-0 bg-slate-900"
            />
            <span className="text-slate-200 font-semibold flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-cyan-400" />
              AI Buildings
            </span>
          </label>
          <span className="text-[10px] text-cyan-400 font-mono font-semibold">214</span>
        </div>

        {/* Roads */}
        <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950/60 border border-slate-850">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={layers.roads}
              onChange={() => onToggleLayer('roads')}
              className="rounded border-slate-700 text-blue-600 focus:ring-0 focus:ring-offset-0 bg-slate-900"
            />
            <span className="text-slate-200 font-semibold flex items-center gap-1.5">
              <Route className="w-3.5 h-3.5 text-amber-400" />
              Road Network
            </span>
          </label>
          <span className="text-[10px] text-amber-400 font-mono font-semibold">24 seg</span>
        </div>

        {/* Invalid Geometry */}
        <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950/60 border border-slate-850">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={layers.invalidGeometry}
              onChange={() => onToggleLayer('invalidGeometry')}
              className="rounded border-slate-700 text-rose-500 focus:ring-0 focus:ring-offset-0 bg-slate-900"
            />
            <span className="text-slate-200 font-semibold flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
              Topology Defects
            </span>
          </label>
          <span className="text-[10px] text-rose-400 font-mono font-semibold">2 flagged</span>
        </div>

        {/* Confidence Heatmap */}
        <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950/60 border border-slate-850">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={layers.confidence}
              onChange={() => onToggleLayer('confidence')}
              className="rounded border-slate-700 text-emerald-500 focus:ring-0 focus:ring-offset-0 bg-slate-900"
            />
            <span className="text-slate-200 font-semibold flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-emerald-400" />
              Confidence Heatmap
            </span>
          </label>
          <span className="text-[10px] text-emerald-400 font-mono">AI Prob</span>
        </div>
      </div>

      {/* Basemap Switcher */}
      <div className="mt-4 pt-3 border-t border-slate-800">
        <div className="flex items-center justify-between mb-2">
          <span className="text-slate-400 font-medium text-[11px]">Basemap Style</span>
          <MapIcon className="w-3 h-3 text-slate-500" />
        </div>
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-850">
          <button
            onClick={() => onChangeBasemap('satellite')}
            className={`py-1 rounded-lg font-semibold text-[10px] transition-colors ${
              basemap === 'satellite' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Satellite
          </button>
          <button
            onClick={() => onChangeBasemap('dark')}
            className={`py-1 rounded-lg font-semibold text-[10px] transition-colors ${
              basemap === 'dark' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Dark Vector
          </button>
        </div>
      </div>
    </div>
  );
}
