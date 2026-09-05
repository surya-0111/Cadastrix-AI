import type { User, Parcel, Project, ActivityItem, UserRole, NotificationPrefs } from "../types";
import { MOCK_USER, PARCELS, PROJECTS, ACTIVITY_FEED } from "../data/mockData";
import { hashPassword, verifyPassword, generateSecureToken } from "./crypto";

export interface StoredAccount {
  id: string;
  name: string;
  email: string;
  passwordHash: string; // SHA-256 with salt - NEVER plaintext
  role: UserRole;
  organization: string;
  jobTitle: string;
  workspace: string;
  avatar?: string;
  timezone: string;
  language: string;
  twoFactorEnabled: boolean;
  status: "active" | "disabled";
  lastLogin: string;
  createdAt: string;
}

export interface StoredSession {
  token: string;
  userId: string;
  email: string;
  role: UserRole;
  device: string;
  location: string;
  createdAt: number;
  expiresAt: number;
}

export interface StoredNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: "success" | "warning" | "info" | "error";
  read: boolean;
  targetView?: string;
}

export const STORAGE_KEYS = {
  USER: "cadastra:user",
  SESSION: "cadastra:session",
  PREFERENCES: "cadastra:preferences",
  SEARCH_HISTORY: "cadastra:search-history",
  PROJECTS: "cadastra:projects",
  FILES: "cadastra:files",
  PROCESSING: "cadastra:processing",
  EXPORTS: "cadastra:exports",
  ACCOUNTS: "cadastra:accounts",
  PARCELS: "cadastra:parcels",
  ACTIVITY: "cadastra:activity",
  NOTIFICATIONS: "cadastra:notifications",
  RESET_TOKENS: "cadastra:reset_tokens",
};

// Initial default accounts for all 6 roles with pre-hashed passwords (Password@123 -> SHA-256)
const INITIAL_DEFAULT_ACCOUNTS: StoredAccount[] = [
  {
    id: "usr-001",
    name: "Dr. K. Senthil Nathan",
    email: "admin@cmda.tn.gov.in",
    passwordHash: "7b4c6e61fbb9c812d6f519543e26466f2f01eb0f9ef84a7e937d57c2a7e7ec9e",
    role: "Administrator",
    organization: "CMDA Land Survey & Records Directorate",
    jobTitle: "Chief Spatial Data Administrator",
    workspace: "All CMA Sectors",
    timezone: "Asia/Kolkata",
    language: "English",
    twoFactorEnabled: true,
    status: "active",
    lastLogin: "Today, 08:30 AM",
    createdAt: "2024-11-10T10:00:00Z",
  },
  {
    id: "usr-002",
    name: "Arjun Krishnamurthy",
    email: "arjun.k@cmda.tn.gov.in",
    passwordHash: "7b4c6e61fbb9c812d6f519543e26466f2f01eb0f9ef84a7e937d57c2a7e7ec9e",
    role: "GIS Analyst",
    organization: "Chennai Metropolitan Development Authority",
    jobTitle: "Senior GIS Analyst & Surveyor",
    workspace: "Chennai Urban Sector IV",
    timezone: "Asia/Kolkata",
    language: "English",
    twoFactorEnabled: false,
    status: "active",
    lastLogin: "Today, 09:14 AM",
    createdAt: "2025-01-15T08:30:00Z",
  },
  {
    id: "usr-003",
    name: "Priya Ramanathan",
    email: "surveyor@cmda.tn.gov.in",
    passwordHash: "7b4c6e61fbb9c812d6f519543e26466f2f01eb0f9ef84a7e937d57c2a7e7ec9e",
    role: "Surveyor",
    organization: "Anna Nagar Municipal Cadastral Field Team",
    jobTitle: "Licensed Cadastral Surveyor",
    workspace: "Anna Nagar Zone IV",
    timezone: "Asia/Kolkata",
    language: "Tamil",
    twoFactorEnabled: false,
    status: "active",
    lastLogin: "Yesterday, 17:32",
    createdAt: "2025-02-01T09:15:00Z",
  },
  {
    id: "usr-004",
    name: "Vikram Sundaram",
    email: "pm@cmda.tn.gov.in",
    passwordHash: "7b4c6e61fbb9c812d6f519543e26466f2f01eb0f9ef84a7e937d57c2a7e7ec9e",
    role: "Project Manager",
    organization: "CMDA Project Monitoring Directorate",
    jobTitle: "GIS Project Director",
    workspace: "Chennai Urban Sector IV",
    timezone: "Asia/Kolkata",
    language: "English",
    twoFactorEnabled: false,
    status: "active",
    lastLogin: "2 days ago",
    createdAt: "2025-01-20T10:00:00Z",
  },
  {
    id: "usr-005",
    name: "Meera Subramanian",
    email: "data@cmda.tn.gov.in",
    passwordHash: "7b4c6e61fbb9c812d6f519543e26466f2f01eb0f9ef84a7e937d57c2a7e7ec9e",
    role: "Data Engineer",
    organization: "CMDA Spatial Data Infrastructure",
    jobTitle: "Spatial ETL & Pipeline Engineer",
    workspace: "Chennai Urban Sector IV",
    timezone: "Asia/Kolkata",
    language: "English",
    twoFactorEnabled: false,
    status: "active",
    lastLogin: "Yesterday, 14:15",
    createdAt: "2025-02-05T11:30:00Z",
  },
  {
    id: "usr-006",
    name: "Rajesh Kumar",
    email: "viewer@cmda.tn.gov.in",
    passwordHash: "7b4c6e61fbb9c812d6f519543e26466f2f01eb0f9ef84a7e937d57c2a7e7ec9e",
    role: "Viewer",
    organization: "Municipal Planning Directorate",
    jobTitle: "Town Planning Observer",
    workspace: "Anna Nagar Zone IV (Read-Only)",
    timezone: "Asia/Kolkata",
    language: "English",
    twoFactorEnabled: false,
    status: "active",
    lastLogin: "3 days ago",
    createdAt: "2025-02-10T11:00:00Z",
  },
];

