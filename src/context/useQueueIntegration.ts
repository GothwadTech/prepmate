import { useState, useEffect, useCallback } from 'react';
import { SyncStatus, QueuedMutation, ConflictResolutionLog } from '../types';
import { syncManager } from '../services/syncManager';

export function useQueueIntegration(showToast: (msg: string, type: 'success' | 'error' | 'info') => void) {
  const [syncStatus, setSyncStatus] = useState<SyncStatus>(syncManager.getStatus());
  const [pendingCount, setPendingCount] = useState<number>(syncManager.getPendingCount());
  const [isOnline, setIsOnline] = useState<boolean>(syncManager.isOnline());
  const [isSimulatingOffline, setIsSimulatingOffline] = useState<boolean>(() => syncManager.isSimulatingOffline());
  const [pendingQueueList, setPendingQueueList] = useState<QueuedMutation[]>(() => syncManager.getQueue());
  const [conflictLogs, setConflictLogs] = useState<ConflictResolutionLog[]>(() => syncManager.getConflictLogs());

  useEffect(() => {
    const unsubSync = syncManager.subscribe((status, count) => {
      setSyncStatus(status);
      setPendingCount(count);
      setIsOnline(syncManager.isOnline());
      setIsSimulatingOffline(syncManager.isSimulatingOffline());
      setPendingQueueList(syncManager.getQueue());
      setConflictLogs(syncManager.getConflictLogs());
    });
    return unsubSync;
  }, []);

  const toggleSimulateOffline = useCallback(() => {
    const next = !syncManager.isSimulatingOffline();
    syncManager.setSimulateOffline(next);
    setIsSimulatingOffline(next);
    setIsOnline(syncManager.isOnline());
    if (next) {
      showToast('Simulated Offline Mode active. All changes queued locally.', 'info');
    } else {
      showToast('Online mode restored. Syncing pending mutations...', 'success');
    }
  }, [showToast]);

  const removeQueueItem = useCallback((id: string) => {
    syncManager.removeFromQueue(id);
    setPendingQueueList(syncManager.getQueue());
    showToast('Queued mutation removed.', 'info');
  }, [showToast]);

  const clearQueue = useCallback(() => {
    syncManager.clearQueue();
    setPendingQueueList([]);
    showToast('Offline queue cleared.', 'info');
  }, [showToast]);

  const clearConflictLogs = useCallback(() => {
    syncManager.clearConflictLogs();
    setConflictLogs([]);
    showToast('Conflict log history cleared.', 'info');
  }, [showToast]);

  return {
    syncStatus,
    setSyncStatus,
    pendingCount,
    setPendingCount,
    isOnline,
    setIsOnline,
    isSimulatingOffline,
    pendingQueueList,
    conflictLogs,
    toggleSimulateOffline,
    removeQueueItem,
    clearQueue,
    clearConflictLogs,
  };
}
