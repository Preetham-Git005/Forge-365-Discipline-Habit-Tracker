import type { 
  Habit, 
  HabitLogEntry, 
  DailyReflection, 
  UserProfile, 
  Milestone,
  Goal,
  Challenge,
  PersonalRule,
  DailyTask,
  DailyInsight
} from '../types';
import { DEFAULT_INITIAL_HABITS } from './presets';
import { INITIAL_MILESTONES } from './levelSystem';
import { DEFAULT_INITIAL_CHALLENGES } from './challenges';

const PREFIX = 'forge365_';
const KEYS = {
  HABITS: `${PREFIX}habits`,
  LOGS: `${PREFIX}logs`,
  REFLECTIONS: `${PREFIX}reflections`,
  PROFILE: `${PREFIX}profile`,
  MILESTONES: `${PREFIX}milestones`,
  GOALS: `${PREFIX}goals`,
  CHALLENGES: `${PREFIX}challenges`,
  RULES: `${PREFIX}rules`,
  TASKS: `${PREFIX}tasks`,
  INSIGHTS: `${PREFIX}insights`,
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
  goals: Goal[];
  challenges: Challenge[];
  rules: PersonalRule[];
  tasks: DailyTask[];
  insights: DailyInsight[];
}

export const getTodayDateString = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getTomorrowDateString = (): string => {
  const now = new Date();
  now.setDate(now.getDate() + 1);
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const formatDateDisplay = (dateStr: string): string => {
  try {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    if (isNaN(date.getTime())) return dateStr;
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  } catch {
    return dateStr || '';
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
    wallpaperGrayscale: false,
    notificationsEnabled: false
  };
};

export const DEFAULT_INITIAL_RULES: PersonalRule[] = [
  {
    id: 'r-1',
    rule: 'Never hit the snooze alarm — rise with immediate purpose.',
    category: 'Mindset',
    active: true,
    createdAt: new Date().toISOString(),
    order: 0
  },
  {
    id: 'r-2',
    rule: 'Zero shallow digital consumption (social feeds) in the first 60 minutes of the morning.',
    category: 'Focus',
    active: true,
    createdAt: new Date().toISOString(),
    order: 1
  },
  {
    id: 'r-3',
    rule: 'Physical calibration daily: Sweat before breakfast or conquer the iron crucible.',
    category: 'Body',
    active: true,
    createdAt: new Date().toISOString(),
    order: 2
  },
  {
    id: 'r-4',
    rule: 'Never negotiate with weakness when resistance appears.',
    category: 'Stoicism',
    active: true,
    createdAt: new Date().toISOString(),
    order: 3
  }
];

export const DEFAULT_INITIAL_GOALS: Goal[] = [
  {
    id: 'g-knowledge-income',
    title: 'Financial Autonomy: Monetize Knowledge & Craft',
    description: 'Transform specialized skills, deep technical knowledge, and relentless work ethic into self-sovereign revenue.',
    type: 'progressive',
    targetDate: '2027-08-15',
    category: 'craft',
    status: 'in_progress',
    color: '#D4AF37',
    icon: 'Brain',
    linkedHabitIds: ['h-deep-craft', 'h-reading'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'g-first-book-milestone',
    title: 'Acquire & Read First Foundational Philosophy Book',
    description: 'Purchase and unbox Meditations by Marcus Aurelius to establish core Stoic principles.',
    type: 'milestone',
    completed: true,
    completedAt: new Date().toISOString(),
    targetDate: '2026-09-01',
    category: 'mind',
    status: 'achieved',
    color: '#38BDF8',
    icon: 'BookOpen',
    linkedHabitIds: [],
    createdAt: new Date().toISOString()
  },
  {
    id: 'g-iron-physique',
    title: 'Spartan Physical Caliber & Conditioning',
    description: 'Achieve elite endurance, body fat control, and unshakable musculoskeletal resilience.',
    type: 'progressive',
    targetDate: '2027-08-15',
    category: 'body',
    status: 'in_progress',
    color: '#E63946',
    icon: 'Dumbbell',
    linkedHabitIds: ['h-iron-workout', 'h-hydration', 'h-stoic-morning'],
    createdAt: new Date().toISOString()
  }
];

export const storage = {
  getHabits(): Habit[] {
    try {
      const data = localStorage.getItem(KEYS.HABITS);
      if (!data) {
        this.saveHabits(DEFAULT_INITIAL_HABITS);
        return DEFAULT_INITIAL_HABITS;
      }
      const parsed = JSON.parse(data);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        this.saveHabits(DEFAULT_INITIAL_HABITS);
        return DEFAULT_INITIAL_HABITS;
      }
      return parsed;
    } catch {
      return DEFAULT_INITIAL_HABITS;
    }
  },

  saveHabits(habits: Habit[]) {
    try {
      localStorage.setItem(KEYS.HABITS, JSON.stringify(Array.isArray(habits) ? habits : DEFAULT_INITIAL_HABITS));
    } catch (e) {
      console.error('Failed to save habits', e);
    }
  },

  getLogs(): HabitLogEntry[] {
    try {
      const data = localStorage.getItem(KEYS.LOGS);
      if (!data) return [];
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  },

  saveLogs(logs: HabitLogEntry[]) {
    try {
      localStorage.setItem(KEYS.LOGS, JSON.stringify(Array.isArray(logs) ? logs : []));
    } catch (e) {
      console.error('Failed to save logs', e);
    }
  },

  getReflections(): DailyReflection[] {
    try {
      const data = localStorage.getItem(KEYS.REFLECTIONS);
      if (!data) return [];
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  },

  saveReflections(reflections: DailyReflection[]) {
    try {
      localStorage.setItem(KEYS.REFLECTIONS, JSON.stringify(Array.isArray(reflections) ? reflections : []));
    } catch (e) {
      console.error('Failed to save reflections', e);
    }
  },

  getProfile(): UserProfile {
    try {
      const data = localStorage.getItem(KEYS.PROFILE);
      if (!data) return getInitialProfile();
      const parsed = JSON.parse(data);
      if (!parsed || typeof parsed !== 'object') return getInitialProfile();
      return {
        ...getInitialProfile(),
        ...parsed,
        xp: typeof parsed.xp === 'number' && !isNaN(parsed.xp) ? parsed.xp : 0,
        level: typeof parsed.level === 'number' && !isNaN(parsed.level) ? parsed.level : 1,
        startDate: parsed.startDate || getTodayDateString()
      };
    } catch {
      return getInitialProfile();
    }
  },

  saveProfile(profile: UserProfile) {
    try {
      localStorage.setItem(KEYS.PROFILE, JSON.stringify(profile || getInitialProfile()));
    } catch (e) {
      console.error('Failed to save profile', e);
    }
  },

  getMilestones(): Milestone[] {
    try {
      const data = localStorage.getItem(KEYS.MILESTONES);
      if (!data) return INITIAL_MILESTONES;
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_MILESTONES;
    } catch {
      return INITIAL_MILESTONES;
    }
  },

  saveMilestones(milestones: Milestone[]) {
    try {
      localStorage.setItem(KEYS.MILESTONES, JSON.stringify(Array.isArray(milestones) ? milestones : INITIAL_MILESTONES));
    } catch (e) {
      console.error('Failed to save milestones', e);
    }
  },

  getGoals(): Goal[] {
    try {
      const data = localStorage.getItem(KEYS.GOALS);
      if (!data) {
        this.saveGoals(DEFAULT_INITIAL_GOALS);
        return DEFAULT_INITIAL_GOALS;
      }
      const parsed = JSON.parse(data);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        this.saveGoals(DEFAULT_INITIAL_GOALS);
        return DEFAULT_INITIAL_GOALS;
      }
      return parsed.map(g => ({
        ...g,
        type: g.type || 'progressive',
        linkedHabitIds: Array.isArray(g.linkedHabitIds) ? g.linkedHabitIds : []
      }));
    } catch {
      return DEFAULT_INITIAL_GOALS;
    }
  },

  saveGoals(goals: Goal[]) {
    try {
      localStorage.setItem(KEYS.GOALS, JSON.stringify(Array.isArray(goals) ? goals : DEFAULT_INITIAL_GOALS));
    } catch (e) {
      console.error('Failed to save goals', e);
    }
  },

  getChallenges(): Challenge[] {
    try {
      const data = localStorage.getItem(KEYS.CHALLENGES);
      if (!data) {
        this.saveChallenges(DEFAULT_INITIAL_CHALLENGES);
        return DEFAULT_INITIAL_CHALLENGES;
      }
      const parsed = JSON.parse(data);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        this.saveChallenges(DEFAULT_INITIAL_CHALLENGES);
        return DEFAULT_INITIAL_CHALLENGES;
      }
      return parsed.map(c => {
        let habitIds: string[] = [];
        if (Array.isArray(c.linkedHabitIds)) {
          habitIds = c.linkedHabitIds;
        } else if (c.linkedHabitId) {
          habitIds = [c.linkedHabitId];
        }
        return {
          ...c,
          linkedHabitIds: habitIds
        };
      });
    } catch {
      return DEFAULT_INITIAL_CHALLENGES;
    }
  },

  saveChallenges(challenges: Challenge[]) {
    try {
      localStorage.setItem(KEYS.CHALLENGES, JSON.stringify(Array.isArray(challenges) ? challenges : DEFAULT_INITIAL_CHALLENGES));
    } catch (e) {
      console.error('Failed to save challenges', e);
    }
  },

  getRules(): PersonalRule[] {
    try {
      const data = localStorage.getItem(KEYS.RULES);
      if (!data) {
        this.saveRules(DEFAULT_INITIAL_RULES);
        return DEFAULT_INITIAL_RULES;
      }
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_INITIAL_RULES;
    } catch {
      return DEFAULT_INITIAL_RULES;
    }
  },

  saveRules(rules: PersonalRule[]) {
    try {
      localStorage.setItem(KEYS.RULES, JSON.stringify(Array.isArray(rules) ? rules : DEFAULT_INITIAL_RULES));
    } catch (e) {
      console.error('Failed to save rules', e);
    }
  },

  getTasks(): DailyTask[] {
    try {
      const data = localStorage.getItem(KEYS.TASKS);
      if (!data) return [];
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  },

  saveTasks(tasks: DailyTask[]) {
    try {
      localStorage.setItem(KEYS.TASKS, JSON.stringify(Array.isArray(tasks) ? tasks : []));
    } catch (e) {
      console.error('Failed to save tasks', e);
    }
  },

  getInsights(): DailyInsight[] {
    try {
      const data = localStorage.getItem(KEYS.INSIGHTS);
      if (!data) return [];
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  },

  saveInsights(insights: DailyInsight[]) {
    try {
      localStorage.setItem(KEYS.INSIGHTS, JSON.stringify(Array.isArray(insights) ? insights : []));
    } catch (e) {
      console.error('Failed to save insights', e);
    }
  },

  exportBackup(): ExportData {
    return {
      version: '2.1.0',
      exportedAt: new Date().toISOString(),
      profile: this.getProfile(),
      habits: this.getHabits(),
      logs: this.getLogs(),
      reflections: this.getReflections(),
      milestones: this.getMilestones(),
      goals: this.getGoals(),
      challenges: this.getChallenges(),
      rules: this.getRules(),
      tasks: this.getTasks(),
      insights: this.getInsights()
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
      this.saveGoals(data.goals || DEFAULT_INITIAL_GOALS);
      this.saveChallenges(data.challenges || DEFAULT_INITIAL_CHALLENGES);
      this.saveRules(data.rules || DEFAULT_INITIAL_RULES);
      this.saveTasks(data.tasks || []);
      this.saveInsights(data.insights || []);
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
    localStorage.removeItem(KEYS.GOALS);
    localStorage.removeItem(KEYS.CHALLENGES);
    localStorage.removeItem(KEYS.RULES);
    localStorage.removeItem(KEYS.TASKS);
    localStorage.removeItem(KEYS.INSIGHTS);
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
