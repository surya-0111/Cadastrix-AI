import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  CheckCircle2, 
  AlertTriangle, 
  RotateCcw, 
  Compass, 
  Layers, 
  SlidersHorizontal,
  Info,
  Maximize2
} from 'lucide-react';
import MapView from '../map/MapView';
import LayerControl from '../components/LayerControl';
import ParcelPanel from '../components/ParcelPanel';
import ExportButton from '../components/ExportButton';
import { splitPolygon } from '../utils/geojson';

export default function MapViewer({ 
  project, 
  parcels, 
  buildings, 
  roads, 
  onBackToDashboard,
  onReprocess,
  onUpdateParcel,
  onSplitParcel,
  onMergeParcels,
  showNotification
}) {
  // Layer visibility state
  const [layers, setLayers] = useState({
    drone: true,
    parcels: true,
    buildings: true,
    roads: true,
    invalidGeometry: true,
    confidence: false
  });

  const [droneOpacity, setDroneOpacity] = useState(80);
  const [basemap, setBasemap] = useState('satellite');

  // Currently selected parcel for inspection (defaults to P017 from blueprint)
  const [selectedParcel, setSelectedParcel] = useState(null);

  // Phase 8 verification mode states
  const [isEditingVertices, setIsEditingVertices] = useState(false);
  const [isMergeMode, setIsMergeMode] = useState(false);
  const [mergeSourceParcel, setMergeSourceParcel] = useState(null);

  useEffect(() => {
    if (parcels?.features?.length > 0 && !selectedParcel) {
      // Default to P017 as requested by the PM blueprint
      const p17 = parcels.features.find((f) => f.properties.parcel_id === 'P017');
      setSelectedParcel(p17 || parcels.features[0]);
    }
  }, [parcels]);

  const handleToggleLayer = (layerName) => {
    setLayers((prev) => ({ ...prev, [layerName]: !prev[layerName] }));
  };

  // Select parcel
  const handleSelectParcel = (feature) => {
    setSelectedParcel(feature);
    setIsEditingVertices(false);
  };

  // Approve parcel
  const handleApprove = (parcel) => {
    const updated = {
      ...parcel,
      properties: {
        ...parcel.properties,
        survey_status: 'APPROVED',
        geometry_valid: true,
        issue: null
      }
    };
    onUpdateParcel(parcel.properties.parcel_id, updated);
    setSelectedParcel(updated);
    showNotification(`Parcel ${parcel.properties.parcel_id} verified & stamped APPROVED.`);
  };

  // Split parcel
  const handleSplit = (parcel) => {
    const splitFeatures = splitPolygon(parcel);
    if (splitFeatures && splitFeatures.length === 2) {
      onSplitParcel(parcel.properties.parcel_id, splitFeatures);
      setSelectedParcel(splitFeatures[0]);
      showNotification(`Parcel ${parcel.properties.parcel_id} successfully split into ${splitFeatures[0].properties.parcel_id} & ${splitFeatures[1].properties.parcel_id}.`);
    }
  };

  // Start merge
  const handleStartMerge = (parcel) => {
    if (isMergeMode) {
      setIsMergeMode(false);
      setMergeSourceParcel(null);
    } else {
      setIsMergeMode(true);
      setMergeSourceParcel(parcel);
      showNotification(`Merge mode: Click an adjoining parcel to merge with ${parcel.properties.parcel_id}.`);
    }
  };

  // Finish merge
  const handleFinishMerge = (targetParcel) => {
    if (!mergeSourceParcel) return;
    onMergeParcels(mergeSourceParcel.properties.parcel_id, targetParcel.properties.parcel_id);
    setIsMergeMode(false);
    setMergeSourceParcel(null);
    showNotification(`Merged parcels ${mergeSourceParcel.properties.parcel_id} and ${targetParcel.properties.parcel_id}.`);
  };

  // Vertex geometry update
  const handleUpdateParcelGeometry = (parcelId, updates) => {
    onUpdateParcel(parcelId, updates);
    if (selectedParcel?.properties?.parcel_id === parcelId) {
      setSelectedParcel((prev) => ({
        ...prev,
        properties: { ...prev.properties, ...updates.properties },
        geometry: updates.geometry || prev.geometry
      }));
    }
  };

  // Stats calculation
  const validCount = parcels?.features?.filter((f) => f.properties.geometry_valid && !f.properties.issue).length || 0;
  const reviewCount = parcels?.features?.filter((f) => !f.properties.geometry_valid || f.properties.issue).length || 0;

  return (
    <div className="relative w-full h-[calc(100vh-64px)] flex flex-col overflow-hidden bg-slate-950">
      {/* Top Secondary Action Bar */}
      <div className="h-12 bg-slate-900/90 border-b border-slate-800 px-5 flex items-center justify-between z-20 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToDashboard}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white px-2 py-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </button>

          <div className="h-4 w-px bg-slate-800"></div>

          <div className="flex items-center gap-2">
            <h2 className="text-xs font-bold text-white font-mono">{project?.name || 'Chennai Cadastral Survey'}</h2>
            <span className="text-[10px] text-slate-500 font-mono hidden sm:inline">({project?.crs || 'EPSG:32644'})</span>
          </div>

          <div className="hidden md:flex items-center gap-2 ml-4">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {validCount} Valid
            </span>
            {reviewCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-amber-500/10 text-amber-400 border border-amber-500/20">
                {reviewCount} Review Needed
              </span>
            )}
          </div>
        </div>

        {/* Right Export Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onReprocess}
            title="Re-run AI & GIS Pipeline"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-xs transition-colors flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden lg:inline text-[11px]">Re-run Pipeline</span>
          </button>

          <ExportButton
            parcels={parcels}
            buildings={buildings}
            roads={roads}
            projectName={project?.name || 'Chennai_Cadastre'}
          />
        </div>
      </div>

      {/* Main Map Canvas Area */}
      <div className="relative flex-1 w-full h-full overflow-hidden">
        <MapView
          parcels={parcels}
          buildings={buildings}
          roads={roads}
          selectedParcel={selectedParcel}
          onSelectParcel={handleSelectParcel}
          layers={layers}
          droneOpacity={droneOpacity}
          basemap={basemap}
          isEditingVertices={isEditingVertices}
          isMergeMode={isMergeMode}
          mergeSourceParcel={mergeSourceParcel}
          onUpdateParcelGeometry={handleUpdateParcelGeometry}
          onFinishMerge={handleFinishMerge}
        />

        {/* Left Floating Layer Control */}
        <div className="absolute left-5 top-5 z-20">
          <LayerControl
            layers={layers}
            onToggleLayer={handleToggleLayer}
            droneOpacity={droneOpacity}
            onChangeDroneOpacity={setDroneOpacity}
            basemap={basemap}
            onChangeBasemap={setBasemap}
          />
        </div>

        {/* Right Floating Parcel Inspection Panel */}
        {selectedParcel && (
          <div className="absolute right-5 top-5 z-20">
            <ParcelPanel
              parcel={selectedParcel}
              onClose={() => setSelectedParcel(null)}
              onApprove={handleApprove}
              onSplit={handleSplit}
              onStartMerge={handleStartMerge}
              onStartVertexEdit={() => setIsEditingVertices(!isEditingVertices)}
              isEditingVertices={isEditingVertices}
              isMergeMode={isMergeMode}
            />
          </div>
        )}

        {/* Merge Notification Banner */}
        {isMergeMode && mergeSourceParcel && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-amber-600 text-white text-xs font-semibold px-5 py-2.5 rounded-xl shadow-2xl flex items-center gap-2.5 z-30 animate-bounce">
            <AlertTriangle className="w-4 h-4" />
            <span>Select target parcel on the map to merge with {mergeSourceParcel.properties.parcel_id}</span>
            <button
              onClick={() => {
                setIsMergeMode(false);
                setMergeSourceParcel(null);
              }}
              className="ml-2 text-xs bg-amber-800 px-2 py-0.5 rounded text-white hover:bg-amber-900"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
