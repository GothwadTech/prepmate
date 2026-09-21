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
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        height: '54px',
        backgroundColor: '#202124',
        borderBottom: '1px solid #3C4043',
        borderBottomLeftRadius: '18px',
        borderBottomRightRadius: '18px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        boxShadow: '0 3px 12px rgba(0, 0, 0, 0.25)',
        flexShrink: 0,
        width: '100%',
        boxSizing: 'border-box',
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
          background: 'rgba(255, 255, 255, 0.08)',
          border: '1px solid #3C4043',
          borderRadius: '20px',
          padding: '6px 12px',
          color: '#FFFFFF',
          fontSize: '13px',
          fontWeight: 600,
          cursor: 'pointer',
        }}
      >
        <ChevronLeftIcon size={16} />
        <span>Back</span>
      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '15px', fontWeight: 700, color: '#FFFFFF' }}>
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
              color: '#60A5FA',
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
