import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import type { Parcel, ParcelStatus, Project, MapLayer, ActivityItem, View, GeoJSONFeatureCollection, ProcessingStatus, AIProcessResponse } from "../types";
import { MAP_LAYERS, ACTIVITY_FEED } from "../data/mockData";
import { projectService } from "../services/projectService";

const API_BASE_URL = "http://127.0.0.1:8000";

interface CadastraContextType {
  parcels: Parcel[];
  selectedParcelId: string | null;
  projects: Project[];
  layers: MapLayer[];
  activityFeed: ActivityItem[];
  currentView: View;
  processedGeoJson: GeoJSONFeatureCollection | null;
  processingStatus: ProcessingStatus;
  processingError: string | null;
  uploadedFileName: string | null;
  polygonCount: number;
  processGeoTiff: (file: File) => Promise<boolean>;
  resetProcessing: () => void;
  setSelectedParcelId: (id: string | null) => void;
  navigateTo: (view: View, parcelId?: string | null) => void;
  acceptParcel: (id: string, note?: string) => void;
  rejectParcel: (id: string, reason?: string) => void;
  repairParcelTopology: (id: string) => void;
  batchApproveParcels: () => number;
  toggleLayer: (id: string) => void;
  setLayerOpacity: (id: string, opacity: number) => void;
  addActivity: (action: string, target: string, type?: ActivityItem["type"]) => void;
}

const CadastraContext = createContext<CadastraContextType | undefined>(undefined);

