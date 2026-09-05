import { useState } from "react";
import {
  Download, FileText, CheckCircle2, Layers, MapPin, Database,
  Archive, ShieldCheck, ExternalLink, HardDrive, Printer, ChevronRight
} from "lucide-react";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import { useCadastra } from "../context/CadastraContext";
import { downloadJson, downloadText } from "../utils/actions";
import { exportValidationAuditPdf, exportAnalyticsPdf, exportParcelPdf } from "../utils/pdfGenerator";

interface ExportsProps {
  onToast: (msg: string, type?: "success" | "error" | "info" | "warning") => void;
}

export default function Exports({ onToast }: ExportsProps) {
  const { parcels, projects, processedGeoJson, navigateTo } = useCadastra();

  const exportFormats = [
    {
      id: "validation-pdf",
      name: "Institutional Cadastral Audit Report",
      description: "Official governmental survey audit dossier containing parcel reconciliation metrics, sliver tolerance audits, surveyor sign-off blocks, and legal compliance declarations.",
      format: "PDF",
      icon: <FileText size={18} className="text-[#00d4ff]" />,
      featuresCount: `${parcels.length} parcels audited`,
      size: "Print-ready PDF",
      action: () => {
        const stats = {
          total: parcels.length,
          validated: parcels.filter(p => p.status === "validated").length,
          review: parcels.filter(p => p.status === "review").length,
          error: parcels.filter(p => p.status === "error").length,
          pending: parcels.filter(p => p.status === "pending").length,
          avgConf: (parcels.reduce((a, p) => a + p.confidence, 0) / (parcels.length || 1)).toFixed(1),
          topologyErrors: parcels.reduce((a, p) => a + p.topologyErrors, 0)
        };
        exportValidationAuditPdf(parcels, stats);
        onToast("Generated Institutional Audit PDF Report", "success");
      }
    },
    {
      id: "analytics-pdf",
      name: "GIS Operational Telemetry & Analytics Dossier",
      description: "Comprehensive municipal report with land use classification breakdowns, AI model confidence distributions, and topological reconciliation analytics.",
      format: "PDF",
      icon: <Printer size={18} className="text-[#10b981]" />,
      featuresCount: "Sector IV Telemetry",
      size: "Print-ready PDF",
      action: () => {
        const stats = {
          totalParcels: parcels.length,
          validationPercentage: Math.round((parcels.filter(p => p.status === "validated").length / (parcels.length || 1)) * 100),
          totalBuildings: parcels.reduce((a, p) => a + p.buildings, 0),
          avgConfidence: (parcels.reduce((a, p) => a + p.confidence, 0) / (parcels.length || 1)).toFixed(1),
          topologyRepairs: 14,
          reviewParcels: parcels.filter(p => p.status === "review").length,
          processingDuration: "18m 42s",
          totalAreaM2: parcels.reduce((a, p) => a + p.area, 0),
        };
        const landUseBreakdown = [
          { name: "Residential", count: 8, pct: 45 },
          { name: "Commercial", count: 4, pct: 28 },
          { name: "Institutional", count: 2, pct: 15 },
          { name: "Mixed Use", count: 1, pct: 12 },
        ];
        exportAnalyticsPdf(stats, landUseBreakdown);
        onToast("Generated GIS Operational Analytics PDF", "success");
      }
    },
    {
      id: "parcels-geojson",
      name: processedGeoJson ? "ML-CV Extracted Cadastral Fabric" : "Cadastral Fabric Boundaries",
      description: processedGeoJson
        ? `Real georeferenced cadastral boundaries (${processedGeoJson.features.length} features) extracted via ML-CV baseline pipeline in standard WGS84 GeoJSON.`
        : "Full georeferenced cadastral boundaries with survey IDs, area, and ownership records in standard GeoJSON.",
      format: "GeoJSON",
      icon: <Layers size={18} className="text-[#00d4ff]" />,
      featuresCount: processedGeoJson ? `${processedGeoJson.features.length} features` : `${parcels.length} parcels`,
      size: processedGeoJson ? "Real API GeoJSON" : "184 KB",
      action: () => {
        if (processedGeoJson) {
          downloadJson("cadastrix-ai-results.geojson", processedGeoJson);
          onToast("Downloaded Real ML-CV Cadastral Fabric (GeoJSON)", "success");
          return;
        }
        const geojson = {
          type: "FeatureCollection",
          crs: { type: "name", properties: { name: "urn:ogc:def:crs:EPSG::32644" } },
          features: parcels.map(p => ({
            type: "Feature",
            id: p.id,
            properties: p,
            geometry: {
              type: "Polygon",
              coordinates: [
                [
                  [80.2707, 13.0827],
                  [80.2721, 13.0827],
                  [80.2721, 13.0841],
                  [80.2707, 13.0841],
                  [80.2707, 13.0827]
                ]
              ]
            }
          }))
        };
        downloadJson("cadastra-parcels-fabric.geojson", geojson);
        onToast("Downloaded Cadastral Fabric (GeoJSON)", "success");
      }
    },
    {
      id: "buildings-geojson",
      name: "Building Footprint Vectors",
      description: "Planimetric rooftop polygons extracted via CadastraNet AI with building class and centroid elevation.",
      format: "GeoJSON",
      icon: <Layers size={18} className="text-[#3b82f6]" />,
      featuresCount: "8,914 structures",
      size: "1.4 MB",
      action: () => {
        downloadJson("cadastra-building-footprints.geojson", {
          type: "FeatureCollection",
          project: "Anna Nagar Cadastral Survey",
          count: 8914,
          sample: parcels.map(p => ({ parcelId: p.id, buildingCount: p.buildings }))
        });
        onToast("Downloaded Building Footprints (GeoJSON)", "success");
      }
    },
    {
      id: "cadastral-csv",
      name: "Land Registry Table (CSV)",
      description: "Tabular summary containing Survey Number, Ward, Zone, Land Classification, Area in m², and Owner Registry for municipal import.",
      format: "CSV",
      icon: <Database size={18} className="text-[#f59e0b]" />,
      featuresCount: `${parcels.length} records`,
      size: "12 KB",
      action: () => {
        const headers = "Parcel ID,Survey No,Ward,Zone,Land Use,Area (sqm),Buildings,Owner,Status,Confidence\n";
        const rows = parcels.map(p =>
          `"${p.id}","${p.surveyNo}","${p.ward}","${p.zone}","${p.landUse}",${p.area},${p.buildings},"${p.owner}","${p.status}",${p.confidence}`
        ).join("\n");
        downloadText("cadastra-land-registry-export.csv", headers + rows, "text/csv");
        onToast("Downloaded Land Registry CSV", "success");
      }
    },
    {
      id: "full-package",
      name: "Complete GIS Survey Package",
      description: "Comprehensive municipal package bundling GeoJSON layers, orthomosaic metadata, CRS projection definitions, and survey certificates.",
      format: "BUNDLE",
      icon: <Archive size={18} className="text-[#8b5cf6]" />,
      featuresCount: "All layers",
      size: "2.1 MB",
      action: () => {
        downloadJson("cadastra-full-survey-package.json", {
          meta: {
            project: "Anna Nagar Cadastral Survey",
            location: "Anna Nagar, Chennai, Tamil Nadu",
            crs: "EPSG:32644 - UTM Zone 44N",
            gsd: "5cm/pixel",
            surveyor: "Arjun Krishnamurthy (CMDA)"
          },
          parcels,
          projects
        });
        onToast("Downloaded Complete GIS Survey Package", "success");
      }
    }
  ];

  return (
    <div className="min-h-full w-full p-4 lg:p-6 pb-20 flex flex-col gap-6 bg-[#080e1a]">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="text-xs text-[#4a6a8a] font-mono uppercase tracking-wider mb-1">
            Spatial Data Distribution & Interoperability
          </div>
          <h1 className="text-xl font-semibold text-[#e2eaf4]">GIS Data Export Center</h1>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="green" dot>
            CRS: EPSG:32644 (UTM 44N)
          </Badge>
        </div>
      </div>

      {/* Overview Cards with Clear Interaction UX */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Clickable Card 1: 12 Parcels Ready -> Parcel Explorer */}
        <button
          type="button"
          onClick={() => navigateTo("parcel-explorer")}
          className="bg-[#0d1526] border border-[rgba(30,60,100,0.5)] hover:border-[rgba(0,212,255,0.4)] hover:bg-[rgba(13,21,38,0.85)] rounded-xl p-4 flex items-center justify-between text-left transition-all cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00d4ff]"
          title="View all ready parcels in Parcel Explorer"
          aria-label={`View ${parcels.length} parcels ready in Parcel Explorer`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[rgba(0,212,255,0.1)] border border-[rgba(0,212,255,0.3)] flex items-center justify-center text-[#00d4ff] group-hover:scale-105 transition-transform">
              <HardDrive size={18} />
            </div>
            <div>
              <div className="text-sm font-semibold text-[#e2eaf4] group-hover:text-[#00d4ff] transition-colors">
                {parcels.length} Parcels Ready
              </div>
              <div className="text-xs text-[#7a9cc0]">Anna Nagar Zone IV Dataset</div>
            </div>
          </div>
          <ChevronRight size={16} className="text-[#4a6a8a] group-hover:text-[#00d4ff] group-hover:translate-x-0.5 transition-all flex-shrink-0" />
        </button>

        {/* Clickable Card 2: 8 Verified -> Validation */}
        <button
          type="button"
          onClick={() => navigateTo("validation")}
          className="bg-[#0d1526] border border-[rgba(30,60,100,0.5)] hover:border-[rgba(16,185,129,0.4)] hover:bg-[rgba(13,21,38,0.85)] rounded-xl p-4 flex items-center justify-between text-left transition-all cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#10b981]"
          title="Inspect verified parcels in Validation Center"
          aria-label={`View ${parcels.filter(p => p.status === "validated").length} verified parcels in Validation Center`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[rgba(16,185,129,0.1)] border border-[rgba(16,185,129,0.3)] flex items-center justify-center text-[#10b981] group-hover:scale-105 transition-transform">
              <CheckCircle2 size={18} />
            </div>
            <div>
              <div className="text-sm font-semibold text-[#e2eaf4] group-hover:text-[#10b981] transition-colors">
                {parcels.filter(p => p.status === "validated").length} Verified
              </div>
              <div className="text-xs text-[#7a9cc0]">Ready for municipal handover</div>
            </div>
          </div>
          <ChevronRight size={16} className="text-[#4a6a8a] group-hover:text-[#10b981] group-hover:translate-x-0.5 transition-all flex-shrink-0" />
        </button>

        {/* Non-Clickable Card 3: OGC & PDF Compliant (Clearly Informational) */}
        <div className="bg-[#0d1526] border border-[rgba(30,60,100,0.5)] rounded-xl p-4 flex items-center justify-between select-none">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[rgba(139,92,246,0.1)] border border-[rgba(139,92,246,0.3)] flex items-center justify-center text-[#8b5cf6]">
              <ShieldCheck size={18} />
            </div>
            <div>
              <div className="text-sm font-semibold text-[#e2eaf4]">OGC & PDF Compliant</div>
              <div className="text-xs text-[#7a9cc0]">QGIS, ArcGIS, AutoCAD, Printable PDF</div>
            </div>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[rgba(139,92,246,0.1)] text-[#a78bfa] border border-[rgba(139,92,246,0.25)] flex-shrink-0">
            Verified
          </span>
        </div>
      </div>

      {/* Export Format List */}
      <div className="bg-[#0d1526] border border-[rgba(30,60,100,0.5)] rounded-xl overflow-hidden shadow-lg">
        <div className="px-5 py-4 border-b border-[rgba(30,60,100,0.4)] flex justify-between items-center bg-[#0a1120]">
          <h2 className="text-sm font-semibold text-[#e2eaf4]">Available Export Formats</h2>
          <span className="text-xs font-mono text-[#4a6a8a]">6 export formats configured</span>
        </div>

        <div className="divide-y divide-[rgba(30,60,100,0.25)]">
          {exportFormats.map(exp => (
            <div
              key={exp.id}
              className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-[rgba(30,60,100,0.15)] transition-colors"
            >
              <div className="flex items-start gap-4 flex-1">
                <div className="p-2.5 rounded-lg bg-[rgba(30,60,100,0.3)] border border-[rgba(30,60,100,0.5)] mt-0.5 flex-shrink-0">
                  {exp.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-[#e2eaf4]">{exp.name}</span>
                    <Badge variant={exp.format === "PDF" ? "green" : "cyan"}>{exp.format}</Badge>
                  </div>
                  <p className="text-xs text-[#7a9cc0] max-w-2xl leading-relaxed mb-2">
                    {exp.description}
                  </p>
                  <div className="flex items-center gap-4 text-[11px] font-mono text-[#4a6a8a]">
                    <span>Scope: {exp.featuresCount}</span>
                    <span>Format: {exp.size}</span>
                  </div>
                </div>
              </div>

              <div className="flex-shrink-0">
                <Button
                  variant={exp.format === "PDF" ? "primary" : "outline"}
                  size="sm"
                  icon={<Download size={13} />}
                  onClick={exp.action}
                >
                  Download {exp.format}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
