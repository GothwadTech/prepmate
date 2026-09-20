/**
 * Prepmate - Offline Mutation Queue
 * Stores mutations locally when user is offline or Firebase is not configured,
 * ensuring zero data loss and seamless sync upon reconnection.
 */

import { QueuedMutation } from '../types';
import { cacheService } from './cacheService';

export const offlineQueue = {
  getQueue(): QueuedMutation[] {
    return cacheService.getOfflineQueue();
  },

  enqueue(mutation: Omit<QueuedMutation, 'id' | 'timestamp'>): QueuedMutation {
    const queue = cacheService.getOfflineQueue();
    const item: QueuedMutation = {
      ...mutation,
      id: `queue-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      timestamp: Date.now(),
      retryCount: 0,
    };

    // Deduplicate or merge consecutive updates for same docId to optimize Firestore writes
    const existingIndex = queue.findIndex(
      (q) => q.docId === item.docId && q.collection === item.collection
    );

    if (existingIndex !== -1 && item.operation === 'update') {
      const existing = queue[existingIndex];
      if (existing.operation === 'create') {
        // Keep as create but merge data
        existing.data = { ...existing.data, ...item.data };
        existing.timestamp = Date.now();
      } else {
        existing.data = { ...existing.data, ...item.data };
        existing.timestamp = Date.now();
      }
      cacheService.setOfflineQueue(queue);
      return existing;
    } else if (existingIndex !== -1 && item.operation === 'delete') {
      const existing = queue[existingIndex];
      if (existing.operation === 'create') {
        // Was created offline then deleted offline: remove altogether
        queue.splice(existingIndex, 1);
        cacheService.setOfflineQueue(queue);
        return item;
      } else {
        // Was existing doc, replace with delete mutation
        queue[existingIndex] = item;
        cacheService.setOfflineQueue(queue);
        return item;
      }
    } else {
      queue.push(item);
      cacheService.setOfflineQueue(queue);
      return item;
    }
  },

  remove(id: string): void {
    const queue = cacheService.getOfflineQueue().filter((q) => q.id !== id);
    cacheService.setOfflineQueue(queue);
  },

  incrementRetry(id: string): void {
    const queue = cacheService.getOfflineQueue().map((q) =>
      q.id === id ? { ...q, retryCount: (q.retryCount || 0) + 1 } : q
    );
    cacheService.setOfflineQueue(queue);
  },

  clear(): void {
    cacheService.setOfflineQueue([]);
  },

  count(): number {
    return cacheService.getOfflineQueue().length;
  },
};
