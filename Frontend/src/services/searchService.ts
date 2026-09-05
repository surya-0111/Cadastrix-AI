import { getSearchHistory, addSearchHistoryItem, clearSearchHistory } from "../utils/storage";
import { projectService } from "./projectService";
import type { Parcel, Project, View } from "../types";

export interface SearchResultItem {
  id: string;
  category: "Parcels" | "Projects" | "Views & Tools" | "Reports";
  title: string;
  subtitle: string;
  badge?: string;
  targetView: View;
  targetId?: string;
}

export const searchService = {
  getHistory(): string[] {
    return getSearchHistory();
  },

  addHistory(query: string): void {
    addSearchHistoryItem(query);
  },

  clearHistory(): void {
    clearSearchHistory();
  },

  search(query: string): SearchResultItem[] {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const results: SearchResultItem[] = [];
    const parcels = projectService.getParcels();
    const projects = projectService.getProjects();

    // Search Parcels
    parcels.forEach(p => {
      if (
        p.id.toLowerCase().includes(q) ||
        p.surveyNo.toLowerCase().includes(q) ||
        p.owner.toLowerCase().includes(q) ||
        p.ward.toLowerCase().includes(q) ||
        p.zone.toLowerCase().includes(q) ||
        p.landUse.toLowerCase().includes(q)
      ) {
        results.push({
          id: `parcel-${p.id}`,
          category: "Parcels",
          title: `${p.surveyNo} · ${p.landUse}`,
          subtitle: `Owner: ${p.owner} · Extent: ${p.area.toLocaleString()} m² · ${p.zone}`,
          badge: p.status.toUpperCase(),
          targetView: "webgis",
          targetId: p.id,
        });
      }
    });

    // Search Projects
    projects.forEach(prj => {
      if (
        prj.name.toLowerCase().includes(q) ||
        prj.location.toLowerCase().includes(q) ||
        prj.phase.toLowerCase().includes(q)
      ) {
        results.push({
          id: `prj-${prj.id}`,
          category: "Projects",
          title: prj.name,
          subtitle: `${prj.location} · ${prj.parcels} parcels · ${prj.phase}`,
          badge: `${prj.progress}%`,
          targetView: "dashboard",
        });
      }
    });

    // Search Views & Tools
    const views: { title: string; subtitle: string; view: View; keywords: string[] }[] = [
      { title: "WebGIS Command Center", subtitle: "Interactive map, layers, spatial inspection & GIS overlays", view: "webgis", keywords: ["map", "gis", "layer", "satellite", "spatial", "orthomosaic"] },
      { title: "Validation & Topology Audit", subtitle: "Reconcile boundaries, fix slivers, batch approve parcels", view: "validation", keywords: ["validate", "topology", "sliver", "repair", "reconciliation", "audit", "approve"] },
      { title: "AI Processing & Inference", subtitle: "CadastraNet ML-CV boundary & rooftop segmentation pipeline", view: "ai-processing", keywords: ["ai", "model", "inference", "segmentation", "geotiff", "resnet", "cv"] },
      { title: "Parcel Explorer & Registry", subtitle: "Search land registry, filter classification, generate certificates", view: "parcel-explorer", keywords: ["explorer", "registry", "records", "patta", "survey"] },
      { title: "GIS & AI Operational Analytics", subtitle: "Telemetry charts, confidence histograms, land use ratios", view: "analytics", keywords: ["analytics", "charts", "stats", "telemetry", "metrics"] },
      { title: "Spatial Data Export Center", subtitle: "Download GeoJSON, Shapefiles, CSV tables, and PDF packages", view: "exports", keywords: ["export", "download", "geojson", "csv", "pdf", "shapefile"] },
      { title: "Profile & System Settings", subtitle: "Personal credentials, session management, theme & roles", view: "profile", keywords: ["profile", "settings", "password", "security", "sessions", "admin"] },
    ];

    views.forEach(v => {
      if (
        v.title.toLowerCase().includes(q) ||
        v.subtitle.toLowerCase().includes(q) ||
        v.keywords.some(k => k.includes(q))
      ) {
        results.push({
          id: `view-${v.view}`,
          category: "Views & Tools",
          title: v.title,
          subtitle: v.subtitle,
          targetView: v.view,
        });
      }
    });

    return results;
  },
};
