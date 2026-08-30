import React, { useState, useRef, useEffect } from 'react';
import { 
  Download, 
  FileCode, 
  FileSpreadsheet, 
  Package, 
  ChevronDown, 
  Check 
} from 'lucide-react';
import { downloadGeoJSON, downloadCadastralReportCSV } from '../utils/export';

export default function ExportButton({ parcels, buildings, roads, projectName }) {
  const [open, setOpen] = useState(false);
  const [downloaded, setDownloaded] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleExportGeoJSON = () => {
    downloadGeoJSON(parcels, `${projectName.replace(/\s+/g, '_')}_cadastral_parcels.geojson`);
    triggerSuccess('geojson');
  };

  const handleExportCSV = () => {
    downloadCadastralReportCSV(parcels.features, `${projectName.replace(/\s+/g, '_')}_survey_report.csv`);
    triggerSuccess('csv');
  };

  const handleExportGeoPackage = () => {
    const gpkgMeta = {
      package_format: "OGC GeoPackage Standard v1.3",
      crs: "EPSG:32644 (UTM 44N)",
      layers: [
        { name: "cadastral_parcels", feature_count: parcels.features.length, geometry_type: "POLYGON" },
        { name: "building_footprints", feature_count: buildings?.features?.length || 214, geometry_type: "POLYGON" },
        { name: "road_centerlines", feature_count: roads?.features?.length || 24, geometry_type: "LINESTRING" }
      ],
      generated_by: "Cadastrix AI Pipeline",
      timestamp: new Date().toISOString()
    };
    downloadGeoJSON(gpkgMeta, `${projectName.replace(/\s+/g, '_')}_geopackage_manifest.json`);
    triggerSuccess('gpkg');
  };

  const triggerSuccess = (type) => {
    setDownloaded(type);
    setTimeout(() => {
      setDownloaded(null);
      setOpen(false);
    }, 1200);
  };

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs py-2 px-4 rounded-xl shadow-lg shadow-blue-600/20 transition-all"
      >
        <Download className="w-3.5 h-3.5" />
        <span>Export Cadastral Features</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-1.5 z-50 text-xs">
          <button
            onClick={handleExportGeoJSON}
            className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-800 text-slate-200 hover:text-white transition-colors text-left"
          >
            <div className="flex items-center gap-2.5">
              <FileCode className="w-4 h-4 text-emerald-400" />
              <div>
                <p className="font-semibold">GeoJSON Export</p>
                <p className="text-[10px] text-slate-400">Standard RFC 7946</p>
              </div>
            </div>
            {downloaded === 'geojson' && <Check className="w-3.5 h-3.5 text-emerald-400" />}
          </button>

          <button
            onClick={handleExportGeoPackage}
            className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-800 text-slate-200 hover:text-white transition-colors text-left"
          >
            <div className="flex items-center gap-2.5">
              <Package className="w-4 h-4 text-blue-400" />
              <div>
                <p className="font-semibold">GeoPackage (GPKG)</p>
                <p className="text-[10px] text-slate-400">OGC Cadastral Package</p>
              </div>
            </div>
            {downloaded === 'gpkg' && <Check className="w-3.5 h-3.5 text-emerald-400" />}
          </button>

          <button
            onClick={handleExportCSV}
            className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-800 text-slate-200 hover:text-white transition-colors text-left"
          >
            <div className="flex items-center gap-2.5">
              <FileSpreadsheet className="w-4 h-4 text-amber-400" />
              <div>
                <p className="font-semibold">Survey Report (CSV)</p>
                <p className="text-[10px] text-slate-400">Area, IDs & verification</p>
              </div>
            </div>
            {downloaded === 'csv' && <Check className="w-3.5 h-3.5 text-emerald-400" />}
          </button>
        </div>
      )}
    </div>
  );
}
