"use client";

import { useState, useCallback } from "react";
import { Upload, FileText, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { uploadLogFile } from "@/services/api";
import type { UploadResponse } from "@/types";

interface FileDropzoneProps {
  onUploadComplete?: (response: UploadResponse) => void;
}

export function FileDropzone({ onUploadComplete }: FileDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<UploadResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const processFile = async (file: File) => {
    setIsUploading(true);
    setError(null);
    setUploadResult(null);
    setProgress(0);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress((p) => {
        if (p >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return p + Math.random() * 15;
      });
    }, 200);

    try {
      const result = await uploadLogFile(file);
      clearInterval(progressInterval);
      setProgress(100);
      setUploadResult(result);
      onUploadComplete?.(result);
    } catch (err) {
      clearInterval(progressInterval);
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const reset = () => {
    setUploadResult(null);
    setError(null);
    setProgress(0);
  };

  if (uploadResult) {
    return (
      <div className="bg-surface border border-success/30 rounded-[12px] p-8 text-center animate-fade-in">
        <CheckCircle2 size={48} className="text-success mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-text-primary mb-2">
          Upload Successful
        </h3>
        <p className="text-sm text-text-secondary mb-1">
          <span className="font-mono text-primary">{uploadResult.fileName}</span>
        </p>
        <div className="flex items-center justify-center gap-6 mt-4 text-sm">
          <div>
            <span className="text-text-muted">Parsed: </span>
            <span className="font-semibold text-text-primary">
              {uploadResult.transactionsParsed.toLocaleString()}
            </span>
          </div>
          <div>
            <span className="text-text-muted">Errors: </span>
            <span className="font-semibold text-error">
              {uploadResult.errorsFound.toLocaleString()}
            </span>
          </div>
        </div>
        <Button variant="secondary" className="mt-6" onClick={reset}>
          Upload Another File
        </Button>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-surface border border-error/30 rounded-[12px] p-8 text-center animate-fade-in">
        <XCircle size={48} className="text-error mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-text-primary mb-2">
          Upload Failed
        </h3>
        <p className="text-sm text-error mb-4">{error}</p>
        <Button variant="secondary" onClick={reset}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div
      className={`
        relative bg-surface border-2 border-dashed rounded-[12px] p-12 text-center
        transition-all duration-300 cursor-pointer group
        ${isDragging
          ? "border-primary bg-primary-muted"
          : "border-border hover:border-primary/40 hover:bg-surface-hover"
        }
      `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => document.getElementById("file-input")?.click()}
    >
      <input
        id="file-input"
        type="file"
        className="hidden"
        accept=".log,.txt,.csv,.iso"
        onChange={handleFileSelect}
      />

      {isUploading ? (
        <div className="animate-fade-in">
          <Loader2 size={48} className="text-primary mx-auto mb-4 animate-spin" />
          <p className="text-sm text-text-primary font-medium mb-4">
            Processing log file...
          </p>
          {/* Progress bar */}
          <div className="w-64 mx-auto bg-bg rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-300 ease-out"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
          <p className="text-xs text-text-muted mt-2">
            {Math.round(progress)}% complete
          </p>
        </div>
      ) : (
        <>
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
            {isDragging ? (
              <FileText size={28} className="text-primary" />
            ) : (
              <Upload size={28} className="text-primary" />
            )}
          </div>
          <h3 className="text-base font-semibold text-text-primary mb-1">
            {isDragging ? "Drop your file here" : "Upload ISO 8583 Log File"}
          </h3>
          <p className="text-sm text-text-muted mb-4">
            Drag and drop or click to browse. Supports .log, .txt, .csv formats
          </p>
          <Button variant="secondary" size="sm" onClick={(e) => { e.stopPropagation(); document.getElementById("file-input")?.click(); }}>
            Browse Files
          </Button>
        </>
      )}
    </div>
  );
}
