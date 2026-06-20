/* ============================================
   Section 6 — Raw Log Viewer
   Monospace code viewer with copy, expand/collapse
   ============================================ */

import { useState, useRef } from 'react';
import { Copy, Check, Maximize2, Minimize2 } from 'lucide-react';
import { useAnalysisStore } from '../../store/analysisStore';

export default function RawLogViewerSection() {
  const result = useAnalysisStore((s) => s.result);
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const codeRef = useRef<HTMLPreElement>(null);

  if (!result?.raw_log) return null;

  const rawLog = result.raw_log;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(rawLog);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = rawLog;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Syntax highlight ISO fields
  const highlightedLines = rawLog.split('\n').map((line, i) => {
    // Highlight MTI and DE field lines
    const match = line.match(/^(\s*)(MTI|DE[-_]?\d+|FIELD[-_]?\d+|BITMAP)(\s*[:=]\s*)(.*)/i);
    if (match) {
      return (
        <span key={i}>
          {match[1]}
          <span className="keyword">{match[2]}</span>
          <span className="separator">{match[3]}</span>
          <span className="value">{match[4]}</span>
          {'\n'}
        </span>
      );
    }

    // Separator lines
    if (line.match(/^[-=]{3,}/)) {
      return (
        <span key={i}>
          <span className="separator">{line}</span>
          {'\n'}
        </span>
      );
    }

    // Comment lines
    if (line.match(/^\s*[#\/\/]/)) {
      return (
        <span key={i}>
          <span style={{ color: 'var(--color-text-light)' }}>{line}</span>
          {'\n'}
        </span>
      );
    }

    return <span key={i}>{line}{'\n'}</span>;
  });

  return (
    <section className="animate-fade-in" style={{ marginBottom: 'var(--spacing-section)' }}>
      <h2 className="section-title">Raw Log Viewer</h2>
      <div className="card" style={{ overflow: 'hidden' }}>
        {/* Toolbar */}
        <div
          style={{
            padding: '10px 16px',
            borderBottom: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--color-bg)',
          }}
        >
          <span
            style={{
              fontSize: '0.75rem',
              color: 'var(--color-text-muted)',
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            {result.file_info?.name || 'log'}
          </span>
          <div style={{ display: 'flex', gap: 4 }}>
            <button
              onClick={handleCopy}
              title="Copy to clipboard"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                padding: '4px 10px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-border)',
                background: 'var(--color-surface)',
                color: copied ? 'var(--color-success)' : 'var(--color-text-muted)',
                cursor: 'pointer',
                fontSize: '0.75rem',
                fontFamily: 'var(--font-sans)',
                transition: 'all 0.2s',
              }}
            >
              {copied ? <Check size={13} /> : <Copy size={13} />}
              {copied ? 'Copied' : 'Copy'}
            </button>
            <button
              onClick={() => setExpanded(!expanded)}
              title={expanded ? 'Collapse' : 'Expand'}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                padding: '4px 10px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-border)',
                background: 'var(--color-surface)',
                color: 'var(--color-text-muted)',
                cursor: 'pointer',
                fontSize: '0.75rem',
                fontFamily: 'var(--font-sans)',
                transition: 'all 0.2s',
              }}
            >
              {expanded ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
              {expanded ? 'Collapse' : 'Expand'}
            </button>
          </div>
        </div>

        {/* Code viewer */}
        <pre
          ref={codeRef}
          className="code-block"
          style={{
            margin: 0,
            borderRadius: 0,
            border: 'none',
            maxHeight: expanded ? 'none' : 320,
            overflowY: 'auto',
            transition: 'max-height 0.3s ease',
          }}
        >
          {highlightedLines}
        </pre>
      </div>
    </section>
  );
}
