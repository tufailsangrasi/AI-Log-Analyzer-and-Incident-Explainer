/* ============================================
   Section 1 — Log Upload
   Single "Upload Log" button, post-upload file info
   ============================================ */

import { useRef } from 'react';
import { Upload, FileText, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { useAnalysis } from '../../hooks/useAnalysis';
import { formatFileSize, formatTimestamp } from '../../utils/formatters';

export default function LogUploadSection() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { handleUpload, selectedFile, uploadStatus, uploadTimestamp, error, reset } = useAnalysis();

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleUpload(file);
    }
    // Reset input so the same file can be re-uploaded
    e.target.value = '';
  };

  const statusConfig: Record<string, { color: string; bg: string; icon: React.ReactNode; label: string }> = {
    idle: { color: 'var(--color-text-muted)', bg: 'var(--color-bg)', icon: null, label: '' },
    uploading: {
      color: 'var(--color-primary-600)',
      bg: 'var(--color-primary-50)',
      icon: <Loader2 size={14} className="animate-spin" />,
      label: 'Analyzing...',
    },
    completed: {
      color: 'var(--color-success)',
      bg: 'var(--color-success-light)',
      icon: <CheckCircle2 size={14} />,
      label: 'Completed',
    },
    error: {
      color: 'var(--color-error)',
      bg: 'var(--color-error-light)',
      icon: <AlertCircle size={14} />,
      label: 'Failed',
    },
  };

  const currentStatus = statusConfig[uploadStatus] || statusConfig.idle;

  return (
    <section className="animate-fade-in" style={{ marginBottom: 'var(--spacing-section)' }}>
      <div className="card" style={{ padding: 24 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            flexWrap: 'wrap',
          }}
        >
          {/* Upload button */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt,.log,.csv,.iso"
            onChange={onFileSelect}
            style={{ display: 'none' }}
            id="log-upload-input"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadStatus === 'uploading'}
            id="upload-log-button"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 24px',
              background: uploadStatus === 'uploading'
                ? 'var(--color-primary-400)'
                : 'linear-gradient(135deg, #2563EB, #1D4ED8)',
              color: '#fff',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: uploadStatus === 'uploading' ? 'not-allowed' : 'pointer',
              fontFamily: 'var(--font-sans)',
              boxShadow: '0 2px 8px rgba(37, 99, 235, 0.3)',
              transition: 'all 0.2s',
              letterSpacing: '-0.01em',
            }}
          >
            {uploadStatus === 'uploading' ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Upload size={16} />
            )}
            {uploadStatus === 'uploading' ? 'Analyzing...' : 'Upload Log'}
          </button>

          {/* Reset button */}
          {uploadStatus !== 'idle' && uploadStatus !== 'uploading' && (
            <button
              onClick={reset}
              style={{
                padding: '10px 20px',
                background: 'var(--color-surface)',
                color: 'var(--color-text-secondary)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.875rem',
                fontWeight: 500,
                cursor: 'pointer',
                fontFamily: 'var(--font-sans)',
                transition: 'all 0.2s',
              }}
            >
              New Analysis
            </button>
          )}
        </div>

        {/* File info after upload */}
        {selectedFile && (
          <div
            className="animate-fade-in"
            style={{
              marginTop: 20,
              padding: 16,
              background: 'var(--color-bg)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border-light)',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              gap: 16,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <FileText size={16} color="var(--color-primary-600)" />
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: 2 }}>
                  File Name
                </div>
                <div style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text-primary)' }}>
                  {selectedFile.name}
                </div>
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: 2 }}>
                File Size
              </div>
              <div style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text-primary)' }}>
                {formatFileSize(selectedFile.size)}
              </div>
            </div>

            {uploadTimestamp && (
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: 2 }}>
                  Upload Time
                </div>
                <div style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text-primary)' }}>
                  {formatTimestamp(uploadTimestamp)}
                </div>
              </div>
            )}

            {uploadStatus !== 'idle' && (
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: 2 }}>
                  Status
                </div>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '3px 10px',
                    borderRadius: 20,
                    fontSize: '0.8rem',
                    fontWeight: 500,
                    color: currentStatus.color,
                    background: currentStatus.bg,
                  }}
                >
                  {currentStatus.icon}
                  {currentStatus.label}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Error message */}
        {error && (
          <div
            className="animate-fade-in"
            style={{
              marginTop: 12,
              padding: '10px 14px',
              background: 'var(--color-error-light)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--color-error)',
              fontSize: '0.8125rem',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <AlertCircle size={14} />
            {error}
          </div>
        )}
      </div>
    </section>
  );
}
