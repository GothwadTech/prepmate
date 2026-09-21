import React, { useState } from 'react';
import { Button } from '../common/Button';
import { SparklesIcon } from '../icons/SvgIcons';
import { NotificationType } from '../../types';

interface NotificationFooterActionsProps {
  unreadCount: number;
  totalCount: number;
  onMarkAllAsRead: () => void;
  onClearAll: () => void;
  onSendTestNotification: (type: NotificationType) => void;
}

export const NotificationFooterActions: React.FC<NotificationFooterActionsProps> = ({
  unreadCount,
  totalCount,
  onMarkAllAsRead,
  onClearAll,
  onSendTestNotification,
}) => {
  const [showTestMenu, setShowTestMenu] = useState(false);

  return (
    <>
      {/* Quick Test Menu Trigger */}
      {showTestMenu && (
        <div
          style={{
            padding: '10px 16px',
            backgroundColor: 'var(--surface-variant)',
            borderTop: '1px solid var(--border)',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
          }}
        >
          <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-primary)' }}>
            ⚡ Send Simulated Reminder (Phase 15 Test):
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                onSendTestNotification('daily_reminder');
                setShowTestMenu(false);
              }}
              style={{ fontSize: '10.5px', padding: '4px 8px' }}
            >
              🌅 Morning Kickoff
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                onSendTestNotification('streak_warning');
                setShowTestMenu(false);
              }}
              style={{ fontSize: '10.5px', padding: '4px 8px' }}
            >
              🔥 Streak Alert
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                onSendTestNotification('partner_activity');
                setShowTestMenu(false);
              }}
              style={{ fontSize: '10.5px', padding: '4px 8px' }}
            >
              🤝 Partner Cheer
            </Button>
          </div>
        </div>
      )}

      {/* Action Footer */}
      <div
        style={{
          padding: '10px 16px',
          borderTop: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'var(--surface-variant)',
        }}
      >
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            onClick={onMarkAllAsRead}
            disabled={unreadCount === 0}
            style={{
              background: 'none',
              border: 'none',
              color: unreadCount > 0 ? 'var(--primary)' : 'var(--text-tertiary)',
              fontSize: '11.5px',
              fontWeight: 700,
              cursor: unreadCount > 0 ? 'pointer' : 'default',
            }}
            id="mark-all-read-btn"
          >
            Mark all read
          </button>
          <span style={{ color: 'var(--border)' }}>•</span>
          <button
            type="button"
            onClick={onClearAll}
            disabled={totalCount === 0}
            style={{
              background: 'none',
              border: 'none',
              color: totalCount > 0 ? 'var(--danger)' : 'var(--text-tertiary)',
              fontSize: '11.5px',
              cursor: totalCount > 0 ? 'pointer' : 'default',
            }}
            id="clear-all-notifs-btn"
          >
            Clear all
          </button>
        </div>

        <button
          type="button"
          onClick={() => setShowTestMenu((prev) => !prev)}
          style={{
            padding: '4px 10px',
            borderRadius: 'var(--radius-pill)',
            border: '1px solid var(--border)',
            backgroundColor: 'var(--surface)',
            color: 'var(--text-secondary)',
            fontSize: '11px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
          id="toggle-test-notif-menu-btn"
        >
          <SparklesIcon size={12} color="var(--primary)" /> Test Alerts
        </button>
      </div>
    </>
  );
};
