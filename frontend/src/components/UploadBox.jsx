import React, { useState, useRef } from 'react';
import { 
  Upload, 
  FileText, 
  CheckCircle2, 
  Sparkles, 
  MapPin, 
  Compass, 
  Layers,
  ArrowRight,
  Info
} from 'lucide-react';

export default function UploadBox({ onUploadSubmit, onUseSampleData }) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [projectName, setProjectName] = useState('Urban Survey — Chennai Sector 5');
  const [location, setLocation] = useState('Panagal Park / T. Nagar, Chennai');
  const [crs, setCrs] = useState('EPSG:32644 - UTM 44N');
  const [gsd, setGsd] = useState('3.5');
  const inputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file) => {
    setSelectedFile({
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
      type: file.type || 'GeoTIFF / Orthomosaic'
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUploadSubmit({
      name: projectName,
      location: location,
      crs: crs,
      gsd_cm: parseFloat(gsd) || 3.5,
      file: selectedFile
    });
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Quick Demo Banner for Surveyors & Evaluators */}
      <div className="bg-gradient-to-r from-blue-900/40 via-cyan-900/30 to-blue-900/40 border border-cyan-500/30 rounded-2xl p-4 mb-6 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-500/20 rounded-xl border border-cyan-500/30 text-cyan-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Surveyor Benchmark Dataset Mode</h4>
            <p className="text-xs text-slate-300">
              Skip uploading massive 2GB GeoTIFF orthomosaic files. Load the pre-processed Chennai T. Nagar benchmark sample directly!
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onUseSampleData}
          className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-cyan-500/25 transition-all flex items-center gap-1.5 shrink-0"
        >
          <span>Load Sample Dataset</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-slate-900/90 border border-slate-800 rounded-2xl p-7 shadow-xl">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-white">Upload Drone Orthomosaic</h2>
          <p className="text-xs text-slate-400 mt-1">
            Ingest georeferenced raster imagery (GeoTIFF) to initiate the automated parcel and building extraction pipeline.
          </p>
        </div>

        {/* Drag & Drop Box */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 mb-6 ${
            dragActive
              ? 'border-blue-400 bg-blue-500/10 scale-[0.99]'
              : selectedFile
              ? 'border-emerald-500/50 bg-emerald-500/5'
              : 'border-slate-750 hover:border-blue-500/50 bg-slate-950/60'
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".tif,.tiff,.geotiff,.zip,.las"
            className="hidden"
            onChange={handleChange}
          />

          <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-4">
            <Upload className="w-7 h-7" />
          </div>

          {selectedFile ? (
            <div className="space-y-1">
              <div className="flex items-center justify-center gap-2 text-emerald-400 font-semibold text-sm">
                <CheckCircle2 className="w-4 h-4" />
                <span>{selectedFile.name}</span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                {selectedFile.size} • Georeferencing headers parsed
              </p>
              <p className="text-[11px] text-blue-400 pt-2 underline">Click to choose a different file</p>
            </div>
          ) : (
            <div>
              <p className="text-sm font-semibold text-slate-200">
                Drag and drop your GeoTIFF drone image here, or <span className="text-blue-400 underline">browse</span>
              </p>
              <p className="text-xs text-slate-400 mt-1.5">
                Supported formats: .tif, .tiff, .geotiff (WGS84 or UTM projected)
              </p>
              <div className="inline-block mt-4 px-3 py-1 rounded-full bg-slate-800/80 text-[11px] font-mono text-slate-400 border border-slate-700">
                Max recommended size: 1.5 GB per scene
              </div>
            </div>
          )}
        </div>

        {/* Survey Metadata Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Project Survey Title
            </label>
            <input
              type="text"
              required
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="e.g. Chennai Urban Cadastre"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Location / Revenue Ward
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="e.g. T. Nagar Zone 4"
              />
              <MapPin className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Coordinate Reference System (CRS)
            </label>
            <div className="relative">
              <select
                value={crs}
                onChange={(e) => setCrs(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-blue-500 transition-colors appearance-none cursor-pointer"
              >
                <option value="EPSG:32644 - UTM 44N">EPSG:32644 (UTM 44N - Tamil Nadu/South India)</option>
                <option value="EPSG:4326 - WGS 84">EPSG:4326 (WGS 84 Geographic)</option>
                <option value="EPSG:7761 - India Zone IV">EPSG:7761 (Survey of India Zone IV)</option>
                <option value="EPSG:3857 - Web Mercator">EPSG:3857 (Pseudo-Mercator)</option>
              </select>
              <Compass className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Ground Sampling Distance (GSD)
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.1"
                min="0.5"
                max="25.0"
                value={gsd}
                onChange={(e) => setGsd(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="3.5"
              />
              <span className="absolute right-3 top-2.5 text-xs text-slate-500 font-mono">cm/px</span>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
          <button
            type="submit"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs py-3 px-6 rounded-xl shadow-lg shadow-blue-600/30 transition-all hover:scale-[1.01]"
          >
            <span>Proceed to AI Preprocessing & Tiling</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
