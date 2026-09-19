import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  helperText,
  error,
  leftIcon,
  id,
  className = '',
  style,
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="input-group">
      {label && (
        <label htmlFor={inputId} className="input-label">
          {label}
        </label>
      )}
      <div style={{ position: 'relative', width: '100%' }}>
        {leftIcon && (
          <div
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-tertiary)',
              pointerEvents: 'none',
              zIndex: 1,
            }}
          >
            {leftIcon}
          </div>
        )}
        <input
          id={inputId}
          className={`input-field ${error ? 'input-error-border' : ''} ${className}`}
          style={{
            paddingLeft: leftIcon ? '36px' : undefined,
            ...style,
          }}
          {...props}
        />
      </div>
      {error ? (
        <span style={{ fontSize: '11px', color: 'var(--danger)', fontWeight: 500 }}>
          {error}
        </span>
      ) : helperText ? (
        <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
          {helperText}
        </span>
      ) : null}
    </div>
  );
};
