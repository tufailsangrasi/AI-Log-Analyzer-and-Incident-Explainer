import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { FileText } from "lucide-react";
import type { UploadEntry } from "@/types";

interface UploadHistoryProps {
  uploads: UploadEntry[];
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function UploadHistory({ uploads }: UploadHistoryProps) {
  return (
    <Card className="animate-fade-in delay-2">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-text-primary">
          Upload History
        </h3>
        <p className="text-xs text-text-muted mt-0.5">
          Previously uploaded log files
        </p>
      </div>

      <div className="space-y-2">
        {uploads.map((upload, i) => (
          <div
            key={upload.id}
            className={`
              flex items-center gap-4 p-3 rounded-[10px] border border-border-subtle
              hover:bg-surface-hover hover:border-border transition-all duration-200
              animate-fade-in
            `}
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className="p-2 rounded-[8px] bg-secondary">
              <FileText size={18} className="text-text-muted" />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text-primary truncate">
                {upload.fileName}
              </p>
              <p className="text-xs text-text-muted">
                {formatFileSize(upload.fileSize)} • {formatDate(upload.uploadedAt)}
              </p>
            </div>

            <div className="text-right flex-shrink-0">
              <StatusBadge status={upload.status} />
              {upload.status === "completed" && (
                <p className="text-[10px] text-text-muted mt-1">
                  {upload.transactionsParsed.toLocaleString()} parsed
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
