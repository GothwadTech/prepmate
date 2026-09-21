import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { AppTheme } from '../../types';
import { formatAuthError, formatResetError } from './authErrorUtils';
import { LoginForm } from './LoginForm';
import { ForgotPasswordView } from './ForgotPasswordView';
import { AuthBrandingCard } from './AuthBrandingCard';

interface LoginPageProps {
  onNavigateToSignup: () => void;
  onNavigateToVerification?: (email: string, password?: string) => void;
  onOpenTerms?: () => void;
  onOpenPrivacy?: () => void;
  prefilledIdentifier?: string;
  prefilledPassword?: string;
  theme?: AppTheme;
  onToggleTheme?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onNavigateToSignup,
  onNavigateToVerification,
  onOpenTerms,
  onOpenPrivacy,
  prefilledIdentifier = '',
  prefilledPassword = '',
}) => {
  const { signIn, resetPassword } = useAuth();
  const [identifier, setIdentifier] = useState(prefilledIdentifier);
  const [password, setPassword] = useState(prefilledPassword);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  const [resetSentToEmail, setResetSentToEmail] = useState('');

  // Sync prefilled credentials if props update
  useEffect(() => {
    if (prefilledIdentifier) setIdentifier(prefilledIdentifier);
    if (prefilledPassword) setPassword(prefilledPassword);
  }, [prefilledIdentifier, prefilledPassword]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || password.length < 6) return;
    setLoading(true);
    setError('');

    try {
      await signIn(identifier.trim(), password);
    } catch (err: any) {
      setError(formatAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) return;
    setLoading(true);
    setError('');
    setSuccess(false);
    setResetSentToEmail('');

    try {
      const res = await resetPassword(identifier.trim());
      if (res?.email) {
        setResetSentToEmail(res.email);
      }
      setSuccess(true);
    } catch (err: any) {
      setError(formatResetError(err));
    } finally {
      setLoading(false);
    }
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
          padding: '40px 20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          boxSizing: 'border-box',
        }}
      >
        {/* Brand Header */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            marginBottom: '28px',
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, var(--primary) 0%, #0070BA 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              boxShadow: '0 8px 24px rgba(4, 148, 244, 0.35)',
              marginBottom: '16px',
            }}
          >
            <span style={{ fontSize: '30px' }}>🩺</span>
          </div>

          <h1
            style={{
              fontSize: '24px',
              fontWeight: 900,
              letterSpacing: '-0.5px',
              color: 'var(--text-primary)',
              margin: '0 0 6px 0',
            }}
          >
            {isForgotPassword ? 'Reset Password' : 'NEET Aspirant Portal'}
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
            {isForgotPassword
              ? 'Reset password to access your account securely.'
              : 'Your dedicated NEET UG study partner and daily progress tracker.'}
          </p>
        </div>

        {/* Auth Switcher Tabs */}
        {!isForgotPassword && (
          <div
            style={{
              width: '100%',
              display: 'flex',
              gap: '8px',
              marginBottom: '20px',
              padding: '4px',
              backgroundColor: 'var(--surface-variant)',
              borderRadius: '14px',
              border: '1px solid var(--border)',
              boxSizing: 'border-box',
            }}
          >
            <button
              type="button"
              style={{
                flex: 1,
                padding: '10px 0',
                fontSize: '12px',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.8px',
                borderRadius: '10px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: 'var(--primary)',
                color: '#FFFFFF',
                boxShadow: '0 2px 8px rgba(4, 148, 244, 0.28)',
                transition: 'all 0.2s ease',
              }}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={onNavigateToSignup}
              style={{
                flex: 1,
                padding: '10px 0',
                fontSize: '12px',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.8px',
                borderRadius: '10px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: 'transparent',
                color: 'var(--text-secondary)',
                transition: 'all 0.2s ease',
              }}
            >
              Sign Up
            </button>
          </div>
        )}

        {/* Main Form: Sign-in or Forgot Password */}
        {isForgotPassword ? (
          <ForgotPasswordView
            identifier={identifier}
            setIdentifier={setIdentifier}
            loading={loading}
            error={error}
            success={success}
            resetSentToEmail={resetSentToEmail}
            onSubmit={handleResetPassword}
            onBackToLogin={() => {
              setIsForgotPassword(false);
              setSuccess(false);
              setError('');
            }}
          />
        ) : (
          <LoginForm
            identifier={identifier}
            setIdentifier={setIdentifier}
            password={password}
            setPassword={setPassword}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            rememberMe={rememberMe}
            setRememberMe={setRememberMe}
            loading={loading}
            error={error}
            onSubmit={handleLogin}
            onForgotPassword={() => {
              setIsForgotPassword(true);
              setSuccess(false);
              setError('');
            }}
            onNavigateToVerification={onNavigateToVerification}
          />
        )}

        {/* Terms and Gothwad Tech Branding Footer */}
        {!isForgotPassword && (
          <AuthBrandingCard
            onOpenTerms={onOpenTerms}
            onOpenPrivacy={onOpenPrivacy}
          />
        )}
      </div>
    </div>
  );
};
