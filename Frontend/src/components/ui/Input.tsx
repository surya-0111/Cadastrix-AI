import {
  forwardRef,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";

type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "prefix"> & {
  label?: string;
  error?: string;
  hint?: string;
  prefix?: ReactNode;
  suffix?: ReactNode;
};

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      hint,
      prefix,
      suffix,
      className = "",
      id,
      ...props
    },
    ref
  ) => {
    const inputId =
      id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-medium text-[#7a9cc0] uppercase tracking-wider"
          >
            {label}
          </label>
        )}

        <div className="relative flex items-center">
          {prefix && (
            <div className="absolute left-3 text-[#4a6a8a] flex items-center pointer-events-none">
              {prefix}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            className={`
              w-full bg-[#0d1526] border text-[#e2eaf4] placeholder-[#4a6a8a] text-sm rounded-md
              px-3 py-2.5 transition-all duration-150
              focus:outline-none focus:ring-2 focus:ring-[rgba(0,212,255,0.4)] focus:border-[rgba(0,212,255,0.5)]
              ${
                error
                  ? "border-[rgba(239,68,68,0.5)] bg-[rgba(239,68,68,0.04)]"
                  : "border-[rgba(30,60,100,0.6)]"
              }
              ${prefix ? "pl-9" : ""}
              ${suffix ? "pr-10" : ""}
              ${className}
            `}
            {...props}
          />

          {suffix && (
            <div className="absolute right-3 text-[#4a6a8a] flex items-center">
              {suffix}
            </div>
          )}
        </div>

        {error && (
          <p className="text-xs text-[#ef4444]">
            {error}
          </p>
        )}

        {hint && !error && (
          <p className="text-xs text-[#4a6a8a]">
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;