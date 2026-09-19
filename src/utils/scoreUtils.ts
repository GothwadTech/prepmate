import { LeaderboardEntry, LeaderboardFilter, ScoreBreakdown, UserStats, DailyStudyLog, PartnerProfile } from '../types';

/**
 * PrepMate NEET Preparation Score Calculation Formula
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

  // Percentile Estimation (out of typical competitive cohort)
  // 95+ score -> 99.2th percentile
  // 80+ score -> 95.0th percentile
  // 60+ score -> 82.0th percentile
  let percentileRank = 50.0;
  if (totalScore >= 95) percentileRank = 99.4;
  else if (totalScore >= 90) percentileRank = 98.1;
  else if (totalScore >= 80) percentileRank = 95.6;
  else if (totalScore >= 70) percentileRank = 91.2;
  else if (totalScore >= 60) percentileRank = 84.5;
  else if (totalScore >= 50) percentileRank = 74.0;
  else if (totalScore >= 40) percentileRank = 62.0;

  return {
    totalScore,
    studyHoursPoints,
    tasksPoints,
    streakPoints,
    percentileRank,
    level,
    levelTitle,
    xpPoints,
  };
}

/**
 * Standard community NEET aspirants seed data for the weekly leaderboard
 */
const SEED_COMMUNITY_ASPIRANTS: Omit<LeaderboardEntry, 'rank'>[] = [
  {
    uid: 'neet-user-1',
    displayName: 'Aarav Sharma',
    username: 'aarav_aiims',
    targetYear: '2026',
    targetScore: 710,
    avatarBg: '#0F9D58',
    weeklyStudyHours: 44.5,
    weeklyTasksCompleted: 34,
    streakDays: 24,
    prepScore: 98,
    badgeTitle: 'AIR #1 Contender',
    location: 'Kota, Rajasthan',
    isStudyingNow: true,
  },
  {
    uid: 'neet-user-2',
    displayName: 'Sneha Patel',
    username: 'sneha_neet',
    targetYear: '2026',
    targetScore: 705,
    avatarBg: '#E91E63',
    weeklyStudyHours: 42.0,
    weeklyTasksCompleted: 31,
    streakDays: 19,
    prepScore: 94,
    badgeTitle: 'Physics Ninja',
    location: 'Ahmedabad, Gujarat',
    isStudyingNow: false,
  },
  {
    uid: 'neet-user-3',
    displayName: 'Rohan Gupta',
    username: 'rohan_mamc',
    targetYear: '2026',
    targetScore: 695,
    avatarBg: '#7B1FA2',
    weeklyStudyHours: 39.5,
    weeklyTasksCompleted: 29,
    streakDays: 16,
    prepScore: 91,
    badgeTitle: 'Bio Master',
    location: 'Delhi NCR',
    isStudyingNow: true,
  },
  {
    uid: 'neet-user-4',
    displayName: 'Priya Meena',
    username: 'priya_vmmc',
    targetYear: '2026',
    targetScore: 690,
    avatarBg: '#0494F4',
    weeklyStudyHours: 37.0,
    weeklyTasksCompleted: 26,
    streakDays: 14,
    prepScore: 87,
    badgeTitle: 'Streak Champion',
    location: 'Jaipur, Rajasthan',
    isStudyingNow: false,
  },
  {
    uid: 'neet-user-5',
    displayName: 'Kabir Verma',
    username: 'kabir_kgmu',
    targetYear: '2026',
    targetScore: 685,
    avatarBg: '#F4B400',
    weeklyStudyHours: 35.0,
    weeklyTasksCompleted: 24,
    streakDays: 11,
    prepScore: 82,
    badgeTitle: 'Chemistry Whiz',
    location: 'Lucknow, UP',
    isStudyingNow: true,
  },
  {
    uid: 'neet-user-6',
    displayName: 'Ananya Bose',
    username: 'ananya_cmc',
    targetYear: '2026',
    targetScore: 680,
    avatarBg: '#00897B',
    weeklyStudyHours: 33.5,
    weeklyTasksCompleted: 22,
    streakDays: 9,
    prepScore: 78,
    badgeTitle: 'Early Bird',
    location: 'Kolkata, WB',
    isStudyingNow: false,
  },
  {
    uid: 'neet-user-7',
    displayName: 'Tanmay Deshmukh',
    username: 'tanmay_bjmc',
    targetYear: '2026',
    targetScore: 675,
    avatarBg: '#D81B60',
    weeklyStudyHours: 31.0,
    weeklyTasksCompleted: 20,
    streakDays: 8,
    prepScore: 74,
    badgeTitle: 'Night Owl',
    location: 'Pune, Maharashtra',
    isStudyingNow: false,
  },
  {
    uid: 'neet-user-8',
    displayName: 'Meera Nambiar',
    username: 'meera_jipmer',
    targetYear: '2026',
    targetScore: 690,
    avatarBg: '#5E35B1',
    weeklyStudyHours: 29.0,
    weeklyTasksCompleted: 19,
    streakDays: 7,
    prepScore: 70,
    badgeTitle: 'Mock Specialist',
    location: 'Kochi, Kerala',
    isStudyingNow: true,
  },
];

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
  // 1. Calculate current user prep score
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

  // 2. Build array with community aspirants
  const pool: LeaderboardEntry[] = SEED_COMMUNITY_ASPIRANTS.map((s) => ({
    ...s,
    rank: 0,
    isCurrentUser: false,
    isPartner: false,
  }));

  // 3. Add Partner if available
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

  // 4. Add current user
  pool.push(currentUserEntry);

  // 5. Apply subject / streak filters if requested
  let filtered = pool;
  if (filter === 'streak') {
    filtered.sort((a, b) => b.streakDays - a.streakDays || b.prepScore - a.prepScore);
  } else {
    // Default or subject filters sort by prepScore descending, then hours
    filtered.sort((a, b) => b.prepScore - a.prepScore || b.weeklyStudyHours - a.weeklyStudyHours);
  }

  // 6. Assign official ranks
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
    totalParticipants: 1420 + entries.length, // realistic cohort size
  };
}
