import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { AppTheme } from '../../types';
import { formatSignupError } from './signupErrorUtils';
import { SignupForm } from './SignupForm';
import { AuthBrandingCard } from './AuthBrandingCard';

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
            marginBottom: '24px',
          }}
        >
          <div
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, var(--primary) 0%, #0070BA 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              boxShadow: '0 8px 24px rgba(4, 148, 244, 0.35)',
              marginBottom: '14px',
            }}
          >
            <span style={{ fontSize: '28px' }}>🩺</span>
          </div>

          <h1
            style={{
              fontSize: '22px',
              fontWeight: 900,
              letterSpacing: '-0.5px',
              color: 'var(--text-primary)',
              margin: '0 0 6px 0',
            }}
          >
            Create Aspirant Account
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
            Join Prepmate to track daily syllabus, timers, and streaks.
          </p>
        </div>

        {/* Auth Switcher Tabs */}
        <div
          style={{
            width: '100%',
            display: 'flex',
            gap: '8px',
            marginBottom: '18px',
            padding: '4px',
            backgroundColor: 'var(--surface-variant)',
            borderRadius: '14px',
            border: '1px solid var(--border)',
            boxSizing: 'border-box',
          }}
        >
          <button
            type="button"
            onClick={onNavigateToLogin}
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
            Sign In
          </button>
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
