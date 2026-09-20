/**
 * Prepmate - Streak & Weekly Analytics Engine
 * Provides streak calculation, GitHub-style heatmap generation,
 * weekly calendar tracking, and NEET subject balance analysis.
 */

import { DailyStudyLog, StreakMilestone, WeeklySubjectBreakdown } from '../types';
import { NEET_CHAPTERS } from '../data/neetSyllabus';

export const STREAK_MILESTONES: StreakMilestone[] = [
  {
    days: 3,
    title: 'Spark Starter',
    badge: '🔥',
    description: '3 consecutive days of disciplined NEET prep',
    color: '#FF6B4A',
    unlocked: false,
  },
  {
    days: 7,
    title: 'Weekly Flame',
    badge: '⚡',
    description: '1 full week uninterrupted focus streak',
    color: '#FF9800',
    unlocked: false,
  },
  {
    days: 14,
    title: 'Fortnight Focus',
    badge: '🌟',
    description: '14 days non-stop syllabus mastery',
    color: '#4CAF50',
    unlocked: false,
  },
  {
    days: 21,
    title: 'Habit Locked',
    badge: '🎯',
    description: '21 days to form an unbreakable medical habit',
    color: '#00BCD4',
    unlocked: false,
  },
  {
    days: 30,
    title: 'NEET Titan',
    badge: '🏆',
    description: '1 full month dedicated daily problem-solving',
    color: '#3F51B5',
    unlocked: false,
  },
  {
    days: 60,
    title: 'Diamond Mind',
    badge: '💎',
    description: '60 days of relentless consistency',
    color: '#9C27B0',
    unlocked: false,
  },
  {
    days: 100,
    title: 'AIIMS Legend',
    badge: '👑',
    description: 'Centurion 100-day prep streak',
    color: '#E91E63',
    unlocked: false,
  },
];

export interface StreakStats {
  currentStreak: number;
  longestStreak: number;
  totalActiveDays: number;
  todayCompleted: boolean;
  streakStatus: 'active_today' | 'pending_today' | 'at_risk';
  shieldsAvailable: number;
  nextMilestone: StreakMilestone;
  allMilestones: StreakMilestone[];
  daysToNextMilestone: number;
}

export interface HeatmapDayCell {
  date: string; // YYYY-MM-DD
  dayOfWeek: number; // 0=Mon, 6=Sun
  weekIndex: number;
  studyMinutes: number;
  tasksCompleted: number;
  level: 0 | 1 | 2 | 3 | 4;
  isToday: boolean;
  isFuture: boolean;
  isShieldUsed: boolean;
  physicsMinutes: number;
  chemistryMinutes: number;
  biologyMinutes: number;
  chaptersStudied: string[];
  notes?: string;
}

export interface HeatmapWeekColumn {
  weekNumber: number;
  monthLabel?: string;
  days: HeatmapDayCell[];
}

export interface WeekCalendarDay {
  date: string;
  dayName: string; // Mon, Tue, Wed...
  dayFull: string;
  dateNum: number;
  isToday: boolean;
  isPast: boolean;
  isFuture: boolean;
  log?: DailyStudyLog;
  studyMinutes: number;
  tasksCompleted: number;
  tasksTotal: number;
  isCompleted: boolean;
  isShieldUsed: boolean;
  status: 'completed' | 'in_progress' | 'missed' | 'shielded' | 'upcoming';
}

/**
 * Format date to YYYY-MM-DD in local time
 */
export const formatDateKey = (d: Date): string => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Parse YYYY-MM-DD into local Date object
 */
export const parseDateKey = (dateStr: string): Date => {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
};

/**
 * Format minutes into readable hours and minutes (e.g., 2h 30m or 45m)
 */
export const formatMinutesToHours = (minutes: number): string => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
};

/**
 * Check if daily log qualifies as a streak day (>= 25 mins or >= 1 task or shielded)
 */
export const isQualifyingStreakDay = (log?: DailyStudyLog): boolean => {
  if (!log) return false;
  if (log.isShieldUsed) return true;
  return log.studyMinutes >= 25 || log.tasksCompleted >= 1;
};

/**
 * Calculate streak stats dynamically from list of daily logs
 */
