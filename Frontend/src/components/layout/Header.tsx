import { Menu, Bell, Search, ChevronDown, CheckCircle2, AlertTriangle, Activity, Check, Shield, ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import type { User, View } from "../../types";
import GlobalSearchModal from "../common/GlobalSearchModal";
import { getStoredNotifications, markNotificationAsRead, markAllNotificationsAsRead, type StoredNotification } from "../../utils/storage";

interface HeaderProps {
  user: User;
  onMobileMenuOpen: () => void;
  onNavigate: (view: View) => void;
  onBack?: () => void;
  onSignOut: () => void;
  profileOpen: boolean;
  onToggleProfile: () => void;
  currentView: View;
}

const VIEW_TITLES: Record<string, string> = {
  dashboard: "Projects Dashboard",
  "ai-processing": "AI Processing & Inference",
  webgis: "WebGIS Command Center",
  validation: "Validation & Reconciliation",
  "parcel-explorer": "Parcel Explorer & Land Registry",
  analytics: "GIS & AI Operational Analytics",
  exports: "Spatial Data Export Center",
  profile: "Profile & Settings",
};

export default function Header({
  user, onMobileMenuOpen, onNavigate, onBack, onSignOut,
  profileOpen, onToggleProfile, currentView,
}: HeaderProps) {
  const initials = user.name.split(" ").map(n => n[0]).join("").slice(0, 2);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [notifications, setNotifications] = useState<StoredNotification[]>(getStoredNotifications());

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchModalOpen(prev => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleNotificationClick = (n: StoredNotification) => {
    const updated = markNotificationAsRead(n.id);
    setNotifications(updated);
    setNotificationsOpen(false);
    if (n.targetView) {
      onNavigate(n.targetView as View);
    }
  };

  const handleMarkAllRead = () => {
    const updated = markAllNotificationsAsRead();
    setNotifications(updated);
  };

  return (
    <header className="h-14 bg-[#080e1a] border-b border-[rgba(30,60,100,0.5)] flex items-center px-4 gap-3 flex-shrink-0 z-20">
      {/* Mobile menu button */}
      <button
        onClick={onMobileMenuOpen}
        className="md:hidden p-2 rounded text-[#7a9cc0] hover:text-[#e2eaf4] hover:bg-[rgba(30,60,100,0.3)]"
        aria-label="Open navigation menu"
      >
        <Menu size={18} />
      </button>

      {/* App Back Button when not on Dashboard */}
      {currentView !== "dashboard" && onBack && (
        <button
          onClick={onBack}
          className="p-1.5 rounded-lg text-[#7a9cc0] hover:text-[#00d4ff] hover:bg-[rgba(30,60,100,0.3)] transition-colors flex items-center justify-center flex-shrink-0"
          title="Back to previous page"
          aria-label="Back to previous page"
        >
          <ArrowLeft size={16} />
        </button>
      )}

      {/* View Title & Workspace */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h1 className="text-sm font-semibold text-[#e2eaf4] truncate">
            {VIEW_TITLES[currentView] || "CadastrixAI"}
          </h1>
          <span className="hidden sm:inline-flex px-2 py-0.5 rounded text-[10px] font-mono bg-[rgba(0,212,255,0.1)] text-[#00d4ff] border border-[rgba(0,212,255,0.25)]">
            {user.role}
          </span>
        </div>
        <div className="text-[10px] text-[#4a6a8a] font-mono hidden sm:block truncate">{user.workspace}</div>
      </div>

      {/* Global Search Button / Trigger */}
      <button
        onClick={() => setSearchModalOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0d1526] border border-[rgba(30,60,100,0.6)] hover:border-[rgba(0,212,255,0.4)] text-xs text-[#7a9cc0] hover:text-[#e2eaf4] transition-all max-w-xs w-full sm:w-64"
        title="Global Spatial Search (Ctrl+K)"
        aria-label="Search CadastrixAI"
      >
        <Search size={14} className="text-[#00d4ff] flex-shrink-0" />
        <span className="truncate flex-1 text-left">Search parcels, survey #…</span>
        <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[9px] font-mono text-[#4a6a8a] bg-[rgba(30,60,100,0.3)] border border-[rgba(30,60,100,0.4)] rounded">
          Ctrl+K
        </kbd>
      </button>

      {/* Right actions */}
      <div className="flex items-center gap-2">
        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(v => !v)}
            className="relative p-2 rounded-lg text-[#4a6a8a] hover:text-[#7a9cc0] hover:bg-[rgba(30,60,100,0.3)] transition-colors"
            aria-label={`${unreadCount} notifications`}
            aria-expanded={notificationsOpen}
          >
            <Bell size={16} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#00d4ff] animate-pulse" />
            )}
          </button>

          {notificationsOpen && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setNotificationsOpen(false)} />
              <div className="absolute right-0 top-full mt-2 w-80 bg-[#0d1526] border border-[rgba(30,60,100,0.6)] rounded-xl shadow-2xl z-40 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                <div className="px-4 py-3 border-b border-[rgba(30,60,100,0.4)] flex justify-between items-center bg-[#0a1120]">
                  <span className="text-xs font-semibold text-[#e2eaf4]">Notifications</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-[#00d4ff] font-mono">{unreadCount} unread</span>
                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkAllRead}
                        className="text-[10px] text-[#7a9cc0] hover:text-[#00d4ff] underline font-mono"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>
                </div>

                <div className="divide-y divide-[rgba(30,60,100,0.25)] max-h-72 overflow-y-auto">
                  {notifications.map(n => (
                    <button
                      key={n.id}
                      onClick={() => handleNotificationClick(n)}
                      className={`w-full p-3.5 text-left flex items-start gap-3 hover:bg-[rgba(30,60,100,0.2)] transition-colors ${
                        !n.read ? "bg-[rgba(0,212,255,0.04)]" : ""
                      }`}
                    >
                      <div className="mt-0.5">
                        {n.type === "success" && <CheckCircle2 size={14} className="text-[#10b981]" />}
                        {n.type === "warning" && <AlertTriangle size={14} className="text-[#f59e0b]" />}
                        {n.type === "info" && <Activity size={14} className="text-[#00d4ff]" />}
                        {n.type === "error" && <AlertTriangle size={14} className="text-[#ef4444]" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-[#e2eaf4] flex items-center justify-between">
                          <span className="truncate">{n.title}</span>
                          <span className="text-[10px] text-[#4a6a8a] font-mono flex-shrink-0 ml-2">{n.time}</span>
                        </div>
                        <div className="text-[11px] text-[#7a9cc0] mt-0.5 leading-snug line-clamp-2">{n.message}</div>
                      </div>
                    </button>
                  ))}
                  {notifications.length === 0 && (
                    <div className="p-4 text-center text-xs text-[#4a6a8a]">
                      No notifications at this time
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* User profile dropdown trigger */}
        <div className="relative">
          <button
            onClick={onToggleProfile}
            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-[rgba(30,60,100,0.3)] transition-colors"
            aria-label="User account menu"
            aria-expanded={profileOpen}
          >
            <div className="w-7 h-7 rounded-full bg-[rgba(0,212,255,0.15)] border border-[rgba(0,212,255,0.3)] flex items-center justify-center text-xs font-mono font-bold text-[#00d4ff] overflow-hidden">
              {user.avatar ? (
                <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                initials
              )}
            </div>
            <ChevronDown size={14} className="text-[#4a6a8a] hidden sm:block" />
          </button>

          {profileOpen && (
            <>
              <div className="fixed inset-0 z-30" onClick={onToggleProfile} />
              <div className="absolute right-0 top-full mt-2 w-56 bg-[#0d1526] border border-[rgba(30,60,100,0.6)] rounded-xl shadow-2xl z-40 overflow-hidden py-1 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3.5 py-2.5 border-b border-[rgba(30,60,100,0.4)]">
                  <div className="text-xs font-semibold text-[#e2eaf4] truncate">{user.name}</div>
                  <div className="text-[10px] text-[#7a9cc0] font-mono truncate">{user.email}</div>
                  <div className="text-[10px] text-[#00d4ff] font-mono mt-0.5">{user.role}</div>
                </div>

                <button
                  onClick={() => { onNavigate("profile"); onToggleProfile(); }}
                  className="w-full px-3.5 py-2 text-left text-xs text-[#bac9cc] hover:bg-[rgba(30,60,100,0.3)] hover:text-[#e2eaf4] flex items-center justify-between"
                >
                  <span>Profile & Settings</span>
                </button>

                <div className="border-t border-[rgba(30,60,100,0.4)] my-1" />

                <button
                  onClick={() => { onToggleProfile(); onSignOut(); }}
                  className="w-full px-3.5 py-2 text-left text-xs text-[#ef4444] hover:bg-[rgba(239,68,68,0.1)] flex items-center justify-between"
                >
                  <span>Sign out</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <GlobalSearchModal
        open={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        onNavigate={onNavigate}
      />
    </header>
  );
}
