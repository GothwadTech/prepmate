/**
 * PrepMate - Core TypeScript Definitions
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
  date: string; // YYYY-MM-DD
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
  date: string; // YYYY-MM-DD
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
  id: string; // date_userId or custom ID
  date: string; // YYYY-MM-DD
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

export interface PartnerProfile {
  id: string;
  name: string;
  username: string;
  targetYear: string;
  targetScore: number;
  todayStudyHours: number;
  todayTasksCompleted: number;
  streakDays: number;
  avatarBg: string;
  bio?: string;
  lastActive?: string;
  isStudyingNow?: boolean;
  currentSubject?: 'Physics' | 'Chemistry' | 'Biology' | 'Revision';
  weeklyHours?: number;
  subjectBreakdown?: {
    physicsHours: number;
    chemistryHours: number;
    biologyHours: number;
  };
  recentCheer?: {
    from: string;
    message: string;
    timestamp: string;
  };
}

export type PartnerRequestStatus = 'pending' | 'accepted' | 'rejected' | 'cancelled';

export interface PartnerRequest {
  id: string;
  senderId: string;
  senderName: string;
  senderUsername: string;
  senderScore?: number;
  senderTargetYear?: string;
  senderAvatarBg?: string;
  receiverId: string;
  receiverUsername: string;
  receiverName?: string;
  status: PartnerRequestStatus;
  message?: string;
  createdAt: string;
  updatedAt?: string;
}

export type PartnerRelationStatus = 'self' | 'partner' | 'request_sent' | 'request_received' | 'none';

export interface PartnerUserSearchResult {
  uid: string;
  displayName: string;
  username: string;
  targetYear: string;
  targetScore: number;
  avatarBg?: string;
  bio?: string;
  relationStatus: PartnerRelationStatus;
  pendingRequestId?: string;
}

export interface PartnerCheer {
  id: string;
  senderId: string;
  senderName: string;
  message: string;
  timestamp: string;
}

export interface ActivePartnership {
  id: string;
  user1Id: string;
  user2Id: string;
  partner: PartnerProfile;
  connectedAt: string;
  status: 'active' | 'ended';
  lastSyncedAt?: string;
  cheers?: PartnerCheer[];
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
  physicsProgress: number; // 0 - 100
  chemistryProgress: number; // 0 - 100
  biologyProgress: number; // 0 - 100
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

// Phase 12: Leaderboard + Challenges types
export type LeaderboardFilter = 'all' | 'physics' | 'chemistry' | 'biology' | 'streak';

export interface LeaderboardEntry {
  uid: string;
  rank: number;
  displayName: string;
  username: string;
  targetYear: string;
  targetScore: number;
  avatarBg: string;
  weeklyStudyHours: number;
  weeklyTasksCompleted: number;
  streakDays: number;
  prepScore: number; // 0 to 100
  badgeTitle: string;
  location?: string;
  isCurrentUser?: boolean;
  isPartner?: boolean;
  isStudyingNow?: boolean;
}

export type ChallengeCategory = 'hours' | 'tasks' | 'streak' | 'physics' | 'chemistry' | 'biology' | 'mock_test';
export type ChallengeMode = 'coop' | 'vs';
export type ChallengeStatus = 'available' | 'active' | 'completed';

export interface PartnerChallenge {
  id: string;
  title: string;
  description: string;
  category: ChallengeCategory;
  mode: ChallengeMode;
  targetMetric: number;
  metricUnit: string;
  userProgress: number;
  partnerProgress: number;
  status: ChallengeStatus;
  rewardXp: number;
  rewardBadge: string;
  daysRemaining: number;
  expiresAt: string;
  createdAt: string;
  completedAt?: string;
  subject?: SubjectType;
}

export interface ScoreBreakdown {
  totalScore: number;
  studyHoursPoints: number; // Max 45
  tasksPoints: number; // Max 35
  streakPoints: number; // Max 20
  percentileRank: number;
  level: number;
  levelTitle: string;
  xpPoints: number;
}

// Phase 14: Profile & Settings types
export interface AchievementBadge {
  id: string;
  title: string;
  icon: string;
  description: string;
  category: 'streak' | 'study_hours' | 'tasks' | 'subject' | 'partner' | 'milestone';
  unlocked: boolean;
  unlockedAt?: string;
  currentProgress?: number;
  targetProgress?: number;
  progressLabel?: string;
  rarity?: 'Common' | 'Rare' | 'Epic' | 'Legendary';
}

export interface UserSettings {
  theme: AppTheme;
  dailyGoalHours: number; // e.g. 4, 6, 8, 10
  dreamCollege?: string; // e.g. 'AIIMS New Delhi'
  notifications: {
    morningReminder: boolean;
    streakWarning: boolean;
    partnerAlerts: boolean;
    dailySummary: boolean;
  };
}

// Phase 15: Notifications & Reminders
export type NotificationType = 'daily_reminder' | 'streak_warning' | 'partner_activity' | 'challenge' | 'system';

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string; // ISO string
  read: boolean;
  actionTab?: AppTab;
  actionLabel?: string;
  icon?: string;
}

// Phase 16: Offline Sync & Conflict Resolution
export interface ConflictResolutionLog {
  id: string;
  collection: 'tasks' | 'goals' | 'daily_logs';
  docId: string;
  docTitle: string;
  resolvedAt: string;
  resolutionStrategy: 'last_write_wins' | 'smart_merge' | 'client_wins';
  details: string;
}