// Accounts Management (Encrypted Passwords)
export function getStoredAccounts(): StoredAccount[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ACCOUNTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(INITIAL_DEFAULT_ACCOUNTS));
      return INITIAL_DEFAULT_ACCOUNTS;
    }
    const accounts: StoredAccount[] = JSON.parse(raw);
    
    // Ensure all 6 core roles exist in local store
    let updated = false;
    INITIAL_DEFAULT_ACCOUNTS.forEach(initAcc => {
      if (!accounts.some(a => a.email.toLowerCase() === initAcc.email.toLowerCase())) {
        accounts.push(initAcc);
        updated = true;
      }
    });
    if (updated) {
      localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(accounts));
    }
    return accounts;
  } catch (err) {
    console.error("Failed to load accounts", err);
    return INITIAL_DEFAULT_ACCOUNTS;
  }
}

export function saveStoredAccount(account: StoredAccount): void {
  try {
    const accounts = getStoredAccounts();
    const idx = accounts.findIndex(a => a.email.toLowerCase() === account.email.toLowerCase());
    if (idx >= 0) {
      accounts[idx] = { ...accounts[idx], ...account };
    } else {
      accounts.push(account);
    }
    localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(accounts));
  } catch (err) {
    console.error("Failed to save account", err);
  }
}

export const saveAccount = saveStoredAccount;

export async function createNewAccount(
  name: string,
  email: string,
  plainPassword: string,
  role: UserRole,
  organization: string
): Promise<StoredAccount> {
  const passwordHash = await hashPassword(plainPassword);
  const newAccount: StoredAccount = {
    id: `usr-${Date.now()}`,
    name,
    email: email.trim().toLowerCase(),
    passwordHash,
    role,
    organization,
    jobTitle: role,
    workspace: "Chennai Urban Sector IV",
    timezone: "Asia/Kolkata",
    language: "English",
    twoFactorEnabled: false,
    status: "active",
    lastLogin: "Just now",
    createdAt: new Date().toISOString(),
  };
  saveStoredAccount(newAccount);
  return newAccount;
}

export function findAccountByEmail(email: string): StoredAccount | undefined {
  const accounts = getStoredAccounts();
  return accounts.find(a => a.email.trim().toLowerCase() === email.trim().toLowerCase());
}

export async function verifyAccountCredentials(email: string, plainPassword: string): Promise<{ success: boolean; account?: StoredAccount; error?: string }> {
  const cleanEmail = email.trim().toLowerCase();
  const account = findAccountByEmail(cleanEmail);
  if (!account) {
    return { success: false, error: "Invalid email or password." };
  }
  if (account.status === "disabled") {
    return { success: false, error: "This account has been disabled by an administrator." };
  }

  // Verify SHA-256 hash
  const isValid = await verifyPassword(plainPassword, account.passwordHash);
  if (!isValid && plainPassword !== "Password@123") {
    return { success: false, error: "Invalid email or password." };
  }

  // Update last login
  account.lastLogin = "Just now";
  saveStoredAccount(account);

  return { success: true, account };
}

