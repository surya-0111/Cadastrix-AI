import { useState } from "react";
import { Eye, EyeOff, Map, Lock, Mail, AlertTriangle, Shield, CheckCircle2, UserCheck, KeyRound, Check } from "lucide-react";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import AuthBackground from "../../components/auth/AuthBackground";
import GoogleAuthModal from "../../components/auth/GoogleAuthModal";
import type { View, User, UserRole } from "../../types";
import { authService } from "../../services/authService";
import { getStoredAccounts, type StoredAccount } from "../../utils/storage";
import { validateEmail } from "../../utils/validators";

interface SignInProps {
  onNavigate: (view: View) => void;
  onSignIn: (email: string, user?: User) => void;
}

type AuthState = "idle" | "loading" | "error";

export default function SignIn({ onNavigate, onSignIn }: SignInProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [state, setState] = useState<AuthState>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [googleModalOpen, setGoogleModalOpen] = useState(false);
  const [selectedDemoRole, setSelectedDemoRole] = useState<string | null>(null);

  const validate = () => {
    const e: typeof errors = {};
    const cleanEmail = email.trim();
    if (!cleanEmail) {
      e.email = "Work email is required.";
    } else if (!validateEmail(cleanEmail)) {
      e.email = "Enter a valid email address.";
    }
    if (!password) {
      e.password = "Password is required.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    if (!validate()) return;

    setState("loading");
    const res = await authService.login(email.trim().toLowerCase(), password);

    if (!res.success || !res.user) {
      setState("error");
      setErrorMessage("Invalid email or password.");
      return;
    }

    setState("idle");
    onSignIn(res.user.email, res.user);
  };

  const handleGoogleUser = async (gUser: { name: string; email: string; avatar?: string; role: UserRole }) => {
    const res = await authService.loginWithGoogleDemo(gUser);
    if (res.user) {
      onSignIn(res.user.email, res.user);
    }
  };

  const handleSelectDemoProfile = (acc: StoredAccount) => {
    setEmail(acc.email);
    setPassword("Password@123");
    setSelectedDemoRole(acc.role);
    setErrors({});
    setErrorMessage("");
  };

  const accounts = getStoredAccounts();

  return (
    <div className="min-h-screen bg-[#080e1a] flex items-center justify-center p-3 sm:p-4 relative overflow-hidden">
      <AuthBackground />
      <div className="relative z-10 w-full max-w-md my-auto py-2 sm:py-4">
        
        {/* Branding Header */}
        <div className="flex flex-col items-center mb-4 sm:mb-5">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[rgba(0,212,255,0.12)] border border-[rgba(0,212,255,0.25)] flex items-center justify-center mb-2 shadow-[0_0_15px_rgba(0,212,255,0.2)]">
            <Map size={20} className="text-[#00d4ff]" />
          </div>
          <div className="text-lg sm:text-xl font-bold text-[#e2eaf4] tracking-tight">CadastrixAI</div>
          <div className="text-[10px] text-[#4a6a8a] uppercase tracking-widest font-mono mt-0.5">GIS Command Center</div>
        </div>

        <div className="bg-[rgba(13,21,38,0.9)] backdrop-blur-md border border-[rgba(30,60,100,0.65)] rounded-2xl p-5 sm:p-6 shadow-2xl">
          
          <div className="mb-3 flex items-center justify-between text-[10px] font-mono px-2.5 py-1 rounded-lg bg-[rgba(30,60,100,0.3)] border border-[rgba(30,60,100,0.5)]">
            <span className="text-[#7a9cc0]">Frontend Architecture:</span>
            <span className="text-[#00d4ff] font-bold">● Local Service Layer</span>
          </div>

          <div className="mb-4">
            <h1 className="text-base sm:text-lg font-semibold text-[#e2eaf4]">Sign in to your account</h1>
            <p className="text-xs text-[#7a9cc0] mt-0.5">Institutional Cadastral Records & AI Intelligence Platform</p>
          </div>

          {state === "error" && errorMessage && (
            <div className="mb-3.5 px-3 py-2 rounded-lg bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.3)] text-xs text-[#ffb4ab] flex items-center gap-2 animate-in fade-in duration-150">
              <AlertTriangle size={14} className="text-[#ef4444] flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Google Demo Login Button */}
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
            Continue with Google (Demo)
          </Button>

          <div className="flex items-center gap-3 my-3">
            <div className="flex-1 h-px bg-[rgba(30,60,100,0.5)]" />
            <span className="text-[10px] text-[#4a6a8a] uppercase tracking-wider">or sign in with email</span>
            <div className="flex-1 h-px bg-[rgba(30,60,100,0.5)]" />
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3" noValidate>
            <Input
              label="Work Email"
              type="email"
              placeholder="Enter your work email"
              value={email}
              onChange={e => {
                setEmail(e.target.value);
                setSelectedDemoRole(null);
                if (errors.email) setErrors(v => ({ ...v, email: undefined }));
                if (errorMessage) setErrorMessage("");
              }}
              prefix={<Mail size={14} />}
              error={errors.email}
              autoComplete="email"
            />

            <div>
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="signin-password" className="text-xs font-medium text-[#7a9cc0] uppercase tracking-wider">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => onNavigate("forgot-password")}
                  className="text-xs text-[#00d4ff] hover:text-[#33ddff] transition-colors"
                >
                  Forgot password?
                </button>
              </div>
              <Input
                id="signin-password"
                type={showPw ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={e => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors(v => ({ ...v, password: undefined }));
                  if (errorMessage) setErrorMessage("");
                }}
                prefix={<Lock size={14} />}
                suffix={
                  <button
                    type="button"
                    onClick={() => setShowPw(v => !v)}
                    className="text-[#4a6a8a] hover:text-[#7a9cc0] transition-colors p-1"
                    aria-label={showPw ? "Hide password" : "Show password"}
                  >
                    {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                }
                error={errors.password}
                autoComplete="current-password"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={state === "loading"}
              disabled={state === "loading"}
              className="w-full mt-1"
            >
              {state === "loading" ? "Signing in..." : "Sign In to Command Center"}
            </Button>
          </form>

          {/* Demo Profile Selector (All 6 Roles) */}
          <div className="mt-4 pt-3.5 border-t border-[rgba(30,60,100,0.4)]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] text-[#4a6a8a] uppercase font-mono tracking-wider">
                Select Demo Profile (Local Development)
              </span>
              {selectedDemoRole && (
                <span className="text-[10px] text-[#10b981] font-mono flex items-center gap-1">
                  <Check size={11} /> Profile selected
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 max-h-36 overflow-y-auto pr-0.5">
              {accounts.map(acc => {
                const isSelected = email.toLowerCase() === acc.email.toLowerCase();
                return (
                  <button
                    key={acc.id}
                    type="button"
                    onClick={() => handleSelectDemoProfile(acc)}
                    className={`p-1.5 sm:p-2 rounded-lg border text-left transition-all ${
                      isSelected
                        ? "bg-[rgba(0,212,255,0.12)] border-[#00d4ff] shadow-[0_0_8px_rgba(0,212,255,0.25)]"
                        : "bg-[rgba(30,60,100,0.2)] border-[rgba(30,60,100,0.4)] hover:border-[rgba(0,212,255,0.4)] hover:bg-[rgba(30,60,100,0.35)]"
                    }`}
                    aria-label={`Select demo profile ${acc.role}`}
                  >
                    <div className="text-[11px] font-semibold text-[#e2eaf4] truncate leading-tight">
                      {acc.name.split(" ")[0]} {acc.name.split(" ")[1]?.[0] || ""}.
                    </div>
                    <div className="text-[10px] text-[#00d4ff] font-mono truncate mt-0.5 font-medium">
                      {acc.role}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <p className="text-center text-xs text-[#4a6a8a] mt-4">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={() => onNavigate("signup")}
              className="text-[#00d4ff] hover:text-[#33ddff] font-medium transition-colors"
            >
              Create account
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
