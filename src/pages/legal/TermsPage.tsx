import React from 'react';
import { FileText } from 'lucide-react';
import { LegalHeader } from './LegalHeader';
import { termsSections } from './termsContent';

interface TermsPageProps {
  onBack: () => void;
}

export const TermsPage: React.FC<TermsPageProps> = ({ onBack }) => {
  return (
    <div
      className="app-container"
      id="terms-of-service-page"
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--bg)',
        color: 'var(--text-primary)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <LegalHeader title="Terms of Service" onBack={onBack} backBtnId="terms-back-btn" />

      <main
        style={{
          flex: 1,
          padding: '20px 16px 48px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          lineHeight: 1.6,
        }}
      >
        {/* Banner Card */}
        <div
          style={{
            backgroundColor: '#303134',
            border: '1px solid #3C4043',
            borderRadius: '16px',
            padding: '16px',
            display: 'flex',
            gap: '14px',
            alignItems: 'flex-start',
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              backgroundColor: 'rgba(4, 148, 244, 0.16)',
              color: '#0494F4',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <FileText size={22} />
          </div>
          <div>
            <div style={{ fontSize: '15px', fontWeight: 700, color: '#FFFFFF' }}>
              Prepmate Terms of Service
            </div>
            <div style={{ fontSize: '12px', color: '#9AA0A6', marginTop: '2px' }}>
              Managed by{' '}
              <a
                href="https://www.gothwadtech.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#0494F4', fontWeight: 600, textDecoration: 'none' }}
              >
                Gothwad Tech
              </a>{' '}
              • Last updated: 2026
            </div>
          </div>
        </div>

        {/* Dynamic Sections */}
        {termsSections.map((section, idx) => (
          <section
            key={idx}
            style={{
              backgroundColor: '#2A2B2E',
              border: '1px solid #3C4043',
              borderRadius: '14px',
              padding: '16px',
            }}
          >
            <h2 style={{ fontSize: '14.5px', fontWeight: 700, color: '#FFFFFF', marginBottom: '8px' }}>
              {section.title}
            </h2>
            <p style={{ fontSize: '13px', color: '#BDC1C6', margin: 0 }}>
              {section.content}
            </p>
          </section>
        ))}
      </main>
    </div>
  );
};
