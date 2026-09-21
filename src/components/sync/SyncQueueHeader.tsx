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
        id="close-queue-inspector-btn"
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
          Sync & Network
        </span>
        <span
          style={{
            fontSize: '10.5px',
            fontWeight: 800,
            padding: '2px 7px',
            borderRadius: '12px',
            backgroundColor: isOnline ? 'rgba(52, 168, 83, 0.25)' : 'rgba(239, 68, 68, 0.25)',
            color: isOnline ? '#34D399' : '#FCA5A5',
            border: isOnline ? '1px solid rgba(52, 168, 83, 0.4)' : '1px solid rgba(239, 68, 68, 0.4)',
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
            color: isOnline ? '#60A5FA' : '#6B7280',
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
