import React, { useState, useEffect } from 'react';
import { Mail } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { AppTheme } from '../../types';
import { AuthBrandingCard } from './AuthBrandingCard';
import { VerificationInstructions } from './VerificationInstructions';
import { VerificationActionButtons } from './VerificationActionButtons';

interface VerificationPageProps {
  email: string;
  password?: string;
  onNavigateToLogin: (autofillData?: { email: string; password?: string }) => void;
  onOpenTerms?: () => void;
  onOpenPrivacy?: () => void;
  theme?: AppTheme;
  onToggleTheme?: () => void;
}

export const VerificationPage: React.FC<VerificationPageProps> = ({
  email,
  password,
  onNavigateToLogin,
  onOpenTerms,
  onOpenPrivacy,
  theme,
  onToggleTheme,
}) => {
  const { resendVerification } = useAuth();
  const [resending, setResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [infoMessage, setInfoMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleResend = async () => {
    if (resendCooldown > 0 || resending) return;
    setResending(true);
    setInfoMessage('');
    setErrorMessage('');

    try {
      await resendVerification(email, password);
      setInfoMessage('Verification email resent! Please check your inbox and spam folder.');
      setResendCooldown(60);
    } catch (err: any) {
      setErrorMessage(
        err?.message?.includes('network')
          ? 'Network error. Please check your internet.'
          : 'Unable to resend email right now. Please try again in a moment.'
      );
    } finally {
      setResending(false);
    }
  };

  const handleVerifiedContinue = () => {
    onNavigateToLogin({ email, password });
  };

  return (
    <div
      style={{
        width: '100%',
        minHeight: '100vh',
        backgroundColor: 'var(--bg)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
        fontFamily: 'var(--font-family)',
        color: 'var(--text-primary)',
        boxSizing: 'border-box',
      }}
    >
      {/* Top Bar with Cancel button */}
      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          padding: '16px 20px 0 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          boxSizing: 'border-box',
          zIndex: 10,
        }}
      >
        <button
          type="button"
          onClick={() => onNavigateToLogin()}
          id="verification-cancel-btn"
          style={{
            padding: '7px 18px',
            fontSize: '11px',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.8px',
            borderRadius: '9999px',
            border: '1px solid var(--border)',
            backgroundColor: 'var(--surface)',
            color: 'var(--text-primary)',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          CANCEL
        </button>
      </div>

      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          padding: '12px 20px 40px 20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          boxSizing: 'border-box',
        }}
      >
        {/* Animated Mail Icon Card matching demo card */}
        <div
          id="verification-header-card"
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
          <div
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '22px',
              background: 'linear-gradient(135deg, var(--primary) 0%, #0070BA 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              boxShadow: '0 8px 24px rgba(4, 148, 244, 0.3)',
              marginBottom: '16px',
            }}
          >
            <Mail size={34} />
          </div>

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
            Verify Your Email
          </h1>

          <p
            style={{
              fontSize: '13px',
              color: 'var(--text-secondary)',
              textAlign: 'center',
              lineHeight: 1.45,
              margin: 0,
              maxWidth: '300px',
              fontWeight: 400,
              opacity: 0.9,
            }}
          >
            We have sent a verification link to your email address. Please verify to activate your account.
          </p>
        </div>

        {/* Feedback Messages */}
        {infoMessage && (
          <div
            style={{
              padding: '10px 14px',
              borderRadius: '12px',
              backgroundColor: 'rgba(52, 168, 83, 0.12)',
              border: '1px solid rgba(52, 168, 83, 0.3)',
              color: 'var(--success)',
              fontSize: '12.5px',
              fontWeight: 600,
              textAlign: 'center',
              width: '100%',
              boxSizing: 'border-box',
              marginBottom: '14px',
            }}
          >
            {infoMessage}
          </div>
        )}

        {errorMessage && (
          <div
            style={{
              padding: '10px 14px',
              borderRadius: '12px',
              backgroundColor: 'rgba(234, 67, 53, 0.12)',
              border: '1px solid rgba(234, 67, 53, 0.3)',
              color: 'var(--danger)',
              fontSize: '12.5px',
              fontWeight: 600,
              textAlign: 'center',
              width: '100%',
              boxSizing: 'border-box',
              marginBottom: '14px',
            }}
          >
            {errorMessage}
          </div>
        )}

        {/* Step Instructions */}
        <VerificationInstructions email={email} />

        {/* Action Buttons */}
        <VerificationActionButtons
          resending={resending}
          resendCooldown={resendCooldown}
          onResend={handleResend}
          onVerifiedContinue={handleVerifiedContinue}
          onBackToLogin={() => onNavigateToLogin({ email, password })}
        />

        {/* Legal Branding Footer */}
        <AuthBrandingCard onOpenTerms={onOpenTerms} onOpenPrivacy={onOpenPrivacy} />
      </div>
    </div>
  );
};
