/*
   Top Navbar — Enterprise Navigation
*/

import { useState } from 'react';
import { Search, Bell, Menu, X, Activity } from 'lucide-react';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header
      className="animate-slide-down"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'var(--color-surface)',
        borderBottom: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-xs)',
      }}
    >
      <div
        style={{
          maxWidth: 1400,
          margin: '0 auto',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: 64,
        }}
      >
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              boxShadow: '0 2px 8px rgba(37, 99, 235, 0.3)',
            }}
          >
            <Activity size={20} />
          </div>
          <div>
            <div
              style={{
                fontSize: '1.05rem',
                fontWeight: 700,
                color: 'var(--color-text-primary)',
                letterSpacing: '-0.02em',
                lineHeight: 1.2,
              }}
            >
              ISO 8583
            </div>
            <div
              style={{
                fontSize: '0.7rem',
                fontWeight: 500,
                color: 'var(--color-primary-600)',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}
            >
              AI Analyzer
            </div>
          </div>
        </div>

        {/* Search — desktop */}
        <div
          className="navbar-search"
          style={{
            flex: 1,
            maxWidth: 400,
            margin: '0 32px',
          }}
        >
          <div
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Search
              size={16}
              style={{
                position: 'absolute',
                left: 12,
                color: 'var(--color-text-muted)',
              }}
            />
            <input
              type="text"
              placeholder="Search transactions, fields..."
              style={{
                width: '100%',
                padding: '8px 12px 8px 36px',
                background: 'var(--color-bg)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.875rem',
                color: 'var(--color-text-primary)',
                outline: 'none',
                transition: 'border-color 0.2s, box-shadow 0.2s',
                fontFamily: 'var(--font-sans)',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--color-primary-500)';
                e.target.style.boxShadow = '0 0 0 3px var(--color-primary-100)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--color-border)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>
        </div>

        {/* Right actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Notification bell */}
          <button
            style={{
              width: 40,
              height: 40,
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              background: 'var(--color-surface)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--color-text-muted)',
              transition: 'all 0.2s',
              position: 'relative',
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLElement).style.background = 'var(--color-surface-hover)';
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLElement).style.background = 'var(--color-surface)';
            }}
          >
            <Bell size={18} />
            <span
              style={{
                position: 'absolute',
                top: 8,
                right: 8,
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: 'var(--color-primary-600)',
                border: '2px solid var(--color-surface)',
              }}
            />
          </button>

          {/* Profile avatar */}
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--color-primary-400), var(--color-primary-700))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(37, 99, 235, 0.25)',
            }}
          >
            A
          </div>

          {/* Mobile toggle */}
          <button
            className="navbar-mobile-toggle"
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{
              display: 'none',
              width: 40,
              height: 40,
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              background: 'var(--color-surface)',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--color-text-muted)',
            }}
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .navbar-search {
            display: none !important;
          }
          .navbar-mobile-toggle {
            display: flex !important;
          }
        }
      `}</style>
    </header>
  );
}
