import type { ReactNode, ButtonHTMLAttributes } from "react";
import { Loader2 } from "lucide-react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "outline";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: ReactNode;
  children?: ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-[#00d4ff] text-[#080e1a] hover:bg-[#33ddff] focus-visible:ring-[#00d4ff] font-semibold",
  secondary: "bg-[rgba(0,212,255,0.1)] text-[#00d4ff] border border-[rgba(0,212,255,0.25)] hover:bg-[rgba(0,212,255,0.18)] focus-visible:ring-[#00d4ff]",
  ghost: "bg-transparent text-[#7a9cc0] hover:bg-[rgba(122,156,192,0.1)] hover:text-[#e2eaf4] focus-visible:ring-[#7a9cc0]",
  danger: "bg-[rgba(239,68,68,0.12)] text-[#ef4444] border border-[rgba(239,68,68,0.25)] hover:bg-[rgba(239,68,68,0.2)] focus-visible:ring-[#ef4444]",
  outline: "bg-transparent text-[#e2eaf4] border border-[rgba(30,60,100,0.7)] hover:bg-[rgba(30,60,100,0.3)] focus-visible:ring-[#7a9cc0]",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs rounded gap-1.5",
  md: "px-4 py-2 text-sm rounded-md gap-2",
  lg: "px-5 py-2.5 text-sm rounded-md gap-2",
};

export default function Button({
  variant = "secondary",
  size = "md",
  loading,
  icon,
  children,
  disabled,
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center font-medium transition-all duration-150
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-offset-transparent
        disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer select-none
        ${variantStyles[variant]} ${sizeStyles[size]} ${className}
      `}
      {...props}
    >
      {loading ? <Loader2 size={14} className="animate-spin flex-shrink-0" /> : icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </button>
  );
}
