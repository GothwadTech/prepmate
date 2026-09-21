import React from 'react';
import { CheckCircle2, RotateCw, ArrowLeft } from 'lucide-react';

interface VerificationActionButtonsProps {
  resending: boolean;
  resendCooldown: number;
  onResend: () => void;
  onVerifiedContinue: () => void;
  onBackToLogin: () => void;
}

export const VerificationActionButtons: React.FC<VerificationActionButtonsProps> = ({
  resending,
  resendCooldown,
  onResend,
  onVerifiedContinue,
  onBackToLogin,
}) => {
  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {/* Primary Continue Button */}
      <button
        type="button"
        onClick={onVerifiedContinue}
        style={{
          width: '100%',
          padding: '14px 20px',
          backgroundColor: 'var(--primary)',
          color: '#FFFFFF',
          fontSize: '14px',
          fontWeight: 800,
          borderRadius: '14px',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          boxShadow: '0 4px 14px rgba(4, 148, 244, 0.32)',
          transition: 'all 0.2s ease',
        }}
      >
        <CheckCircle2 size={18} />
        <span>I Have Verified My Email</span>
      </button>

      {/* Resend Link Button */}
      <button
        type="button"
        disabled={resendCooldown > 0 || resending}
        onClick={onResend}
        style={{
          width: '100%',
          padding: '12px 18px',
          backgroundColor: 'var(--surface-variant)',
          color: resendCooldown > 0 ? 'var(--text-tertiary)' : 'var(--text-primary)',
          fontSize: '13px',
          fontWeight: 700,
          borderRadius: '14px',
          border: '1px solid var(--border)',
          cursor: resendCooldown > 0 || resending ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          transition: 'all 0.2s ease',
        }}
      >
        <RotateCw size={15} className={resending ? 'animate-spin' : ''} />
        <span>
          {resending
            ? 'Resending Link...'
            : resendCooldown > 0
            ? `Resend Email (${resendCooldown}s)`
            : 'Resend Verification Link'}
        </span>
      </button>

      {/* Back to Sign in */}
      <button
        type="button"
        onClick={onBackToLogin}
        style={{
          width: '100%',
          padding: '10px',
          background: 'transparent',
          color: 'var(--text-secondary)',
          fontSize: '13px',
          fontWeight: 600,
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
        }}
      >
        <ArrowLeft size={16} />
        <span>Return to Sign In</span>
      </button>
    </div>
  );
};
