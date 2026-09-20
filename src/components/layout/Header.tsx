import React from 'react';
import { BookIcon, UserIcon, BellIcon, WifiIcon, WifiOffIcon, RefreshCwIcon } from '../icons/SvgIcons';
import { useAuth } from '../../context/AuthContext';
import { SyncStatus } from '../../types';

interface HeaderProps {
  onOpenProfile: () => void;
  isProfileActive?: boolean;
  onOpenNotifications: () => void;
  unreadNotifCount: number;
  onOpenSyncQueue: () => void;
  syncStatus: SyncStatus;
  isOnline: boolean;
  pendingCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenProfile,
  isProfileActive = false,
  onOpenNotifications,
  unreadNotifCount,
  onOpenSyncQueue,
  syncStatus,
  isOnline,
  pendingCount,
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

  return (
    <header
      className="app-header"
      id="app-header"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        height: '52px',
        backgroundColor: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        borderBottomLeftRadius: '18px',
        borderBottomRightRadius: '18px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
        transition: 'background-color var(--transition-normal), border-color var(--transition-normal)',
      }}
    >
      {/* 1. Left: PrepMate Brand Title */}
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
            width: '30px',
            height: '30px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--primary)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 2px 6px rgba(4, 148, 244, 0.3)',
          }}
        >
          <BookIcon size={16} color="#FFFFFF" />
        </div>
        <span
          className="brand-name"
          style={{
            fontSize: '18px',
            fontWeight: 800,
            letterSpacing: '-0.3px',
            color: 'var(--text-primary)',
            lineHeight: 1.2,
          }}
        >
          PrepMate
        </span>
      </div>

      {/* 2. Right: Sync Status, Notification Bell, Profile Avatar */}
      <div className="header-actions" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {/* Sync Status Button */}
        <button
          type="button"
          onClick={onOpenSyncQueue}
          id="header-sync-status-btn"
          title={`Sync Status: ${syncStatus.toUpperCase()} (${pendingCount} pending)`}
          aria-label="Open Sync and Queue Manager"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '4px 8px',
            height: '32px',
            borderRadius: 'var(--radius-pill)',
            backgroundColor: !isOnline
              ? 'var(--warning-container)'
              : pendingCount > 0
              ? 'var(--primary-container)'
              : 'var(--surface-variant)',
            color: !isOnline
              ? 'var(--warning)'
              : pendingCount > 0
              ? 'var(--primary)'
              : 'var(--text-secondary)',
            border: '1px solid var(--border)',
            cursor: 'pointer',
            fontSize: '11px',
            fontWeight: 700,
            transition: 'all var(--transition-fast)',
          }}
        >
          {!isOnline ? (
            <WifiOffIcon size={14} color="#D97706" />
          ) : syncStatus === 'syncing' ? (
            <RefreshCwIcon size={14} className="animate-spin" color="var(--primary)" />
          ) : (
            <WifiIcon size={14} color={pendingCount > 0 ? 'var(--primary)' : 'var(--success)'} />
          )}

          {pendingCount > 0 && <span>{pendingCount}</span>}
        </button>

        {/* Notification Bell with Unread Badge */}
        <button
          type="button"
          onClick={onOpenNotifications}
          id="header-notification-btn"
          title="Open Notifications and Reminders"
          aria-label="Open Notifications and Reminders"
          style={{
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            backgroundColor: unreadNotifCount > 0 ? 'var(--primary-container)' : 'var(--surface-variant)',
            color: unreadNotifCount > 0 ? 'var(--primary)' : 'var(--text-secondary)',
            border: '1.5px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            padding: 0,
            position: 'relative',
            transition: 'all var(--transition-fast)',
          }}
        >
          <BellIcon size={17} />
          {unreadNotifCount > 0 && (
            <span
              id="header-unread-badge"
              style={{
                position: 'absolute',
                top: '-2px',
                right: '-2px',
                minWidth: '16px',
                height: '16px',
                borderRadius: '8px',
                backgroundColor: 'var(--danger, #EF4444)',
                color: '#FFFFFF',
                fontSize: '9.5px',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0 4px',
                border: '1.5px solid var(--surface)',
                boxShadow: '0 2px 4px rgba(239, 68, 68, 0.4)',
              }}
            >
              {unreadNotifCount > 9 ? '9+' : unreadNotifCount}
            </span>
          )}
        </button>

        {/* Profile Avatar Button */}
        <button
          type="button"
          onClick={onOpenProfile}
          id="header-profile-btn"
          title="Open Profile & Settings"
          aria-label="Open Profile and Settings"
          style={{
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            backgroundColor: isProfileActive ? 'var(--primary)' : 'var(--surface-variant)',
            color: isProfileActive ? '#FFFFFF' : 'var(--primary)',
            border: isProfileActive ? '2px solid var(--primary)' : '1.5px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            padding: 0,
            fontSize: '12px',
            fontWeight: 800,
            boxShadow: isProfileActive ? '0 0 0 3px rgba(4, 148, 244, 0.25)' : 'none',
            transition: 'all var(--transition-fast)',
          }}
        >
          {user?.displayName ? (
            <span>{getInitials(user.displayName)}</span>
          ) : (
            <UserIcon size={18} color={isProfileActive ? '#FFFFFF' : 'var(--primary)'} />
          )}
        </button>
      </div>
    </header>
  );
};
