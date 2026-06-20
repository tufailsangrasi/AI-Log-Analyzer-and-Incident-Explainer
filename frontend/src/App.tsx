/* ============================================
   ISO 8583 AI Analyzer — App Entry
   ============================================ */

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MainLayout from './components/layouts/MainLayout';
import LogUploadSection from './components/sections/LogUploadSection';
import TransactionSummarySection from './components/sections/TransactionSummarySection';
import AgentWorkflowSection from './components/sections/AgentWorkflowSection';
import ExplanationSection from './components/sections/ExplanationSection';
import IsoFieldTableSection from './components/sections/IsoFieldTableSection';
import RawLogViewerSection from './components/sections/RawLogViewerSection';
import DatabaseStatusSection from './components/sections/DatabaseStatusSection';
import { useAnalysisStore } from './store/analysisStore';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function HomeDashboard() {
  const uploadStatus = useAnalysisStore((s) => s.uploadStatus);
  const result = useAnalysisStore((s) => s.result);

  return (
    <MainLayout>


      {/* Section 1 — Log Upload */}
      <LogUploadSection />

      {/* Section 2 — Transaction Summary */}
      <TransactionSummarySection />

      {/* Section 3 — Agent Workflow */}
      <AgentWorkflowSection />

      {/* Section 4 — Human Readable Explanation */}
      <ExplanationSection />

      {/* Section 5 — ISO Field Table */}
      <IsoFieldTableSection />

      {/* Two-column layout for bottom sections on desktop */}
      {result && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
            gap: 24,
          }}
        >
          {/* Section 6 — Raw Log Viewer */}
          <RawLogViewerSection />

          {/* Section 7 — Database Status */}
          <DatabaseStatusSection />
        </div>
      )}

      {/* Empty state */}
      {uploadStatus === 'idle' && (
        <div
          className="animate-fade-in"
          style={{
            textAlign: 'center',
            padding: '64px 24px',
            color: 'var(--color-text-muted)',
          }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: 'var(--color-primary-50)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
            }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary-400)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="12" y1="18" x2="12" y2="12" />
              <line x1="9" y1="15" x2="15" y2="15" />
            </svg>
          </div>
          <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 4 }}>
            No log file uploaded
          </div>
          <div style={{ fontSize: '0.875rem' }}>
            Click "Upload Log" to start analyzing an ISO 8583 log file
          </div>
        </div>
      )}
    </MainLayout>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <HomeDashboard />
    </QueryClientProvider>
  );
}
