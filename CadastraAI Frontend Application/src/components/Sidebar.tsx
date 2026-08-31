import { useState } from "react";
import {
  FolderOpen, Cpu, Map, CheckSquare, Package, Download, BarChart2,
  Settings, HelpCircle, ChevronLeft, Menu, X
} from "lucide-react";

type View = "dashboard" | "processing" | "webgis" | "validation" | "parcels" | "exports" | "analytics";

interface SidebarProps {
  activeView: View;
  onNavigate: (view: View) => void;
}

const NAV = [
  { id: "dashboard" as View, label: "Projects", icon: FolderOpen },
  { id: "processing" as View, label: "AI Processing", icon: Cpu },
  { id: "webgis" as View, label: "WebGIS", icon: Map },
  { id: "validation" as View, label: "Validation", icon: CheckSquare },
  { id: "parcels" as View, label: "Parcels", icon: Package },
  { id: "exports" as View, label: "Exports", icon: Download },
  { id: "analytics" as View, label: "Analytics", icon: BarChart2 },
];

export default function Sidebar({ activeView, onNavigate }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const SidebarContent = ({ mobile = false }: { mobile?: boolean }) => (
    <aside
      className={`flex flex-col h-full transition-all duration-300 ${mobile ? "w-64" : collapsed ? "w-16" : "w-60"}`}
      style={{ background: "linear-gradient(180deg, #0a1628 0%, #060e1d 100%)", borderRight: "1px solid rgba(34,211,238,0.08)" }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b" style={{ borderColor: "rgba(34,211,238,0.08)" }}>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: "linear-gradient(135deg, #0891b2 0%, #22d3ee 100%)" }}>
          <Map size={16} className="text-white" />
        </div>
        {(!collapsed || mobile) && (
          <div className="min-w-0">
            <div className="text-sm font-bold text-white" style={{ fontFamily: "Inter", letterSpacing: "-0.02em" }}>CadastraAI</div>
            <div className="text-[10px] text-slate-400 font-medium tracking-widest uppercase" style={{ fontFamily: "JetBrains Mono" }}>GIS Command Center</div>
          </div>
        )}
        {!mobile && (
          <button
            onClick={() => setCollapsed(c => !c)}
            className="ml-auto text-slate-500 hover:text-cyan-400 transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-cyan-400 rounded"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <ChevronLeft size={16} className={`transition-transform ${collapsed ? "rotate-180" : ""}`} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 overflow-y-auto" role="navigation" aria-label="Main navigation">
        {NAV.map(({ id, label, icon: Icon }) => {
          const active = activeView === id;
          return (
            <button
              key={id}
              onClick={() => { onNavigate(id); setMobileOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-all duration-150 relative group focus:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-cyan-400
                ${active ? "text-cyan-400 bg-cyan-400/8" : "text-slate-400 hover:text-slate-200 hover:bg-white/4"}`}
              aria-current={active ? "page" : undefined}
            >
              {active && (
                <div className="absolute left-0 top-0 h-full w-0.5 bg-cyan-400 rounded-r" />
              )}
              <Icon size={16} className="flex-shrink-0" />
              {(!collapsed || mobile) && (
                <span className="text-sm font-medium truncate" style={{ fontFamily: "Inter" }}>{label}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="py-3 border-t" style={{ borderColor: "rgba(34,211,238,0.08)" }}>
        {[{ icon: Settings, label: "Settings" }, { icon: HelpCircle, label: "Help" }].map(({ icon: Icon, label }) => (
          <button
            key={label}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-slate-500 hover:text-slate-300 transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-cyan-400"
          >
            <Icon size={16} className="flex-shrink-0" />
            {(!collapsed || mobile) && <span className="text-sm" style={{ fontFamily: "Inter" }}>{label}</span>}
          </button>
        ))}
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden md:flex h-full flex-shrink-0">
        <SidebarContent />
      </div>

      {/* Mobile: hamburger trigger */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 w-9 h-9 flex items-center justify-center rounded-lg text-slate-300 hover:text-cyan-400 focus:outline-none focus-visible:ring-1 focus-visible:ring-cyan-400"
        style={{ background: "rgba(10,22,40,0.9)", border: "1px solid rgba(34,211,238,0.2)" }}
        onClick={() => setMobileOpen(o => !o)}
        aria-label="Toggle menu"
      >
        {mobileOpen ? <X size={18} /> : <Menu size={18} />}
      </button>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          <div className="flex h-full">
            <SidebarContent mobile />
          </div>
          <div className="flex-1 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
        </div>
      )}
    </>
  );
}
