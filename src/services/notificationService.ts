/**
 * PrepMate - Notification & Reminder Service (Phase 15)
 * Handles Daily Study Reminders, Streak Warnings, and Partner Activity Notifications.
 * Supports in-app Notification Center and Browser Web Notifications API.
 */

import { AppNotification, NotificationType, UserStats, PartnerProfile } from '../types';

const NOTIFICATIONS_STORAGE_KEY = 'prepmate_in_app_notifications';
const LAST_REMINDER_CHECK_KEY = 'prepmate_last_reminder_date';

class NotificationService {
  private notifications: AppNotification[] = [];
  private listeners: Set<(notifications: AppNotification[]) => void> = new Set();

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const stored = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
      if (stored) {
        this.notifications = JSON.parse(stored);
      } else {
        // Initial welcome notifications seed for NEET aspirants
        this.notifications = [
          {
            id: 'notif-welcome-1',
            type: 'daily_reminder',
            title: '🌅 Subah Ka Study Kickoff',
            message: 'Good morning Aspirant! High-yield NCERT chapters aur numericals solve karke aaj ka din productive banayein.',
            timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
            read: false,
            actionTab: 'tasks',
            actionLabel: 'Check Tasks',
            icon: '🌅',
          },
          {
            id: 'notif-streak-1',
            type: 'streak_warning',
            title: '🔥 Streak Flame Active!',
            message: 'Aapka 4-day unbroken study streak chal raha hai. Aaj kam se kam 2 tasks complete karke streak save rakhein.',
            timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
            read: false,
            actionTab: 'home',
            actionLabel: 'View Dashboard',
            icon: '🔥',
          },
          {
            id: 'notif-partner-1',
            type: 'partner_activity',
            title: '🤝 Partner Activity Alert',
            message: 'Aapke study partner ne Physics: Current Electricity session complete kiya! VS Board par score check karein.',
            timestamp: new Date(Date.now() - 3600000 * 8).toISOString(),
            read: true,
            actionTab: 'partners',
            actionLabel: 'Open VS Board',
            icon: '🤝',
          },
        ];
        this.saveToStorage();
      }
    } catch (e) {
      console.warn('Error loading notifications:', e);
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(this.notifications));
    } catch (e) {
      console.warn('Error saving notifications:', e);
    }
    this.notify();
  }

  private notify() {
    this.listeners.forEach((fn) => fn([...this.notifications]));
  }

  public subscribe(listener: (notifications: AppNotification[]) => void): () => void {
    this.listeners.add(listener);
    listener([...this.notifications]);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public getNotifications(): AppNotification[] {
    return [...this.notifications];
  }

  public getUnreadCount(): number {
    return this.notifications.filter((n) => !n.read).length;
  }

  public markAsRead(id: string) {
    this.notifications = this.notifications.map((n) =>
      n.id === id ? { ...n, read: true } : n
    );
    this.saveToStorage();
  }

  public markAllAsRead() {
    this.notifications = this.notifications.map((n) => ({ ...n, read: true }));
    this.saveToStorage();
  }

  public deleteNotification(id: string) {
    this.notifications = this.notifications.filter((n) => n.id !== id);
    this.saveToStorage();
  }

  public clearAll() {
    this.notifications = [];
    this.saveToStorage();
  }

  public addNotification(notification: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) {
    const newNotif: AppNotification = {
      ...notification,
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      timestamp: new Date().toISOString(),
      read: false,
    };

    // Prepend and limit to 50 items
    this.notifications = [newNotif, ...this.notifications].slice(0, 50);
    this.saveToStorage();

    // Trigger browser native notification if permitted
    this.triggerBrowserNotification(newNotif.title, newNotif.message);

    return newNotif;
  }

  /**
   * Check conditions and trigger real-time reminders
   */
  public checkAndGenerateReminders(stats: UserStats, partner: PartnerProfile | null) {
    const todayStr = new Date().toISOString().split('T')[0];
    const hour = new Date().getHours();
    const lastCheckDate = localStorage.getItem(LAST_REMINDER_CHECK_KEY);

    // Read user notification preferences
    let prefs = {
      morningReminder: true,
      streakWarning: true,
      partnerAlerts: true,
    };
    try {
      const savedPrefs = localStorage.getItem('prepmate_notifications');
      if (savedPrefs) prefs = { ...prefs, ...JSON.parse(savedPrefs) };
    } catch {
      //
    }

    if (lastCheckDate !== todayStr) {
      // 1. Morning Kickoff Reminder (if morning and hours < 1)
      if (prefs.morningReminder && hour >= 6 && hour < 14) {
        if ((stats.todayStudyMinutes || 0) < 30) {
          const alreadyHasTodayMorning = this.notifications.some(
            (n) => n.type === 'daily_reminder' && n.timestamp.startsWith(todayStr)
          );
          if (!alreadyHasTodayMorning) {
            this.addNotification({
              type: 'daily_reminder',
              title: '🌅 Morning Study Reminder',
              message: 'NEET 2026 target 680+ marks! Aaj ka study goal complete karne ke liye pehla 25-minute Pomodoro start karein.',
              actionTab: 'home',
              actionLabel: 'Start Pomodoro',
              icon: '🌅',
            });
          }
        }
      }

      // 2. Evening Streak Warning Alert (if evening and streak active but targets incomplete)
      if (prefs.streakWarning && hour >= 19) {
        if ((stats.tasksCompletedToday || 0) < 1 && (stats.todayStudyMinutes || 0) < 60) {
          const alreadyHasStreakWarning = this.notifications.some(
            (n) => n.type === 'streak_warning' && n.timestamp.startsWith(todayStr)
          );
          if (!alreadyHasStreakWarning) {
            this.addNotification({
              type: 'streak_warning',
              title: `🔥 Streak Alert: ${stats.streakDays} Days at Risk!`,
              message: `Raat hone se pehle kam se kam ek chapter revise karke daily task complete karein taaki aapka streak flame save rahe.`,
              actionTab: 'tasks',
              actionLabel: 'Complete Task',
              icon: '🔥',
            });
          }
        }
      }

      localStorage.setItem(LAST_REMINDER_CHECK_KEY, todayStr);
    }

    // 3. Partner Activity (if partner is studying right now)
    if (prefs.partnerAlerts && partner?.isStudyingNow) {
      const recentPartnerNotif = this.notifications.find(
        (n) => n.type === 'partner_activity' && Date.now() - new Date(n.timestamp).getTime() < 3600000 * 2
      );
      if (!recentPartnerNotif) {
        this.addNotification({
          type: 'partner_activity',
          title: `🤝 ${partner.name} is Studying Now!`,
          message: `${partner.name} ne ${partner.currentSubject || 'Physics'} ka live session start kiya hai. Saath me study session start karein!`,
          actionTab: 'partners',
          actionLabel: 'Join Partner',
          icon: '🤝',
        });
      }
    }
  }

  /**
   * Browser Push / Desktop Web Notification
   */
  public async requestNotificationPermission(): Promise<NotificationPermission> {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return 'denied';
    }

    try {
      const permission = await Notification.requestPermission();
      return permission;
    } catch (e) {
      console.warn('Error requesting notification permission:', e);
      return 'denied';
    }
  }

  public getNotificationPermission(): NotificationPermission | 'unsupported' {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return 'unsupported';
    }
    return Notification.permission;
  }

  private triggerBrowserNotification(title: string, body: string) {
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(title, {
          body,
          icon: '/icon-192.png',
          badge: '/icon-192.png',
        });
      } catch (e) {
        // Some mobile browsers restrict Notification constructor without service worker
        console.warn('Could not launch native browser notification:', e);
      }
    }
  }

  /**
   * Send on-demand test notifications (for user manual testing)
   */
  public sendTestNotification(type: NotificationType) {
    switch (type) {
      case 'daily_reminder':
        this.addNotification({
          type: 'daily_reminder',
          title: '🌅 Daily Study Goal Reminder (Test)',
          message: 'Target: 6 hours daily study. Aaj Physics: Rotational Motion ke 30 MCQs pending hain.',
          actionTab: 'tasks',
          actionLabel: 'Open Tasks',
          icon: '🌅',
        });
        break;
      case 'streak_warning':
        this.addNotification({
          type: 'streak_warning',
          title: '🔥 Streak Saver Alert (Test)',
          message: 'Warning: 4-day study streak pending! 1 task mark complete karke apna streak shield bachaayein.',
          actionTab: 'tasks',
          actionLabel: 'Save Streak',
          icon: '🔥',
        });
        break;
      case 'partner_activity':
        this.addNotification({
          type: 'partner_activity',
          title: '🤝 Partner Cheer Received! (Test)',
          message: 'Priya Sharma sent you a cheer: "All the best Aryan! 700+ marks pakka aayenge!"',
          actionTab: 'partners',
          actionLabel: 'View VS Board',
          icon: '🤝',
        });
        break;
      case 'challenge':
        this.addNotification({
          type: 'challenge',
          title: '⚔️ Weekly Partner Challenge Active',
          message: 'Challenge: 15 Hours Deep Study vs Partner. Currently you are leading by +2.5 hours!',
          actionTab: 'partners',
          actionLabel: 'Check Leaderboard',
          icon: '🏆',
        });
        break;
      default:
        this.addNotification({
          type: 'system',
          title: '⚡ PrepMate System Notice',
          message: 'All your offline changes have been backed up in local cache and are ready to sync.',
          actionTab: 'profile',
          actionLabel: 'View Sync Status',
          icon: '⚡',
        });
        break;
    }
  }
}

export const notificationService = new NotificationService();
