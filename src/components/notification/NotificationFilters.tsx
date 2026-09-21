import React from 'react';

export type NotificationFilterType = 'all' | 'reminders' | 'partners';

interface NotificationFiltersProps {
  filter: NotificationFilterType;
  setFilter: (f: NotificationFilterType) => void;
  allCount: number;
  hasBrowserPermission: boolean;
  onRequestPermission: () => Promise<void>;
}

export const NotificationFilters: React.FC<NotificationFiltersProps> = ({
  filter,
  setFilter,
  allCount,
  hasBrowserPermission,
  onRequestPermission,
}) => {
  return (
    <>
      {/* Optional Web Notification Permission Banner */}
      {!hasBrowserPermission && (
        <div
          style={{
            padding: '8px 14px',
            backgroundColor: 'var(--primary-container)',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '11.5px',
            color: 'var(--primary)',
          }}
        >
          <span>📱 Enable system alerts for study & streak reminders</span>
          <button
            type="button"
            onClick={onRequestPermission}
            style={{
              backgroundColor: 'var(--primary)',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: 'var(--radius-pill)',
              padding: '3px 8px',
              fontSize: '10.5px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
            id="enable-browser-notif-btn"
          >
            Enable
          </button>
        </div>
      )}

      {/* Filter Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '6px',
          padding: '10px 16px',
          borderBottom: '1px solid var(--border)',
          backgroundColor: 'var(--surface)',
        }}
      >
        <button
          type="button"
          onClick={() => setFilter('all')}
          style={{
            padding: '5px 12px',
            borderRadius: 'var(--radius-pill)',
            border: 'none',
            fontSize: '11.5px',
            fontWeight: 700,
            cursor: 'pointer',
            backgroundColor: filter === 'all' ? 'var(--primary)' : 'var(--surface-variant)',
            color: filter === 'all' ? '#FFFFFF' : 'var(--text-secondary)',
          }}
          id="notif-filter-all-btn"
        >
          All ({allCount})
        </button>

        <button
          type="button"
          onClick={() => setFilter('reminders')}
          style={{
            padding: '5px 12px',
            borderRadius: 'var(--radius-pill)',
            border: 'none',
            fontSize: '11.5px',
            fontWeight: 700,
            cursor: 'pointer',
            backgroundColor: filter === 'reminders' ? 'var(--primary)' : 'var(--surface-variant)',
            color: filter === 'reminders' ? '#FFFFFF' : 'var(--text-secondary)',
          }}
          id="notif-filter-reminders-btn"
        >
          🌅 Reminders
        </button>

        <button
          type="button"
          onClick={() => setFilter('partners')}
          style={{
            padding: '5px 12px',
            borderRadius: 'var(--radius-pill)',
            border: 'none',
            fontSize: '11.5px',
            fontWeight: 700,
            cursor: 'pointer',
            backgroundColor: filter === 'partners' ? 'var(--primary)' : 'var(--surface-variant)',
            color: filter === 'partners' ? '#FFFFFF' : 'var(--text-secondary)',
          }}
          id="notif-filter-partners-btn"
        >
          🤝 Partner
        </button>
      </div>
    </>
  );
};
