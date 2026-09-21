import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { AppTheme } from '../../types';

interface LoginPageProps {
  onNavigateToSignup: () => void;
  onNavigateToVerification?: (email: string, password?: string) => void;
  prefilledIdentifier?: string;
  prefilledPassword?: string;
  theme?: AppTheme;
  onToggleTheme?: () => void;
}

const formatAuthError = (err: any): string => {
  if (!err) return 'Login failed. Please check your credentials.';
  const code = String(err.code || '').toLowerCase();
  const raw = String(err.message || '').toLowerCase();

  // Short email verification required message
  if (
    code.includes('email-not-verified') ||
    raw.includes('email not verified') ||
    raw.includes('not verified')
  ) {
    return 'Email not verified. Please verify your email.';
  }

  // Strictly NO "Please try again" for incorrect email/username/password
  if (
    code.includes('invalid-credential') ||
    code.includes('wrong-password') ||
    code.includes('user-not-found') ||
    raw.includes('invalid-credential') ||
    raw.includes('wrong-password') ||
    raw.includes('user-not-found') ||
    raw.includes('invalid credential')
  ) {
    return 'Incorrect email/username or password';
  }

  if (code.includes('invalid-email') || raw.includes('invalid-email') || raw.includes('badly formatted')) {
    return 'Please enter a valid email address.';
  }

  if (code.includes('too-many-requests') || raw.includes('too-many-requests')) {
    return 'Too many failed attempts. Please wait a few minutes and try again.';
  }

  if (code.includes('network-request-failed') || raw.includes('network') || raw.includes('offline')) {
    return 'Internet connection error. Please check your network.';
  }

  if (code.includes('user-disabled') || raw.includes('user-disabled')) {
    return 'This account has been deactivated. Please contact support.';
  }

  if (raw.includes('firebase') || raw.includes('credential') || raw.includes('api key')) {
    return 'Incorrect email/username or password';
  }

  if (raw.includes('auth/') || raw.includes('error (')) {
    return 'Incorrect email/username or password';
  }

  return err.message || 'Login failed. Please check your credentials.';
};

const formatResetError = (err: any): string => {
  if (!err) return 'Unable to send reset link.';
  const code = String(err.code || '').toLowerCase();
  const raw = String(err.message || '').toLowerCase();

  if (
    code.includes('user-not-found') ||
    raw.includes('user-not-found') ||
    raw.includes('no account found')
  ) {
    return err.message || 'No account found with this email or username.';
  }
  if (code.includes('invalid-email') || raw.includes('invalid-email')) {
    return 'Please enter a valid email or username.';
  }
  if (code.includes('network-request-failed') || raw.includes('network')) {
    return 'Internet connection error. Please check your network.';
  }
  if (raw.includes('firebase')) {
    return 'Unable to process request right now. Please try again.';
  }
  return err.message || 'Failed to send reset link. Please check and try again.';
};