export const calculateStreak = (
  dailyLogs: DailyStudyLog[],
  todayStr: string = formatDateKey(new Date()),
  shieldsAvailable: number = 1
): StreakStats => {
  const logMap = new Map<string, DailyStudyLog>();
  dailyLogs.forEach((log) => logMap.set(log.date, log));

  const todayLog = logMap.get(todayStr);
  const todayCompleted = isQualifyingStreakDay(todayLog);

  // Total active days
  let totalActiveDays = 0;
  dailyLogs.forEach((log) => {
    if (isQualifyingStreakDay(log)) totalActiveDays++;
  });

  // Calculate current streak
  let currentStreak = 0;
  const todayDate = parseDateKey(todayStr);

  // Check today first
  let checkDate = new Date(todayDate);
  if (todayCompleted) {
    currentStreak++;
    checkDate.setDate(checkDate.getDate() - 1);
  } else {
    // If today is not yet completed, start checking from yesterday
    checkDate.setDate(checkDate.getDate() - 1);
  }

  // Iterate backwards
  while (true) {
    const key = formatDateKey(checkDate);
    const log = logMap.get(key);
    if (isQualifyingStreakDay(log)) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  // Calculate longest streak across history
  const sortedDates = Array.from(logMap.keys()).sort();
  let longestStreak = 0;
  let tempStreak = 0;
  let prevDate: Date | null = null;

  for (const dateKey of sortedDates) {
    const log = logMap.get(dateKey);
    if (!isQualifyingStreakDay(log)) {
      tempStreak = 0;
      prevDate = null;
      continue;
    }

    const currDate = parseDateKey(dateKey);
    if (prevDate) {
      const diffDays = Math.round((currDate.getTime() - prevDate.getTime()) / (1000 * 3600 * 24));
      if (diffDays === 1) {
        tempStreak++;
      } else {
        tempStreak = 1;
      }
    } else {
      tempStreak = 1;
    }

    if (tempStreak > longestStreak) {
      longestStreak = tempStreak;
    }
    prevDate = currDate;
  }

  if (currentStreak > longestStreak) {
    longestStreak = currentStreak;
  }

  // Status definition
  let streakStatus: 'active_today' | 'pending_today' | 'at_risk' = 'pending_today';
  if (todayCompleted) {
    streakStatus = 'active_today';
  } else if (currentStreak > 0) {
    streakStatus = 'at_risk';
  }

  // Milestones progress
  const milestonesWithStatus = STREAK_MILESTONES.map((m) => ({
    ...m,
    unlocked: currentStreak >= m.days,
  }));

  const nextMilestone =
    milestonesWithStatus.find((m) => !m.unlocked) ||
    milestonesWithStatus[milestonesWithStatus.length - 1];

  const daysToNextMilestone = Math.max(0, nextMilestone.days - currentStreak);

  return {
    currentStreak,
    longestStreak: Math.max(longestStreak, currentStreak),
    totalActiveDays,
    todayCompleted,
    streakStatus,
    shieldsAvailable,
    nextMilestone,
    allMilestones: milestonesWithStatus,
    daysToNextMilestone,
  };
};

/**
 * Generate 7 days for a selected week (Monday to Sunday)
 */
export const getWeekCalendarDays = (
  referenceDate: Date,
  dailyLogs: DailyStudyLog[]
): WeekCalendarDay[] => {
  const logMap = new Map<string, DailyStudyLog>();
  dailyLogs.forEach((l) => logMap.set(l.date, l));

  const todayStr = formatDateKey(new Date());

  // Find Monday of the reference week
  const curr = new Date(referenceDate);
  const day = curr.getDay();
  const diffToMonday = (day === 0 ? -6 : 1) - day;
  const monday = new Date(curr);
  monday.setDate(curr.getDate() + diffToMonday);

  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const dayFullNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const days: WeekCalendarDay[] = [];

  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const dateStr = formatDateKey(d);
    const log = logMap.get(dateStr);

    const isToday = dateStr === todayStr;
    const isPast = dateStr < todayStr;
    const isFuture = dateStr > todayStr;

    const studyMinutes = log?.studyMinutes || 0;
    const tasksCompleted = log?.tasksCompleted || 0;
    const tasksTotal = log?.tasksTotal || 0;
    const isShieldUsed = !!log?.isShieldUsed;
    const isCompleted = isQualifyingStreakDay(log);

    let status: 'completed' | 'in_progress' | 'missed' | 'shielded' | 'upcoming' = 'upcoming';
    if (isShieldUsed) {
      status = 'shielded';
    } else if (isToday) {
      status = isCompleted ? 'completed' : 'in_progress';
    } else if (isPast) {
      status = isCompleted ? 'completed' : 'missed';
    } else {
      status = 'upcoming';
    }

    days.push({
      date: dateStr,
      dayName: dayNames[i],
      dayFull: dayFullNames[i],
      dateNum: d.getDate(),
      isToday,
      isPast,
      isFuture,
      log,
      studyMinutes,
      tasksCompleted,
      tasksTotal,
      isCompleted,
      isShieldUsed,
      status,
    });
  }

  return days;
};

