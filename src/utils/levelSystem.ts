import type { Milestone } from '../types';

export interface LevelInfo {
  level: number;
  title: string;
  minXp: number;
  maxXp: number;
  progressPercent: number;
}

const LEVEL_TITLES: { minLevel: number; title: string }[] = [
  { minLevel: 1, title: 'Novice of Will' },
  { minLevel: 5, title: 'Iron Initiate' },
  { minLevel: 10, title: 'Disciplined Practitioner' },
  { minLevel: 15, title: 'Ascetic Warrior' },
  { minLevel: 20, title: 'Master of Focus' },
  { minLevel: 25, title: 'Stoic Centurion' },
  { minLevel: 30, title: 'Unbreakable Sovereign' },
  { minLevel: 40, title: 'Forge Patriarch' },
  { minLevel: 50, title: 'Grand Stoic Titan' }
];

export const getTitleForLevel = (level: number): string => {
  for (let i = LEVEL_TITLES.length - 1; i >= 0; i--) {
    if (level >= LEVEL_TITLES[i].minLevel) {
      return LEVEL_TITLES[i].title;
    }
  }
  return LEVEL_TITLES[0].title;
};

export const calculateLevelInfo = (xp: number): LevelInfo => {
  // Level curve: XP = 150 * (level ^ 1.45)
  let level = 1;
  let prevThreshold = 0;
  let nextThreshold = 200;

  while (xp >= nextThreshold && level < 50) {
    level++;
    prevThreshold = nextThreshold;
    nextThreshold = Math.floor(200 * Math.pow(level, 1.45));
  }

  const currentLevelXp = xp - prevThreshold;
  const levelSpan = Math.max(1, nextThreshold - prevThreshold);
  const progressPercent = Math.min(100, Math.max(0, (currentLevelXp / levelSpan) * 100));

  return {
    level,
    title: getTitleForLevel(level),
    minXp: prevThreshold,
    maxXp: nextThreshold,
    progressPercent: Math.round(progressPercent)
  };
};

export const INITIAL_MILESTONES: Milestone[] = [
  {
    id: 'first-spark',
    title: 'The First Spark',
    description: 'Complete your first habit and ignite the forge.',
    icon: 'Sparkles',
    unlocked: false,
    progress: 0,
    target: 1,
    tier: 'bronze'
  },
  {
    id: 'iron-chain-7',
    title: '7-Day Iron Chain',
    description: 'Sustain a 7-day uninterrupted streak on any habit.',
    icon: 'Flame',
    unlocked: false,
    progress: 0,
    target: 7,
    tier: 'bronze'
  },
  {
    id: 'perfect-trio',
    title: 'Trilogy of Perfection',
    description: 'Achieve 3 days with 100% habit completion.',
    icon: 'Shield',
    unlocked: false,
    progress: 0,
    target: 3,
    tier: 'silver'
  },
  {
    id: 'century-club',
    title: 'Centurion of Habit',
    description: 'Complete a total of 100 habit check-ins.',
    icon: 'Award',
    unlocked: false,
    progress: 0,
    target: 100,
    tier: 'silver'
  },
  {
    id: 'fortress-30',
    title: '30-Day Fortress of Will',
    description: 'Reach a 30-day streak — habit becomes identity.',
    icon: 'Castle',
    unlocked: false,
    progress: 0,
    target: 30,
    tier: 'gold'
  },
  {
    id: 'grand-crucible-100',
    title: 'The Century Crucible',
    description: 'Reach 100 active days in your 365-day journey.',
    icon: 'Crown',
    unlocked: false,
    progress: 0,
    target: 100,
    tier: 'gold'
  },
  {
    id: 'titan-365',
    title: 'The Unbroken 365',
    description: 'Complete the entire 1-year transformation.',
    icon: 'Trophy',
    unlocked: false,
    progress: 0,
    target: 365,
    tier: 'obsidian'
  }
];
