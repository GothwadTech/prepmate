import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import {
  BellIcon,
  CloseIcon,
  CheckCircle2Icon,
  TrashIcon,
  SparklesIcon,
  ClockIcon,
  SendIcon,
} from '../icons/SvgIcons';
import { AppNotification, NotificationType, AppTab } from '../../types';

interface NotificationCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  unreadCount: number;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onDeleteNotification: (id: string) => void;
  onClearAll: () => void;
  onNavigateTab: (tab: AppTab) => void;
  onSendTestNotification: (type: NotificationType) => void;
  onRequestPermission: () => Promise<void>;
  hasBrowserPermission: boolean;
}

export const NotificationCenterModal: React.FC<NotificationCenterModalProps> = ({
  isOpen,
  onClose,
  notifications,
  unreadCount,
  onMarkAsRead,
  onMarkAllAsRead,
  onDeleteNotification,
  onClearAll,
  onNavigateTab,
  onSendTestNotification,
  onRequestPermission,
  hasBrowserPermission,
}) => {
  const [filter, setFilter] = useState<'all' | 'reminders' | 'partners'>('all');
  const [showTestMenu, setShowTestMenu] = useState(false);

  if (!isOpen) return null;

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'reminders') return n.type === 'daily_reminder' || n.type === 'streak_warning';
    if (filter === 'partners') return n.type === 'partner_activity' || n.type === 'challenge';
    return true;
  });

  const formatTimestamp = (iso: string) => {
    try {
      const diff = Date.now() - new Date(iso).getTime();
      const mins = Math.floor(diff / 60000);
      if (mins < 1) return 'Just now';
      if (mins < 60) return `${mins}m ago`;
      const hrs = Math.floor(mins / 60);
      if (hrs < 24) return `${hrs}h ago`;
      return `${Math.floor(hrs / 24)}d ago`;
    } catch {
      return 'Recently';
    }
  };

  const handleActionClick = (notif: AppNotification) => {
    onMarkAsRead(notif.id);
    if (notif.actionTab) {
      onNavigateTab(notif.actionTab);
      onClose();
    }
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
      id="notification-center-overlay"
    >
      <div
        style={{
          backgroundColor: 'var(--surface)',
          borderRadius: 'var(--radius-lg)',
          maxWidth: '430px',
          width: '100%',
          maxHeight: '88vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 12px 36px rgba(0, 0, 0, 0.25)',
          border: '1px solid var(--border)',
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
        id="notification-center-dialog"
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
                backgroundColor: 'var(--primary-container)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary)',
              }}
            >
              <BellIcon size={18} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                  Reminders & Alerts
                </h3>
                {unreadCount > 0 && (
                  <Badge variant="primary">{unreadCount} new</Badge>
                )}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                Study kickoffs, streak alerts & partner updates
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
            id="close-notif-center-btn"
          >
            <CloseIcon size={18} />
          </button>
        </div>

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

        {/* Filter Pills */}
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
            All ({notifications.length})
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

        {/* Notification Items List */}
        <div style={{ padding: '12px 16px', overflowY: 'auto', flex: 1, maxHeight: '380px' }}>
          {filteredNotifications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '36px 16px', color: 'var(--text-secondary)' }}>
              <CheckCircle2Icon size={36} color="var(--primary)" style={{ margin: '0 auto 8px auto' }} />
              <div style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '14px' }}>
                All caught up!
              </div>
              <p style={{ fontSize: '12px', margin: '4px 0 0 0' }}>
                No notifications in this tab right now. Keep studying!
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {filteredNotifications.map((n) => (
                <div
                  key={n.id}
                  style={{
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: n.read ? 'var(--surface-variant)' : 'var(--surface)',
                    border: n.read ? '1px solid var(--border)' : '1px solid var(--primary)',
                    boxShadow: n.read ? 'none' : '0 2px 6px rgba(0, 82, 204, 0.08)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    position: 'relative',
                  }}
                  id={`notif-item-${n.id}`}
                >
                  <div
                    style={{
                      fontSize: '20px',
                      flexShrink: 0,
                      marginTop: '2px',
                    }}
                  >
                    {n.icon || (n.type === 'streak_warning' ? '🔥' : n.type === 'daily_reminder' ? '🌅' : '🤝')}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
                      <strong style={{ fontSize: '12.5px', color: 'var(--text-primary)' }}>
                        {n.title}
                      </strong>
                      <span style={{ fontSize: '10px', color: 'var(--text-tertiary)', flexShrink: 0 }}>
                        {formatTimestamp(n.timestamp)}
                      </span>
                    </div>

                    <p
                      style={{
                        fontSize: '11.5px',
                        color: 'var(--text-secondary)',
                        margin: '4px 0 6px 0',
                        lineHeight: 1.4,
                      }}
                    >
                      {n.message}
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {n.actionLabel && (
                        <button
                          type="button"
                          onClick={() => handleActionClick(n)}
                          style={{
                            padding: '3px 9px',
                            borderRadius: 'var(--radius-pill)',
                            border: 'none',
                            backgroundColor: 'var(--primary)',
                            color: '#FFFFFF',
                            fontSize: '10.5px',
                            fontWeight: 700,
                            cursor: 'pointer',
                          }}
                        >
                          {n.actionLabel}
                        </button>
                      )}

                      {!n.read && (
                        <button
                          type="button"
                          onClick={() => onMarkAsRead(n.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--text-secondary)',
                            fontSize: '10.5px',
                            cursor: 'pointer',
                            textDecoration: 'underline',
                          }}
                        >
                          Mark as read
                        </button>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onDeleteNotification(n.id)}
                    title="Delete"
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-tertiary)',
                      cursor: 'pointer',
                      padding: '2px',
                      flexShrink: 0,
                    }}
                  >
                    <CloseIcon size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

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
              disabled={notifications.length === 0}
              style={{
                background: 'none',
                border: 'none',
                color: notifications.length > 0 ? 'var(--danger)' : 'var(--text-tertiary)',
                fontSize: '11.5px',
                cursor: notifications.length > 0 ? 'pointer' : 'default',
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
      </div>
    </div>
  );
};
