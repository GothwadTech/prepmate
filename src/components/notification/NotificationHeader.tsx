import React from 'react';
import { ChevronLeftIcon } from '../icons/SvgIcons';

interface NotificationHeaderProps {
  onClose: () => void;
  unreadCount: number;
  onMarkAllAsRead: () => void;
}

export const NotificationHeader: React.FC<NotificationHeaderProps> = ({
  onClose,
  unreadCount,
  onMarkAllAsRead,
}) => {
  return (
    <header
      className="app-header"
      id="notification-center-header"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        height: '54px',
        backgroundColor: 'var(--header-bg)',
        borderBottom: '1px solid var(--header-border)',
        borderBottomLeftRadius: 'var(--header-radius)',
        borderBottomRightRadius: 'var(--header-radius)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        boxShadow: 'var(--header-shadow)',
        flexShrink: 0,
        width: '100%',
        boxSizing: 'border-box',
        transition: 'background-color var(--transition-normal), border-color var(--transition-normal)',
      }}
    >
      <button
        type="button"
        onClick={onClose}
        id="close-notif-center-btn"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: 'var(--header-btn-bg)',
          border: '1px solid var(--header-btn-border)',
          borderRadius: '20px',
          padding: '6px 12px',
          color: 'var(--header-text)',
          fontSize: '13px',
          fontWeight: 600,
          cursor: 'pointer',
        }}
      >
        <ChevronLeftIcon size={16} color="var(--header-text)" />
        <span>Back</span>
      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '16px', fontWeight: 800, color: 'var(--header-text)' }}>
          Notifications
        </span>
        {unreadCount > 0 && (
          <span
            style={{
              fontSize: '10px',
              fontWeight: 800,
              backgroundColor: '#EF4444',
              color: '#FFFFFF',
              padding: '1px 6px',
              borderRadius: '10px',
            }}
          >
            {unreadCount}
          </span>
        )}
      </div>

      <div style={{ width: '64px', display: 'flex', justifyContent: 'flex-end' }}>
        {unreadCount > 0 ? (
          <button
            type="button"
            onClick={onMarkAllAsRead}
            id="notif-mark-all-read-btn"
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--primary)',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              padding: '4px',
            }}
          >
            Mark all
          </button>
        ) : null}
      </div>
    </header>
  );
};
