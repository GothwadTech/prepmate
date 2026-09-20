import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import {
  WifiIcon,
  WifiOffIcon,
  RefreshCwIcon,
  TrashIcon,
  CheckCircle2Icon,
  CloseIcon,
  SlidersIcon,
  CloudCheckIcon,
  SparklesIcon,
} from '../icons/SvgIcons';
import { QueuedMutation, ConflictResolutionLog, SyncStatus } from '../../types';

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

  const formatTime = (timestamp: number | string) => {
    const d = new Date(timestamp);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.55)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1100,
        padding: '16px',
        backdropFilter: 'blur(2px)',
      }}
      onClick={onClose}
      id="sync-queue-inspector-overlay"
    >
      <div
        style={{
          backgroundColor: 'var(--surface)',
          borderRadius: 'var(--radius-lg)',
          maxWidth: '440px',
          width: '100%',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 12px 36px rgba(0, 0, 0, 0.25)',
          border: '1px solid var(--border)',
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
        id="sync-queue-inspector-dialog"
      >
        {/* Header */}
        <div
          style={{
            padding: '14px 16px',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--surface-variant)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: isOnline ? 'var(--success-container)' : 'var(--warning-container)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: isOnline ? 'var(--success)' : 'var(--warning)',
              }}
            >
              {isOnline ? <WifiIcon size={18} /> : <WifiOffIcon size={18} />}
            </div>
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                Sync & Queue Manager
              </h3>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                Phase 16: Local-First Offline & Conflict Engine
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              padding: '4px',
            }}
            id="close-queue-inspector-btn"
          >
            <CloseIcon size={18} />
          </button>
        </div>

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
        <div style={{ padding: '14px 16px', overflowY: 'auto', flex: 1, maxHeight: '380px' }}>
          {/* 1. Queue Items List */}
          {activeTab === 'queue' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {pendingQueue.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '32px 16px', color: 'var(--text-secondary)' }}>
                  <CloudCheckIcon size={36} color="var(--success)" style={{ margin: '0 auto 8px auto' }} />
                  <div style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '14px' }}>
                    Queue is completely empty!
                  </div>
                  <p style={{ fontSize: '12px', margin: '4px 0 0 0' }}>
                    All tasks, goals, and daily study logs are synchronized with Firestore.
                  </p>
                </div>
              ) : (
                pendingQueue.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      padding: '10px 12px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'var(--surface-variant)',
                      border: '1px solid var(--border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '8px',
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span
                          style={{
                            fontSize: '10px',
                            fontWeight: 800,
                            padding: '2px 5px',
                            borderRadius: 'var(--radius-xs)',
                            backgroundColor:
                              item.operation === 'create'
                                ? 'var(--success-container)'
                                : item.operation === 'delete'
                                ? '#FEE2E2'
                                : 'var(--primary-container)',
                            color:
                              item.operation === 'create'
                                ? 'var(--success)'
                                : item.operation === 'delete'
                                ? '#DC2626'
                                : 'var(--primary)',
                            textTransform: 'uppercase',
                          }}
                        >
                          {item.operation}
                        </span>
                        <strong style={{ fontSize: '12px', color: 'var(--text-primary)' }}>
                          {item.collection.toUpperCase()}
                        </strong>
                      </div>
                      <div
                        style={{
                          fontSize: '11px',
                          color: 'var(--text-secondary)',
                          marginTop: '2px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        Doc: {item.data?.title || item.docId}
                      </div>
                      <div style={{ fontSize: '10px', color: 'var(--text-tertiary)', marginTop: '2px' }}>
                        Queued at {formatTime(item.timestamp)} • Retries: {item.retryCount || 0}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => onRemoveQueueItem(item.id)}
                      title="Discard this queued mutation"
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-secondary)',
                        cursor: 'pointer',
                        padding: '4px',
                      }}
                    >
                      <TrashIcon size={15} color="var(--danger)" />
                    </button>
                  </div>
                ))
              )}

              {pendingQueue.length > 0 && (
                <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onClearQueue}
                    style={{ flex: 1, color: 'var(--danger)', borderColor: 'var(--border)' }}
                  >
                    Clear All ({pendingQueue.length})
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleSync}
                    disabled={syncing || !isOnline}
                    leftIcon={<RefreshCwIcon size={14} />}
                    style={{ flex: 1 }}
                  >
                    {syncing ? 'Syncing...' : 'Sync Queue Now'}
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* 2. Conflict Logs */}
          {activeTab === 'conflicts' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div
                style={{
                  padding: '8px 10px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--primary-container)',
                  fontSize: '11px',
                  color: 'var(--primary)',
                  lineHeight: 1.4,
                }}
              >
                <strong>Conflict Resolution Strategy:</strong> Smart Merge + Last-Write-Wins (LWW). Local completions and notes are preserved when syncing across devices.
              </div>

              {conflictLogs.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '24px 16px', color: 'var(--text-secondary)' }}>
                  <CheckCircle2Icon size={32} color="var(--success)" style={{ margin: '0 auto 6px auto' }} />
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '13px' }}>
                    No sync conflicts recorded!
                  </div>
                  <p style={{ fontSize: '11px', margin: '2px 0 0 0' }}>
                    All local and cloud document timestamps were seamlessly aligned.
                  </p>
                </div>
              ) : (
                conflictLogs.map((log) => (
                  <div
                    key={log.id}
                    style={{
                      padding: '8px 10px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'var(--surface-variant)',
                      border: '1px solid var(--border)',
                      fontSize: '11.5px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <strong style={{ color: 'var(--text-primary)' }}>{log.docTitle}</strong>
                      <span
                        style={{
                          fontSize: '9.5px',
                          fontWeight: 700,
                          backgroundColor: 'var(--secondary-container)',
                          color: 'var(--secondary)',
                          padding: '1px 5px',
                          borderRadius: 'var(--radius-xs)',
                        }}
                      >
                        {log.resolutionStrategy}
                      </span>
                    </div>
                    <p style={{ margin: '3px 0', color: 'var(--text-secondary)', fontSize: '11px' }}>
                      {log.details}
                    </p>
                    <div style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>
                      Resolved at {new Date(log.resolvedAt).toLocaleTimeString()}
                    </div>
                  </div>
                ))
              )}

              {conflictLogs.length > 0 && (
                <Button variant="outline" size="sm" onClick={onClearConflictLogs} isFullWidth>
                  Clear Conflict Log History
                </Button>
              )}
            </div>
          )}

          {/* 3. Offline Simulation & Settings */}
          {activeTab === 'controls' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div
                style={{
                  padding: '12px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: isSimulatingOffline ? 'var(--secondary-container)' : 'var(--surface-variant)',
                  border: isSimulatingOffline ? '1px solid var(--secondary)' : '1px solid var(--border)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-primary)' }}>
                      Simulate Offline Mode
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      Cut network connection inside app to test instant optimistic UI & queueing.
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={onToggleSimulateOffline}
                    style={{
                      padding: '6px 12px',
                      borderRadius: 'var(--radius-pill)',
                      border: 'none',
                      backgroundColor: isSimulatingOffline ? 'var(--secondary)' : 'var(--primary)',
                      color: '#FFFFFF',
                      fontSize: '11px',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                    id="toggle-offline-simulation-btn"
                  >
                    {isSimulatingOffline ? 'Exit Offline' : 'Go Offline'}
                  </button>
                </div>
              </div>

              {/* Spark Free Tier Limits info */}
              <div
                style={{
                  padding: '10px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--surface-variant)',
                  border: '1px solid var(--border)',
                  fontSize: '11.5px',
                }}
              >
                <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '4px' }}>
                  🛡️ Firebase Spark Free-Tier Safeguards:
                </strong>
                <ul style={{ margin: 0, paddingLeft: '16px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  <li>50,000 document reads/day protected by 10-minute client cache.</li>
                  <li>20,000 document writes/day conserved via mutation deduplication.</li>
                  <li>Offline queue automatically flushes with exponential backoff on reconnection.</li>
                </ul>
              </div>
            </div>
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
  );
};
