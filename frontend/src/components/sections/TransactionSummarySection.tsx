/* ============================================
   Section 2 — Transaction Summary
   4 enterprise cards: Response Code, STAN, RRN, Transaction Type
   No icons, no charts, no trends, no percentages.
   ============================================ */

import { useAnalysisStore } from '../../store/analysisStore';

interface SummaryCardProps {
  label: string;
  value: string;
  subtext?: string;
  delay: number;
}

function SummaryCard({ label, value, subtext, delay }: SummaryCardProps) {
  return (
    <div
      className={`card animate-fade-in-up delay-${delay}`}
      style={{ padding: '24px 20px' }}
    >
      <div
        style={{
          fontSize: '0.75rem',
          fontWeight: 500,
          color: 'var(--color-text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          marginBottom: 8,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: '1.5rem',
          fontWeight: 700,
          color: 'var(--color-text-primary)',
          letterSpacing: '-0.02em',
          lineHeight: 1.2,
          wordBreak: 'break-all',
        }}
      >
        {value || '—'}
      </div>
      {subtext && (
        <div
          style={{
            fontSize: '0.75rem',
            color: 'var(--color-text-muted)',
            marginTop: 6,
          }}
        >
          {subtext}
        </div>
      )}
    </div>
  );
}

export default function TransactionSummarySection() {
  const result = useAnalysisStore((s) => s.result);

  if (!result) return null;

  const responseMeaning = result.explanation?.response_meaning || '';
  const stan = result.explanation?.stan || '';
  const rrn = result.explanation?.rrn || '';
  const transactionType = result.identification?.transaction_type || '';

  return (
    <section style={{ marginBottom: 'var(--spacing-section)' }}>
      <h2 className="section-title">Transaction Summary</h2>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 16,
        }}
      >
        <SummaryCard
          label="Response Code"
          value={result.explanation?.response_code || '—'}
          subtext={responseMeaning}
          delay={1}
        />
        <SummaryCard
          label="STAN (DE-11)"
          value={stan || '—'}
          subtext="System Trace Audit Number"
          delay={2}
        />
        <SummaryCard
          label="RRN (DE-37)"
          value={rrn || '—'}
          subtext="Retrieval Reference Number"
          delay={3}
        />
        <SummaryCard
          label="Transaction Type"
          value={transactionType || '—'}
          subtext={result.identification?.confidence ? `Confidence: ${result.identification.confidence}` : undefined}
          delay={4}
        />
      </div>
    </section>
  );
}
