import type { User, UserRole } from "../types";
import {
  getStoredUser,
  setStoredUser,
  getStoredAccounts,
  saveStoredAccount,
  type StoredAccount
} from "../utils/storage";
import {
  saveAvatarToIndexedDB,
  removeAvatarFromIndexedDB,
  getAvatarFromIndexedDB
} from "../utils/indexedDB";

/**
 * User Service for Profile and Admin User Management
 */
export const userService = {
  getProfile(): User {
    return getStoredUser();
  },

  async updateProfile(user: User): Promise<User> {
    await new Promise(r => setTimeout(r, 400));
    setStoredUser(user);

    // Also update account record
    const accounts = getStoredAccounts();
    const idx = accounts.findIndex(a => a.id === user.id || a.email.toLowerCase() === user.email.toLowerCase());
    if (idx >= 0) {
      accounts[idx] = {
        ...accounts[idx],
        name: user.name,
        role: user.role,
        organization: user.organization,
        jobTitle: user.jobTitle,
        workspace: user.workspace,
        timezone: user.timezone,
        language: user.language,
        twoFactorEnabled: user.twoFactorEnabled,
        avatar: user.avatar,
      };
      saveStoredAccount(accounts[idx]);
    }
    return user;
  },

  getAllUsers(): StoredAccount[] {
    return getStoredAccounts();
  },

  async updateUserRole(userId: string, newRole: UserRole): Promise<StoredAccount[]> {
    await new Promise(r => setTimeout(r, 300));
    const accounts = getStoredAccounts();
    const acc = accounts.find(a => a.id === userId);
    if (acc) {
      acc.role = newRole;
      acc.jobTitle = newRole;
      saveStoredAccount(acc);
    }
    return getStoredAccounts();
  },

  async toggleUserStatus(userId: string): Promise<StoredAccount[]> {
    await new Promise(r => setTimeout(r, 300));
    const accounts = getStoredAccounts();
    const acc = accounts.find(a => a.id === userId);
    if (acc) {
      acc.status = acc.status === "active" ? "disabled" : "active";
      saveStoredAccount(acc);
    }
    return getStoredAccounts();
  },

  async uploadAvatar(userId: string, file: File): Promise<string> {
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      throw new Error("Only JPEG, PNG, or WebP images are allowed");
    }
    if (file.size > 2 * 1024 * 1024) {
      throw new Error("Image size must be under 2 MB");
    }

    await saveAvatarToIndexedDB(userId, file);
    return URL.createObjectURL(file);
  },

  async removeAvatar(userId: string): Promise<void> {
    await removeAvatarFromIndexedDB(userId);
  },
};
