/**
 * Prepmate - Notification & Reminder Service (Phase 15)
 * Handles Daily Study Reminders, Streak Warnings, and Partner Activity Notifications.
 * Supports in-app Notification Center and Browser Web Notifications API.
 */

import { AppNotification, NotificationType, UserStats, PartnerProfile } from '../types';
import { NOTIFICATIONS_STORAGE_KEY, initialSeedNotifications } from './notificationSeed';
import { evaluateDailyReminders } from './reminderEvaluator';

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
        this.notifications = [...initialSeedNotifications];
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

  public checkAndGenerateReminders(stats: UserStats, partner: PartnerProfile | null) {
    evaluateDailyReminders(stats, partner, this.notifications, (n) => this.addNotification(n));
  }

  public async requestNotificationPermission(): Promise<NotificationPermission | 'unsupported'> {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return 'unsupported';
    }
    if (Notification.permission === 'granted') {
      return 'granted';
    }
    return await Notification.requestPermission();
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
        console.warn('Could not launch native browser notification:', e);
      }
    }
  }

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
          title: '⚡ Prepmate System Notice',
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
