import type { Challenge } from '../types';

const getTodayDateString = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const DEFAULT_INITIAL_CHALLENGES: Challenge[] = [
  {
    id: 'c-winter-arc-7',
    title: 'Winter Arc: 7-Day Iron Crucible',
    description: 'Execute 7 consecutive days of grueling physical training and iron conquest without a single skipped session.',
    type: 'weekly',
    category: 'body',
    targetCount: 7,
    unit: 'Days',
    rewardXp: 350,
    color: '#E63946',
    icon: 'Dumbbell',
    linkedHabitId: 'h-iron-workout',
    startDate: getTodayDateString(),
    endDate: '2027-12-31',
    status: 'active',
    createdAt: new Date().toISOString()
  },
  {
    id: 'c-dopamine-detox-7',
    title: '7-Day Zero Shallow Media Sprint',
    description: 'Fast from short-form video dopamine loops and social feeds for 7 unbroken days.',
    type: 'weekly',
    category: 'mind',
    targetCount: 7,
    unit: 'Days',
    rewardXp: 300,
    color: '#38BDF8',
    icon: 'Brain',
    startDate: getTodayDateString(),
    endDate: '2027-12-31',
    status: 'active',
    createdAt: new Date().toISOString()
  },
  {
    id: 'c-spartan-30',
    title: '30-Day Spartan Discipline Protocol',
    description: 'Achieve 30 consecutive days of standard flawless execution across all non-negotiable morning rituals.',
    type: 'monthly',
    category: 'vitality',
    targetCount: 30,
    unit: 'Days',
    rewardXp: 1200,
    color: '#D4AF37',
    icon: 'Shield',
    startDate: getTodayDateString(),
    endDate: '2027-12-31',
    status: 'active',
    createdAt: new Date().toISOString()
  },
  {
    id: 'c-book-mastery-30',
    title: 'Monthly Stoic Scholar: 30-Day Deep Reading',
    description: 'Read high-leverage philosophy or specialized craft books for 30 consecutive days without interruption.',
    type: 'monthly',
    category: 'craft',
    targetCount: 30,
    unit: 'Days',
    rewardXp: 1000,
    color: '#A855F7',
    icon: 'BookOpen',
    linkedHabitId: 'h-reading',
    startDate: getTodayDateString(),
    endDate: '2027-12-31',
    status: 'active',
    createdAt: new Date().toISOString()
  }
];
