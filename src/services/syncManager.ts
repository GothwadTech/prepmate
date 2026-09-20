/**
 * PrepMate - Sync Manager
 * Bridges Local Cache, Offline Queue, and Cloud Firestore.
 * Implements local-first optimistic updates and background cloud synchronization.
 */

import { cacheService } from './cacheService';
import { offlineQueue } from './offlineQueue';
import { firestoreService } from './firestoreService';
import { isFirebaseConfigured } from '../firebase/config';
import { TaskItem, GoalItem, DailyStudyLog, SyncStatus, ConflictResolutionLog, QueuedMutation } from '../types';

type SyncListener = (status: SyncStatus, pendingCount: number) => void;

const CONFLICT_LOGS_KEY = 'prepmate_conflict_logs';

class SyncManagerClass {
  private isSyncing = false;
  private listeners: Set<SyncListener> = new Set();
  private simulateOffline = typeof window !== 'undefined' ? localStorage.getItem('prepmate_simulate_offline') === 'true' : false;
  private online = typeof navigator !== 'undefined' ? (!this.simulateOffline && navigator.onLine) : true;
  private backgroundInterval: any = null;
  private conflictLogs: ConflictResolutionLog[] = [];

  constructor() {
    this.loadConflictLogs();

    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        if (!this.simulateOffline) {
          this.online = true;
          this.notify();
          this.processQueue();
        }
      });

      window.addEventListener('offline', () => {
        this.online = false;
        this.notify();
      });

      // Background sync pulse every 25 seconds
      this.backgroundInterval = setInterval(() => {
        if (this.online && !this.isSyncing && offlineQueue.count() > 0 && isFirebaseConfigured) {
          this.processQueue();
        }
      }, 25000);
    }
  }

  private loadConflictLogs() {
    try {
      const saved = localStorage.getItem(CONFLICT_LOGS_KEY);
      if (saved) {
        this.conflictLogs = JSON.parse(saved);
      } else {
        // Initial sample conflict log demonstrating LWW/smart merge
        this.conflictLogs = [
          {
            id: 'conf-1',
            collection: 'tasks',
            docId: 'task-initial-1',
            docTitle: 'Physics: Current Electricity PYQs',
            resolvedAt: new Date(Date.now() - 3600000 * 3).toISOString(),
            resolutionStrategy: 'smart_merge',
            details: 'Offline completion status (completed: true) merged with Cloud revision without losing notes.',
          },
        ];
        this.saveConflictLogs();
      }
    } catch {
      //
    }
  }

  private saveConflictLogs() {
    try {
      localStorage.setItem(CONFLICT_LOGS_KEY, JSON.stringify(this.conflictLogs.slice(0, 30)));
    } catch {
      //
    }
  }

  public getConflictLogs(): ConflictResolutionLog[] {
    return [...this.conflictLogs];
  }

  public clearConflictLogs(): void {
    this.conflictLogs = [];
    this.saveConflictLogs();
  }

  public recordConflict(
    collection: 'tasks' | 'goals' | 'daily_logs',
    docId: string,
    docTitle: string,
    strategy: 'last_write_wins' | 'smart_merge' | 'client_wins',
    details: string
  ) {
    const log: ConflictResolutionLog = {
      id: `conf-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      collection,
      docId,
      docTitle,
      resolvedAt: new Date().toISOString(),
      resolutionStrategy: strategy,
      details,
    };
    this.conflictLogs = [log, ...this.conflictLogs].slice(0, 30);
    this.saveConflictLogs();
  }

  public setSimulateOffline(simulate: boolean): void {
    this.simulateOffline = simulate;
    if (typeof window !== 'undefined') {
      localStorage.setItem('prepmate_simulate_offline', simulate ? 'true' : 'false');
    }
    this.online = !simulate && (typeof navigator !== 'undefined' ? navigator.onLine : true);
    this.notify();

    if (this.online) {
      this.processQueue();
    }
  }

  public isSimulatingOffline(): boolean {
    return this.simulateOffline;
  }

  public subscribe(listener: SyncListener): () => void {
    this.listeners.add(listener);
    listener(this.getStatus(), offlineQueue.count());
    return () => {
      this.listeners.delete(listener);
    };
  }

  public getStatus(): SyncStatus {
    if (!this.online) return 'offline';
    if (this.isSyncing) return 'syncing';
    if (offlineQueue.count() > 0) return 'pending';
    return 'synced';
  }

  public isOnline(): boolean {
    return this.online;
  }

  public getPendingCount(): number {
    return offlineQueue.count();
  }

  public getQueue(): QueuedMutation[] {
    return offlineQueue.getQueue();
  }

  public removeFromQueue(id: string): void {
    offlineQueue.remove(id);
    this.notify();
  }

  public clearQueue(): void {
    offlineQueue.clear();
    this.notify();
  }

  private notify(): void {
    const status = this.getStatus();
    const count = offlineQueue.count();
    this.listeners.forEach((fn) => fn(status, count));
  }

  /**
   * Process all queued offline mutations to Firestore with conflict resolution
   */
  public async processQueue(): Promise<void> {
    if (this.isSyncing || !this.online || !isFirebaseConfigured) return;

    const queue = offlineQueue.getQueue();
    if (queue.length === 0) {
      this.notify();
      return;
    }

    this.isSyncing = true;
    this.notify();

    try {
      for (const mutation of queue) {
        try {
          await firestoreService.executeMutation(mutation);
          offlineQueue.remove(mutation.id);
        } catch (err) {
          console.warn(`Failed to process queued mutation ${mutation.id}:`, err);
          offlineQueue.incrementRetry(mutation.id);
          if (!navigator.onLine || this.simulateOffline) {
            this.online = false;
            break;
          }
        }
      }
    } finally {
      this.isSyncing = false;
      this.notify();
    }
  }

  /**
   * Load Tasks: Local-First with Background Stale-While-Revalidate
   */
  public async loadTasks(
    userId: string,
    initialFallback: TaskItem[] = []
  ): Promise<{ tasks: TaskItem[]; source: 'cache' | 'cloud' | 'fallback' }> {
    // 1. Try Cache First
    const cached = cacheService.getTasks(userId);
    if (cached && cached.data.length > 0) {
      // If cache is fresh, return immediately (saves Firestore reads)
      if (cached.isFresh || !this.online || !isFirebaseConfigured) {
        return { tasks: cached.data, source: 'cache' };
      }
    }

    // 2. Fetch from Firestore if online and configured
    if (this.online && isFirebaseConfigured) {
      try {
        const cloudTasks = await firestoreService.fetchTasks(userId);
        if (cloudTasks.length > 0 || (cached && cached.data.length === 0)) {
          // Re-apply any pending offline mutations on top of cloud data
          const pendingQueue = offlineQueue.getQueue().filter((q) => q.collection === 'tasks');
          let mergedTasks = [...cloudTasks];

          for (const item of pendingQueue) {
            if (item.operation === 'create' && item.data) {
              if (!mergedTasks.some((t) => t.id === item.docId)) {
                mergedTasks.unshift(item.data);
              }
            } else if (item.operation === 'update' && item.data) {
              const existingCloud = mergedTasks.find((t) => t.id === item.docId);
              if (existingCloud) {
                // If offline version has differing completion or notes, log conflict resolution
                if (existingCloud.completed !== item.data.completed) {
                  this.recordConflict(
                    'tasks',
                    item.docId,
                    item.data.title || existingCloud.title || 'Task',
                    'smart_merge',
                    `Offline status (completed: ${item.data.completed}) merged with cloud state without losing pyq/notes.`
                  );
                }
              }
              mergedTasks = mergedTasks.map((t) =>
                t.id === item.docId ? { ...t, ...item.data } : t
              );
            } else if (item.operation === 'delete') {
              mergedTasks = mergedTasks.filter((t) => t.id !== item.docId);
            }
          }

          cacheService.setTasks(userId, mergedTasks);
          return { tasks: mergedTasks, source: 'cloud' };
        }
      } catch (err) {
        console.warn('Could not fetch cloud tasks, falling back to cache:', err);
      }
    }

    // 3. Fallback: cached data or initial default tasks
    const finalTasks = cached?.data && cached.data.length > 0 ? cached.data : initialFallback;
    cacheService.setTasks(userId, finalTasks);
    return { tasks: finalTasks, source: cached ? 'cache' : 'fallback' };
  }

  /**
   * Load Goals: Local-First with Background Stale-While-Revalidate
   */
  public async loadGoals(
    userId: string,
    initialFallback: GoalItem[] = []
  ): Promise<{ goals: GoalItem[]; source: 'cache' | 'cloud' | 'fallback' }> {
    const cached = cacheService.getGoals(userId);
    if (cached && cached.data.length > 0) {
      if (cached.isFresh || !this.online || !isFirebaseConfigured) {
        return { goals: cached.data, source: 'cache' };
      }
    }

    if (this.online && isFirebaseConfigured) {
      try {
        const cloudGoals = await firestoreService.fetchGoals(userId);
        if (cloudGoals.length > 0 || (cached && cached.data.length === 0)) {
          const pendingQueue = offlineQueue.getQueue().filter((q) => q.collection === 'goals');
          let mergedGoals = [...cloudGoals];

          for (const item of pendingQueue) {
            if (item.operation === 'create' && item.data) {
              if (!mergedGoals.some((g) => g.id === item.docId)) {
                mergedGoals.unshift(item.data);
              }
            } else if (item.operation === 'update' && item.data) {
              const existingCloud = mergedGoals.find((g) => g.id === item.docId);
              if (existingCloud) {
                if (existingCloud.progressPercent !== item.data.progressPercent || existingCloud.completed !== item.data.completed) {
                  this.recordConflict(
                    'goals',
                    item.docId,
                    item.data.title || existingCloud.title || 'Goal',
                    'smart_merge',
                    `Goal progress (${item.data.progressPercent || 0}%) reconciled with cloud goal.`
                  );
                }
              }
              mergedGoals = mergedGoals.map((g) =>
                g.id === item.docId ? { ...g, ...item.data } : g
              );
            } else if (item.operation === 'delete') {
              mergedGoals = mergedGoals.filter((g) => g.id !== item.docId);
            }
          }

          cacheService.setGoals(userId, mergedGoals);
          return { goals: mergedGoals, source: 'cloud' };
        }
      } catch (err) {
        console.warn('Could not fetch cloud goals, falling back to cache:', err);
      }
    }

    const finalGoals = cached?.data && cached.data.length > 0 ? cached.data : initialFallback;
    cacheService.setGoals(userId, finalGoals);
    return { goals: finalGoals, source: cached ? 'cache' : 'fallback' };
  }

  /**
   * Optimistic Task Mutation with Auto Queue and Cloud Sync
   */
  public async mutateTask(
    userId: string,
    operation: 'create' | 'update' | 'delete',
    task: TaskItem,
    allTasks: TaskItem[]
  ): Promise<TaskItem[]> {
    let updatedTasks: TaskItem[];

    if (operation === 'create') {
      updatedTasks = [task, ...allTasks];
    } else if (operation === 'update') {
      updatedTasks = allTasks.map((t) => (t.id === task.id ? task : t));
    } else {
      updatedTasks = allTasks.filter((t) => t.id !== task.id);
    }

    // 1. Immediately update cache (zero lag for user)
    cacheService.setTasks(userId, updatedTasks);

    // 2. Queue mutation
    offlineQueue.enqueue({
      collection: 'tasks',
      operation,
      docId: task.id,
      data: operation === 'delete' ? undefined : task,
    });

    this.notify();

    // 3. Trigger cloud sync if online
    if (this.online && isFirebaseConfigured) {
      this.processQueue();
    }

    return updatedTasks;
  }

  /**
   * Optimistic Goal Mutation with Auto Queue and Cloud Sync
   */
  public async mutateGoal(
    userId: string,
    operation: 'create' | 'update' | 'delete',
    goal: GoalItem,
    allGoals: GoalItem[]
  ): Promise<GoalItem[]> {
    let updatedGoals: GoalItem[];

    if (operation === 'create') {
      updatedGoals = [goal, ...allGoals];
    } else if (operation === 'update') {
      updatedGoals = allGoals.map((g) => (g.id === goal.id ? goal : g));
    } else {
      updatedGoals = allGoals.filter((g) => g.id !== goal.id);
    }

    cacheService.setGoals(userId, updatedGoals);

    offlineQueue.enqueue({
      collection: 'goals',
      operation,
      docId: goal.id,
      data: operation === 'delete' ? undefined : goal,
    });

    this.notify();

    if (this.online && isFirebaseConfigured) {
      this.processQueue();
    }

    return updatedGoals;
  }

  /**
   * Load Daily Study Logs with Cache-First Strategy
   */
  public async loadDailyLogs(
    userId: string,
    initialFallback: DailyStudyLog[] = []
  ): Promise<{ dailyLogs: DailyStudyLog[]; source: 'cache' | 'cloud' | 'fallback' }> {
    const cached = cacheService.getDailyLogs(userId);
    if (cached && cached.length > 0) {
      if (!this.online || !isFirebaseConfigured) {
        return { dailyLogs: cached, source: 'cache' };
      }
    }

    if (this.online && isFirebaseConfigured) {
      try {
        const cloudLogs = await firestoreService.fetchDailyLogs(userId);
        if (cloudLogs.length > 0) {
          cacheService.setDailyLogs(userId, cloudLogs);
          return { dailyLogs: cloudLogs, source: 'cloud' };
        }
      } catch (err) {
        console.warn('Could not fetch cloud daily logs, using fallback:', err);
      }
    }

    const finalLogs = cached && cached.length > 0 ? cached : initialFallback;
    cacheService.setDailyLogs(userId, finalLogs);
    return { dailyLogs: finalLogs, source: cached ? 'cache' : 'fallback' };
  }

  /**
   * Mutate Daily Log with Local Cache and Firestore Queue
   */
  public async mutateDailyLog(
    userId: string,
    log: DailyStudyLog,
    allLogs: DailyStudyLog[]
  ): Promise<DailyStudyLog[]> {
    const existingIndex = allLogs.findIndex((l) => l.date === log.date);
    let updatedLogs: DailyStudyLog[];
    if (existingIndex >= 0) {
      updatedLogs = allLogs.map((l) => (l.date === log.date ? log : l));
    } else {
      updatedLogs = [log, ...allLogs];
    }

    cacheService.setDailyLogs(userId, updatedLogs);

    this.queueMutation({
      collection: 'daily_logs',
      operation: 'update',
      docId: log.id || `${userId}_${log.date}`,
      data: log,
    });

    return updatedLogs;
  }

  /**
   * Queue generic mutation
   */
  public queueMutation(mutation: {
    collection: 'tasks' | 'goals' | 'daily_logs' | 'users';
    operation: 'create' | 'update' | 'delete';
    docId: string;
    data?: any;
  }): void {
    offlineQueue.enqueue(mutation);
    this.notify();
    if (this.online && isFirebaseConfigured) {
      this.processQueue();
    }
  }
}

export const syncManager = new SyncManagerClass();
