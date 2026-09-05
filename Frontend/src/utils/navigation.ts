import type { View } from "../types";

export const APP_VIEWS: View[] = [
  "dashboard",
  "ai-processing",
  "webgis",
  "validation",
  "parcel-explorer",
  "analytics",
  "exports",
  "profile",
];

export const AUTH_VIEWS: View[] = [
  "signin",
  "signup",
  "forgot-password",
  "workspace-setup",
];

export function normalizePathToView(pathname: string, hash: string): { view: View; isAuthView: boolean } {
  // Check hash first if present (e.g. #/validation or #reset-password)
  const cleanHash = hash.replace(/^[#/]+/, "").toLowerCase();
  if (cleanHash === "reset-password" || cleanHash === "forgot-password") {
    return { view: "forgot-password", isAuthView: true };
  }
  if (cleanHash === "signup" || cleanHash === "create-account") {
    return { view: "signup", isAuthView: true };
  }
  if (cleanHash === "signin" || cleanHash === "login") {
    return { view: "signin", isAuthView: true };
  }
  if (cleanHash === "workspace-setup") {
    return { view: "workspace-setup", isAuthView: true };
  }
  if (APP_VIEWS.includes(cleanHash as View)) {
    return { view: cleanHash as View, isAuthView: false };
  }

  // Check pathname
  const cleanPath = pathname.replace(/^\/+|\/+$/g, "").toLowerCase();
  
  if (cleanPath === "reset-password" || cleanPath === "forgot-password") {
    return { view: "forgot-password", isAuthView: true };
  }
  if (cleanPath === "signup" || cleanPath === "create-account") {
    return { view: "signup", isAuthView: true };
  }
  if (cleanPath === "signin" || cleanPath === "login") {
    return { view: "signin", isAuthView: true };
  }
  if (cleanPath === "workspace-setup") {
    return { view: "workspace-setup", isAuthView: true };
  }
  if (APP_VIEWS.includes(cleanPath as View)) {
    return { view: cleanPath as View, isAuthView: false };
  }

  // Default fallback
  return { view: "dashboard", isAuthView: false };
}

export function getViewPath(view: View): string {
  if (view === "dashboard") return "/dashboard";
  return `/${view}`;
}
