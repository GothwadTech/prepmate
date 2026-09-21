import React from 'react';
import { CloseIcon } from '../icons/SvgIcons';
import { AppNotification } from '../../types';

interface NotificationItemCardProps {
  notification: AppNotification;
  onActionClick: (notif: AppNotification) => void;
  onMarkAsRead: (id: string) => void;
  onDeleteNotification: (id: string) => void;
  formatTimestamp: (iso: string) => string;
}

export const NotificationItemCard: React.FC<NotificationItemCardProps> = ({
  notification: n,
  onActionClick,
  onMarkAsRead,
  onDeleteNotification,
  formatTimestamp,
}) => {
  return (
    <div
      style={{
        padding: '10px 12px',
        borderRadius: 'var(--radius-sm)',
        backgroundColor: n.read ? 'var(--surface-variant)' : 'var(--surface)',
        border: n.read ? '1px solid var(--border)' : '1px solid var(--primary)',
        boxShadow: n.read ? 'none' : '0 2px 6px rgba(0, 82, 204, 0.08)',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '10px',
        position: 'relative',
      }}
      id={`notif-item-${n.id}`}
    >
      <div
        style={{
          fontSize: '20px',
          flexShrink: 0,
          marginTop: '2px',
        }}
      >
        {n.icon || (n.type === 'streak_warning' ? '🔥' : n.type === 'daily_reminder' ? '🌅' : '🤝')}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
          <strong style={{ fontSize: '12.5px', color: 'var(--text-primary)' }}>
            {n.title}
          </strong>
          <span style={{ fontSize: '10px', color: 'var(--text-tertiary)', flexShrink: 0 }}>
            {formatTimestamp(n.timestamp)}
          </span>
        </div>

        <p
          style={{
            fontSize: '11.5px',
            color: 'var(--text-secondary)',
            margin: '4px 0 6px 0',
            lineHeight: 1.4,
          }}
        >
          {n.message}
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {n.actionLabel && (
            <button
              type="button"
              onClick={() => onActionClick(n)}
              style={{
                padding: '3px 9px',
                borderRadius: 'var(--radius-pill)',
                border: 'none',
                backgroundColor: 'var(--primary)',
                color: '#FFFFFF',
                fontSize: '10.5px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {n.actionLabel}
            </button>
          )}

          {!n.read && (
            <button
              type="button"
              onClick={() => onMarkAsRead(n.id)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-secondary)',
                fontSize: '10.5px',
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
            >
              Mark as read
            </button>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={() => onDeleteNotification(n.id)}
        title="Delete"
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--text-tertiary)',
          cursor: 'pointer',
          padding: '2px',
          flexShrink: 0,
        }}
      >
        <CloseIcon size={14} />
      </button>
    </div>
  );
};
