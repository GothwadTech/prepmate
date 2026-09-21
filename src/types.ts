/**
 * Prepmate - Core TypeScript Definitions
 * Project by Gothwad Tech for NEET Aspirants
 */

export type AppTab = 'home' | 'tasks' | 'goals' | 'partners' | 'syllabus' | 'profile' | 'analytics';

export type AppTheme = 'light' | 'dark';

export type SubjectType = 'Physics' | 'Chemistry' | 'Biology';

export type TaskType = 'MCQs' | 'Notes' | 'Revision' | 'Lecture' | 'Test';

export type TimerMode = 'pomodoro' | 'short_break' | 'long_break' | 'deep_study' | 'custom' | 'stopwatch';

export interface StudySession {
  id: string;
  userId?: string;
  subject: SubjectType;
  chapter?: string;
  durationMinutes: number;
  mode: TimerMode;
  date: string;
  completedAt: string;
  linkedTaskId?: string;
  notes?: string;
}

export interface TaskItem {
  id: string;
  userId?: string;
  title: string;
  subject: SubjectType;
  chapter: string;
  type: TaskType;
  targetCount: number;
  completedCount: number;
  completed: boolean;
  date: string;
  createdAt?: string;
  updatedAt?: string;
  synced?: boolean;
}

export interface GoalItem {
  id: string;
  userId?: string;
  title: string;
  subject: SubjectType;
  chapter: string;
  deadline: string;
  targetMetric: string;
  progressPercent: number;
  completed: boolean;
  createdAt?: string;
  updatedAt?: string;
  synced?: boolean;
}

export interface DailyStudyLog {
  id: string;
  date: string;
  userId: string;
  studyMinutes: number;
  tasksCompleted: number;
  tasksTotal: number;
  physicsMinutes: number;
  chemistryMinutes: number;
  biologyMinutes: number;
  chaptersStudied?: string[];
  notes?: string;
  isShieldUsed?: boolean;
  updatedAt: string;
}

export interface StreakMilestone {
  days: number;
  title: string;
  badge: string;
  description: string;
  color: string;
  unlocked: boolean;
}

export interface WeeklySubjectBreakdown {
  subject: SubjectType;
  minutes: number;
  percentage: number;
  recommendedPercentage: number;
  highYieldChaptersCovered: string[];
}

export type SyncStatus = 'synced' | 'syncing' | 'offline' | 'pending';

export interface QueuedMutation {
  id: string;
  collection: 'tasks' | 'goals' | 'daily_logs' | 'users';
  operation: 'create' | 'update' | 'delete';
  docId: string;
  data?: any;
  timestamp: number;
  retryCount?: number;
}

export interface CacheMetadata {
  lastSyncedAt: number;
  itemCount: number;
  version: number;
}

export interface UserStats {
  todayStudyMinutes: number;
  tasksCompletedToday: number;
  totalTasksToday: number;
  streakDays: number;
  longestStreakDays?: number;
  totalActiveDays?: number;
  streakShields?: number;
  targetYear: string;
  targetScore: number;
  physicsProgress: number;
  chemistryProgress: number;
  biologyProgress: number;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  username: string;
  targetYear: string;
  targetScore: number;
  createdAt: string;
  photoURL?: string;
  bio?: string;
}

export interface ToastNotification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

// Re-export extended types
export * from './types/extendedTypes';
