import { AppNotification } from '../types';

export const NOTIFICATIONS_STORAGE_KEY = 'prepmate_in_app_notifications';
export const LAST_REMINDER_CHECK_KEY = 'prepmate_last_reminder_date';

export const initialSeedNotifications: AppNotification[] = [
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
