import React from 'react';

interface AuthBrandingCardProps {
  onOpenTerms?: () => void;
  onOpenPrivacy?: () => void;
}

export const AuthBrandingCard: React.FC<AuthBrandingCardProps> = ({
  onOpenTerms,
  onOpenPrivacy,
}) => {
  return (
    <div
      style={{
        width: '100%',
        backgroundColor: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: '18px',
        padding: '18px 16px',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: '16px',
        gap: '12px',
        boxShadow: '0 1px 4px rgba(0, 0, 0, 0.04)',
        boxSizing: 'border-box',
      }}
    >
      <p
        style={{
          fontSize: '12.5px',
          color: 'var(--text-secondary)',
          lineHeight: 1.45,
          margin: 0,
          maxWidth: '340px',
          fontWeight: 500,
          opacity: 0.9,
        }}
      >
        By using <strong style={{ color: 'var(--primary)', fontWeight: 700 }}>Prepmate</strong>, you agree to our{' '}
        <button
          type="button"
          onClick={onOpenTerms}
          style={{
            background: 'none',
            border: 'none',
            padding: 0,
            color: 'var(--primary)',
            fontWeight: 700,
            cursor: 'pointer',
            fontSize: '12.5px',
            textDecoration: 'underline',
          }}
        >
          Terms of Service
        </button>{' '}
        &amp;{' '}
        <button
          type="button"
          onClick={onOpenPrivacy}
          style={{
            background: 'none',
            border: 'none',
            padding: 0,
            color: 'var(--primary)',
            fontWeight: 700,
            cursor: 'pointer',
            fontSize: '12.5px',
            textDecoration: 'underline',
          }}
        >
          Privacy Policy
        </button>
        .
      </p>

      <div
        style={{
          width: '100%',
          height: '1px',
          backgroundColor: 'var(--border)',
          opacity: 0.6,
        }}
      />

      <div style={{ maxWidth: '340px' }}>
        <span
          style={{
            fontSize: '12.5px',
            fontWeight: 500,
            color: 'var(--text-secondary)',
            opacity: 0.9,
            display: 'block',
            lineHeight: 1.45,
          }}
        >
          <strong style={{ color: 'var(--primary)', fontWeight: 700 }}>Prepmate</strong> is proudly developed and managed by{' '}
          <a
            href="https://www.gothwadtech.com"
            target="_blank"
            rel="noopener noreferrer"
            id="login-gothwad-tech-link"
            style={{
              color: 'var(--primary)',
              fontWeight: 700,
              textDecoration: 'underline',
              cursor: 'pointer',
            }}
          >
            Gothwad Tech
          </a>{' '}
          in support of India&apos;s Atmanirbhar Bharat initiative.
        </span>
      </div>
    </div>
  );
};
