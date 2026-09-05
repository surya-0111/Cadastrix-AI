import type { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  icon?: ReactNode;
  trend?: { value: number; label?: string };
  color?: string;
  className?: string;
}

export default function StatCard({ label, value, sub, icon, trend, color = "#00d4ff", className = "" }: StatCardProps) {
  return (
    <div className={`bg-[#0d1526] border border-[rgba(30,60,100,0.5)] rounded-xl p-4 flex flex-col gap-3 ${className}`}>
      <div className="flex items-start justify-between">
        <span className="text-xs font-medium text-[#7a9cc0] uppercase tracking-wider">{label}</span>
        {icon && (
          <span className="p-1.5 rounded-md" style={{ backgroundColor: `${color}18` }}>
            <span style={{ color }}>{icon}</span>
          </span>
        )}
      </div>
      <div>
        <div className="text-2xl font-semibold font-mono" style={{ color }}>
          {value}
        </div>
        {sub && <div className="text-xs text-[#4a6a8a] mt-0.5">{sub}</div>}
      </div>
      {trend && (
        <div className={`text-xs font-mono ${trend.value >= 0 ? "text-[#10b981]" : "text-[#ef4444]"}`}>
          {trend.value >= 0 ? "↑" : "↓"} {Math.abs(trend.value)}% {trend.label}
        </div>
      )}
    </div>
  );
}
