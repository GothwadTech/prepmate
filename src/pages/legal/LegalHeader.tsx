import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface LegalHeaderProps {
  title: string;
  onBack: () => void;
  backBtnId: string;
}

export const LegalHeader: React.FC<LegalHeaderProps> = ({ title, onBack, backBtnId }) => {
  return (
    <header
      className="app-header"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        height: '54px',
        backgroundColor: 'var(--header-bg)',
        borderBottom: '1px solid var(--header-border)',
        borderBottomLeftRadius: 'var(--header-radius)',
        borderBottomRightRadius: 'var(--header-radius)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        boxShadow: 'var(--header-shadow)',
        transition: 'background-color var(--transition-normal), border-color var(--transition-normal)',
      }}
    >
      <button
        type="button"
        onClick={onBack}
        id={backBtnId}
        aria-label="Go back"
        style={{
          width: '38px',
          height: '38px',
          borderRadius: '50%',
          backgroundColor: 'var(--header-btn-bg)',
          border: '1px solid var(--header-btn-border)',
          color: 'var(--header-text)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
        }}
      >
        <ArrowLeft size={20} color="var(--header-text)" />
      </button>

      <h1
        style={{
          fontSize: '17px',
          fontWeight: 700,
          color: 'var(--header-text)',
          margin: 0,
          letterSpacing: '-0.2px',
        }}
      >
        {title}
      </h1>

      <div style={{ width: '38px' }} />
    </header>
  );
};
