import { useState, useRef } from "react";
import Modal from "../components/ui/Modal";
import Input from "../components/ui/Input";
import {
  Plus, Upload, Download, Filter, RefreshCw, ChevronRight,
  FolderOpen, MapPin, Users, Layers, Clock, AlertTriangle,
  CheckCircle2, XCircle, Activity, BarChart2, Compass
} from "lucide-react";
import { PROJECTS, ACTIVITY_FEED } from "../data/mockData";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import StatCard from "../components/ui/StatCard";
import ProgressBar from "../components/ui/ProgressBar";
import type { View, ProjectStatus } from "../types";
import { useCadastra } from "../context/CadastraContext";

interface DashboardProps {
  onNavigate: (view: View) => void;
  onToast: (msg: string, type?: "success" | "error" | "info" | "warning") => void;
}

const statusBadge = (s: ProjectStatus) => {
  const map: Record<ProjectStatus, { variant: "cyan" | "amber" | "green" | "red" | "blue" | "muted"; label: string }> = {
    active: { variant: "cyan", label: "Active" },
    processing: { variant: "blue", label: "Processing" },
    completed: { variant: "green", label: "Complete" },
    failed: { variant: "red", label: "Failed" },
    review: { variant: "amber", label: "Review" },
  };
  return <Badge variant={map[s].variant} dot>{map[s].label}</Badge>;
};

