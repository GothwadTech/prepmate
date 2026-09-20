import React, { useState, useEffect, useMemo } from 'react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Input } from '../components/common/Input';
import {
  SunIcon,
  MoonIcon,
  CheckIcon,
  AwardIcon,
  LogoutIcon,
  UserIcon,
  InfoIcon,
  CloudCheckIcon,
  RefreshCwIcon,
  CloudOffIcon,
  ChevronLeftIcon,
  TrendingUpIcon,
  FlameIcon,
  ClockIcon,
  CheckCircle2Icon,
  SparklesIcon,
  BellIcon,
  SlidersIcon,
  SettingsIcon,
  BarChartIcon,
  TargetIcon,
} from '../components/icons/SvgIcons';
import { AppTheme, UserStats, AchievementBadge, UserSettings } from '../types';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { calculatePrepScoreBreakdown } from '../utils/scoreUtils';
import { calculateUserBadges } from '../utils/badgeUtils';

interface ProfilePageProps {
  theme: AppTheme;
  onToggleTheme: () => void;
  stats: UserStats;
  onUpdateStats: (newStats: Partial<UserStats>) => void;
  onBack?: () => void;
  onNavigateToAnalytics?: () => void;
  onOpenSyncInspector?: () => void;
  onOpenNotifications?: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  theme,
  onToggleTheme,
  stats,
  onUpdateStats,
  onBack,
  onNavigateToAnalytics,
  onOpenSyncInspector,
  onOpenNotifications,
}) => {
  const { user, logout, updateProfile, isFirebaseConfigured } = useAuth();
  const {
    syncStatus,
    pendingCount,
    isOnline,
    syncNow,
    tasks,
    sessions,
    dailyLogs,
    activePartner,
    isSimulatingOffline,
    toggleSimulateOffline,
    pendingQueueList,
    conflictLogs,
    sendTestNotification,
    requestNotificationPermission,
    hasBrowserNotificationPermission,
  } = useData();

  // Profile Edit State
  const [displayName, setDisplayName] = useState(user?.displayName || 'NEET Aspirant');
  const [username, setUsername] = useState(user?.username || 'aspirant');
  const [targetYear, setTargetYear] = useState(user?.targetYear || stats.targetYear || '2026');
  const [targetScore, setTargetScore] = useState(
    (user?.targetScore || stats.targetScore || 680).toString()
  );
  const [dreamCollege, setDreamCollege] = useState(() => {
    return localStorage.getItem('prepmate_dream_college') || 'AIIMS New Delhi 🩺';
  });
  const [bio, setBio] = useState(() => {
    return localStorage.getItem('prepmate_user_bio') || 'Aspiring Doctor • Focused on NEET & NCERT';
  });

  // Settings State: Daily Goal Hours & Notifications
  const [dailyGoalHours, setDailyGoalHours] = useState<number>(() => {
    const saved = localStorage.getItem('prepmate_daily_goal_hours');
    return saved ? parseInt(saved, 10) : 6;
  });

  const [notifications, setNotifications] = useState({
    morningReminder: true,
    streakWarning: true,
    partnerAlerts: true,
    dailySummary: false,
  });

  const [saving, setSaving] = useState(false);
  const [syncingCloud, setSyncingCloud] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [activeBadgeTab, setActiveBadgeTab] = useState<'all' | 'unlocked' | 'in_progress'>('all');
  const [selectedBadge, setSelectedBadge] = useState<AchievementBadge | null>(null);

  // Sync settings from localStorage
  useEffect(() => {
    const savedNotifs = localStorage.getItem('prepmate_notifications');
    if (savedNotifs) {
      try {
        setNotifications(JSON.parse(savedNotifs));
      } catch (e) {
        console.warn(e);
      }
    }
  }, []);

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName);
      setUsername(user.username);
      setTargetYear(user.targetYear);
      setTargetScore(user.targetScore.toString());
    }
  }, [user]);

  // Aggregate stats & score breakdown
  const todayStudyHours = Math.round(((stats.todayStudyMinutes || 0) / 60) * 10) / 10;
  const scoreBreakdown = useMemo(() => {
    return calculatePrepScoreBreakdown(todayStudyHours, stats.tasksCompletedToday || 0, stats.streakDays || 0);
  }, [todayStudyHours, stats.tasksCompletedToday, stats.streakDays]);

  // Next level threshold calculation
  const currentLevel = scoreBreakdown.level;
  const currentXp = scoreBreakdown.xpPoints;
  const xpThresholds = [0, 250, 500, 800, 1200, 1800, 2500, 3400, 4500, 6000, 8000];
  const currentLevelBaseXp = xpThresholds[currentLevel - 1] || 0;
  const nextLevelXp = xpThresholds[currentLevel] || 8000;
  const xpProgressInLevel = Math.max(0, currentXp - currentLevelBaseXp);
  const xpNeededForNext = Math.max(1, nextLevelXp - currentLevelBaseXp);
  const xpProgressPercent = Math.min(100, Math.round((xpProgressInLevel / xpNeededForNext) * 100));

  // Compute Badges
  const badges = useMemo(() => {
    return calculateUserBadges({
      stats,
      tasks,
      sessions,
      dailyLogs,
      partner: activePartner,
      completedChaptersCount: 6,
    });
  }, [stats, tasks, sessions, dailyLogs, activePartner]);

  const unlockedBadgesCount = badges.filter((b) => b.unlocked).length;

  const filteredBadges = useMemo(() => {
    if (activeBadgeTab === 'unlocked') return badges.filter((b) => b.unlocked);
    if (activeBadgeTab === 'in_progress') return badges.filter((b) => !b.unlocked);
    return badges;
  }, [badges, activeBadgeTab]);

  const handleManualSync = async () => {
    setSyncingCloud(true);
    try {
      await syncNow();
    } finally {
      setSyncingCloud(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const parsedScore = parseInt(targetScore, 10) || 680;

    try {
      await updateProfile({
        displayName,
        username,
        targetYear,
        targetScore: parsedScore,
      });

      onUpdateStats({
        targetYear,
        targetScore: parsedScore,
      });

      localStorage.setItem('prepmate_dream_college', dreamCollege);
      localStorage.setItem('prepmate_user_bio', bio);
      localStorage.setItem('prepmate_daily_goal_hours', dailyGoalHours.toString());
      localStorage.setItem('prepmate_notifications', JSON.stringify(notifications));

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch {
      //
    } finally {
      setSaving(false);
    }
  };

  const handleToggleNotification = (key: keyof typeof notifications) => {
    setNotifications((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      localStorage.setItem('prepmate_notifications', JSON.stringify(updated));
      return updated;
    });
  };

  const handleSelectGoalHours = (hours: number) => {
    setDailyGoalHours(hours);
    localStorage.setItem('prepmate_daily_goal_hours', hours.toString());
  };

  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase() || 'GT';
  };

  return (
    <div id="profile-settings-page" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Back button if opened from header */}
      {onBack && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '2px 0' }}>
          <button
            type="button"
            onClick={onBack}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'none',
              border: 'none',
              color: 'var(--primary)',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              padding: '4px 0',
            }}
            id="profile-back-btn"
          >
            <ChevronLeftIcon size={18} /> Back to Dashboard
          </button>

          {onNavigateToAnalytics && (
            <button
              type="button"
              onClick={onNavigateToAnalytics}
              id="header-goto-analytics-btn"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'var(--primary-container)',
                border: '1px solid var(--border)',
                color: 'var(--primary)',
                fontSize: '11.5px',
                fontWeight: 700,
                cursor: 'pointer',
                padding: '4px 10px',
                borderRadius: 'var(--radius-pill)',
              }}
            >
              <BarChartIcon size={14} /> View Analytics
            </button>
          )}
        </div>
      )}

      {/* Profile Header Hero Card */}
      <Card id="user-profile-hero-card">
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
          <div
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--primary) 0%, #0366D6 100%)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '22px',
              fontWeight: 800,
              boxShadow: '0 4px 12px rgba(4, 148, 244, 0.3)',
              flexShrink: 0,
            }}
          >
            {getInitials(displayName || user?.displayName || 'Aspirant')}
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                {displayName || user?.displayName || 'Aspirant'}
              </h3>
              <Badge variant="primary">NEET {targetYear}</Badge>
            </div>

            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '2px 0 0 0' }}>
              @{username} • {user?.email || 'aspirant@prepmate.ai'}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px', flexWrap: 'wrap' }}>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  color: 'var(--primary)',
                  backgroundColor: 'var(--primary-container)',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-xs)',
                }}
              >
                🏥 {dreamCollege}
              </span>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  color: 'var(--success)',
                  backgroundColor: 'var(--success-container)',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-xs)',
                }}
              >
                🎯 Target: {targetScore}+ Marks
              </span>
            </div>
          </div>
        </div>

        {/* Bio quote / motto */}
        <p
          style={{
            fontSize: '12px',
            fontStyle: 'italic',
            color: 'var(--text-secondary)',
            marginTop: '12px',
            marginBottom: 0,
            paddingTop: '8px',
            borderTop: '1px solid var(--border)',
          }}
        >
          "{bio}"
        </p>
      </Card>

      {/* Level & XP Progress Card (Phase 14: Level & XP) */}
      <Card
        id="level-xp-card"
        title={`Level ${currentLevel}: ${scoreBreakdown.levelTitle}`}
        subtitle={`${currentXp.toLocaleString()} Total XP Accumulated`}
        action={
          <span
            style={{
              fontSize: '11px',
              fontWeight: 800,
              color: 'var(--secondary)',
              backgroundColor: 'var(--secondary-container)',
              padding: '2px 8px',
              borderRadius: 'var(--radius-xs)',
            }}
          >
            Level {currentLevel}/10
          </span>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
            <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>XP to Level {currentLevel + 1}:</span>
            <span style={{ fontWeight: 800, color: 'var(--text-primary)' }}>
              {xpProgressInLevel} / {xpNeededForNext} XP ({xpProgressPercent}%)
            </span>
          </div>

          {/* XP Progress Bar */}
          <div
            style={{
              height: '10px',
              borderRadius: 'var(--radius-pill)',
              backgroundColor: 'var(--border)',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <div
              style={{
                width: `${xpProgressPercent}%`,
                height: '100%',
                background: 'linear-gradient(90deg, var(--secondary) 0%, #9C27B0 100%)',
                borderRadius: 'var(--radius-pill)',
                transition: 'width 0.4s ease',
              }}
            />
          </div>

          {/* XP Breakdown Earned */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '6px',
              marginTop: '6px',
              textAlign: 'center',
              fontSize: '11px',
            }}
          >
            <div style={{ padding: '6px 4px', background: 'var(--surface-variant)', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ color: 'var(--text-secondary)' }}>Study Hours</div>
              <strong style={{ color: 'var(--primary)' }}>+{scoreBreakdown.studyHoursPoints * 25} XP</strong>
            </div>
            <div style={{ padding: '6px 4px', background: 'var(--surface-variant)', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ color: 'var(--text-secondary)' }}>Daily Tasks</div>
              <strong style={{ color: 'var(--success)' }}>+{scoreBreakdown.tasksPoints * 20} XP</strong>
            </div>
            <div style={{ padding: '6px 4px', background: 'var(--surface-variant)', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ color: 'var(--text-secondary)' }}>Streak Bonus</div>
              <strong style={{ color: 'var(--flame, #FF6B4A)' }}>+{scoreBreakdown.streakPoints * 30} XP</strong>
            </div>
          </div>
        </div>
      </Card>

      {/* Aspirant Stats Snapshot */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }} id="profile-stats-grid">
        <Card id="stat-current-streak" style={{ textAlign: 'center', padding: '12px 6px' }}>
          <FlameIcon size={18} color="var(--flame, #FF6B4A)" style={{ margin: '0 auto 4px auto' }} />
          <div style={{ fontSize: '18px', fontWeight: 900, color: 'var(--text-primary)' }}>
            {stats.streakDays} <span style={{ fontSize: '11px', fontWeight: 600 }}>days</span>
          </div>
          <span style={{ fontSize: '10.5px', color: 'var(--text-secondary)' }}>Streak Flame</span>
        </Card>

        <Card id="stat-total-tasks" style={{ textAlign: 'center', padding: '12px 6px' }}>
          <CheckCircle2Icon size={18} color="var(--success)" style={{ margin: '0 auto 4px auto' }} />
          <div style={{ fontSize: '18px', fontWeight: 900, color: 'var(--text-primary)' }}>
            {tasks.filter((t) => t.completed).length} <span style={{ fontSize: '11px', fontWeight: 600 }}>tasks</span>
          </div>
          <span style={{ fontSize: '10.5px', color: 'var(--text-secondary)' }}>Completed</span>
        </Card>

        <Card id="stat-prep-percentile" style={{ textAlign: 'center', padding: '12px 6px' }}>
          <TrendingUpIcon size={18} color="var(--primary)" style={{ margin: '0 auto 4px auto' }} />
          <div style={{ fontSize: '18px', fontWeight: 900, color: 'var(--text-primary)' }}>
            Top {Math.max(1, 100 - scoreBreakdown.percentileRank)}%
          </div>
          <span style={{ fontSize: '10.5px', color: 'var(--text-secondary)' }}>Percentile</span>
        </Card>
      </div>

      {/* Achievement Badges Section (Phase 14: Achievement Badges) */}
      <Card
        id="achievement-badges-card"
        title="Achievement Badges"
        subtitle={`${unlockedBadgesCount} of ${badges.length} Badges Unlocked`}
        action={
          <div style={{ display: 'flex', gap: '3px' }}>
            {(['all', 'unlocked', 'in_progress'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveBadgeTab(tab)}
                style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  padding: '3px 7px',
                  borderRadius: 'var(--radius-pill)',
                  border: '1px solid var(--border)',
                  backgroundColor: activeBadgeTab === tab ? 'var(--primary)' : 'transparent',
                  color: activeBadgeTab === tab ? '#FFFFFF' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                }}
              >
                {tab === 'in_progress' ? 'Locked' : tab}
              </button>
            ))}
          </div>
        }
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '8px',
          }}
          id="badges-grid-container"
        >
          {filteredBadges.map((badge) => (
            <div
              key={badge.id}
              onClick={() => setSelectedBadge(badge)}
              style={{
                padding: '10px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: badge.unlocked ? 'var(--surface-variant)' : 'var(--surface)',
                border: badge.unlocked ? '1px solid var(--primary)' : '1px solid var(--border)',
                opacity: badge.unlocked ? 1 : 0.65,
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <span
                style={{
                  fontSize: '22px',
                  lineHeight: 1,
                  filter: badge.unlocked ? 'none' : 'grayscale(1)',
                }}
              >
                {badge.icon}
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '4px' }}>
                  <strong
                    style={{
                      fontSize: '12px',
                      color: 'var(--text-primary)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {badge.title}
                  </strong>
                  {badge.unlocked && <CheckIcon size={12} color="var(--success)" />}
                </div>

                <p
                  style={{
                    fontSize: '10.5px',
                    color: 'var(--text-secondary)',
                    margin: '2px 0 4px 0',
                    lineHeight: 1.3,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {badge.description}
                </p>

                {/* Progress bar */}
                <div
                  style={{
                    height: '4px',
                    borderRadius: '2px',
                    backgroundColor: 'var(--border)',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: `${badge.unlocked ? 100 : Math.min(100, Math.round(((badge.currentProgress || 0) / (badge.targetProgress || 1)) * 100))}%`,
                      height: '100%',
                      backgroundColor: badge.unlocked ? 'var(--success)' : 'var(--primary)',
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Badge Details Modal Dialog */}
        {selectedBadge && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: '16px',
            }}
            onClick={() => setSelectedBadge(null)}
          >
            <div
              style={{
                backgroundColor: 'var(--surface)',
                borderRadius: 'var(--radius-lg)',
                padding: '20px',
                maxWidth: '360px',
                width: '100%',
                border: '1px solid var(--border)',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
                textAlign: 'center',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <span style={{ fontSize: '48px', display: 'block', marginBottom: '8px' }}>
                {selectedBadge.icon}
              </span>
              <h3 style={{ fontSize: '18px', fontWeight: 800, margin: '0 0 4px 0', color: 'var(--text-primary)' }}>
                {selectedBadge.title}
              </h3>
              <Badge variant={selectedBadge.unlocked ? 'success' : 'neutral'}>
                {selectedBadge.unlocked ? '✓ Unlocked' : 'Locked'} • {selectedBadge.rarity || 'Common'}
              </Badge>

              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '12px 0', lineHeight: 1.45 }}>
                {selectedBadge.description}
              </p>

              <div
                style={{
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--surface-variant)',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  marginBottom: '16px',
                }}
              >
                Requirement: {selectedBadge.progressLabel || `${selectedBadge.targetProgress} target`}
              </div>

              <Button variant="primary" size="sm" isFullWidth onClick={() => setSelectedBadge(null)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Settings Section (Phase 14: Settings) */}
      <Card id="aspirant-settings-card" title="Aspirant Study Settings" subtitle="Daily goal hours, theme & reminders">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Theme Settings (Google Style) */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>
              App Theme
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <button
                type="button"
                className={`btn ${theme === 'light' ? 'btn-primary' : 'btn-outline'}`}
                onClick={theme === 'dark' ? onToggleTheme : undefined}
                id="select-light-theme-btn"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '8px 12px',
                  fontWeight: 700,
                  fontSize: '13px',
                }}
              >
                <SunIcon size={16} /> Light Theme
              </button>
              <button
                type="button"
                className={`btn ${theme === 'dark' ? 'btn-primary' : 'btn-outline'}`}
                onClick={theme === 'light' ? onToggleTheme : undefined}
                id="select-dark-theme-btn"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '8px 12px',
                  fontWeight: 700,
                  fontSize: '13px',
                }}
              >
                <MoonIcon size={16} /> Dark Theme
              </button>
            </div>
          </div>

          {/* Daily Goal Hours (Phase 14 requirement) */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>
                Target Daily Study Hours:
              </label>
              <span style={{ fontSize: '13px', fontWeight: 900, color: 'var(--primary)' }}>
                {dailyGoalHours} Hours / Day
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px' }}>
              {[4, 6, 8, 10, 12].map((hours) => (
                <button
                  key={hours}
                  type="button"
                  onClick={() => handleSelectGoalHours(hours)}
                  style={{
                    padding: '8px 4px',
                    borderRadius: 'var(--radius-sm)',
                    border: dailyGoalHours === hours ? '2px solid var(--primary)' : '1px solid var(--border)',
                    backgroundColor: dailyGoalHours === hours ? 'var(--primary-container)' : 'var(--surface-variant)',
                    color: dailyGoalHours === hours ? 'var(--primary)' : 'var(--text-primary)',
                    fontWeight: 800,
                    fontSize: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {hours}h
                </button>
              ))}
            </div>
            <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '6px', marginBottom: 0 }}>
              Recommended for NEET 2026: 6 to 8 hours daily for consistent AIR & GMC qualification.
            </p>
          </div>

          {/* Notifications & Reminders (Phase 14 requirement) */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: '8px' }}>
              Study Notifications & Reminders
            </label>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 10px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--surface-variant)',
                  border: '1px solid var(--border)',
                }}
              >
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>
                    🌅 Morning Study Kickoff (7:00 AM)
                  </div>
                  <div style={{ fontSize: '10.5px', color: 'var(--text-secondary)' }}>
                    Daily reminder to start your high-priority NEET tasks
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.morningReminder}
                  onChange={() => handleToggleNotification('morningReminder')}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--primary)', cursor: 'pointer' }}
                />
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 10px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--surface-variant)',
                  border: '1px solid var(--border)',
                }}
              >
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>
                    🔥 Evening Streak Saver Alert (9:00 PM)
                  </div>
                  <div style={{ fontSize: '10.5px', color: 'var(--text-secondary)' }}>
                    Warning alert if daily goals are pending to save streak
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.streakWarning}
                  onChange={() => handleToggleNotification('streakWarning')}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--primary)', cursor: 'pointer' }}
                />
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 10px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--surface-variant)',
                  border: '1px solid var(--border)',
                }}
              >
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>
                    🤝 Partner Cheers & VS Challenge Updates
                  </div>
                  <div style={{ fontSize: '10.5px', color: 'var(--text-secondary)' }}>
                    Notify when study partner starts studying or sends cheer
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.partnerAlerts}
                  onChange={() => handleToggleNotification('partnerAlerts')}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--primary)', cursor: 'pointer' }}
                />
              </div>
            </div>

            {/* Quick Test & Browser Alert Row */}
            <div
              style={{
                marginTop: '10px',
                padding: '10px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--surface-variant)',
                border: '1px solid var(--border)',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  🔔 System & Browser Push:
                </span>
                <button
                  type="button"
                  onClick={requestNotificationPermission}
                  style={{
                    backgroundColor: hasBrowserNotificationPermission ? 'var(--success)' : 'var(--primary)',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: 'var(--radius-pill)',
                    padding: '3px 8px',
                    fontSize: '10.5px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                  id="profile-enable-browser-notif-btn"
                >
                  {hasBrowserNotificationPermission ? '✓ Enabled' : 'Enable Device Alerts'}
                </button>
              </div>

              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                Test alerts instantly:
              </div>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => sendTestNotification('daily_reminder')}
                  style={{
                    padding: '4px 8px',
                    borderRadius: 'var(--radius-pill)',
                    border: '1px solid var(--border)',
                    backgroundColor: 'var(--surface)',
                    color: 'var(--text-primary)',
                    fontSize: '10.5px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  🌅 Test 7:00 AM Kickoff
                </button>
                <button
                  type="button"
                  onClick={() => sendTestNotification('streak_warning')}
                  style={{
                    padding: '4px 8px',
                    borderRadius: 'var(--radius-pill)',
                    border: '1px solid var(--border)',
                    backgroundColor: 'var(--surface)',
                    color: 'var(--text-primary)',
                    fontSize: '10.5px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  🔥 Test 9:00 PM Streak Alert
                </button>
                <button
                  type="button"
                  onClick={() => sendTestNotification('partner_activity')}
                  style={{
                    padding: '4px 8px',
                    borderRadius: 'var(--radius-pill)',
                    border: '1px solid var(--border)',
                    backgroundColor: 'var(--surface)',
                    color: 'var(--text-primary)',
                    fontSize: '10.5px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  🤝 Test Partner Cheer
                </button>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Edit Profile Card (Phase 14: Edit Profile) */}
      <Card id="edit-profile-card" title="Edit Aspirant Profile & Target">
        <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <Input
              label="Full Name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="e.g. Aryan Sharma"
              id="profile-display-name-input"
            />
            <Input
              label="Username (@handle)"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. aryan_neet"
              id="profile-username-input"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <Input
              label="Target NEET Year"
              value={targetYear}
              onChange={(e) => setTargetYear(e.target.value)}
              placeholder="e.g. 2026"
              id="target-year-input"
            />
            <Input
              label="Target Score (Out of 720)"
              value={targetScore}
              onChange={(e) => setTargetScore(e.target.value)}
              placeholder="e.g. 685"
              type="number"
              id="target-score-input"
            />
          </div>

          <Input
            label="Dream Medical College"
            value={dreamCollege}
            onChange={(e) => setDreamCollege(e.target.value)}
            placeholder="e.g. AIIMS New Delhi, MAMC, VMMC, AFMC"
            id="dream-college-input"
          />

          <Input
            label="Aspirant Motto / Bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="e.g. Doctor in the making 🩺✨"
            id="user-bio-input"
          />

          <Button type="submit" variant="primary" size="md" isFullWidth disabled={saving} id="save-profile-btn">
            {saving ? 'Saving Profile...' : 'Save Profile & Target Changes'}
          </Button>

          {savedSuccess && (
            <span style={{ fontSize: '12px', color: 'var(--success)', fontWeight: 600, textAlign: 'center' }}>
              ✓ Aspirant Profile & Settings saved successfully!
            </span>
          )}
        </form>
      </Card>

      {/* Cloud Sync & Spark Free Tier Caching Safeguard */}
      <Card
        id="firestore-cache-sync-card"
        title="Firestore Sync & Spark Free Tier Safeguard"
        subtitle="Local-first caching protects Spark limits (50k reads/20k writes daily)"
        action={
          <Badge variant={syncStatus === 'synced' ? 'success' : syncStatus === 'offline' ? 'neutral' : 'primary'}>
            {syncStatus === 'synced' ? 'Synced' : syncStatus === 'offline' ? 'Offline' : syncStatus === 'syncing' ? 'Syncing...' : 'Pending'}
          </Badge>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '8px',
              fontSize: '12px',
            }}
          >
            <div
              style={{
                padding: '8px 10px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--surface-variant)',
                border: '1px solid var(--border)',
              }}
            >
              <div style={{ color: 'var(--text-secondary)', fontSize: '11px', fontWeight: 600 }}>Local Cache</div>
              <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <CloudCheckIcon size={14} color="var(--success)" /> Active (10m TTL)
              </div>
            </div>

            <div
              style={{
                padding: '8px 10px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--surface-variant)',
                border: '1px solid var(--border)',
              }}
            >
              <div style={{ color: 'var(--text-secondary)', fontSize: '11px', fontWeight: 600 }}>Offline Queue</div>
              <div style={{ fontWeight: 700, color: pendingCount > 0 ? 'var(--warning, #B06000)' : 'var(--text-primary)', marginTop: '2px' }}>
                {pendingCount} Pending Operation{pendingCount === 1 ? '' : 's'}
              </div>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '12px',
              color: 'var(--text-secondary)',
              padding: '6px 2px',
            }}
          >
            <span>Network: <strong style={{ color: isOnline ? 'var(--success)' : '#EF4444' }}>{isOnline ? 'Connected' : 'Offline'}</strong></span>
            <span>Simulation: <strong>{isSimulatingOffline ? 'Active (Offline)' : 'Disabled (Live)'}</strong></span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <button
              type="button"
              onClick={toggleSimulateOffline}
              style={{
                padding: '8px 10px',
                borderRadius: 'var(--radius-sm)',
                border: isSimulatingOffline ? '1px solid var(--secondary)' : '1px solid var(--border)',
                backgroundColor: isSimulatingOffline ? 'var(--secondary-container)' : 'var(--surface-variant)',
                color: isSimulatingOffline ? 'var(--secondary)' : 'var(--text-primary)',
                fontSize: '11.5px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
              id="profile-toggle-sim-btn"
            >
              {isSimulatingOffline ? '🧪 Exit Offline Simulation' : '🧪 Simulate Offline'}
            </button>

            {onOpenSyncInspector ? (
              <button
                type="button"
                onClick={onOpenSyncInspector}
                style={{
                  padding: '8px 10px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border)',
                  backgroundColor: 'var(--surface-variant)',
                  color: 'var(--text-primary)',
                  fontSize: '11.5px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
                id="profile-open-queue-btn"
              >
                Inspect Queue ({pendingQueueList.length})
              </button>
            ) : null}
          </div>

          <Button
            variant="outline"
            size="sm"
            isFullWidth
            leftIcon={<RefreshCwIcon size={14} />}
            onClick={handleManualSync}
            disabled={syncingCloud}
            id="manual-cloud-sync-btn"
          >
            {syncingCloud ? 'Syncing with Firestore...' : 'Sync with Firestore Now'}
          </Button>
        </div>
      </Card>

      {/* Account Actions: Logout (Phase 14: Logout) */}
      <Card id="account-actions-card" title="Account Actions">
        {showLogoutConfirm ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Kya aap sure hain ki aap log out karna chahte hain?
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowLogoutConfirm(false)}
                style={{ flex: 1 }}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => logout()}
                id="confirm-logout-btn"
                style={{ flex: 1, background: 'var(--danger)', borderColor: 'var(--danger)' }}
              >
                Log Out
              </Button>
            </div>
          </div>
        ) : (
          <Button
            variant="outline"
            size="md"
            isFullWidth
            leftIcon={<LogoutIcon size={18} color="var(--danger)" />}
            onClick={() => setShowLogoutConfirm(true)}
            id="account-logout-btn"
            style={{ color: 'var(--danger)', borderColor: 'var(--danger)' }}
          >
            Log Out from Prepmate
          </Button>
        )}
      </Card>

      {/* App & Company Credit */}
      <div
        style={{
          textAlign: 'center',
          padding: '16px',
          color: 'var(--text-secondary)',
          fontSize: '12px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4px',
        }}
        id="company-credit-footer"
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <AwardIcon size={16} color="var(--primary)" />
          <strong style={{ color: 'var(--text-primary)' }}>Prepmate</strong>
        </div>
        <p>Built with ❤️ by Gothwad Tech for NEET Aspirants</p>
        <span style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>
          Phase 13 (Analytics) & Phase 14 (Profile + Settings) Complete
        </span>
      </div>
    </div>
  );
};
