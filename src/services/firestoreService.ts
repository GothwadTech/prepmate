/**
 * PrepMate - Firestore CRUD Service
 * Handles direct Firestore interactions for Tasks, Goals, and Daily Logs.
 * Optimized for Firebase Spark Free Tier.
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  writeBatch,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../firebase/config';
import { TaskItem, GoalItem, DailyStudyLog, QueuedMutation } from '../types';

export const firestoreService = {
  // ================= TASKS CRUD =================
  async fetchTasks(userId: string): Promise<TaskItem[]> {
    if (!isFirebaseConfigured || !db) return [];

    try {
      const q = query(
        collection(db, 'tasks'),
        where('userId', '==', userId)
      );
      const snapshot = await getDocs(q);
      const tasks: TaskItem[] = [];
      snapshot.forEach((docSnap) => {
        tasks.push({
          id: docSnap.id,
          ...(docSnap.data() as Omit<TaskItem, 'id'>),
          synced: true,
        });
      });
      return tasks;
    } catch (err) {
      console.error('Error fetching tasks from Firestore:', err);
      throw err;
    }
  },

  async saveTask(task: TaskItem): Promise<void> {
    if (!isFirebaseConfigured || !db) return;

    try {
      const taskRef = doc(db, 'tasks', task.id);
      const payload = {
        ...task,
        synced: true,
        updatedAt: new Date().toISOString(),
      };
      await setDoc(taskRef, payload, { merge: true });
    } catch (err) {
      console.error('Error saving task to Firestore:', err);
      throw err;
    }
  },

  async updateTask(taskId: string, updates: Partial<TaskItem>): Promise<void> {
    if (!isFirebaseConfigured || !db) return;

    try {
      const taskRef = doc(db, 'tasks', taskId);
      await updateDoc(taskRef, {
        ...updates,
        updatedAt: new Date().toISOString(),
      });
    } catch (err) {
      console.error('Error updating task in Firestore:', err);
      throw err;
    }
  },

  async deleteTask(taskId: string): Promise<void> {
    if (!isFirebaseConfigured || !db) return;

    try {
      const taskRef = doc(db, 'tasks', taskId);
      await deleteDoc(taskRef);
    } catch (err) {
      console.error('Error deleting task in Firestore:', err);
      throw err;
    }
  },

  // ================= GOALS CRUD =================
  async fetchGoals(userId: string): Promise<GoalItem[]> {
    if (!isFirebaseConfigured || !db) return [];

    try {
      const q = query(
        collection(db, 'goals'),
        where('userId', '==', userId)
      );
      const snapshot = await getDocs(q);
      const goals: GoalItem[] = [];
      snapshot.forEach((docSnap) => {
        goals.push({
          id: docSnap.id,
          ...(docSnap.data() as Omit<GoalItem, 'id'>),
          synced: true,
        });
      });
      return goals;
    } catch (err) {
      console.error('Error fetching goals from Firestore:', err);
      throw err;
    }
  },

  async saveGoal(goal: GoalItem): Promise<void> {
    if (!isFirebaseConfigured || !db) return;

    try {
      const goalRef = doc(db, 'goals', goal.id);
      const payload = {
        ...goal,
        synced: true,
        updatedAt: new Date().toISOString(),
      };
      await setDoc(goalRef, payload, { merge: true });
    } catch (err) {
      console.error('Error saving goal to Firestore:', err);
      throw err;
    }
  },

  async updateGoal(goalId: string, updates: Partial<GoalItem>): Promise<void> {
    if (!isFirebaseConfigured || !db) return;

    try {
      const goalRef = doc(db, 'goals', goalId);
      await updateDoc(goalRef, {
        ...updates,
        updatedAt: new Date().toISOString(),
      });
    } catch (err) {
      console.error('Error updating goal in Firestore:', err);
      throw err;
    }
  },

  async deleteGoal(goalId: string): Promise<void> {
    if (!isFirebaseConfigured || !db) return;

    try {
      const goalRef = doc(db, 'goals', goalId);
      await deleteDoc(goalRef);
    } catch (err) {
      console.error('Error deleting goal in Firestore:', err);
      throw err;
    }
  },

  // ================= DAILY STUDY LOGS CRUD =================
  async fetchDailyLogs(userId: string): Promise<DailyStudyLog[]> {
    if (!isFirebaseConfigured || !db) return [];

    try {
      const q = query(
        collection(db, 'daily_logs'),
        where('userId', '==', userId)
      );
      const snapshot = await getDocs(q);
      const logs: DailyStudyLog[] = [];
      snapshot.forEach((docSnap) => {
        logs.push({
          id: docSnap.id,
          ...(docSnap.data() as Omit<DailyStudyLog, 'id'>),
        });
      });
      return logs;
    } catch (err) {
      console.error('Error fetching daily logs from Firestore:', err);
      throw err;
    }
  },

  async saveDailyLog(log: DailyStudyLog): Promise<void> {
    if (!isFirebaseConfigured || !db) return;

    try {
      const docId = log.id || `${log.userId}_${log.date}`;
      const logRef = doc(db, 'daily_logs', docId);
      await setDoc(logRef, {
        ...log,
        id: docId,
        updatedAt: new Date().toISOString(),
      }, { merge: true });
    } catch (err) {
      console.error('Error saving daily log to Firestore:', err);
      throw err;
    }
  },

  // ================= BATCH QUEUE EXECUTION =================
  /**
   * Processes a queued mutation onto Firestore
   */
  async executeMutation(mutation: QueuedMutation): Promise<void> {
    if (!isFirebaseConfigured || !db) return;

    const { collection: colName, operation, docId, data } = mutation;
    const docRef = doc(db, colName, docId);

    if (operation === 'create' || operation === 'update') {
      await setDoc(docRef, { ...data, updatedAt: new Date().toISOString(), synced: true }, { merge: true });
    } else if (operation === 'delete') {
      await deleteDoc(docRef);
    }
  },
};
