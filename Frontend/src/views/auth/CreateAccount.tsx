import { useState } from "react";
import { Eye, EyeOff, Map, CheckCircle2, Shield, AlertTriangle, UserCheck } from "lucide-react";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import AuthBackground from "../../components/auth/AuthBackground";
import GoogleAuthModal from "../../components/auth/GoogleAuthModal";
import type { View, User, UserRole } from "../../types";
import { authService } from "../../services/authService";
import { findAccountByEmail } from "../../utils/storage";
import { validatePassword, validateEmail } from "../../utils/validators";

interface CreateAccountProps {
  onNavigate: (view: View) => void;
  onCreated: (user?: User) => void;
}

const ROLES: { role: UserRole; desc: string }[] = [
  { role: "GIS Analyst", desc: "Boundary extraction, WebGIS spatial analysis & QA" },
  { role: "Surveyor", desc: "Field survey, parcel reconciliation & topology repair" },
  { role: "Administrator", desc: "Full administrative controls, batch approvals & user management" },
  { role: "Project Manager", desc: "Dashboard oversight, progress tracking & analytics reports" },
  { role: "Data Engineer", desc: "GeoTIFF raster processing, CRS transforms & vector ETL" },
  { role: "Viewer", desc: "Read-only cadastral exploration and registry inspection" },
];

