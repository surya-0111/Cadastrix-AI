import { createClient, type SupabaseClient, type Session, type AuthChangeEvent } from "@supabase/supabase-js";
import type { User, UserRole } from "../types";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.startsWith("http") &&
    !supabaseUrl.includes("your-project-id")
  );
};

export type AuthMode = "SUPABASE_PRODUCTION" | "LOCAL_DEV_FALLBACK";

export const getAuthMode = (): AuthMode => {
  return isSupabaseConfigured() ? "SUPABASE_PRODUCTION" : "LOCAL_DEV_FALLBACK";
};

export const supabase: SupabaseClient | null = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    })
  : null;

/**
 * Service methods for Supabase Auth with safe error handling
 */

export async function supabaseSignIn(email: string, password: string): Promise<{ user: User; session: Session }> {
  if (!supabase) throw new Error("Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env");
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password,
  });
  if (error) throw error;
  if (!data.user || !data.session) throw new Error("Authentication failed: No session returned.");

  // Fetch or construct profile
  const profile = await fetchUserProfile(data.user.id, data.user.email || email);
  return { user: profile, session: data.session };
}

export async function supabaseSignUp(
  email: string,
  password: string,
  metadata: { full_name: string; organization: string; role: UserRole }
): Promise<{ user: User | null; session: Session | null; emailConfirmationRequired: boolean }> {
  if (!supabase) throw new Error("Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env");
  
  const { data, error } = await supabase.auth.signUp({
    email: email.trim().toLowerCase(),
    password,
    options: {
      data: {
        full_name: metadata.full_name,
        organization: metadata.organization,
        role: metadata.role,
      },
    },
  });
  if (error) throw error;

  const emailConfirmationRequired = !data.session;
  let user: User | null = null;

  if (data.user) {
    user = {
      id: data.user.id,
      name: metadata.full_name,
      email: data.user.email || email,
      role: metadata.role,
      organization: metadata.organization,
      jobTitle: metadata.role,
      workspace: "Chennai Urban Sector IV",
      timezone: "Asia/Kolkata",
      language: "English",
      twoFactorEnabled: false,
      notificationPrefs: {
        projectProcessing: true,
        validationFailures: true,
        exports: true,
        teamMentions: true,
        systemAlerts: true,
      },
    };
  }

  return { user, session: data.session, emailConfirmationRequired };
}

export async function supabaseSignInWithGoogle(): Promise<void> {
  if (!supabase) throw new Error("Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env");
  
  const redirectUrl = import.meta.env.VITE_AUTH_REDIRECT_URL || window.location.origin;
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: redirectUrl,
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  });
  if (error) throw error;
}

export async function supabaseResetPassword(email: string): Promise<{ success: boolean; message: string }> {
  if (!supabase) throw new Error("Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env");
  
  const redirectUrl = `${window.location.origin}/#reset-password`;
  const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
    redirectTo: redirectUrl,
  });
  if (error) throw error;
  return { success: true, message: "Password reset email sent. Please check your inbox and spam folder." };
}

export async function supabaseUpdatePassword(newPassword: string): Promise<void> {
  if (!supabase) throw new Error("Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env");
  
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });
  if (error) throw error;
}

export async function supabaseSignOut(): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function supabaseGetSession(): Promise<Session | null> {
  if (!supabase) return null;
  const { data, error } = await supabase.auth.getSession();
  if (error) return null;
  return data.session;
}

export function onSupabaseAuthStateChange(callback: (event: AuthChangeEvent, session: Session | null) => void) {
  if (!supabase) return { unsubscribe: () => {} };
  const { data: { subscription } } = supabase.auth.onAuthStateChange(callback);
  return { unsubscribe: () => subscription.unsubscribe() };
}

export async function fetchUserProfile(userId: string, email: string): Promise<User> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (data && !error) {
        return {
          id: data.id,
          name: data.full_name || email.split("@")[0],
          email: data.email || email,
          role: data.role || "GIS Analyst",
          organization: data.organization || "Chennai Metropolitan Development Authority",
          jobTitle: data.job_title || data.role || "GIS Analyst",
          workspace: data.workspace || "Chennai Urban Sector IV",
          timezone: data.timezone || "Asia/Kolkata",
          language: data.language || "English",
          twoFactorEnabled: data.two_factor_enabled || false,
          avatar: data.avatar_url,
          notificationPrefs: {
            projectProcessing: true,
            validationFailures: true,
            exports: true,
            teamMentions: true,
            systemAlerts: true,
          },
        };
      }
    } catch (e) {
      console.warn("Could not query profiles table, using auth user metadata fallback", e);
    }
  }

  // Fallback if profiles table is not yet migrated
  return {
    id: userId,
    name: email.split("@")[0].replace(".", " "),
    email,
    role: "GIS Analyst",
    organization: "Chennai Metropolitan Development Authority",
    jobTitle: "Senior GIS Analyst & Surveyor",
    workspace: "Chennai Urban Sector IV",
    timezone: "Asia/Kolkata",
    language: "English",
    twoFactorEnabled: false,
    notificationPrefs: {
      projectProcessing: true,
      validationFailures: true,
      exports: true,
      teamMentions: true,
      systemAlerts: true,
    },
  };
}
