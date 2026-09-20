import { AchievementBadge, UserStats, TaskItem, StudySession, DailyStudyLog, PartnerProfile } from '../types';

export function calculateUserBadges(params: {
  stats: UserStats;
  tasks: TaskItem[];
  sessions: StudySession[];
  dailyLogs: DailyStudyLog[];
  partner?: PartnerProfile | null;
  completedChaptersCount?: number;
}): AchievementBadge[] {
  const { stats, tasks, sessions, dailyLogs, partner, completedChaptersCount = 0 } = params;

  const totalTasksCompleted = tasks.filter((t) => t.completed).length;
  const totalMCQs = tasks
    .filter((t) => t.type === 'MCQs' && t.completed)
    .reduce((acc, t) => acc + (t.completedCount || t.targetCount || 0), 0);

  const totalStudyMinutes = sessions.reduce((acc, s) => acc + s.durationMinutes, 0) +
    dailyLogs.reduce((acc, l) => acc + (l.studyMinutes || 0), 0);
  const totalStudyHours = Math.round((totalStudyMinutes / 60) * 10) / 10;

  const physicsMinutes = sessions
    .filter((s) => s.subject === 'Physics')
    .reduce((acc, s) => acc + s.durationMinutes, 0) +
    dailyLogs.reduce((acc, l) => acc + (l.physicsMinutes || 0), 0);
  const physicsHours = Math.round((physicsMinutes / 60) * 10) / 10;

  const bioMinutes = sessions
    .filter((s) => s.subject === 'Biology')
    .reduce((acc, s) => acc + s.durationMinutes, 0) +
    dailyLogs.reduce((acc, l) => acc + (l.biologyMinutes || 0), 0);
  const bioHours = Math.round((bioMinutes / 60) * 10) / 10;

  const chemMinutes = sessions
    .filter((s) => s.subject === 'Chemistry')
    .reduce((acc, s) => acc + s.durationMinutes, 0) +
    dailyLogs.reduce((acc, l) => acc + (l.chemistryMinutes || 0), 0);
  const chemHours = Math.round((chemMinutes / 60) * 10) / 10;

  const streakDays = stats.streakDays || 0;
  const targetScore = stats.targetScore || 680;

  return [
    {
      id: 'first-step',
      title: 'First Step',
      icon: '🚀',
      description: 'Complete your first study task in PrepMate',
      category: 'tasks',
      unlocked: totalTasksCompleted >= 1,
      currentProgress: Math.min(1, totalTasksCompleted),
      targetProgress: 1,
      progressLabel: `${Math.min(1, totalTasksCompleted)}/1 task`,
      rarity: 'Common',
    },
    {
      id: 'streak-7',
      title: 'Weekly Flame',
      icon: '🔥',
      description: 'Maintain an uninterrupted 7-day NEET study streak',
      category: 'streak',
      unlocked: streakDays >= 7,
      currentProgress: Math.min(7, streakDays),
      targetProgress: 7,
      progressLabel: `${streakDays}/7 days`,
      rarity: 'Common',
    },
    {
      id: 'streak-14',
      title: 'Consistency Titan',
      icon: '⚡',
      description: 'Hit a formidable 14-day continuous preparation streak',
      category: 'streak',
      unlocked: streakDays >= 14,
      currentProgress: Math.min(14, streakDays),
      targetProgress: 14,
      progressLabel: `${streakDays}/14 days`,
      rarity: 'Rare',
    },
    {
      id: 'century-mcqs',
      title: 'Century Club',
      icon: '💯',
      description: 'Solve 100+ NEET practice questions and MCQs',
      category: 'tasks',
      unlocked: totalMCQs >= 100,
      currentProgress: Math.min(100, totalMCQs),
      targetProgress: 100,
      progressLabel: `${totalMCQs}/100 MCQs`,
      rarity: 'Rare',
    },
    {
      id: 'physics-ace',
      title: 'Physics Numericals Ace',
      icon: '⚛️',
      description: 'Log 10+ hours solving Physics formulas and numericals',
      category: 'subject',
      unlocked: physicsHours >= 10,
      currentProgress: Math.min(10, physicsHours),
      targetProgress: 10,
      progressLabel: `${physicsHours}/10 hrs`,
      rarity: 'Rare',
    },
    {
      id: 'bio-specialist',
      title: 'NCERT Bio Specialist',
      icon: '🌿',
      description: 'Log 15+ hours mastering Botany and Zoology NCERT lines',
      category: 'subject',
      unlocked: bioHours >= 15,
      currentProgress: Math.min(15, bioHours),
      targetProgress: 15,
      progressLabel: `${bioHours}/15 hrs`,
      rarity: 'Rare',
    },
    {
      id: 'chem-whiz',
      title: 'Chemistry Whiz',
      icon: '⚗️',
      description: 'Log 10+ hours revising Organic & Inorganic Chemistry',
      category: 'subject',
      unlocked: chemHours >= 10,
      currentProgress: Math.min(10, chemHours),
      targetProgress: 10,
      progressLabel: `${chemHours}/10 hrs`,
      rarity: 'Rare',
    },
    {
      id: 'pomodoro-master',
      title: 'Deep Focus Pioneer',
      icon: '⏱️',
      description: 'Complete 8+ focused Pomodoro study sessions',
      category: 'study_hours',
      unlocked: sessions.length >= 8,
      currentProgress: Math.min(8, sessions.length),
      targetProgress: 8,
      progressLabel: `${sessions.length}/8 sessions`,
      rarity: 'Common',
    },
    {
      id: 'marathon-study',
      title: 'Marathon Aspirant',
      icon: '🏃',
      description: 'Accumulate 25+ total hours of deep study time',
      category: 'study_hours',
      unlocked: totalStudyHours >= 25,
      currentProgress: Math.min(25, totalStudyHours),
      targetProgress: 25,
      progressLabel: `${totalStudyHours}/25 hrs`,
      rarity: 'Epic',
    },
    {
      id: 'partner-connected',
      title: 'Partner in Crime',
      icon: '🤝',
      description: 'Add and compete alongside an active study partner',
      category: 'partner',
      unlocked: !!partner,
      currentProgress: partner ? 1 : 0,
      targetProgress: 1,
      progressLabel: partner ? 'Connected' : '0/1 partner',
      rarity: 'Common',
    },
    {
      id: 'aiims-dreamer',
      title: 'AIIMS 700+ Dreamer',
      icon: '🩺',
      description: 'Set your ambitious NEET target score to 700+ marks',
      category: 'milestone',
      unlocked: targetScore >= 700,
      currentProgress: targetScore,
      targetProgress: 700,
      progressLabel: `${targetScore}/700 marks`,
      rarity: 'Epic',
    },
    {
      id: 'syllabus-navigator',
      title: 'Syllabus Navigator',
      icon: '🗺️',
      description: 'Complete 5+ high-yield chapters in NEET syllabus tracker',
      category: 'milestone',
      unlocked: completedChaptersCount >= 5,
      currentProgress: Math.min(5, completedChaptersCount),
      targetProgress: 5,
      progressLabel: `${completedChaptersCount}/5 chapters`,
      rarity: 'Legendary',
    },
  ];
}
