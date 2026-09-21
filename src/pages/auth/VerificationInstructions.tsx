import React from 'react';
import { Mail } from 'lucide-react';

interface VerificationInstructionsProps {
  email: string;
}

export const VerificationInstructions: React.FC<VerificationInstructionsProps> = ({ email }) => {
  return (
    <div
      style={{
        backgroundColor: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: '16px',
        padding: '16px',
        width: '100%',
        boxSizing: 'border-box',
        marginBottom: '16px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
        <Mail size={16} color="var(--primary)" />
        <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
          Sent to:
        </span>
        <span
          style={{
            fontSize: '13px',
            fontWeight: 800,
            color: 'var(--primary)',
            wordBreak: 'break-all',
          }}
        >
          {email || 'your email'}
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={stepRowStyle}>
          <span style={stepNumStyle}>1</span>
          <span style={stepTextStyle}>Open your email inbox or check your spam/junk folder.</span>
        </div>
        <div style={stepRowStyle}>
          <span style={stepNumStyle}>2</span>
          <span style={stepTextStyle}>Click the confirmation link sent by Prepmate / Firebase Auth.</span>
        </div>
        <div style={stepRowStyle}>
          <span style={stepNumStyle}>3</span>
          <span style={stepTextStyle}>Return here and tap &quot;I Have Verified My Email&quot; to sign in.</span>
        </div>
      </div>
    </div>
  );
};

const stepRowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: '10px',
};

const stepNumStyle: React.CSSProperties = {
  width: '20px',
  height: '20px',
  borderRadius: '50%',
  backgroundColor: 'rgba(4, 148, 244, 0.15)',
  color: 'var(--primary)',
  fontSize: '11px',
  fontWeight: 800,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  marginTop: '1px',
};

const stepTextStyle: React.CSSProperties = {
  fontSize: '12.5px',
  color: 'var(--text-secondary)',
  lineHeight: 1.45,
};