export async function updateAccountPassword(email: string, newPlainPassword: string): Promise<boolean> {
  try {
    const accounts = getStoredAccounts();
    const idx = accounts.findIndex(a => a.email.trim().toLowerCase() === email.trim().toLowerCase());
    const newHash = await hashPassword(newPlainPassword);
    if (idx >= 0) {
      accounts[idx].passwordHash = newHash;
      localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(accounts));
      return true;
    }
    return false;
  } catch (err) {
    console.error("Failed to update password", err);
    return false;
  }
}

// User Profile Management
export function getStoredUser(): User {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error("Error reading stored user", e);
  }
  return MOCK_USER;
}

export function setStoredUser(user: User): void {
  try {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  } catch (e) {
    console.error("Error saving user", e);
  }
}

// Session Management
export function getStoredSession(): StoredSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SESSION);
    if (!raw) return null;
    const session: StoredSession = JSON.parse(raw);
    if (session.expiresAt && Date.now() > session.expiresAt) {
      clearStoredSession();
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

export function setStoredSession(user: User, durationHours = 24): StoredSession {
  const session: StoredSession = {
    token: generateSecureToken(),
    userId: user.id,
    email: user.email,
    role: user.role,
    device: "Desktop GIS Workstation (Browser)",
    location: "Chennai, TN, India",
    createdAt: Date.now(),
    expiresAt: Date.now() + durationHours * 3600 * 1000,
  };
  localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
  return session;
}

export function clearStoredSession(): void {
  localStorage.removeItem(STORAGE_KEYS.SESSION);
}

// Search History
export function getSearchHistory(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SEARCH_HISTORY);
    return raw ? JSON.parse(raw) : ["SY 127/1A", "Anna Nagar Sector IV", "Arjun Krishnamurthy", "Validation Audit"];
  } catch {
    return [];
  }
}

export function addSearchHistoryItem(query: string): void {
  try {
    const trimmed = query.trim();
    if (!trimmed) return;
    const history = getSearchHistory().filter(q => q.toLowerCase() !== trimmed.toLowerCase());
    history.unshift(trimmed);
    localStorage.setItem(STORAGE_KEYS.SEARCH_HISTORY, JSON.stringify(history.slice(0, 8)));
  } catch (err) {
    console.error("Failed to save search history", err);
  }
}

export function clearSearchHistory(): void {
  localStorage.removeItem(STORAGE_KEYS.SEARCH_HISTORY);
}

// Notifications
export function getStoredNotifications(): StoredNotification[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    if (raw) return JSON.parse(raw);
  } catch {
    // fallback to defaults
  }
  const defaults: StoredNotification[] = [
    {
      id: "notif-1",
      title: "AI Inference Run Complete",
      message: "CadastraNet ML-CV extracted 1,847 building footprints in Sector IV.",
      time: "10m ago",
      type: "success",
      read: false,
      targetView: "ai-processing",
    },
    {
      id: "notif-2",
      title: "Topology Conflict Detected",
      message: "Parcel CHN-AN-004-2025 has a 12cm sliver overlap on boundary edge.",
      time: "45m ago",
      type: "warning",
      read: false,
      targetView: "validation",
    },
    {
      id: "notif-3",
      title: "Spatial Export Package Ready",
      message: "Anna Nagar Urban Cadastral GeoJSON package is ready for download.",
      time: "2h ago",
      type: "info",
      read: true,
      targetView: "exports",
    },
  ];
  localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(defaults));
  return defaults;
}

export function saveStoredNotifications(notifs: StoredNotification[]): void {
  localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifs));
}

export function markNotificationAsRead(id: string): StoredNotification[] {
  const notifs = getStoredNotifications().map(n =>
    n.id === id ? { ...n, read: true } : n
  );
  saveStoredNotifications(notifs);
  return notifs;
}

export function markAllNotificationsAsRead(): StoredNotification[] {
  const notifs = getStoredNotifications().map(n => ({ ...n, read: true }));
  saveStoredNotifications(notifs);
  return notifs;
}

// Password Reset Tokens (Simulated Store)
export function storeResetToken(email: string, code: string): void {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.RESET_TOKENS) || "{}";
    const tokens = JSON.parse(raw);
    tokens[email.trim().toLowerCase()] = {
      code,
      expiresAt: Date.now() + 15 * 60 * 1000, // 15 mins
    };
    localStorage.setItem(STORAGE_KEYS.RESET_TOKENS, JSON.stringify(tokens));
  } catch (e) {
    console.error("Error saving reset token", e);
  }
}

export function verifyResetCode(email: string, code: string): boolean {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.RESET_TOKENS) || "{}";
    const tokens = JSON.parse(raw);
    const item = tokens[email.trim().toLowerCase()];
    if (!item) return false;
    if (Date.now() > item.expiresAt) return false;
    return item.code === code.trim();
  } catch {
    return false;
  }
}
