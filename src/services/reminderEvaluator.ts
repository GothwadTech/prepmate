import { AppNotification, UserStats, PartnerProfile } from '../types';
import { LAST_REMINDER_CHECK_KEY } from './notificationSeed';

export function evaluateDailyReminders(
  stats: UserStats,
  partner: PartnerProfile | null,
  currentNotifications: AppNotification[],
  addNotificationFn: (n: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => void
) {
  const todayStr = new Date().toISOString().split('T')[0];
  const hour = new Date().getHours();
  const lastCheckDate = localStorage.getItem(LAST_REMINDER_CHECK_KEY);

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
    // 1. Morning Kickoff Reminder
    if (prefs.morningReminder && hour >= 6 && hour < 14) {
      if ((stats.todayStudyMinutes || 0) < 30) {
        const alreadyHasTodayMorning = currentNotifications.some(
          (n) => n.type === 'daily_reminder' && n.timestamp.startsWith(todayStr)
        );
        if (!alreadyHasTodayMorning) {
          addNotificationFn({
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

    // 2. Evening Streak Warning Alert
    if (prefs.streakWarning && hour >= 19) {
      const alreadyHasStreakWarn = currentNotifications.some(
        (n) => n.type === 'streak_warning' && n.timestamp.startsWith(todayStr)
      );
      if (!alreadyHasStreakWarn && stats.streakDays > 0 && stats.tasksCompletedToday === 0) {
        addNotificationFn({
          type: 'streak_warning',
          title: `🔥 Streak Alert: Save Your ${stats.streakDays}-Day Streak!`,
          message: 'Aaj raat 12 baje se pehle kam se kam 1 pending task mark karein ya streak freeze activate karein.',
          actionTab: 'tasks',
          actionLabel: 'Complete Task',
          icon: '🔥',
        });
      }
    }

    localStorage.setItem(LAST_REMINDER_CHECK_KEY, todayStr);
  }
}
