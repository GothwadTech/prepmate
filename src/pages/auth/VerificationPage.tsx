import React, { useState, useEffect } from 'react';
import { Mail, CheckCircle2, RotateCw, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { AppTheme } from '../../types';

interface VerificationPageProps {
  email: string;
  password?: string;
  onNavigateToLogin: (autofillData?: { email: string; password?: string }) => void;
  theme?: AppTheme;
  onToggleTheme?: () => void;
}

export const VerificationPage: React.FC<VerificationPageProps> = ({
  email,
  password,
  onNavigateToLogin,
}) => {
  const { resendVerification } = useAuth();
  const [resending, setResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [infoMessage, setInfoMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Handle countdown timer for resend
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
    // Navigate to login screen with email and password prefilled so user only has to tap Login
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
          padding: '32px 20px 48px 20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          boxSizing: 'border-box',
          margin: '0 auto',
        }}
      >
        {/* Header Card (Exact match with LoginPage) */}
        <div
          style={{
            width: '100%',
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: '20px',
            padding: '24px 20px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '20px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
            boxSizing: 'border-box',
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              backgroundColor: 'var(--bg)',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid var(--border)',
              overflow: 'hidden',
              marginBottom: '12px',
              boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.08)',
            }}
          >
            <img
              src="/icon-512-maskable.png"
              alt="Prepmate Logo"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transform: 'scale(1.08)',
              }}
              referrerPolicy="no-referrer"
            />
          </div>

          <h1
            style={{
              fontSize: '26px',
              fontWeight: 900,
              color: 'var(--text-primary)',
              letterSpacing: '-0.5px',
              margin: '0 0 4px 0',
              lineHeight: 1.2,
            }}
          >
            Prepmate
          </h1>

          <p
            style={{
              fontSize: '12.5px',
              color: 'var(--text-secondary)',
              lineHeight: 1.45,
              maxWidth: '280px',
              margin: 0,
              fontWeight: 500,
              opacity: 0.85,
            }}
          >
            Your dedicated NEET UG study partner and daily progress tracker.
          </p>
        </div>

        {/* Verification Status Card */}
        <div
          style={{
            width: '100%',
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: '20px',
            padding: '28px 20px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
            boxSizing: 'border-box',
            marginBottom: '16px',
          }}
        >
          {/* Email Icon with pulse effect */}
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'rgba(4, 148, 244, 0.12)',
              border: '1.5px solid rgba(4, 148, 244, 0.28)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--primary)',
              marginBottom: '16px',
            }}
          >
            <Mail size={30} strokeWidth={2.2} />
          </div>

          <h2
            style={{
              fontSize: '19px',
              fontWeight: 800,
              margin: '0 0 8px 0',
              color: 'var(--text-primary)',
              letterSpacing: '-0.3px',
            }}
          >
            Verify Your Email
          </h2>

          <p
            style={{
              fontSize: '13px',
              color: 'var(--text-secondary)',
              lineHeight: 1.5,
              margin: '0 0 14px 0',
              maxWidth: '320px',
            }}
          >
            A verification link has been sent to:
          </p>

          <div
            style={{
              maxWidth: '100%',
              padding: '10px 16px',
              backgroundColor: 'var(--surface-variant)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              fontSize: '13.5px',
              fontWeight: 700,
              color: 'var(--primary)',
              wordBreak: 'break-all',
              marginBottom: '16px',
            }}
          >
            {email || 'your registered email'}
          </div>

          <p
            style={{
              fontSize: '12.5px',
              color: 'var(--text-secondary)',
              lineHeight: 1.5,
              margin: '0 0 20px 0',
              maxWidth: '320px',
              opacity: 0.9,
            }}
          >
            Please check your inbox (or Spam/Junk folder) and click the link to verify your email. Once done, tap the button below.
          </p>

          {/* Feedback messages */}
          {infoMessage && (
            <div
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '12px',
                backgroundColor: 'rgba(15, 157, 88, 0.12)',
                border: '1px solid rgba(15, 157, 88, 0.3)',
                color: 'var(--success)',
                fontSize: '12px',
                fontWeight: 600,
                textAlign: 'center',
                marginBottom: '16px',
                boxSizing: 'border-box',
              }}
            >
              {infoMessage}
            </div>
          )}

          {errorMessage && (
            <div
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '12px',
                backgroundColor: 'rgba(234, 67, 53, 0.12)',
                border: '1px solid rgba(234, 67, 53, 0.3)',
                color: 'var(--danger)',
                fontSize: '12px',
                fontWeight: 600,
                textAlign: 'center',
                marginBottom: '16px',
                boxSizing: 'border-box',
              }}
            >
              {errorMessage}
            </div>
          )}

          {/* Main Action Button: Once verified, press to autofill and login */}
          <button
            type="button"
            onClick={handleVerifiedContinue}
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
              boxShadow: '0 3px 12px rgba(4, 148, 244, 0.32)',
              transition: 'all 0.2s ease',
              marginBottom: '12px',
              boxSizing: 'border-box',
            }}
          >
            <CheckCircle2 size={18} />
            <span>I Have Verified My Email</span>
          </button>

          {/* Resend Link button */}
          <button
            type="button"
            onClick={handleResend}
            disabled={resendCooldown > 0 || resending}
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: '12.5px',
              fontWeight: 700,
              color: resendCooldown > 0 ? 'var(--text-tertiary)' : 'var(--primary)',
              cursor: resendCooldown > 0 || resending ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 10px',
            }}
          >
            <RotateCw size={14} className={resending ? 'animate-spin' : ''} />
            <span>
              {resendCooldown > 0
                ? `Resend Link in ${resendCooldown}s`
                : resending
                ? 'Resending...'
                : 'Resend Verification Link'}
            </span>
          </button>
        </div>

        {/* Back to Login link */}
        <div style={{ textAlign: 'center', marginTop: '2px' }}>
          <button
            type="button"
            onClick={() => onNavigateToLogin({ email, password })}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-secondary)',
              fontSize: '12.5px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px',
            }}
          >
            <ArrowLeft size={14} />
            <span>Back to Sign In</span>
          </button>
        </div>

        {/* Branding & Terms Footer Card */}
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
              opacity: 0.85,
            }}
          >
            By using <strong style={{ color: 'var(--primary)', fontWeight: 700 }}>Prepmate</strong>, you agree to our Terms of Service & Privacy Policy.
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
                opacity: 0.85,
                display: 'block',
                lineHeight: 1.45,
              }}
            >
              <strong style={{ color: 'var(--primary)', fontWeight: 700 }}>Prepmate</strong> is proudly developed and managed by <strong style={{ color: 'var(--primary)', fontWeight: 700 }}>Gothwad</strong> in support of India's Atmanirbhar Bharat initiative.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
