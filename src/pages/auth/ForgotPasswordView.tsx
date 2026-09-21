import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail } from 'lucide-react';

interface ForgotPasswordViewProps {
  identifier: string;
  setIdentifier: (val: string) => void;
  loading: boolean;
  error: string;
  success: boolean;
  resetSentToEmail: string;
  onSubmit: (e: React.FormEvent) => void;
  onBackToLogin: () => void;
}

export const ForgotPasswordView: React.FC<ForgotPasswordViewProps> = ({
  identifier,
  setIdentifier,
  loading,
  error,
  success,
  resetSentToEmail,
  onSubmit,
  onBackToLogin,
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
          placeholder="Registered Email or Username"
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

      {/* Status & Error Feedback */}
      <AnimatePresence>
        {success && (
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
              : `Password reset link sent to ${resetSentToEmail || identifier}! Please check your email inbox and spam folder.`}
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
            }}
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading || !identifier.trim()}
        style={{
          width: '100%',
          padding: '14px 20px',
          backgroundColor: 'var(--primary)',
          color: '#FFFFFF',
          fontSize: '14px',
          fontWeight: 800,
          borderRadius: '14px',
          border: 'none',
          cursor: loading || !identifier.trim() ? 'not-allowed' : 'pointer',
          opacity: loading || !identifier.trim() ? 0.55 : 1,
          boxShadow: '0 3px 12px rgba(4, 148, 244, 0.32)',
          marginTop: '4px',
          transition: 'all 0.2s ease',
        }}
      >
        {loading ? 'Sending Reset Link...' : 'Send Reset Link'}
      </button>

      {/* Back to Login link */}
      <div style={{ textAlign: 'center', marginTop: '6px' }}>
        <button
          type="button"
          onClick={onBackToLogin}
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
    </form>
  );
};
