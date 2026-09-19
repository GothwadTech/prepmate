import React from 'react';
import { SunIcon, MoonIcon, BookIcon, CloudCheckIcon, RefreshCwIcon, CloudOffIcon, ClockIcon } from '../icons/SvgIcons';
import { AppTheme, SyncStatus } from '../../types';
import { useTimer } from '../../context/TimerContext';

interface HeaderProps {
  theme: AppTheme;
  onToggleTheme: () => void;
  activeTabTitle: string;
  syncStatus?: SyncStatus;
  pendingCount?: number;
  onSyncClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  theme,
  onToggleTheme,
  activeTabTitle,
  syncStatus = 'synced',
  pendingCount = 0,
  onSyncClick,
}) => {
  const { openTimer, isRunning, isPaused, remainingSeconds } = useTimer();

  const mins = Math.floor(remainingSeconds / 60);
  const secs = remainingSeconds % 60;
  const timeFormatted = `${mins}:${secs.toString().padStart(2, '0')}`;

  const renderSyncBadge = () => {
    if (syncStatus === 'offline') {
      return (
        <button
          type="button"
          className="btn-icon"
          title="Offline mode (changes saved locally)"
          aria-label="Offline status"
          style={{ width: '28px', height: '28px', color: 'var(--text-tertiary)' }}
          id="header-sync-offline-btn"
        >
          <CloudOffIcon size={16} />
        </button>
      );
    }

    if (syncStatus === 'syncing') {
      return (
        <button
          type="button"
          className="btn-icon"
          title="Syncing with Firestore..."
          aria-label="Syncing status"
          style={{ width: '28px', height: '28px', color: 'var(--primary)' }}
          id="header-syncing-btn"
        >
          <div style={{ animation: 'spin 1.2s linear infinite', display: 'flex' }}>
            <RefreshCwIcon size={15} />
          </div>
        </button>
      );
    }

    if (syncStatus === 'pending' || pendingCount > 0) {
      return (
        <button
          type="button"
          onClick={onSyncClick}
          className="btn-icon"
          title={`${pendingCount} change(s) pending sync. Tap to sync now.`}
          aria-label="Pending sync changes"
          style={{
            height: '24px',
            padding: '0 6px',
            borderRadius: '12px',
            background: 'rgba(251, 188, 5, 0.15)',
            color: '#B06000',
            fontSize: '11px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            border: 'none',
          }}
          id="header-sync-pending-btn"
        >
          <RefreshCwIcon size={12} />
          <span>{pendingCount}</span>
        </button>
      );
    }

    // Synced
    return (
      <button
        type="button"
        onClick={onSyncClick}
        className="btn-icon"
        title="Synced with Cloud Firestore (Tap to refresh)"
        aria-label="Cloud sync active"
        style={{ width: '28px', height: '28px', color: 'var(--success)' }}
        id="header-synced-btn"
      >
        <CloudCheckIcon size={16} />
      </button>
    );
  };

  return (
    <header className="app-header" id="app-header">
      <div className="header-brand" id="brand-header-link">
        <div className="brand-icon-box" id="brand-icon-container">
          <BookIcon size={18} color="#FFFFFF" />
        </div>
        <div className="brand-title-wrap">
          <span className="brand-name">PrepMate</span>
          <span className="brand-sub">by Gothwad Tech</span>
        </div>
      </div>

      <div className="header-actions">
        {renderSyncBadge()}

        {/* Study Timer Header Quick Button */}
        <button
          type="button"
          className="btn-icon"
          onClick={() => openTimer()}
          title={isRunning ? `Timer active: ${timeFormatted}` : 'Open Study Timer'}
          id="header-timer-btn"
          aria-label="Study Timer"
          style={{
            position: 'relative',
            background: isRunning ? 'var(--primary-container)' : undefined,
            color: isRunning ? 'var(--primary)' : 'var(--text-secondary)',
            borderColor: isRunning ? 'var(--primary)' : undefined,
          }}
        >
          <ClockIcon size={18} color={isRunning ? 'var(--primary)' : 'currentColor'} />
          {isRunning && (
            <span
              style={{
                position: 'absolute',
                top: '2px',
                right: '2px',
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: 'var(--flame)',
                boxShadow: '0 0 6px var(--flame)',
              }}
            />
          )}
        </button>

        <span
          style={{
            fontSize: '11px',
            fontWeight: 600,
            padding: '3px 8px',
            borderRadius: '12px',
            background: 'var(--surface-variant)',
            color: 'var(--text-secondary)',
          }}
          id="active-tab-badge"
        >
          {activeTabTitle}
        </span>
        <button
          className="btn-icon"
          onClick={onToggleTheme}
          title={theme === 'light' ? 'Switch to Dark mode' : 'Switch to Light mode'}
          id="theme-toggle-btn"
          aria-label="Toggle light and dark theme"
        >
          {theme === 'light' ? <MoonIcon size={20} /> : <SunIcon size={20} />}
        </button>
      </div>
    </header>
  );
};

