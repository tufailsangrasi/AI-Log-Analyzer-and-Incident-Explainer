export function LoadingSpinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizes = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-[3px]",
    lg: "h-12 w-12 border-4",
  };

  return (
    <div className="flex items-center justify-center">
      <div
        className={`
          ${sizes[size]}
          border-border border-t-primary
          rounded-full animate-spin
        `}
      />
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <LoadingSpinner size="lg" />
      <p className="text-text-muted text-sm animate-pulse">Loading data...</p>
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-surface border border-border rounded-[12px] p-4 space-y-3">
      <div className="skeleton h-4 w-1/3 rounded" />
      <div className="skeleton h-8 w-2/3 rounded" />
      <div className="skeleton h-3 w-1/4 rounded" />
    </div>
  );
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="bg-surface border border-border rounded-[12px] p-4 space-y-3">
      <div className="skeleton h-8 w-full rounded" />
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="skeleton h-12 w-full rounded" />
      ))}
    </div>
  );
}
