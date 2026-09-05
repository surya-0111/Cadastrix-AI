import { useState } from "react";
import { Map, ChevronRight } from "lucide-react";
import Button from "../../components/ui/Button";
import AuthBackground from "../../components/auth/AuthBackground";

interface WorkspaceSetupProps {
  onComplete: () => void;
}

const ROLES = ["GIS Analyst", "Surveyor", "Project Manager", "Data Engineer", "Administrator", "Viewer"];
const REGIONS = ["Chennai Metropolitan Area", "North Chennai", "South Chennai", "Central Chennai", "Peripheral Areas"];

export default function WorkspaceSetup({ onComplete }: WorkspaceSetupProps) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    org: "Chennai Metropolitan Development Authority",
    role: "",
    workArea: "",
    region: "",
  });
  const [loading, setLoading] = useState(false);

  const steps = [
    {
      title: "Organisation",
      field: "org" as const,
      label: "Organisation name",
      placeholder: "Your department or agency",
    },
  ];

  const canNext = () => {
    if (step === 0) return data.org.trim().length > 0;
    if (step === 1) return !!data.role;
    if (step === 2) return !!data.region;
    return true;
  };

  const handleFinish = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    onComplete();
  };

  return (
    <div className="min-h-screen bg-[#080e1a] flex items-center justify-center p-4 relative overflow-hidden">
      <AuthBackground />
      <div className="relative z-10 w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-[rgba(0,212,255,0.12)] border border-[rgba(0,212,255,0.25)] flex items-center justify-center mb-4">
            <Map size={22} className="text-[#00d4ff]" />
          </div>
          <div className="text-xl font-bold text-[#e2eaf4]">Workspace Setup</div>
          <div className="text-xs text-[#4a6a8a] mt-1 font-mono">Step {step + 1} of 3</div>
        </div>

        {/* Progress */}
        <div className="flex gap-2 mb-6">
          {[0, 1, 2].map(i => (
            <div key={i} className="flex-1 h-1 rounded-full transition-colors duration-300"
              style={{ backgroundColor: i <= step ? "#00d4ff" : "rgba(30,60,100,0.4)" }} />
          ))}
        </div>

        <div className="bg-[rgba(13,21,38,0.85)] backdrop-blur-md border border-[rgba(30,60,100,0.6)] rounded-2xl p-7 shadow-2xl">

          {step === 0 && (
            <div>
              <h2 className="text-lg font-semibold text-[#e2eaf4] mb-1">Your organisation</h2>
              <p className="text-xs text-[#4a6a8a] mb-5">Tell us where you work.</p>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-[#7a9cc0] uppercase tracking-wider">Organisation</label>
                <input
                  value={data.org}
                  onChange={e => setData(v => ({ ...v, org: e.target.value }))}
                  placeholder="Chennai Metropolitan Development Authority"
                  className="w-full bg-[#0d1526] border border-[rgba(30,60,100,0.6)] text-[#e2eaf4] placeholder-[#4a6a8a] text-sm rounded-md px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[rgba(0,212,255,0.4)]"
                />
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <h2 className="text-lg font-semibold text-[#e2eaf4] mb-1">Your role</h2>
              <p className="text-xs text-[#4a6a8a] mb-5">Select your primary function on this platform.</p>
              <div className="grid grid-cols-2 gap-2">
                {ROLES.map(role => (
                  <button
                    key={role}
                    onClick={() => setData(v => ({ ...v, role }))}
                    className={`px-3 py-2.5 rounded-lg text-sm text-left transition-all border ${
                      data.role === role
                        ? "bg-[rgba(0,212,255,0.1)] border-[rgba(0,212,255,0.35)] text-[#00d4ff]"
                        : "bg-[rgba(30,60,100,0.15)] border-[rgba(30,60,100,0.4)] text-[#7a9cc0] hover:border-[rgba(30,60,100,0.7)]"
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-lg font-semibold text-[#e2eaf4] mb-1">Primary work region</h2>
              <p className="text-xs text-[#4a6a8a] mb-5">Select the region you primarily work in.</p>
              <div className="flex flex-col gap-2">
                {REGIONS.map(region => (
                  <button
                    key={region}
                    onClick={() => setData(v => ({ ...v, region }))}
                    className={`px-4 py-3 rounded-lg text-sm text-left transition-all border flex items-center justify-between ${
                      data.region === region
                        ? "bg-[rgba(0,212,255,0.1)] border-[rgba(0,212,255,0.35)] text-[#00d4ff]"
                        : "bg-[rgba(30,60,100,0.15)] border-[rgba(30,60,100,0.4)] text-[#7a9cc0] hover:border-[rgba(30,60,100,0.7)]"
                    }`}
                  >
                    {region}
                    {data.region === region && <ChevronRight size={14} />}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3 mt-6">
            {step > 0 && (
              <Button variant="outline" size="lg" onClick={() => setStep(s => s - 1)} className="flex-1">
                Back
              </Button>
            )}
            {step < 2 ? (
              <Button variant="primary" size="lg" onClick={() => setStep(s => s + 1)} disabled={!canNext()} className="flex-1">
                Continue
              </Button>
            ) : (
              <Button variant="primary" size="lg" onClick={handleFinish} loading={loading} disabled={!canNext()} className="flex-1">
                {loading ? "Setting up…" : "Enter Command Center"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
