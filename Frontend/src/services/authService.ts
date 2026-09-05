import type { User, UserRole } from "../types";
import {
  findAccountByEmail,
  verifyAccountCredentials,
  createNewAccount,
  updateAccountPassword,
  getStoredUser,
  setStoredUser,
  getStoredSession,
  setStoredSession,
  clearStoredSession,
  storeResetToken,
  verifyResetCode,
  type StoredAccount
} from "../utils/storage";

export interface AuthResponse {
  success: boolean;
  user?: User;
  error?: string;
}

export interface ResetResponse {
  success: boolean;
  code?: string;
  message: string;
}

/**
 * Frontend Authentication Service (Local Development / Mock Provider)
 * Designed for easy plug-and-play migration to REST/GraphQL APIs later.
 */
export const authService = {
  /**
   * Local demo sign in with credential verification
   */
  async login(email: string, plainPassword: string): Promise<AuthResponse> {
    await new Promise(r => setTimeout(r, 450)); // simulate network latency
    const check = await verifyAccountCredentials(email, plainPassword);

    if (!check.success || !check.account) {
      return {
        success: false,
        error: check.error || "Invalid credentials. Please verify your email and password.",
      };
    }

    const acc = check.account;
    const user: User = {
      id: acc.id,
      name: acc.name,
      email: acc.email,
      role: acc.role,
      organization: acc.organization,
      jobTitle: acc.jobTitle,
      workspace: acc.workspace,
      timezone: acc.timezone,
      language: acc.language,
      twoFactorEnabled: acc.twoFactorEnabled,
      avatar: acc.avatar,
      notificationPrefs: {
        projectProcessing: true,
        validationFailures: true,
        exports: true,
        teamMentions: true,
        systemAlerts: true,
      },
    };

    setStoredUser(user);
    setStoredSession(user);
    return { success: true, user };
  },

  /**
   * Local demo sign up and profile initialization
   */
  async register(data: {
    name: string;
    email: string;
    password: string;
    role: UserRole;
    organization: string;
  }): Promise<AuthResponse> {
    await new Promise(r => setTimeout(r, 550));
    const existing = findAccountByEmail(data.email);
    if (existing) {
      return { success: false, error: "An account with this email already exists in local storage." };
    }

    const acc = await createNewAccount(
      data.name.trim(),
      data.email.trim(),
      data.password,
      data.role,
      data.organization.trim()
    );

    const user: User = {
      id: acc.id,
      name: acc.name,
      email: acc.email,
      role: acc.role,
      organization: acc.organization,
      jobTitle: acc.jobTitle,
      workspace: acc.workspace,
      timezone: acc.timezone,
      language: acc.language,
      twoFactorEnabled: false,
      notificationPrefs: {
        projectProcessing: true,
        validationFailures: true,
        exports: true,
        teamMentions: true,
        systemAlerts: true,
      },
    };

    setStoredUser(user);
    setStoredSession(user);
    return { success: true, user };
  },

  /**
   * Development Google OAuth Simulation
   */
  async loginWithGoogleDemo(gUser: {
    name: string;
    email: string;
    role: UserRole;
    avatar?: string;
  }): Promise<AuthResponse> {
    await new Promise(r => setTimeout(r, 350));
    let account = findAccountByEmail(gUser.email);
    if (!account) {
      account = await createNewAccount(
        gUser.name,
        gUser.email,
        "GoogleOAuthUser@2025",
        gUser.role,
        "Chennai Metropolitan Development Authority"
      );
    }

    const user: User = {
      id: account.id,
      name: gUser.name,
      email: gUser.email,
      role: account.role || gUser.role,
      organization: account.organization,
      jobTitle: account.jobTitle,
      workspace: account.workspace,
      timezone: account.timezone || "Asia/Kolkata",
      language: account.language || "English",
      twoFactorEnabled: false,
      avatar: gUser.avatar || account.avatar,
      notificationPrefs: {
        projectProcessing: true,
        validationFailures: true,
        exports: true,
        teamMentions: true,
        systemAlerts: true,
      },
    };

    setStoredUser(user);
    setStoredSession(user);
    return { success: true, user };
  },

  /**
   * Request password reset simulation
   */
  async requestPasswordReset(email: string): Promise<ResetResponse> {
    await new Promise(r => setTimeout(r, 400));
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    storeResetToken(email, code);
    return {
      success: true,
      code,
      message: "Development password reset simulation created. Use the verification code to continue.",
    };
  },

  /**
   * Update password in local credential store
   */
  async updatePassword(email: string, newPassword: string): Promise<boolean> {
    await new Promise(r => setTimeout(r, 500));
    return updateAccountPassword(email, newPassword);
  },

  /**
   * Sign out and terminate local session
   */
  logout(): void {
    clearStoredSession();
  },

  /**
   * Check active local development session
   */
  getCurrentSession() {
    return getStoredSession();
  },

  /**
   * Get active user profile
   */
  getCurrentUser(): User {
    return getStoredUser();
  },
};
