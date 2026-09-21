import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, Target, Calendar } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { AppTheme } from '../../types';

interface SignupPageProps {
  onNavigateToLogin: () => void;
  onNavigateToVerification: (email: string, password?: string) => void;
  onOpenTerms?: () => void;
  onOpenPrivacy?: () => void;
  theme?: AppTheme;
  onToggleTheme?: () => void;
}

const formatSignupError = (err: any): string => {
  if (!err) return 'Registration failed. Please try again.';
  const code = String(err.code || '').toLowerCase();
  const raw = String(err.message || '').toLowerCase();

  if (code.includes('email-already-in-use') || raw.includes('email-already-in-use') || raw.includes('already registered')) {
    return 'This email address is already registered. Please sign in instead.';
  }
  if (code.includes('invalid-email') || raw.includes('invalid-email')) {
    return 'Please enter a valid email address.';
  }
  if (code.includes('weak-password') || raw.includes('weak-password')) {
    return 'Password is too weak. Please use at least 6 characters.';
  }
  if (code.includes('network-request-failed') || raw.includes('network')) {
    return 'Internet connection error. Please check your network.';
  }
  if (raw.includes('firebase') || raw.includes('credential')) {
    return 'Registration could not be completed right now. Please try again.';
  }
  if (raw.includes('auth/') || raw.includes('error (')) {
    return 'Registration failed. Please check your details and try again.';
  }
  return err.message || 'Registration failed. Please try again.';
};

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

        {/* Auth Switcher Tabs */}
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
        <form
          onSubmit={handleSignupSubmit}
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            boxSizing: 'border-box',
          }}
        >
          {/* Full Name */}
          <div style={{ position: 'relative', width: '100%' }}>
            <div
              style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-tertiary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'none',
              }}
            >
              <User size={18} />
            </div>
            <input
              type="text"
              placeholder="Full Name (e.g. Aman Sharma)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '14px 16px 14px 46px',
                backgroundColor: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: '14px',
                fontSize: '14px',
                color: 'var(--text-primary)',
                outline: 'none',
                boxSizing: 'border-box',
                fontFamily: 'inherit',
                transition: 'border-color 0.2s, box-shadow 0.2s',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--primary)';
                e.target.style.boxShadow = '0 0 0 3px var(--primary-container)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--border)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          {/* Unique Username */}
          <div style={{ position: 'relative', width: '100%' }}>
            <div
              style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-tertiary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'none',
                fontSize: '15px',
                fontWeight: 800,
              }}
            >
              @
            </div>
            <input
              type="text"
              placeholder="Unique Username (e.g. aman_neet26)"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '14px 16px 14px 46px',
                backgroundColor: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: '14px',
                fontSize: '14px',
                color: 'var(--text-primary)',
                outline: 'none',
                boxSizing: 'border-box',
                fontFamily: 'inherit',
                transition: 'border-color 0.2s, box-shadow 0.2s',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--primary)';
                e.target.style.boxShadow = '0 0 0 3px var(--primary-container)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--border)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          {/* Email Address */}
          <div style={{ position: 'relative', width: '100%' }}>
            <div
              style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-tertiary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'none',
              }}
            >
              <Mail size={18} />
            </div>
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '14px 16px 14px 46px',
                backgroundColor: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: '14px',
                fontSize: '14px',
                color: 'var(--text-primary)',
                outline: 'none',
                boxSizing: 'border-box',
                fontFamily: 'inherit',
                transition: 'border-color 0.2s, box-shadow 0.2s',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--primary)';
                e.target.style.boxShadow = '0 0 0 3px var(--primary-container)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--border)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          {/* Target Year & Score 2-Column Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {/* Target Year Select */}
            <div style={{ position: 'relative', width: '100%' }}>
              <div
                style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-tertiary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  pointerEvents: 'none',
                }}
              >
                <Calendar size={16} />
              </div>
              <select
                value={targetYear}
                onChange={(e) => setTargetYear(e.target.value)}
                style={{
                  width: '100%',
                  padding: '14px 12px 14px 40px',
                  backgroundColor: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: '14px',
                  fontSize: '13.5px',
                  color: 'var(--text-primary)',
                  outline: 'none',
                  boxSizing: 'border-box',
                  fontFamily: 'inherit',
                  cursor: 'pointer',
                  appearance: 'none',
                }}
              >
                <option value="2025">NEET 2025</option>
                <option value="2026">NEET 2026</option>
                <option value="2027">NEET 2027</option>
                <option value="2028">NEET 2028</option>
              </select>
            </div>

            {/* Target Score Input */}
            <div style={{ position: 'relative', width: '100%' }}>
              <div
                style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-tertiary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  pointerEvents: 'none',
                }}
              >
                <Target size={16} />
              </div>
              <input
                type="number"
                min="400"
                max="720"
                placeholder="Target (720)"
                value={targetScore}
                onChange={(e) => setTargetScore(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '14px 12px 14px 40px',
                  backgroundColor: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: '14px',
                  fontSize: '13.5px',
                  color: 'var(--text-primary)',
                  outline: 'none',
                  boxSizing: 'border-box',
                  fontFamily: 'inherit',
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--primary)';
                  e.target.style.boxShadow = '0 0 0 3px var(--primary-container)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--border)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
          </div>

          {/* Password Input */}
          <div style={{ position: 'relative', width: '100%' }}>
            <div
              style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-tertiary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'none',
              }}
            >
              <Lock size={18} />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password (Min 6 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '14px 46px 14px 46px',
                backgroundColor: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: '14px',
                fontSize: '14px',
                color: 'var(--text-primary)',
                outline: 'none',
                boxSizing: 'border-box',
                fontFamily: 'inherit',
                transition: 'border-color 0.2s, box-shadow 0.2s',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--primary)';
                e.target.style.boxShadow = '0 0 0 3px var(--primary-container)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--border)';
                e.target.style.boxShadow = 'none';
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '4px',
              }}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Error message */}
          {error && (
            <div
              style={{
                padding: '10px 14px',
                borderRadius: '10px',
                backgroundColor: 'rgba(234, 67, 53, 0.12)',
                border: '1px solid rgba(234, 67, 53, 0.3)',
                color: 'var(--danger)',
                fontSize: '12px',
                fontWeight: 600,
                textAlign: 'center',
              }}
            >
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            style={{
              width: '100%',
              padding: '14px 20px',
              backgroundColor: 'var(--primary)',
              color: '#FFFFFF',
              fontSize: '14px',
              fontWeight: 800,
              borderRadius: '14px',
              border: 'none',
              cursor: submitting ? 'not-allowed' : 'pointer',
              opacity: submitting ? 0.6 : 1,
              boxShadow: '0 3px 12px rgba(4, 148, 244, 0.32)',
              marginTop: '6px',
              transition: 'all 0.2s ease',
            }}
          >
            {submitting ? 'Creating Profile...' : 'Complete Registration'}
          </button>

          {/* Already have an account row */}
          <div style={{ textAlign: 'center', marginTop: '4px' }}>
            <span style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>
              Already have an account?{' '}
              <button
                type="button"
                onClick={onNavigateToLogin}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--primary)',
                  fontWeight: 800,
                  fontSize: '12.5px',
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                Sign In
              </button>
            </span>
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
                opacity: 0.9,
              }}
            >
              By registering on <strong style={{ color: 'var(--primary)', fontWeight: 700 }}>Prepmate</strong>, you agree to our{' '}
              <button
                type="button"
                onClick={onOpenTerms}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  color: 'var(--primary)',
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontSize: '12.5px',
                  textDecoration: 'underline',
                }}
              >
                Terms of Service
              </button>{' '}
              &amp;{' '}
              <button
                type="button"
                onClick={onOpenPrivacy}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  color: 'var(--primary)',
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontSize: '12.5px',
                  textDecoration: 'underline',
                }}
              >
                Privacy Policy
              </button>
              .
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
                  opacity: 0.9,
                  display: 'block',
                  lineHeight: 1.45,
                }}
              >
                <strong style={{ color: 'var(--primary)', fontWeight: 700 }}>Prepmate</strong> is proudly developed and managed by{' '}
                <a
                  href="https://gothwadtech.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  id="signup-gothwad-tech-link"
                  style={{
                    color: 'var(--primary)',
                    fontWeight: 700,
                    textDecoration: 'underline',
                    cursor: 'pointer',
                  }}
                >
                  Gothwad Tech
                </a>{' '}
                in support of India&apos;s Atmanirbhar Bharat initiative.
              </span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
