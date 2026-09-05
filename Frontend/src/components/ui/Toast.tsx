import { useEffect } from "react";
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react";
import type { Toast as ToastType } from "../../types";

interface ToastProps {
  toasts: ToastType[];
  onRemove: (id: string) => void;
}

const icons = {
  success: <CheckCircle size={15} className="text-[#10b981]" />,
  error: <XCircle size={15} className="text-[#ef4444]" />,
  warning: <AlertTriangle size={15} className="text-[#f59e0b]" />,
  info: <Info size={15} className="text-[#00d4ff]" />,
};

const borderColors = {
  success: "border-l-[#10b981]",
  error: "border-l-[#ef4444]",
  warning: "border-l-[#f59e0b]",
  info: "border-l-[#00d4ff]",
};

function ToastItem({ toast, onRemove }: { toast: ToastType; onRemove: (id: string) => void }) {
  useEffect(() => {
    const t = setTimeout(() => onRemove(toast.id), 4000);
    return () => clearTimeout(t);
  }, [toast.id, onRemove]);

  return (
    <div
      className={`flex items-start gap-3 bg-[#111e33] border border-[rgba(30,60,100,0.7)] border-l-2 ${borderColors[toast.type]} rounded-lg px-4 py-3 shadow-xl min-w-[280px] max-w-sm`}
      style={{ animation: "slide-in-right 0.2s ease-out" }}
    >
      <div className="mt-0.5">{icons[toast.type]}</div>
      <p className="text-sm text-[#e2eaf4] flex-1">{toast.message}</p>
      <button onClick={() => onRemove(toast.id)} className="text-[#4a6a8a] hover:text-[#7a9cc0] mt-0.5">
        <X size={14} />
      </button>
    </div>
  );
}

export default function Toast({ toasts, onRemove }: ToastProps) {
  return (
    <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2" aria-live="polite">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onRemove={onRemove} />
      ))}
    </div>
  );
}
