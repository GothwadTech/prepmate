import {
  TaskItem,
  GoalItem,
  UserStats,
  SyncStatus,
  StudySession,
  DailyStudyLog,
  PartnerRequest,
  PartnerUserSearchResult,
  ActivePartnership,
  PartnerProfile,
  AppNotification,
  NotificationType,
  ConflictResolutionLog,
  QueuedMutation,
} from '../types';
import { StreakStats } from '../utils/streakUtils';

export interface DataContextType {
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

  // Partner system
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

  // Notifications & Reminders
  notifications: AppNotification[];
  unreadNotifCount: number;
  markNotifAsRead: (id: string) => void;
  markAllNotifsAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAllNotifs: () => void;
  sendTestNotification: (type: NotificationType) => void;
  requestNotificationPermission: () => Promise<void>;
  hasBrowserNotificationPermission: boolean;

  // Offline & Queue Management
  isSimulatingOffline: boolean;
  toggleSimulateOffline: () => void;
  pendingQueueList: QueuedMutation[];
  conflictLogs: ConflictResolutionLog[];
  removeQueueItem: (id: string) => void;
  clearQueue: () => void;
  clearConflictLogs: () => void;
}
