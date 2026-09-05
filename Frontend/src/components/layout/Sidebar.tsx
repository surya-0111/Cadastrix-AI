import {
  Map, LayoutDashboard, Cpu, CheckSquare, User, ChevronLeft, ChevronRight, X,
  Compass, BarChart2, Download
} from "lucide-react";
import type { View } from "../../types";

interface SidebarProps {
  currentView: View;
  onNavigate: (view: View) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

const navItems: { view: View; icon: typeof LayoutDashboard; label: string }[] = [
  { view: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { view: "ai-processing", icon: Cpu, label: "AI Processing" },
  { view: "webgis", icon: Map, label: "WebGIS" },
  { view: "validation", icon: CheckSquare, label: "Validation" },
  { view: "parcel-explorer", icon: Compass, label: "Parcel Explorer" },
  { view: "analytics", icon: BarChart2, label: "Analytics" },
  { view: "exports", icon: Download, label: "Exports" },
];

function SidebarContent({
  currentView, onNavigate, collapsed, onToggleCollapse, onMobileClose,
}: Omit<SidebarProps, "mobileOpen">) {
  return (
    <div className="h-full flex flex-col bg-[#080e1a] border-r border-[rgba(30,60,100,0.5)]">
      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 py-5 border-b border-[rgba(30,60,100,0.4)] ${collapsed ? "justify-center" : ""}`}>
        <div className="w-8 h-8 rounded-lg bg-[rgba(0,212,255,0.12)] border border-[rgba(0,212,255,0.25)] flex items-center justify-center flex-shrink-0">
          <Map size={16} className="text-[#00d4ff]" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <div className="text-sm font-bold text-[#e2eaf4] leading-tight">CadastrixAI</div>
            <div className="text-[10px] text-[#4a6a8a] uppercase tracking-widest leading-tight">GIS Command Center</div>
          </div>
        )}
        <button
          onClick={onMobileClose}
          className="ml-auto md:hidden text-[#4a6a8a] hover:text-[#e2eaf4] p-1"
          aria-label="Close menu"
        >
          <X size={16} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2 flex flex-col gap-1" aria-label="Main navigation">
        {navItems.map(({ view, icon: Icon, label }) => {
          const active = currentView === view;
          return (
            <button
              key={view}
              onClick={() => { onNavigate(view); onMobileClose(); }}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 w-full text-left
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(0,212,255,0.4)]
                ${active
                  ? "bg-[rgba(0,212,255,0.1)] text-[#00d4ff] border border-[rgba(0,212,255,0.2)]"
                  : "text-[#7a9cc0] hover:bg-[rgba(30,60,100,0.3)] hover:text-[#e2eaf4]"}
                ${collapsed ? "justify-center" : ""}
              `}
              title={collapsed ? label : undefined}
              aria-current={active ? "page" : undefined}
            >
              <Icon size={16} className="flex-shrink-0" />
              {!collapsed && <span>{label}</span>}
              {!collapsed && active && <div className="ml-auto w-1 h-1 rounded-full bg-[#00d4ff]" />}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className={`px-2 pb-4 flex flex-col gap-1 border-t border-[rgba(30,60,100,0.4)] pt-3`}>
        <button
          onClick={() => { onNavigate("profile"); onMobileClose(); }}
          className={`
            flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 w-full text-left
            ${currentView === "profile" ? "bg-[rgba(0,212,255,0.1)] text-[#00d4ff]" : "text-[#7a9cc0] hover:bg-[rgba(30,60,100,0.3)] hover:text-[#e2eaf4]"}
            ${collapsed ? "justify-center" : ""}
          `}
          title={collapsed ? "Profile" : undefined}
        >
          <User size={16} className="flex-shrink-0" />
          {!collapsed && <span>Profile</span>}
        </button>

        {/* Collapse toggle — desktop only */}
        <button
          onClick={onToggleCollapse}
          className="hidden md:flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs text-[#4a6a8a] hover:bg-[rgba(30,60,100,0.3)] hover:text-[#7a9cc0] transition-all w-full"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight size={14} /> : <><ChevronLeft size={14} /><span>Collapse</span></>}
        </button>
      </div>
    </div>
  );
}

export default function Sidebar(props: SidebarProps) {
  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={`hidden md:flex flex-col transition-all duration-200 flex-shrink-0 ${props.collapsed ? "w-14" : "w-52"}`}
        aria-label="Sidebar"
      >
        <SidebarContent {...props} onMobileClose={() => {}} />
      </aside>

      {/* Mobile drawer */}
      {props.mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-[rgba(4,8,20,0.8)] backdrop-blur-sm md:hidden"
            onClick={props.onMobileClose}
          />
          <aside className="fixed inset-y-0 left-0 z-50 w-64 flex flex-col md:hidden" aria-label="Mobile navigation">
            <SidebarContent {...props} collapsed={false} />
          </aside>
        </>
      )}
    </>
  );
}
