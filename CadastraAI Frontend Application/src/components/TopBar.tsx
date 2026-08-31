import { Database, User, Circle } from "lucide-react";

interface TopBarProps {
  breadcrumbs: string[];
}

export default function TopBar({ breadcrumbs }: TopBarProps) {
  return (
    <header
      className="flex items-center h-12 px-4 md:px-6 flex-shrink-0 gap-4"
      style={{ background: "rgba(5,13,26,0.8)", borderBottom: "1px solid rgba(34,211,238,0.08)", backdropFilter: "blur(12px)" }}
    >
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-xs flex-1 min-w-0 ml-10 md:ml-0" aria-label="Breadcrumb" style={{ fontFamily: "JetBrains Mono" }}>
        {breadcrumbs.map((crumb, i) => (
          <span key={i} className="flex items-center gap-1.5 min-w-0">
            {i > 0 && <span className="text-slate-600">›</span>}
            <span className={i === breadcrumbs.length - 1 ? "text-slate-300 font-medium truncate" : "text-slate-500 truncate"}>
              {crumb}
            </span>
          </span>
        ))}
      </nav>

      {/* Status indicators */}
      <div className="flex items-center gap-4 flex-shrink-0">
        <div className="hidden sm:flex items-center gap-1.5">
          <Circle size={6} className="fill-cyan-400 text-cyan-400 animate-pulse" />
          <span className="text-[11px] font-medium text-cyan-400" style={{ fontFamily: "JetBrains Mono" }}>AI ENGINE ONLINE</span>
        </div>
        <div className="hidden sm:flex items-center gap-1.5">
          <Circle size={6} className="fill-green-400 text-green-400 animate-pulse" style={{ animationDelay: "0.5s" }} />
          <span className="text-[11px] font-medium text-green-400" style={{ fontFamily: "JetBrains Mono" }}>GIS ENGINE ONLINE</span>
        </div>
        <button
          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-cyan-400 transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-cyan-400"
          style={{ background: "rgba(10,22,40,0.6)", border: "1px solid rgba(34,211,238,0.12)" }}
          aria-label="Database"
        >
          <Database size={14} />
        </button>
        <button
          className="w-8 h-8 rounded-full flex items-center justify-center text-slate-300 hover:text-white transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-cyan-400"
          style={{ background: "linear-gradient(135deg, #1a3260 0%, #0a1628 100%)", border: "1px solid rgba(34,211,238,0.2)" }}
          aria-label="User profile"
        >
          <User size={14} />
        </button>
      </div>
    </header>
  );
}
