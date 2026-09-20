import React from 'react';
import { WifiOffIcon, RefreshCwIcon, SlidersIcon } from '../icons/SvgIcons';

interface OfflineBannerProps {
  isOnline: boolean;
  isSimulatingOffline: boolean;
  pendingCount: number;
  onOpenQueueInspector: () => void;
  onToggleSimulateOffline?: () => void;
  onSyncNow: () => void;
}

export const OfflineBanner: React.FC<OfflineBannerProps> = ({
  isOnline,
  isSimulatingOffline,
  pendingCount,
  onOpenQueueInspector,
  onToggleSimulateOffline,
  onSyncNow,
}) => {
  // Only show banner if actually offline or offline simulation is turned on
  if (isOnline && !isSimulatingOffline) {
    return null;
  }

  return (
    <div
      id="offline-status-banner"
      role="alert"
      style={{
        backgroundColor: isSimulatingOffline ? 'var(--secondary-container, #F3E8FF)' : 'var(--warning-container, #FEF3C7)',
        borderBottom: isSimulatingOffline ? '1px solid #D8B4FE' : '1px solid var(--warning, #F59E0B)',
        color: isSimulatingOffline ? '#6B21A8' : '#92400E',
        padding: '6px 12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '11.5px',
        fontWeight: 600,
        zIndex: 40,
        position: 'sticky',
        top: '52px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: 0 }}>
        <WifiOffIcon size={16} color={isSimulatingOffline ? '#9333EA' : '#D97706'} />
        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          <span>
            {isSimulatingOffline ? '🧪 Simulated Offline Mode' : '📡 Offline Mode'} •{' '}
          </span>
          <span style={{ fontWeight: 400 }}>
            {pendingCount > 0 ? `${pendingCount} changes queued locally` : 'All changes safely saved in cache'}
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
        <button
          type="button"
          onClick={onOpenQueueInspector}
          id="offline-banner-queue-btn"
          style={{
            background: 'none',
            border: 'none',
            color: 'inherit',
            fontSize: '11px',
            fontWeight: 700,
            textDecoration: 'underline',
            cursor: 'pointer',
            padding: '2px 4px',
          }}
        >
          Manage Queue
        </button>

        {isSimulatingOffline && onToggleSimulateOffline ? (
          <button
            type="button"
            onClick={onToggleSimulateOffline}
            id="offline-banner-go-online-btn"
            style={{
              backgroundColor: '#9333EA',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: 'var(--radius-pill)',
              padding: '2px 8px',
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Go Online
          </button>
        ) : (
          <button
            type="button"
            onClick={onSyncNow}
            id="offline-banner-sync-btn"
            style={{
              backgroundColor: '#D97706',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: 'var(--radius-pill)',
              padding: '2px 8px',
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <RefreshCwIcon size={12} /> Sync
          </button>
        )}
      </div>
    </div>
  );
};
