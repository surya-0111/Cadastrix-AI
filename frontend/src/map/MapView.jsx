import React, { useState, useEffect, useRef } from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  Compass, 
  Crosshair, 
  Info,
  Maximize2,
  Minimize2
} from 'lucide-react';
import MapLayers from './MapLayers';
import EditTools from './EditTools';

export default function MapView({ 
  parcels, 
  buildings, 
  roads, 
  selectedParcel, 
  onSelectParcel, 
  layers, 
  droneOpacity, 
  basemap,
  isEditingVertices,
  isMergeMode,
  mergeSourceParcel,
  onUpdateParcelGeometry,
  onFinishMerge
}) {
  // Spatial viewport state (Chennai T. Nagar coordinates)
  // Center ~ [80.2341, 13.0418]
  const [viewport, setViewport] = useState({
    centerLng: 80.2341,
    centerLat: 13.0418,
    zoom: 17.2,
  });

  const [panState, setPanState] = useState({ isPanning: false, startX: 0, startY: 0 });
  const containerRef = useRef(null);

  // Handle zoom in/out
  const handleZoomIn = () => {
    setViewport((prev) => ({ ...prev, zoom: Math.min(20, prev.zoom + 0.5) }));
  };

  const handleZoomOut = () => {
    setViewport((prev) => ({ ...prev, zoom: Math.max(14, prev.zoom - 0.5) }));
  };

  const handleResetBearing = () => {
    setViewport({
      centerLng: 80.2341,
      centerLat: 13.0418,
      zoom: 17.2,
    });
  };

  // Drag to pan map
  const handleMouseDown = (e) => {
    if (e.target.closest('.interactive-control')) return;
    setPanState({
      isPanning: true,
      startX: e.clientX,
      startY: e.clientY
    });
  };

  const handleMouseMove = (e) => {
    if (!panState.isPanning) return;
    const dx = e.clientX - panState.startX;
    const dy = e.clientY - panState.startY;

    // Scale displacement to degrees based on zoom level
    const scaleFactor = 0.000003 * Math.pow(2, 18 - viewport.zoom);
    setViewport((prev) => ({
      ...prev,
      centerLng: prev.centerLng - dx * scaleFactor,
      centerLat: prev.centerLat + dy * scaleFactor
    }));

    setPanState({
      isPanning: true,
      startX: e.clientX,
      startY: e.clientY
    });
  };

  const handleMouseUp = () => {
    setPanState({ isPanning: false, startX: 0, startY: 0 });
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.25 : -0.25;
    setViewport((prev) => ({
      ...prev,
      zoom: Math.min(20, Math.max(14, prev.zoom + delta))
    }));
  };

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onWheel={handleWheel}
      className="relative w-full h-full bg-slate-950 overflow-hidden select-none cursor-grab active:cursor-grabbing"
    >
      {/* Interactive GIS Rendering Engine */}
      <MapLayers
        viewport={viewport}
        parcels={parcels}
        buildings={buildings}
        roads={roads}
        selectedParcel={selectedParcel}
        onSelectParcel={onSelectParcel}
        layers={layers}
        droneOpacity={droneOpacity}
        basemap={basemap}
        isMergeMode={isMergeMode}
        mergeSourceParcel={mergeSourceParcel}
        onFinishMerge={onFinishMerge}
      />

      {/* Vertex Editor Overlay (Phase 8) */}
      {isEditingVertices && selectedParcel && (
        <EditTools
          viewport={viewport}
          selectedParcel={selectedParcel}
          onUpdateParcelGeometry={onUpdateParcelGeometry}
        />
      )}

      {/* MapLibre / GIS Navigation Controls */}
      <div className="absolute right-5 bottom-6 flex flex-col gap-1.5 interactive-control z-20">
        <button
          onClick={handleZoomIn}
          title="Zoom In"
          className="w-9 h-9 bg-slate-900/90 border border-slate-850 hover:bg-slate-800 text-slate-200 rounded-xl flex items-center justify-center shadow-xl transition-colors"
        >
          <ZoomIn className="w-4 h-4" />
        </button>

        <button
          onClick={handleZoomOut}
          title="Zoom Out"
          className="w-9 h-9 bg-slate-900/90 border border-slate-850 hover:bg-slate-800 text-slate-200 rounded-xl flex items-center justify-center shadow-xl transition-colors"
        >
          <ZoomOut className="w-4 h-4" />
        </button>

        <button
          onClick={handleResetBearing}
          title="Reset to Survey Center"
          className="w-9 h-9 bg-slate-900/90 border border-slate-850 hover:bg-slate-800 text-slate-200 rounded-xl flex items-center justify-center shadow-xl transition-colors"
        >
          <Crosshair className="w-4 h-4 text-blue-400" />
        </button>
      </div>

      {/* Coordinate & Scale Bar */}
      <div className="absolute left-5 bottom-4 flex items-center gap-3 bg-slate-900/80 border border-slate-800/80 px-3 py-1.5 rounded-lg text-[10px] font-mono text-slate-400 backdrop-blur-md z-10">
        <span>Lat: {viewport.centerLat.toFixed(5)}° N</span>
        <span className="text-slate-600">|</span>
        <span>Lng: {viewport.centerLng.toFixed(5)}° E</span>
        <span className="text-slate-600">|</span>
        <span>Zoom: {viewport.zoom.toFixed(1)}x</span>
        <span className="text-slate-600">|</span>
        <span className="text-emerald-400">EPSG:32644 (UTM 44N)</span>
      </div>
    </div>
  );
}
