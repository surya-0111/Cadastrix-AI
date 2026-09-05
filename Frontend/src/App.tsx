import { useState, useCallback, useEffect, useRef } from "react";
import type { View, User, Toast as ToastType } from "./types";

import Sidebar from "./components/layout/Sidebar";
import Header from "./components/layout/Header";
import Toast from "./components/ui/Toast";

import SignIn from "./views/auth/SignIn";
import CreateAccount from "./views/auth/CreateAccount";
import ForgotPassword from "./views/auth/ForgotPassword";
import WorkspaceSetup from "./views/auth/WorkspaceSetup";

import Dashboard from "./views/Dashboard";
import AIProcessing from "./views/AIProcessing";
import WebGIS from "./views/WebGIS";
import Validation from "./views/Validation";
import ParcelExplorer from "./views/ParcelExplorer";
import Analytics from "./views/Analytics";
import Exports from "./views/Exports";
import Profile from "./views/Profile";

import { CadastraProvider } from "./context/CadastraContext";
import { authService } from "./services/authService";
import { normalizePathToView, getViewPath, APP_VIEWS, AUTH_VIEWS } from "./utils/navigation";

type AuthState = "unauthenticated" | "workspace-setup" | "authenticated";

export default function App() {
  // Determine initial route on load / refresh
  const initialRouteRef = useRef(normalizePathToView(window.location.pathname, window.location.hash));
  const initialRoute = initialRouteRef.current;

  const [authState, setAuthState] = useState<AuthState>(() => {
    const session = authService.getCurrentSession();
    return session ? "authenticated" : "unauthenticated";
  });

  // For unauthenticated flow
  const [authView, setAuthView] = useState<View>(() => {
    if (initialRoute.isAuthView) return initialRoute.view;
    return "signin";
  });

  // Remember intended protected route if user hit e.g. /validation while unauthenticated
  const [intendedRoute, setIntendedRoute] = useState<View | null>(() => {
    if (!initialRoute.isAuthView && initialRoute.view !== "dashboard") {
      return initialRoute.view;
    }
    return null;
  });

  // For authenticated flow — preserves exact route on refresh!
  const [appView, setAppView] = useState<View>(() => {
    if (!initialRoute.isAuthView && APP_VIEWS.includes(initialRoute.view)) {
      return initialRoute.view;
    }
    return "dashboard";
  });

  const [user, setUser] = useState<User>(() => authService.getCurrentUser());
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastType[]>([]);

  // Internal history depth counter to prevent leaving CadastrixAI on Back
  const internalDepthRef = useRef<number>(0);

  // Initialize browser history state on mount
  useEffect(() => {
    const isAuth = authService.getCurrentSession() !== null;
    const currentActiveView = isAuth ? appView : authView;
    const currentPath = getViewPath(currentActiveView);

    // Ensure current URL matches active view without adding extraneous history entries
    if (window.location.pathname !== currentPath && window.location.pathname !== "/") {
      window.history.replaceState({ view: currentActiveView, cadastraInternal: true, depth: 0 }, "", currentPath);
    } else {
      window.history.replaceState({ view: currentActiveView, cadastraInternal: true, depth: 0 }, "", window.location.pathname || currentPath);
    }
  }, []);

  // Listen to Browser Back and Forward buttons (popstate)
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      const parsed = normalizePathToView(window.location.pathname, window.location.hash);
      const isAuth = authService.getCurrentSession() !== null;

      if (event.state && typeof event.state.depth === "number") {
        internalDepthRef.current = event.state.depth;
      } else {
        internalDepthRef.current = Math.max(0, internalDepthRef.current - 1);
      }

      if (isAuth) {
        if (APP_VIEWS.includes(parsed.view)) {
          setAppView(parsed.view);
        } else if (parsed.isAuthView) {
          setAppView("dashboard");
        }
      } else {
        if (AUTH_VIEWS.includes(parsed.view)) {
          setAuthView(parsed.view);
        } else {
          setAuthView("signin");
        }
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const addToast = useCallback((message: string, type: ToastType["type"] = "info") => {
    const id = `t-${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev, { id, type, message }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Universal Navigation Handler that pushes browser history
  const handleNavigate = useCallback((newView: View, replace = false) => {
    const isAuth = authService.getCurrentSession() !== null;
    const currentActiveView = isAuth ? appView : authView;

    if (newView === currentActiveView) return;

    const targetPath = getViewPath(newView);
    const nextDepth = replace ? internalDepthRef.current : internalDepthRef.current + 1;
    internalDepthRef.current = nextDepth;

    if (replace) {
      window.history.replaceState({ view: newView, cadastraInternal: true, depth: nextDepth }, "", targetPath);
    } else {
      window.history.pushState({ view: newView, cadastraInternal: true, depth: nextDepth }, "", targetPath);
    }

    if (isAuth) {
      if (APP_VIEWS.includes(newView)) {
        setAppView(newView);
      }
    } else {
      if (AUTH_VIEWS.includes(newView)) {
        setAuthView(newView);
      }
    }
  }, [appView, authView]);

  // Safe In-App Back Navigation Handler
  const handleAppBack = useCallback(() => {
    // If we have internal history within this CadastrixAI session, go back
    if (internalDepthRef.current > 0) {
      window.history.back();
    } else {
      // Safe fallback: navigate to dashboard without exiting CadastrixAI
      handleNavigate("dashboard");
    }
  }, [handleNavigate]);

  const handleSignIn = (email?: string, newUser?: User) => {
    const authenticatedUser = newUser || authService.getCurrentUser();
    setUser(authenticatedUser);
    setAuthState("authenticated");

    // If user originally tried to access a protected route (e.g. /validation), restore it!
    const targetView = intendedRoute && APP_VIEWS.includes(intendedRoute) ? intendedRoute : "dashboard";
    setIntendedRoute(null);
    setAppView(targetView);
    
    internalDepthRef.current = 0;
    window.history.replaceState({ view: targetView, cadastraInternal: true, depth: 0 }, "", getViewPath(targetView));
    addToast("Welcome back to CadastrixAI, " + authenticatedUser.name.split(" ")[0] + "!", "success");
  };

  const handleWorkspaceComplete = () => {
    setAuthState("authenticated");
    setAppView("dashboard");
    internalDepthRef.current = 0;
    window.history.replaceState({ view: "dashboard", cadastraInternal: true, depth: 0 }, "", "/dashboard");
    addToast("Workspace initialized. Welcome to CadastrixAI, " + user.name.split(" ")[0] + "!", "success");
  };

  const handleSignOut = () => {
    authService.logout();
    setAuthState("unauthenticated");
    setAuthView("signin");
    setProfileMenuOpen(false);
    internalDepthRef.current = 0;
    window.history.replaceState({ view: "signin", cadastraInternal: true, depth: 0 }, "", "/signin");
    addToast("Signed out successfully", "info");
  };

  const handleCreated = (newUser?: User) => {
    if (newUser) {
      setUser(newUser);
      setAuthState("authenticated");
      setAppView("dashboard");
      internalDepthRef.current = 0;
      window.history.replaceState({ view: "dashboard", cadastraInternal: true, depth: 0 }, "", "/dashboard");
      addToast("Account created! Welcome to CadastrixAI, " + newUser.name.split(" ")[0] + "!", "success");
    } else {
      setAuthView("workspace-setup");
      handleNavigate("workspace-setup");
    }
  };

  const handleUserUpdate = (updated: User) => {
    setUser(updated);
  };

  // Auth flow (Protected Route Guard)
  if (authState !== "authenticated") {
    return (
      <>
        {authView === "signin" && (
          <SignIn
            onNavigate={handleNavigate}
            onSignIn={(email, signedInUser) => handleSignIn(email, signedInUser)}
          />
        )}
        {authView === "signup" && (
          <CreateAccount onNavigate={handleNavigate} onCreated={handleCreated} />
        )}
        {authView === "forgot-password" && (
          <ForgotPassword onNavigate={handleNavigate} />
        )}
        {authView === "workspace-setup" && (
          <WorkspaceSetup onComplete={handleWorkspaceComplete} />
        )}
        <Toast toasts={toasts} onRemove={removeToast} />
      </>
    );
  }

  const isFixedViewportView = appView === "webgis" || appView === "ai-processing";

  // Main Authenticated GIS Command Center
  return (
    <CadastraProvider currentView={appView} onNavigate={handleNavigate} onToast={addToast}>
      <div className="h-full flex bg-[#080e1a] overflow-hidden">
        <Sidebar
          currentView={appView}
          onNavigate={handleNavigate}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(v => !v)}
          mobileOpen={mobileMenuOpen}
          onMobileClose={() => setMobileMenuOpen(false)}
        />

        <div className="flex-1 flex flex-col min-w-0 min-h-0 overflow-hidden">
          <Header
            user={user}
            onMobileMenuOpen={() => setMobileMenuOpen(true)}
            onNavigate={handleNavigate}
            onBack={handleAppBack}
            onSignOut={handleSignOut}
            profileOpen={profileMenuOpen}
            onToggleProfile={() => setProfileMenuOpen(v => !v)}
            currentView={appView}
          />

          <main
            className={`flex-1 min-h-0 relative ${
              isFixedViewportView ? "overflow-hidden flex flex-col" : "overflow-y-auto"
            } bg-[#080e1a]`}
            id="main-content"
          >
            {appView === "dashboard" && (
              <Dashboard onNavigate={handleNavigate} onToast={addToast} />
            )}
            {appView === "ai-processing" && (
              <AIProcessing onToast={addToast} />
            )}
            {appView === "webgis" && (
              <WebGIS onToast={addToast} onNavigate={() => handleNavigate("validation")} />
            )}
            {appView === "validation" && (
              <Validation onToast={addToast} />
            )}
            {appView === "parcel-explorer" && (
              <ParcelExplorer onToast={addToast} />
            )}
            {appView === "analytics" && (
              <Analytics onToast={addToast} />
            )}
            {appView === "exports" && (
              <Exports onToast={addToast} />
            )}
            {appView === "profile" && (
              <Profile
                user={user}
                onUserUpdate={handleUserUpdate}
                onToast={addToast}
                onSignOut={handleSignOut}
              />
            )}
          </main>
        </div>

        <Toast toasts={toasts} onRemove={removeToast} />
      </div>
    </CadastraProvider>
  );
}
