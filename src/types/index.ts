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
  customDays?: number[]; // 0 = Sun, 1 = Mon, 2 = Tue, 3 = Wed, 4 = Thu, 5 = Fri, 6 = Sat
  type: HabitType;
  targetValue?: number;
  unit?: string;
  icon: string;
  color: string;
  createdAt: string; // ISO date
  archived?: boolean;
  priority: HabitPriority;
  order?: number;
  reminderTime?: string; // "HH:mm" in 24h format, e.g. "05:00", "18:30"
  goalId?: string; // ID of the linked Grand Goal / Objective
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

export type GoalType = 'progressive' | 'milestone';

export interface Goal {
  id: string;
  title: string;
  description?: string;
  type: GoalType; // 'progressive' = habit tracked, 'milestone' = check / uncheck single milestone
  completed?: boolean; // For milestone goals
  completedAt?: string;
  targetDate?: string; // 'YYYY-MM-DD'
  category: HabitCategory;
  status: 'in_progress' | 'achieved' | 'archived';
  color: string;
  icon: string;
  linkedHabitIds: string[];
  createdAt: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'weekly' | 'monthly';
  category: HabitCategory;
  targetCount: number; // e.g. 7, 30
  unit: string; // e.g. "Days", "Workouts", "Sessions"
  rewardXp: number;
  color: string;
  icon: string;
  linkedHabitId?: string;
  linkedHabitIds?: string[];
  startDate: string; // 'YYYY-MM-DD'
  endDate: string; // 'YYYY-MM-DD'
  status: 'active' | 'completed' | 'failed';
  completedAt?: string;
  createdAt: string;
}

export interface PersonalRule {
  id: string;
  rule: string;
  category?: string;
  createdAt: string;
  active: boolean;
  order?: number;
}

export interface DailyTask {
  id: string;
  title: string;
  date: string; // Target execution date 'YYYY-MM-DD'
  completed: boolean;
  priority: 'high' | 'medium' | 'normal';
  createdAt: string;
  completedAt?: string;
}

export interface DailyInsight {
  id: string;
  date: string; // 'YYYY-MM-DD'
  content: string;
  createdAt: string;
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
  notificationsEnabled?: boolean;
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
