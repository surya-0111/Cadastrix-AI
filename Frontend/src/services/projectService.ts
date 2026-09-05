import type { Parcel, Project, ParcelStatus } from "../types";
import { PARCELS, PROJECTS } from "../data/mockData";
import { STORAGE_KEYS } from "../utils/storage";

export const projectService = {
  getProjects(): Project[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.PROJECTS);
      return raw ? JSON.parse(raw) : PROJECTS;
    } catch {
      return PROJECTS;
    }
  },

  getParcels(): Parcel[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.PARCELS);
      return raw ? JSON.parse(raw) : PARCELS;
    } catch {
      return PARCELS;
    }
  },

  saveParcels(parcels: Parcel[]): void {
    localStorage.setItem(STORAGE_KEYS.PARCELS, JSON.stringify(parcels));
  },

  updateParcelStatus(parcelId: string, status: ParcelStatus, notes?: string): Parcel[] {
    const list = this.getParcels().map(p =>
      p.id === parcelId
        ? {
            ...p,
            status,
            topologyErrors: status === "validated" ? 0 : p.topologyErrors,
            lastUpdated: "Just now",
          }
        : p
    );
    this.saveParcels(list);
    return list;
  },

  batchApproveAll(): Parcel[] {
    const list = this.getParcels().map(p => ({
      ...p,
      status: "validated" as ParcelStatus,
      topologyErrors: 0,
      lastUpdated: "Just now",
    }));
    this.saveParcels(list);
    return list;
  },

  repairTopology(parcelId: string): Parcel[] {
    const list = this.getParcels().map(p =>
      p.id === parcelId
        ? {
            ...p,
            topologyErrors: 0,
            status: "validated" as ParcelStatus,
            lastUpdated: "Just now",
          }
        : p
    );
    this.saveParcels(list);
    return list;
  },
};
