import { useState, useMemo } from "react";
import {
  Search, Filter, CheckCircle2, XCircle, AlertTriangle, Clock,
  ChevronUp, ChevronDown, ChevronRight, Eye, Edit2, X, BarChart2,
  MapPin, ShieldAlert, Sparkles, Check, ArrowRight, ExternalLink, RefreshCw, FileText
} from "lucide-react";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import ProgressBar from "../components/ui/ProgressBar";
import Modal from "../components/ui/Modal";
import type { Parcel, ParcelStatus } from "../types";
import { downloadJson } from "../utils/actions";
import { exportValidationAuditPdf } from "../utils/pdfGenerator";
import { useCadastra } from "../context/CadastraContext";

interface ValidationProps {
  onToast: (msg: string, type?: "success" | "error" | "info" | "warning") => void;
}

type SortKey = "id" | "area" | "confidence" | "topologyErrors" | "status";
type SortDir = "asc" | "desc";

const STATUS_FILTER_OPTIONS: (ParcelStatus | "all")[] = ["all", "validated", "review", "error", "pending"];

// Mini SVG map showing the parcel grid with active selection highlight
function MiniValidationMap({
  parcels,
  selectedParcelId,
  onSelectParcel
}: {
  parcels: Parcel[];
  selectedParcelId: string | null;
  onSelectParcel: (id: string) => void;
}) {
  const shapes = [
    { id: "CHN-AN-001-2025", points: "20,15 50,13 52,32 22,34" },
    { id: "CHN-AN-002-2025", points: "50,13 80,11 83,30 52,32" },
    { id: "CHN-AN-003-2025", points: "80,11 110,10 112,29 83,30" },
    { id: "CHN-AN-004-2025", points: "22,34 52,32 54,52 24,54" },
    { id: "CHN-AN-005-2025", points: "52,32 83,30 85,50 54,52" },
    { id: "CHN-AN-006-2025", points: "83,30 112,29 115,49 85,50" },
    { id: "CHN-AN-007-2025", points: "24,54 54,52 56,73 26,75" },
    { id: "CHN-AN-008-2025", points: "54,52 85,50 87,71 56,73" },
    { id: "CHN-AN-009-2025", points: "85,50 115,49 117,69 87,71" },
    { id: "CHN-AN-010-2025", points: "26,75 56,73 58,90 27,91" },
    { id: "CHN-AN-011-2025", points: "56,73 87,71 89,89 58,90" },
    { id: "CHN-AN-012-2025", points: "87,71 117,69 119,88 89,89" },
  ];

  return (
    <svg viewBox="0 0 140 105" className="w-full h-full bg-[#080e1a] rounded-lg">
      <defs>
        <pattern id="mini-grid" width="10" height="10" patternUnits="userSpaceOnUse">
          <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(30,60,100,0.3)" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="140" height="105" fill="url(#mini-grid)" />

      {shapes.map(s => {
        const parcel = parcels.find(p => p.id === s.id);
        const isSel = selectedParcelId === s.id;
        const status = parcel ? parcel.status : "validated";

        let fill = "rgba(16,185,129,0.2)";
        let stroke = "#10b981";
        if (status === "review") { fill = "rgba(245,158,11,0.25)"; stroke = "#f59e0b"; }
        else if (status === "error") { fill = "rgba(239,68,68,0.3)"; stroke = "#ef4444"; }
        else if (status === "pending") { fill = "rgba(122,156,192,0.15)"; stroke = "#4a6a8a"; }

        if (isSel) {
          fill = "rgba(0,212,255,0.45)";
          stroke = "#00d4ff";
        }

        return (
          <polygon
            key={s.id}
            points={s.points}
            fill={fill}
            stroke={stroke}
            strokeWidth={isSel ? "1.5" : "0.75"}
            onClick={() => onSelectParcel(s.id)}
            style={{ cursor: "pointer" }}
            className="transition-colors hover:opacity-80"
          />
        );
      })}
    </svg>
  );
}

export default function Validation({ onToast }: ValidationProps) {
  const {
    parcels,
    selectedParcelId,
    setSelectedParcelId,
    acceptParcel,
    rejectParcel,
    repairParcelTopology,
    batchApproveParcels,
    navigateTo
  } = useCadastra();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ParcelStatus | "all">("all");
  const [landUseFilter, setLandUseFilter] = useState("all");
  const [sortKey, setSortKey] = useState<SortKey>("status");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [repairModal, setRepairModal] = useState(false);
  const [rejectModal, setRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [batchModal, setBatchModal] = useState(false);

  const landUses = ["all", ...Array.from(new Set(parcels.map(p => p.landUse)))];

  const selectedParcel = useMemo(() => {
    return parcels.find(p => p.id === selectedParcelId) || parcels[0] || null;
  }, [parcels, selectedParcelId]);

  const sorted = useMemo(() => {
    let list = parcels.filter(p => {
      const matchSearch =
        !search ||
        p.id.toLowerCase().includes(search.toLowerCase()) ||
        p.surveyNo.toLowerCase().includes(search.toLowerCase()) ||
        p.owner.toLowerCase().includes(search.toLowerCase()) ||
        p.landUse.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "all" || p.status === statusFilter;
      const matchLU = landUseFilter === "all" || p.landUse === landUseFilter;
      return matchSearch && matchStatus && matchLU;
    });

    list.sort((a, b) => {
      let va: number | string = a[sortKey];
      let vb: number | string = b[sortKey];
      if (typeof va === "string" && typeof vb === "string") {
        return sortDir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
      }
      return sortDir === "asc" ? (va as number) - (vb as number) : (vb as number) - (va as number);
    });

    return list;
  }, [parcels, search, statusFilter, landUseFilter, sortKey, sortDir]);

  const stats = useMemo(() => {
    const total = parcels.length;
    const validated = parcels.filter(p => p.status === "validated").length;
    const review = parcels.filter(p => p.status === "review").length;
    const error = parcels.filter(p => p.status === "error").length;
    const pending = parcels.filter(p => p.status === "pending").length;
    const avgConf = (parcels.reduce((a, p) => a + p.confidence, 0) / (total || 1)).toFixed(1);
    const topologyErrors = parcels.reduce((a, p) => a + p.topologyErrors, 0);
    return { total, validated, review, error, pending, avgConf, topologyErrors };
  }, [parcels]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const SortIcon = ({ k }: { k: SortKey }) =>
    sortKey === k ? (
      sortDir === "asc" ? <ChevronUp size={11} /> : <ChevronDown size={11} />
    ) : (
      <ChevronDown size={11} className="opacity-30" />
    );

  const exportReport = () => {
    downloadJson("cadastra-validation-audit.json", {
      generatedAt: new Date().toISOString(),
      stats,
      parcels
    });
    onToast("Validation report downloaded as JSON", "success");
  };

  const exportPdf = () => {
    exportValidationAuditPdf(parcels, stats);
    onToast("Generated Validation Audit PDF Report", "success");
  };

  const handleConfirmReject = () => {
    if (!selectedParcel) return;
    rejectParcel(selectedParcel.id, rejectReason || "Flagged for surveyor boundary verification");
    setRejectModal(false);
    setRejectReason("");
  };

  const handleConfirmBatchApprove = () => {
    const count = batchApproveParcels();
    setBatchModal(false);
  };

  return (
    <div className="h-full overflow-y-auto p-4 lg:p-6 flex flex-col gap-5 bg-[#080e1a]">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="text-xs text-[#4a6a8a] font-mono uppercase tracking-wider mb-1">
            Anna Nagar · Batch AN-34-C3 · Topology Audit Center
          </div>
          <h1 className="text-xl font-semibold text-[#e2eaf4]">Validation & Reconciliation</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" icon={<FileText size={13} />} onClick={exportPdf}>
            PDF Audit Report
          </Button>
          <Button variant="ghost" size="sm" onClick={exportReport}>
            Export JSON
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={<CheckCircle2 size={13} />}
            onClick={() => setBatchModal(true)}
          >
            Batch Approve All
          </Button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {[
          { label: "Total", value: stats.total, color: "#7a9cc0", onClick: () => setStatusFilter("all") },
          { label: "Verified", value: stats.validated, color: "#10b981", onClick: () => setStatusFilter("validated") },
          { label: "Review Req.", value: stats.review, color: "#f59e0b", onClick: () => setStatusFilter("review") },
          { label: "Errors", value: stats.error, color: "#ef4444", onClick: () => setStatusFilter("error") },
          { label: "Pending", value: stats.pending, color: "#4a6a8a", onClick: () => setStatusFilter("pending") },
          { label: "Avg Conf.", value: `${stats.avgConf}%`, color: "#00d4ff" },
          { label: "Topo Issues", value: stats.topologyErrors, color: "#f59e0b" },
        ].map(m => (
          <button
            key={m.label}
            onClick={m.onClick}
            className={`bg-[#0d1526] border border-[rgba(30,60,100,0.5)] rounded-xl p-3 text-left transition-colors ${
              m.onClick ? "hover:border-[rgba(0,212,255,0.4)] cursor-pointer" : ""
            }`}
          >
            <div className="text-[10px] font-medium text-[#4a6a8a] uppercase tracking-wider mb-1">{m.label}</div>
            <div className="text-xl font-mono font-semibold" style={{ color: m.color }}>{m.value}</div>
          </button>
        ))}
      </div>

      {/* Validation Health Progress */}
      <div className="bg-[#0d1526] border border-[rgba(30,60,100,0.5)] rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs font-semibold text-[#7a9cc0] uppercase tracking-wider flex items-center gap-1.5">
            <BarChart2 size={12} className="text-[#00d4ff]" /> Operational Health
          </div>
          <span className="text-xs font-mono text-[#00d4ff]">
            {((stats.validated / (stats.total || 1)) * 100).toFixed(0)}% verified
          </span>
        </div>
        <div className="flex gap-1 h-2.5 rounded-full overflow-hidden mb-2 bg-[#080e1a]">
          {[
            { w: (stats.validated / (stats.total || 1)) * 100, color: "#10b981" },
            { w: (stats.review / (stats.total || 1)) * 100, color: "#f59e0b" },
            { w: (stats.error / (stats.total || 1)) * 100, color: "#ef4444" },
            { w: (stats.pending / (stats.total || 1)) * 100, color: "#4a6a8a" },
          ].map((s, i) => (
            <div
              key={i}
              className="h-full rounded-sm transition-all duration-300"
              style={{ width: `${s.w}%`, backgroundColor: s.color }}
            />
          ))}
        </div>
        <div className="flex gap-4 text-[10px] font-mono flex-wrap">
          {[
            { label: "Verified", color: "#10b981", count: stats.validated },
            { label: "Requires Review", color: "#f59e0b", count: stats.review },
            { label: "Topology Error", color: "#ef4444", count: stats.error },
            { label: "Pending Intake", color: "#4a6a8a", count: stats.pending },
          ].map(l => (
            <div key={l.label} className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: l.color }} />
              <span className="text-[#7a9cc0]">
                {l.label} ({l.count})
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Split: Parcel Table on Left, Interactive Diagnostics Inspector on Right */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Left Column: Filter and Parcel List */}
        <div className="xl:col-span-2 flex flex-col gap-4">
          {/* Filter Bar */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 min-w-0 max-w-xs">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#4a6a8a]" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search parcels or owners…"
                className="w-full bg-[#0d1526] border border-[rgba(30,60,100,0.5)] text-[#e2eaf4] placeholder-[#4a6a8a] text-xs rounded-md pl-7 pr-3 py-1.5 focus:outline-none focus:border-[rgba(0,212,255,0.4)]"
              />
            </div>

            <div className="flex items-center gap-1 flex-wrap">
              {STATUS_FILTER_OPTIONS.map(s => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-2.5 py-1 rounded text-[11px] font-mono transition-colors ${
                    statusFilter === s
                      ? "bg-[rgba(0,212,255,0.15)] text-[#00d4ff] border border-[rgba(0,212,255,0.3)]"
                      : "text-[#4a6a8a] hover:text-[#7a9cc0]"
                  }`}
                >
                  {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>

            <select
              value={landUseFilter}
              onChange={e => setLandUseFilter(e.target.value)}
              className="bg-[#0d1526] border border-[rgba(30,60,100,0.5)] text-[#7a9cc0] text-xs rounded-md px-2.5 py-1.5 focus:outline-none"
            >
              {landUses.map(lu => (
                <option key={lu} value={lu}>
                  {lu === "all" ? "All land uses" : lu}
                </option>
              ))}
            </select>
          </div>

          {/* Table */}
          <div className="bg-[#0d1526] border border-[rgba(30,60,100,0.5)] rounded-xl overflow-hidden shadow-md">
            <div className="overflow-x-auto">
              <table className="w-full text-xs" role="table">
                <thead>
                  <tr className="border-b border-[rgba(30,60,100,0.5)] bg-[#0a1222]">
                    {[
                      { label: "Parcel ID", key: "id" as SortKey },
                      { label: "Survey No.", key: null },
                      { label: "Land Use", key: null },
                      { label: "Area (m²)", key: "area" as SortKey },
                      { label: "Confidence", key: "confidence" as SortKey },
                      { label: "Topo Issues", key: "topologyErrors" as SortKey },
                      { label: "Status", key: "status" as SortKey },
                      { label: "Action", key: null },
                    ].map(col => (
                      <th
                        key={col.label}
                        className={`px-3.5 py-3 text-left text-[10px] font-medium text-[#4a6a8a] uppercase tracking-wider ${
                          col.key ? "cursor-pointer hover:text-[#7a9cc0] select-none" : ""
                        }`}
                        onClick={() => col.key && toggleSort(col.key)}
                      >
                        <div className="flex items-center gap-1">
                          {col.label}
                          {col.key && <SortIcon k={col.key} />}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[rgba(30,60,100,0.25)]">
                  {sorted.map(parcel => {
                    const isSelected = selectedParcel?.id === parcel.id;
                    return (
                      <tr
                        key={parcel.id}
                        className={`transition-colors cursor-pointer ${
                          isSelected
                            ? "bg-[rgba(0,212,255,0.08)] border-l-2 border-l-[#00d4ff]"
                            : "hover:bg-[rgba(30,60,100,0.2)]"
                        }`}
                        onClick={() => setSelectedParcelId(parcel.id)}
                      >
                        <td className="px-3.5 py-3 font-mono text-[#00d4ff] font-medium">
                          {parcel.id}
                        </td>
                        <td className="px-3.5 py-3 text-[#e2eaf4] font-medium">
                          {parcel.surveyNo}
                        </td>
                        <td className="px-3.5 py-3 text-[#7a9cc0]">{parcel.landUse}</td>
                        <td className="px-3.5 py-3 font-mono text-[#7a9cc0]">
                          {parcel.area.toLocaleString()}
                        </td>
                        <td className="px-3.5 py-3">
                          <div className="flex items-center gap-2">
                            <ProgressBar
                              value={parcel.confidence}
                              color={
                                parcel.confidence > 90
                                  ? "#10b981"
                                  : parcel.confidence > 75
                                  ? "#3b82f6"
                                  : "#f59e0b"
                              }
                              height={3}
                              className="w-14"
                            />
                            <span className="font-mono text-[#7a9cc0] text-[11px]">
                              {parcel.confidence}%
                            </span>
                          </div>
                        </td>
                        <td className="px-3.5 py-3 font-mono">
                          {parcel.topologyErrors > 0 ? (
                            <span className="text-[#ef4444] font-bold flex items-center gap-1">
                              <AlertTriangle size={11} /> {parcel.topologyErrors}
                            </span>
                          ) : (
                            <span className="text-[#10b981]">0</span>
                          )}
                        </td>
                        <td className="px-3.5 py-3">
                          <Badge
                            variant={
                              parcel.status === "validated"
                                ? "green"
                                : parcel.status === "review"
                                ? "amber"
                                : parcel.status === "error"
                                ? "red"
                                : "muted"
                            }
                            dot
                          >
                            {parcel.status}
                          </Badge>
                        </td>
                        <td className="px-3.5 py-3">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={e => {
                                e.stopPropagation();
                                setSelectedParcelId(parcel.id);
                              }}
                              className={`p-1.5 rounded transition-colors ${
                                isSelected
                                  ? "text-[#00d4ff] bg-[rgba(0,212,255,0.15)]"
                                  : "text-[#4a6a8a] hover:text-[#00d4ff]"
                              }`}
                              title="Select parcel"
                            >
                              <Eye size={13} />
                            </button>
                            {parcel.status !== "validated" ? (
                              <button
                                onClick={e => {
                                  e.stopPropagation();
                                  acceptParcel(parcel.id);
                                }}
                                className="p-1.5 rounded text-[#4a6a8a] hover:text-[#10b981] hover:bg-[rgba(16,185,129,0.1)]"
                                title="Accept / Validate"
                              >
                                <Check size={13} />
                              </button>
                            ) : (
                              <button
                                onClick={e => {
                                  e.stopPropagation();
                                  setSelectedParcelId(parcel.id);
                                  setRejectModal(true);
                                }}
                                className="p-1.5 rounded text-[#4a6a8a] hover:text-[#f59e0b] hover:bg-[rgba(245,158,11,0.1)]"
                                title="Flag for review"
                              >
                                <AlertTriangle size={13} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {sorted.length === 0 && (
                    <tr>
                      <td colSpan={8} className="px-4 py-10 text-center text-xs text-[#4a6a8a]">
                        No parcels match current filters
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-2.5 border-t border-[rgba(30,60,100,0.4)] text-[10px] font-mono text-[#4a6a8a] flex justify-between">
              <span>Showing {sorted.length} of {parcels.length} parcels</span>
              <span>Selected: {selectedParcel?.id || "None"}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Validation & Diagnostics Inspector */}
        <div className="flex flex-col gap-4">
          {selectedParcel ? (
            <div className="bg-[#0d1526] border border-[rgba(30,60,100,0.5)] rounded-xl p-4 flex flex-col gap-4 shadow-md">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs font-semibold text-[#7a9cc0] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <MapPin size={13} className="text-[#00d4ff]" /> Selected Feature
                  </div>
                  <h3 className="text-base font-semibold text-[#e2eaf4]">
                    {selectedParcel.surveyNo}
                  </h3>
                  <div className="text-xs font-mono text-[#00d4ff]">{selectedParcel.id}</div>
                </div>

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

              {/* Interactive Mini Cadastral Map */}
              <div className="relative h-32 rounded-lg overflow-hidden border border-[rgba(30,60,100,0.4)]">
                <MiniValidationMap
                  parcels={parcels}
                  selectedParcelId={selectedParcel.id}
                  onSelectParcel={setSelectedParcelId}
                />
                <div className="absolute bottom-1.5 right-2 text-[9px] font-mono text-[#7a9cc0] bg-[rgba(8,14,26,0.85)] px-1.5 py-0.5 rounded">
                  Click polygon to select
                </div>
              </div>

              {/* Direct Actions: Accept / Reject / Repair */}
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
                  {selectedParcel.status === "validated" ? "VALIDATED" : "ACCEPT / APPROVE"}
                </button>

                <button
                  onClick={() => setRejectModal(true)}
                  disabled={selectedParcel.status === "review"}
                  className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold font-mono transition-all ${
                    selectedParcel.status === "review"
                      ? "bg-[rgba(245,158,11,0.12)] text-[#f59e0b] border border-[rgba(245,158,11,0.3)] cursor-default"
                      : "bg-[rgba(239,68,68,0.15)] hover:bg-[rgba(239,68,68,0.25)] text-[#ffb4ab] border border-[rgba(239,68,68,0.4)]"
                  }`}
                >
                  <XCircle size={13} />
                  {selectedParcel.status === "review" ? "IN REVIEW" : "FLAG FOR REVIEW"}
                </button>
              </div>

              {/* Topology Diagnostics */}
              <div className="bg-[#080e1a] p-3 rounded-lg border border-[rgba(30,60,100,0.3)]">
                <div className="text-[10px] font-semibold text-[#7a9cc0] uppercase tracking-wider mb-2">
                  Diagnostics & Attributes
                </div>
                <div className="flex flex-col gap-2">
                  {[
                    { label: "Administrative Area", value: `${selectedParcel.ward} · ${selectedParcel.zone}` },
                    { label: "Classification", value: selectedParcel.landUse },
                    { label: "Parcel Extent", value: `${selectedParcel.area.toLocaleString()} m²` },
                    { label: "Structures", value: `${selectedParcel.buildings} buildings` },
                    { label: "Registered Owner", value: selectedParcel.owner },
                    { label: "Inference Confidence", value: `${selectedParcel.confidence}%` },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between items-center text-xs">
                      <span className="text-[#4a6a8a] text-[11px]">{label}</span>
                      <span className="font-mono text-[#e2eaf4]">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Topology Error Card with Repair trigger */}
              {selectedParcel.topologyErrors > 0 ? (
                <div className="p-3 rounded-lg bg-[rgba(245,158,11,0.08)] border border-[rgba(245,158,11,0.25)]">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-[#f59e0b] mb-1">
                    <AlertTriangle size={13} />
                    <span>{selectedParcel.topologyErrors} Topology Gaps Detected</span>
                  </div>
                  <div className="text-[11px] text-[#bac9cc] mb-2">
                    Sliver polygon at eastern boundary with road buffer overlap.
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full"
                    icon={<Sparkles size={12} />}
                    onClick={() => setRepairModal(true)}
                  >
                    Repair & Reconcile Boundary
                  </Button>
                </div>
              ) : (
                <div className="p-3 rounded-lg bg-[rgba(16,185,129,0.08)] border border-[rgba(16,185,129,0.2)] text-xs text-[#10b981] flex items-center gap-2">
                  <CheckCircle2 size={14} />
                  <span>Geometry passes all topological checks</span>
                </div>
              )}

              {/* Cross Navigation links */}
              <div className="flex flex-col gap-2 pt-1 border-t border-[rgba(30,60,100,0.3)]">
                <Button
                  variant="secondary"
                  size="sm"
                  className="w-full"
                  icon={<ExternalLink size={12} />}
                  onClick={() => navigateTo("webgis", selectedParcel.id)}
                >
                  Locate on WebGIS Map
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full"
                  onClick={() => navigateTo("parcel-explorer", selectedParcel.id)}
                >
                  Explore in Parcel Registry
                </Button>
              </div>
            </div>
          ) : (
            <div className="bg-[#0d1526] border border-[rgba(30,60,100,0.5)] rounded-xl p-8 text-center text-xs text-[#4a6a8a]">
              Select a parcel from the table to inspect.
            </div>
          )}
        </div>
      </div>

      {/* Repair Modal */}
      <Modal
        open={repairModal}
        onClose={() => setRepairModal(false)}
        title={`Topological Reconciliation: ${selectedParcel?.surveyNo}`}
      >
        {selectedParcel && (
          <div className="flex flex-col gap-4">
            <div className="px-3 py-2.5 rounded-lg bg-[rgba(245,158,11,0.08)] border border-[rgba(245,158,11,0.25)]">
              <div className="text-xs text-[#f59e0b] font-medium mb-1">
                {selectedParcel.topologyErrors} topology issue(s) identified
              </div>
              <div className="text-[11px] text-[#7a9cc0]">
                Auto-snap will snap boundary vertices to adjacent roads and remove 0.3m sliver gaps.
              </div>
            </div>

            <div className="text-xs text-[#bac9cc] space-y-1">
              <p>• Snap tolerance: 0.5 meters</p>
              <p>• Overlap resolution: Adjacent parcel boundary alignment</p>
              <p>• Area adjustment: +0.2 m²</p>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="md"
                className="flex-1"
                onClick={() => setRepairModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="md"
                className="flex-1"
                icon={<Sparkles size={13} />}
                onClick={() => {
                  repairParcelTopology(selectedParcel.id);
                  setRepairModal(false);
                }}
              >
                Apply Repair & Validate
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Reject Confirmation Modal */}
      <Modal
        open={rejectModal}
        onClose={() => setRejectModal(false)}
        title={`Flag Parcel for Review: ${selectedParcel?.surveyNo}`}
      >
        {selectedParcel && (
          <div className="flex flex-col gap-4">
            <p className="text-xs text-[#7a9cc0]">
              Flagging this parcel will mark it as <strong className="text-[#f59e0b]">Requires Review</strong> and notify the field survey team.
            </p>
            <div>
              <label className="text-xs text-[#7a9cc0] mb-1 block">Reason / Field Notes</label>
              <textarea
                value={rejectReason}
                onChange={e => setRejectReason(e.target.value)}
                placeholder="e.g. Boundary overlap detected near road expansion buffer."
                className="w-full bg-[#080e1a] border border-[rgba(30,60,100,0.5)] text-[#e2eaf4] text-xs rounded-lg p-2.5 focus:outline-none focus:border-[#00d4ff] h-20 resize-none"
              />
            </div>
            <div className="flex gap-3">
              <Button variant="outline" size="md" className="flex-1" onClick={() => setRejectModal(false)}>
                Cancel
              </Button>
              <Button variant="danger" size="md" className="flex-1" onClick={handleConfirmReject}>
                Confirm Flag
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Batch Approve Confirmation Modal */}
      <Modal
        open={batchModal}
        onClose={() => setBatchModal(false)}
        title="Batch Approve All Parcels"
      >
        <div className="flex flex-col gap-4">
          <p className="text-xs text-[#7a9cc0]">
            Are you sure you want to approve all {parcels.length} parcels in Anna Nagar Sector IV batch? This will mark all pending parcels as verified.
          </p>
          <div className="flex gap-3">
            <Button variant="outline" size="md" className="flex-1" onClick={() => setBatchModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="md" className="flex-1" onClick={handleConfirmBatchApprove}>
              Approve All
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
