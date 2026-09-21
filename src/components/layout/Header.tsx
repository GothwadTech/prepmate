import React from 'react';
import { UserIcon, BellIcon } from '../icons/SvgIcons';
import { useAuth } from '../../context/AuthContext';
import { ProfileActiveHeader } from './ProfileActiveHeader';

interface HeaderProps {
  onOpenProfile: () => void;
  isProfileActive?: boolean;
  onBack?: () => void;
  onOpenNotifications: () => void;
  unreadNotifCount: number;
  onOpenSyncQueue?: () => void;
  syncStatus?: any;
  isOnline?: boolean;
  pendingCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenProfile,
  isProfileActive = false,
  onBack,
  onOpenNotifications,
  unreadNotifCount,
}) => {
  const { user } = useAuth();

  const getInitials = (name?: string) => {
    if (!name) return 'ME';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase() || 'ME';
  };

  if (isProfileActive) {
    return (
      <ProfileActiveHeader
        onBack={onBack}
        onOpenProfile={onOpenProfile}
        onOpenNotifications={onOpenNotifications}
        unreadNotifCount={unreadNotifCount}
      />
    );
  }

  return (
    <header
      className="app-header"
      id="app-header"
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
        transition: 'background-color var(--transition-normal), border-color var(--transition-normal)',
      }}
    >
      {/* 1. Left: Prepmate Brand Title */}
      <div
        className="header-brand"
        id="brand-header-link"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          textDecoration: 'none',
          color: 'inherit',
          cursor: 'default',
        }}
      >
        <div
          className="brand-icon-box"
          id="brand-icon-container"
          style={{
            width: '32px',
            height: '32px',
            borderRadius: 'var(--radius-sm)',
            overflow: 'hidden',
            backgroundColor: 'var(--surface-variant)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 2px 6px rgba(4, 148, 244, 0.25)',
          }}
        >
          <img
            src="/icon-192-maskable.png"
            alt="Prepmate"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            referrerPolicy="no-referrer"
          />
        </div>
        <span
          className="brand-name"
          style={{
            fontSize: '19.5px',
            fontWeight: 800,
            letterSpacing: '-0.3px',
            color: 'var(--header-text)',
            lineHeight: 1.2,
          }}
        >
          PrepMate
        </span>
      </div>

      {/* 2. Right: Notification Bell & Profile Avatar (Wifi icon moved to Profile setting) */}
      <div className="header-actions" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button
          type="button"
          onClick={onOpenNotifications}
          id="header-notification-btn"
          title="Open Notifications and Reminders"
          aria-label="Open Notifications and Reminders"
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--header-text)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            padding: '6px',
            position: 'relative',
            borderRadius: '8px',
            transition: 'opacity var(--transition-fast)',
          }}
        >
          <BellIcon size={20} color="var(--header-text)" />
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
                border: '1.5px solid var(--header-bg)',
              }}
            />
          )}
        </button>

        <button
          type="button"
          onClick={onOpenProfile}
          id="header-profile-btn"
          title="Open Profile & Settings"
          aria-label="Open Profile and Settings"
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: 'var(--header-btn-bg)',
            color: 'var(--header-text)',
            border: '1px solid var(--header-btn-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            padding: 0,
            fontSize: '11px',
            fontWeight: 800,
            transition: 'all var(--transition-fast)',
          }}
        >
          {user?.displayName ? (
            <span>{getInitials(user.displayName)}</span>
          ) : (
            <UserIcon size={16} color="var(--header-text)" />
          )}
        </button>
      </div>
    </header>
  );
};
