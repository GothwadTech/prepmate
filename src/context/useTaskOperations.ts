import { useState, useEffect } from 'react';
import { TaskItem, StudySession } from '../types';
import { syncManager } from '../services/syncManager';

interface UseTaskOperationsProps {
  userId: string;
  syncDailyLogForDate: (targetDate: string, updatedTasks?: TaskItem[], updatedSessions?: StudySession[]) => void;
  showToast: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export function useTaskOperations({
  userId,
  syncDailyLogForDate,
  showToast,
}: UseTaskOperationsProps) {
  const [tasks, setTasks] = useState<TaskItem[]>([]);

  useEffect(() => {
    let isMounted = true;
    syncManager.loadTasks(userId, []).then((res) => {
      if (isMounted) setTasks(res.tasks);
    }).catch(() => {
      if (isMounted) setTasks([]);
    });
    return () => {
      isMounted = false;
    };
  }, [userId]);

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

  return {
    tasks,
    setTasks,
    addTask,
    toggleTask,
    deleteTask,
    updateTaskItem,
  };
}
