import React, { useState } from 'react';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { CloseIcon, MailIcon } from '../../components/icons/SvgIcons';
import { useAuth } from '../../context/AuthContext';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultEmail?: string;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
  defaultEmail = '',
}) => {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState(defaultEmail);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setSubmitting(true);
    try {
      await resetPassword(email.trim());
      setSubmitted(true);
    } catch {
      // Handled by toast in AuthContext
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} id="forgot-password-modal">
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="modal-drag-handle" />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <h3 style={{ fontSize: '17px', fontWeight: 700 }}>Reset Password</h3>
          <button className="btn-icon" onClick={onClose}>
            <CloseIcon size={18} />
          </button>
        </div>

        {submitted ? (
          <div style={{ textAlign: 'center', padding: '16px 8px' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: 'var(--success-container)',
                color: 'var(--success)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px auto',
              }}
            >
              <MailIcon size={24} />
            </div>
            <h4 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '6px' }}>
              Check your inbox
            </h4>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              We've sent a password reset link to <strong>{email}</strong>.
            </p>
            <Button variant="primary" size="md" isFullWidth onClick={onClose}>
              Done
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Apna registered email address enter karein. Hum aapko password reset karne ka link bhejenge.
            </p>

            <Input
              label="Email Address"
              type="email"
              placeholder="e.g. aspirant@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              id="reset-email-input"
            />

            <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
              <Button type="button" variant="outline" size="md" onClick={onClose} style={{ flex: 1 }}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="md" disabled={submitting} style={{ flex: 1 }}>
                {submitting ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
