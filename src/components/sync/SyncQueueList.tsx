import React from 'react';
import { Button } from '../common/Button';
import { TrashIcon, CloudCheckIcon, RefreshCwIcon } from '../icons/SvgIcons';
import { QueuedMutation } from '../../types';

interface SyncQueueListProps {
  pendingQueue: QueuedMutation[];
  onRemoveQueueItem: (id: string) => void;
  onClearQueue: () => void;
  onSync: () => void;
  syncing: boolean;
  isOnline: boolean;
}

export const SyncQueueList: React.FC<SyncQueueListProps> = ({
  pendingQueue,
  onRemoveQueueItem,
  onClearQueue,
  onSync,
  syncing,
  isOnline,
}) => {
  const formatTime = (timestamp: number | string) => {
    const d = new Date(timestamp);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
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
            onClick={onSync}
            disabled={syncing || !isOnline}
            leftIcon={<RefreshCwIcon size={14} />}
            style={{ flex: 1 }}
          >
            {syncing ? 'Syncing...' : 'Sync Queue Now'}
          </Button>
        </div>
      )}
    </div>
  );
};