/**
 * Determine heatmap color intensity level (0 to 4)
 */
export const getHeatmapLevel = (minutes: number): 0 | 1 | 2 | 3 | 4 => {
  if (minutes <= 0) return 0;
  if (minutes < 60) return 1; // < 1 hour
  if (minutes < 120) return 2; // 1-2 hours
  if (minutes < 210) return 3; // 2-3.5 hours
  return 4; // 3.5+ hours (Hero NEET study day!)
};

/**
 * Generate 14-week (approx 98-day) GitHub-style Heatmap grid ending at today's week
 */
export const generateHeatmapGrid = (
  dailyLogs: DailyStudyLog[],
  totalWeeks: number = 14
): HeatmapWeekColumn[] => {
  const logMap = new Map<string, DailyStudyLog>();
  dailyLogs.forEach((l) => logMap.set(l.date, l));

  const today = new Date();
  const todayStr = formatDateKey(today);

  // Find Sunday of current week
  const currDay = today.getDay();
  const diffToSunday = currDay === 0 ? 0 : 7 - currDay;
  const endSunday = new Date(today);
  endSunday.setDate(today.getDate() + diffToSunday);

  // Start Monday is (totalWeeks * 7 - 1) days prior
  const startMonday = new Date(endSunday);
  startMonday.setDate(endSunday.getDate() - (totalWeeks * 7 - 1));

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const columns: HeatmapWeekColumn[] = [];

  let lastSeenMonth = -1;

  for (let w = 0; w < totalWeeks; w++) {
    const weekDays: HeatmapDayCell[] = [];
    let monthLabel: string | undefined = undefined;

    for (let d = 0; d < 7; d++) {
      const dayDate = new Date(startMonday);
      dayDate.setDate(startMonday.getDate() + w * 7 + d);
      const dateStr = formatDateKey(dayDate);
      const log = logMap.get(dateStr);

      const m = dayDate.getMonth();
      if (d === 0 && m !== lastSeenMonth) {
        monthLabel = monthNames[m];
        lastSeenMonth = m;
      }

      const studyMinutes = log?.studyMinutes || 0;
      const tasksCompleted = log?.tasksCompleted || 0;
      const level = getHeatmapLevel(studyMinutes);

      weekDays.push({
        date: dateStr,
        dayOfWeek: d,
        weekIndex: w,
        studyMinutes,
        tasksCompleted,
        level,
        isToday: dateStr === todayStr,
        isFuture: dateStr > todayStr,
        isShieldUsed: !!log?.isShieldUsed,
        physicsMinutes: log?.physicsMinutes || 0,
        chemistryMinutes: log?.chemistryMinutes || 0,
        biologyMinutes: log?.biologyMinutes || 0,
        chaptersStudied: log?.chaptersStudied || [],
        notes: log?.notes,
      });
    }

    columns.push({
      weekNumber: w + 1,
      monthLabel,
      days: weekDays,
    });
  }

  return columns;
};

/**
 * Calculate weekly subject breakdown vs NEET recommendation
 */