export default function Dashboard({ onNavigate, onToast }: DashboardProps) {
  const { projects: sharedProjects, parcels, activityFeed } = useCadastra();
  const [projects, setProjects] = useState(sharedProjects);
  const [filter, setFilter] = useState<ProjectStatus | "all">("all");
  const [dragging, setDragging] = useState(false);
  const [newProjectOpen, setNewProjectOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const filtered = filter === "all" ? projects : projects.filter(p => p.status === filter);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const files = e.dataTransfer.files;
    if (files.length) { setUploadedFile(files[0].name); onToast(`${files[0].name} added to project intake`, "success"); }
  };

  const totalParcels = projects.reduce((a, p) => a + p.parcels, 0);
  const totalBuildings = projects.reduce((a, p) => a + p.buildings, 0);
  const avgConfidence = (projects.filter(p => p.confidence > 0).reduce((a, p) => a + p.confidence, 0) / Math.max(1, projects.filter(p => p.confidence > 0).length)).toFixed(1);

  return (
    <div className="h-full overflow-y-auto p-4 lg:p-6 flex flex-col gap-6">

      {/* Header row */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="text-xs text-[#4a6a8a] font-mono uppercase tracking-wider mb-1">Chennai Urban Cadastral Survey · FY2025</div>
          <h1 className="text-xl font-semibold text-[#e2eaf4]">Projects Dashboard</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" icon={<RefreshCw size={13} />} onClick={() => { setFilter("all"); onToast("Project list refreshed", "success"); }}>Refresh</Button>
          <Button variant="secondary" size="sm" icon={<Upload size={13} />} onClick={() => fileRef.current?.click()}>Upload Data</Button>
          <Button variant="primary" size="sm" icon={<Plus size={13} />} onClick={() => setNewProjectOpen(true)}>New Project</Button>
          <input ref={fileRef} type="file" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) { setUploadedFile(f.name); onToast(`${f.name} added to project intake`, "success"); } }} />
        </div>
      </div>

      {/* Stats - Interactive to cross-views */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div onClick={() => onNavigate("ai-processing")} className="cursor-pointer transition-transform hover:scale-[1.01]">
          <StatCard label="Total Projects" value={projects.length} sub={`${projects.filter(p => p.status === "active").length} active`} icon={<FolderOpen size={14} />} color="#00d4ff" />
        </div>
        <div onClick={() => onNavigate("parcel-explorer")} className="cursor-pointer transition-transform hover:scale-[1.01]">
          <StatCard label="Total Parcels" value={totalParcels.toLocaleString()} sub="across all zones (explore)" icon={<Layers size={14} />} color="#8b5cf6" />
        </div>
        <div onClick={() => onNavigate("webgis")} className="cursor-pointer transition-transform hover:scale-[1.01]">
          <StatCard label="Structures" value={totalBuildings.toLocaleString()} sub="building footprints in WebGIS" icon={<MapPin size={14} />} color="#3b82f6" />
        </div>
        <div onClick={() => onNavigate("analytics")} className="cursor-pointer transition-transform hover:scale-[1.01]">
          <StatCard label="Avg Confidence" value={`${avgConfidence}%`} sub="AI extraction (view analytics)" icon={<BarChart2 size={14} />} color="#10b981" trend={{ value: 2.1, label: "vs last batch" }} />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Projects table */}
        <div className="xl:col-span-2 bg-[#0d1526] border border-[rgba(30,60,100,0.5)] rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-[rgba(30,60,100,0.4)] flex items-center gap-3 flex-wrap">
            <h2 className="text-sm font-semibold text-[#e2eaf4] flex-1">Survey Projects</h2>
            <div className="flex items-center gap-1.5">
              {(["all", "active", "processing", "completed", "review", "failed"] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-2.5 py-1 rounded text-[11px] font-mono transition-colors ${
                    filter === f ? "bg-[rgba(0,212,255,0.12)] text-[#00d4ff]" : "text-[#4a6a8a] hover:text-[#7a9cc0]"
                  }`}
                >
                  {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="divide-y divide-[rgba(30,60,100,0.3)]">
            {filtered.map(project => (
              <div
                key={project.id}
                className="px-5 py-4 hover:bg-[rgba(30,60,100,0.2)] transition-colors cursor-pointer group"
                onClick={() => onNavigate("ai-processing")}
                role="button"
                tabIndex={0}
                onKeyDown={e => e.key === "Enter" && onNavigate("ai-processing")}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm font-medium text-[#e2eaf4] truncate">{project.name}</span>
                      {statusBadge(project.status)}
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-[#4a6a8a] font-mono">
                      <span className="flex items-center gap-1"><MapPin size={10} />{project.location}</span>
                      <span>{project.id}</span>
                    </div>
                  </div>
                  <ChevronRight size={14} className="text-[#4a6a8a] group-hover:text-[#00d4ff] flex-shrink-0 mt-1 transition-colors" />
                </div>

                {project.status !== "failed" && (
                  <div className="mb-2">
                    <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                      <span className="text-[#4a6a8a]">{project.phase}</span>
                      <span className="text-[#7a9cc0]">{project.progress}%</span>
                    </div>
                    <ProgressBar
                      value={project.progress}
                      color={project.status === "completed" ? "#10b981" : project.status === "review" ? "#f59e0b" : "#00d4ff"}
                      height={3}
                    />
                  </div>
                )}

                <div className="flex items-center gap-4 text-[10px] font-mono text-[#4a6a8a]">
                  <span>{project.parcels.toLocaleString()} parcels</span>
                  <span>{project.buildings.toLocaleString()} buildings</span>
                  <span>{project.area} km²</span>
                  {project.confidence > 0 && (
                    <span className="text-[#10b981]">{project.confidence}% conf.</span>
                  )}
                  <span className="ml-auto flex items-center gap-1"><Clock size={10} />{new Date(project.updatedAt).toLocaleDateString("en-IN")}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-4">
          {/* Upload dropzone */}
          <div
            onDragEnter={() => setDragging(true)}
            onDragLeave={() => setDragging(false)}
            onDragOver={e => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center gap-3 cursor-pointer transition-all ${
              dragging ? "border-[#00d4ff] bg-[rgba(0,212,255,0.07)]" : "border-[rgba(30,60,100,0.5)] bg-[#0d1526] hover:border-[rgba(0,212,255,0.3)]"
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-[rgba(0,212,255,0.08)] border border-[rgba(0,212,255,0.2)] flex items-center justify-center">
              <Upload size={18} className="text-[#00d4ff]" />
            </div>
            <div className="text-center">
              <div className="text-sm font-medium text-[#7a9cc0]">Drop orthomosaic here</div>
              <div className="text-xs text-[#4a6a8a] mt-0.5">GeoTIFF, LAS, SHP supported</div>
            </div>
          </div>

          {/* Activity feed */}
          <div className="bg-[#0d1526] border border-[rgba(30,60,100,0.5)] rounded-xl overflow-hidden flex-1">
            <div className="px-4 py-3 border-b border-[rgba(30,60,100,0.4)] flex items-center justify-between">
              <h3 className="text-xs font-semibold text-[#7a9cc0] uppercase tracking-wider flex items-center gap-1.5">
                <Activity size={12} /> Recent Activity
              </h3>
            </div>
            <div className="divide-y divide-[rgba(30,60,100,0.25)]">
              {activityFeed.slice(0, 5).map(item => (
                <div key={item.id} className="px-4 py-3">
                  <div className="flex items-start gap-2">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      item.type === "success" ? "bg-[rgba(16,185,129,0.15)]" :
                      item.type === "review" ? "bg-[rgba(245,158,11,0.15)]" :
                      item.type === "upload" ? "bg-[rgba(59,130,246,0.15)]" : "bg-[rgba(0,212,255,0.1)]"
                    }`}>
                      {item.type === "success" ? <CheckCircle2 size={10} className="text-[#10b981]" /> :
                       item.type === "review" ? <AlertTriangle size={10} className="text-[#f59e0b]" /> :
                       <Activity size={10} className="text-[#00d4ff]" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-[#7a9cc0]">
                        <span className="font-medium text-[#e2eaf4]">{item.user}</span> {item.action}
                      </div>
                      <div className="text-[10px] text-[#4a6a8a] font-mono truncate">{item.target}</div>
                    </div>
                    <span className="text-[10px] text-[#4a6a8a] font-mono flex-shrink-0">{item.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick actions */}
          <div className="bg-[#0d1526] border border-[rgba(30,60,100,0.5)] rounded-xl p-4 flex flex-col gap-2">
            <div className="text-xs font-semibold text-[#7a9cc0] uppercase tracking-wider mb-1">Quick Actions</div>
            {[
              { label: "Launch AI Extraction", view: "ai-processing" as View, icon: <Activity size={13} />, color: "#00d4ff" },
              { label: "Open WebGIS", view: "webgis" as View, icon: <MapPin size={13} />, color: "#3b82f6" },
              { label: "Validation Center", view: "validation" as View, icon: <CheckCircle2 size={13} />, color: "#10b981" },
              { label: "Parcel Explorer", view: "parcel-explorer" as View, icon: <Compass size={13} />, color: "#8b5cf6" },
              { label: "Analytics Dashboard", view: "analytics" as View, icon: <BarChart2 size={13} />, color: "#00d4ff" },
              { label: "GIS Data Exports", view: "exports" as View, icon: <Download size={13} />, color: "#f59e0b" },
            ].map(a => (
              <button
                key={a.label}
                onClick={() => onNavigate(a.view)}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-[#7a9cc0] hover:bg-[rgba(30,60,100,0.3)] hover:text-[#e2eaf4] transition-colors text-left"
              >
                <span style={{ color: a.color }}>{a.icon}</span>
                {a.label}
                <ChevronRight size={12} className="ml-auto text-[#4a6a8a]" />
              </button>
            ))}
          </div>
        </div>
      </div>

      <Modal open={newProjectOpen} onClose={() => setNewProjectOpen(false)} title="Create Survey Project">
        <div className="flex flex-col gap-4">
          <Input label="Project name" value={projectName} onChange={e => setProjectName(e.target.value)} placeholder="e.g. Anna Nagar Phase 2" />
          <div className="text-xs text-[#7a9cc0]">{uploadedFile ? `Input file: ${uploadedFile}` : "Add an orthomosaic or survey file from the Upload Data button."}</div>
          <div className="flex gap-2">
            <Button variant="outline" size="md" className="flex-1" onClick={() => setNewProjectOpen(false)}>Cancel</Button>
            <Button variant="primary" size="md" className="flex-1" disabled={!projectName.trim()} onClick={() => { const name = projectName.trim(); const now = new Date().toISOString(); setProjects(prev => [{ id: `PRJ-${Date.now()}`, name, location: "Anna Nagar, Chennai", status: "active", progress: 0, parcels: 0, buildings: 0, roads: 0, area: 0, confidence: 0, updatedAt: now, createdAt: now, assignee: "Arjun Kumar", phase: "Data intake" }, ...prev]); setNewProjectOpen(false); onToast(`Project “${name}” created`, "success"); setProjectName(""); }}>Create Project</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
