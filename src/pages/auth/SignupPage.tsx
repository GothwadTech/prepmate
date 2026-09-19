import React, { useState } from 'react';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { GoogleIcon, EyeIcon, EyeOffIcon, SunIcon, MoonIcon, InfoIcon } from '../../components/icons/SvgIcons';
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
      // Handled by Toast
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
        minHeight: '100%',
        padding: '24px 16px',
        justifyContent: 'center',
      }}
    >
      {/* Top Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px',
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
          id="signup-theme-toggle-btn"
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
          padding: '22px 18px',
          boxShadow: 'var(--shadow-sm)',
        }}
        id="signup-form-container"
      >
        <div style={{ marginBottom: '18px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)' }}>
            Create Aspirant Account
          </h2>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Join fellow NEET aspirants and track daily syllabus progress
          </p>
        </div>

        {/* Google Quick Sign Up */}
        <button
          type="button"
          onClick={handleGoogleSignup}
          disabled={submitting}
          id="google-signup-btn"
          style={{
            width: '100%',
            height: '44px',
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
            marginBottom: '14px',
          }}
        >
          <GoogleIcon size={20} />
          <span>Sign up with Google</span>
        </button>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            margin: '12px 0',
          }}
        >
          <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
          <span style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
            or with email
          </span>
          <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
        </div>

        <form onSubmit={handleSignupSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Full Name & Username */}
          <Input
            label="Full Name"
            placeholder="e.g. Aman Sharma"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            id="signup-name-input"
          />

          <div>
            <Input
              label="Username (For Partner Search)"
              placeholder="e.g. amansharma_neet"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              id="signup-username-input"
            />
            <span style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '2px', display: 'block' }}>
              Your partner will find you with @{username.replace(/^@/, '') || 'username'}
            </span>
          </div>

          <Input
            label="Email Address"
            type="email"
            placeholder="e.g. aman@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            id="signup-email-input"
          />

          {/* Password */}
          <div style={{ position: 'relative' }}>
            <Input
              label="Password (min 6 characters)"
              type={showPassword ? 'text' : 'password'}
              placeholder="Create strong password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              id="signup-password-input"
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

          {/* Target Settings: Year & Score */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '2px' }}>
            <div className="input-group">
              <label className="input-label">Target NEET Year</label>
              <div style={{ display: 'flex', gap: '6px' }}>
                {['2025', '2026', '2027'].map((yr) => (
                  <button
                    type="button"
                    key={yr}
                    className={`btn ${targetYear === yr ? 'btn-primary' : 'btn-outline'}`}
                    style={{ flex: 1, padding: '8px 2px', fontSize: '11px' }}
                    onClick={() => setTargetYear(yr)}
                  >
                    {yr}
                  </button>
                ))}
              </div>
            </div>

            <Input
              label="Target Score (/720)"
              type="number"
              placeholder="e.g. 680"
              value={targetScore}
              onChange={(e) => setTargetScore(e.target.value)}
              required
              id="signup-target-score-input"
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isFullWidth
            disabled={submitting}
            id="signup-submit-btn"
            style={{ marginTop: '6px' }}
          >
            {submitting ? 'Creating Account...' : 'Complete Registration'}
          </Button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '13px', color: 'var(--text-secondary)' }}>
          Already have an account?{' '}
          <button
            type="button"
            onClick={onNavigateToLogin}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--primary)',
              fontWeight: 700,
              cursor: 'pointer',
              fontSize: '13px',
            }}
            id="navigate-to-login-btn"
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
};
