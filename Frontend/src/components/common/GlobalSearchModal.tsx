import { useState, useMemo, useEffect, useRef } from "react";
import {
  Search, MapPin, Layers, CheckSquare, BarChart2, Download,
  Cpu, User, X, ChevronRight, Compass, Building2, AlertTriangle, ArrowRight, History, Trash2
} from "lucide-react";
import { useCadastra } from "../../context/CadastraContext";
import { searchService } from "../../services/searchService";
import type { View } from "../../types";

interface GlobalSearchModalProps {
  open: boolean;
  onClose: () => void;
  onNavigate: (view: View) => void;
}

export default function GlobalSearchModal({ open, onClose, onNavigate }: GlobalSearchModalProps) {
  const { parcels, projects, setSelectedParcelId } = useCadastra();
  const [query, setQuery] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setHistory(searchService.getHistory());
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
      setSelectedIndex(0);
    }
  }, [open]);

  const results = useMemo(() => {
    return searchService.search(query);
  }, [query]);

  // Reset selected index when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const quickTools = useMemo(() => [
    { name: "WebGIS Command Center", view: "webgis" as View, desc: "Interactive map, layers & spatial geometry", icon: <MapPin size={14} className="text-[#00d4ff]" /> },
    { name: "Validation & Reconciliation", view: "validation" as View, desc: "Topology check, sliver repair & audit reports", icon: <CheckSquare size={14} className="text-[#10b981]" /> },
    { name: "Parcel Explorer & Registry", view: "parcel-explorer" as View, desc: "Land ownership records & certificates", icon: <Compass size={14} className="text-[#8b5cf6]" /> },
    { name: "AI Inference & Processing", view: "ai-processing" as View, desc: "CadastraNet ML-CV building extraction", icon: <Cpu size={14} className="text-[#3b82f6]" /> },
    { name: "GIS & AI Analytics", view: "analytics" as View, desc: "Operational telemetry & distribution charts", icon: <BarChart2 size={14} className="text-[#00d4ff]" /> },
    { name: "Spatial Data Export Center", view: "exports" as View, desc: "GeoJSON, CSV, PDF & GIS bundles", icon: <Download size={14} className="text-[#f59e0b]" /> },
  ], []);

  const currentItemsLength = query.trim() ? results.length : quickTools.length;

  // Keyboard navigation listener (Esc, ArrowDown, ArrowUp, Enter)
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1 < currentItemsLength ? prev + 1 : 0));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : Math.max(0, currentItemsLength - 1)));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (query.trim() && results[selectedIndex]) {
          const item = results[selectedIndex];
          handleSelectResult(item.targetView, item.targetId, item.title);
        } else if (!query.trim() && quickTools[selectedIndex]) {
          const item = quickTools[selectedIndex];
          handleSelectResult(item.view, undefined, item.name);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose, currentItemsLength, selectedIndex, query, results, quickTools]);

  const handleSelectResult = (targetView: View, targetId?: string, queryToSave?: string) => {
    if (queryToSave || query) {
      searchService.addHistory(queryToSave || query);
      setHistory(searchService.getHistory());
    }
    if (targetId) {
      setSelectedParcelId(targetId);
    }
    onNavigate(targetView);
    onClose();
  };

  const handleClearHistory = () => {
    searchService.clearHistory();
    setHistory([]);
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Global Spatial Search"
    >
      <div className="absolute inset-0 bg-[rgba(0,0,0,0.75)] backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[#0d1526] border border-[rgba(30,60,100,0.7)] rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Search Input Bar */}
        <div className="p-4 border-b border-[rgba(30,60,100,0.5)] flex items-center gap-3 bg-[#0a1120]">
          <Search size={18} className="text-[#00d4ff] flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search parcels, survey numbers, owners, projects, tools…"
            className="flex-1 bg-transparent text-sm text-[#e2eaf4] placeholder-[#4a6a8a] focus:outline-none"
            aria-label="Search query"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="p-1 text-[#4a6a8a] hover:text-[#e2eaf4] rounded cursor-pointer"
              aria-label="Clear search input"
            >
              <X size={14} />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-[#4a6a8a] bg-[rgba(30,60,100,0.3)] border border-[rgba(30,60,100,0.5)] rounded">
            ESC
          </kbd>
        </div>

        {/* Results Container */}
        <div className="max-h-96 overflow-y-auto p-3 flex flex-col gap-3">

          {/* If query is active, display categorized search results */}
          {query.trim() ? (
            results.length > 0 ? (
              <div className="flex flex-col gap-1" role="listbox">
                {results.map((item, idx) => {
                  const isSelected = selectedIndex === idx;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelectResult(item.targetView, item.targetId, item.title)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-colors group cursor-pointer ${
                        isSelected
                          ? "bg-[rgba(0,212,255,0.15)] border-[#00d4ff]"
                          : "border-transparent hover:bg-[rgba(30,60,100,0.3)] hover:border-[rgba(0,212,255,0.25)]"
                      }`}
                      role="option"
                      aria-selected={isSelected}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="p-2 rounded-lg bg-[rgba(0,212,255,0.1)] text-[#00d4ff] flex-shrink-0">
                          {item.category === "Parcels" && <MapPin size={14} />}
                          {item.category === "Projects" && <Building2 size={14} />}
                          {item.category === "Views & Tools" && <Compass size={14} />}
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-semibold text-[#e2eaf4] group-hover:text-[#00d4ff] transition-colors truncate">
                            {item.title}
                          </div>
                          <div className="text-[11px] text-[#7a9cc0] truncate mt-0.5">
                            {item.subtitle}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                        {item.badge && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded font-mono bg-[rgba(30,60,100,0.5)] text-[#7a9cc0]">
                            {item.badge}
                          </span>
                        )}
                        <ArrowRight size={13} className="text-[#4a6a8a] group-hover:text-[#00d4ff] transition-colors" />
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="py-10 text-center text-xs text-[#4a6a8a]">
                No matching parcels, survey numbers, or projects found for &quot;{query}&quot;.
              </div>
            )
          ) : (
            /* Default View: Quick Navigation & Recent Searches */
            <>
              {history.length > 0 && (
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between px-2 text-[10px] font-semibold text-[#4a6a8a] uppercase tracking-wider">
                    <span className="flex items-center gap-1">
                      <History size={11} /> Recent Searches
                    </span>
                    <button
                      onClick={handleClearHistory}
                      className="text-[#ef4444] hover:underline normal-case text-[10px] cursor-pointer"
                    >
                      Clear
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 p-2">
                    {history.map((h, i) => (
                      <button
                        key={i}
                        onClick={() => setQuery(h)}
                        className="px-2.5 py-1 rounded-lg text-xs font-mono text-[#7a9cc0] bg-[rgba(30,60,100,0.25)] hover:bg-[rgba(30,60,100,0.45)] hover:text-[#e2eaf4] border border-[rgba(30,60,100,0.4)] transition-colors cursor-pointer"
                      >
                        {h}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-1" role="listbox">
                <div className="px-2 text-[10px] font-semibold text-[#4a6a8a] uppercase tracking-wider mb-1">
                  Quick Navigation Tools
                </div>
                {quickTools.map((item, idx) => {
                  const isSelected = selectedIndex === idx;
                  return (
                    <button
                      key={item.view}
                      onClick={() => handleSelectResult(item.view, undefined, item.name)}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-colors group cursor-pointer ${
                        isSelected
                          ? "bg-[rgba(0,212,255,0.15)] border border-[#00d4ff]"
                          : "hover:bg-[rgba(30,60,100,0.3)] border border-transparent"
                      }`}
                      role="option"
                      aria-selected={isSelected}
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-[rgba(30,60,100,0.3)] border border-[rgba(30,60,100,0.5)]">
                          {item.icon}
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-[#e2eaf4] group-hover:text-[#00d4ff] transition-colors">
                            {item.name}
                          </div>
                          <div className="text-[10px] text-[#4a6a8a]">{item.desc}</div>
                        </div>
                      </div>
                      <ChevronRight size={14} className="text-[#4a6a8a] group-hover:text-[#00d4ff]" />
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2.5 bg-[#0a1120] border-t border-[rgba(30,60,100,0.4)] flex justify-between items-center text-[10px] font-mono text-[#4a6a8a]">
          <span>Spatial Command Palette (↑↓ to select, ↵ to open)</span>
          <span>Press ESC to close</span>
        </div>
      </div>
    </div>
  );
}
