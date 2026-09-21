import { useState, useEffect, useCallback, useMemo } from 'react';
import { TaskItem, StudySession, DailyStudyLog, UserStats } from '../types';
import { syncManager } from '../services/syncManager';
import { cacheService } from '../services/cacheService';
import { calculateStreak, formatDateKey, StreakStats } from '../utils/streakUtils';
import { useGoalOperations } from './useGoalOperations';
import { useSessionOperations } from './useSessionOperations';
import { useTaskOperations } from './useTaskOperations';

interface UseStudyOperationsProps {
  userId: string;
  stats: UserStats;
  setStats: React.Dispatch<React.SetStateAction<UserStats>>;
  showToast: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export function useStudyOperations({
  userId,
  stats,
  setStats,
  showToast,
}: UseStudyOperationsProps) {
  const [dailyLogs, setDailyLogs] = useState<DailyStudyLog[]>([]);
  const [loadingData, setLoadingData] = useState<boolean>(true);

  const { goals, addGoal, toggleGoal, deleteGoal, updateGoalItem } =
    useGoalOperations(userId, showToast);

  const streakStats = useMemo<StreakStats>(() => {
    return calculateStreak(dailyLogs, formatDateKey(new Date()), stats.streakShields ?? 1);
  }, [dailyLogs, stats.streakShields]);

  useEffect(() => {
    setStats((prev) => ({
      ...prev,
      streakDays: streakStats.currentStreak,
      longestStreakDays: Math.max(prev.longestStreakDays || 0, streakStats.longestStreak),
      totalActiveDays: streakStats.totalActiveDays,
    }));
  }, [streakStats.currentStreak, streakStats.longestStreak, streakStats.totalActiveDays, setStats]);

  useEffect(() => {
    let isMounted = true;
    setLoadingData(true);
    syncManager.loadDailyLogs(userId, [])
      .then((logsRes) => {
        if (isMounted) {
          setDailyLogs(logsRes.dailyLogs);
          setLoadingData(false);
        }
      })
      .catch(() => {
        if (isMounted) setLoadingData(false);
      });

    return () => {
      isMounted = false;
    };
  }, [userId]);

  const syncDailyLogForDate = useCallback(
    (targetDate: string, updatedTasks?: TaskItem[], updatedSessions?: StudySession[]) => {
      const allT = updatedTasks || [];
      const allS = updatedSessions || [];

      const dateTasks = allT.filter((t) => t.date === targetDate);
      const dateSessions = allS.filter((s) => s.date === targetDate);

      const tasksCompleted = dateTasks.filter((t) => t.completed).length;
      const tasksTotal = dateTasks.length;

      const studyMinutes = dateSessions.reduce((acc, s) => acc + s.durationMinutes, 0);
      const physicsMinutes = dateSessions.filter((s) => s.subject === 'Physics').reduce((acc, s) => acc + s.durationMinutes, 0);
      const chemistryMinutes = dateSessions.filter((s) => s.subject === 'Chemistry').reduce((acc, s) => acc + s.durationMinutes, 0);
      const biologyMinutes = dateSessions.filter((s) => s.subject === 'Biology').reduce((acc, s) => acc + s.durationMinutes, 0);

      const chaptersStudied = Array.from(
        new Set([
          ...dateTasks.map((t) => t.chapter).filter(Boolean),
          ...dateSessions.map((s) => s.chapter).filter(Boolean),
        ])
      ) as string[];

      setDailyLogs((prev) => {
        const existing = prev.find((l) => l.date === targetDate);
        const finalStudyMins = Math.max(studyMinutes, existing?.studyMinutes || 0);
        const finalPhy = Math.max(physicsMinutes, existing?.physicsMinutes || 0);
        const finalChem = Math.max(chemistryMinutes, existing?.chemistryMinutes || 0);
        const finalBio = Math.max(biologyMinutes, existing?.biologyMinutes || 0);

        const newLog: DailyStudyLog = {
          id: existing?.id || `log_${userId}_${targetDate}`,
          date: targetDate,
          userId,
          studyMinutes: finalStudyMins,
          tasksCompleted,
          tasksTotal,
          physicsMinutes: finalPhy,
          chemistryMinutes: finalChem,
          biologyMinutes: finalBio,
          chaptersStudied: chaptersStudied.length > 0 ? chaptersStudied : existing?.chaptersStudied || [],
          notes: existing?.notes,
          isShieldUsed: existing?.isShieldUsed,
          updatedAt: new Date().toISOString(),
        };

        const updated = existing
          ? prev.map((l) => (l.date === targetDate ? newLog : l))
          : [newLog, ...prev];

        cacheService.setDailyLogs(userId, updated);
        syncManager.mutateDailyLog(userId, newLog, prev);
        return updated;
      });
    },
    [userId]
  );

  const { tasks, addTask, toggleTask, deleteTask, updateTaskItem } = useTaskOperations({
    userId,
    syncDailyLogForDate,
    showToast,
  });

  useEffect(() => {
    const completed = tasks.filter((t) => t.completed).length;
    const total = tasks.length;
    setStats((prev) => ({
      ...prev,
      tasksCompletedToday: completed,
      totalTasksToday: total,
    }));
  }, [tasks, setStats]);

  const { sessions, logStudySession, deleteSession } = useSessionOperations({
    userId,
    tasks,
    updateTaskItem,
    syncDailyLogForDate,
    setStats,
    showToast,
  });

  const saveDailyReflection = async (date: string, notes: string) => {
    setDailyLogs((prev) => {
      const existing = prev.find((l) => l.date === date);
      let updatedLog: DailyStudyLog;
      if (existing) {
        updatedLog = { ...existing, notes, updatedAt: new Date().toISOString() };
      } else {
        updatedLog = {
          id: `log_${userId}_${date}`,
          date,
          userId,
          studyMinutes: 0,
          tasksCompleted: 0,
          tasksTotal: 0,
          physicsMinutes: 0,
          chemistryMinutes: 0,
          biologyMinutes: 0,
          notes,
          updatedAt: new Date().toISOString(),
        };
      }
      const nextLogs = existing
        ? prev.map((l) => (l.date === date ? updatedLog : l))
        : [updatedLog, ...prev];

      cacheService.setDailyLogs(userId, nextLogs);
      syncManager.mutateDailyLog(userId, updatedLog, prev);
      return nextLogs;
    });
    showToast('Daily reflection saved! 📝', 'success');
  };

  const useStreakShield = async (): Promise<boolean> => {
    const shields = stats.streakShields ?? 1;
    if (shields <= 0) {
      showToast('No Streak Shields available! Keep studying to earn more 🛡️', 'error');
      return false;
    }

    const today = formatDateKey(new Date());
    setDailyLogs((prev) => {
      const yest = new Date();
      yest.setDate(yest.getDate() - 1);
      const yestStr = formatDateKey(yest);
      const targetDate = prev.find(
        (l) => l.date === yestStr && !l.isShieldUsed && l.studyMinutes < 25 && l.tasksCompleted === 0
      )
        ? yestStr
        : today;

      const existing = prev.find((l) => l.date === targetDate);
      const updatedLog: DailyStudyLog = existing
        ? { ...existing, isShieldUsed: true, updatedAt: new Date().toISOString() }
        : {
            id: `log_${userId}_${targetDate}`,
            date: targetDate,
            userId,
            studyMinutes: 0,
            tasksCompleted: 0,
            tasksTotal: 0,
            physicsMinutes: 0,
            chemistryMinutes: 0,
            biologyMinutes: 0,
            isShieldUsed: true,
            updatedAt: new Date().toISOString(),
          };

      const nextLogs = existing
        ? prev.map((l) => (l.date === targetDate ? updatedLog : l))
        : [updatedLog, ...prev];

      cacheService.setDailyLogs(userId, nextLogs);
      syncManager.mutateDailyLog(userId, updatedLog, prev);
      return nextLogs;
    });

    setStats((prev) => ({
      ...prev,
      streakShields: Math.max(0, (prev.streakShields ?? 1) - 1),
    }));

    showToast('Streak Shield activated! 🛡️ Streak preserved.', 'success');
    return true;
  };

  const syncNow = async () => {
    showToast('Syncing with cloud...', 'info');
    await syncManager.processQueue();
    cacheService.invalidateCache(userId);
    const [l] = await Promise.all([
      syncManager.loadDailyLogs(userId, dailyLogs),
    ]);
    setDailyLogs(l.dailyLogs);
    showToast('Everything up to date!', 'success');
  };

  return {
    tasks,
    goals,
    sessions,
    dailyLogs,
    streakStats,
    loadingData,
    addTask,
    toggleTask,
    deleteTask,
    updateTaskItem,
    addGoal,
    toggleGoal,
    deleteGoal,
    updateGoalItem,
    logStudySession,
    deleteSession,
    saveDailyReflection,
    useStreakShield,
    syncNow,
  };
}
