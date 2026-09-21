import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { AppTheme } from '../../types';
import { formatSignupError } from './signupErrorUtils';
import { SignupForm } from './SignupForm';
import { AuthBrandingCard } from './AuthBrandingCard';
import { AuthBrandHeader } from './AuthBrandHeader';

interface SignupPageProps {
  onNavigateToLogin: () => void;
  onNavigateToVerification: (email: string, password?: string) => void;
  onOpenTerms?: () => void;
  onOpenPrivacy?: () => void;
  theme?: AppTheme;
  onToggleTheme?: () => void;
}

export const SignupPage: React.FC<SignupPageProps> = ({
  onNavigateToLogin,
  onNavigateToVerification,
  onOpenTerms,
  onOpenPrivacy,
  theme,
  onToggleTheme,
}) => {
  const { signUp } = useAuth();
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [targetYear, setTargetYear] = useState('2026');
  const [targetScore, setTargetScore] = useState('680');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !username.trim() || !email.trim() || !password.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    const cleanUsername = username.trim().replace(/^@/, '').toLowerCase();
    if (!/^[a-z0-9_]{3,20}$/.test(cleanUsername)) {
      setError('Username must be 3-20 characters (letters, numbers, underscores only).');
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
      // Redirect to verification screen with credentials ready for autofill
      onNavigateToVerification(email.trim(), password);
    } catch (err: any) {
      setError(formatSignupError(err));
    } finally {
      setSubmitting(false);
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
      {/* Top Bar with Cancel / Theme button */}
      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          padding: '16px 20px 0 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxSizing: 'border-box',
          zIndex: 10,
        }}
      >
        <button
          type="button"
          onClick={onNavigateToLogin}
          id="signup-cancel-btn"
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

        {onToggleTheme && (
          <button
            type="button"
            onClick={onToggleTheme}
            id="signup-theme-toggle-btn"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle Theme"
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--border)',
              color: 'var(--text-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: '15px',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        )}
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
        {/* Brand Header */}
        <AuthBrandHeader
          title="Create Aspirant Account"
          subtitle="Join Prepmate to track daily syllabus, timers, and streaks."
        />

        {/* Auth Switcher Tabs */}
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
            onClick={onNavigateToLogin}
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
            Sign In
          </button>
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
            Sign Up
          </button>
        </div>

        {/* Signup Form */}
        <SignupForm
          name={name}
          setName={setName}
          username={username}
          setUsername={setUsername}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          targetYear={targetYear}
          setTargetYear={setTargetYear}
          targetScore={targetScore}
          setTargetScore={setTargetScore}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          submitting={submitting}
          error={error}
          onSubmit={handleSignupSubmit}
        />

        {/* Terms and Gothwad Tech Branding Footer */}
        <AuthBrandingCard
          onOpenTerms={onOpenTerms}
          onOpenPrivacy={onOpenPrivacy}
        />
      </div>
    </div>
  );
};
