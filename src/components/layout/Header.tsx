import React from 'react';
import { BookIcon, UserIcon, BellIcon, WifiIcon, WifiOffIcon, RefreshCwIcon, ChevronLeftIcon } from '../icons/SvgIcons';
import { useAuth } from '../../context/AuthContext';
import { SyncStatus } from '../../types';

interface HeaderProps {
  onOpenProfile: () => void;
  isProfileActive?: boolean;
  onBack?: () => void;
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
  onBack,
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

  // Profile Active Header: Unified consistent styling matching Terms & Privacy
  if (isProfileActive) {
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
            fontSize: '18px',
            fontWeight: 800,
            letterSpacing: '-0.3px',
            color: '#FFFFFF',
            lineHeight: 1.2,
          }}
        >
          Prepmate
        </span>
      </div>

      {/* 2. Right: Sync Status, Clean White SVG Notification Bell, Profile Avatar */}
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
            height: '30px',
            borderRadius: 'var(--radius-pill)',
            backgroundColor: !isOnline
              ? 'rgba(217, 119, 6, 0.2)'
              : pendingCount > 0
              ? 'rgba(26, 115, 232, 0.2)'
              : 'rgba(255, 255, 255, 0.08)',
            color: !isOnline
              ? '#FBBF24'
              : pendingCount > 0
              ? '#60A5FA'
              : '#9AA0A6',
            border: '1px solid #3C4043',
            cursor: 'pointer',
            fontSize: '11px',
            fontWeight: 700,
            transition: 'all var(--transition-fast)',
          }}
        >
          {!isOnline ? (
            <WifiOffIcon size={13} color="#FBBF24" />
          ) : syncStatus === 'syncing' ? (
            <RefreshCwIcon size={13} className="animate-spin" color="#60A5FA" />
          ) : (
            <WifiIcon size={13} color={pendingCount > 0 ? '#60A5FA' : '#34A853'} />
          )}

          {pendingCount > 0 && <span>{pendingCount}</span>}
        </button>

        {/* Clean White/Black SVG Notification Bell without any round colored background */}
        <button
          type="button"
          onClick={onOpenNotifications}
          id="header-notification-btn"
          title="Open Notifications and Reminders"
          aria-label="Open Notifications and Reminders"
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
            borderRadius: '8px',
            transition: 'opacity var(--transition-fast)',
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

        {/* Profile Avatar Button */}
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
            backgroundColor: 'rgba(255, 255, 255, 0.12)',
            color: '#FFFFFF',
            border: '1px solid #3C4043',
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
            <UserIcon size={16} color="#FFFFFF" />
          )}
        </button>
      </div>
    </header>
  );
};
