export type HabitCategory = 'mind' | 'body' | 'craft' | 'soul' | 'vitality';
export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'anytime';
export type HabitFrequency = 'daily' | 'weekdays' | 'weekends' | 'custom_days';
export type HabitType = 'boolean' | 'numeric' | 'timer';
export type HabitPriority = 'high' | 'medium' | 'normal';

export interface Habit {
  id: string;
  title: string;
  description?: string;
  category: HabitCategory;
  timeOfDay: TimeOfDay;
  frequency: HabitFrequency;
  customDays?: number[]; // 0 = Sun, 1 = Mon ... 6 = Sat
  type: HabitType;
  targetValue?: number;
  unit?: string;
  icon: string;
  color: string;
  createdAt: string; // ISO date
  archived?: boolean;
  priority: HabitPriority;
  order?: number;
}

export interface HabitLogEntry {
  habitId: string;
  date: string; // 'YYYY-MM-DD'
  completed: boolean;
  currentValue?: number;
  notes?: string;
  completedAt?: string;
}

export interface DailyReflection {
  date: string; // 'YYYY-MM-DD'
  rating: number; // 1 - 5 (Discipline rating)
  reflection: string;
  highlight?: string;
  obstacle?: string;
  morningIntention?: string;
  loggedAt: string;
}

export interface UserProfile {
  name: string;
  title: string;
  startDate: string; // 'YYYY-MM-DD' - start of the 365-day forge
  targetDays: number; // 365
  level: number;
  xp: number;
  soundEnabled: boolean;
  backgroundTheme: string;
  ambientSound: 'off' | 'rain' | 'fire' | 'focus';
  wallpaperOpacity?: number; // 10 to 90 (percent)
  wallpaperBlur?: number; // 0 to 12 (px)
  wallpaperGrayscale?: boolean; // true = monochrome noir, false = cinematic color
  customWallpaperUrl?: string;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  progress: number;
  target: number;
  tier: 'bronze' | 'silver' | 'gold' | 'obsidian';
}

export interface DisciplineQuote {
  id: string;
  text: string;
  author: string;
  source?: string;
  category: 'stoicism' | 'willpower' | 'mastery' | 'resilience' | 'focus';
}

export interface DayStats {
  date: string;
  totalHabits: number;
  completedHabits: number;
  completionRate: number; // 0 to 100
  isPerfect: boolean;
}
