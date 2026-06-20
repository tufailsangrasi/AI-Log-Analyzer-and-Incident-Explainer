
// Main Layout — Single-page wrapper

import type { ReactNode } from 'react';
import Navbar from './Navbar';

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
      <Navbar />
      <main
        style={{
          maxWidth: 1400,
          margin: '0 auto',
          padding: '32px 24px 64px',
        }}
      >
        {children}
      </main>
    </div>
  );
}
