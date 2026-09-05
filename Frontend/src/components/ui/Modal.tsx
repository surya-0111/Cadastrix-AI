import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  width?: string;
}

export default function Modal({ open, onClose, title, children, width = "max-w-lg" }: ModalProps) {
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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className="absolute inset-0 bg-[rgba(4,8,20,0.85)] backdrop-blur-sm" onClick={onClose} />
      <div
        className={`relative w-full ${width} bg-[#0d1526] border border-[rgba(30,60,100,0.6)] rounded-xl shadow-2xl`}
        style={{ animation: "fade-in 0.15s ease-out" }}
      >
        {title && (
          <div className="flex items-center justify-between px-5 py-4 border-b border-[rgba(30,60,100,0.5)]">
            <h2 className="text-sm font-semibold text-[#e2eaf4]">{title}</h2>
            <button
              onClick={onClose}
              className="p-1 rounded text-[#4a6a8a] hover:text-[#e2eaf4] hover:bg-[rgba(30,60,100,0.4)] transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X size={16} />
            </button>
          </div>
        )}
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
