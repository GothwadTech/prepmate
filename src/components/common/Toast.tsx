import React from 'react';
import { ToastNotification } from '../../types';
import { CheckIcon, CloseIcon, AlertCircleIcon, InfoIcon } from '../icons/SvgIcons';

interface ToastProps {
  toasts: ToastNotification[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div
      id="toast-notifications-container"
      style={{
        position: 'fixed',
        bottom: '80px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'calc(100% - 32px)',
        maxWidth: '440px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        pointerEvents: 'none',
      }}
    >
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';

        const bg = isSuccess
          ? 'var(--success-container)'
          : isError
          ? 'var(--danger-container)'
          : 'var(--surface-variant)';

        const textColor = isSuccess
          ? 'var(--success)'
          : isError
          ? 'var(--danger)'
          : 'var(--text-primary)';

        const borderColor = isSuccess
          ? 'rgba(15, 157, 88, 0.25)'
          : isError
          ? 'rgba(234, 67, 53, 0.25)'
          : 'var(--border)';

        return (
          <div
            key={toast.id}
            id={`toast-${toast.id}`}
            style={{
              pointerEvents: 'auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '10px',
              padding: '10px 14px',
              borderRadius: 'var(--radius-md)',
              background: bg,
              color: textColor,
              border: `1px solid ${borderColor}`,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              fontSize: '13px',
              fontWeight: 600,
              animation: 'fadeIn 0.25s ease-out',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {isSuccess && <CheckIcon size={18} color="var(--success)" />}
              {isError && <AlertCircleIcon size={18} color="var(--danger)" />}
              {!isSuccess && !isError && <InfoIcon size={18} color="var(--primary)" />}
              <span>{toast.message}</span>
            </div>

            <button
              onClick={() => onDismiss(toast.id)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'currentColor',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                padding: '2px',
                opacity: 0.7,
              }}
              aria-label="Dismiss toast"
            >
              <CloseIcon size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