export const LoginPage: React.FC<LoginPageProps> = ({
  onNavigateToSignup,
  onNavigateToVerification,
  prefilledIdentifier = '',
  prefilledPassword = '',
}) => {
  const { signIn, resetPassword, isFirebaseConfigured } = useAuth();
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
  React.useEffect(() => {
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

  const handleSubmit = (e: React.FormEvent) => {
    if (isForgotPassword) {
      handleResetPassword(e);
    } else {
      handleLogin(e);
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
        {/* Header Card */}
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

        {/* Main Form */}
        <form
          onSubmit={handleSubmit}
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            boxSizing: 'border-box',
          }}
        >
          {/* Identifier Input */}
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
              type="text"
              placeholder="Email or Username"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
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

          {/* Password Input (only if not forgot-password) */}
          {!isForgotPassword && (
            <>
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
                  placeholder="Password"
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

              {/* Remember Me & Forgot Password Row */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '2px 4px',
                }}
              >
                <div
                  onClick={() => setRememberMe(!rememberMe)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    userSelect: 'none',
                  }}
                >
                  <div
                    style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '5px',
                      border: rememberMe
                        ? '1px solid var(--primary)'
                        : '1px solid var(--border)',
                      backgroundColor: rememberMe ? 'var(--primary)' : 'var(--surface)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.18s ease',
                      boxShadow: rememberMe ? '0 1px 4px rgba(4, 148, 244, 0.3)' : 'none',
                    }}
                  >
                    {rememberMe && (
                      <svg
                        style={{ width: '12px', height: '12px', color: '#FFFFFF' }}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="3.5"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    )}
                  </div>
                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: 600,
                      color: 'var(--text-secondary)',
                    }}
                  >
                    Remember me
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setIsForgotPassword(true);
                    setSuccess(false);
                    setError('');
                  }}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    fontSize: '12px',
                    fontWeight: 700,
                    color: 'var(--primary)',
                    cursor: 'pointer',
                    padding: '2px 0',
                  }}
                >
                  Forgot Password?
                </button>
              </div>
            </>
          )}

          {/* Status & Error Feedback (Placed directly below password / options row, before login button) */}
          <AnimatePresence>
            {success && isForgotPassword && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                style={{
                  padding: '10px 14px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(15, 157, 88, 0.12)',
                  border: '1px solid rgba(15, 157, 88, 0.3)',
                  color: 'var(--success)',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  textAlign: 'center',
                  lineHeight: 1.4,
                }}
              >
                {resetSentToEmail && !identifier.includes('@')
                  ? `Password reset link sent to your registered email (${resetSentToEmail})! Please check your inbox and spam folder.`
                  : 'Password reset link sent! Please check your email inbox and spam folder.'}
              </motion.div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                style={{
                  padding: '10px 14px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(234, 67, 53, 0.12)',
                  border: '1px solid rgba(234, 67, 53, 0.3)',
                  color: 'var(--danger)',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  textAlign: 'center',
                  lineHeight: 1.4,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <span>{error}</span>
                {error.toLowerCase().includes('verify') && onNavigateToVerification && (
                  <button
                    type="button"
                    onClick={() => onNavigateToVerification(identifier.trim(), password)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--primary)',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      textDecoration: 'underline',
                      padding: '2px 0',
                    }}
                  >
                    Go to Verification Screen
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={
              loading ||
              (!isForgotPassword && (!identifier.trim() || password.length < 6)) ||
              (isForgotPassword && !identifier.trim())
            }
            style={{
              width: '100%',
              padding: '14px 20px',
              backgroundColor: 'var(--primary)',
              color: '#FFFFFF',
              fontSize: '14px',
              fontWeight: 800,
              borderRadius: '14px',
              border: 'none',
              cursor:
                loading ||
                (!isForgotPassword && (!identifier.trim() || password.length < 6)) ||
                (isForgotPassword && !identifier.trim())
                  ? 'not-allowed'
                  : 'pointer',
              opacity:
                loading ||
                (!isForgotPassword && (!identifier.trim() || password.length < 6)) ||
                (isForgotPassword && !identifier.trim())
                  ? 0.55
                  : 1,
              boxShadow: '0 3px 12px rgba(4, 148, 244, 0.32)',
              marginTop: '4px',
              transition: 'all 0.2s ease',
            }}
          >
            {isForgotPassword
              ? loading
                ? 'Sending Reset Link...'
                : 'Send Reset Link'
              : loading
              ? 'Logging in...'
              : 'Login'}
          </button>

          {/* Quick Demo Mode for Preview / Offline use */}
          {!isForgotPassword && (
            <button
              type="button"
              onClick={async () => {
                setLoading(true);
                setError('');
                try {
                  await signIn('demo.aspirant@prepmate.app', 'demo1234');
                } catch (err: any) {
                  setError(formatAuthError(err));
                } finally {
                  setLoading(false);
                }
              }}
              style={{
                width: '100%',
                padding: '12px 16px',
                backgroundColor: 'var(--surface-variant)',
                color: 'var(--primary)',
                fontSize: '13px',
                fontWeight: 700,
                borderRadius: '14px',
                border: '1px dashed var(--primary)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              <span>Explore in Demo Mode (Instant Preview)</span>
            </button>
          )}

          {/* Back to Login link when in Forgot Password mode */}
          {isForgotPassword && (
            <div style={{ textAlign: 'center', marginTop: '6px' }}>
              <button
                type="button"
                onClick={() => {
                  setIsForgotPassword(false);
                  setSuccess(false);
                  setError('');
                }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                }}
              >
                Remember your password?{' '}
                <span style={{ color: 'var(--primary)', fontWeight: 800 }}>Sign in</span>
              </button>
            </div>
          )}

          {/* Branding & Terms Footer Card (Hidden in Forgot Password mode) */}
          {!isForgotPassword && (
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
          )}
        </form>
      </div>
    </div>
  );
};
