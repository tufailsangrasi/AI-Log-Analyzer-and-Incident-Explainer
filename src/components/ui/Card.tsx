import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
}

export function Card({
  children,
  className = "",
  hover = false,
  glow = false,
}: CardProps) {
  return (
    <div
      className={`
        bg-surface border border-border rounded-[12px] p-4
        ${hover ? "transition-all duration-200 hover:bg-surface-hover hover:border-primary/20 hover:shadow-elevated cursor-pointer" : ""}
        ${glow ? "animate-pulse-glow" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
