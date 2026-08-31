import { useState, useMemo } from "react";
import { Search, Download, Play, CheckCircle, AlertTriangle, Wrench, RefreshCw, ChevronUp, ChevronDown, X, CheckCheck } from "lucide-react";
import { PARCELS, type Parcel } from "../data/mock";

type SortKey = "id" | "area" | "confidence" | "buildings";
type SortDir = "asc" | "desc";
type Category = "All" | "Self-Intersection" | "Overlap" | "Gaps" | "Connectivity";

const CATEGORIES: Category[] = ["All", "Self-Intersection", "Overlap", "Gaps", "Connectivity"];

function StatusBadge({ status }: { status: Parcel["status"] }) {
  if (status === "VERIFIED") return (
    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-400" style={{ fontFamily: "JetBrains Mono" }}>
      {status}
    </span>
  );
  if (status === "RECONCILIATION REQUIRED") return (
    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-red-400 leading-tight" style={{ fontFamily: "JetBrains Mono" }}>
      RECONCILIATION<br />REQUIRED
    </span>
  );
  if (status === "REPAIRED") return (
    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-400" style={{ fontFamily: "JetBrains Mono" }}>
      {status}
    </span>
  );
  return <span className="text-[10px] text-slate-500" style={{ fontFamily: "JetBrains Mono" }}>{status}</span>;
}

function GeometryBadge({ status }: { status: Parcel["geometryStatus"] }) {
  if (status === "valid") return (
    <span className="px-2 py-0.5 rounded text-[10px] font-semibold text-green-400 flex items-center gap-1"
      style={{ background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.25)", fontFamily: "JetBrains Mono" }}>
      <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
      Valid
    </span>
  );
  if (status === "review") return (
    <span className="px-2 py-0.5 rounded text-[10px] font-semibold text-red-400 flex items-center gap-1"
      style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.25)", fontFamily: "JetBrains Mono" }}>
      <span className="w-1.5 h-1.5 rounded-full bg-red-400 inline-block" />
      Review
    </span>
  );
  return (
    <span className="px-2 py-0.5 rounded text-[10px] font-semibold text-amber-400 flex items-center gap-1"
      style={{ background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.25)", fontFamily: "JetBrains Mono" }}>
      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
      Repaired
    </span>
  );
}

function ConfidenceBar({ value }: { value: number }) {
  const color = value >= 85 ? "#22d3ee" : value >= 70 ? "#fbbf24" : "#f87171";
  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1.5 rounded-full bg-slate-800 overflow-hidden flex-shrink-0">
        <div className="h-full rounded-full transition-all" style={{ width: `${value}%`, background: color }} />
      </div>
      <span className="text-[11px] font-medium" style={{ color, fontFamily: "JetBrains Mono" }}>{value}%</span>
    </div>
  );
}

