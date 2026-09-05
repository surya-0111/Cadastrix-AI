export type View =
  | "signin"
  | "signup"
  | "forgot-password"
  | "reset-password"
  | "workspace-setup"
  | "dashboard"
  | "ai-processing"
  | "webgis"
  | "validation"
  | "parcel-explorer"
  | "analytics"
  | "exports"
  | "profile";

export type UserRole =
  | "Administrator"
  | "GIS Analyst"
  | "Surveyor"
  | "Project Manager"
  | "Data Engineer"
  | "Viewer";

export interface RolePermissions {
  canEditParcels: boolean;
  canBatchApprove: boolean;
  canRunAI: boolean;
  canExport: boolean;
  canManageUsers: boolean;
  canRepairTopology: boolean;
  isReadOnly: boolean;
}

export function getRolePermissions(role: UserRole): RolePermissions {
  switch (role) {
    case "Administrator":
      return {
        canEditParcels: true,
        canBatchApprove: true,
        canRunAI: true,
        canExport: true,
        canManageUsers: true,
        canRepairTopology: true,
        isReadOnly: false,
      };
    case "GIS Analyst":
      return {
        canEditParcels: true,
        canBatchApprove: false,
        canRunAI: true,
        canExport: true,
        canManageUsers: false,
        canRepairTopology: true,
        isReadOnly: false,
      };
    case "Surveyor":
      return {
        canEditParcels: true,
        canBatchApprove: false,
        canRunAI: false,
        canExport: true,
        canManageUsers: false,
        canRepairTopology: true,
        isReadOnly: false,
      };
    case "Project Manager":
      return {
        canEditParcels: false,
        canBatchApprove: false,
        canRunAI: false,
        canExport: true,
        canManageUsers: false,
        canRepairTopology: false,
        isReadOnly: false,
      };
    case "Data Engineer":
      return {
        canEditParcels: false,
        canBatchApprove: false,
        canRunAI: true,
        canExport: true,
        canManageUsers: false,
        canRepairTopology: false,
        isReadOnly: false,
      };
    case "Viewer":
    default:
      return {
        canEditParcels: false,
        canBatchApprove: false,
        canRunAI: false,
        canExport: false,
        canManageUsers: false,
        canRepairTopology: false,
        isReadOnly: true,
      };
  }
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  organization: string;
  avatar?: string;
  timezone: string;
  language: string;
  jobTitle: string;
  workspace: string;
  twoFactorEnabled: boolean;
  notificationPrefs: NotificationPrefs;
}

export interface NotificationPrefs {
  projectProcessing: boolean;
  validationFailures: boolean;
  exports: boolean;
  teamMentions: boolean;
  systemAlerts: boolean;
}

export type ProjectStatus = "active" | "processing" | "completed" | "failed" | "review";

export interface Project {
  id: string;
  name: string;
  location: string;
  status: ProjectStatus;
  progress: number;
  parcels: number;
  buildings: number;
  roads: number;
  area: number;
  confidence: number;
  updatedAt: string;
  createdAt: string;
  assignee: string;
  phase: string;
}

export type ParcelStatus = "validated" | "review" | "error" | "pending";

export interface Parcel {
  id: string;
  surveyNo: string;
  ward: string;
  zone: string;
  landUse: string;
  area: number;
  buildings: number;
  owner: string;
  confidence: number;
  status: ParcelStatus;
  topologyErrors: number;
  lastUpdated: string;
}

export interface ProcessingLog {
  time: string;
  level: "info" | "warn" | "error" | "success";
  message: string;
}

export interface MapLayer {
  id: string;
  name: string;
  visible: boolean;
  color: string;
  count: number;
  opacity: number;
}

export interface Toast {
  id: string;
  type: "success" | "error" | "warning" | "info";
  message: string;
}

export interface Session {
  id: string;
  device: string;
  location: string;
  lastActive: string;
  current: boolean;
  browser: string;
}

export interface ActivityItem {
  id: number;
  user: string;
  action: string;
  target: string;
  time: string;
  type: "success" | "review" | "resolved" | "export" | "upload" | "info";
}

export type ProcessingStatus = "idle" | "running" | "paused" | "processing" | "success" | "empty" | "error" | "completed" | "failed";

export type GeoJSONPolygonGeometry = {
  type: "Polygon";
  coordinates: number[][][];
};

export type GeoJSONMultiPolygonGeometry = {
  type: "MultiPolygon";
  coordinates: number[][][][];
};

export type GeoJSONGeometry = GeoJSONPolygonGeometry | GeoJSONMultiPolygonGeometry;

export interface GeoJSONFeature {
  type: "Feature";
  id?: string;
  properties?: Record<string, any>;
  geometry: GeoJSONGeometry;
}

export interface GeoJSONFeatureCollection {
  type: "FeatureCollection";
  features: GeoJSONFeature[];
  crs?: {
    type: string;
    properties: {
      name: string;
    };
  };
}

export interface AIProcessResponse {
  status: string;
  filename: string;
  feature_count: number;
  geojson: GeoJSONFeatureCollection;
}