export const calculateWeeklySubjectBreakdown = (
  weekDays: WeekCalendarDay[]
): WeeklySubjectBreakdown[] => {
  let phy = 0;
  let chem = 0;
  let bio = 0;
  const chaptersSet = new Set<string>();

  weekDays.forEach((wd) => {
    if (wd.log) {
      phy += wd.log.physicsMinutes || 0;
      chem += wd.log.chemistryMinutes || 0;
      bio += wd.log.biologyMinutes || 0;
      wd.log.chaptersStudied?.forEach((ch) => chaptersSet.add(ch));
    }
  });

  const total = phy + chem + bio;
  const phyPct = total > 0 ? Math.round((phy / total) * 100) : 0;
  const chemPct = total > 0 ? Math.round((chem / total) * 100) : 0;
  const bioPct = total > 0 ? Math.round((bio / total) * 100) : 0;

  // Filter high-yield chapters
  const allHighYieldPhysics = new Set(
    NEET_CHAPTERS.Physics.filter((c) => c.weightage === 'High').map((c) => c.name)
  );
  const allHighYieldChem = new Set(
    NEET_CHAPTERS.Chemistry.filter((c) => c.weightage === 'High').map((c) => c.name)
  );
  const allHighYieldBio = new Set(
    NEET_CHAPTERS.Biology.filter((c) => c.weightage === 'High').map((c) => c.name)
  );

  const phyChapters = Array.from(chaptersSet).filter((c) => allHighYieldPhysics.has(c));
  const chemChapters = Array.from(chaptersSet).filter((c) => allHighYieldChem.has(c));
  const bioChapters = Array.from(chaptersSet).filter((c) => allHighYieldBio.has(c));

  return [
    {
      subject: 'Biology',
      minutes: bio,
      percentage: bioPct,
      recommendedPercentage: 50, // NEET has 360 marks Bio out of 720
      highYieldChaptersCovered: bioChapters,
    },
    {
      subject: 'Physics',
      minutes: phy,
      percentage: phyPct,
      recommendedPercentage: 25, // 180 marks
      highYieldChaptersCovered: phyChapters,
    },
    {
      subject: 'Chemistry',
      minutes: chem,
      percentage: chemPct,
      recommendedPercentage: 25, // 180 marks
      highYieldChaptersCovered: chemChapters,
    },
  ];
};

/**
 * Generate 90-day realistic historical Daily Logs seed
 */
export const generateDefaultDailyLogsSeed = (userId: string): DailyStudyLog[] => {
  const logs: DailyStudyLog[] = [];
  const today = new Date();

  // Pre-seed 60 past days
  for (let i = 60; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = formatDateKey(d);

    // Give today specific stats matching current applet state (210 mins, 2 tasks done)
    if (i === 0) {
      logs.push({
        id: `log_${userId}_${dateStr}`,
        date: dateStr,
        userId,
        studyMinutes: 210,
        tasksCompleted: 2,
        tasksTotal: 4,
        physicsMinutes: 60,
        chemistryMinutes: 45,
        biologyMinutes: 105,
        chaptersStudied: ['Current Electricity', 'Chemical Bonding', 'Human Reproduction'],
        notes: 'Great momentum on Human Reproduction diagrams and Current Electricity circuits!',
        updatedAt: new Date().toISOString(),
      });
      continue;
    }

    // Give days 1, 2, 3 (past 3 days) completed status to make current streak = 4!
    if (i <= 3) {
      const minutes = [180, 240, 195][i - 1];
      const tasks = [3, 4, 3][i - 1];
      logs.push({
        id: `log_${userId}_${dateStr}`,
        date: dateStr,
        userId,
        studyMinutes: minutes,
        tasksCompleted: tasks,
        tasksTotal: 4,
        physicsMinutes: Math.round(minutes * 0.3),
        chemistryMinutes: Math.round(minutes * 0.25),
        biologyMinutes: Math.round(minutes * 0.45),
        chaptersStudied: ['Optics', 'Equilibrium', 'Genetics'],
        notes: 'Consistent practice session. Covered high-yield NCERT PYQs.',
        updatedAt: new Date(d).toISOString(),
      });
      continue;
    }

    // Day 4 was a rest day (0 mins) or streak freeze
    if (i === 4) {
      logs.push({
        id: `log_${userId}_${dateStr}`,
        date: dateStr,
        userId,
        studyMinutes: 0,
        tasksCompleted: 0,
        tasksTotal: 0,
        physicsMinutes: 0,
        chemistryMinutes: 0,
        biologyMinutes: 0,
        notes: 'Rest & Mock analysis day',
        updatedAt: new Date(d).toISOString(),
      });
      continue;
    }

    // Historical realistic study patterns (mostly active days with occasional break)
    const isBreak = i % 7 === 0;
    const studyMins = isBreak ? 0 : 120 + ((i * 17) % 150);
    const tasksDone = isBreak ? 0 : 2 + (i % 3);

    logs.push({
      id: `log_${userId}_${dateStr}`,
      date: dateStr,
      userId,
      studyMinutes: studyMins,
      tasksCompleted: tasksDone,
      tasksTotal: isBreak ? 0 : 4,
      physicsMinutes: Math.round(studyMins * 0.28),
      chemistryMinutes: Math.round(studyMins * 0.26),
      biologyMinutes: Math.round(studyMins * 0.46),
      chaptersStudied: isBreak ? [] : ['Laws of Motion', 'Thermodynamics', 'Ecology'],
      notes: isBreak ? undefined : 'Focused on numericals & NCERT line reading.',
      updatedAt: new Date(d).toISOString(),
    });
  }

  return logs;
};