export default function CreateAccount({ onNavigate, onCreated }: CreateAccountProps) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    org: "Chennai Metropolitan Development Authority",
    password: "",
    confirm: "",
    role: "GIS Analyst" as UserRole,
  });
  const [showPw, setShowPw] = useState(false);
  const [agreed, setAgreed] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState("");
  const [googleModalOpen, setGoogleModalOpen] = useState(false);

  const pwCheck = validatePassword(form.password);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(v => ({ ...v, [k]: e.target.value }));
    if (errors[k]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[k];
        return next;
      });
    }
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Full name is required.";
    if (!validateEmail(form.email.trim())) e.email = "Valid work email required (e.g. name@organisation.gov.in)";
    
    // Check if account already exists locally
    if (findAccountByEmail(form.email.trim())) {
      e.email = "An account with this email already exists. Please sign in instead.";
    }

    if (!form.org.trim()) e.org = "Organisation is required.";
    
    // Strict password validation
    if (!pwCheck.isValid) {
      e.password = pwCheck.errors[0] || "Password does not meet minimum security requirements";
    }

    if (form.confirm !== form.password) {
      e.confirm = "Passwords do not match.";
    }

    if (!agreed) {
      e.terms = "You must agree to the Terms of Service to continue.";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError("");
    if (!validate()) return;
    setLoading(true);

    const res = await authService.register({
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      password: form.password,
      role: form.role,
      organization: form.org.trim(),
    });

    setLoading(false);

    if (!res.success || !res.user) {
      setGeneralError(res.error || "Failed to create account.");
      return;
    }

    onCreated(res.user);
  };

  const handleGoogleUser = async (gUser: { name: string; email: string; avatar?: string; role: UserRole }) => {
    const res = await authService.loginWithGoogleDemo(gUser);
    if (res.user) {
      onCreated(res.user);
    }
  };

  return (
    <div className="min-h-screen bg-[#080e1a] flex items-center justify-center p-3 sm:p-4 relative overflow-hidden">
      <AuthBackground />
      <div className="relative z-10 w-full max-w-md my-auto py-2 sm:py-4">
        
        {/* Branding Header */}
        <div className="flex flex-col items-center mb-3 sm:mb-4">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[rgba(0,212,255,0.12)] border border-[rgba(0,212,255,0.25)] flex items-center justify-center mb-1.5 shadow-[0_0_15px_rgba(0,212,255,0.2)]">
            <Map size={20} className="text-[#00d4ff]" />
          </div>
          <div className="text-lg sm:text-xl font-bold text-[#e2eaf4]">CadastrixAI</div>
          <div className="text-[10px] text-[#4a6a8a] uppercase tracking-widest font-mono mt-0.5">Create Account</div>
        </div>

        <div className="bg-[rgba(13,21,38,0.9)] backdrop-blur-md border border-[rgba(30,60,100,0.65)] rounded-2xl p-5 sm:p-6 shadow-2xl">
          
          <div className="mb-3 flex items-center justify-between text-[10px] font-mono px-2.5 py-1 rounded-lg bg-[rgba(30,60,100,0.3)] border border-[rgba(30,60,100,0.5)]">
            <span className="text-[#7a9cc0]">Frontend Architecture:</span>
            <span className="text-[#00d4ff] font-bold">● Local Service Layer</span>
          </div>

          <div className="mb-3.5">
            <h1 className="text-base sm:text-lg font-semibold text-[#e2eaf4]">Join the GIS platform</h1>
            <p className="text-xs text-[#7a9cc0] mt-0.5">Create your institutional cadastral profile</p>
          </div>

          {generalError && (
            <div className="mb-3 px-3 py-2 rounded-lg bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.3)] text-xs text-[#ffb4ab] flex items-center gap-2 animate-in fade-in duration-150">
              <AlertTriangle size={14} className="text-[#ef4444] flex-shrink-0" />
              <span>{generalError}</span>
            </div>
          )}

          <Button
            type="button"
            variant="outline"
            size="md"
            className="w-full mb-3"
            onClick={() => setGoogleModalOpen(true)}
            icon={
              <svg viewBox="0 0 20 20" className="w-4 h-4" aria-hidden="true">
                <path fill="#4285F4" d="M19.6 10.23c0-.68-.06-1.36-.17-2H10v3.79h5.4a4.6 4.6 0 01-2 3.01v2.5h3.24c1.9-1.75 2.96-4.33 2.96-7.3z" />
                <path fill="#34A853" d="M10 20c2.7 0 4.96-.9 6.62-2.43l-3.24-2.5c-.9.6-2.04.96-3.38.96-2.6 0-4.8-1.75-5.59-4.1H1.06v2.57A10 10 0 0010 20z" />
                <path fill="#FBBC04" d="M4.41 11.93A6.02 6.02 0 014.1 10c0-.67.12-1.33.31-1.93V5.5H1.06A10 10 0 000 10c0 1.61.39 3.14 1.06 4.5l3.35-2.57z" />
                <path fill="#EA4335" d="M10 3.96c1.47 0 2.79.5 3.83 1.5l2.87-2.87C14.96.99 12.7 0 10 0 6.09 0 2.74 2.27 1.06 5.5l3.35 2.57C5.2 5.71 7.4 3.96 10 3.96z" />
              </svg>
            }
          >
            Sign up with Google (Demo)
          </Button>

          <div className="flex items-center gap-3 my-3">
            <div className="flex-1 h-px bg-[rgba(30,60,100,0.5)]" />
            <span className="text-[10px] text-[#4a6a8a] uppercase tracking-wider">or sign up with email</span>
            <div className="flex-1 h-px bg-[rgba(30,60,100,0.5)]" />
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3" noValidate>
            <Input
              label="Full Name"
              placeholder="e.g. Arjun Krishnamurthy"
              value={form.name}
              onChange={set("name")}
              error={errors.name}
              autoComplete="name"
            />

            <Input
              label="Work Email"
              type="email"
              placeholder="name@cmda.tn.gov.in"
              value={form.email}
              onChange={set("email")}
              error={errors.email}
              autoComplete="email"
            />

            {/* Role Selector */}
            <div className="flex flex-col gap-1">
              <label htmlFor="create-account-role" className="text-xs font-medium text-[#7a9cc0] uppercase tracking-wider">
                User Role & Permissions
              </label>
              <select
                id="create-account-role"
                value={form.role}
                onChange={e => setForm(v => ({ ...v, role: e.target.value as UserRole }))}
                className="w-full bg-[#0d1526] border border-[rgba(30,60,100,0.6)] text-[#e2eaf4] text-xs rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#00d4ff]"
              >
                {ROLES.map(r => (
                  <option key={r.role} value={r.role}>
                    {r.role} — {r.desc}
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="Organisation"
              placeholder="e.g. Chennai Metropolitan Development Authority"
              value={form.org}
              onChange={set("org")}
              error={errors.org}
            />

            <div>
              <Input
                label="Password"
                type={showPw ? "text" : "password"}
                placeholder="Min 8 chars, 1 uppercase, 1 number"
                value={form.password}
                onChange={set("password")}
                error={errors.password}
                autoComplete="new-password"
                suffix={
                  <button
                    type="button"
                    onClick={() => setShowPw(v => !v)}
                    className="text-[#4a6a8a] hover:text-[#7a9cc0] p-1"
                    aria-label={showPw ? "Hide password" : "Show password"}
                  >
                    {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                }
              />

              {form.password && (
                <div className="mt-1.5 flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1 flex-1">
                      {[0, 1, 2, 3].map(i => (
                        <div
                          key={i}
                          className="h-1 flex-1 rounded-full transition-colors duration-300"
                          style={{ backgroundColor: i < pwCheck.score ? pwCheck.color : "rgba(30,60,100,0.4)" }}
                        />
                      ))}
                    </div>
                    <span className="text-[10px] font-mono font-bold" style={{ color: pwCheck.color }}>
                      {pwCheck.label}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-1 text-[10px] font-mono text-[#7a9cc0] mt-0.5">
                    <span className={pwCheck.hasMinLength ? "text-[#10b981]" : "text-[#4a6a8a]"}>
                      {pwCheck.hasMinLength ? "✓" : "○"} 8+ Characters
                    </span>
                    <span className={pwCheck.hasUppercase ? "text-[#10b981]" : "text-[#4a6a8a]"}>
                      {pwCheck.hasUppercase ? "✓" : "○"} Uppercase (A-Z)
                    </span>
                    <span className={pwCheck.hasNumber ? "text-[#10b981]" : "text-[#4a6a8a]"}>
                      {pwCheck.hasNumber ? "✓" : "○"} Number (0-9)
                    </span>
                    <span className={pwCheck.hasSpecialChar ? "text-[#10b981]" : "text-[#4a6a8a]"}>
                      {pwCheck.hasSpecialChar ? "✓" : "○"} Special Symbol
                    </span>
                  </div>
                </div>
              )}
            </div>

            <Input
              label="Confirm Password"
              type={showPw ? "text" : "password"}
              placeholder="Repeat password"
              value={form.confirm}
              onChange={set("confirm")}
              error={errors.confirm}
              autoComplete="new-password"
            />

            <label className="flex items-start gap-2 cursor-pointer mt-0.5">
              <input
                type="checkbox"
                checked={agreed}
                onChange={e => setAgreed(e.target.checked)}
                className="mt-0.5 accent-[#00d4ff]"
              />
              <span className="text-xs text-[#7a9cc0] leading-relaxed">
                I agree to the <span className="text-[#00d4ff]">Terms of Service</span> and{" "}
                <span className="text-[#00d4ff]">Cadastral Security Policy</span>
              </span>
            </label>
            {errors.terms && <p className="text-xs text-[#ef4444] -mt-1">{errors.terms}</p>}

            <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full mt-1.5">
              {loading ? "Creating local profile…" : "Create account"}
            </Button>
          </form>

          <p className="text-center text-xs text-[#4a6a8a] mt-3.5">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => onNavigate("signin")}
              className="text-[#00d4ff] hover:text-[#33ddff] font-medium transition-colors"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>

      <GoogleAuthModal
        open={googleModalOpen}
        onClose={() => setGoogleModalOpen(false)}
        onSelectGoogleUser={handleGoogleUser}
      />
    </div>
  );
}
