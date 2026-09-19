import { PartnerChallenge, SubjectType, ChallengeCategory, ChallengeMode } from '../types';

const CHALLENGES_STORAGE_KEY = 'prepmate_partner_challenges_v1';

export const DEFAULT_PARTNER_CHALLENGES: PartnerChallenge[] = [
  {
    id: 'challenge-1',
    title: '7-Day Consistency Rush 🔥',
    description: 'Both partners maintain an uninterrupted daily study streak for 7 continuous days.',
    category: 'streak',
    mode: 'coop',
    targetMetric: 7,
    metricUnit: 'days',
    userProgress: 4,
    partnerProgress: 5,
    status: 'active',
    rewardXp: 300,
    rewardBadge: 'Consistency Titan 🔥',
    daysRemaining: 3,
    expiresAt: new Date(Date.now() + 3 * 86400000).toISOString(),
    createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
  },
  {
    id: 'challenge-2',
    title: 'Physics Numericals Blitz ⚡',
    description: 'Race to solve 60 Physics numerical MCQs (Kinematics, Mechanics & Current Electricity).',
    category: 'physics',
    mode: 'vs',
    subject: 'Physics',
    targetMetric: 60,
    metricUnit: 'MCQs',
    userProgress: 38,
    partnerProgress: 45,
    status: 'active',
    rewardXp: 350,
    rewardBadge: 'Physics Maestro ⚡',
    daysRemaining: 2,
    expiresAt: new Date(Date.now() + 2 * 86400000).toISOString(),
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: 'challenge-3',
    title: 'NCERT Biology Deep Dive 🧬',
    description: 'Master 10 study hours of pure NCERT Biology line-by-line reading & question practice.',
    category: 'biology',
    mode: 'vs',
    subject: 'Biology',
    targetMetric: 10,
    metricUnit: 'hours',
    userProgress: 6.5,
    partnerProgress: 5.0,
    status: 'active',
    rewardXp: 280,
    rewardBadge: 'Bio Master 🧬',
    daysRemaining: 4,
    expiresAt: new Date(Date.now() + 4 * 86400000).toISOString(),
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
  {
    id: 'challenge-4',
    title: 'Sunday Mock Test Showdown 🎯',
    description: 'Both take a 3 hr 20 min full syllabus NEET mock test and compare scores.',
    category: 'mock_test',
    mode: 'vs',
    targetMetric: 1,
    metricUnit: 'mock test',
    userProgress: 0,
    partnerProgress: 0,
    status: 'available',
    rewardXp: 450,
    rewardBadge: 'Mock Arena Champ 🏆',
    daysRemaining: 5,
    expiresAt: new Date(Date.now() + 5 * 86400000).toISOString(),
    createdAt: new Date().toISOString(),
  },
  {
    id: 'challenge-5',
    title: 'Co-op 70 Study Hours Sprint 🤝',
    description: 'Combine your study hours to reach 70 total hours together this week.',
    category: 'hours',
    mode: 'coop',
    targetMetric: 70,
    metricUnit: 'team hours',
    userProgress: 18.5,
    partnerProgress: 21.0,
    status: 'available',
    rewardXp: 500,
    rewardBadge: 'Unstoppable Duo 🤝',
    daysRemaining: 6,
    expiresAt: new Date(Date.now() + 6 * 86400000).toISOString(),
    createdAt: new Date().toISOString(),
  },
  {
    id: 'challenge-6',
    title: 'Organic Chemistry Reactions Sprint ⚗️',
    description: 'Complete 40 reaction mechanisms and named reaction practice problems.',
    category: 'chemistry',
    mode: 'vs',
    subject: 'Chemistry',
    targetMetric: 40,
    metricUnit: 'problems',
    userProgress: 40,
    partnerProgress: 36,
    status: 'completed',
    rewardXp: 300,
    rewardBadge: 'Organic Wizard ⚗️',
    daysRemaining: 0,
    expiresAt: new Date(Date.now() - 86400000).toISOString(),
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    completedAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

export function getStoredChallenges(): PartnerChallenge[] {
  try {
    const raw = localStorage.getItem(CHALLENGES_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(CHALLENGES_STORAGE_KEY, JSON.stringify(DEFAULT_PARTNER_CHALLENGES));
      return DEFAULT_PARTNER_CHALLENGES;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return DEFAULT_PARTNER_CHALLENGES;
  } catch (e) {
    console.warn('Error reading challenges from storage:', e);
    return DEFAULT_PARTNER_CHALLENGES;
  }
}

export function saveChallenges(challenges: PartnerChallenge[]): void {
  try {
    localStorage.setItem(CHALLENGES_STORAGE_KEY, JSON.stringify(challenges));
  } catch (e) {
    console.warn('Error saving challenges:', e);
  }
}

export function createNewChallenge(params: {
  title: string;
  description: string;
  category: ChallengeCategory;
  mode: ChallengeMode;
  targetMetric: number;
  metricUnit: string;
  daysDuration: number;
  subject?: SubjectType;
}): PartnerChallenge {
  const id = `custom-challenge-${Date.now()}`;
  const now = new Date();
  const expiresAt = new Date(now.getTime() + params.daysDuration * 86400000).toISOString();

  let rewardBadge = 'Challenge Conqueror 🏅';
  if (params.category === 'physics') rewardBadge = 'Physics Dynamo ⚡';
  else if (params.category === 'chemistry') rewardBadge = 'Chemistry Alchemist ⚗️';
  else if (params.category === 'biology') rewardBadge = 'Biology Prodigy 🧬';
  else if (params.category === 'streak') rewardBadge = 'Iron Will 🔥';
  else if (params.category === 'hours') rewardBadge = 'Study Machine ⏱️';

  const newChallenge: PartnerChallenge = {
    id,
    title: params.title,
    description: params.description,
    category: params.category,
    mode: params.mode,
    targetMetric: params.targetMetric,
    metricUnit: params.metricUnit,
    userProgress: 0,
    partnerProgress: 0,
    status: 'active',
    rewardXp: Math.min(600, Math.max(150, params.targetMetric * 10)),
    rewardBadge,
    daysRemaining: params.daysDuration,
    expiresAt,
    createdAt: now.toISOString(),
    subject: params.subject,
  };

  const current = getStoredChallenges();
  const updated = [newChallenge, ...current];
  saveChallenges(updated);
  return newChallenge;
}
