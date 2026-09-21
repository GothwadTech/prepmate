import React from 'react';

interface SyncControlsSectionProps {
  isSimulatingOffline: boolean;
  onToggleSimulateOffline: () => void;
}

export const SyncControlsSection: React.FC<SyncControlsSectionProps> = ({
  isSimulatingOffline,
  onToggleSimulateOffline,
}) => {
  return (
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
  );
};
