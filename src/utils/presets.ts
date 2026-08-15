import type { Habit } from '../types';

export interface HabitPack {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  icon: string;
  color: string;
  habits: Omit<Habit, 'id' | 'createdAt'>[];
}

export const PRESET_HABIT_PACKS: HabitPack[] = [
  {
    id: 'stoic-forge',
    name: 'The Stoic Crucible',
    subtitle: 'Ancient daily disciplines of the Roman Emperors',
    description: 'Master your morning mindset, practice voluntary discomfort, journal nightly, and study wisdom.',
    icon: 'Shield',
    color: '#D4AF37',
    habits: [
      {
        title: 'Morning Cold Shower & Breathwork',
        description: 'Wake the nervous system with 3 minutes of cold exposure and deep box breathing.',
        category: 'body',
        timeOfDay: 'morning',
        frequency: 'daily',
        type: 'boolean',
        icon: 'Flame',
        color: '#E63946',
        priority: 'high'
      },
      {
        title: 'Stoic Reading & Contemplation',
        description: 'Read 15 minutes of Meditations, Seneca, or Epictetus before digital input.',
        category: 'mind',
        timeOfDay: 'morning',
        frequency: 'daily',
        type: 'numeric',
        targetValue: 15,
        unit: 'mins',
        icon: 'BookOpen',
        color: '#D4AF37',
        priority: 'high'
      },
      {
        title: 'Physical Calibration (Heavy Iron / Calisthenics)',
        description: 'Forge the physical vessel with intense compound training.',
        category: 'body',
        timeOfDay: 'afternoon',
        frequency: 'daily',
        type: 'numeric',
        targetValue: 45,
        unit: 'mins',
        icon: 'Dumbbell',
        color: '#E63946',
        priority: 'high'
      },
      {
        title: 'Evening Memento Mori & Journaling',
        description: 'Audit the actions of the day: Where did I falter? What did I do well?',
        category: 'soul',
        timeOfDay: 'evening',
        frequency: 'daily',
        type: 'boolean',
        icon: 'Feather',
        color: '#38BDF8',
        priority: 'medium'
      },
      {
        title: 'Zero Late-Night Screen Consumption',
        description: 'Power down blue-light devices 60 minutes before rest.',
        category: 'vitality',
        timeOfDay: 'evening',
        frequency: 'daily',
        type: 'boolean',
        icon: 'Moon',
        color: '#A855F7',
        priority: 'medium'
      }
    ]
  },
  {
    id: 'deep-work-scholar',
    name: 'Deep Work Titan',
    subtitle: 'Extreme cognitive output and razor focus',
    description: 'Structure uninterrupted focus blocks, eliminate shallow digital distractions, and cultivate high-value skills.',
    icon: 'Brain',
    color: '#38BDF8',
    habits: [
      {
        title: 'Deep Work Block 1 (No Distractions)',
        description: '90 minutes of unimpeded, high-leverage cognitive focus.',
        category: 'craft',
        timeOfDay: 'morning',
        frequency: 'weekdays',
        type: 'numeric',
        targetValue: 90,
        unit: 'mins',
        icon: 'Zap',
        color: '#38BDF8',
        priority: 'high'
      },
      {
        title: 'Deep Work Block 2 (Execution)',
        description: 'Second 90-minute block for building and problem solving.',
        category: 'craft',
        timeOfDay: 'afternoon',
        frequency: 'weekdays',
        type: 'numeric',
        targetValue: 90,
        unit: 'mins',
        icon: 'Code',
        color: '#38BDF8',
        priority: 'high'
      },
      {
        title: 'Hydration Protocol (3 Liters)',
        description: 'Maintain peak brain energy and alertness throughout the day.',
        category: 'vitality',
        timeOfDay: 'anytime',
        frequency: 'daily',
        type: 'numeric',
        targetValue: 3,
        unit: 'L',
        icon: 'Droplets',
        color: '#06B6D4',
        priority: 'medium'
      },
      {
        title: 'Skill Deliberate Practice',
        description: 'Read technical docs, practice algorithms, or learn complex craft.',
        category: 'mind',
        timeOfDay: 'evening',
        frequency: 'daily',
        type: 'numeric',
        targetValue: 30,
        unit: 'mins',
        icon: 'Sparkles',
        color: '#F59E0B',
        priority: 'medium'
      }
    ]
  },
  {
    id: 'iron-physique',
    name: 'Iron Will Athlete',
    subtitle: 'Relentless physical endurance and discipline',
    description: 'Daily pushups, daily cardio/movement, clean nutrition, and disciplined sleep hygiene.',
    icon: 'Activity',
    color: '#EF4444',
    habits: [
      {
        title: '100 Daily Pushups',
        description: 'Can be broken into sets or done in one unbroken session.',
        category: 'body',
        timeOfDay: 'anytime',
        frequency: 'daily',
        type: 'numeric',
        targetValue: 100,
        unit: 'reps',
        icon: 'Flame',
        color: '#EF4444',
        priority: 'high'
      },
      {
        title: '10,000 Daily Steps / Running',
        description: 'Cardiovascular foundation and active recovery.',
        category: 'body',
        timeOfDay: 'anytime',
        frequency: 'daily',
        type: 'numeric',
        targetValue: 10000,
        unit: 'steps',
        icon: 'Footprints',
        color: '#10B981',
        priority: 'high'
      },
      {
        title: 'Clean Whole-Food Fuel (Zero Junk)',
        description: 'Strict adherence to clean macronutrients without refined sugars.',
        category: 'vitality',
        timeOfDay: 'anytime',
        frequency: 'daily',
        type: 'boolean',
        icon: 'Apple',
        color: '#22C55E',
        priority: 'high'
      },
      {
        title: 'Mobility & Foam Rolling',
        description: 'Prevent injury and restore full range of motion.',
        category: 'body',
        timeOfDay: 'evening',
        frequency: 'daily',
        type: 'numeric',
        targetValue: 15,
        unit: 'mins',
        icon: 'Heart',
        color: '#EC4899',
        priority: 'normal'
      }
    ]
  }
];

