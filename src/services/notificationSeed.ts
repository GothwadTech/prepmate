import { AppNotification } from '../types';

export const NOTIFICATIONS_STORAGE_KEY = 'prepmate_in_app_notifications';
export const LAST_REMINDER_CHECK_KEY = 'prepmate_last_reminder_date';

export const initialSeedNotifications: AppNotification[] = [
  {
    id: 'notif-welcome-1',
    type: 'daily_reminder',
    title: '🩺 Welcome to Prepmate',
    message: 'NEET UG preparation tracker me aapka swagat hai! Apne daily syllabus targets set karein aur consistency banayein.',
    timestamp: new Date().toISOString(),
    read: false,
    actionTab: 'tasks',
    actionLabel: 'Add First Task',
    icon: '🎯',
  },
];
