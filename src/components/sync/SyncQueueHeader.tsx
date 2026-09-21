import React from 'react';
import { ChevronLeftIcon } from '../icons/SvgIcons';

interface SyncQueueHeaderProps {
  onClose: () => void;
  isOnline: boolean;
  syncing: boolean;
  onSync: () => void;
}

export const SyncQueueHeader: React.FC<SyncQueueHeaderProps> = ({
  onClose,
  isOnline,
  syncing,
  onSync,
}) => {
  return (
    <header
      className="app-header"
      id="sync-queue-header"
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
        id="close-queue-inspector-btn"
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
          Sync & Network
        </span>
        <span
          style={{
            fontSize: '10.5px',
            fontWeight: 800,
            padding: '2px 7px',
            borderRadius: '12px',
            backgroundColor: isOnline ? 'rgba(52, 168, 83, 0.15)' : 'rgba(239, 68, 68, 0.15)',
            color: isOnline ? '#10B981' : '#EF4444',
            border: isOnline ? '1px solid rgba(52, 168, 83, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)',
          }}
        >
          {isOnline ? 'Online' : 'Offline'}
        </span>
      </div>

      <div style={{ width: '64px', display: 'flex', justifyContent: 'flex-end' }}>
        <button
          type="button"
          onClick={onSync}
          disabled={syncing || !isOnline}
          id="sync-now-header-btn"
          style={{
            background: 'none',
            border: 'none',
            color: isOnline ? 'var(--primary)' : 'var(--text-tertiary)',
            fontSize: '12px',
            fontWeight: 700,
            cursor: isOnline ? 'pointer' : 'not-allowed',
            padding: '4px',
          }}
        >
          {syncing ? 'Syncing...' : 'Sync'}
        </button>
      </div>
    </header>
  );
};
