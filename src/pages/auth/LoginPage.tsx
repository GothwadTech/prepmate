import React, { useState } from 'react';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import {
  GoogleIcon,
  EyeIcon,
  EyeOffIcon,
  SunIcon,
  MoonIcon,
  BookIcon,
  MailIcon,
  LockIcon,
  FlameIcon,
  TrophyIcon,
  ShieldIcon,
  CheckCircle2Icon,
  SparklesIcon,
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
  const [rememberMe, setRememberMe] = useState(true);

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
        minHeight: '100vh',
        backgroundColor: 'var(--bg)',
        position: 'relative',
        overflowX: 'hidden',
      }}
    >
      {/* 1. Curved Hero Banner */}
      <div
        style={{
          background: 'linear-gradient(145deg, #0494F4 0%, #0277BD 100%)',
          borderBottomLeftRadius: '28px',
          borderBottomRightRadius: '28px',
          padding: '24px 20px 32px 20px',
          color: '#FFFFFF',
          position: 'relative',
          boxShadow: '0 8px 24px rgba(4, 148, 244, 0.22)',
        }}
        id="login-hero-banner"
      >
        {/* Top Header Row with Logo & Theme Toggle */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
          }}
        >
          {/* Logo Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '12px',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(8px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid rgba(255, 255, 255, 0.35)',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
              }}
            >
              <BookIcon size={22} color="#FFFFFF" />
            </div>
            <div>
              <span
                style={{
                  fontSize: '20px',
                  fontWeight: 900,
                  color: '#FFFFFF',
                  letterSpacing: '-0.4px',
                  lineHeight: 1,
                  display: 'block',
                }}
              >
                PrepMate
              </span>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  color: 'rgba(255, 255, 255, 0.85)',
                  letterSpacing: '0.4px',
                }}
              >
                NEET UG Prep Partner
              </span>
            </div>
          </div>

          {/* Theme Toggle Pill */}
          <button
            type="button"
            onClick={onToggleTheme}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            title="Toggle Light/Dark Theme"
            aria-label="Toggle theme"
            id="auth-theme-toggle-btn"
          >
            {theme === 'light' ? <MoonIcon size={17} color="#FFFFFF" /> : <SunIcon size={17} color="#FFFFFF" />}
          </button>
        </div>

        {/* Motivational Headline & NEET Target Pill */}
        <div style={{ marginTop: '8px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              borderRadius: 'var(--radius-pill)',
              backgroundColor: 'rgba(255, 255, 255, 0.18)',
              border: '1px solid rgba(255, 255, 255, 0.28)',
              fontSize: '11px',
              fontWeight: 700,
              color: '#FFFFFF',
              marginBottom: '10px',
            }}
          >
            <FlameIcon size={13} color="#FFE082" />
            <span>Target: NEET 2026 • 680+ Score</span>
          </div>

          <h1
            style={{
              fontSize: '22px',
              fontWeight: 800,
              lineHeight: 1.25,
              margin: '0 0 6px 0',
              letterSpacing: '-0.3px',
              color: '#FFFFFF',
            }}
          >
            Welcome Back, Future Doctor!
          </h1>
          <p
            style={{
              fontSize: '13px',
              color: 'rgba(255, 255, 255, 0.88)',
              margin: 0,
              lineHeight: 1.45,
            }}
          >
            Log in to continue your daily question streak, syllabus checklist, and partner study challenge.
          </p>
        </div>

        {/* NEET Metric Badges Row */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '8px',
            marginTop: '16px',
          }}
        >
          <div
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              borderRadius: '12px',
              padding: '8px 10px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              textAlign: 'center',
            }}
          >
            <span style={{ fontSize: '15px', fontWeight: 800, color: '#FFFFFF', display: 'block' }}>720</span>
            <span style={{ fontSize: '10px', color: 'rgba(255, 255, 255, 0.8)', fontWeight: 600 }}>Daily Targets</span>
          </div>
          <div
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              borderRadius: '12px',
              padding: '8px 10px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              textAlign: 'center',
            }}
          >
            <span style={{ fontSize: '15px', fontWeight: 800, color: '#FFFFFF', display: 'block' }}>🔥 100%</span>
            <span style={{ fontSize: '10px', color: 'rgba(255, 255, 255, 0.8)', fontWeight: 600 }}>Streak Shield</span>
          </div>
          <div
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              borderRadius: '12px',
              padding: '8px 10px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              textAlign: 'center',
            }}
          >
            <span style={{ fontSize: '15px', fontWeight: 800, color: '#FFFFFF', display: 'block' }}>⚔️ VS</span>
            <span style={{ fontSize: '10px', color: 'rgba(255, 255, 255, 0.8)', fontWeight: 600 }}>Partner Sync</span>
          </div>
        </div>
      </div>

      {/* 2. Main Login Form Container */}
      <div
        style={{
          flex: 1,
          padding: '0 16px 24px 16px',
          marginTop: '-16px',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
        }}
      >
        <div
          style={{
            backgroundColor: 'var(--surface)',
            borderRadius: '24px',
            border: '1px solid var(--border)',
            padding: '24px 18px',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
          }}
          id="login-form-container"
        >
          {/* Form Title & Subtitle */}
          <div style={{ marginBottom: '18px' }}>
            <h2
              style={{
                fontSize: '18px',
                fontWeight: 800,
                color: 'var(--text-primary)',
                margin: '0 0 4px 0',
              }}
            >
              Sign In to Your Account
            </h2>
            <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', margin: 0 }}>
              Enter your credentials or use fast one-tap login below
            </p>
          </div>

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
              backgroundColor: 'var(--surface)',
              color: 'var(--text-primary)',
              fontSize: '13.5px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              cursor: submitting ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
            }}
          >
            <GoogleIcon size={19} />
            <span>Continue with Google</span>
          </button>

          {/* Divider */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              margin: '18px 0 16px 0',
            }}
          >
            <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
            <span
              style={{
                fontSize: '11px',
                color: 'var(--text-tertiary)',
                fontWeight: 700,
                letterSpacing: '0.6px',
                textTransform: 'uppercase',
              }}
            >
              or sign in with email
            </span>
            <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
          </div>

          {/* Email & Password Form */}
          <form
            onSubmit={handleEmailLogin}
            style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}
          >
            {/* Email Field with Left Mail Icon */}
            <Input
              label="Aspirant Email"
              type="email"
              placeholder="e.g. aspirant@neet2026.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              id="login-email-input"
              leftIcon={<MailIcon size={16} />}
            />

            {/* Password Field with Left Lock Icon & Right Show/Hide */}
            <div>
              <div style={{ position: 'relative' }}>
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your account password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  id="login-password-input"
                  leftIcon={<LockIcon size={16} />}
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
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                </button>
              </div>

              {/* Remember Me & Forgot Password Row */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: '8px',
                }}
              >
                <label
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '12px',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                    userSelect: 'none',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    style={{
                      width: '15px',
                      height: '15px',
                      accentColor: 'var(--primary)',
                      cursor: 'pointer',
                    }}
                  />
                  <span>Remember me</span>
                </label>

                <button
                  type="button"
                  onClick={() => setIsForgotModalOpen(true)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--primary)',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    padding: '2px 0',
                  }}
                  id="forgot-password-link"
                >
                  Forgot password?
                </button>
              </div>
            </div>

            {/* Primary Sign In Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isFullWidth
              disabled={submitting}
              id="login-submit-btn"
              style={{
                height: '46px',
                fontWeight: 800,
                fontSize: '14.5px',
                marginTop: '4px',
                borderRadius: 'var(--radius-pill)',
                boxShadow: '0 4px 14px rgba(4, 148, 244, 0.35)',
              }}
            >
              {submitting ? 'Authenticating...' : 'Sign In'}
            </Button>
          </form>

          {/* Quick 1-Click Demo Login Box */}
          <div
            style={{
              marginTop: '16px',
              padding: '12px',
              borderRadius: '16px',
              backgroundColor: 'var(--surface-variant)',
              border: '1px dashed var(--border)',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <SparklesIcon size={15} color="var(--primary)" />
                <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-primary)' }}>
                  Quick Aspirant Test Login
                </span>
              </div>
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  backgroundColor: 'var(--primary-container)',
                  color: 'var(--primary)',
                  padding: '2px 6px',
                  borderRadius: '6px',
                }}
              >
                1-Tap
              </span>
            </div>

            <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: 0 }}>
              Testing without typing? Instant demo account access with pre-filled mock NEET progress.
            </p>

            <button
              type="button"
              onClick={handleQuickDemoLogin}
              disabled={submitting}
              id="quick-demo-login-btn"
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: 'var(--radius-pill)',
                backgroundColor: 'var(--surface)',
                border: '1px solid var(--border)',
                color: 'var(--primary)',
                fontSize: '12px',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                transition: 'all 0.2s ease',
              }}
            >
              ⚡ Enter as Demo Aspirant (AIIMS Aim)
            </button>
          </div>

          {/* Footer Link: Sign Up */}
          <div
            style={{
              textAlign: 'center',
              marginTop: '18px',
              fontSize: '13px',
              color: 'var(--text-secondary)',
            }}
          >
            New to PrepMate?{' '}
            <button
              type="button"
              onClick={onNavigateToSignup}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--primary)',
                fontWeight: 800,
                cursor: 'pointer',
                fontSize: '13px',
                textDecoration: 'underline',
                textUnderlineOffset: '2px',
              }}
              id="navigate-to-signup-btn"
            >
              Create Account
            </button>
          </div>
        </div>

        {/* Bottom Trust Indicators */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '14px',
            marginTop: '18px',
            fontSize: '11px',
            color: 'var(--text-tertiary)',
            flexWrap: 'wrap',
          }}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <ShieldIcon size={12} color="var(--primary)" /> 100% Private & Secure
          </span>
          <span>•</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <CheckCircle2Icon size={12} color="var(--success)" /> Offline-First Sync
          </span>
          <span>•</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <TrophyIcon size={12} color="var(--flame)" /> NTA 2026 Syllabus
          </span>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={isForgotModalOpen}
        onClose={() => setIsForgotModalOpen(false)}
        defaultEmail={email}
      />
    </div>
  );
};
