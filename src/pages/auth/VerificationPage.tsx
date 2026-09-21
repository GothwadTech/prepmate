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
      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          padding: '44px 20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          boxSizing: 'border-box',
        }}
      >
        {/* Animated Mail Icon Card */}
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '22px',
            background: 'linear-gradient(135deg, var(--primary) 0%, #0070BA 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            boxShadow: '0 8px 24px rgba(4, 148, 244, 0.35)',
            marginBottom: '16px',
          }}
        >
          <Mail size={32} />
        </div>

        <h1
          style={{
            fontSize: '22px',
            fontWeight: 900,
            letterSpacing: '-0.5px',
            color: 'var(--text-primary)',
            margin: '0 0 6px 0',
            textAlign: 'center',
          }}
        >
          Verify Your Email
        </h1>

        <p
          style={{
            fontSize: '13px',
            color: 'var(--text-secondary)',
            textAlign: 'center',
            lineHeight: 1.5,
            margin: '0 0 20px 0',
            maxWidth: '320px',
          }}
        >
          We have sent a verification link to your email address. Please verify to activate your account.
        </p>

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
