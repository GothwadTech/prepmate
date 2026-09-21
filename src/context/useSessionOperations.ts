import { useState } from 'react';
import { StudySession, TaskItem, UserStats } from '../types';

interface UseSessionOperationsProps {
  userId: string;
  tasks: TaskItem[];
  updateTaskItem: (id: string, updates: Partial<TaskItem>) => Promise<void>;
  syncDailyLogForDate: (targetDate: string, updatedTasks?: TaskItem[], updatedSessions?: StudySession[]) => void;
  setStats: React.Dispatch<React.SetStateAction<UserStats>>;
  showToast: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export function useSessionOperations({
  userId,
  tasks,
  updateTaskItem,
  syncDailyLogForDate,
  setStats,
  showToast,
}: UseSessionOperationsProps) {
  const [sessions, setSessions] = useState<StudySession[]>(() => {
    try {
      const cached = localStorage.getItem(`prepmate_sessions_${userId}`);
      if (cached) return JSON.parse(cached);
    } catch (e) {
      console.warn(e);
    }
    return [];
  });

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

    setStats((prev) => ({
      ...prev,
      todayStudyMinutes: prev.todayStudyMinutes + newSession.durationMinutes,
    }));

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

  return {
    sessions,
    setSessions,
    logStudySession,
    deleteSession,
  };
}
