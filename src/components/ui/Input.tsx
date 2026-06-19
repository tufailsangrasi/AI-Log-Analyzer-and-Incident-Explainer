import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export function Input({
  label,
  error,
  icon,
  className = "",
  id,
  ...props
}: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm text-text-secondary font-medium"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
            {icon}
          </div>
        )}
        <input
          id={inputId}
          className={`
            w-full bg-surface border border-border rounded-[10px] px-3 py-2
            text-text-primary placeholder:text-text-muted text-sm
            focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20
            transition-colors duration-200
            ${icon ? "pl-10" : ""}
            ${error ? "border-error/50 focus:border-error/50 focus:ring-error/20" : ""}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-error">{error}</p>}
    </div>
  );
}
