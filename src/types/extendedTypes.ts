import { SubjectType, AppTab, AppTheme } from '../types';

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
  prepScore: number;
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
  studyHoursPoints: number;
  tasksPoints: number;
  streakPoints: number;
  percentileRank: number;
  level: number;
  levelTitle: string;
  xpPoints: number;
}

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
  dailyGoalHours: number;
  dreamCollege?: string;
  notifications: {
    morningReminder: boolean;
    streakWarning: boolean;
    partnerAlerts: boolean;
    dailySummary: boolean;
  };
}

export type NotificationType = 'daily_reminder' | 'streak_warning' | 'partner_activity' | 'challenge' | 'system';

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionTab?: AppTab;
  actionLabel?: string;
  icon?: string;
}

export interface ConflictResolutionLog {
  id: string;
  collection: 'tasks' | 'goals' | 'daily_logs';
  docId: string;
  docTitle: string;
  resolvedAt: string;
  resolutionStrategy: 'last_write_wins' | 'smart_merge' | 'client_wins';
  details: string;
}
