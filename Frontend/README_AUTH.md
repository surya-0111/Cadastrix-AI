# CadastrixAI Authentication & Backend Setup Guide

This document explains the production authentication architecture, Google OAuth integration, role-based access control, and database schema for the CadastrixAI GIS Command Center.

---

## 1. Environment Setup

Create a `.env` file in the root directory by copying `.env.example`:

```bash
cp .env.example .env
```

Set your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
VITE_AUTH_REDIRECT_URL=http://localhost:8443
```

> **Note**: When `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are not set (e.g., local development), CadastrixAI automatically activates its secure local development provider with SHA-256 password hashing, token validation, and IndexedDB local file storage.

---

## 2. Google OAuth Configuration in Supabase

1. Open your [Supabase Dashboard](https://app.supabase.com) and go to **Authentication > Providers > Google**.
2. Enable **Google**.
3. Create an OAuth Client ID in the [Google Cloud Console](https://console.cloud.google.com/apis/credentials):
   - **Authorized JavaScript origins**: `http://localhost:8443` (and your production domain)
   - **Authorized redirect URIs**: `https://<your-project-id>.supabase.co/auth/v1/callback`
4. Copy the **Client ID** and **Client Secret** into your Supabase Google Provider settings.
5. In **Authentication > URL Configuration**, set:
   - **Site URL**: `http://localhost:8443`
   - **Redirect URLs**: `http://localhost:8443/**`

---

## 3. Database Schema & Row-Level Security (RLS)

Execute this SQL schema in your Supabase SQL Editor:

```sql
-- 1. Create User Profiles Table
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  organization TEXT DEFAULT 'Chennai Metropolitan Development Authority',
  job_title TEXT DEFAULT 'GIS Analyst',
  role TEXT DEFAULT 'GIS Analyst' CHECK (role IN ('Administrator', 'GIS Analyst', 'Surveyor', 'Project Manager', 'Data Engineer', 'Viewer')),
  workspace TEXT DEFAULT 'Chennai Urban Sector IV',
  avatar_url TEXT,
  timezone TEXT DEFAULT 'Asia/Kolkata',
  language TEXT DEFAULT 'English',
  two_factor_enabled BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable Row-Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies
-- Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Administrators can view all profiles
CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'Administrator'
    )
  );

-- 4. Automatically create profile on User Sign Up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role, organization)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'GIS Analyst'),
    COALESCE(NEW.raw_user_meta_data->>'organization', 'Chennai Metropolitan Development Authority')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

---

## 4. Role Permissions Matrix

| Permission | Administrator | GIS Analyst | Surveyor | Project Manager | Data Engineer | Viewer |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **View Dashboard & Maps** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Inspect Land Parcels** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Accept / Reject Parcels** | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Batch Approve All** | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Auto-Repair Topology** | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Run ML-CV AI Pipeline** | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ |
| **Export GIS Data (GeoJSON/PDF)**| ✅ | ✅ | ✅ | ✅ | ✅ | ❌ (Read-only) |
| **User & Role Management** | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
