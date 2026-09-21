import { LeaderboardEntry, LeaderboardFilter, ScoreBreakdown, UserStats, PartnerProfile } from '../types';
import { SEED_COMMUNITY_ASPIRANTS } from './communityAspirantsSeed';

/**
 * Prepmate NEET Preparation Score Calculation Formula
 * Total Max: 100 points
 * - Weekly Study Hours: 45% weight (target: 38 hrs/week)
 * - Tasks & MCQs Done: 35% weight (target: 28 tasks/week)
 * - Consistency Streak: 20% weight (target: 14+ active days)
 */
export function calculatePrepScoreBreakdown(
  weeklyStudyHours: number,
  weeklyTasksCompleted: number,
  streakDays: number
): ScoreBreakdown {
  const studyHoursPoints = Math.min(45, Math.round((Math.max(0, weeklyStudyHours) / 38) * 45));
  const tasksPoints = Math.min(35, Math.round((Math.max(0, weeklyTasksCompleted) / 28) * 35));
  const streakPoints = Math.min(20, Math.round(Math.min(14, Math.max(0, streakDays)) * (20 / 14)));

  const totalScore = Math.min(100, studyHoursPoints + tasksPoints + streakPoints);

  // Calculate XP Points
  const xpPoints = Math.round(totalScore * 18 + weeklyStudyHours * 15 + streakDays * 25);

  // Calculate Levels
  let level = 1;
  let levelTitle = 'Novice Aspirant';
  if (xpPoints >= 6000) {
    level = 10;
    levelTitle = 'AIIMS Dreamer 🩺';
  } else if (xpPoints >= 4500) {
    level = 9;
    levelTitle = 'State Ranker 🌟';
  } else if (xpPoints >= 3400) {
    level = 8;
    levelTitle = 'Mock Test Topper 🎯';
  } else if (xpPoints >= 2500) {
    level = 7;
    levelTitle = 'Score Booster ⚡';
  } else if (xpPoints >= 1800) {
    level = 6;
    levelTitle = 'Numerical Specialist 🔬';
  } else if (xpPoints >= 1200) {
    level = 5;
    levelTitle = 'NCERT Master 📚';
  } else if (xpPoints >= 800) {
    level = 4;
    levelTitle = 'Consistency Warrior 🔥';
  } else if (xpPoints >= 500) {
    level = 3;
    levelTitle = 'Syllabus Explorer 🧭';
  } else if (xpPoints >= 250) {
    level = 2;
    levelTitle = 'Dedicated Learner 💡';
  }

  let percentileRank = 50.0;
  if (totalScore >= 95) percentileRank = 99.4;
  else if (totalScore >= 90) percentileRank = 98.1;
  else if (totalScore >= 80) percentileRank = 94.6;
  else if (totalScore >= 70) percentileRank = 87.2;
  else if (totalScore >= 60) percentileRank = 78.5;
  else if (totalScore >= 50) percentileRank = 68.0;
  else if (totalScore >= 40) percentileRank = 55.0;

  return {
    studyHoursPoints,
    tasksPoints,
    streakPoints,
    totalScore,
    xpPoints,
    level,
    levelTitle,
    percentileRank,
  };
}

/**
 * Builds the dynamic weekly leaderboard by merging current user's real stats,
 * active partner's stats, and community NEET aspirants, then ranking them.
 */
export function getWeeklyLeaderboard(
  currentUser: {
    uid: string;
    displayName: string;
    username: string;
    targetYear?: string;
    targetScore?: number;
    avatarBg?: string;
  },
  userStats: UserStats,
  userWeeklyHours: number,
  userWeeklyTasks: number,
  partner?: PartnerProfile | null,
  filter: LeaderboardFilter = 'all'
): {
  entries: LeaderboardEntry[];
  currentUserEntry: LeaderboardEntry;
  totalParticipants: number;
} {
  const userBreakdown = calculatePrepScoreBreakdown(
    userWeeklyHours,
    userWeeklyTasks,
    userStats.streakDays
  );

  const currentUserEntry: LeaderboardEntry = {
    uid: currentUser.uid,
    rank: 0,
    displayName: currentUser.displayName || 'You (Aspirant)',
    username: currentUser.username || 'you',
    targetYear: currentUser.targetYear || userStats.targetYear || '2026',
    targetScore: currentUser.targetScore || userStats.targetScore || 685,
    avatarBg: currentUser.avatarBg || '#0494F4',
    weeklyStudyHours: userWeeklyHours,
    weeklyTasksCompleted: userWeeklyTasks,
    streakDays: userStats.streakDays,
    prepScore: userBreakdown.totalScore,
    badgeTitle: userBreakdown.levelTitle,
    location: 'Your Study Room',
    isCurrentUser: true,
    isStudyingNow: true,
  };

  const pool: LeaderboardEntry[] = SEED_COMMUNITY_ASPIRANTS.map((s) => ({
    ...s,
    rank: 0,
    isCurrentUser: false,
    isPartner: false,
  }));

  if (partner) {
    const partnerWeeklyHours = partner.weeklyHours || Number((partner.todayStudyHours * 5.8).toFixed(1));
    const partnerWeeklyTasks = Math.round(partner.todayTasksCompleted * 5.5);
    const partnerBreakdown = calculatePrepScoreBreakdown(
      partnerWeeklyHours,
      partnerWeeklyTasks,
      partner.streakDays
    );

    pool.push({
      uid: partner.id,
      rank: 0,
      displayName: partner.name,
      username: partner.username,
      targetYear: partner.targetYear || '2026',
      targetScore: partner.targetScore || 690,
      avatarBg: partner.avatarBg || '#0F9D58',
      weeklyStudyHours: partnerWeeklyHours,
      weeklyTasksCompleted: partnerWeeklyTasks,
      streakDays: partner.streakDays,
      prepScore: partnerBreakdown.totalScore,
      badgeTitle: 'Study Buddy 🤝',
      location: 'Partner Desk',
      isCurrentUser: false,
      isPartner: true,
      isStudyingNow: partner.isStudyingNow,
    });
  }

  pool.push(currentUserEntry);

  let filtered = pool;
  if (filter === 'streak') {
    filtered.sort((a, b) => b.streakDays - a.streakDays || b.prepScore - a.prepScore);
  } else {
    filtered.sort((a, b) => b.prepScore - a.prepScore || b.weeklyStudyHours - a.weeklyStudyHours);
  }

  const entries: LeaderboardEntry[] = filtered.map((item, idx) => ({
    ...item,
    rank: idx + 1,
  }));

  const userRanked = entries.find((e) => e.isCurrentUser) || {
    ...currentUserEntry,
    rank: entries.length,
  };

  return {
    entries,
    currentUserEntry: userRanked,
    totalParticipants: 1420 + entries.length,
  };
}
