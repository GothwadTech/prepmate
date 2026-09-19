import React, { useState } from 'react';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Badge } from '../../components/common/Badge';
import {
  GoogleIcon,
  EyeIcon,
  EyeOffIcon,
  InfoIcon,
  SunIcon,
  MoonIcon,
} from '../../components/icons/SvgIcons';
import { useAuth } from '../../context/AuthContext';
import { ForgotPasswordModal } from './ForgotPasswordModal';
import { AppTheme } from '../../types';

interface LoginPageProps {
  onNavigateToSignup: () => void;
  theme: AppTheme;
  onToggleTheme: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onNavigateToSignup,
  theme,
  onToggleTheme,
}) => {
  const { signIn, signInWithGoogle, isFirebaseConfigured } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;

    setSubmitting(true);
    try {
      await signIn(email.trim(), password);
    } catch {
      // Handled by Toast in AuthContext
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setSubmitting(true);
    try {
      await signInWithGoogle();
    } catch {
      // Handled by Toast
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickDemoLogin = async () => {
    setSubmitting(true);
    try {
      await signIn('aspirant@neet2026.com', 'password123');
    } catch {
      //
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      id="login-page"
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100%',
        padding: '24px 16px',
        justifyContent: 'center',
      }}
    >
      {/* Top Header with Theme Switcher */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <img
            src="/icon-192.png"
            alt="PrepMate Logo"
            style={{ width: '32px', height: '32px', borderRadius: '8px' }}
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <div>
            <span style={{ fontSize: '18px', fontWeight: 800, color: 'var(--primary)', letterSpacing: '-0.3px' }}>
              PrepMate
            </span>
            <span style={{ fontSize: '10px', display: 'block', color: 'var(--text-tertiary)', fontWeight: 600 }}>
              by Gothwad Tech
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onToggleTheme}
          className="btn-icon"
          title="Toggle Theme"
          aria-label="Toggle theme"
          id="auth-theme-toggle-btn"
        >
          {theme === 'light' ? <MoonIcon size={18} /> : <SunIcon size={18} />}
        </button>
      </div>

      {/* Main Card */}
      <div
        style={{
          background: 'var(--bg)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border)',
          padding: '24px 20px',
          boxShadow: 'var(--shadow-sm)',
        }}
        id="login-form-container"
      >
        <div style={{ marginBottom: '20px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)' }}>
            Welcome Back!
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Sign in to track your NEET study goals and partner streak
          </p>
        </div>

        {/* Config Notification Banner */}
        {!isFirebaseConfigured && (
          <div
            style={{
              padding: '10px 12px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--primary-container)',
              color: 'var(--primary)',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '8px',
              marginBottom: '16px',
            }}
            id="firebase-env-notice"
          >
            <InfoIcon size={16} />
            <div style={{ flex: 1 }}>
              <strong>Firebase Configuration Ready:</strong> Add your Firebase keys in <code>.env</code>. You can also use 1-click Aspirant Demo sign-in below.
            </div>
          </div>
        )}

        {/* Google Sign-in Button */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={submitting}
          id="google-signin-btn"
          style={{
            width: '100%',
            height: '46px',
            borderRadius: 'var(--radius-pill)',
            border: '1px solid var(--border)',
            background: 'var(--bg)',
            color: 'var(--text-primary)',
            fontSize: '14px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            cursor: 'pointer',
            transition: 'var(--transition-fast)',
            marginBottom: '16px',
          }}
        >
          <GoogleIcon size={20} />
          <span>Continue with Google</span>
        </button>

        {/* Divider */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            margin: '14px 0',
          }}
        >
          <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
          <span style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
            or with email
          </span>
          <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
        </div>

        {/* Email & Password Form */}
        <form onSubmit={handleEmailLogin} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <Input
            label="Email Address"
            type="email"
            placeholder="e.g. aspirant@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            id="login-email-input"
          />

          <div>
            <div style={{ position: 'relative' }}>
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                id="login-password-input"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  bottom: '10px',
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-tertiary)',
                  cursor: 'pointer',
                  padding: '4px',
                }}
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '6px' }}>
              <button
                type="button"
                onClick={() => setIsForgotModalOpen(true)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--primary)',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: '2px 0',
                }}
                id="forgot-password-link"
              >
                Forgot password?
              </button>
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isFullWidth
            disabled={submitting}
            id="login-submit-btn"
          >
            {submitting ? 'Signing In...' : 'Sign In'}
          </Button>

          {/* Quick Demo Login Option */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            isFullWidth
            onClick={handleQuickDemoLogin}
            disabled={submitting}
            id="quick-demo-login-btn"
            style={{ fontSize: '12px', marginTop: '4px' }}
          >
            ⚡ Test with Demo Aspirant
          </Button>
        </form>

        {/* Footer Link */}
        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: 'var(--text-secondary)' }}>
          Don't have an account?{' '}
          <button
            type="button"
            onClick={onNavigateToSignup}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--primary)',
              fontWeight: 700,
              cursor: 'pointer',
              fontSize: '13px',
            }}
            id="navigate-to-signup-btn"
          >
            Sign Up
          </button>
        </div>
      </div>

      <ForgotPasswordModal
        isOpen={isForgotModalOpen}
        onClose={() => setIsForgotModalOpen(false)}
        defaultEmail={email}
      />
    </div>
  );
};
