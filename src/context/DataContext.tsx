/**
 * Prepmate - Data Context
 * Modular unified state management combining Firestore, Cache Layer, and Offline Queue.
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { UserStats } from '../types';
import { DataContextType } from './dataContextTypes';
import { useQueueIntegration } from './useQueueIntegration';
import { usePartnerIntegration } from './usePartnerIntegration';
import { useNotificationIntegration } from './useNotificationIntegration';
import { useStudyOperations } from './useStudyOperations';

export type { DataContextType };

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, showToast } = useAuth();
  const userId = user?.uid || 'guest-aspirant';

  const [stats, setStats] = useState<UserStats>({
    todayStudyMinutes: 0,
    tasksCompletedToday: 0,
    totalTasksToday: 0,
    streakDays: 0,
    longestStreakDays: 0,
    totalActiveDays: 0,
    streakShields: 0,
    targetYear: user?.targetYear || '2026',
    targetScore: user?.targetScore || 685,
    physicsProgress: 0,
    chemistryProgress: 0,
    biologyProgress: 0,
  });

  // Keep target year and score synced with user profile
  useEffect(() => {
    if (user?.targetYear || user?.targetScore) {
      setStats((prev) => ({
        ...prev,
        targetYear: user.targetYear || prev.targetYear,
        targetScore: user.targetScore || prev.targetScore,
      }));
    }
  }, [user?.targetYear, user?.targetScore]);

  const updateStats = (newStats: Partial<UserStats>) => {
    setStats((prev) => ({ ...prev, ...newStats }));
  };

  // 1. Study operations: Tasks, Goals, Sessions, Daily Logs & Streaks
  const studyOps = useStudyOperations({
    userId,
    stats,
    setStats,
    showToast,
  });

  // 2. Queue & offline synchronization
  const queueOps = useQueueIntegration(showToast);

  // 3. Partner system
  const partnerOps = usePartnerIntegration(user, userId, stats, showToast);

  // 4. Notifications & study reminders
  const notifOps = useNotificationIntegration(showToast, stats, partnerOps.activePartner);

  return (
    <DataContext.Provider
      value={{
        // Study operations
        tasks: studyOps.tasks,
        goals: studyOps.goals,
        sessions: studyOps.sessions,
        dailyLogs: studyOps.dailyLogs,
        streakStats: studyOps.streakStats,
        loadingData: studyOps.loadingData,
        addTask: studyOps.addTask,
        toggleTask: studyOps.toggleTask,
        deleteTask: studyOps.deleteTask,
        updateTaskItem: studyOps.updateTaskItem,
        addGoal: studyOps.addGoal,
        toggleGoal: studyOps.toggleGoal,
        deleteGoal: studyOps.deleteGoal,
        updateGoalItem: studyOps.updateGoalItem,
        logStudySession: studyOps.logStudySession,
        deleteSession: studyOps.deleteSession,
        saveDailyReflection: studyOps.saveDailyReflection,
        useStreakShield: studyOps.useStreakShield,
        syncNow: studyOps.syncNow,

        // Core stats
        stats,
        updateStats,

        // Queue & Sync
        syncStatus: queueOps.syncStatus,
        isOnline: queueOps.isOnline,
        pendingCount: queueOps.pendingCount,
        isSimulatingOffline: queueOps.isSimulatingOffline,
        pendingQueueList: queueOps.pendingQueueList,
        conflictLogs: queueOps.conflictLogs,
        toggleSimulateOffline: queueOps.toggleSimulateOffline,
        removeQueueItem: queueOps.removeQueueItem,
        clearQueue: queueOps.clearQueue,
        clearConflictLogs: queueOps.clearConflictLogs,

        // Partner system
        receivedRequests: partnerOps.receivedRequests,
        sentRequests: partnerOps.sentRequests,
        pendingPartnerRequestsCount: partnerOps.pendingPartnerRequestsCount,
        activePartnership: partnerOps.activePartnership,
        activePartner: partnerOps.activePartner,
        refreshPartnerData: partnerOps.refreshPartnerData,
        searchPartners: partnerOps.searchPartners,
        sendPartnerRequest: partnerOps.sendPartnerRequest,
        acceptPartnerRequest: partnerOps.acceptPartnerRequest,
        rejectPartnerRequest: partnerOps.rejectPartnerRequest,
        cancelPartnerRequest: partnerOps.cancelPartnerRequest,
        endCurrentPartnership: partnerOps.endCurrentPartnership,
        sendPartnerCheer: partnerOps.sendPartnerCheer,

        // Notifications
        notifications: notifOps.notifications,
        unreadNotifCount: notifOps.unreadNotifCount,
        markNotifAsRead: notifOps.markNotifAsRead,
        markAllNotifsAsRead: notifOps.markAllNotifsAsRead,
        deleteNotification: notifOps.deleteNotification,
        clearAllNotifs: notifOps.clearAllNotifs,
        sendTestNotification: notifOps.sendTestNotification,
        requestNotificationPermission: notifOps.requestNotificationPermission,
        hasBrowserNotificationPermission: notifOps.hasBrowserNotificationPermission,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
