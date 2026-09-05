import { useRef, useState, useEffect } from "react";
import {
  User, Lock, Bell, Shield, Monitor, Key, LogOut,
  CheckCircle2, Edit2, Camera, ChevronRight, Smartphone,
  Globe, Clock, Mail, Building2, Briefcase, UserCheck, AlertTriangle,
  Trash2, Search, X, Users, Check
} from "lucide-react";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Badge from "../components/ui/Badge";
import Modal from "../components/ui/Modal";
import { SESSIONS } from "../data/mockData";
import type { User as UserType, UserRole } from "../types";
import { userService } from "../services/userService";
import { authService } from "../services/authService";
import { verifyAccountCredentials, type StoredAccount } from "../utils/storage";
import { validatePassword } from "../utils/validators";

interface ProfileProps {
  user: UserType;
  onUserUpdate: (u: UserType) => void;
  onToast: (msg: string, type?: "success" | "error" | "info" | "warning") => void;
  onSignOut: () => void;
}

type Section = "personal" | "security" | "notifications" | "sessions" | "admin";

const ROLES: { role: UserRole; desc: string }[] = [
  { role: "GIS Analyst", desc: "Boundary extraction, WebGIS spatial analysis & QA" },
  { role: "Surveyor", desc: "Field survey, parcel reconciliation & topology repair" },
  { role: "Administrator", desc: "Full administrative controls, batch approvals & user management" },
  { role: "Project Manager", desc: "Dashboard oversight, progress tracking & analytics reports" },
  { role: "Data Engineer", desc: "GeoTIFF raster processing, CRS transforms & vector ETL" },
  { role: "Viewer", desc: "Read-only cadastral exploration and registry inspection" },
];

