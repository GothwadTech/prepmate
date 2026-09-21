import { useState, useEffect, useCallback } from 'react';
import { AppNotification, NotificationType, UserStats, PartnerProfile } from '../types';
import { notificationService } from '../services/notificationService';

export function useNotificationIntegration(
  showToast: (msg: string, type: 'success' | 'error' | 'info') => void,
  stats: UserStats,
  activePartner: PartnerProfile | null
) {
  const [notifications, setNotifications] = useState<AppNotification[]>(() =>
    notificationService.getNotifications()
  );
  const [unreadNotifCount, setUnreadNotifCount] = useState<number>(() =>
    notificationService.getUnreadCount()
  );
  const [hasBrowserNotificationPermission, setHasBrowserNotificationPermission] = useState<boolean>(() => {
    return typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted';
  });

  useEffect(() => {
    const unsubNotif = notificationService.subscribe((list) => {
      setNotifications(list);
      setUnreadNotifCount(list.filter((n) => !n.read).length);
    });
    return unsubNotif;
  }, []);

  const markNotifAsRead = useCallback((id: string) => {
    notificationService.markAsRead(id);
  }, []);

  const markAllNotifsAsRead = useCallback(() => {
    notificationService.markAllAsRead();
  }, []);

  const deleteNotification = useCallback((id: string) => {
    notificationService.deleteNotification(id);
  }, []);

  const clearAllNotifs = useCallback(() => {
    notificationService.clearAll();
  }, []);

  const sendTestNotification = useCallback(
    (type: NotificationType) => {
      notificationService.sendTestNotification(type);
      showToast(`Test reminder sent: ${type}`, 'info');
    },
    [showToast]
  );

  const requestNotificationPermission = useCallback(async () => {
    const perm = await notificationService.requestNotificationPermission();
    setHasBrowserNotificationPermission(perm === 'granted');
    if (perm === 'granted') {
      showToast('Notifications enabled! Daily 7:00 AM kickoff & streak warnings active.', 'success');
    } else {
      showToast('Browser notifications not enabled.', 'info');
    }
  }, [showToast]);

  useEffect(() => {
    notificationService.checkAndGenerateReminders(stats, activePartner);
  }, [stats.todayStudyMinutes, stats.tasksCompletedToday, stats.streakDays, activePartner?.isStudyingNow]);

  return {
    notifications,
    unreadNotifCount,
    markNotifAsRead,
    markAllNotifsAsRead,
    deleteNotification,
    clearAllNotifs,
    sendTestNotification,
    requestNotificationPermission,
    hasBrowserNotificationPermission,
  };
}
