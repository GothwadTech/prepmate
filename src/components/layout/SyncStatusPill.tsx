import React from 'react';
import { WifiIcon, WifiOffIcon, RefreshCwIcon } from '../icons/SvgIcons';
import { SyncStatus } from '../../types';

interface SyncStatusPillProps {
  onOpenSyncQueue: () => void;
  syncStatus: SyncStatus;
  isOnline: boolean;
  pendingCount: number;
}

export const SyncStatusPill: React.FC<SyncStatusPillProps> = ({
  onOpenSyncQueue,
  syncStatus,
  isOnline,
  pendingCount,
}) => {
  return (
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
  );
};