export default function Profile({ user, onUserUpdate, onToast, onSignOut }: ProfileProps) {
  const [section, setSection] = useState<Section>("personal");
  const [form, setForm] = useState({
    name: user.name,
    jobTitle: user.jobTitle,
    org: user.organization,
    role: user.role,
    workspace: user.workspace,
    timezone: user.timezone || "Asia/Kolkata",
    language: user.language || "English",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [twoFA, setTwoFA] = useState(user.twoFactorEnabled);
  const [notifs, setNotifs] = useState(user.notificationPrefs);
  const [signOutModal, setSignOutModal] = useState(false);
  const [pwModal, setPwModal] = useState(false);
  const [revokeAllModal, setRevokeAllModal] = useState(false);

  // Admin User Management State
  const [accounts, setAccounts] = useState<StoredAccount[]>([]);
  const [adminSearch, setAdminSearch] = useState("");
  const [selectedUserAction, setSelectedUserAction] = useState<{ id: string; name: string; action: "enable" | "disable" } | null>(null);

  const photoRef = useRef<HTMLInputElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  const [passwords, setPasswords] = useState({ current: "", next: "", confirm: "" });
  const [pwError, setPwError] = useState("");
  const [sessions, setSessions] = useState(SESSIONS);

  useEffect(() => {
    if (user.role === "Administrator") {
      setAccounts(userService.getAllUsers());
    }
  }, [user.role]);

  const newPwCheck = validatePassword(passwords.next);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
  setForm(v => ({ ...v, [k]: e.target.value }));
  };

  const setSelect = (k: keyof typeof form) => (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setForm(v => ({ ...v, [k]: e.target.value }));
  };

  const handleStartEdit = () => {
    setSection("personal");
    setIsEditing(true);
    setTimeout(() => {
      nameInputRef.current?.focus();
    }, 50);
  };

  const savePersonal = async () => {
    if (!form.name.trim()) {
      onToast("Full name cannot be blank", "error");
      return;
    }

    setSaving(true);
    const updated: UserType = {
      ...user,
      name: form.name.trim(),
      jobTitle: form.jobTitle.trim(),
      organization: form.org.trim(),
      role: user.role === "Administrator" ? form.role : user.role, // Non-admins cannot alter their role
      workspace: form.workspace.trim(),
      timezone: form.timezone,
      language: form.language,
    };

    await userService.updateProfile(updated);
    onUserUpdate(updated);
    setIsEditing(false);
    setSaving(false);
    onToast("Profile updated and persisted successfully", "success");
  };

  const handleCancelEdit = () => {
    setForm({
      name: user.name,
      jobTitle: user.jobTitle,
      org: user.organization,
      role: user.role,
      workspace: user.workspace,
      timezone: user.timezone || "Asia/Kolkata",
      language: user.language || "English",
    });
    setIsEditing(false);
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const avatarUrl = await userService.uploadAvatar(user.id, file);
      const updated = { ...user, avatar: avatarUrl };
      await userService.updateProfile(updated);
      onUserUpdate(updated);
      onToast("Profile photo updated successfully", "success");
    } catch (err: any) {
      onToast(err.message || "Failed to upload profile photo", "error");
    }
  };

  const handleRemovePhoto = async () => {
    await userService.removeAvatar(user.id);
    const updated = { ...user, avatar: undefined };
    await userService.updateProfile(updated);
    onUserUpdate(updated);
    onToast("Profile photo removed", "info");
  };

  const saveNotifs = async () => {
    setSaving(true);
    const updated: UserType = { ...user, notificationPrefs: notifs };
    await userService.updateProfile(updated);
    onUserUpdate(updated);
    setSaving(false);
    onToast("Notification preferences saved", "success");
  };

  const handleUpdatePassword = async () => {
    setPwError("");
    if (!passwords.current) {
      setPwError("Current password is required");
      return;
    }

    // Verify current password against hashed credentials
    const credCheck = await verifyAccountCredentials(user.email, passwords.current);
    if (!credCheck.success) {
      setPwError("Incorrect current password");
      return;
    }

    if (passwords.current === passwords.next) {
      setPwError("New password must not be identical to current password");
      return;
    }

    if (!newPwCheck.isValid) {
      setPwError(newPwCheck.errors[0] || "New password does not meet security requirements");
      return;
    }

    if (passwords.next !== passwords.confirm) {
      setPwError("New passwords do not match");
      return;
    }

    const updated = await authService.updatePassword(user.email, passwords.next);
    if (updated) {
      setPwModal(false);
      setPasswords({ current: "", next: "", confirm: "" });
      onToast("Password successfully changed", "success");
    } else {
      setPwError("Failed to update password");
    }
  };

  const handleRoleChangeForUser = async (userId: string, newRole: UserRole) => {
    const updated = await userService.updateUserRole(userId, newRole);
    setAccounts(updated);
    const acc = updated.find(a => a.id === userId);
    onToast(`Role updated to ${newRole} for ${acc?.name || "user"}`, "success");
  };

  const handleConfirmToggleStatus = async () => {
    if (!selectedUserAction) return;
    const updated = await userService.toggleUserStatus(selectedUserAction.id);
    setAccounts(updated);
    const action = selectedUserAction.action;
    setSelectedUserAction(null);
    onToast(`Account ${action === "disable" ? "disabled" : "enabled"} successfully`, "info");
  };

  const revokeSession = (id: string) => {
    setSessions(prev => prev.filter(s => s.id !== id));
    onToast("Session revoked", "info");
  };

  const revokeAllOtherSessions = () => {
    setSessions(prev => prev.filter(s => s.current));
    setRevokeAllModal(false);
    onToast("All other active sessions revoked", "success");
  };

  const initials = user.name.split(" ").map(n => n[0]).join("").slice(0, 2);

  const navItems: { key: Section; label: string; icon: typeof User }[] = [
    { key: "personal", label: "Personal Details", icon: User },
    { key: "security", label: "Account Security & Password", icon: Lock },
    { key: "notifications", label: "Notification Preferences", icon: Bell },
    { key: "sessions", label: "Active Sessions & Devices", icon: Monitor },
  ];

  if (user.role === "Administrator") {
    navItems.push({ key: "admin", label: "User & Role Management", icon: Users });
  }

  const filteredAccounts = accounts.filter(
    a =>
      a.name.toLowerCase().includes(adminSearch.toLowerCase()) ||
      a.email.toLowerCase().includes(adminSearch.toLowerCase()) ||
      a.role.toLowerCase().includes(adminSearch.toLowerCase())
  );

  return (
    <div className="h-full overflow-y-auto p-4 lg:p-6 bg-[#080e1a]">
      <div className="max-w-4xl mx-auto flex flex-col gap-6">

        {/* Profile header banner */}
        <div className="bg-[#0d1526] border border-[rgba(30,60,100,0.5)] rounded-xl p-6 flex items-start gap-5 shadow-lg">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-[rgba(0,212,255,0.15)] border-2 border-[rgba(0,212,255,0.3)] flex items-center justify-center text-xl font-mono font-medium text-[#00d4ff] overflow-hidden">
              {user.avatar ? (
                <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                initials
              )}
            </div>

            <button
              onClick={() => photoRef.current?.click()}
              className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#0d1526] border border-[rgba(30,60,100,0.6)] flex items-center justify-center text-[#4a6a8a] hover:text-[#00d4ff] transition-colors"
              title="Upload profile photo (<2MB)"
              aria-label="Upload profile photo"
            >
              <Camera size={11} />
            </button>

            <input
              ref={el => { photoRef.current = el; }}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handlePhotoUpload}
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="text-lg font-semibold text-[#e2eaf4] flex items-center gap-2">
              {user.name}
              <span className="text-xs px-2 py-0.5 rounded-full bg-[rgba(0,212,255,0.1)] text-[#00d4ff] font-mono border border-[rgba(0,212,255,0.25)]">
                {user.role}
              </span>
            </div>
            <div className="text-sm text-[#7a9cc0]">{user.jobTitle}</div>
            <div className="text-xs text-[#4a6a8a] font-mono mt-0.5">{user.email}</div>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="cyan">{user.organization}</Badge>
              <Badge variant="muted" dot>{user.workspace}</Badge>
              {user.avatar && (
                <button
                  onClick={handleRemovePhoto}
                  className="text-[10px] text-[#ef4444] hover:underline flex items-center gap-1 ml-2"
                  aria-label="Remove profile photo"
                >
                  <Trash2 size={10} /> Remove Photo
                </button>
              )}
            </div>
          </div>

          <Button
            variant={isEditing ? "primary" : "ghost"}
            size="sm"
            icon={<Edit2 size={12} />}
            onClick={() => {
              if (isEditing) {
                savePersonal();
              } else {
                handleStartEdit();
              }
            }}
          >
            {isEditing ? "Save Changes" : "Edit Profile"}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          {/* Sidebar Navigation */}
          <div className="flex flex-col gap-1">
            {navItems.map(item => (
              <button
                key={item.key}
                onClick={() => setSection(item.key)}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-left transition-colors ${
                  section === item.key
                    ? "bg-[rgba(0,212,255,0.1)] text-[#00d4ff] border border-[rgba(0,212,255,0.2)]"
                    : "text-[#7a9cc0] hover:bg-[rgba(30,60,100,0.3)] hover:text-[#e2eaf4]"
                }`}
              >
                <item.icon size={14} className="flex-shrink-0" />
                {item.label}
                <ChevronRight size={12} className="ml-auto text-[#4a6a8a]" />
              </button>
            ))}
            <div className="mt-3 pt-3 border-t border-[rgba(30,60,100,0.4)]">
              <button
                onClick={() => setSignOutModal(true)}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-[#ef4444] hover:bg-[rgba(239,68,68,0.08)] w-full text-left"
              >
                <LogOut size={14} /> Sign out
              </button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="md:col-span-3 bg-[#0d1526] border border-[rgba(30,60,100,0.5)] rounded-xl overflow-hidden shadow-lg">

            {/* Section 1: Personal Details */}
            {section === "personal" && (
              <div className="p-6 flex flex-col gap-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-[#e2eaf4]">Personal Profile Details</h2>
                  {isEditing ? (
                    <span className="text-xs text-[#00d4ff] font-mono flex items-center gap-1">
                      <Edit2 size={12} /> Editing Mode Active
                    </span>
                  ) : (
                    <span className="text-xs text-[#4a6a8a] font-mono">
                      Click &quot;Edit Profile&quot; to modify fields
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    ref={nameInputRef}
                    label="Full Name"
                    value={form.name}
                    onChange={set("name")}
                    prefix={<User size={13} />}
                  />
                  <Input
                    label="Job Title"
                    value={form.jobTitle}
                    onChange={set("jobTitle")}
                    prefix={<Briefcase size={13} />}
                  />

                  {/* Role Selector with RBAC Protection */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-[#7a9cc0] uppercase tracking-wider flex items-center justify-between">
                      <span>Assigned Role</span>
                      <UserCheck size={12} className="text-[#00d4ff]" />
                    </label>
                    <select
                      value={form.role}
                      disabled={user.role !== "Administrator"}
                      onChange={e => setForm(v => ({ ...v, role: e.target.value as UserRole }))}
                      className={`w-full bg-[#0d1526] border border-[rgba(30,60,100,0.6)] text-[#e2eaf4] text-xs rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#00d4ff] ${
                        user.role !== "Administrator" ? "opacity-75 cursor-not-allowed" : ""
                      }`}
                    >
                      {ROLES.map(r => (
                        <option key={r.role} value={r.role}>
                          {r.role} — {r.desc}
                        </option>
                      ))}
                    </select>
                    {user.role !== "Administrator" && (
                      <span className="text-[10px] text-[#4a6a8a]">
                        Role changes require Administrator permissions
                      </span>
                    )}
                  </div>

                  <Input
                    label="Work Email"
                    value={user.email}
                    disabled
                    prefix={<Mail size={13} />}
                    hint="Email is permanently bound to account"
                  />
                  <Input
                    label="Organisation"
                    value={form.org}
                    onChange={set("org")}
                    prefix={<Building2 size={13} />}
                  />
                  <Input
                    label="Active Workspace"
                    value={form.workspace}
                    onChange={set("workspace")}
                    prefix={<Globe size={13} />}
                  />

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-[#7a9cc0] uppercase tracking-wider">Timezone</label>
                    <select
                      value={form.timezone}
                      onChange={setSelect("timezone")}
                      className="w-full bg-[#0d1526] border border-[rgba(30,60,100,0.6)] text-[#e2eaf4] text-xs rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#00d4ff]"
                    >
                      {["Asia/Kolkata", "Asia/Dubai", "UTC", "Europe/London", "America/New_York"].map(tz => (
                        <option key={tz} value={tz}>{tz}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-[#7a9cc0] uppercase tracking-wider">Language</label>
                    <select
                      value={form.language}
                      onChange={setSelect("language")}
                      className="w-full bg-[#0d1526] border border-[rgba(30,60,100,0.6)] text-[#e2eaf4] text-xs rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#00d4ff]"
                    >
                      {["English", "Tamil", "Hindi", "Telugu", "Kannada"].map(l => (
                        <option key={l} value={l}>{l}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-[rgba(30,60,100,0.3)]">
                  {isEditing && (
                    <Button variant="outline" size="md" onClick={handleCancelEdit}>
                      Cancel
                    </Button>
                  )}
                  <Button variant="primary" size="md" loading={saving} onClick={savePersonal}>
                    Save Profile Changes
                  </Button>
                </div>
              </div>
            )}

            {/* Section 2: Security & Password */}
            {section === "security" && (
              <div className="p-6 flex flex-col gap-5">
                <h2 className="text-sm font-semibold text-[#e2eaf4]">Account Security & Password</h2>

                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-[rgba(30,60,100,0.15)] border border-[rgba(30,60,100,0.4)]">
                    <div className="flex items-start gap-3">
                      <Lock size={16} className="text-[#7a9cc0] mt-0.5" />
                      <div>
                        <div className="text-sm font-medium text-[#e2eaf4]">Account Password</div>
                        <div className="text-xs text-[#4a6a8a]">
                          Protected via client-side salted SHA-256 cryptographic hashing
                        </div>
                      </div>
                    </div>
                    <Button variant="secondary" size="sm" onClick={() => setPwModal(true)}>
                      Change Password
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl bg-[rgba(30,60,100,0.15)] border border-[rgba(30,60,100,0.4)]">
                    <div className="flex items-start gap-3">
                      <Smartphone size={16} style={{ color: twoFA ? "#10b981" : "#7a9cc0" }} />
                      <div>
                        <div className="text-sm font-medium text-[#e2eaf4]">Two-Factor Authentication (2FA)</div>
                        <div className="text-xs text-[#4a6a8a]">{twoFA ? "Active via TOTP Authenticator" : "Disabled"}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        const next = !twoFA;
                        setTwoFA(next);
                        const updated = { ...user, twoFactorEnabled: next };
                        userService.updateProfile(updated);
                        onUserUpdate(updated);
                        onToast(next ? "2FA enabled" : "2FA disabled", next ? "success" : "info");
                      }}
                      className={`relative w-10 h-5 rounded-full transition-colors ${twoFA ? "bg-[#10b981]" : "bg-[rgba(30,60,100,0.5)]"}`}
                      aria-label="Toggle Two Factor Authentication"
                    >
                      <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${twoFA ? "translate-x-5" : "translate-x-0.5"}`} />
                    </button>
                  </div>

                  <div className="p-4 rounded-xl bg-[rgba(30,60,100,0.15)] border border-[rgba(30,60,100,0.4)]">
                    <div className="flex items-start gap-3 mb-3">
                      <Clock size={16} className="text-[#7a9cc0] mt-0.5" />
                      <div className="text-sm font-medium text-[#e2eaf4]">Recent Authentications</div>
                    </div>
                    <div className="flex flex-col gap-2">
                      {[
                        { device: "Chrome · Chennai", time: "Today, 09:14 AM", success: true },
                        { device: "Safari · Chennai", time: "Yesterday, 17:32", success: true },
                        { device: "Firefox · Coimbatore", time: "3 days ago", success: false },
                      ].map((entry, i) => (
                        <div key={i} className="flex items-center justify-between text-xs font-mono">
                          <span className="text-[#7a9cc0]">{entry.device}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-[#4a6a8a]">{entry.time}</span>
                            {entry.success ? <CheckCircle2 size={11} className="text-[#10b981]" /> : <Shield size={11} className="text-[#f59e0b]" />}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Section 3: Notification Preferences */}
            {section === "notifications" && (
              <div className="p-6 flex flex-col gap-5">
                <h2 className="text-sm font-semibold text-[#e2eaf4]">Notification Preferences</h2>
                <div className="flex flex-col gap-3">
                  {[
                    { key: "projectProcessing" as const, label: "AI Pipeline Status", desc: "Inference start, completion, and stage changes" },
                    { key: "validationFailures" as const, label: "Validation Alerts", desc: "Topological error detection and parcel review flags" },
                    { key: "exports" as const, label: "Data Export Ready", desc: "When GeoJSON/PDF exports are ready for download" },
                    { key: "teamMentions" as const, label: "Surveyor Notes & Mentions", desc: "When team members update parcel notes" },
                    { key: "systemAlerts" as const, label: "System Maintenance & Security", desc: "Critical security and platform updates" },
                  ].map(item => (
                    <div key={item.key} className="flex items-center justify-between p-4 rounded-xl bg-[rgba(30,60,100,0.15)] border border-[rgba(30,60,100,0.4)]">
                      <div>
                        <div className="text-sm font-medium text-[#e2eaf4]">{item.label}</div>
                        <div className="text-xs text-[#4a6a8a]">{item.desc}</div>
                      </div>
                      <button
                        onClick={() => setNotifs(v => ({ ...v, [item.key]: !v[item.key] }))}
                        className={`relative w-10 h-5 rounded-full transition-colors ${notifs[item.key] ? "bg-[#00d4ff]" : "bg-[rgba(30,60,100,0.5)]"}`}
                        aria-label={`Toggle ${item.label}`}
                      >
                        <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${notifs[item.key] ? "translate-x-5" : "translate-x-0.5"}`} />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex justify-end">
                  <Button variant="primary" size="md" loading={saving} onClick={saveNotifs}>
                    Save Preferences
                  </Button>
                </div>
              </div>
            )}

            {/* Section 4: Sessions */}
            {section === "sessions" && (
              <div className="p-6 flex flex-col gap-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-[#e2eaf4]">Active Sessions & Devices</h2>
                  <Button variant="danger" size="sm" onClick={() => setRevokeAllModal(true)}>
                    Revoke Other Sessions
                  </Button>
                </div>

                <div className="flex flex-col gap-3">
                  {sessions.map(s => (
                    <div key={s.id} className="flex items-center justify-between p-4 rounded-xl bg-[rgba(30,60,100,0.15)] border border-[rgba(30,60,100,0.4)]">
                      <div className="flex items-start gap-3">
                        <Monitor size={15} className="text-[#7a9cc0] mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="text-sm font-medium text-[#e2eaf4] flex items-center gap-2">
                            {s.device}
                            {s.current && <Badge variant="cyan">Current</Badge>}
                          </div>
                          <div className="text-xs text-[#4a6a8a] font-mono">{s.location} · {s.lastActive}</div>
                        </div>
                      </div>
                      {!s.current && (
                        <Button variant="danger" size="sm" onClick={() => revokeSession(s.id)}>
                          Revoke
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Section 5: Admin User & Role Management */}
            {section === "admin" && user.role === "Administrator" && (
              <div className="p-6 flex flex-col gap-5">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div>
                    <h2 className="text-sm font-semibold text-[#e2eaf4]">User & Role Administration</h2>
                    <p className="text-xs text-[#7a9cc0]">Manage institutional team roles and access permissions (Local Dev Store)</p>
                  </div>
                  <div className="relative w-64">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4a6a8a]" />
                    <input
                      value={adminSearch}
                      onChange={e => setAdminSearch(e.target.value)}
                      placeholder="Search users or roles…"
                      className="w-full bg-[#080e1a] border border-[rgba(30,60,100,0.5)] text-[#e2eaf4] placeholder-[#4a6a8a] text-xs rounded-lg pl-8 pr-3 py-1.5 focus:outline-none focus:border-[#00d4ff]"
                    />
                  </div>
                </div>

                <div className="border border-[rgba(30,60,100,0.4)] rounded-xl overflow-hidden">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-[#0a1120] border-b border-[rgba(30,60,100,0.4)]">
                        <th className="px-3.5 py-2.5 text-left text-[10px] text-[#4a6a8a] uppercase font-mono">User</th>
                        <th className="px-3.5 py-2.5 text-left text-[10px] text-[#4a6a8a] uppercase font-mono">Role</th>
                        <th className="px-3.5 py-2.5 text-left text-[10px] text-[#4a6a8a] uppercase font-mono">Status</th>
                        <th className="px-3.5 py-2.5 text-left text-[10px] text-[#4a6a8a] uppercase font-mono">Last Login</th>
                        <th className="px-3.5 py-2.5 text-right text-[10px] text-[#4a6a8a] uppercase font-mono">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[rgba(30,60,100,0.25)]">
                      {filteredAccounts.map(acc => (
                        <tr key={acc.id} className="hover:bg-[rgba(30,60,100,0.15)]">
                          <td className="px-3.5 py-3">
                            <div className="font-semibold text-[#e2eaf4]">{acc.name}</div>
                            <div className="text-[10px] text-[#7a9cc0] font-mono">{acc.email}</div>
                          </td>
                          <td className="px-3.5 py-3">
                            <select
                              value={acc.role}
                              onChange={e => handleRoleChangeForUser(acc.id, e.target.value as UserRole)}
                              className="bg-[#080e1a] border border-[rgba(30,60,100,0.5)] text-[#00d4ff] text-[11px] font-mono rounded px-2 py-1 focus:outline-none"
                            >
                              {ROLES.map(r => (
                                <option key={r.role} value={r.role}>{r.role}</option>
                              ))}
                            </select>
                          </td>
                          <td className="px-3.5 py-3">
                            <Badge variant={acc.status === "active" ? "green" : "red"} dot>
                              {acc.status}
                            </Badge>
                          </td>
                          <td className="px-3.5 py-3 font-mono text-[11px] text-[#7a9cc0]">
                            {acc.lastLogin || "Recent"}
                          </td>
                          <td className="px-3.5 py-3 text-right">
                            {acc.id !== user.id && (
                              <button
                                onClick={() => setSelectedUserAction({
                                  id: acc.id,
                                  name: acc.name,
                                  action: acc.status === "active" ? "disable" : "enable"
                                })}
                                className={`text-[10px] font-mono px-2 py-1 rounded border transition-colors ${
                                  acc.status === "active"
                                    ? "text-[#ef4444] border-[rgba(239,68,68,0.3)] hover:bg-[rgba(239,68,68,0.1)]"
                                    : "text-[#10b981] border-[rgba(16,185,129,0.3)] hover:bg-[rgba(16,185,129,0.1)]"
                                }`}
                              >
                                {acc.status === "active" ? "Disable" : "Enable"}
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Admin Toggle Account Status Confirmation Modal */}
      <Modal
        open={Boolean(selectedUserAction)}
        onClose={() => setSelectedUserAction(null)}
        title={`${selectedUserAction?.action === "disable" ? "Disable" : "Enable"} Account Confirmation`}
      >
        {selectedUserAction && (
          <div className="flex flex-col gap-4">
            <p className="text-xs text-[#7a9cc0] leading-relaxed">
              Are you sure you want to <strong>{selectedUserAction.action}</strong> the account for{" "}
              <strong className="text-[#e2eaf4]">{selectedUserAction.name}</strong>?
            </p>
            <div className="flex gap-3">
              <Button variant="outline" size="md" className="flex-1" onClick={() => setSelectedUserAction(null)}>
                Cancel
              </Button>
              <Button
                variant={selectedUserAction.action === "disable" ? "danger" : "primary"}
                size="md"
                className="flex-1"
                onClick={handleConfirmToggleStatus}
              >
                Confirm {selectedUserAction.action === "disable" ? "Disable" : "Enable"}
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Sign Out Modal */}
      <Modal open={signOutModal} onClose={() => setSignOutModal(false)} title="Sign out confirmation">
        <div className="flex flex-col gap-4">
          <p className="text-sm text-[#7a9cc0]">Are you sure you want to sign out of CadastrixAI GIS Command Center?</p>
          <div className="flex gap-3">
            <Button variant="outline" size="md" className="flex-1" onClick={() => setSignOutModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" size="md" className="flex-1" icon={<LogOut size={13} />} onClick={() => { setSignOutModal(false); onSignOut(); }}>
              Sign out
            </Button>
          </div>
        </div>
      </Modal>

      {/* Revoke All Sessions Modal */}
      <Modal open={revokeAllModal} onClose={() => setRevokeAllModal(false)} title="Revoke All Other Sessions">
        <div className="flex flex-col gap-4">
          <p className="text-sm text-[#7a9cc0]">
            This will immediately sign out all other devices and active browser sessions.
          </p>
          <div className="flex gap-3">
            <Button variant="outline" size="md" className="flex-1" onClick={() => setRevokeAllModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" size="md" className="flex-1" onClick={revokeAllOtherSessions}>
              Revoke Sessions
            </Button>
          </div>
        </div>
      </Modal>

      {/* Change Password Modal */}
      <Modal open={pwModal} onClose={() => setPwModal(false)} title="Change Account Password">
        <div className="flex flex-col gap-4">
          {pwError && (
            <div className="px-3 py-2 rounded-lg bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.3)] text-xs text-[#ffb4ab] flex items-center gap-2">
              <AlertTriangle size={13} className="text-[#ef4444]" />
              <span>{pwError}</span>
            </div>
          )}

          <Input
            label="Current Password"
            type="password"
            value={passwords.current}
            onChange={e => {
              setPasswords(v => ({ ...v, current: e.target.value }));
              setPwError("");
            }}
            placeholder="••••••••"
          />

          <div>
            <Input
              label="New Password"
              type="password"
              value={passwords.next}
              onChange={e => {
                setPasswords(v => ({ ...v, next: e.target.value }));
                setPwError("");
              }}
              placeholder="Min 8 chars, 1 uppercase, 1 number"
            />
            {passwords.next && (
              <div className="mt-1.5 flex items-center gap-2">
                <div className="flex gap-1 flex-1">
                  {[0, 1, 2, 3].map(i => (
                    <div
                      key={i}
                      className="h-1 flex-1 rounded-full transition-colors duration-300"
                      style={{ backgroundColor: i < newPwCheck.score ? newPwCheck.color : "rgba(30,60,100,0.4)" }}
                    />
                  ))}
                </div>
                <span className="text-[10px] font-mono font-bold" style={{ color: newPwCheck.color }}>
                  {newPwCheck.label}
                </span>
              </div>
            )}
          </div>

          <Input
            label="Confirm New Password"
            type="password"
            value={passwords.confirm}
            onChange={e => {
              setPasswords(v => ({ ...v, confirm: e.target.value }));
              setPwError("");
            }}
            placeholder="Repeat new password"
            error={passwords.confirm && passwords.confirm !== passwords.next ? "Passwords do not match" : ""}
          />

          <div className="flex gap-3 mt-2">
            <Button variant="outline" size="md" className="flex-1" onClick={() => setPwModal(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="md"
              disabled={!passwords.current || !passwords.next || !newPwCheck.isValid || passwords.next !== passwords.confirm}
              onClick={handleUpdatePassword}
            >
              Update Password
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
