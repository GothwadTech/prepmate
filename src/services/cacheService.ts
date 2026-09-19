/**
 * PrepMate - Cache Layer Service
 * Free-Tier Optimization: Caches tasks, goals, and daily logs locally
 * to stay well within Firebase Spark free tier limits (50,000 reads/day).
 */

import { TaskItem, GoalItem, DailyStudyLog, QueuedMutation, CacheMetadata } from '../types';

const CACHE_PREFIX = 'prepmate_cache_';
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes cache validity

export const cacheService = {
  // --- Tasks Cache ---
  getTasks(userId: string): { data: TaskItem[]; isFresh: boolean } | null {
    try {
      const key = `${CACHE_PREFIX}tasks_${userId}`;
      const raw = localStorage.getItem(key);
      const metaRaw = localStorage.getItem(`${key}_meta`);
      if (!raw) return null;

      const data: TaskItem[] = JSON.parse(raw);
      let isFresh = false;
      if (metaRaw) {
        const meta: CacheMetadata = JSON.parse(metaRaw);
        isFresh = Date.now() - meta.lastSyncedAt < CACHE_TTL_MS;
      }
      return { data, isFresh };
    } catch (e) {
      console.warn('Failed to read tasks from cache:', e);
      return null;
    }
  },

  setTasks(userId: string, tasks: TaskItem[]): void {
    try {
      const key = `${CACHE_PREFIX}tasks_${userId}`;
      localStorage.setItem(key, JSON.stringify(tasks));
      const meta: CacheMetadata = {
        lastSyncedAt: Date.now(),
        itemCount: tasks.length,
        version: 1,
      };
      localStorage.setItem(`${key}_meta`, JSON.stringify(meta));
    } catch (e) {
      console.warn('Failed to save tasks to cache:', e);
    }
  },

  // --- Goals Cache ---
  getGoals(userId: string): { data: GoalItem[]; isFresh: boolean } | null {
    try {
      const key = `${CACHE_PREFIX}goals_${userId}`;
      const raw = localStorage.getItem(key);
      const metaRaw = localStorage.getItem(`${key}_meta`);
      if (!raw) return null;

      const data: GoalItem[] = JSON.parse(raw);
      let isFresh = false;
      if (metaRaw) {
        const meta: CacheMetadata = JSON.parse(metaRaw);
        isFresh = Date.now() - meta.lastSyncedAt < CACHE_TTL_MS;
      }
      return { data, isFresh };
    } catch (e) {
      console.warn('Failed to read goals from cache:', e);
      return null;
    }
  },

  setGoals(userId: string, goals: GoalItem[]): void {
    try {
      const key = `${CACHE_PREFIX}goals_${userId}`;
      localStorage.setItem(key, JSON.stringify(goals));
      const meta: CacheMetadata = {
        lastSyncedAt: Date.now(),
        itemCount: goals.length,
        version: 1,
      };
      localStorage.setItem(`${key}_meta`, JSON.stringify(meta));
    } catch (e) {
      console.warn('Failed to save goals to cache:', e);
    }
  },

  // --- Daily Logs Cache ---
  getDailyLogs(userId: string): DailyStudyLog[] | null {
    try {
      const key = `${CACHE_PREFIX}dailylogs_${userId}`;
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      console.warn('Failed to read daily logs from cache:', e);
      return null;
    }
  },

  setDailyLogs(userId: string, logs: DailyStudyLog[]): void {
    try {
      const key = `${CACHE_PREFIX}dailylogs_${userId}`;
      localStorage.setItem(key, JSON.stringify(logs));
    } catch (e) {
      console.warn('Failed to save daily logs to cache:', e);
    }
  },

  // --- Offline Mutation Queue Cache ---
  getOfflineQueue(): QueuedMutation[] {
    try {
      const raw = localStorage.getItem(`${CACHE_PREFIX}offline_queue`);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.warn('Failed to read offline queue:', e);
      return [];
    }
  },

  setOfflineQueue(queue: QueuedMutation[]): void {
    try {
      localStorage.setItem(`${CACHE_PREFIX}offline_queue`, JSON.stringify(queue));
    } catch (e) {
      console.warn('Failed to write offline queue:', e);
    }
  },

  // --- Clear / Invalidate ---
  invalidateCache(userId: string): void {
    try {
      localStorage.removeItem(`${CACHE_PREFIX}tasks_${userId}_meta`);
      localStorage.removeItem(`${CACHE_PREFIX}goals_${userId}_meta`);
    } catch (e) {
      console.warn('Failed to invalidate cache:', e);
    }
  },

  clearUserCache(userId: string): void {
    try {
      localStorage.removeItem(`${CACHE_PREFIX}tasks_${userId}`);
      localStorage.removeItem(`${CACHE_PREFIX}tasks_${userId}_meta`);
      localStorage.removeItem(`${CACHE_PREFIX}goals_${userId}`);
      localStorage.removeItem(`${CACHE_PREFIX}goals_${userId}_meta`);
      localStorage.removeItem(`${CACHE_PREFIX}dailylogs_${userId}`);
    } catch (e) {
      console.warn('Failed to clear user cache:', e);
    }
  },
};
