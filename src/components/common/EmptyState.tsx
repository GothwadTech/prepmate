import React from 'react';
import { Button } from './Button';
import { SparklesIcon } from '../icons/SvgIcons';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  secondaryActionText?: string;
  onSecondaryAction?: () => void;
  badge?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionText,
  onAction,
  secondaryActionText,
  onSecondaryAction,
  badge,
}) => {
  return (
    <div
      className="empty-state-container"
      style={{
        padding: '36px 20px',
        textAlign: 'center',
        background: 'var(--surface-variant)',
        borderRadius: 'var(--radius-lg)',
        border: '1.5px dashed var(--border)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '12px',
        margin: '8px 0',
      }}
    >
      {badge && (
        <span
          className="badge badge-primary"
          style={{
            fontSize: '11px',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.4px',
          }}
        >
          {badge}
        </span>
      )}

      <div
        className="empty-state-icon-circle"
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: 'var(--surface)',
          border: '1.5px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--primary)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
        }}
      >
        {icon || <SparklesIcon size={26} color="var(--primary)" />}
      </div>

      <div style={{ maxWidth: '340px' }}>
        <h4
          style={{
            fontSize: '16px',
            fontWeight: 800,
            color: 'var(--text-primary)',
            letterSpacing: '-0.2px',
            marginBottom: '4px',
          }}
        >
          {title}
        </h4>
        <p
          style={{
            fontSize: '12.5px',
            color: 'var(--text-secondary)',
            lineHeight: 1.5,
            margin: 0,
          }}
        >
          {description}
        </p>
      </div>

      {(actionText || secondaryActionText) && (
        <div style={{ display: 'flex', gap: '8px', marginTop: '6px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {actionText && onAction && (
            <Button variant="primary" size="sm" onClick={onAction}>
              {actionText}
            </Button>
          )}
          {secondaryActionText && onSecondaryAction && (
            <Button variant="outline" size="sm" onClick={onSecondaryAction}>
              {secondaryActionText}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
