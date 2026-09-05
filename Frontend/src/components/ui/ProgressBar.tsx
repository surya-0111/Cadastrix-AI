interface ProgressBarProps {
  value: number;
  color?: string;
  height?: number;
  showLabel?: boolean;
  className?: string;
}

export default function ProgressBar({ value, color = "#00d4ff", height = 4, showLabel, className = "" }: ProgressBarProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div
        className="flex-1 rounded-full overflow-hidden bg-[rgba(30,60,100,0.4)]"
        style={{ height }}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${value}%`, backgroundColor: color }}
        />
      </div>
      {showLabel && <span className="text-xs font-mono text-[#7a9cc0] w-10 text-right">{value}%</span>}
    </div>
  );
}
