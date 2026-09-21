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
        backgroundColor: '#202124',
        borderBottom: '1px solid #3C4043',
        borderBottomLeftRadius: '18px',
        borderBottomRightRadius: '18px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        boxShadow: '0 3px 12px rgba(0, 0, 0, 0.25)',
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
          backgroundColor: '#303134',
          border: '1px solid #3C4043',
          color: '#E8EAED',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
        }}
      >
        <ArrowLeft size={20} />
      </button>

      <h1
        style={{
          fontSize: '17px',
          fontWeight: 700,
          color: '#FFFFFF',
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
