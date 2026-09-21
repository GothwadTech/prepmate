import { useState, useEffect } from 'react';
import { GoalItem } from '../types';
import { syncManager } from '../services/syncManager';

export function useGoalOperations(
  userId: string,
  showToast: (msg: string, type: 'success' | 'error' | 'info') => void
) {
  const [goals, setGoals] = useState<GoalItem[]>([]);

  useEffect(() => {
    let isMounted = true;
    syncManager.loadGoals(userId, []).then((res) => {
      if (isMounted) setGoals(res.goals);
    }).catch(() => {
      if (isMounted) setGoals([]);
    });
    return () => {
      isMounted = false;
    };
  }, [userId]);

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

  return {
    goals,
    setGoals,
    addGoal,
    toggleGoal,
    deleteGoal,
    updateGoalItem,
  };
}
