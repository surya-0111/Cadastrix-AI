import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  Wrench, 
  Scissors, 
  Merge, 
  ShieldCheck, 
  Info,
  Maximize2,
  Calendar,
  Layers,
  Building,
  TrendingUp
} from 'lucide-react';

export default function ParcelPanel({ 
  parcel, 
  onClose, 
  onApprove, 
  onSplit, 
  onStartMerge,
  onStartVertexEdit,
  isEditingVertices,
  isMergeMode
}) {
  if (!parcel) return null;

  const props = parcel.properties || {};
  const isApproved = props.survey_status === 'APPROVED';
  const isRepaired = props.survey_status === 'AUTO_REPAIRED';
  const hasIssue = !props.geometry_valid || props.issue;

  const coveragePercent = props.area_m2 ? ((props.building_m2 / props.area_m2) * 100).toFixed(1) : 0;

  return (
    <div className="bg-slate-900/95 border border-slate-800 rounded-2xl p-5 shadow-2xl backdrop-blur-md w-80 text-xs text-slate-200">
      {/* Header */}
      <div className="flex items-start justify-between pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-slate-500 uppercase">Cadastral Plot</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                props.geometry_valid
                  ? isRepaired
                    ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                    : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : 'bg-rose-500/10 text-rose-400 border-rose-500/30 animate-pulse'
              }`}
            >
              {props.geometry_valid ? (isRepaired ? 'AUTO-REPAIRED' : 'VALID') : 'REQUIRES REVIEW'}
            </span>
          </div>
          <h3 className="text-xl font-black font-mono text-white mt-0.5">
            Parcel {props.parcel_id || 'P017'}
          </h3>
        </div>

        <button
          onClick={onClose}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Primary Blueprint Metrics (Area, Building, Confidence, Geometry) */}
      <div className="py-4 space-y-3">
        <div className="bg-slate-950/80 rounded-xl p-3 border border-slate-850 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-medium flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-blue-400" /> Area:
            </span>
            <span className="font-mono font-bold text-sm text-white">
              {props.area_m2} m²
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-medium flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-cyan-400" /> Building:
            </span>
            <span className="font-mono font-bold text-sm text-cyan-300">
              {props.building_m2} m² <span className="text-[10px] text-slate-500">({coveragePercent}%)</span>
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-medium flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> Confidence:
            </span>
            <span
              className={`font-mono font-bold text-sm ${
                props.confidence >= 0.85
                  ? 'text-emerald-400'
                  : props.confidence >= 0.70
                  ? 'text-amber-400'
                  : 'text-rose-400'
              }`}
            >
              {Math.round(props.confidence * 100)}%
            </span>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-slate-850">
            <span className="text-slate-400 font-medium">Geometry:</span>
            <span
              className={`font-mono font-bold text-xs uppercase ${
                props.geometry_valid ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {props.geometry_valid ? 'VALID' : 'DEFECT DETECTED'}
            </span>
          </div>
        </div>

        {/* Issue Warning Box if Flagged */}
        {props.issue && (
          <div className="bg-amber-950/40 border border-amber-500/40 rounded-xl p-3 text-[11px] text-amber-200">
            <div className="flex items-center gap-1.5 font-bold mb-1 text-amber-400">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Topology Flag</span>
            </div>
            <p className="leading-relaxed">{props.issue}</p>
          </div>
        )}

        {/* Phase 8 Surveyor Verification Controls */}
        <div className="pt-2">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Phase 8: Human Verification & Editing
          </p>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onStartVertexEdit(parcel)}
              className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl font-semibold border transition-all ${
                isEditingVertices
                  ? 'bg-blue-600 border-blue-400 text-white shadow-lg shadow-blue-600/30'
                  : 'bg-slate-800/80 border-slate-700 text-slate-200 hover:bg-slate-750'
              }`}
            >
              <Wrench className="w-3 h-3 text-blue-400" />
              <span>{isEditingVertices ? 'Done Editing' : 'Move Vertex'}</span>
            </button>

            <button
              onClick={() => onSplit(parcel)}
              className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl font-semibold bg-slate-800/80 border border-slate-700 text-slate-200 hover:bg-slate-750 transition-all"
            >
              <Scissors className="w-3 h-3 text-amber-400" />
              <span>Split</span>
            </button>

            <button
              onClick={() => onStartMerge(parcel)}
              className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl font-semibold border transition-all ${
                isMergeMode
                  ? 'bg-amber-600 border-amber-400 text-white'
                  : 'bg-slate-800/80 border-slate-700 text-slate-200 hover:bg-slate-750'
              }`}
            >
              <Merge className="w-3 h-3 text-purple-400" />
              <span>{isMergeMode ? 'Cancel Merge' : 'Merge'}</span>
            </button>

            <button
              onClick={() => onApprove(parcel)}
              className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl font-semibold border transition-all ${
                isApproved
                  ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white border-transparent shadow-lg shadow-emerald-600/20'
              }`}
            >
              <ShieldCheck className="w-3 h-3" />
              <span>{isApproved ? 'Approved ✓' : 'Approve'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
