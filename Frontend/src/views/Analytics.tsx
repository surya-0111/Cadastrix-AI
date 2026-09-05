import { useState, useMemo } from "react";
import {
  BarChart2, TrendingUp, Layers, CheckCircle2, AlertTriangle,
  Clock, ShieldCheck, Download, RefreshCw, Filter, MapPin, Building2,
  PieChart, Activity, Zap
} from "lucide-react";
import StatCard from "../components/ui/StatCard";
import ProgressBar from "../components/ui/ProgressBar";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import { useCadastra } from "../context/CadastraContext";
import { downloadJson } from "../utils/actions";
import { exportAnalyticsPdf } from "../utils/pdfGenerator";
import { FileText } from "lucide-react";

interface AnalyticsProps {
  onToast: (msg: string, type?: "success" | "error" | "info" | "warning") => void;
}

export default function Analytics({ onToast }: AnalyticsProps) {
  const { parcels, projects, activityFeed, navigateTo } = useCadastra();
  const [selectedZone, setSelectedZone] = useState("all");

  const zones = ["all", ...Array.from(new Set(parcels.map(p => p.zone)))];

  const zoneParcels = useMemo(() => {
    return selectedZone === "all" ? parcels : parcels.filter(p => p.zone === selectedZone);
  }, [parcels, selectedZone]);

  const stats = useMemo(() => {
    const totalParcels = zoneParcels.length;
    const verifiedParcels = zoneParcels.filter(p => p.status === "validated").length;
    const reviewParcels = zoneParcels.filter(p => p.status === "review").length;
    const errorParcels = zoneParcels.filter(p => p.status === "error").length;
    const pendingParcels = zoneParcels.filter(p => p.status === "pending").length;

    const totalBuildings = zoneParcels.reduce((acc, p) => acc + p.buildings, 0);
    const totalAreaM2 = zoneParcels.reduce((acc, p) => acc + p.area, 0);
    const avgConfidence = (
      zoneParcels.reduce((acc, p) => acc + p.confidence, 0) / (totalParcels || 1)
    ).toFixed(1);
    const topologyRepairs = zoneParcels.filter(p => p.topologyErrors === 0 && p.status === "validated").length;
    const activeTopologyErrors = zoneParcels.reduce((acc, p) => acc + p.topologyErrors, 0);

    return {
      totalParcels,
      verifiedParcels,
      reviewParcels,
      errorParcels,
      pendingParcels,
      totalBuildings,
      totalAreaM2,
      avgConfidence,
      topologyRepairs,
      activeTopologyErrors,
      roadSegments: 312,
      processingDuration: "18m 42s",
      validationPercentage: ((verifiedParcels / (totalParcels || 1)) * 100).toFixed(1),
    };
  }, [zoneParcels]);

  // Land use breakdown
  const landUseBreakdown = useMemo(() => {
    const counts: Record<string, number> = {};
    zoneParcels.forEach(p => {
      counts[p.landUse] = (counts[p.landUse] || 0) + 1;
    });
    return Object.entries(counts).map(([name, count]) => ({
      name,
      count,
      pct: ((count / zoneParcels.length) * 100).toFixed(1),
    }));
  }, [zoneParcels]);

  // Confidence distribution bins
  const confidenceBins = useMemo(() => {
    const bins = {
      ">95% (High Precision)": 0,
      "85–95% (Standard)": 0,
      "70–85% (Flagged)": 0,
      "<70% (Low / Occluded)": 0,
    };
    zoneParcels.forEach(p => {
      if (p.confidence >= 95) bins[">95% (High Precision)"]++;
      else if (p.confidence >= 85) bins["85–95% (Standard)"]++;
      else if (p.confidence >= 70) bins["70–85% (Flagged)"]++;
      else bins["<70% (Low / Occluded)"]++;
    });
    return bins;
  }, [zoneParcels]);

  const exportAnalyticsReport = () => {
    downloadJson("cadastra-operational-analytics.json", {
      generatedAt: new Date().toISOString(),
      zone: selectedZone,
      stats,
      landUseBreakdown,
      confidenceBins,
      recentActivity: activityFeed.slice(0, 10),
    });
    onToast("Operational Analytics report exported as JSON", "success");
  };

  return (
    <div className="h-full overflow-y-auto p-4 lg:p-6 flex flex-col gap-6 bg-[#080e1a]">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="text-xs text-[#4a6a8a] font-mono uppercase tracking-wider mb-1">
            CadastrixAI Operational Telemetry & Analytics
          </div>
          <h1 className="text-xl font-semibold text-[#e2eaf4]">GIS & AI Analytics Dashboard</h1>
        </div>
        <div className="flex items-center gap-3">
          {/* Zone Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#7a9cc0]">Zone:</span>
            <select
              value={selectedZone}
              onChange={e => setSelectedZone(e.target.value)}
              className="bg-[#0d1526] border border-[rgba(30,60,100,0.5)] text-[#e2eaf4] text-xs rounded-lg px-2.5 py-1.5 focus:outline-none"
            >
              {zones.map(z => (
                <option key={z} value={z}>
                  {z === "all" ? "All Zones (Sector 4)" : z}
                </option>
              ))}
            </select>
          </div>

          <Button
            variant="ghost"
            size="sm"
            icon={<FileText size={13} />}
            onClick={() => {
              exportAnalyticsPdf(stats, landUseBreakdown);
              onToast("Generated Analytics PDF Report", "success");
            }}
          >
            Export PDF
          </Button>

          <Button variant="ghost" size="sm" icon={<Download size={13} />} onClick={exportAnalyticsReport}>
            Export JSON
          </Button>

          <Button
            variant="primary"
            size="sm"
            icon={<ShieldCheck size={13} />}
            onClick={() => navigateTo("validation")}
          >
            Go to Validation
          </Button>
        </div>
      </div>

      {/* Top Key Operational KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Parcels"
          value={stats.totalParcels}
          sub={`${stats.verifiedParcels} verified (${stats.validationPercentage}%)`}
          icon={<Layers size={15} />}
          color="#00d4ff"
        />
        <StatCard
          label="Review Required"
          value={stats.reviewParcels}
          sub={`${stats.activeTopologyErrors} topology errors pending`}
          icon={<AlertTriangle size={15} />}
          color="#f59e0b"
        />
        <StatCard
          label="Detected Structures"
          value={stats.totalBuildings.toLocaleString()}
          sub="rooftop footprints identified"
          icon={<Building2 size={15} />}
          color="#3b82f6"
        />
        <StatCard
          label="Overall AI Confidence"
          value={`${stats.avgConfidence}%`}
          sub="CadastraNet v4.2 inference"
          icon={<TrendingUp size={15} />}
          color="#10b981"
          trend={{ value: 3.4, label: "vs baseline" }}
        />
      </div>

      {/* Secondary Operational Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: "Verified Parcels", val: stats.verifiedParcels, color: "#10b981" },
          { label: "Repaired Geometry", val: stats.topologyRepairs, color: "#00d4ff" },
          { label: "Pending Parcels", val: stats.pendingParcels, color: "#7a9cc0" },
          { label: "Road Segments", val: stats.roadSegments, color: "#3b82f6" },
          { label: "Total Area", val: `${(stats.totalAreaM2 / 10000).toFixed(2)} ha`, color: "#8b5cf6" },
          { label: "Pipeline Duration", val: stats.processingDuration, color: "#10b981" },
        ].map(item => (
          <div key={item.label} className="bg-[#0d1526] border border-[rgba(30,60,100,0.5)] rounded-xl p-3">
            <div className="text-[10px] text-[#4a6a8a] uppercase tracking-wider mb-1 font-mono">{item.label}</div>
            <div className="text-lg font-bold font-mono" style={{ color: item.color }}>
              {item.val}
            </div>
          </div>
        ))}
      </div>

      {/* Analytics Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Validation Completion & Pipeline Progress */}
        <div className="bg-[#0d1526] border border-[rgba(30,60,100,0.5)] rounded-xl p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[#e2eaf4] flex items-center gap-2">
              <CheckCircle2 size={15} className="text-[#10b981]" />
              Cadastral Verification Progress
            </h3>
            <Badge variant="cyan">{stats.validationPercentage}% Complete</Badge>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-[#7a9cc0]">Verified Parcels</span>
                <span className="font-mono text-[#10b981] font-semibold">
                  {stats.verifiedParcels} / {stats.totalParcels}
                </span>
              </div>
              <ProgressBar value={Number(stats.validationPercentage)} color="#10b981" height={8} />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-[#7a9cc0]">Requires Surveyor Review</span>
                <span className="font-mono text-[#f59e0b] font-semibold">
                  {stats.reviewParcels} parcels
                </span>
              </div>
              <ProgressBar
                value={(stats.reviewParcels / (stats.totalParcels || 1)) * 100}
                color="#f59e0b"
                height={8}
              />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-[#7a9cc0]">Topology Errors Flagged</span>
                <span className="font-mono text-[#ef4444] font-semibold">
                  {stats.errorParcels} parcels ({stats.activeTopologyErrors} anomalies)
                </span>
              </div>
              <ProgressBar
                value={(stats.errorParcels / (stats.totalParcels || 1)) * 100}
                color="#ef4444"
                height={8}
              />
            </div>
          </div>

          <div className="pt-3 border-t border-[rgba(30,60,100,0.3)] flex justify-between items-center text-xs">
            <span className="text-[#4a6a8a]">Manual reconciliation required for flagged items</span>
            <button
              onClick={() => navigateTo("validation")}
              className="text-[#00d4ff] hover:underline font-mono text-[11px]"
            >
              Open Validation Queue →
            </button>
          </div>
        </div>

        {/* AI Confidence Distribution */}
        <div className="bg-[#0d1526] border border-[rgba(30,60,100,0.5)] rounded-xl p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[#e2eaf4] flex items-center gap-2">
              <BarChart2 size={15} className="text-[#00d4ff]" />
              AI Boundary Inference Precision
            </h3>
            <span className="text-xs font-mono text-[#00d4ff]">Avg {stats.avgConfidence}%</span>
          </div>

          <div className="space-y-3">
            {Object.entries(confidenceBins).map(([label, count]) => {
              const pct = ((count / (stats.totalParcels || 1)) * 100).toFixed(0);
              let color = "#10b981";
              if (label.includes("<70%")) color = "#ef4444";
              else if (label.includes("70–85%")) color = "#f59e0b";
              else if (label.includes("85–95%")) color = "#3b82f6";

              return (
                <div key={label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[#7a9cc0]">{label}</span>
                    <span className="font-mono text-[#e2eaf4]">
                      {count} parcels ({pct}%)
                    </span>
                  </div>
                  <ProgressBar value={Number(pct)} color={color} height={6} />
                </div>
              );
            })}
          </div>

          <div className="pt-3 border-t border-[rgba(30,60,100,0.3)] text-xs text-[#4a6a8a]">
            Inference model: CadastraNet v4.2 ResNet-101 feature extractor with topology constraint loss.
          </div>
        </div>
      </div>

      {/* Lower Row: Land Use Breakdown & Live Surveyor Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Land Use Classification Breakdown */}
        <div className="bg-[#0d1526] border border-[rgba(30,60,100,0.5)] rounded-xl p-5 flex flex-col gap-4">
          <h3 className="text-sm font-semibold text-[#e2eaf4] flex items-center gap-2">
            <PieChart size={15} className="text-[#8b5cf6]" />
            Land Classification Breakdown
          </h3>

          <div className="space-y-3">
            {landUseBreakdown.map(lu => (
              <div key={lu.name}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[#7a9cc0]">{lu.name}</span>
                  <span className="font-mono text-[#e2eaf4]">
                    {lu.count} parcels ({lu.pct}%)
                  </span>
                </div>
                <ProgressBar value={Number(lu.pct)} color="#8b5cf6" height={6} />
              </div>
            ))}
          </div>
        </div>

        {/* Live Surveyor Activity Log */}
        <div className="bg-[#0d1526] border border-[rgba(30,60,100,0.5)] rounded-xl p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[#e2eaf4] flex items-center gap-2">
              <Activity size={15} className="text-[#00d4ff]" />
              Recent Surveyor Audit Trail
            </h3>
            <span className="text-[10px] font-mono text-[#4a6a8a]">Live log</span>
          </div>

          <div className="divide-y divide-[rgba(30,60,100,0.25)] overflow-y-auto max-h-[220px]">
            {activityFeed.slice(0, 7).map(act => (
              <div key={act.id} className="py-2.5 flex items-start gap-2.5 text-xs">
                <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0 bg-[#00d4ff]" />
                <div className="flex-1 min-w-0">
                  <span className="font-semibold text-[#e2eaf4]">{act.user}</span>{" "}
                  <span className="text-[#7a9cc0]">{act.action}</span>{" "}
                  <span className="font-mono text-[#00d4ff]">{act.target}</span>
                </div>
                <span className="text-[10px] font-mono text-[#4a6a8a] flex-shrink-0">{act.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
