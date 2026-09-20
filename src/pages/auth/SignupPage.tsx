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
  UserIcon,
  TargetIcon,
  FlameIcon,
  ShieldIcon,
  CheckCircle2Icon,
} from '../../components/icons/SvgIcons';
import { useAuth } from '../../context/AuthContext';
import { AppTheme } from '../../types';

interface SignupPageProps {
  onNavigateToLogin: () => void;
  theme: AppTheme;
  onToggleTheme: () => void;
}

export const SignupPage: React.FC<SignupPageProps> = ({
  onNavigateToLogin,
  theme,
  onToggleTheme,
}) => {
  const { signUp, signInWithGoogle, isFirebaseConfigured, showToast } = useAuth();
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [targetYear, setTargetYear] = useState('2026');
  const [targetScore, setTargetScore] = useState('680');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !username.trim() || !email.trim() || !password.trim()) {
      showToast('Please fill in all required fields.', 'error');
      return;
    }

    if (password.length < 6) {
      showToast('Password must be at least 6 characters long.', 'error');
      return;
    }

    const cleanUsername = username.trim().replace(/^@/, '').toLowerCase();
    if (!/^[a-z0-9_]{3,20}$/.test(cleanUsername)) {
      showToast('Username must be 3-20 characters (letters, numbers, underscores only).', 'error');
      return;
    }

    setSubmitting(true);
    try {
      await signUp({
        name: name.trim(),
        username: cleanUsername,
        email: email.trim(),
        password,
        targetYear,
        targetScore: parseInt(targetScore, 10) || 680,
      });
    } catch {
      // Handled by Toast in AuthContext
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignup = async () => {
    setSubmitting(true);
    try {
      await signInWithGoogle();
    } catch {
      // Handled
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      id="signup-page"
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
          padding: '24px 20px 28px 20px',
          color: '#FFFFFF',
          position: 'relative',
          boxShadow: '0 8px 24px rgba(4, 148, 244, 0.22)',
        }}
        id="signup-hero-banner"
      >
        {/* Top Header Row with Logo & Theme Toggle */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
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
            id="signup-theme-toggle-btn"
          >
            {theme === 'light' ? <MoonIcon size={17} color="#FFFFFF" /> : <SunIcon size={17} color="#FFFFFF" />}
          </button>
        </div>

        {/* Motivational Headline */}
        <div>
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
              marginBottom: '8px',
            }}
          >
            <FlameIcon size={13} color="#FFE082" />
            <span>Join 10,000+ NEET Aspirants</span>
          </div>

          <h1
            style={{
              fontSize: '21px',
              fontWeight: 800,
              lineHeight: 1.25,
              margin: '0 0 4px 0',
              letterSpacing: '-0.3px',
              color: '#FFFFFF',
            }}
          >
            Create Your Study Account
          </h1>
          <p
            style={{
              fontSize: '12.5px',
              color: 'rgba(255, 255, 255, 0.88)',
              margin: 0,
              lineHeight: 1.4,
            }}
          >
            Track daily questions, compete with study partners, and never break your streak.
          </p>
        </div>
      </div>

      {/* 2. Main Signup Form Container */}
      <div
        style={{
          flex: 1,
          padding: '0 16px 24px 16px',
          marginTop: '-16px',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
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
          id="signup-form-container"
        >
          {/* Google Sign-in Button */}
          <button
            type="button"
            onClick={handleGoogleSignup}
            disabled={submitting}
            id="google-signup-btn"
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
            <span>Sign up with Google</span>
          </button>

          {/* Divider */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              margin: '16px 0 14px 0',
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
              or fill details
            </span>
            <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
          </div>

          {/* Signup Form */}
          <form onSubmit={handleSignupSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Input
              label="Full Name"
              placeholder="e.g. Aman Sharma"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              id="signup-name-input"
              leftIcon={<UserIcon size={16} />}
            />

            <Input
              label="Unique Username"
              placeholder="e.g. aman_neet26"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              helperText="Partners will find you using @username"
              id="signup-username-input"
              leftIcon={<span style={{ fontSize: '14px', fontWeight: 800 }}>@</span>}
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="e.g. aman@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              id="signup-email-input"
              leftIcon={<MailIcon size={16} />}
            />

            {/* Target Year & Score Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div className="input-group">
                <label className="input-label" htmlFor="signup-target-year">Target NEET Year</label>
                <select
                  id="signup-target-year"
                  className="input-field"
                  value={targetYear}
                  onChange={(e) => setTargetYear(e.target.value)}
                  style={{ height: '42px', fontSize: '13px' }}
                >
                  <option value="2025">NEET 2025</option>
                  <option value="2026">NEET 2026</option>
                  <option value="2027">NEET 2027</option>
                </select>
              </div>

              <Input
                label="Target Score (720)"
                type="number"
                min="400"
                max="720"
                value={targetScore}
                onChange={(e) => setTargetScore(e.target.value)}
                required
                id="signup-target-score"
                leftIcon={<TargetIcon size={15} />}
              />
            </div>

            {/* Password */}
            <div>
              <div style={{ position: 'relative' }}>
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  id="signup-password-input"
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
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isFullWidth
              disabled={submitting}
              id="signup-submit-btn"
              style={{
                height: '46px',
                fontWeight: 800,
                fontSize: '14.5px',
                marginTop: '4px',
                borderRadius: 'var(--radius-pill)',
                boxShadow: '0 4px 14px rgba(4, 148, 244, 0.35)',
              }}
            >
              {submitting ? 'Creating Profile...' : 'Complete Registration'}
            </Button>
          </form>

          {/* Footer Navigation to Login */}
          <div
            style={{
              textAlign: 'center',
              marginTop: '16px',
              fontSize: '13px',
              color: 'var(--text-secondary)',
            }}
          >
            Already have an account?{' '}
            <button
              type="button"
              onClick={onNavigateToLogin}
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
              id="navigate-to-login-btn"
            >
              Sign In
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
            marginTop: '16px',
            fontSize: '11px',
            color: 'var(--text-tertiary)',
            flexWrap: 'wrap',
          }}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <ShieldIcon size={12} color="var(--primary)" /> Safe & Confidential
          </span>
          <span>•</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <CheckCircle2Icon size={12} color="var(--success)" /> Instant Access
          </span>
        </div>
      </div>
    </div>
  );
};
