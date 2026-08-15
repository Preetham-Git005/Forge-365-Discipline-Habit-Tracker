import type { Habit, HabitLogEntry, DailyReflection, UserProfile, Milestone } from '../types';
import { DEFAULT_INITIAL_HABITS } from './presets';
import { INITIAL_MILESTONES } from './levelSystem';

const PREFIX = 'forge365_';
const KEYS = {
  HABITS: `${PREFIX}habits`,
  LOGS: `${PREFIX}logs`,
  REFLECTIONS: `${PREFIX}reflections`,
  PROFILE: `${PREFIX}profile`,
  MILESTONES: `${PREFIX}milestones`,
  VERSION: `${PREFIX}version`
};

export const SYNC_CHANNEL_NAME = 'forge365_sync_channel';

export interface ExportData {
  version: string;
  exportedAt: string;
  profile: UserProfile;
  habits: Habit[];
  logs: HabitLogEntry[];
  reflections: DailyReflection[];
  milestones: Milestone[];
}

export const getTodayDateString = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const formatDateDisplay = (dateStr: string): string => {
  try {
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  } catch {
    return dateStr;
  }
};

export const getInitialProfile = (): UserProfile => {
  return {
    name: 'Discipline Master',
    title: 'Novice of Will',
    startDate: getTodayDateString(),
    targetDays: 365,
    level: 1,
    xp: 0,
    soundEnabled: true,
    backgroundTheme: 'marcus-bust',
    ambientSound: 'off',
    wallpaperOpacity: 45,
    wallpaperBlur: 0,
    wallpaperGrayscale: false
  };
};

export const storage = {
  getHabits(): Habit[] {
    try {
      const data = localStorage.getItem(KEYS.HABITS);
      if (!data) {
        this.saveHabits(DEFAULT_INITIAL_HABITS);
        return DEFAULT_INITIAL_HABITS;
      }
      return JSON.parse(data);
    } catch {
      return DEFAULT_INITIAL_HABITS;
    }
  },

  saveHabits(habits: Habit[]) {
    try {
      localStorage.setItem(KEYS.HABITS, JSON.stringify(habits));
    } catch (e) {
      console.error('Failed to save habits', e);
    }
  },

  getLogs(): HabitLogEntry[] {
    try {
      const data = localStorage.getItem(KEYS.LOGS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveLogs(logs: HabitLogEntry[]) {
    try {
      localStorage.setItem(KEYS.LOGS, JSON.stringify(logs));
    } catch (e) {
      console.error('Failed to save logs', e);
    }
  },

  getReflections(): DailyReflection[] {
    try {
      const data = localStorage.getItem(KEYS.REFLECTIONS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveReflections(reflections: DailyReflection[]) {
    try {
      localStorage.setItem(KEYS.REFLECTIONS, JSON.stringify(reflections));
    } catch (e) {
      console.error('Failed to save reflections', e);
    }
  },

  getProfile(): UserProfile {
    try {
      const data = localStorage.getItem(KEYS.PROFILE);
      return data ? { ...getInitialProfile(), ...JSON.parse(data) } : getInitialProfile();
    } catch {
      return getInitialProfile();
    }
  },

  saveProfile(profile: UserProfile) {
    try {
      localStorage.setItem(KEYS.PROFILE, JSON.stringify(profile));
    } catch (e) {
      console.error('Failed to save profile', e);
    }
  },

  getMilestones(): Milestone[] {
    try {
      const data = localStorage.getItem(KEYS.MILESTONES);
      return data ? JSON.parse(data) : INITIAL_MILESTONES;
    } catch {
      return INITIAL_MILESTONES;
    }
  },

  saveMilestones(milestones: Milestone[]) {
    try {
      localStorage.setItem(KEYS.MILESTONES, JSON.stringify(milestones));
    } catch (e) {
      console.error('Failed to save milestones', e);
    }
  },

  exportBackup(): ExportData {
    return {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      profile: this.getProfile(),
      habits: this.getHabits(),
      logs: this.getLogs(),
      reflections: this.getReflections(),
      milestones: this.getMilestones()
    };
  },

  importBackup(data: ExportData): boolean {
    try {
      if (!data || !data.habits || !data.logs) {
        throw new Error('Invalid backup schema');
      }
      this.saveProfile(data.profile || getInitialProfile());
      this.saveHabits(data.habits);
      this.saveLogs(data.logs);
      this.saveReflections(data.reflections || []);
      this.saveMilestones(data.milestones || INITIAL_MILESTONES);
      return true;
    } catch (e) {
      console.error('Import failed', e);
      return false;
    }
  },

  resetAll(): void {
    localStorage.removeItem(KEYS.HABITS);
    localStorage.removeItem(KEYS.LOGS);
    localStorage.removeItem(KEYS.REFLECTIONS);
    localStorage.removeItem(KEYS.PROFILE);
    localStorage.removeItem(KEYS.MILESTONES);
  },

  generateDemoHistory(daysBack: number = 30): { logs: HabitLogEntry[], reflections: DailyReflection[], xpGained: number } {
    const habits = this.getHabits();
    const logs: HabitLogEntry[] = [];
    const reflections: DailyReflection[] = [];
    let xpGained = 0;

    const today = new Date();

    for (let i = daysBack; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;

      let completedToday = 0;

      habits.forEach(habit => {
        const isDone = Math.random() > 0.18;
        if (isDone) {
          completedToday++;
          xpGained += 25;
          logs.push({
            habitId: habit.id,
            date: dateStr,
            completed: true,
            currentValue: habit.targetValue || 1,
            completedAt: new Date(d.getTime() + Math.random() * 36000000).toISOString()
          });
        }
      });

      if (completedToday === habits.length) {
        xpGained += 100;
      }

      if (i % 2 === 0) {
        reflections.push({
          date: dateStr,
          rating: Math.floor(Math.random() * 2) + 4,
          reflection: 'Maintained strict focus and conquered resistance. The physical session was grueling but forged mental resilience.',
          highlight: 'Unbroken concentration during deep work block.',
          obstacle: 'Minor morning fatigue overcome by breathwork.',
          loggedAt: new Date(d.getTime() + 72000000).toISOString()
        });
        xpGained += 50;
      }
    }

    return { logs, reflections, xpGained };
  }
};
