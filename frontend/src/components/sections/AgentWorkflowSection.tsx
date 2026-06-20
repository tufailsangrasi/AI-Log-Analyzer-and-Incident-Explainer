/* ============================================
   Section 3 — Agent Workflow
   Vertical pipeline showing 6 agent stages
   ============================================ */

import { CheckCircle2, XCircle, Loader2, Clock } from 'lucide-react';
import { useAnalysisStore } from '../../store/analysisStore';
import type { AgentStage } from '../../types';

const statusConfig = {
  pending: {
    color: 'var(--color-text-muted)',
    bg: 'var(--color-bg)',
    borderColor: 'var(--color-border)',
    icon: <Clock size={16} />,
  },
  running: {
    color: 'var(--color-primary-600)',
    bg: 'var(--color-primary-50)',
    borderColor: 'var(--color-primary-300)',
    icon: <Loader2 size={16} className="animate-spin" />,
  },
  completed: {
    color: 'var(--color-success)',
    bg: 'var(--color-success-light)',
    borderColor: '#86EFAC',
    icon: <CheckCircle2 size={16} />,
  },
  failed: {
    color: 'var(--color-error)',
    bg: 'var(--color-error-light)',
    borderColor: '#FCA5A5',
    icon: <XCircle size={16} />,
  },
};

function AgentStageRow({ agent, index, isLast }: { agent: AgentStage; index: number; isLast: boolean }) {
  const config = statusConfig[agent.status] || statusConfig.pending;

  return (
    <div
      className={`animate-fade-in delay-${index + 1}`}
      style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}
    >
      {/* Timeline */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 32 }}>
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: config.bg,
            border: `2px solid ${config.borderColor}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: config.color,
            transition: 'all 0.3s ease',
          }}
        >
          {config.icon}
        </div>
        {!isLast && (
          <div
            style={{
              width: 2,
              height: 32,
              background: agent.status === 'completed' ? 'var(--color-success)' : 'var(--color-border)',
              transition: 'background 0.3s ease',
            }}
          />
        )}
      </div>

      {/* Content */}
      <div style={{ paddingBottom: isLast ? 0 : 16, flex: 1, minWidth: 0 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 2,
            flexWrap: 'wrap',
          }}
        >
          <span
            style={{
              fontSize: '0.875rem',
              fontWeight: 500,
              color: 'var(--color-text-primary)',
            }}
          >
            {agent.name}
          </span>
          <span
            style={{
              fontSize: '0.7rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              padding: '2px 8px',
              borderRadius: 20,
              background: config.bg,
              color: config.color,
            }}
          >
            {agent.status}
          </span>
        </div>
        {agent.error && (
          <div
            style={{
              fontSize: '0.8rem',
              color: 'var(--color-error)',
              marginTop: 4,
            }}
          >
            {agent.error}
          </div>
        )}
      </div>
    </div>
  );
}

export default function AgentWorkflowSection() {
  const result = useAnalysisStore((s) => s.result);
  const uploadStatus = useAnalysisStore((s) => s.uploadStatus);

  // Show placeholder during upload
  const defaultAgents: AgentStage[] = [
    { name: 'Validation Agent', status: 'pending', error: '' },
    { name: 'ISO Parser Agent', status: 'pending', error: '' },
    { name: 'Field Extraction Agent', status: 'pending', error: '' },
    { name: 'Transaction Identification Agent', status: 'pending', error: '' },
    { name: 'Explanation Agent', status: 'pending', error: '' },
    { name: 'Database Storage Agent', status: 'pending', error: '' },
  ];

  const agents = result?.agents || (uploadStatus === 'uploading' ? defaultAgents.map((a, i) => ({
    ...a,
    status: i === 0 ? 'running' as const : 'pending' as const,
  })) : null);

  if (!agents) return null;

  return (
    <section style={{ marginBottom: 'var(--spacing-section)' }}>
      <h2 className="section-title">Agent Workflow</h2>
      <div className="card" style={{ padding: 24 }}>
        {agents.map((agent, index) => (
          <AgentStageRow
            key={agent.name}
            agent={agent}
            index={index}
            isLast={index === agents.length - 1}
          />
        ))}
      </div>
    </section>
  );
}
