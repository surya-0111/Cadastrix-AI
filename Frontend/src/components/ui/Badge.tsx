import type { ReactNode } from "react";

type BadgeVariant = "cyan" | "blue" | "violet" | "amber" | "red" | "green" | "muted";

interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
  dot?: boolean;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  cyan: "bg-[rgba(0,212,255,0.12)] text-[#00d4ff] border-[rgba(0,212,255,0.25)]",
  blue: "bg-[rgba(59,130,246,0.12)] text-[#3b82f6] border-[rgba(59,130,246,0.25)]",
  violet: "bg-[rgba(139,92,246,0.12)] text-[#8b5cf6] border-[rgba(139,92,246,0.25)]",
  amber: "bg-[rgba(245,158,11,0.12)] text-[#f59e0b] border-[rgba(245,158,11,0.25)]",
  red: "bg-[rgba(239,68,68,0.12)] text-[#ef4444] border-[rgba(239,68,68,0.25)]",
  green: "bg-[rgba(16,185,129,0.12)] text-[#10b981] border-[rgba(16,185,129,0.25)]",
  muted: "bg-[rgba(122,156,192,0.08)] text-[#7a9cc0] border-[rgba(122,156,192,0.15)]",
};

const dotColors: Record<BadgeVariant, string> = {
  cyan: "bg-[#00d4ff]",
  blue: "bg-[#3b82f6]",
  violet: "bg-[#8b5cf6]",
  amber: "bg-[#f59e0b]",
  red: "bg-[#ef4444]",
  green: "bg-[#10b981]",
  muted: "bg-[#7a9cc0]",
};

export default function Badge({ variant = "muted", children, dot, className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium font-mono border ${variantStyles[variant]} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`} />}
      {children}
    </span>
  );
}
