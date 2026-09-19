/**
 * PrepMate - Data Context (Phase 3)
 * Unified state management combining Firestore, Cache Layer, and Offline Queue.
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { syncManager } from '../services/syncManager';
import { cacheService } from '../services/cacheService';
import {
  TaskItem,
  GoalItem,
  UserStats,
  UserProfile,
  SyncStatus,
  StudySession,
  DailyStudyLog,
  PartnerRequest,
  PartnerUserSearchResult,
  ActivePartnership,
  PartnerProfile,
} from '../types';
import { calculateStreak, formatDateKey, generateDefaultDailyLogsSeed, StreakStats } from '../utils/streakUtils';
import { partnerService } from '../services/partnerService';

interface DataContextType {
  tasks: TaskItem[];
  goals: GoalItem[];
  sessions: StudySession[];
  dailyLogs: DailyStudyLog[];
  streakStats: StreakStats;
  stats: UserStats;
  syncStatus: SyncStatus;
  isOnline: boolean;
  pendingCount: number;
  loadingData: boolean;
  syncNow: () => Promise<void>;
  addTask: (data: Omit<TaskItem, 'id' | 'completed' | 'completedCount' | 'date'> & { date?: string }) => Promise<void>;
  toggleTask: (id: string) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  updateTaskItem: (id: string, updates: Partial<TaskItem>) => Promise<void>;
  addGoal: (data: Omit<GoalItem, 'id' | 'completed' | 'progressPercent'> & { progressPercent?: number }) => Promise<void>;
  toggleGoal: (id: string) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
  updateGoalItem: (id: string, updates: Partial<GoalItem>) => Promise<void>;
  logStudySession: (session: Omit<StudySession, 'id' | 'completedAt' | 'date'> & { date?: string }) => Promise<void>;
  deleteSession: (id: string) => Promise<void>;
  updateStats: (newStats: Partial<UserStats>) => void;
  saveDailyReflection: (date: string, notes: string) => Promise<void>;
  useStreakShield: () => Promise<boolean>;
  // Phase 9 Partner system
  receivedRequests: PartnerRequest[];
  sentRequests: PartnerRequest[];
  pendingPartnerRequestsCount: number;
  activePartnership: ActivePartnership | null;
  activePartner: PartnerProfile | null;
  searchPartners: (q: string) => Promise<PartnerUserSearchResult[]>;
  sendPartnerRequest: (
    targetUser: { uid?: string; username: string; displayName?: string; targetScore?: number; targetYear?: string; avatarBg?: string },
    cheerMessage?: string
  ) => Promise<void>;
  acceptPartnerRequest: (requestId: string) => Promise<void>;
  rejectPartnerRequest: (requestId: string) => Promise<void>;
  cancelPartnerRequest: (requestId: string) => Promise<void>;
  endCurrentPartnership: () => Promise<void>;
  refreshPartnerData: () => Promise<void>;
  sendPartnerCheer: (message: string) => Promise<void>;
}

const defaultTasksSeed: TaskItem[] = [
  {
    id: 'task-1',
    title: 'Current Electricity: 30 Numerical MCQs',
    subject: 'Physics',
    chapter: 'Current Electricity',
    type: 'MCQs',
    targetCount: 30,
    completedCount: 30,
    completed: true,
    date: new Date().toISOString().split('T')[0],
  },
  {
    id: 'task-2',
    title: 'Chemical Bonding: Molecular Orbital Theory Revision',
    subject: 'Chemistry',
    chapter: 'Chemical Bonding',
    type: 'Revision',
    targetCount: 1,
    completedCount: 0,
    completed: false,
    date: new Date().toISOString().split('T')[0],
  },
  {
    id: 'task-3',
    title: 'NCERT Line-by-Line Reading: Human Reproduction',
    subject: 'Biology',
    chapter: 'Human Reproduction',
    type: 'Notes',
    targetCount: 1,
    completedCount: 1,
    completed: true,
    date: new Date().toISOString().split('T')[0],
  },
  {
    id: 'task-4',
    title: 'Biomolecules 45 Practice Questions',
    subject: 'Chemistry',
    chapter: 'Biomolecules',
    type: 'MCQs',
    targetCount: 45,
    completedCount: 0,
    completed: false,
    date: new Date().toISOString().split('T')[0],
  },
];

const defaultGoalsSeed: GoalItem[] = [
  {
    id: 'goal-1',
    title: 'Complete 500 Biology NCERT MCQs',
    subject: 'Biology',
    chapter: 'Ecology & Environment',
    deadline: '7 Days',
    targetMetric: '500 MCQs',
    progressPercent: 65,
    completed: false,
  },
  {
    id: 'goal-2',
    title: 'Optics Formula Sheet & Ray Diagrams',
    subject: 'Physics',
    chapter: 'Ray & Wave Optics',
    deadline: '4 Days',
    targetMetric: 'Full Formula Map',
    progressPercent: 80,
    completed: false,
  },
  {
    id: 'goal-3',
    title: 'Inorganic Coordination Compounds Revision',
    subject: 'Chemistry',
    chapter: 'Coordination Compounds',
    deadline: 'Completed',
    targetMetric: 'IUPAC & Isomerism notes',
    progressPercent: 100,
    completed: true,
  },
];

const defaultSessionsSeed: StudySession[] = [
  {
    id: 'session-1',
    subject: 'Physics',
    chapter: 'Current Electricity',
    durationMinutes: 25,
    mode: 'pomodoro',
    date: new Date().toISOString().split('T')[0],
    completedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    notes: 'Mastered Kirchhoff laws and solved 15 PYQs',
  },
  {
    id: 'session-2',
    subject: 'Biology',
    chapter: 'Human Reproduction',
    durationMinutes: 50,
    mode: 'deep_study',
    date: new Date().toISOString().split('T')[0],
    completedAt: new Date(Date.now() - 3600000).toISOString(),
    notes: 'NCERT diagram memorization & gametogenesis flow',
  },
];

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, showToast } = useAuth();
  const userId = user?.uid || 'guest-aspirant';

  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [goals, setGoals] = useState<GoalItem[]>([]);
  const [dailyLogs, setDailyLogs] = useState<DailyStudyLog[]>([]);
  const [sessions, setSessions] = useState<StudySession[]>(() => {
    try {
      const cached = localStorage.getItem(`prepmate_sessions_${userId}`);
      if (cached) return JSON.parse(cached);
    } catch (e) {
      console.warn(e);
    }
    return defaultSessionsSeed;
  });
  const [loadingData, setLoadingData] = useState<boolean>(true);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>(syncManager.getStatus());
  const [pendingCount, setPendingCount] = useState<number>(syncManager.getPendingCount());
  const [isOnline, setIsOnline] = useState<boolean>(syncManager.isOnline());

  const [stats, setStats] = useState<UserStats>({
    todayStudyMinutes: 210,
    tasksCompletedToday: 2,
    totalTasksToday: 4,
    streakDays: 4,
    longestStreakDays: 12,
    totalActiveDays: 42,
    streakShields: 1,
    targetYear: user?.targetYear || '2026',
    targetScore: user?.targetScore || 685,
    physicsProgress: 60,
    chemistryProgress: 45,
    biologyProgress: 75,
  });

  // Phase 9 Partner system state
  const [receivedRequests, setReceivedRequests] = useState<PartnerRequest[]>([]);
  const [sentRequests, setSentRequests] = useState<PartnerRequest[]>([]);
  const [activePartnership, setActivePartnership] = useState<ActivePartnership | null>(() => {
    return partnerService.getLocalPartnership();
  });

  const activePartner = activePartnership?.partner || null;
  const pendingPartnerRequestsCount = receivedRequests.length;

  const currentUserProfile = React.useMemo<UserProfile>(() => {
    return (
      user || {
        uid: userId,
        email: '',
        displayName: 'You (Aspirant)',
        username: 'you',
        targetYear: stats.targetYear || '2026',
        targetScore: stats.targetScore || 685,
        createdAt: new Date().toISOString(),
      }
    );
  }, [user, userId, stats.targetYear, stats.targetScore]);

  // Load partner data
  const refreshPartnerData = useCallback(async () => {
    try {
      const p = partnerService.getLocalPartnership();
      setActivePartnership(p);
      const reqs = await partnerService.fetchRequests(userId, currentUserProfile.username);
      setReceivedRequests(reqs.received);
      setSentRequests(reqs.sent);
    } catch (e) {
      console.warn('Failed to load partner data:', e);
    }
  }, [userId, currentUserProfile.username]);

  useEffect(() => {
    refreshPartnerData();
  }, [refreshPartnerData]);

  // Phase 10: Real-time Firestore listener for active partnership
  useEffect(() => {
    if (!activePartnership?.id) return;

    const unsubscribe = partnerService.subscribeToPartnership(
      activePartnership.id,
      (updatedPartnership) => {
        if (updatedPartnership) {
          setActivePartnership(updatedPartnership);
        } else {
          setActivePartnership(null);
        }
      }
    );

    return () => {
      unsubscribe();
    };
  }, [activePartnership?.id]);

  // Phase 10: Broadcast study stats to active partner
  useEffect(() => {
    if (!activePartnership?.id) return;
    const studyHrs = Number((stats.todayStudyMinutes / 60).toFixed(1));
    partnerService.syncMyActivity(activePartnership.id, {
      todayStudyHours: studyHrs,
      todayTasksCompleted: stats.tasksCompletedToday,
      streakDays: stats.streakDays,
      isStudyingNow: false,
    });
  }, [activePartnership?.id, stats.todayStudyMinutes, stats.tasksCompletedToday, stats.streakDays]);

  // Calculate streak stats dynamically from dailyLogs
  const streakStats = React.useMemo(() => {
    return calculateStreak(dailyLogs, formatDateKey(new Date()), stats.streakShields ?? 1);
  }, [dailyLogs, stats.streakShields]);

  // Keep stats in sync with calculated streak
  useEffect(() => {
    setStats((prev) => ({
      ...prev,
      streakDays: streakStats.currentStreak,
      longestStreakDays: Math.max(prev.longestStreakDays || 0, streakStats.longestStreak),
      totalActiveDays: streakStats.totalActiveDays,
    }));
  }, [streakStats.currentStreak, streakStats.longestStreak, streakStats.totalActiveDays]);

  // Subscribe to syncManager status events
  useEffect(() => {
    const unsubscribe = syncManager.subscribe((status, count) => {
      setSyncStatus(status);
      setPendingCount(count);
      setIsOnline(syncManager.isOnline());
    });
    return () => unsubscribe();
  }, []);

  // Load Tasks, Goals, and Daily Logs on user change or mount
  useEffect(() => {
    let isMounted = true;
    setLoadingData(true);

    const loadInitialData = async () => {
      try {
        const [tasksRes, goalsRes, logsRes] = await Promise.all([
          syncManager.loadTasks(userId, defaultTasksSeed),
          syncManager.loadGoals(userId, defaultGoalsSeed),
          syncManager.loadDailyLogs(userId, generateDefaultDailyLogsSeed(userId)),
        ]);

        if (isMounted) {
          setTasks(tasksRes.tasks);
          setGoals(goalsRes.goals);
          setDailyLogs(logsRes.dailyLogs);
          setLoadingData(false);
        }
      } catch (err) {
        console.error('Failed to load initial data:', err);
        if (isMounted) {
          setTasks(defaultTasksSeed);
          setGoals(defaultGoalsSeed);
          setDailyLogs(generateDefaultDailyLogsSeed(userId));
          setLoadingData(false);
        }
      }
    };

    loadInitialData();

    return () => {
      isMounted = false;
    };
  }, [userId]);

  // Helper to auto-sync today's or specified date's DailyStudyLog
  const syncDailyLogForDate = useCallback(
    (targetDate: string, updatedTasks?: TaskItem[], updatedSessions?: StudySession[]) => {
      const allT = updatedTasks || tasks;
      const allS = updatedSessions || sessions;

      const dateTasks = allT.filter((t) => t.date === targetDate);
      const dateSessions = allS.filter((s) => s.date === targetDate);

      const tasksCompleted = dateTasks.filter((t) => t.completed).length;
      const tasksTotal = dateTasks.length;

      const studyMinutes = dateSessions.reduce((acc, s) => acc + s.durationMinutes, 0);
      const physicsMinutes = dateSessions
        .filter((s) => s.subject === 'Physics')
        .reduce((acc, s) => acc + s.durationMinutes, 0);
      const chemistryMinutes = dateSessions
        .filter((s) => s.subject === 'Chemistry')
        .reduce((acc, s) => acc + s.durationMinutes, 0);
      const biologyMinutes = dateSessions
        .filter((s) => s.subject === 'Biology')
        .reduce((acc, s) => acc + s.durationMinutes, 0);

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
    [userId, tasks, sessions]
  );

  // Recalculate stats dynamically from tasks
  useEffect(() => {
    const completed = tasks.filter((t) => t.completed).length;
    const total = tasks.length;
    setStats((prev) => ({
      ...prev,
      tasksCompletedToday: completed,
      totalTasksToday: total,
      targetYear: user?.targetYear || prev.targetYear,
      targetScore: user?.targetScore || prev.targetScore,
    }));
  }, [tasks, user]);

  // --- Task Operations ---
  const addTask = async (data: Omit<TaskItem, 'id' | 'completed' | 'completedCount' | 'date'> & { date?: string }) => {
    const newTask: TaskItem = {
      ...data,
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      userId,
      completed: false,
      completedCount: 0,
      date: data.date || new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      synced: false,
    };

    const updated = await syncManager.mutateTask(userId, 'create', newTask, tasks);
    setTasks(updated);
    syncDailyLogForDate(newTask.date, updated);
    showToast('Task added and saved to cache', 'success');
  };

  const toggleTask = async (id: string) => {
    const target = tasks.find((t) => t.id === id);
    if (!target) return;

    const updatedTask: TaskItem = {
      ...target,
      completed: !target.completed,
      completedCount: !target.completed ? target.targetCount : 0,
      updatedAt: new Date().toISOString(),
    };

    const updated = await syncManager.mutateTask(userId, 'update', updatedTask, tasks);
    setTasks(updated);
    syncDailyLogForDate(target.date, updated);
  };

  const deleteTask = async (id: string) => {
    const target = tasks.find((t) => t.id === id);
    if (!target) return;

    const updated = await syncManager.mutateTask(userId, 'delete', target, tasks);
    setTasks(updated);
    syncDailyLogForDate(target.date, updated);
    showToast('Task removed', 'info');
  };

  const updateTaskItem = async (id: string, updates: Partial<TaskItem>) => {
    const target = tasks.find((t) => t.id === id);
    if (!target) return;

    const updatedTask: TaskItem = {
      ...target,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    const updated = await syncManager.mutateTask(userId, 'update', updatedTask, tasks);
    setTasks(updated);
    syncDailyLogForDate(target.date, updated);
    showToast('Task updated', 'success');
  };

  // --- Goal Operations ---
  const addGoal = async (data: Omit<GoalItem, 'id' | 'completed' | 'progressPercent'> & { progressPercent?: number }) => {
    const initialProgress = Math.min(100, Math.max(0, data.progressPercent ?? 0));
    const newGoal: GoalItem = {
      ...data,
      id: `goal-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      userId,
      progressPercent: initialProgress,
      completed: initialProgress >= 100,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      synced: false,
    };

    const updated = await syncManager.mutateGoal(userId, 'create', newGoal, goals);
    setGoals(updated);
    showToast('New study goal created', 'success');
  };

  const toggleGoal = async (id: string) => {
    const target = goals.find((g) => g.id === id);
    if (!target) return;

    const willBeCompleted = !target.completed;
    const updatedGoal: GoalItem = {
      ...target,
      completed: willBeCompleted,
      progressPercent: willBeCompleted ? 100 : (target.progressPercent === 100 ? 50 : target.progressPercent),
      updatedAt: new Date().toISOString(),
    };

    const updated = await syncManager.mutateGoal(userId, 'update', updatedGoal, goals);
    setGoals(updated);
    if (willBeCompleted) {
      showToast('🎉 Goal completed! Great achievement!', 'success');
    } else {
      showToast('Goal reopened to active', 'info');
    }
  };

  const deleteGoal = async (id: string) => {
    const target = goals.find((g) => g.id === id);
    if (!target) return;

    const updated = await syncManager.mutateGoal(userId, 'delete', target, goals);
    setGoals(updated);
    showToast('Goal removed', 'info');
  };

  const updateGoalItem = async (id: string, updates: Partial<GoalItem>) => {
    const target = goals.find((g) => g.id === id);
    if (!target) return;

    let nextProgress = updates.progressPercent !== undefined ? Math.min(100, Math.max(0, updates.progressPercent)) : target.progressPercent;
    let nextCompleted = updates.completed !== undefined ? updates.completed : target.completed;

    // If progress reaches 100%, automatically mark as completed
    if (updates.progressPercent !== undefined && updates.progressPercent >= 100 && !target.completed) {
      nextCompleted = true;
    }

    const updatedGoal: GoalItem = {
      ...target,
      ...updates,
      progressPercent: nextProgress,
      completed: nextCompleted,
      updatedAt: new Date().toISOString(),
    };

    const updated = await syncManager.mutateGoal(userId, 'update', updatedGoal, goals);
    setGoals(updated);
    showToast('Goal updated', 'success');
  };

  const logStudySession = async (sessionData: Omit<StudySession, 'id' | 'completedAt' | 'date'> & { date?: string }) => {
    const today = new Date().toISOString().split('T')[0];
    const newSession: StudySession = {
      ...sessionData,
      id: `session-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      userId,
      date: sessionData.date || today,
      completedAt: new Date().toISOString(),
    };

    const updatedSessions = [newSession, ...sessions];
    setSessions(updatedSessions);
    try {
      localStorage.setItem(`prepmate_sessions_${userId}`, JSON.stringify(updatedSessions));
    } catch (e) {
      console.warn('Could not cache session locally:', e);
    }

    // Auto-update stats todayStudyMinutes
    setStats((prev) => ({
      ...prev,
      todayStudyMinutes: prev.todayStudyMinutes + newSession.durationMinutes,
    }));

    // Auto-log to daily tasks if linked
    if (sessionData.linkedTaskId) {
      const task = tasks.find((t) => t.id === sessionData.linkedTaskId);
      if (task) {
        const increment = task.type === 'Lecture' ? newSession.durationMinutes : 1;
        const newCompletedCount = Math.min(task.targetCount, task.completedCount + increment);
        const isDone = newCompletedCount >= task.targetCount;
        await updateTaskItem(task.id, {
          completedCount: newCompletedCount,
          completed: isDone ? true : task.completed,
        });
        showToast(`Auto-logged ${newSession.durationMinutes}m to "${task.title}"! 🎯`, 'success');
      } else {
        showToast(`${newSession.durationMinutes} mins of ${newSession.subject} logged! 🩺`, 'success');
      }
    } else {
      showToast(`${newSession.durationMinutes} mins of ${newSession.subject} study logged! 🩺`, 'success');
    }

    // Sync daily log for date
    syncDailyLogForDate(newSession.date, tasks, updatedSessions);
  };

  const deleteSession = async (id: string) => {
    const target = sessions.find((s) => s.id === id);
    if (!target) return;
    const updated = sessions.filter((s) => s.id !== id);
    setSessions(updated);
    try {
      localStorage.setItem(`prepmate_sessions_${userId}`, JSON.stringify(updated));
    } catch (e) {
      console.warn(e);
    }
    setStats((prev) => ({
      ...prev,
      todayStudyMinutes: Math.max(0, prev.todayStudyMinutes - target.durationMinutes),
    }));
    showToast('Study session removed', 'info');
  };

  const updateStats = (newStats: Partial<UserStats>) => {
    setStats((prev) => ({ ...prev, ...newStats }));
  };

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

  // --- Partner Functions ---
  const searchPartners = useCallback(
    async (q: string): Promise<PartnerUserSearchResult[]> => {
      const allReqs = [...receivedRequests, ...sentRequests];
      return partnerService.searchUsers(q, currentUserProfile, activePartnership, allReqs);
    },
    [receivedRequests, sentRequests, currentUserProfile, activePartnership]
  );

  const sendPartnerRequest = useCallback(
    async (
      targetUser: { uid?: string; username: string; displayName?: string; targetScore?: number; targetYear?: string; avatarBg?: string },
      cheerMessage?: string
    ): Promise<void> => {
      try {
        const newReq = await partnerService.sendRequest(currentUserProfile, targetUser, cheerMessage);
        setSentRequests((prev) => [newReq, ...prev.filter((r) => r.receiverUsername !== newReq.receiverUsername)]);
        showToast(`Partner request sent to @${newReq.receiverUsername}! 🤝`, 'success');
      } catch (err: any) {
        showToast(err.message || 'Failed to send request.', 'error');
        throw err;
      }
    },
    [currentUserProfile, showToast]
  );

  const acceptPartnerRequest = useCallback(
    async (requestId: string): Promise<void> => {
      try {
        const newPartnership = await partnerService.acceptRequest(requestId, currentUserProfile);
        setActivePartnership(newPartnership);
        setReceivedRequests((prev) => prev.filter((r) => r.id !== requestId));
        showToast(`🎉 Partnership confirmed with ${newPartnership.partner.name}! Ready to compete on VS Board.`, 'success');
      } catch (err: any) {
        showToast(err.message || 'Failed to accept request.', 'error');
        throw err;
      }
    },
    [currentUserProfile, showToast]
  );

  const rejectPartnerRequest = useCallback(
    async (requestId: string): Promise<void> => {
      try {
        await partnerService.rejectRequest(requestId);
        setReceivedRequests((prev) => prev.filter((r) => r.id !== requestId));
        showToast('Request declined.', 'info');
      } catch (err: any) {
        showToast('Failed to decline request.', 'error');
      }
    },
    [showToast]
  );

  const cancelPartnerRequest = useCallback(
    async (requestId: string): Promise<void> => {
      try {
        await partnerService.cancelRequest(requestId);
        setSentRequests((prev) => prev.filter((r) => r.id !== requestId));
        showToast('Partner request cancelled.', 'info');
      } catch (err: any) {
        showToast('Failed to cancel request.', 'error');
      }
    },
    [showToast]
  );

  const endCurrentPartnership = useCallback(async (): Promise<void> => {
    if (!activePartnership) return;
    try {
      await partnerService.endPartnership(activePartnership.id);
      setActivePartnership(null);
      showToast('Partnership ended.', 'info');
    } catch (err: any) {
      showToast('Failed to end partnership.', 'error');
    }
  }, [activePartnership, showToast]);

  const sendPartnerCheer = useCallback(
    async (message: string): Promise<void> => {
      if (!activePartnership) return;
      try {
        await partnerService.sendCheer(
          activePartnership.id,
          currentUserProfile.uid,
          currentUserProfile.displayName,
          message
        );
        showToast('Cheer nudge sent to partner! 🎉', 'success');
      } catch (err: any) {
        showToast('Failed to send cheer.', 'error');
      }
    },
    [activePartnership, currentUserProfile, showToast]
  );

  const syncNow = async () => {
    showToast('Syncing with cloud...', 'info');
    await syncManager.processQueue();
    // Refresh tasks, goals, and daily logs from cloud
    cacheService.invalidateCache(userId);
    const [t, g, l] = await Promise.all([
      syncManager.loadTasks(userId, tasks),
      syncManager.loadGoals(userId, goals),
      syncManager.loadDailyLogs(userId, dailyLogs),
    ]);
    setTasks(t.tasks);
    setGoals(g.goals);
    setDailyLogs(l.dailyLogs);
    showToast('Everything up to date!', 'success');
  };

  return (
    <DataContext.Provider
      value={{
        tasks,
        goals,
        sessions,
        dailyLogs,
        streakStats,
        stats,
        syncStatus,
        isOnline,
        pendingCount,
        loadingData,
        syncNow,
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
        updateStats,
        saveDailyReflection,
        useStreakShield,
        receivedRequests,
        sentRequests,
        pendingPartnerRequestsCount,
        activePartnership,
        activePartner,
        searchPartners,
        sendPartnerRequest,
        acceptPartnerRequest,
        rejectPartnerRequest,
        cancelPartnerRequest,
        endCurrentPartnership,
        refreshPartnerData,
        sendPartnerCheer,
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
