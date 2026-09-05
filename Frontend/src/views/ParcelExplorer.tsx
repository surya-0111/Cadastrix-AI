import { useState, useMemo } from "react";
import {
  Search, Filter, MapPin, Building2, Layers, CheckCircle2,
  AlertTriangle, ArrowUpDown, ChevronRight, ExternalLink, Download,
  SlidersHorizontal, Compass, ShieldCheck, Home, FileText
} from "lucide-react";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import ProgressBar from "../components/ui/ProgressBar";
import { downloadJson, downloadText } from "../utils/actions";
import { reportService } from "../services/reportService";
import { useCadastra } from "../context/CadastraContext";
import type { Parcel, ParcelStatus } from "../types";

interface ParcelExplorerProps {
  onToast: (msg: string, type?: "success" | "error" | "info" | "warning") => void;
}

export default function ParcelExplorer({ onToast }: ParcelExplorerProps) {
  const {
    parcels: rawParcels = [],
    selectedParcelId,
    setSelectedParcelId,
    acceptParcel,
    rejectParcel,
    navigateTo
  } = useCadastra();

  const parcels = rawParcels ?? [];
  const [search, setSearch] = useState("");
  const [selectedLandUse, setSelectedLandUse] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState<ParcelStatus | "all">("all");
  const [minConfidence, setMinConfidence] = useState(0);

  const landUses = useMemo(() => {
    const set = new Set(parcels.map(p => p.landUse).filter(Boolean));
    return ["all", ...Array.from(set)];
  }, [parcels]);

  const filteredParcels = useMemo(() => {
    return parcels.filter(p => {
      if (!p) return false;
      const matchSearch =
        !search ||
        (p.id && p.id.toLowerCase().includes(search.toLowerCase())) ||
        (p.surveyNo && p.surveyNo.toLowerCase().includes(search.toLowerCase())) ||
        (p.owner && p.owner.toLowerCase().includes(search.toLowerCase())) ||
        (p.ward && p.ward.toLowerCase().includes(search.toLowerCase())) ||
        (p.zone && p.zone.toLowerCase().includes(search.toLowerCase()));

      const matchLandUse = selectedLandUse === "all" || p.landUse === selectedLandUse;
      const matchStatus = selectedStatus === "all" || p.status === selectedStatus;
      const matchConf = (p.confidence ?? 0) >= minConfidence;

      return matchSearch && matchLandUse && matchStatus && matchConf;
    });
  }, [parcels, search, selectedLandUse, selectedStatus, minConfidence]);

  const selectedParcel = useMemo(() => {
    if (!parcels.length) return null;
    return parcels.find(p => p.id === selectedParcelId) || parcels[0] || null;
  }, [parcels, selectedParcelId]);

  const exportSelectedParcel = () => {
    if (!selectedParcel) return;
    downloadJson(`parcel-${selectedParcel.id}.json`, selectedParcel);
    onToast(`Exported record for ${selectedParcel.surveyNo}`, "success");
  };

  const exportFilteredParcels = () => {
    downloadJson(`cadastra-filtered-parcels.json`, {
      filterCount: filteredParcels.length,
      totalParcels: parcels.length,
      parcels: filteredParcels,
    });
    onToast(`Exported ${filteredParcels.length} parcels as JSON`, "success");
  };

  return (
    <div className="h-full overflow-y-auto p-4 lg:p-6 flex flex-col gap-5 bg-[#080e1a]">
      {/* Header Row */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="text-xs text-[#4a6a8a] font-mono uppercase tracking-wider mb-1">
            Cadastral Land Registry · Anna Nagar Cadastral Sector
          </div>
          <h1 className="text-xl font-semibold text-[#e2eaf4]">Parcel Explorer</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" icon={<Download size={13} />} onClick={exportFilteredParcels}>
            Export Results
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={<MapPin size={13} />}
            onClick={() => navigateTo("webgis", selectedParcel?.id)}
          >
            View in WebGIS
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#0d1526] border border-[rgba(30,60,100,0.5)] rounded-xl p-4 flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4a6a8a]" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by Survey No, Owner, Parcel ID, Ward..."
            className="w-full bg-[rgba(30,60,100,0.25)] border border-[rgba(30,60,100,0.5)] text-[#e2eaf4] placeholder-[#4a6a8a] text-xs rounded-lg pl-8 pr-3 py-2 focus:outline-none focus:border-[#00d4ff]"
          />
        </div>

        {/* Land use filter */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-[#7a9cc0] whitespace-nowrap">Land Use:</span>
          <select
            value={selectedLandUse}
            onChange={e => setSelectedLandUse(e.target.value)}
            className="bg-[rgba(30,60,100,0.25)] border border-[rgba(30,60,100,0.5)] text-[#e2eaf4] text-xs rounded-lg px-2.5 py-2 focus:outline-none"
          >
            {landUses.map(lu => (
              <option key={lu} value={lu}>
                {lu === "all" ? "All Land Uses" : lu}
              </option>
            ))}
          </select>
        </div>

        {/* Status filter */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-[#7a9cc0] whitespace-nowrap">Status:</span>
          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value as ParcelStatus | "all")}
            className="bg-[rgba(30,60,100,0.25)] border border-[rgba(30,60,100,0.5)] text-[#e2eaf4] text-xs rounded-lg px-2.5 py-2 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="validated">Verified</option>
            <option value="review">Review Required</option>
            <option value="error">Topology Error</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Main 2-Column Explorer: List on Left, Comprehensive Inspector on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Parcel Cards (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-3">
          <div className="flex items-center justify-between text-xs text-[#7a9cc0] font-mono px-1">
            <span>Showing {filteredParcels.length} parcels</span>
            <span>Sorted by cadastral ID</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredParcels.map(p => {
              const isSelected = selectedParcel?.id === p.id;
              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedParcelId(p.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? "bg-[rgba(0,212,255,0.08)] border-[#00d4ff] shadow-[0_0_12px_rgba(0,212,255,0.2)]"
                      : "bg-[#0d1526] border-[rgba(30,60,100,0.5)] hover:border-[rgba(30,60,100,0.9)] hover:bg-[rgba(13,21,38,0.8)]"
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div>
                        <div className="text-sm font-semibold text-[#e2eaf4]">{p.surveyNo}</div>
                        <div className="text-[11px] font-mono text-[#00d4ff]">{p.id}</div>
                      </div>
                      <Badge
                        variant={
                          p.status === "validated"
                            ? "green"
                            : p.status === "review"
                            ? "amber"
                            : p.status === "error"
                            ? "red"
                            : "muted"
                        }
                        dot
                      >
                        {p.status}
                      </Badge>
                    </div>

                    <div className="text-xs text-[#7a9cc0] mb-2">{p.owner}</div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-[#4a6a8a] bg-[rgba(8,14,26,0.5)] p-2 rounded-lg mb-2">
                      <div>
                        <span className="block text-[10px] text-[#4a6a8a]">Land Use</span>
                        <span className="text-[#e2eaf4]">{p.landUse}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-[#4a6a8a]">Area</span>
                        <span className="text-[#e2eaf4]">{p.area?.toLocaleString() ?? "—"} m²</span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-[#4a6a8a]">Buildings</span>
                        <span className="text-[#e2eaf4]">{p.buildings ?? 0}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-[#4a6a8a]">Errors</span>
                        <span className={(p.topologyErrors ?? 0) > 0 ? "text-[#ef4444] font-bold" : "text-[#10b981]"}>
                          {p.topologyErrors ?? 0}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[rgba(30,60,100,0.3)] flex items-center justify-between">
                    <span className="text-[10px] font-mono text-[#4a6a8a]">
                      Confidence: {p.confidence ?? 0}%
                    </span>
                    <span className="text-[11px] font-medium text-[#00d4ff] flex items-center gap-1">
                      Details <ChevronRight size={12} />
                    </span>
                  </div>
                </div>
              );
            })}

            {filteredParcels.length === 0 && (
              <div className="col-span-2 bg-[#0d1526] border border-[rgba(30,60,100,0.5)] rounded-xl p-10 text-center text-xs text-[#4a6a8a]">
                No parcels found matching your filter criteria.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: In-depth Parcel Details (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {selectedParcel ? (
            <div className="bg-[#0d1526] border border-[rgba(30,60,100,0.5)] rounded-xl p-5 flex flex-col gap-5 shadow-lg">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-mono text-[#4a6a8a]">PARCEL REGISTRY FILE</span>
                  <Badge
                    variant={
                      selectedParcel.status === "validated"
                        ? "green"
                        : selectedParcel.status === "review"
                        ? "amber"
                        : selectedParcel.status === "error"
                        ? "red"
                        : "muted"
                    }
                    dot
                  >
                    {selectedParcel.status.toUpperCase()}
                  </Badge>
                </div>
                <h2 className="text-xl font-bold text-[#e2eaf4]">{selectedParcel.surveyNo}</h2>
                <div className="text-xs font-mono text-[#00d4ff]">{selectedParcel.id}</div>
              </div>

              {/* Accept / Reject actions */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => acceptParcel(selectedParcel.id)}
                  disabled={selectedParcel.status === "validated"}
                  className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold font-mono transition-all ${
                    selectedParcel.status === "validated"
                      ? "bg-[rgba(16,185,129,0.12)] text-[#10b981] border border-[rgba(16,185,129,0.3)] cursor-default"
                      : "bg-[rgba(0,212,255,0.15)] hover:bg-[rgba(0,212,255,0.25)] text-[#00d4ff] border border-[rgba(0,212,255,0.4)]"
                  }`}
                >
                  <CheckCircle2 size={13} />
                  {selectedParcel.status === "validated" ? "VERIFIED" : "ACCEPT RECORD"}
                </button>

                <button
                  onClick={() => rejectParcel(selectedParcel.id)}
                  disabled={selectedParcel.status === "review"}
                  className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold font-mono transition-all ${
                    selectedParcel.status === "review"
                      ? "bg-[rgba(245,158,11,0.12)] text-[#f59e0b] border border-[rgba(245,158,11,0.3)] cursor-default"
                      : "bg-[rgba(239,68,68,0.15)] hover:bg-[rgba(239,68,68,0.25)] text-[#ffb4ab] border border-[rgba(239,68,68,0.4)]"
                  }`}
                >
                  <AlertTriangle size={13} />
                  {selectedParcel.status === "review" ? "UNDER REVIEW" : "FLAG REVIEW"}
                </button>
              </div>

              {/* Key Cadastral Data Grid */}
              <div className="bg-[#080e1a] p-3.5 rounded-xl border border-[rgba(30,60,100,0.4)] flex flex-col gap-2.5">
                <div className="text-[10px] font-semibold text-[#7a9cc0] uppercase tracking-wider mb-0.5">
                  Cadastral Registry Attributes
                </div>
                {[
                  { label: "Survey Number", value: selectedParcel.surveyNo },
                  { label: "Registered Owner", value: selectedParcel.owner },
                  { label: "Land Classification", value: selectedParcel.landUse },
                  { label: "Cadastral Area", value: `${selectedParcel.area?.toLocaleString() ?? "—"} m² (${((selectedParcel.area ?? 0) / 10000).toFixed(3)} ha)` },
                  { label: "Building Footprints", value: `${selectedParcel.buildings ?? 0} detected structures` },
                  { label: "Ward / Administrative Zone", value: `${selectedParcel.ward ?? "—"} · ${selectedParcel.zone ?? "—"}` },
                  { label: "Geometry Status", value: (selectedParcel.topologyErrors ?? 0) > 0 ? "Topology Anomaly" : "Clean Polygon" },
                  { label: "Last Reconciliation Date", value: selectedParcel.lastUpdated ?? "Recently" },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between items-center text-xs">
                    <span className="text-[#4a6a8a] text-[11px]">{label}</span>
                    <span className="font-mono text-[#e2eaf4] text-right font-medium">{value}</span>
                  </div>
                ))}
              </div>

              {/* Confidence Metrics */}
              <div className="bg-[#080e1a] p-3.5 rounded-xl border border-[rgba(30,60,100,0.4)]">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-[#7a9cc0]">AI Boundary Confidence</span>
                  <span className="text-xs font-mono font-bold text-[#00d4ff]">{selectedParcel.confidence ?? 0}%</span>
                </div>
                <ProgressBar
                  value={selectedParcel.confidence ?? 0}
                  color={
                    (selectedParcel.confidence ?? 0) > 90
                      ? "#10b981"
                      : (selectedParcel.confidence ?? 0) > 75
                      ? "#3b82f6"
                      : "#f59e0b"
                  }
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2">
                <Button
                  variant="primary"
                  size="md"
                  icon={<ExternalLink size={13} />}
                  className="w-full"
                  onClick={() => navigateTo("webgis", selectedParcel.id)}
                >
                  Locate in WebGIS Command Center
                </Button>

                <Button
                  variant="secondary"
                  size="md"
                  icon={<FileText size={13} />}
                  className="w-full"
                  onClick={() => {
                    reportService.generateParcelCertificate(selectedParcel);
                    onToast(`Generated PDF Certificate for ${selectedParcel.surveyNo}`, "success");
                  }}
                >
                  Download Parcel PDF Certificate
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  icon={<ShieldCheck size={13} />}
                  className="w-full"
                  onClick={() => navigateTo("validation", selectedParcel.id)}
                >
                  Reconcile in Validation Center
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  icon={<Download size={12} />}
                  className="w-full text-xs text-[#7a9cc0]"
                  onClick={exportSelectedParcel}
                >
                  Download GeoJSON Record
                </Button>
              </div>
            </div>
          ) : (
            <div className="bg-[#0d1526] border border-[rgba(30,60,100,0.5)] rounded-xl p-10 text-center text-xs text-[#4a6a8a]">
              Select a parcel from the explorer list to view full details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
