import React, { useState } from 'react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { QueuedMutation, ConflictResolutionLog, SyncStatus } from '../../types';
import { SyncQueueHeader } from './SyncQueueHeader';
import { SyncQueueList } from './SyncQueueList';
import { SyncConflictLogsList } from './SyncConflictLogsList';
import { SyncControlsSection } from './SyncControlsSection';

interface SyncQueueInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  syncStatus: SyncStatus;
  isOnline: boolean;
  isSimulatingOffline: boolean;
  onToggleSimulateOffline: () => void;
  pendingQueue: QueuedMutation[];
  conflictLogs: ConflictResolutionLog[];
  onRemoveQueueItem: (id: string) => void;
  onClearQueue: () => void;
  onClearConflictLogs: () => void;
  onSyncNow: () => Promise<void>;
}

export const SyncQueueInspectorModal: React.FC<SyncQueueInspectorModalProps> = ({
  isOpen,
  onClose,
  syncStatus,
  isOnline,
  isSimulatingOffline,
  onToggleSimulateOffline,
  pendingQueue,
  conflictLogs,
  onRemoveQueueItem,
  onClearQueue,
  onClearConflictLogs,
  onSyncNow,
}) => {
  const [activeTab, setActiveTab] = useState<'queue' | 'conflicts' | 'controls'>('queue');
  const [syncing, setSyncing] = useState(false);

  if (!isOpen) return null;

  const handleSync = async () => {
    setSyncing(true);
    try {
      await onSyncNow();
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'stretch',
        overflow: 'hidden',
      }}
      id="sync-queue-inspector-dialog"
    >
      <div
        style={{
          width: '100%',
          maxWidth: '480px',
          height: '100%',
          backgroundColor: 'var(--bg)',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 0 28px rgba(0, 0, 0, 0.2)',
        }}
      >
        {/* 1. Header */}
        <SyncQueueHeader
          onClose={onClose}
          isOnline={isOnline}
          syncing={syncing}
          onSync={handleSync}
        />

        {/* 2. Main Body Container */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            minHeight: 0,
            width: '100%',
            boxSizing: 'border-box',
          }}
        >
        {/* Status Bar */}
        <div
          style={{
            padding: '10px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'var(--surface)',
            borderBottom: '1px solid var(--border)',
            fontSize: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor:
                  syncStatus === 'synced'
                    ? 'var(--success)'
                    : syncStatus === 'offline'
                    ? '#EF4444'
                    : 'var(--primary)',
              }}
            />
            <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
              Status: {syncStatus.toUpperCase()}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Badge variant={pendingQueue.length > 0 ? 'primary' : 'success'}>
              {pendingQueue.length} Queued
            </Badge>
            <Badge variant="neutral">{conflictLogs.length} Conflicts Logged</Badge>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid var(--border)',
            backgroundColor: 'var(--surface-variant)',
          }}
        >
          <button
            type="button"
            onClick={() => setActiveTab('queue')}
            style={{
              flex: 1,
              padding: '10px 0',
              border: 'none',
              backgroundColor: activeTab === 'queue' ? 'var(--surface)' : 'transparent',
              color: activeTab === 'queue' ? 'var(--primary)' : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: '12px',
              cursor: 'pointer',
              borderBottom: activeTab === 'queue' ? '2px solid var(--primary)' : 'none',
            }}
            id="tab-queue-items-btn"
          >
            Offline Queue ({pendingQueue.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('conflicts')}
            style={{
              flex: 1,
              padding: '10px 0',
              border: 'none',
              backgroundColor: activeTab === 'conflicts' ? 'var(--surface)' : 'transparent',
              color: activeTab === 'conflicts' ? 'var(--primary)' : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: '12px',
              cursor: 'pointer',
              borderBottom: activeTab === 'conflicts' ? '2px solid var(--primary)' : 'none',
            }}
            id="tab-conflicts-btn"
          >
            Conflict Logs ({conflictLogs.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('controls')}
            style={{
              flex: 1,
              padding: '10px 0',
              border: 'none',
              backgroundColor: activeTab === 'controls' ? 'var(--surface)' : 'transparent',
              color: activeTab === 'controls' ? 'var(--primary)' : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: '12px',
              cursor: 'pointer',
              borderBottom: activeTab === 'controls' ? '2px solid var(--primary)' : 'none',
            }}
            id="tab-offline-settings-btn"
          >
            Simulation & Settings
          </button>
        </div>

        {/* Tab Contents */}
        <div style={{ padding: '16px', overflowY: 'auto', flex: 1 }}>
          {activeTab === 'queue' && (
            <SyncQueueList
              pendingQueue={pendingQueue}
              onRemoveQueueItem={onRemoveQueueItem}
              onClearQueue={onClearQueue}
              onSync={handleSync}
              syncing={syncing}
              isOnline={isOnline}
            />
          )}

          {activeTab === 'conflicts' && (
            <SyncConflictLogsList
              conflictLogs={conflictLogs}
              onClearConflictLogs={onClearConflictLogs}
            />
          )}

          {activeTab === 'controls' && (
            <SyncControlsSection
              isSimulatingOffline={isSimulatingOffline}
              onToggleSimulateOffline={onToggleSimulateOffline}
            />
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '12px 16px',
            borderTop: '1px solid var(--border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: 'var(--surface-variant)',
          }}
        >
          <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
            Network: <strong style={{ color: isOnline ? 'var(--success)' : '#EF4444' }}>{isOnline ? 'Online' : 'Offline'}</strong>
          </span>
          <Button variant="primary" size="sm" onClick={onClose}>
            Done
          </Button>
        </div>
      </div>
    </div>
  </div>
);
};
