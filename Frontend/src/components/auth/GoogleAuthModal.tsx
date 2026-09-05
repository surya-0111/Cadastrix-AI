import { useState, useEffect } from "react";
import { User, X, Shield, Check, UserCheck } from "lucide-react";
import Button from "../ui/Button";
import type { UserRole } from "../../types";

interface GoogleAuthModalProps {
  open: boolean;
  onClose: () => void;
  onSelectGoogleUser: (user: { name: string; email: string; avatar?: string; role: UserRole }) => void;
}

const DEMO_GOOGLE_ACCOUNTS: { name: string; email: string; role: UserRole; title: string }[] = [
  {
    name: "Dr. K. Senthil Nathan",
    email: "admin.cmda@gmail.com",
    role: "Administrator",
    title: "Chief Spatial Administrator (Full Access)",
  },
  {
    name: "Arjun Krishnamurthy",
    email: "arjun.gis.chennai@gmail.com",
    role: "GIS Analyst",
    title: "Senior GIS Analyst (WebGIS & AI Extraction)",
  },
  {
    name: "Priya Ramanathan",
    email: "priya.surveyor.tn@gmail.com",
    role: "Surveyor",
    title: "Licensed Cadastral Surveyor (Field Reconcile)",
  },
  {
    name: "Vikram Sundaram",
    email: "vikram.pm.cmda@gmail.com",
    role: "Project Manager",
    title: "Project Director (Oversight & Telemetry)",
  },
  {
    name: "Meera Subramanian",
    email: "meera.data.gis@gmail.com",
    role: "Data Engineer",
    title: "Spatial Data Engineer (Raster & Vector ETL)",
  },
  {
    name: "Rajesh Kumar",
    email: "rajesh.viewer.tn@gmail.com",
    role: "Viewer",
    title: "Town Planning Observer (Read-Only)",
  },
];

export default function GoogleAuthModal({ open, onClose, onSelectGoogleUser }: GoogleAuthModalProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole>("GIS Analyst");
  const [loading, setLoading] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const handleSelectAccount = async (acc: typeof DEMO_GOOGLE_ACCOUNTS[0]) => {
    setLoading(acc.email);
    await new Promise(r => setTimeout(r, 350));
    onSelectGoogleUser({
      name: acc.name,
      email: acc.email,
      role: acc.role,
    });
    setLoading(null);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Continue with Google Demo Login"
    >
      <div className="absolute inset-0 bg-[rgba(0,0,0,0.75)] backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[#0d1526] border border-[rgba(30,60,100,0.6)] rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Google Header */}
        <div className="px-6 pt-6 pb-4 border-b border-[rgba(30,60,100,0.4)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg viewBox="0 0 24 24" className="w-6 h-6" aria-hidden="true">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z" />
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z" />
              <path fill="#FBBC04" d="M5.28 14.27a7.2 7.2 0 010-4.54V6.58H1.25a11.98 11.98 0 000 10.84l4.03-3.15z" />
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
            </svg>
            <div>
              <h3 className="text-base font-semibold text-[#e2eaf4]">Continue with Google</h3>
              <p className="text-xs text-[#7a9cc0]">Development Mode · Select a Demo Account</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded text-[#4a6a8a] hover:text-[#e2eaf4] cursor-pointer" aria-label="Close dialog">
            <X size={18} />
          </button>
        </div>

        {/* Development Notice */}
        <div className="mx-6 mt-4 p-3 rounded-lg bg-[rgba(0,212,255,0.08)] border border-[rgba(0,212,255,0.25)] text-xs text-[#7a9cc0] leading-snug">
          💡 <strong>Development Google Login:</strong> Select a pre-configured institutional role profile to test role permissions and spatial tools.
        </div>

        {/* Account List */}
        <div className="p-6 flex flex-col gap-2 max-h-80 overflow-y-auto">
          {DEMO_GOOGLE_ACCOUNTS.map(acc => {
            const isLoading = loading === acc.email;
            return (
              <button
                key={acc.email}
                onClick={() => handleSelectAccount(acc)}
                disabled={Boolean(loading)}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-[rgba(30,60,100,0.2)] hover:bg-[rgba(30,60,100,0.4)] border border-[rgba(30,60,100,0.4)] hover:border-[rgba(0,212,255,0.4)] transition-all text-left group cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-[rgba(0,212,255,0.15)] border border-[rgba(0,212,255,0.3)] flex items-center justify-center text-xs font-mono font-bold text-[#00d4ff]">
                    {acc.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-[#e2eaf4] group-hover:text-[#00d4ff] transition-colors truncate">
                      {acc.name}
                    </div>
                    <div className="text-[10px] text-[#4a6a8a] font-mono truncate">{acc.email}</div>
                    <div className="text-[10px] text-[#7a9cc0] truncate mt-0.5">{acc.title}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[rgba(0,212,255,0.1)] text-[#00d4ff] font-mono border border-[rgba(0,212,255,0.2)]">
                    {acc.role}
                  </span>
                  {isLoading && (
                    <div className="w-3.5 h-3.5 border-2 border-[#00d4ff] border-t-transparent rounded-full animate-spin" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <div className="px-6 py-4 bg-[#0a1120] border-t border-[rgba(30,60,100,0.4)] flex justify-end">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
