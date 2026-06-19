import React from "react";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export function Select({
  label,
  options,
  placeholder,
  className = "",
  id,
  ...props
}: SelectProps) {
  const selectId = id || label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={selectId}
          className="text-sm text-text-secondary font-medium"
        >
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={`
          w-full bg-surface border border-border rounded-[10px] px-3 py-2
          text-text-primary text-sm appearance-none cursor-pointer
          focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20
          transition-colors duration-200
          bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%236b6b7b%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C/polyline%3E%3C/svg%3E')]
          bg-[length:16px] bg-[right_12px_center] bg-no-repeat pr-10
          ${className}
        `}
        {...props}
      >
        {placeholder && (
          <option value="" className="bg-surface text-text-muted">
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option
            key={opt.value}
            value={opt.value}
            className="bg-surface text-text-primary"
          >
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
