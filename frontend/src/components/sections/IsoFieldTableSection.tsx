/* ============================================
   Section 5 — ISO 8583 Field Table
   Displays all extracted DE fields in a professional table
   ============================================ */

import { useAnalysisStore } from '../../store/analysisStore';
import { CheckCircle2 } from 'lucide-react';

export default function IsoFieldTableSection() {
  const result = useAnalysisStore((s) => s.result);

  if (!result?.extraction?.fields?.length) return null;

  const fields = result.extraction.fields;

  return (
    <section className="animate-fade-in" style={{ marginBottom: 'var(--spacing-section)' }}>
      <h2 className="section-title">
        ISO 8583 Field Table
        <span
          style={{
            fontSize: '0.8rem',
            fontWeight: 400,
            color: 'var(--color-text-muted)',
            marginLeft: 8,
          }}
        >
          ({fields.length} fields extracted)
        </span>
      </h2>

      <div className="card" style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '0.875rem',
            }}
          >
            <thead>
              <tr
                style={{
                  background: 'var(--color-bg)',
                  borderBottom: '1px solid var(--color-border)',
                }}
              >
                {['Field Number', 'Field Name', 'Value', 'Present'].map((header) => (
                  <th
                    key={header}
                    style={{
                      padding: '12px 16px',
                      textAlign: 'left',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: 'var(--color-text-muted)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {fields.map((field, index) => (
                <tr
                  key={field.field_number}
                  className={`animate-fade-in delay-${Math.min(index + 1, 7)}`}
                  style={{
                    borderBottom: index < fields.length - 1 ? '1px solid var(--color-border-light)' : undefined,
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = 'var(--color-surface-hover)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = 'transparent';
                  }}
                >
                  <td
                    style={{
                      padding: '12px 16px',
                      fontWeight: 600,
                      color: 'var(--color-primary-700)',
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '0.8125rem',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {field.field_number}
                  </td>
                  <td
                    style={{
                      padding: '12px 16px',
                      color: 'var(--color-text-secondary)',
                    }}
                  >
                    {field.field_name}
                  </td>
                  <td
                    style={{
                      padding: '12px 16px',
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '0.8125rem',
                      color: 'var(--color-text-primary)',
                      maxWidth: 300,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {field.value}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                        padding: '2px 10px',
                        borderRadius: 20,
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        color: 'var(--color-success)',
                        background: 'var(--color-success-light)',
                      }}
                    >
                      <CheckCircle2 size={12} />
                      Yes
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