export function CadastraProvider({
  children,
  currentView,
  onNavigate,
  onToast,
}: {
  children: React.ReactNode;
  currentView: View;
  onNavigate: (view: View) => void;
  onToast: (msg: string, type?: "success" | "error" | "info" | "warning") => void;
}) {
  const [parcels, setParcels] = useState<Parcel[]>(() => projectService.getParcels());
  const [selectedParcelId, setSelectedParcelId] = useState<string | null>("CHN-AN-002-2025");
  const [projects, setProjects] = useState<Project[]>(() => projectService.getProjects());
  const [layers, setLayers] = useState<MapLayer[]>(MAP_LAYERS);
  const [activityFeed, setActivityFeed] = useState<ActivityItem[]>(
    ACTIVITY_FEED as ActivityItem[]
  );

  // Real ML-CV Processing State
  const [processedGeoJson, setProcessedGeoJson] = useState<GeoJSONFeatureCollection | null>(null);
  const [processingStatus, setProcessingStatus] = useState<ProcessingStatus>("idle");
  const [processingError, setProcessingError] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [polygonCount, setPolygonCount] = useState<number>(0);

  const addActivity = useCallback(
    (action: string, target: string, type: ActivityItem["type"] = "info") => {
      const newItem: ActivityItem = {
        id: Date.now(),
        user: "Arjun K.",
        action,
        target,
        time: "Just now",
        type,
      };
      setActivityFeed((prev) => [newItem, ...prev]);
    },
    []
  );

  const processGeoTiff = useCallback(
    async (file: File): Promise<boolean> => {
      const filenameLower = file.name.toLowerCase();
      if (!filenameLower.endsWith(".tif") && !filenameLower.endsWith(".tiff")) {
        setProcessingStatus("error");
        setProcessingError("Invalid file type. Please upload a .tif or .tiff GeoTIFF file.");
        onToast("Invalid file type: only .tif and .tiff supported", "error");
        return false;
      }

      setProcessingStatus("processing");
      setProcessingError(null);
      setUploadedFileName(file.name);

      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await fetch(`${API_BASE_URL}/api/process`, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          let errorMsg = `Server error (${response.status})`;
          try {
            const errData = await response.json();
            if (errData.detail) {
              errorMsg = errData.detail;
            }
          } catch {
            errorMsg = response.statusText || errorMsg;
          }
          setProcessingStatus("error");
          setProcessingError(errorMsg);
          onToast(`Processing failed: ${errorMsg}`, "error");
          return false;
        }

        const data: AIProcessResponse = await response.json();
        setProcessedGeoJson(data.geojson);
        setPolygonCount(data.feature_count);

        if (data.feature_count === 0) {
          setProcessingStatus("empty");
          onToast("Processing completed: 0 polygons detected", "info");
        } else {
          setProcessingStatus("success");
          addActivity(
            `extracted ${data.feature_count} cadastral polygons from`,
            file.name,
            "success"
          );
          onToast(
            `Extracted ${data.feature_count} polygons from ${file.name}`,
            "success"
          );
        }
        return true;
      } catch (err: any) {
        const msg = err.message || "Could not connect to ML-CV backend at 127.0.0.1:8000";
        setProcessingStatus("error");
        setProcessingError(msg);
        onToast(`ML-CV Connection Error: ${msg}`, "error");
        return false;
      }
    },
    [addActivity, onToast]
  );

  const resetProcessing = useCallback(() => {
    setProcessedGeoJson(null);
    setProcessingStatus("idle");
    setProcessingError(null);
    setUploadedFileName(null);
    setPolygonCount(0);
  }, []);

  const navigateTo = useCallback(
    (view: View, parcelId?: string | null) => {
      if (parcelId !== undefined) {
        setSelectedParcelId(parcelId);
      }
      onNavigate(view);
    },
    [onNavigate]
  );

  const acceptParcel = useCallback(
    (id: string, note?: string) => {
      const updated = projectService.updateParcelStatus(id, "validated", note);
      setParcels(updated);
      addActivity(note || "accepted parcel boundary", id, "success");
      onToast(`Parcel ${id} accepted & verified`, "success");
    },
    [addActivity, onToast]
  );

  const rejectParcel = useCallback(
    (id: string, reason?: string) => {
      const updated = projectService.updateParcelStatus(id, "review", reason);
      setParcels(updated);
      addActivity(reason || "flagged for review / reconciliation", id, "review");
      onToast(`Parcel ${id} marked for review`, "warning");
    },
    [addActivity, onToast]
  );

  const repairParcelTopology = useCallback(
    (id: string) => {
      const updated = projectService.repairTopology(id);
      setParcels(updated);
      addActivity("auto-repaired topology slivers on", id, "resolved");
      onToast(`Parcel ${id} topology sliver gaps reconciled & validated`, "success");
    },
    [addActivity, onToast]
  );

  const batchApproveParcels = useCallback((): number => {
    const updated = projectService.batchApproveAll();
    setParcels(updated);
    addActivity("batch approved all survey sector parcels", "Batch AN-34-C3", "success");
    onToast(`Batch approved ${updated.length} parcels in Anna Nagar Sector IV`, "success");
    return updated.length;
  }, [addActivity, onToast]);

  const toggleLayer = useCallback((id: string) => {
    setLayers((prev) =>
      prev.map((l) => (l.id === id ? { ...l, visible: !l.visible } : l))
    );
  }, []);

  const setLayerOpacity = useCallback((id: string, opacity: number) => {
    setLayers((prev) =>
      prev.map((l) => (l.id === id ? { ...l, opacity } : l))
    );
  }, []);

  return (
    <CadastraContext.Provider
      value={{
        parcels,
        selectedParcelId,
        projects,
        layers,
        activityFeed,
        currentView,
        processedGeoJson,
        processingStatus,
        processingError,
        uploadedFileName,
        polygonCount,
        processGeoTiff,
        resetProcessing,
        setSelectedParcelId,
        navigateTo,
        acceptParcel,
        rejectParcel,
        repairParcelTopology,
        batchApproveParcels,
        toggleLayer,
        setLayerOpacity,
        addActivity,
      }}
    >
      {children}
    </CadastraContext.Provider>
  );
}

export function useCadastra() {
  const context = useContext(CadastraContext);
  if (!context) {
    throw new Error("useCadastra must be used within a CadastraProvider");
  }
  return context;
}
