import React from 'react';
import { ChevronLeftIcon, BellIcon } from '../icons/SvgIcons';

interface ProfileActiveHeaderProps {
  onBack?: () => void;
  onOpenProfile: () => void;
  onOpenNotifications: () => void;
  unreadNotifCount: number;
}

export const ProfileActiveHeader: React.FC<ProfileActiveHeaderProps> = ({
  onBack,
  onOpenProfile,
  onOpenNotifications,
  unreadNotifCount,
}) => {
  return (
    <header
      className="app-header"
      id="app-header"
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
        transition: 'background-color var(--transition-normal), border-color var(--transition-normal)',
      }}
    >
      <button
        type="button"
        onClick={onBack || onOpenProfile}
        id="header-profile-back-btn"
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

      <span style={{ fontSize: '15px', fontWeight: 700, color: '#FFFFFF' }}>
        Profile & Settings
      </span>

      <div style={{ width: '64px', display: 'flex', justifyContent: 'flex-end' }}>
        <button
          type="button"
          onClick={onOpenNotifications}
          id="header-notification-btn"
          title="Open Notifications"
          aria-label="Open Notifications"
          style={{
            background: 'transparent',
            border: 'none',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            padding: '6px',
            position: 'relative',
          }}
        >
          <BellIcon size={20} color="#FFFFFF" />
          {unreadNotifCount > 0 && (
            <span
              id="header-unread-badge"
              style={{
                position: 'absolute',
                top: '4px',
                right: '4px',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#EF4444',
                border: '1.5px solid #202124',
              }}
            />
          )}
        </button>
      </div>
    </header>
  );
};