export const DEFAULT_INITIAL_HABITS: Habit[] = [
  {
    id: 'h-stoic-morning',
    title: 'Morning Cold Plunge & Focus Protocol',
    description: 'Cold exposure followed by 10 minutes of silent meditation before opening any screen.',
    category: 'mind',
    timeOfDay: 'morning',
    frequency: 'daily',
    type: 'boolean',
    icon: 'Flame',
    color: '#E63946',
    createdAt: new Date().toISOString(),
    priority: 'high'
  },
  {
    id: 'h-reading',
    title: 'Deep Wisdom & Philosophy Study',
    description: 'Study 20 pages of high-leverage books or Stoic texts.',
    category: 'mind',
    timeOfDay: 'morning',
    frequency: 'daily',
    type: 'numeric',
    targetValue: 20,
    unit: 'pages',
    icon: 'BookOpen',
    color: '#D4AF37',
    createdAt: new Date().toISOString(),
    priority: 'high'
  },
  {
    id: 'h-iron-workout',
    title: 'High-Intensity Training / Heavy Compound Lift',
    description: 'Push physical limits through strength training or intense calisthenics.',
    category: 'body',
    timeOfDay: 'afternoon',
    frequency: 'daily',
    type: 'numeric',
    targetValue: 60,
    unit: 'mins',
    icon: 'Dumbbell',
    color: '#E63946',
    createdAt: new Date().toISOString(),
    priority: 'high'
  },
  {
    id: 'h-deep-craft',
    title: 'Unbroken Deep Craft Execution',
    description: '3 hours of pure, undistracted deep work on core projects.',
    category: 'craft',
    timeOfDay: 'afternoon',
    frequency: 'daily',
    type: 'numeric',
    targetValue: 180,
    unit: 'mins',
    icon: 'Zap',
    color: '#38BDF8',
    createdAt: new Date().toISOString(),
    priority: 'high'
  },
  {
    id: 'h-hydration',
    title: 'Peak Hydration & Clean Electrolytes',
    description: '3.5 Liters of pure water with mineral salts.',
    category: 'vitality',
    timeOfDay: 'anytime',
    frequency: 'daily',
    type: 'numeric',
    targetValue: 3.5,
    unit: 'L',
    icon: 'Droplets',
    color: '#06B6D4',
    createdAt: new Date().toISOString(),
    priority: 'medium'
  },
  {
    id: 'h-evening-audit',
    title: 'Evening Stoic Audit & Journaling',
    description: 'Review victories, discipline slips, and set tomorrow\'s non-negotiables.',
    category: 'soul',
    timeOfDay: 'evening',
    frequency: 'daily',
    type: 'boolean',
    icon: 'Feather',
    color: '#A855F7',
    createdAt: new Date().toISOString(),
    priority: 'medium'
  }
];
