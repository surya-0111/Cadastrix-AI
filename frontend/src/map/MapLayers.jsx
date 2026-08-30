import React, { useMemo } from 'react';
import ParcelLayer from './ParcelLayer';
import BuildingLayer from './BuildingLayer';
import RoadLayer from './RoadLayer';

export default function MapLayers({
  viewport,
  parcels,
  buildings,
  roads,
  selectedParcel,
  onSelectParcel,
  layers,
  droneOpacity,
  basemap,
  isMergeMode,
  mergeSourceParcel,
  onFinishMerge
}) {
  // Convert geographic [lng, lat] to SVG viewport [x, y]
  const projectCoords = (lng, lat, width, height) => {
    const scale = Math.pow(2, viewport.zoom) * 140;
    const x = (lng - viewport.centerLng) * scale + width / 2;
    const y = -(lat - viewport.centerLat) * scale + height / 2;
    return [x, y];
  };

  const width = window.innerWidth || 1200;
  const height = window.innerHeight || 800;

  return (
    <div className="absolute inset-0 w-full h-full">
      {/* Basemap: High-Resolution Satellite or Dark Grid */}
      {basemap === 'satellite' ? (
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center opacity-85 transition-opacity"
          style={{
            backgroundImage: `url('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/17/59828/94833')`,
            backgroundSize: '380% 380%',
            backgroundPosition: '52% 48%'
          }}
        >
          {/* Subtle dark vignette to enhance vector cadastral contrast */}
          <div className="absolute inset-0 bg-slate-950/40"></div>
        </div>
      ) : (
        <div className="absolute inset-0 w-full h-full bg-slate-950">
          <div 
            className="absolute inset-0 w-full h-full opacity-20"
            style={{
              backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 1px)',
              backgroundSize: '24px 24px'
            }}
          ></div>
        </div>
      )}

      {/* Drone Orthomosaic Overlay with Opacity Control */}
      {layers.drone && (
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-150"
          style={{
            opacity: droneOpacity / 100,
            background: 'radial-gradient(ellipse at 50% 50%, rgba(16, 185, 129, 0.15), rgba(6, 182, 212, 0.2) 60%, transparent 85%)'
          }}
        >
          {/* Simulated orthomosaic texture with boundary grid */}
          <div className="absolute inset-16 border-2 border-dashed border-cyan-400/40 rounded-3xl">
            <span className="absolute top-3 left-4 text-[10px] font-mono text-cyan-300 bg-slate-950/80 px-2 py-0.5 rounded border border-cyan-500/30">
              Orthomosaic: Chennai_T_Nagar_GSD_3.5cm.tif
            </span>
          </div>
        </div>
      )}

      {/* Vector Layers Render Container */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <defs>
          <linearGradient id="parcelValidGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0.1" />
          </linearGradient>

          <linearGradient id="parcelFlagGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ef4444" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#b91c1c" stopOpacity="0.2" />
          </linearGradient>

          <linearGradient id="buildingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#0891b2" stopOpacity="0.45" />
          </linearGradient>
        </defs>

        {/* 1. Road Vectors */}
        {layers.roads && (
          <RoadLayer roads={roads} projectCoords={projectCoords} width={width} height={height} />
        )}

        {/* 2. Parcel Polygons */}
        {layers.parcels && (
          <ParcelLayer
            parcels={parcels}
            projectCoords={projectCoords}
            width={width}
            height={height}
            selectedParcel={selectedParcel}
            onSelectParcel={onSelectParcel}
            showInvalid={layers.invalidGeometry}
            showConfidence={layers.confidence}
            isMergeMode={isMergeMode}
            mergeSourceParcel={mergeSourceParcel}
            onFinishMerge={onFinishMerge}
          />
        )}

        {/* 3. Building Footprints */}
        {layers.buildings && (
          <BuildingLayer buildings={buildings} projectCoords={projectCoords} width={width} height={height} />
        )}
      </svg>
    </div>
  );
}
