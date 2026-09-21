import React, { useState, useEffect, useMemo } from 'react';
import { BarChartIcon } from '../components/icons/SvgIcons';
import { AppTheme, UserStats } from '../types';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { calculatePrepScoreBreakdown } from '../utils/scoreUtils';
import { calculateUserBadges } from '../utils/badgeUtils';
import { ProfileHeroCard } from '../components/profile/ProfileHeroCard';
import { ProfileLevelXpCard } from '../components/profile/ProfileLevelXpCard';
import { ProfileStatsSnapshot } from '../components/profile/ProfileStatsSnapshot';
import { ProfileBadgesSection } from '../components/profile/ProfileBadgesSection';
import { ProfileStudySettings } from '../components/profile/ProfileStudySettings';
import { ProfileEditForm } from '../components/profile/ProfileEditForm';
import { ProfileCloudSyncCard } from '../components/profile/ProfileCloudSyncCard';
import { ProfileAccountActions } from '../components/profile/ProfileAccountActions';

interface ProfilePageProps {
  theme: AppTheme;
  onToggleTheme: () => void;
  stats: UserStats;
  onUpdateStats: (newStats: Partial<UserStats>) => void;
  onBack?: () => void;
  onNavigateToAnalytics?: () => void;
  onOpenSyncInspector?: () => void;
  onOpenNotifications?: () => void;
  onOpenTerms?: () => void;
  onOpenPrivacy?: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  theme,
  onToggleTheme,
  stats,
  onUpdateStats,
  onNavigateToAnalytics,
  onOpenSyncInspector,
  onOpenTerms,
  onOpenPrivacy,
}) => {
  const { user, logout, updateProfile } = useAuth();
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

  return (
    <div id="profile-settings-page" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Quick Analytics link if available */}
      {onNavigateToAnalytics && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '0 2px' }}>
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
              padding: '5px 12px',
              borderRadius: 'var(--radius-pill)',
            }}
          >
            <BarChartIcon size={14} /> View Analytics Breakdown
          </button>
        </div>
      )}

      {/* Profile Header Hero Card */}
      <ProfileHeroCard
        user={user}
        displayName={displayName}
        username={username}
        targetYear={targetYear}
        targetScore={targetScore}
        dreamCollege={dreamCollege}
        bio={bio}
      />

      {/* Level & XP Progress Card */}
      <ProfileLevelXpCard
        currentLevel={currentLevel}
        levelTitle={scoreBreakdown.levelTitle}
        currentXp={currentXp}
        xpProgressInLevel={xpProgressInLevel}
        xpNeededForNext={xpNeededForNext}
        xpProgressPercent={xpProgressPercent}
        studyHoursPoints={scoreBreakdown.studyHoursPoints}
        tasksPoints={scoreBreakdown.tasksPoints}
        streakPoints={scoreBreakdown.streakPoints}
      />

      {/* Aspirant Stats Snapshot */}
      <ProfileStatsSnapshot
        streakDays={stats.streakDays || 0}
        completedTasksCount={tasks.filter((t) => t.completed).length}
        percentileRank={scoreBreakdown.percentileRank}
      />

      {/* Achievement Badges Section */}
      <ProfileBadgesSection badges={badges} />

      {/* Settings Section: Theme, Goal hours, Reminders */}
      <ProfileStudySettings
        theme={theme}
        onToggleTheme={onToggleTheme}
        dailyGoalHours={dailyGoalHours}
        onSelectGoalHours={handleSelectGoalHours}
        notifications={notifications}
        onToggleNotification={handleToggleNotification}
        hasBrowserNotificationPermission={hasBrowserNotificationPermission}
        requestNotificationPermission={requestNotificationPermission}
        sendTestNotification={sendTestNotification}
      />

      {/* Edit Profile Form */}
      <ProfileEditForm
        displayName={displayName}
        setDisplayName={setDisplayName}
        username={username}
        setUsername={setUsername}
        targetYear={targetYear}
        setTargetYear={setTargetYear}
        targetScore={targetScore}
        setTargetScore={setTargetScore}
        dreamCollege={dreamCollege}
        setDreamCollege={setDreamCollege}
        bio={bio}
        setBio={setBio}
        saving={saving}
        savedSuccess={savedSuccess}
        onSave={handleSaveProfile}
      />

      {/* Cloud Sync & Spark Free Tier Caching Safeguard */}
      <ProfileCloudSyncCard
        syncStatus={syncStatus}
        pendingCount={pendingCount}
        isOnline={isOnline}
        isSimulatingOffline={isSimulatingOffline}
        toggleSimulateOffline={toggleSimulateOffline}
        pendingQueueLength={pendingQueueList.length}
        onOpenSyncInspector={onOpenSyncInspector}
        syncingCloud={syncingCloud}
        onManualSync={handleManualSync}
      />

      {/* Account Actions: Logout & Company Credit */}
      <ProfileAccountActions
        showLogoutConfirm={showLogoutConfirm}
        setShowLogoutConfirm={setShowLogoutConfirm}
        onLogout={logout}
        onOpenTerms={onOpenTerms}
        onOpenPrivacy={onOpenPrivacy}
      />
    </div>
  );
};
