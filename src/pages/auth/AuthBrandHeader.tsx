import React from 'react';

interface AuthBrandHeaderProps {
  title: string;
  subtitle: string;
}

export const AuthBrandHeader: React.FC<AuthBrandHeaderProps> = ({ title, subtitle }) => {
  return (
    <div
      id="auth-brand-header-card"
      style={{
        width: '100%',
        backgroundColor: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: '24px',
        padding: '32px 20px 26px 20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
        marginBottom: '24px',
        boxSizing: 'border-box',
        transition: 'background-color var(--transition-normal), border-color var(--transition-normal)',
      }}
    >
      {/* Centered App Icon with squircle radius matching demo card */}
      <div
        style={{
          width: '72px',
          height: '72px',
          borderRadius: '22px',
          overflow: 'hidden',
          backgroundColor: 'var(--surface-variant)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 24px rgba(4, 148, 244, 0.3)',
          marginBottom: '16px',
        }}
      >
        <img
          src="/icon-192-maskable.png"
          alt="PrepMate"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/icon-192.png';
          }}
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Brand Title (e.g. PrepMate) */}
      <h1
        style={{
          fontSize: '26px',
          fontWeight: 800,
          letterSpacing: '-0.5px',
          color: 'var(--text-primary)',
          margin: '0 0 8px 0',
          lineHeight: 1.2,
        }}
      >
        {title}
      </h1>

      {/* Subtitle / Tagline */}
      <p
        style={{
          fontSize: '13px',
          color: 'var(--text-secondary)',
          lineHeight: 1.45,
          maxWidth: '280px',
          margin: 0,
          fontWeight: 400,
          opacity: 0.9,
        }}
      >
        {subtitle}
      </p>
    </div>
  );
};

