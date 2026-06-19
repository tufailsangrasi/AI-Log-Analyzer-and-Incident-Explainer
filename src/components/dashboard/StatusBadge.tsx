import type { TransactionStatus } from "@/types";

interface StatusBadgeProps {
  status: TransactionStatus | "pass" | "fail" | "warning" | "completed" | "processing" | "failed" | "critical" | "info";
  size?: "sm" | "md";
}

const statusConfig: Record<
  string,
  { bg: string; text: string; dot: string; label: string }
> = {
  approved: { bg: "bg-success-muted", text: "text-success", dot: "bg-success", label: "Approved" },
  declined: { bg: "bg-error-muted", text: "text-error", dot: "bg-error", label: "Declined" },
  error: { bg: "bg-error-muted", text: "text-error", dot: "bg-error", label: "Error" },
  timeout: { bg: "bg-warning-muted", text: "text-warning", dot: "bg-warning", label: "Timeout" },
  pending: { bg: "bg-info-muted", text: "text-info", dot: "bg-info", label: "Pending" },
  pass: { bg: "bg-success-muted", text: "text-success", dot: "bg-success", label: "Pass" },
  fail: { bg: "bg-error-muted", text: "text-error", dot: "bg-error", label: "Fail" },
  warning: { bg: "bg-warning-muted", text: "text-warning", dot: "bg-warning", label: "Warning" },
  completed: { bg: "bg-success-muted", text: "text-success", dot: "bg-success", label: "Completed" },
  processing: { bg: "bg-info-muted", text: "text-info", dot: "bg-info", label: "Processing" },
  failed: { bg: "bg-error-muted", text: "text-error", dot: "bg-error", label: "Failed" },
  critical: { bg: "bg-error-muted", text: "text-error", dot: "bg-error", label: "Critical" },
  info: { bg: "bg-info-muted", text: "text-info", dot: "bg-info", label: "Info" },
};

export function StatusBadge({ status, size = "sm" }: StatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.pending;

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 rounded-full font-medium
        ${config.bg} ${config.text}
        ${size === "sm" ? "px-2.5 py-0.5 text-xs" : "px-3 py-1 text-sm"}
      `}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}
