import React from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { CloudCheckIcon, RefreshCwIcon } from '../icons/SvgIcons';
import { SyncStatus } from '../../types';

interface ProfileCloudSyncCardProps {
  syncStatus: SyncStatus;
  pendingCount: number;
  isOnline: boolean;
  isSimulatingOffline: boolean;
  toggleSimulateOffline: () => void;
  pendingQueueLength: number;
  onOpenSyncInspector?: () => void;
  syncingCloud: boolean;
  onManualSync: () => void;
}

export const ProfileCloudSyncCard: React.FC<ProfileCloudSyncCardProps> = ({
  syncStatus,
  pendingCount,
  isOnline,
  isSimulatingOffline,
  toggleSimulateOffline,
  pendingQueueLength,
  onOpenSyncInspector,
  syncingCloud,
  onManualSync,
}) => {
  return (
    <Card
      id="firestore-cache-sync-card"
      title="Firestore Sync & Spark Free Tier Safeguard"
      subtitle="Local-first caching protects Spark limits (50k reads/20k writes daily)"
      action={
        <Badge variant={syncStatus === 'synced' ? 'success' : syncStatus === 'offline' ? 'neutral' : 'primary'}>
          {syncStatus === 'synced' ? 'Synced' : syncStatus === 'offline' ? 'Offline' : syncStatus === 'syncing' ? 'Syncing...' : 'Pending'}
        </Badge>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '8px',
            fontSize: '12px',
          }}
        >
          <div
            style={{
              padding: '8px 10px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--surface-variant)',
              border: '1px solid var(--border)',
            }}
          >
            <div style={{ color: 'var(--text-secondary)', fontSize: '11px', fontWeight: 600 }}>Local Cache</div>
            <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <CloudCheckIcon size={14} color="var(--success)" /> Active (10m TTL)
            </div>
          </div>

          <div
            style={{
              padding: '8px 10px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--surface-variant)',
              border: '1px solid var(--border)',
            }}
          >
            <div style={{ color: 'var(--text-secondary)', fontSize: '11px', fontWeight: 600 }}>Offline Queue</div>
            <div style={{ fontWeight: 700, color: pendingCount > 0 ? 'var(--warning, #B06000)' : 'var(--text-primary)', marginTop: '2px' }}>
              {pendingCount} Pending Operation{pendingCount === 1 ? '' : 's'}
            </div>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '12px',
            color: 'var(--text-secondary)',
            padding: '6px 2px',
          }}
        >
          <span>Network: <strong style={{ color: isOnline ? 'var(--success)' : '#EF4444' }}>{isOnline ? 'Connected' : 'Offline'}</strong></span>
          <span>Simulation: <strong>{isSimulatingOffline ? 'Active (Offline)' : 'Disabled (Live)'}</strong></span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <button
            type="button"
            onClick={toggleSimulateOffline}
            style={{
              padding: '8px 10px',
              borderRadius: 'var(--radius-sm)',
              border: isSimulatingOffline ? '1px solid var(--secondary)' : '1px solid var(--border)',
              backgroundColor: isSimulatingOffline ? 'var(--secondary-container)' : 'var(--surface-variant)',
              color: isSimulatingOffline ? 'var(--secondary)' : 'var(--text-primary)',
              fontSize: '11.5px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
            id="profile-toggle-sim-btn"
          >
            {isSimulatingOffline ? '🧪 Exit Offline Simulation' : '🧪 Simulate Offline'}
          </button>

          {onOpenSyncInspector ? (
            <button
              type="button"
              onClick={onOpenSyncInspector}
              style={{
                padding: '8px 10px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border)',
                backgroundColor: 'var(--surface-variant)',
                color: 'var(--text-primary)',
                fontSize: '11.5px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
              id="profile-open-queue-btn"
            >
              Inspect Queue ({pendingQueueLength})
            </button>
          ) : null}
        </div>

        <Button
          variant="outline"
          size="sm"
          isFullWidth
          leftIcon={<RefreshCwIcon size={14} />}
          onClick={onManualSync}
          disabled={syncingCloud}
          id="manual-cloud-sync-btn"
        >
          {syncingCloud ? 'Syncing with Firestore...' : 'Sync with Firestore Now'}
        </Button>
      </div>
    </Card>
  );
};
