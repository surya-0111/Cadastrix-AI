import { useState } from "react";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import Dashboard from "./views/Dashboard";
import AIProcessing from "./views/AIProcessing";
import WebGIS from "./views/WebGIS";
import Validation from "./views/Validation";

type View = "dashboard" | "processing" | "webgis" | "validation" | "parcels" | "exports" | "analytics";

const BREADCRUMBS: Record<View, string[]> = {
  dashboard: ["PROJECTS", "URBAN SURVEY – CHENNAI"],
  processing: ["AI PROCESSING", "EXTRACTING PHYSICAL FEATURES"],
  webgis: ["PROJECTS", "WEBGIS"],
  validation: ["PROJECTS", "VALIDATION CENTER"],
  parcels: ["PROJECTS", "PARCEL EXPLORER"],
  exports: ["PROJECTS", "EXPORTS"],
  analytics: ["PROJECTS", "ANALYTICS"],
};

function PlaceholderView({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="flex-1 flex items-center justify-center flex-col gap-3 text-center p-8">
      <div className="text-lg font-semibold text-slate-400" style={{ fontFamily: "Inter" }}>{title}</div>
      <div className="text-sm text-slate-600" style={{ fontFamily: "JetBrains Mono" }}>{sub}</div>
    </div>
  );
}

export default function App() {
  const [view, setView] = useState<View>("dashboard");

  const navigate = (v: View) => setView(v);

  return (
    <div
      className="flex h-full overflow-hidden"
      style={{ background: "#050d1a", color: "#e2e8f0" }}
    >
      <Sidebar activeView={view} onNavigate={navigate} />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <TopBar breadcrumbs={BREADCRUMBS[view]} />
        <main className="flex-1 overflow-hidden flex flex-col min-h-0">
          {view === "dashboard" && (
            <Dashboard onNavigate={(v) => navigate(v as View)} />
          )}
          {view === "processing" && <AIProcessing />}
          {view === "webgis" && <WebGIS />}
          {view === "validation" && <Validation />}
          {view === "parcels" && (
            <PlaceholderView title="Parcel Explorer" sub="SELECT A PARCEL FROM VALIDATION VIEW OR WEBGIS" />
          )}
          {view === "exports" && (
            <PlaceholderView title="Exports" sub="NO COMPLETED EXPORTS YET" />
          )}
          {view === "analytics" && (
            <PlaceholderView title="Analytics" sub="PROCESSING DATA…" />
          )}
        </main>
      </div>
    </div>
  );
}