export default function Validation() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<Category>("All");
  const [sortKey, setSortKey] = useState<SortKey>("id");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [confidenceFilter, setConfidenceFilter] = useState<"all" | "high" | "medium" | "low">("all");
  const [geometryFilter, setGeometryFilter] = useState<"all" | "valid" | "review" | "repaired">("all");
  const [resolveModal, setResolveModal] = useState<Parcel | null>(null);
  const [validating, setValidating] = useState(false);
  const [resolvedIds, setResolvedIds] = useState<Set<string>>(new Set());

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
  };

  const filtered = useMemo(() => {
    let rows = [...PARCELS];
    if (search) rows = rows.filter(p => p.id.toLowerCase().includes(search.toLowerCase()) || p.landType.toLowerCase().includes(search.toLowerCase()));
    if (confidenceFilter === "high") rows = rows.filter(p => p.confidence >= 85);
    if (confidenceFilter === "medium") rows = rows.filter(p => p.confidence >= 65 && p.confidence < 85);
    if (confidenceFilter === "low") rows = rows.filter(p => p.confidence < 65);
    if (geometryFilter !== "all") rows = rows.filter(p => p.geometryStatus === geometryFilter);
    rows.sort((a, b) => {
      let av: number | string = a[sortKey === "id" ? "id" : sortKey];
      let bv: number | string = b[sortKey === "id" ? "id" : sortKey];
      if (typeof av === "string") return sortDir === "asc" ? av.localeCompare(bv as string) : (bv as string).localeCompare(av);
      return sortDir === "asc" ? (av as number) - (bv as number) : (bv as number) - (av as number);
    });
    return rows;
  }, [search, confidenceFilter, geometryFilter, sortKey, sortDir]);

  const SortIcon = ({ k }: { k: SortKey }) => sortKey === k
    ? sortDir === "asc" ? <ChevronUp size={11} /> : <ChevronDown size={11} />
    : <ChevronUp size={11} className="opacity-20" />;

  const handleRunValidation = () => {
    setValidating(true);
    setTimeout(() => setValidating(false), 3000);
  };

  const handleResolve = (parcel: Parcel) => {
    setResolvedIds(prev => new Set([...prev, parcel.id]));
    setResolveModal(null);
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-4 md:p-6 space-y-5 max-w-screen-2xl mx-auto">

        {/* Header */}
        <div className="flex flex-wrap items-start gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "Inter", letterSpacing: "-0.02em" }}>
              Cadastral Inventory & Topology Audit
            </h1>
            <p className="text-sm text-slate-400 mt-1">Topology verification and surveyor workflow.</p>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white transition-all focus:outline-none focus-visible:ring-1 focus-visible:ring-cyan-400"
              style={{ background: "rgba(10,22,40,0.8)", border: "1px solid rgba(34,211,238,0.2)" }}>
              <Download size={14} />
              <span className="hidden sm:inline">Export Report</span>
            </button>
            <button
              onClick={handleRunValidation}
              disabled={validating}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all focus:outline-none focus-visible:ring-1 focus-visible:ring-cyan-400 disabled:opacity-60"
              style={{ background: "linear-gradient(135deg, #0891b2 0%, #22d3ee 100%)", color: "#050d1a" }}
            >
              {validating ? <RefreshCw size={14} className="animate-spin" /> : <Play size={14} />}
              {validating ? "Running…" : "Execute Batch Reconciliation"}
            </button>
          </div>
        </div>

        {/* Category tabs */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] text-slate-600 uppercase tracking-widest" style={{ fontFamily: "JetBrains Mono" }}>CATEGORIES:</span>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-[11px] font-medium transition-all focus:outline-none focus-visible:ring-1 focus-visible:ring-cyan-400 flex items-center gap-1.5 ${
                category === cat
                  ? "text-cyan-400 bg-cyan-400/12"
                  : "text-slate-500 hover:text-slate-300"
              }`}
              style={{ border: `1px solid ${category === cat ? "rgba(34,211,238,0.35)" : "rgba(255,255,255,0.08)"}`, fontFamily: "JetBrains Mono" }}
            >
              {cat === "All" && category === "All" && <Play size={9} className="fill-cyan-400" />}
              {cat}
            </button>
          ))}
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: CheckCheck, label: "Total Generated", value: "127", sub: "parcels", color: "text-white", borderColor: "rgba(34,211,238,0.15)" },
            { icon: CheckCircle, label: "Valid Topology", value: "121", sub: "verified", color: "text-cyan-400", borderColor: "rgba(34,211,238,0.4)" },
            { icon: Wrench, label: "Repaired", value: "4", sub: "auto-fixed", color: "text-amber-400", borderColor: "rgba(251,191,36,0.3)" },
            { icon: AlertTriangle, label: "Needs Review", value: "2", sub: "critical", color: "text-red-400", borderColor: "rgba(248,113,113,0.3)" },
          ].map(({ icon: Icon, label, value, sub, color, borderColor }) => (
            <div key={label} className="p-4 rounded-xl" style={{ background: "rgba(10,22,40,0.5)", border: `1px solid ${borderColor}` }}>
              <div className="flex items-center gap-2 mb-2">
                <Icon size={13} className={color} />
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest" style={{ fontFamily: "JetBrains Mono" }}>{label}</span>
              </div>
              <div className={`text-3xl font-bold ${color}`} style={{ fontFamily: "Inter" }}>{value}</div>
              <div className="text-[11px] text-slate-600 mt-0.5" style={{ fontFamily: "JetBrains Mono" }}>{sub}</div>
            </div>
          ))}
        </div>

        {/* Filters + table */}
        <div className="rounded-xl overflow-hidden" style={{ background: "rgba(10,22,40,0.5)", border: "1px solid rgba(34,211,238,0.1)" }}>
          {/* Filter row */}
          <div className="flex flex-wrap items-center gap-3 p-4 border-b" style={{ borderColor: "rgba(34,211,238,0.08)" }}>
            <div className="relative flex-1 min-w-48">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="search"
                placeholder="Search Parcel ID…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-2 rounded-lg text-sm text-slate-300 placeholder-slate-600 bg-transparent focus:outline-none focus-visible:ring-1 focus-visible:ring-cyan-400"
                style={{ background: "rgba(5,13,26,0.5)", border: "1px solid rgba(255,255,255,0.08)", fontFamily: "Inter" }}
              />
            </div>
            <select
              value={confidenceFilter}
              onChange={e => setConfidenceFilter(e.target.value as typeof confidenceFilter)}
              className="px-3 py-2 rounded-lg text-xs text-slate-400 bg-transparent focus:outline-none focus-visible:ring-1 focus-visible:ring-cyan-400 cursor-pointer"
              style={{ background: "rgba(5,13,26,0.5)", border: "1px solid rgba(255,255,255,0.08)", fontFamily: "JetBrains Mono" }}
            >
              <option value="all">Filter: Confidence</option>
              <option value="high">High (&ge;85%)</option>
              <option value="medium">Medium (65–84%)</option>
              <option value="low">Low (&lt;65%)</option>
            </select>
            <select
              value={geometryFilter}
              onChange={e => setGeometryFilter(e.target.value as typeof geometryFilter)}
              className="px-3 py-2 rounded-lg text-xs text-slate-400 bg-transparent focus:outline-none focus-visible:ring-1 focus-visible:ring-cyan-400 cursor-pointer"
              style={{ background: "rgba(5,13,26,0.5)", border: "1px solid rgba(255,255,255,0.08)", fontFamily: "JetBrains Mono" }}
            >
              <option value="all">Filter: Geometry Status</option>
              <option value="valid">Valid</option>
              <option value="review">Review</option>
              <option value="repaired">Repaired</option>
            </select>
            <span className="text-[11px] text-slate-600 ml-auto flex-shrink-0" style={{ fontFamily: "JetBrains Mono" }}>
              Showing 1–{filtered.length} of {PARCELS.length}
            </span>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm" role="table">
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(34,211,238,0.08)" }}>
                  {[
                    { label: "Parcel ID", key: "id" as SortKey },
                    { label: "Area (SQM)", key: "area" as SortKey },
                    { label: "Land Type", key: null },
                    { label: "Bldgs", key: "buildings" as SortKey },
                    { label: "Inference Confidence", key: "confidence" as SortKey },
                    { label: "Geometry Integrity", key: null },
                    { label: "Status", key: null },
                    { label: "Actions", key: null },
                  ].map(({ label, key }) => (
                    <th
                      key={label}
                      className={`text-left px-4 py-3 text-[10px] font-semibold text-slate-500 uppercase tracking-widest whitespace-nowrap ${key ? "cursor-pointer hover:text-slate-300" : ""}`}
                      style={{ fontFamily: "JetBrains Mono" }}
                      onClick={key ? () => handleSort(key) : undefined}
                    >
                      <span className="flex items-center gap-1">
                        {label}
                        {key && <SortIcon k={key} />}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((parcel, i) => {
                  const resolved = resolvedIds.has(parcel.id);
                  return (
                    <tr
                      key={parcel.id}
                      className="border-b hover:bg-white/2 transition-colors"
                      style={{ borderColor: "rgba(255,255,255,0.04)" }}
                    >
                      <td className="px-4 py-3">
                        <span className="font-medium text-slate-200" style={{ fontFamily: "JetBrains Mono" }}>{parcel.id}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-slate-400" style={{ fontFamily: "JetBrains Mono" }}>{parcel.area.toLocaleString()}</span>
                      </td>
                      <td className="px-4 py-3 text-slate-400">{parcel.landType}</td>
                      <td className="px-4 py-3">
                        <span className="text-slate-400" style={{ fontFamily: "JetBrains Mono" }}>{parcel.buildings}</span>
                      </td>
                      <td className="px-4 py-3">
                        <ConfidenceBar value={parcel.confidence} />
                      </td>
                      <td className="px-4 py-3">
                        <GeometryBadge status={resolved ? "valid" : parcel.geometryStatus} />
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={resolved ? "VERIFIED" : parcel.status} />
                      </td>
                      <td className="px-4 py-3">
                        {!resolved && parcel.geometryStatus === "review" && (
                          <button
                            onClick={() => setResolveModal(parcel)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded text-[11px] font-semibold text-cyan-400 hover:text-slate-900 hover:bg-cyan-400 transition-all focus:outline-none focus-visible:ring-1 focus-visible:ring-cyan-400"
                            style={{ border: "1px solid rgba(34,211,238,0.3)", background: "rgba(34,211,238,0.08)", fontFamily: "JetBrains Mono" }}
                          >
                            <Wrench size={10} />
                            RESOLVE
                          </button>
                        )}
                        {resolved && (
                          <span className="flex items-center gap-1 text-[11px] text-green-400" style={{ fontFamily: "JetBrains Mono" }}>
                            <CheckCircle size={11} /> RESOLVED
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-4 py-12 text-center text-slate-600 text-sm">
                      No parcels match the current filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Resolve modal */}
      {resolveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}>
          <div className="rounded-xl p-6 max-w-md w-full" style={{ background: "#0a1628", border: "1px solid rgba(34,211,238,0.2)" }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-white" style={{ fontFamily: "Inter" }}>
                Resolve Parcel {resolveModal.id}
              </h2>
              <button onClick={() => setResolveModal(null)} className="text-slate-500 hover:text-slate-300 focus:outline-none" aria-label="Close">
                <X size={16} />
              </button>
            </div>
            <p className="text-sm text-slate-400 mb-4">
              Confidence: <span className="text-red-400 font-mono">{resolveModal.confidence}%</span> — below acceptable threshold.
              Select a resolution strategy:
            </p>
            <div className="space-y-2 mb-5">
              {["Automatic topology reconciliation", "Manual boundary redraw", "Flag for field survey", "Accept as-is with override"].map(opt => (
                <label key={opt} className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-white/4 transition-colors"
                  style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
                  <input type="radio" name="resolution" className="accent-cyan-400" />
                  <span className="text-sm text-slate-300">{opt}</span>
                </label>
              ))}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setResolveModal(null)}
                className="flex-1 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-white transition-colors focus:outline-none"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleResolve(resolveModal)}
                className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-slate-900 bg-cyan-400 hover:bg-cyan-300 transition-colors focus:outline-none"
              >
                Apply Resolution
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
