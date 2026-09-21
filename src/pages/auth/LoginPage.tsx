import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { AppTheme } from '../../types';
import { formatAuthError, formatResetError } from './authErrorUtils';
import { LoginForm } from './LoginForm';
import { ForgotPasswordView } from './ForgotPasswordView';
import { AuthBrandingCard } from './AuthBrandingCard';
import { AuthBrandHeader } from './AuthBrandHeader';

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
  theme,
  onToggleTheme,
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
      {/* Top Bar with Cancel button (only in forgot password mode) */}
      {isForgotPassword && (
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
            onClick={() => {
              setIsForgotPassword(false);
              setError('');
              setSuccess(false);
            }}
            id="login-cancel-btn"
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
      )}

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
        {/* Brand Header Card */}
        <AuthBrandHeader
          title={isForgotPassword ? 'Reset Password' : 'PrepMate'}
          subtitle={
            isForgotPassword
              ? 'Reset password to access your account securely.'
              : 'Your dedicated NEET UG study partner and daily progress tracker.'
          }
        />

        {/* Auth Switcher Tabs */}
        {!isForgotPassword && (
          <div
            style={{
              width: '100%',
              display: 'flex',
              gap: '12px',
              marginBottom: '20px',
              padding: '0',
              boxSizing: 'border-box',
            }}
          >
            <button
              type="button"
              style={{
                flex: 1,
                padding: '12px 0',
                fontSize: '13px',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.8px',
                borderRadius: '14px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: 'var(--primary)',
                color: '#FFFFFF',
                boxShadow: '0 4px 14px rgba(4, 148, 244, 0.35)',
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
                padding: '12px 0',
                fontSize: '13px',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.8px',
                borderRadius: '14px',
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
