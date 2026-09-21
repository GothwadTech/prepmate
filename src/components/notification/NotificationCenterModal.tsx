import React, { useState } from 'react';
import { CheckCircle2Icon } from '../icons/SvgIcons';
import { AppNotification, NotificationType, AppTab } from '../../types';
import { NotificationHeader } from './NotificationHeader';
import { NotificationFilters, NotificationFilterType } from './NotificationFilters';
import { NotificationItemCard } from './NotificationItemCard';
import { NotificationFooterActions } from './NotificationFooterActions';

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
  const [filter, setFilter] = useState<NotificationFilterType>('all');

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
        inset: 0,
        zIndex: 9999,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'stretch',
        overflow: 'hidden',
      }}
      id="notification-center-dialog"
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
        {/* 1. Full-screen Consistent 54px Header */}
        <NotificationHeader
          onClose={onClose}
          unreadCount={unreadCount}
          onMarkAllAsRead={onMarkAllAsRead}
        />

        {/* 2. Main Scrollable Container */}
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
        <NotificationFilters
          filter={filter}
          setFilter={setFilter}
          allCount={notifications.length}
          hasBrowserPermission={hasBrowserPermission}
          onRequestPermission={onRequestPermission}
        />

        {/* 3. Notification Items List */}
        <div style={{ padding: '16px', overflowY: 'auto', flex: 1 }}>
          {filteredNotifications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 16px', color: 'var(--text-secondary)' }}>
              <CheckCircle2Icon size={40} color="var(--primary)" style={{ margin: '0 auto 12px auto' }} />
              <div style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '15px' }}>
                All caught up!
              </div>
              <p style={{ fontSize: '13px', margin: '6px 0 0 0' }}>
                No notifications in this tab right now. Keep studying!
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {filteredNotifications.map((n) => (
                <NotificationItemCard
                  key={n.id}
                  notification={n}
                  onActionClick={handleActionClick}
                  onMarkAsRead={onMarkAsRead}
                  onDeleteNotification={onDeleteNotification}
                  formatTimestamp={formatTimestamp}
                />
              ))}
            </div>
          )}
        </div>

        {/* 4. Action Footer & Test Menu */}
        <NotificationFooterActions
          unreadCount={unreadCount}
          totalCount={notifications.length}
          onMarkAllAsRead={onMarkAllAsRead}
          onClearAll={onClearAll}
          onSendTestNotification={onSendTestNotification}
        />
      </div>
    </div>
  </div>
);
};
