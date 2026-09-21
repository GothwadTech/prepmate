import React from 'react';
import { Button } from '../common/Button';
import { CheckCircle2Icon } from '../icons/SvgIcons';
import { ConflictResolutionLog } from '../../types';

interface SyncConflictLogsListProps {
  conflictLogs: ConflictResolutionLog[];
  onClearConflictLogs: () => void;
}

export const SyncConflictLogsList: React.FC<SyncConflictLogsListProps> = ({
  conflictLogs,
  onClearConflictLogs,
}) => {
  return (
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
  );
};
