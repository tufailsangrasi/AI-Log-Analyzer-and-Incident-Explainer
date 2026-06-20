/* ============================================
   Section 7 — Database Storage Status
   Shows database connection, record ID, fields stored
   ============================================ */

import { useAnalysisStore } from '../../store/analysisStore';
import { Database, CheckCircle2, XCircle } from 'lucide-react';
import { formatTimestamp } from '../../utils/formatters';

export default function DatabaseStatusSection() {
  const result = useAnalysisStore((s) => s.result);

  if (!result?.storage) return null;

  const { storage } = result;

  const isConnected = storage.database_status === 'Connected';

  const items = [
    {
      label: 'Database Status',
      value: storage.database_status,
      render: (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            color: isConnected ? 'var(--color-success)' : 'var(--color-error)',
            fontWeight: 600,
          }}
        >
          {isConnected ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
          {storage.database_status}
        </span>
      ),
    },
    {
      label: 'Record ID',
      value: storage.record_id,
      render: (
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.8rem',
            color: 'var(--color-text-primary)',
            wordBreak: 'break-all' as const,
          }}
        >
          {storage.record_id || '—'}
        </span>
      ),
    },
    {
      label: 'ISO Fields Stored',
      value: String(storage.fields_stored),
      render: (
        <span style={{ fontWeight: 600, color: 'var(--color-primary-700)', fontSize: '1.125rem' }}>
          {storage.fields_stored}
        </span>
      ),
    },
    {
      label: 'Storage Timestamp',
      value: storage.storage_timestamp,
      render: (
        <span style={{ fontSize: '0.875rem', color: 'var(--color-text-primary)' }}>
          {storage.storage_timestamp ? formatTimestamp(storage.storage_timestamp) : '—'}
        </span>
      ),
    },
  ];

  return (
    <section className="animate-fade-in" style={{ marginBottom: 'var(--spacing-section)' }}>
      <h2 className="section-title">Database Storage Status</h2>
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {/* Header */}
        <div
          style={{
            padding: '14px 24px',
            borderBottom: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            background: 'var(--color-bg)',
          }}
        >
          <Database size={18} color="var(--color-primary-600)" />
          <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
            PostgreSQL Storage
          </span>
          {storage.is_stored && (
            <span
              style={{
                marginLeft: 'auto',
                padding: '2px 10px',
                borderRadius: 20,
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'var(--color-success)',
                background: 'var(--color-success-light)',
              }}
            >
              Saved
            </span>
          )}
        </div>

        {/* Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 0,
          }}
        >
          {items.map((item, index) => (
            <div
              key={item.label}
              style={{
                padding: '16px 24px',
                borderRight: index < items.length - 1 ? '1px solid var(--color-border-light)' : undefined,
                borderBottom: '1px solid var(--color-border-light)',
              }}
            >
              <div
                style={{
                  fontSize: '0.7rem',
                  textTransform: 'uppercase',
                  color: 'var(--color-text-muted)',
                  letterSpacing: '0.05em',
                  marginBottom: 6,
                }}
              >
                {item.label}
              </div>
              {item.render}
            </div>
          ))}
        </div>

        {/* Errors */}
        {storage.errors && storage.errors.length > 0 && (
          <div
            style={{
              padding: '12px 24px',
              background: 'var(--color-error-light)',
              color: 'var(--color-error)',
              fontSize: '0.8125rem',
            }}
          >
            {storage.errors.join('; ')}
          </div>
        )}
      </div>
    </section>
  );
}
