/* ============================================
   Section 4 — Human Readable Explanation
   Large card with AI-generated analysis explanation
   ============================================ */

import { useAnalysisStore } from '../../store/analysisStore';
import { CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';

export default function ExplanationSection() {
  const result = useAnalysisStore((s) => s.result);

  if (!result?.explanation) return null;

  const { explanation } = result;

  const statusIcons: Record<string, React.ReactNode> = {
    Success: <CheckCircle2 size={18} color="var(--color-success)" />,
    Declined: <XCircle size={18} color="var(--color-error)" />,
    Unknown: <AlertTriangle size={18} color="var(--color-warning)" />,
  };

  const statusColors: Record<string, { color: string; bg: string }> = {
    Success: { color: 'var(--color-success)', bg: 'var(--color-success-light)' },
    Declined: { color: 'var(--color-error)', bg: 'var(--color-error-light)' },
    Unknown: { color: 'var(--color-warning)', bg: 'var(--color-warning-light)' },
  };

  const sc = statusColors[explanation.status] || statusColors.Unknown;

  return (
    <section className="animate-fade-in" style={{ marginBottom: 'var(--spacing-section)' }}>
      <h2 className="section-title">Human Readable Explanation</h2>
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {/* Header bar */}
        <div
          style={{
            padding: '16px 24px',
            borderBottom: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {statusIcons[explanation.status]}
            <div>
              <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                {explanation.transaction_type}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                AI-generated transaction analysis
              </div>
            </div>
          </div>
          <span
            style={{
              padding: '4px 12px',
              borderRadius: 20,
              fontSize: '0.8rem',
              fontWeight: 600,
              color: sc.color,
              background: sc.bg,
            }}
          >
            {explanation.status}
          </span>
        </div>

        {/* Summary fields */}
        <div
          style={{
            padding: '16px 24px',
            borderBottom: '1px solid var(--color-border-light)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: 16,
            background: 'var(--color-bg)',
          }}
        >
          <div>
            <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--color-text-muted)', letterSpacing: '0.05em', marginBottom: 4 }}>
              Transaction Type
            </div>
            <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
              {explanation.transaction_type}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--color-text-muted)', letterSpacing: '0.05em', marginBottom: 4 }}>
              Response Code
            </div>
            <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
              {explanation.response_code || '—'}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--color-text-muted)', letterSpacing: '0.05em', marginBottom: 4 }}>
              STAN
            </div>
            <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
              {explanation.stan || '—'}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--color-text-muted)', letterSpacing: '0.05em', marginBottom: 4 }}>
              RRN
            </div>
            <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
              {explanation.rrn || '—'}
            </div>
          </div>
        </div>

        {/* Explanation text */}
        <div style={{ padding: 24 }}>
          <div
            style={{
              fontSize: '0.875rem',
              color: 'var(--color-text-secondary)',
              lineHeight: 1.8,
              whiteSpace: 'pre-line',
            }}
          >
            {explanation.explanation_text}
          </div>
        </div>
      </div>
    </section>
  );
}
