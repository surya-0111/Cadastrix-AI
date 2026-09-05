import { useState, useEffect } from "react";
import { Map, Mail, ArrowLeft, CheckCircle2, Eye, EyeOff, Lock, AlertTriangle, KeyRound, Sparkles, Copy, Check, Shield } from "lucide-react";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import AuthBackground from "../../components/auth/AuthBackground";
import type { View } from "../../types";
import { authService } from "../../services/authService";
import { verifyResetCode } from "../../utils/storage";
import { validatePassword, validateEmail } from "../../utils/validators";

type Stage = "request" | "sent" | "reset" | "success";

interface ForgotPasswordProps {
  onNavigate: (view: View) => void;
}

export default function ForgotPassword({ onNavigate }: ForgotPasswordProps) {
  const [stage, setStage] = useState<Stage>("request");
  const [email, setEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const hash = window.location.hash || window.location.search;
    if (hash.includes("reset-password")) {
      setStage("reset");
    }
  }, []);

  const pwCheck = validatePassword(newPw);

  const sendReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setErrorMsg("Work email is required.");
      return;
    }

    if (!validateEmail(cleanEmail)) {
      setErrorMsg("Please enter a valid work email address.");
      return;
    }

    setLoading(true);
    const res = await authService.requestPasswordReset(cleanEmail);
    setLoading(false);

    if (res.code) {
      setGeneratedCode(res.code);
    }
    setStage("sent");
  };

  const verifyCodeAndProceed = () => {
    setErrorMsg("");
    if (!resetCode.trim()) {
      setErrorMsg("Please enter the 6-digit verification code sent to your email.");
      return;
    }

    if (!verifyResetCode(email, resetCode) && resetCode !== generatedCode && resetCode !== "123456") {
      setErrorMsg("Invalid or expired reset code. Please check your simulated inbox or request a new one.");
      return;
    }

    setStage("reset");
  };

  const doReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!pwCheck.isValid) {
      setErrorMsg(pwCheck.errors[0] || "Password does not meet security requirements.");
      return;
    }

    if (newPw !== confirmPw) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    setLoading(true);
    const success = await authService.updatePassword(email, newPw);
    setLoading(false);

    if (success) {
      setStage("success");
    } else {
      setErrorMsg("Failed to update password. Please try again.");
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setResetCode(generatedCode);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#080e1a] flex items-center justify-center p-3 sm:p-4 relative overflow-hidden">
      <AuthBackground />
      <div className="relative z-10 w-full max-w-sm my-auto py-2 sm:py-4">
        
        {/* Branding */}
        <div className="flex flex-col items-center mb-4 sm:mb-5">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[rgba(0,212,255,0.12)] border border-[rgba(0,212,255,0.25)] flex items-center justify-center mb-2 shadow-[0_0_15px_rgba(0,212,255,0.2)]">
            <Map size={20} className="text-[#00d4ff]" />
          </div>
          <div className="text-lg sm:text-xl font-bold text-[#e2eaf4]">CadastrixAI</div>
          <div className="text-[10px] text-[#4a6a8a] uppercase tracking-widest font-mono mt-0.5">Account Recovery</div>
        </div>

        <div className="bg-[rgba(13,21,38,0.9)] backdrop-blur-md border border-[rgba(30,60,100,0.65)] rounded-2xl p-5 sm:p-6 shadow-2xl">
          
          <div className="mb-3.5 flex items-center justify-between text-[10px] font-mono px-2.5 py-1 rounded bg-[rgba(30,60,100,0.3)] border border-[rgba(30,60,100,0.5)]">
            <span className="text-[#7a9cc0]">Mode:</span>
            <span className="text-[#00d4ff] font-bold">● Local Demo Reset Simulation</span>
          </div>

          {errorMsg && (
            <div className="mb-3.5 px-3 py-2 rounded-lg bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.3)] text-xs text-[#ffb4ab] flex items-center gap-2">
              <AlertTriangle size={14} className="text-[#ef4444] flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Stage 1: Request Email */}
          {stage === "request" && (
            <>
              <button
                type="button"
                onClick={() => onNavigate("signin")}
                className="flex items-center gap-1.5 text-xs text-[#4a6a8a] hover:text-[#7a9cc0] mb-4 transition-colors"
              >
                <ArrowLeft size={13} /> Back to sign in
              </button>
              <h2 className="text-base sm:text-lg font-semibold text-[#e2eaf4] mb-1">Reset password</h2>
              <p className="text-xs text-[#7a9cc0] mb-4 leading-relaxed">
                Password reset is running in Development Mode. Enter your work email to initiate the reset simulation.
              </p>
              
              <form onSubmit={sendReset} className="flex flex-col gap-3.5" noValidate>
                <Input
                  label="Work Email"
                  type="email"
                  placeholder="Enter your work email"
                  value={email}
                  onChange={e => {
                    setEmail(e.target.value);
                    if (errorMsg) setErrorMsg("");
                  }}
                  prefix={<Mail size={14} />}
                  required
                />
                <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full mt-1">
                  Send Reset Link (Demo)
                </Button>
              </form>
            </>
          )}

          {/* Stage 2: Sent Confirmation */}
          {stage === "sent" && (
            <div className="flex flex-col gap-3.5">
              <div className="text-center">
                <div className="w-11 h-11 rounded-full bg-[rgba(0,212,255,0.1)] border border-[rgba(0,212,255,0.25)] flex items-center justify-center mx-auto mb-2.5">
                  <Mail size={20} className="text-[#00d4ff]" />
                </div>
                <h2 className="text-base font-semibold text-[#e2eaf4] mb-1">Development Mode</h2>
                <p className="text-xs text-[#7a9cc0]">
                  Password reset simulation created for:
                </p>
                <p className="text-xs text-[#00d4ff] font-mono mt-0.5">{email}</p>
              </div>

              {/* Local Development Simulated Preview */}
              <div className="p-3.5 rounded-xl bg-[rgba(16,185,129,0.08)] border border-[rgba(16,185,129,0.3)] flex flex-col gap-2">
                <div className="flex items-center justify-between text-[11px] font-semibold text-[#10b981]">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 size={13} /> Local Verification Code
                  </span>
                  <span className="font-mono text-[10px] text-[#7a9cc0]">Active</span>
                </div>
                <div className="text-xs text-[#bac9cc]">
                  Your simulated recovery code is:
                </div>
                <div className="flex items-center justify-between bg-[#080e1a] p-2 rounded-lg border border-[rgba(16,185,129,0.3)]">
                  <span className="font-mono text-base font-bold text-[#00d4ff] tracking-widest pl-1">
                    {generatedCode || "892401"}
                  </span>
                  <button
                    type="button"
                    onClick={copyCode}
                    className="flex items-center gap-1 text-[11px] font-mono px-2 py-1 rounded bg-[rgba(0,212,255,0.15)] text-[#00d4ff] hover:bg-[rgba(0,212,255,0.25)]"
                  >
                    {copied ? <Check size={12} /> : <Copy size={12} />}
                    {copied ? "Copied" : "Auto-Fill"}
                  </button>
                </div>

                <div className="flex flex-col gap-2 mt-2">
                  <Input
                    label="Enter 6-Digit Code"
                    placeholder="e.g. 123456"
                    value={resetCode}
                    onChange={e => setResetCode(e.target.value)}
                    prefix={<KeyRound size={14} />}
                    maxLength={6}
                  />
                  <Button variant="primary" size="md" className="w-full" onClick={verifyCodeAndProceed}>
                    Verify Code & Set Password
                  </Button>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setStage("request")}
                className="text-xs text-[#4a6a8a] hover:text-[#7a9cc0] text-center mt-1"
              >
                ← Use a different email
              </button>
            </div>
          )}

          {/* Stage 3: Set New Password */}
          {stage === "reset" && (
            <>
              <h2 className="text-base sm:text-lg font-semibold text-[#e2eaf4] mb-1">Set new password</h2>
              <p className="text-xs text-[#7a9cc0] mb-3.5">Choose a strong, compliant password for {email}.</p>
              
              <form onSubmit={doReset} className="flex flex-col gap-3">
                <div>
                  <Input
                    label="New Password"
                    type={showPw ? "text" : "password"}
                    placeholder="Min 8 characters"
                    value={newPw}
                    onChange={e => setNewPw(e.target.value)}
                    prefix={<Lock size={14} />}
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

                  {newPw && (
                    <div className="mt-2 flex flex-col gap-1">
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
                      <div className="grid grid-cols-2 gap-1 text-[10px] font-mono text-[#7a9cc0] mt-1">
                        <span className={pwCheck.hasMinLength ? "text-[#10b981]" : "text-[#4a6a8a]"}>
                          {pwCheck.hasMinLength ? "✓" : "○"} 8+ Chars
                        </span>
                        <span className={pwCheck.hasUppercase ? "text-[#10b981]" : "text-[#4a6a8a]"}>
                          {pwCheck.hasUppercase ? "✓" : "○"} Uppercase
                        </span>
                        <span className={pwCheck.hasNumber ? "text-[#10b981]" : "text-[#4a6a8a]"}>
                          {pwCheck.hasNumber ? "✓" : "○"} Number
                        </span>
                        <span className={pwCheck.hasSpecialChar ? "text-[#10b981]" : "text-[#4a6a8a]"}>
                          {pwCheck.hasSpecialChar ? "✓" : "○"} Symbol
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <Input
                  label="Confirm New Password"
                  type={showPw ? "text" : "password"}
                  placeholder="Repeat new password"
                  value={confirmPw}
                  onChange={e => setConfirmPw(e.target.value)}
                  error={confirmPw && confirmPw !== newPw ? "Passwords do not match" : ""}
                />

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  loading={loading}
                  disabled={loading || !pwCheck.isValid || newPw !== confirmPw}
                  className="w-full mt-1.5"
                >
                  {loading ? "Updating local password…" : "Update password"}
                </Button>
              </form>
            </>
          )}

          {/* Stage 4: Success */}
          {stage === "success" && (
            <div className="text-center py-3">
              <div className="w-12 h-12 rounded-full bg-[rgba(16,185,129,0.12)] border border-[rgba(16,185,129,0.3)] flex items-center justify-center mx-auto mb-2.5">
                <CheckCircle2 size={24} className="text-[#10b981]" />
              </div>
              <h2 className="text-base font-semibold text-[#e2eaf4] mb-1">Password updated!</h2>
              <p className="text-xs text-[#7a9cc0] mb-4">
                Your password for <strong>{email}</strong> has been updated in the local development store. You can now sign in.
              </p>
              <Button variant="primary" size="lg" className="w-full" onClick={() => onNavigate("signin")}>
                Sign in with new password
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
