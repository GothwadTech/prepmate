import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

interface LoginFormProps {
  identifier: string;
  setIdentifier: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  showPassword: boolean;
  setShowPassword: (val: boolean) => void;
  rememberMe: boolean;
  setRememberMe: (val: boolean) => void;
  loading: boolean;
  error: string;
  onSubmit: (e: React.FormEvent) => void;
  onForgotPassword: () => void;
  onNavigateToVerification?: (email: string, password?: string) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  identifier,
  setIdentifier,
  password,
  setPassword,
  showPassword,
  setShowPassword,
  rememberMe,
  setRememberMe,
  loading,
  error,
  onSubmit,
  onForgotPassword,
  onNavigateToVerification,
}) => {
  return (
    <form
      onSubmit={onSubmit}
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
              border: rememberMe ? '1px solid var(--primary)' : '1px solid var(--border)',
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
          onClick={onForgotPassword}
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

      {/* Status & Error Feedback */}
      <AnimatePresence>
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
        disabled={loading || !identifier.trim() || password.length < 6}
        style={{
          width: '100%',
          padding: '14px 20px',
          backgroundColor: 'var(--primary)',
          color: '#FFFFFF',
          fontSize: '14px',
          fontWeight: 800,
          borderRadius: '14px',
          border: 'none',
          cursor: loading || !identifier.trim() || password.length < 6 ? 'not-allowed' : 'pointer',
          opacity: loading || !identifier.trim() || password.length < 6 ? 0.55 : 1,
          boxShadow: '0 3px 12px rgba(4, 148, 244, 0.32)',
          marginTop: '4px',
          transition: 'all 0.2s ease',
        }}
      >
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
};
