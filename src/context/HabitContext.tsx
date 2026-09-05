import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import type { 
  Habit, 
  HabitLogEntry, 
  DailyReflection, 
  UserProfile, 
  Milestone, 
  HabitCategory,
  Goal,
  Challenge,
  PersonalRule,
  DailyTask,
  DailyInsight
} from '../types';
import { storage, getTodayDateString, getTomorrowDateString, SYNC_CHANNEL_NAME } from '../utils/storage';
import type { ExportData } from '../utils/storage';
import { calculateLevelInfo } from '../utils/levelSystem';
import type { LevelInfo } from '../utils/levelSystem';
import { sound } from '../utils/sound';
import { sendHabitReminderNotification } from '../utils/notifications';
import confetti from 'canvas-confetti';

interface HabitContextType {
  habits: Habit[];
  logs: HabitLogEntry[];
  reflections: DailyReflection[];
  profile: UserProfile;
  milestones: Milestone[];
  goals: Goal[];
  challenges: Challenge[];
  rules: PersonalRule[];
  tasks: DailyTask[];
  insights: DailyInsight[];
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  levelInfo: LevelInfo;
  activeReminderToast: { habitTitle: string; time: string; id: string } | null;
  dismissReminderToast: () => void;
  
  // Habits Actions
  toggleHabitCompletion: (habitId: string, date?: string) => void;
  updateHabitValue: (habitId: string, value: number, date?: string) => void;
  addHabit: (habit: Omit<Habit, 'id' | 'createdAt'>, position?: 'top' | 'bottom') => void;
  updateHabit: (habit: Habit) => void;
  deleteHabit: (habitId: string) => void;
  moveHabit: (habitId: string, direction: 'up' | 'down') => void;
  reorderHabits: (newHabits: Habit[]) => void;
  importHabitPack: (habits: Omit<Habit, 'id' | 'createdAt'>[]) => void;
  isHabitScheduledForDate: (habit: Habit, dateStr: string) => boolean;
  
  // Goals Actions
  addGoal: (goal: Omit<Goal, 'id' | 'createdAt'>) => void;
  updateGoal: (goal: Goal) => void;
  deleteGoal: (goalId: string) => void;
  toggleMilestoneGoalCompleted: (goalId: string) => void;
  linkHabitToGoal: (goalId: string, habitId: string) => void;
  unlinkHabitFromGoal: (goalId: string, habitId: string) => void;
  getGoalProgress: (goalId: string) => { 
    totalHabits: number; 
    activeHabits: Habit[]; 
    completionRate: number; 
    totalCompletions: number;
    daysActive: number;
  };
  
  // Challenges Actions (Winter Arc, Weekly, Monthly)
  addChallenge: (challenge: Omit<Challenge, 'id' | 'createdAt'>) => void;
  updateChallenge: (challenge: Challenge) => void;
  deleteChallenge: (challengeId: string) => void;
  toggleChallengeCompletion: (challengeId: string) => void;
  linkHabitToChallenge: (challengeId: string, habitId: string) => void;
  unlinkHabitFromChallenge: (challengeId: string, habitId: string) => void;
  getChallengeProgress: (challengeId: string) => {
    currentCount: number;
    targetCount: number;
    percent: number;
    isCompleted: boolean;
  };

  // Rules Actions
  addRule: (ruleText: string, category?: string) => void;
  updateRule: (rule: PersonalRule) => void;
  deleteRule: (ruleId: string) => void;
  toggleRuleActive: (ruleId: string) => void;
  
  // Battle Plan Tasks
  addTask: (title: string, date?: string, priority?: 'high' | 'medium' | 'normal') => void;
  planTomorrowTask: (title: string, priority?: 'high' | 'medium' | 'normal') => void;
  toggleTaskCompleted: (taskId: string) => void;
  deleteTask: (taskId: string) => void;
  getTasksForDate: (dateStr: string) => DailyTask[];
  
  // Insights Actions
  addInsight: (content: string, date?: string) => void;
  deleteInsight: (insightId: string) => void;
  getInsightsForDate: (dateStr: string) => DailyInsight[];

  // Reflection & Profile
  saveDailyReflection: (reflection: Omit<DailyReflection, 'loggedAt'>) => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
  
  // Year & Stats helpers
  getHabitStatusForDate: (habitId: string, date: string) => HabitLogEntry | undefined;
  getCompletionRateForDate: (date: string) => number;
  getStreakForHabit: (habitId: string) => { current: number; best: number };
  getCategoryStats: () => Record<HabitCategory, { total: number; completed: number; rate: number }>;
  getYearStats: () => {
    startDate: string;
    totalDays: number;
    daysElapsed: number;
    daysRemaining: number;
    yearCompletionRate: number;
    perfectDaysCount: number;
    totalCompletions: number;
    currentOverallStreak: number;
  };
  
  // Sound & Theme
  toggleSound: () => void;
  setAmbientSound: (ambient: 'off' | 'rain' | 'fire' | 'focus') => void;
  setBackgroundTheme: (themeId: string) => void;
  updateWallpaperSettings: (settings: { opacity?: number; blur?: number; grayscale?: boolean; customUrl?: string }) => void;
  
  // Data management
  exportData: () => ExportData;
  importData: (data: ExportData) => boolean;
  loadDemoData: () => void;
  resetData: () => void;
}

const HabitContext = createContext<HabitContextType | undefined>(undefined);

export const HabitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [habits, setHabits] = useState<Habit[]>(() => storage.getHabits());
  const [logs, setLogs] = useState<HabitLogEntry[]>(() => storage.getLogs());
  const [reflections, setReflections] = useState<DailyReflection[]>(() => storage.getReflections());
  const [profile, setProfile] = useState<UserProfile>(() => storage.getProfile());
  const [milestones, setMilestones] = useState<Milestone[]>(() => storage.getMilestones());
  const [goals, setGoals] = useState<Goal[]>(() => storage.getGoals());
  const [challenges, setChallenges] = useState<Challenge[]>(() => storage.getChallenges());
  const [rules, setRules] = useState<PersonalRule[]>(() => storage.getRules());
  const [tasks, setTasks] = useState<DailyTask[]>(() => storage.getTasks());
  const [insights, setInsights] = useState<DailyInsight[]>(() => storage.getInsights());
  const [selectedDate, setSelectedDate] = useState<string>(getTodayDateString());
  const [activeReminderToast, setActiveReminderToast] = useState<{ habitTitle: string; time: string; id: string } | null>(null);

  const dismissReminderToast = useCallback(() => {
    setActiveReminderToast(null);
  }, []);

  // Level & XP derived calculations
  const levelInfo = useMemo(() => calculateLevelInfo(profile.xp), [profile.xp]);

  // Sync state across browser tabs using BroadcastChannel & window storage events
  useEffect(() => {
    let channel: BroadcastChannel | null = null;
    try {
      if (typeof BroadcastChannel !== 'undefined') {
        channel = new BroadcastChannel(SYNC_CHANNEL_NAME);
        channel.onmessage = (event) => {
          if (event.data && event.data.type === 'SYNC_STATE') {
            setHabits(storage.getHabits());
            setLogs(storage.getLogs());
            setReflections(storage.getReflections());
            setProfile(storage.getProfile());
            setMilestones(storage.getMilestones());
            setGoals(storage.getGoals());
            setChallenges(storage.getChallenges());
            setRules(storage.getRules());
            setTasks(storage.getTasks());
            setInsights(storage.getInsights());
          }
        };
      }
    } catch {
      // Fallback
    }

    const handleStorage = (e: StorageEvent) => {
      if (e.key && e.key.startsWith('forge365_')) {
        setHabits(storage.getHabits());
        setLogs(storage.getLogs());
        setReflections(storage.getReflections());
        setProfile(storage.getProfile());
        setMilestones(storage.getMilestones());
        setGoals(storage.getGoals());
        setChallenges(storage.getChallenges());
        setRules(storage.getRules());
        setTasks(storage.getTasks());
        setInsights(storage.getInsights());
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => {
      if (channel) channel.close();
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const broadcastChange = useCallback(() => {
    try {
      if (typeof BroadcastChannel !== 'undefined') {
        const channel = new BroadcastChannel(SYNC_CHANNEL_NAME);
        channel.postMessage({ type: 'SYNC_STATE', timestamp: Date.now() });
        channel.close();
      }
    } catch {
      // Ignore
    }
  }, []);

  // Check if a habit is scheduled for a specific date (day of week)
  const isHabitScheduledForDate = useCallback((habit: Habit, dateStr: string): boolean => {
    if (!habit || habit.archived) return false;
    const [y, m, d] = dateStr.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    if (isNaN(date.getTime())) return true;
    const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday ... 6 = Saturday

    if (habit.frequency === 'daily') return true;
    if (habit.frequency === 'weekdays') return dayOfWeek >= 1 && dayOfWeek <= 5;
    if (habit.frequency === 'weekends') return dayOfWeek === 0 || dayOfWeek === 6;
    if (habit.frequency === 'custom_days' && Array.isArray(habit.customDays)) {
      return habit.customDays.includes(dayOfWeek);
    }
    return true;
  }, []);

  // Timed Reminder Monitor: Strictly checks every 30 seconds only for habits WITH timing
  useEffect(() => {
    let lastNotifiedMinute = '';

    const checkReminders = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const currentMinuteStr = `${hours}:${minutes}`;
      const todayStr = getTodayDateString();

      if (currentMinuteStr === lastNotifiedMinute) return;

      // Only habits with a non-empty reminderTime scheduled for today
      const activeScheduledHabits = habits.filter(
        h => !h.archived && h.reminderTime && h.reminderTime.trim().length > 0 && isHabitScheduledForDate(h, todayStr)
      );

      activeScheduledHabits.forEach(h => {
        if (h.reminderTime === currentMinuteStr) {
          // Check if already completed today
          const log = logs.find(l => l.habitId === h.id && l.date === todayStr);
          if (!log || !log.completed) {
            sendHabitReminderNotification(h.title, h.timeOfDay, profile.soundEnabled);
            setActiveReminderToast({
              habitTitle: h.title,
              time: currentMinuteStr,
              id: `${h.id}-${Date.now()}`
            });
          }
        }
      });

      lastNotifiedMinute = currentMinuteStr;
    };

    checkReminders();
    const interval = setInterval(checkReminders, 30000);
    return () => clearInterval(interval);
  }, [habits, logs, profile.soundEnabled, isHabitScheduledForDate]);

  // Update profile and level automatically when XP changes
  const addXp = useCallback((amount: number) => {
    setProfile(prev => {
      const newXp = prev.xp + amount;
      const newLevelInfo = calculateLevelInfo(newXp);
      const updated = {
        ...prev,
        xp: newXp,
        level: newLevelInfo.level,
        title: newLevelInfo.title
      };
      storage.saveProfile(updated);

      if (newLevelInfo.level > prev.level) {
        sound.playLevelUp(prev.soundEnabled);
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#E63946', '#D4AF37', '#38BDF8', '#FFFFFF']
        });
      }
      return updated;
    });
    broadcastChange();
  }, [broadcastChange]);

  // Toggle habit completion
  const toggleHabitCompletion = useCallback((habitId: string, date: string = selectedDate) => {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return;

    setLogs(prevLogs => {
      const existingIdx = prevLogs.findIndex(l => l.habitId === habitId && l.date === date);
      let updatedLogs: HabitLogEntry[];
      let isNowCompleted = false;

      if (existingIdx >= 0) {
        const current = prevLogs[existingIdx];
        isNowCompleted = !current.completed;
        const updatedEntry: HabitLogEntry = {
          ...current,
          completed: isNowCompleted,
          completedAt: isNowCompleted ? new Date().toISOString() : undefined,
          currentValue: isNowCompleted ? (habit.targetValue || 1) : 0
        };
        updatedLogs = [...prevLogs];
        updatedLogs[existingIdx] = updatedEntry;
      } else {
        isNowCompleted = true;
        const newEntry: HabitLogEntry = {
          habitId,
          date,
          completed: true,
          currentValue: habit.targetValue || 1,
          completedAt: new Date().toISOString()
        };
        updatedLogs = [newEntry, ...prevLogs];
      }

      storage.saveLogs(updatedLogs);

      if (isNowCompleted) {
        sound.playComplete(profile.soundEnabled);
        addXp(25);

        // Check if all scheduled habits are completed today for a perfect day celebration!
        const scheduledTodayHabits = habits.filter(h => isHabitScheduledForDate(h, date));
        const completedCountToday = updatedLogs.filter(
          l => l.date === date && l.completed && scheduledTodayHabits.some(h => h.id === l.habitId)
        ).length;

        if (completedCountToday === scheduledTodayHabits.length && scheduledTodayHabits.length > 0) {
          addXp(100);
          confetti({
            particleCount: 70,
            spread: 60,
            origin: { y: 0.7 },
            colors: ['#E63946', '#D4AF37', '#10B981']
          });
        }
      } else {
        sound.playClick(profile.soundEnabled);
      }

      return updatedLogs;
    });

    broadcastChange();
  }, [habits, selectedDate, profile.soundEnabled, addXp, broadcastChange, isHabitScheduledForDate]);

  // Update numeric progress for habits (e.g. 15 of 20 pages)
  const updateHabitValue = useCallback((habitId: string, value: number, date: string = selectedDate) => {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return;

    const target = habit.targetValue || 1;
    const isCompleted = value >= target;

    setLogs(prevLogs => {
      const existingIdx = prevLogs.findIndex(l => l.habitId === habitId && l.date === date);
      let updatedLogs: HabitLogEntry[];

      if (existingIdx >= 0) {
        const wasCompleted = prevLogs[existingIdx].completed;
        const updatedEntry: HabitLogEntry = {
          ...prevLogs[existingIdx],
          currentValue: value,
          completed: isCompleted,
          completedAt: isCompleted ? new Date().toISOString() : undefined
        };
        updatedLogs = [...prevLogs];
        updatedLogs[existingIdx] = updatedEntry;

        if (!wasCompleted && isCompleted) {
          sound.playComplete(profile.soundEnabled);
          addXp(25);
        } else {
          sound.playClick(profile.soundEnabled);
        }
      } else {
        const newEntry: HabitLogEntry = {
          habitId,
          date,
          currentValue: value,
          completed: isCompleted,
          completedAt: isCompleted ? new Date().toISOString() : undefined
        };
        updatedLogs = [newEntry, ...prevLogs];
        if (isCompleted) {
          sound.playComplete(profile.soundEnabled);
          addXp(25);
        } else {
          sound.playClick(profile.soundEnabled);
        }
      }

      storage.saveLogs(updatedLogs);
      return updatedLogs;
    });

    broadcastChange();
  }, [habits, selectedDate, profile.soundEnabled, addXp, broadcastChange]);

  // Habit management with Ordering & Goal Link
  const addHabit = useCallback((newHabitData: Omit<Habit, 'id' | 'createdAt'>, position: 'top' | 'bottom' = 'top') => {
    const newHabitId = `h-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const newHabit: Habit = {
      ...newHabitData,
      id: newHabitId,
      createdAt: new Date().toISOString()
    };

    setHabits(prev => {
      const updated = position === 'top' ? [newHabit, ...prev] : [...prev, newHabit];
      storage.saveHabits(updated);
      return updated;
    });

    // If goalId is provided, also link to goal
    if (newHabitData.goalId) {
      setGoals(prevGoals => {
        const updatedGoals = prevGoals.map(g => {
          if (g.id === newHabitData.goalId && !g.linkedHabitIds.includes(newHabitId)) {
            return { ...g, linkedHabitIds: [...g.linkedHabitIds, newHabitId] };
          }
          return g;
        });
        storage.saveGoals(updatedGoals);
        return updatedGoals;
      });
    }

    sound.playClick(profile.soundEnabled);
    broadcastChange();
  }, [profile.soundEnabled, broadcastChange]);

  const updateHabit = useCallback((updatedHabit: Habit) => {
    setHabits(prev => {
      const updated = prev.map(h => h.id === updatedHabit.id ? updatedHabit : h);
      storage.saveHabits(updated);
      return updated;
    });

    if (updatedHabit.goalId) {
      setGoals(prevGoals => {
        const updatedGoals = prevGoals.map(g => {
          if (g.id === updatedHabit.goalId && !g.linkedHabitIds.includes(updatedHabit.id)) {
            return { ...g, linkedHabitIds: [...g.linkedHabitIds, updatedHabit.id] };
          }
          return g;
        });
        storage.saveGoals(updatedGoals);
        return updatedGoals;
      });
    }

    broadcastChange();
  }, [broadcastChange]);

  const deleteHabit = useCallback((habitId: string) => {
    setHabits(prev => {
      const updated = prev.filter(h => h.id !== habitId);
      storage.saveHabits(updated);
      return updated;
    });

    setGoals(prev => {
      const updated = prev.map(g => ({
        ...g,
        linkedHabitIds: g.linkedHabitIds.filter(id => id !== habitId)
      }));
      storage.saveGoals(updated);
      return updated;
    });

    broadcastChange();
  }, [broadcastChange]);

  const moveHabit = useCallback((habitId: string, direction: 'up' | 'down') => {
    setHabits(prev => {
      const index = prev.findIndex(h => h.id === habitId);
      if (index === -1) return prev;
      if (direction === 'up' && index === 0) return prev;
      if (direction === 'down' && index === prev.length - 1) return prev;

      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      const updated = [...prev];
      const temp = updated[index];
      updated[index] = updated[targetIndex];
      updated[targetIndex] = temp;

      storage.saveHabits(updated);
      return updated;
    });
    sound.playClick(profile.soundEnabled);
    broadcastChange();
  }, [profile.soundEnabled, broadcastChange]);

  const reorderHabits = useCallback((newHabits: Habit[]) => {
    setHabits(newHabits);
    storage.saveHabits(newHabits);
    broadcastChange();
  }, [broadcastChange]);

  const importHabitPack = useCallback((newHabitsData: Omit<Habit, 'id' | 'createdAt'>[]) => {
    const createdHabits: Habit[] = newHabitsData.map((data, idx) => ({
      ...data,
      id: `pack-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString()
    }));

    setHabits(prev => {
      const updated = [...createdHabits, ...prev];
      storage.saveHabits(updated);
      return updated;
    });

    sound.playLevelUp(profile.soundEnabled);
    confetti({ particleCount: 50, spread: 60 });
    broadcastChange();
  }, [profile.soundEnabled, broadcastChange]);

  // Goals Management
  const addGoal = useCallback((goalData: Omit<Goal, 'id' | 'createdAt'>) => {
    const newGoal: Goal = {
      ...goalData,
      id: `g-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString()
    };
    setGoals(prev => {
      const updated = [newGoal, ...prev];
      storage.saveGoals(updated);
      return updated;
    });
    sound.playLevelUp(profile.soundEnabled);
    broadcastChange();
  }, [profile.soundEnabled, broadcastChange]);

  const updateGoal = useCallback((updatedGoal: Goal) => {
    setGoals(prev => {
      const updated = prev.map(g => g.id === updatedGoal.id ? updatedGoal : g);
      storage.saveGoals(updated);
      return updated;
    });
    broadcastChange();
  }, [broadcastChange]);

  const deleteGoal = useCallback((goalId: string) => {
    setGoals(prev => {
      const updated = prev.filter(g => g.id !== goalId);
      storage.saveGoals(updated);
      return updated;
    });
    setHabits(prev => {
      const updated = prev.map(h => h.goalId === goalId ? { ...h, goalId: undefined } : h);
      storage.saveHabits(updated);
      return updated;
    });
    broadcastChange();
  }, [broadcastChange]);

  const toggleMilestoneGoalCompleted = useCallback((goalId: string) => {
    setGoals(prev => {
      const updated = prev.map(g => {
        if (g.id === goalId) {
          const nextCompleted = !g.completed;
          if (nextCompleted) {
            sound.playLevelUp(profile.soundEnabled);
            addXp(150);
            confetti({
              particleCount: 90,
              spread: 70,
              origin: { y: 0.6 },
              colors: ['#D4AF37', '#38BDF8', '#E63946']
            });
          } else {
            sound.playClick(profile.soundEnabled);
          }
          const updatedStatus: 'achieved' | 'in_progress' = nextCompleted ? 'achieved' : 'in_progress';
          return {
            ...g,
            completed: nextCompleted,
            status: updatedStatus,
            completedAt: nextCompleted ? new Date().toISOString() : undefined
          };
        }
        return g;
      });
      storage.saveGoals(updated);
      return updated;
    });
    broadcastChange();
  }, [profile.soundEnabled, addXp, broadcastChange]);

  const linkHabitToGoal = useCallback((goalId: string, habitId: string) => {
    setGoals(prev => {
      const updated = prev.map(g => {
        if (g.id === goalId && !g.linkedHabitIds.includes(habitId)) {
          return { ...g, linkedHabitIds: [...g.linkedHabitIds, habitId] };
        }
        return g;
      });
      storage.saveGoals(updated);
      return updated;
    });
    setHabits(prev => {
      const updated = prev.map(h => h.id === habitId ? { ...h, goalId } : h);
      storage.saveHabits(updated);
      return updated;
    });
    broadcastChange();
  }, [broadcastChange]);

  const unlinkHabitFromGoal = useCallback((goalId: string, habitId: string) => {
    setGoals(prev => {
      const updated = prev.map(g => {
        if (g.id === goalId) {
          return { ...g, linkedHabitIds: g.linkedHabitIds.filter(id => id !== habitId) };
        }
        return g;
      });
      storage.saveGoals(updated);
      return updated;
    });
    setHabits(prev => {
      const updated = prev.map(h => h.id === habitId && h.goalId === goalId ? { ...h, goalId: undefined } : h);
      storage.saveHabits(updated);
      return updated;
    });
    broadcastChange();
  }, [broadcastChange]);

  const getGoalProgress = useCallback((goalId: string) => {
    const goal = goals.find(g => g.id === goalId);
    if (!goal) {
      return { totalHabits: 0, activeHabits: [], completionRate: 0, totalCompletions: 0, daysActive: 0 };
    }

    if (goal.type === 'milestone') {
      return {
        totalHabits: 0,
        activeHabits: [],
        completionRate: goal.completed ? 100 : 0,
        totalCompletions: goal.completed ? 1 : 0,
        daysActive: goal.completed ? 1 : 0
      };
    }

    if (goal.linkedHabitIds.length === 0) {
      return { totalHabits: 0, activeHabits: [], completionRate: 0, totalCompletions: 0, daysActive: 0 };
    }

    const linkedHabits = habits.filter(h => goal.linkedHabitIds.includes(h.id));
    const linkedLogs = logs.filter(l => l.completed && goal.linkedHabitIds.includes(l.habitId));
    const totalCompletions = linkedLogs.length;

    const uniqueDates = new Set(linkedLogs.map(l => l.date));
    const daysActive = uniqueDates.size;

    const expected = Math.max(1, linkedHabits.length * 30);
    const completionRate = Math.min(100, Math.round((totalCompletions / expected) * 100));

    return {
      totalHabits: linkedHabits.length,
      activeHabits: linkedHabits,
      completionRate,
      totalCompletions,
      daysActive
    };
  }, [goals, habits, logs]);

  // Challenges Management
  const addChallenge = useCallback((challengeData: Omit<Challenge, 'id' | 'createdAt'>) => {
    const newChallenge: Challenge = {
      ...challengeData,
      id: `c-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString()
    };
    setChallenges(prev => {
      const updated = [newChallenge, ...prev];
      storage.saveChallenges(updated);
      return updated;
    });
    sound.playLevelUp(profile.soundEnabled);
    broadcastChange();
  }, [profile.soundEnabled, broadcastChange]);

  const updateChallenge = useCallback((updatedChallenge: Challenge) => {
    setChallenges(prev => {
      const updated = prev.map(c => c.id === updatedChallenge.id ? updatedChallenge : c);
      storage.saveChallenges(updated);
      return updated;
    });
    broadcastChange();
  }, [broadcastChange]);

  const deleteChallenge = useCallback((challengeId: string) => {
    setChallenges(prev => {
      const updated = prev.filter(c => c.id !== challengeId);
      storage.saveChallenges(updated);
      return updated;
    });
    broadcastChange();
  }, [broadcastChange]);

  const toggleChallengeCompletion = useCallback((challengeId: string) => {
    setChallenges(prev => {
      const updated = prev.map(c => {
        if (c.id === challengeId) {
          const nextCompleted = c.status !== 'completed';
          if (nextCompleted) {
            sound.playLevelUp(profile.soundEnabled);
            addXp(c.rewardXp || 300);
            confetti({
              particleCount: 120,
              spread: 80,
              origin: { y: 0.6 },
              colors: ['#E63946', '#D4AF37', '#38BDF8']
            });
          } else {
            sound.playClick(profile.soundEnabled);
          }
          const updatedStatus: 'completed' | 'active' = nextCompleted ? 'completed' : 'active';
          return {
            ...c,
            status: updatedStatus,
            completedAt: nextCompleted ? new Date().toISOString() : undefined
          };
        }
        return c;
      });
      storage.saveChallenges(updated);
      return updated;
    });
    broadcastChange();
  }, [profile.soundEnabled, addXp, broadcastChange]);

  const linkHabitToChallenge = useCallback((challengeId: string, habitId: string) => {
    setChallenges(prev => {
      const updated = prev.map(c => {
        if (c.id === challengeId) {
          const currentIds = Array.isArray(c.linkedHabitIds) ? c.linkedHabitIds : (c.linkedHabitId ? [c.linkedHabitId] : []);
          if (!currentIds.includes(habitId)) {
            return {
              ...c,
              linkedHabitIds: [...currentIds, habitId]
            };
          }
        }
        return c;
      });
      storage.saveChallenges(updated);
      return updated;
    });
    broadcastChange();
  }, [broadcastChange]);

  const unlinkHabitFromChallenge = useCallback((challengeId: string, habitId: string) => {
    setChallenges(prev => {
      const updated = prev.map(c => {
        if (c.id === challengeId) {
          const currentIds = Array.isArray(c.linkedHabitIds) ? c.linkedHabitIds : (c.linkedHabitId ? [c.linkedHabitId] : []);
          return {
            ...c,
            linkedHabitIds: currentIds.filter(id => id !== habitId)
          };
        }
        return c;
      });
      storage.saveChallenges(updated);
      return updated;
    });
    broadcastChange();
  }, [broadcastChange]);

  const getChallengeProgress = useCallback((challengeId: string) => {
    const challenge = challenges.find(c => c.id === challengeId);
    if (!challenge) {
      return { currentCount: 0, targetCount: 7, percent: 0, isCompleted: false };
    }

    if (challenge.status === 'completed') {
      return { currentCount: challenge.targetCount, targetCount: challenge.targetCount, percent: 100, isCompleted: true };
    }

    const linkedIds = Array.isArray(challenge.linkedHabitIds) && challenge.linkedHabitIds.length > 0
      ? challenge.linkedHabitIds
      : (challenge.linkedHabitId ? [challenge.linkedHabitId] : []);

    let count = 0;
    const daysToScan = challenge.type === 'weekly' ? 7 : 30;
    const today = new Date();

    for (let i = 0; i < daysToScan; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

      if (linkedIds.length > 0) {
        // Find which linked habits are scheduled on this day
        const scheduledLinked = habits.filter(h => linkedIds.includes(h.id) && isHabitScheduledForDate(h, dateStr));
        if (scheduledLinked.length > 0) {
          // A day counts if ALL scheduled linked habits for that day were done!
          const allScheduledDone = scheduledLinked.every(h =>
            logs.some(l => l.habitId === h.id && l.date === dateStr && l.completed)
          );
          if (allScheduledDone) count++;
        } else {
          // If none specifically scheduled for this day, check if any was completed
          const anyDone = logs.some(l => linkedIds.includes(l.habitId) && l.date === dateStr && l.completed);
          if (anyDone) count++;
        }
      } else {
        // Any habit checkin counts
        const done = logs.some(l => l.date === dateStr && l.completed);
        if (done) count++;
      }
    }

    const percent = Math.min(100, Math.round((count / Math.max(1, challenge.targetCount)) * 100));
    return {
      currentCount: count,
      targetCount: challenge.targetCount,
      percent,
      isCompleted: count >= challenge.targetCount
    };
  }, [challenges, habits, logs, isHabitScheduledForDate]);

  // Rules Management
  const addRule = useCallback((ruleText: string, category: string = 'Discipline') => {
    const newRule: PersonalRule = {
      id: `r-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      rule: ruleText.trim(),
      category: category.trim(),
      createdAt: new Date().toISOString(),
      active: true,
      order: rules.length
    };
    setRules(prev => {
      const updated = [...prev, newRule];
      storage.saveRules(updated);
      return updated;
    });
    sound.playClick(profile.soundEnabled);
    broadcastChange();
  }, [rules.length, profile.soundEnabled, broadcastChange]);

  const updateRule = useCallback((updatedRule: PersonalRule) => {
    setRules(prev => {
      const updated = prev.map(r => r.id === updatedRule.id ? updatedRule : r);
      storage.saveRules(updated);
      return updated;
    });
    broadcastChange();
  }, [broadcastChange]);

  const deleteRule = useCallback((ruleId: string) => {
    setRules(prev => {
      const updated = prev.filter(r => r.id !== ruleId);
      storage.saveRules(updated);
      return updated;
    });
    broadcastChange();
  }, [broadcastChange]);

  const toggleRuleActive = useCallback((ruleId: string) => {
    setRules(prev => {
      const updated = prev.map(r => r.id === ruleId ? { ...r, active: !r.active } : r);
      storage.saveRules(updated);
      return updated;
    });
    sound.playClick(profile.soundEnabled);
    broadcastChange();
  }, [profile.soundEnabled, broadcastChange]);

  // Battle Plan Tasks
  const addTask = useCallback((title: string, date: string = selectedDate, priority: 'high' | 'medium' | 'normal' = 'normal') => {
    const newTask: DailyTask = {
      id: `t-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title: title.trim(),
      date,
      completed: false,
      priority,
      createdAt: new Date().toISOString()
    };
    setTasks(prev => {
      const updated = [newTask, ...prev];
      storage.saveTasks(updated);
      return updated;
    });
    sound.playClick(profile.soundEnabled);
    broadcastChange();
  }, [selectedDate, profile.soundEnabled, broadcastChange]);

  const planTomorrowTask = useCallback((title: string, priority: 'high' | 'medium' | 'normal' = 'normal') => {
    const tomorrowStr = getTomorrowDateString();
    addTask(title, tomorrowStr, priority);
  }, [addTask]);

  const toggleTaskCompleted = useCallback((taskId: string) => {
    setTasks(prev => {
      const updated = prev.map(t => {
        if (t.id === taskId) {
          const nextCompleted = !t.completed;
          if (nextCompleted) {
            sound.playComplete(profile.soundEnabled);
            addXp(15);
          } else {
            sound.playClick(profile.soundEnabled);
          }
          return {
            ...t,
            completed: nextCompleted,
            completedAt: nextCompleted ? new Date().toISOString() : undefined
          };
        }
        return t;
      });
      storage.saveTasks(updated);
      return updated;
    });
    broadcastChange();
  }, [profile.soundEnabled, addXp, broadcastChange]);

  const deleteTask = useCallback((taskId: string) => {
    setTasks(prev => {
      const updated = prev.filter(t => t.id !== taskId);
      storage.saveTasks(updated);
      return updated;
    });
    broadcastChange();
  }, [broadcastChange]);

  const getTasksForDate = useCallback((dateStr: string) => {
    return tasks.filter(t => t.date === dateStr);
  }, [tasks]);

  // Insights Management
  const addInsight = useCallback((content: string, date: string = selectedDate) => {
    const newInsight: DailyInsight = {
      id: `ins-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      date,
      content: content.trim(),
      createdAt: new Date().toISOString()
    };
    setInsights(prev => {
      const updated = [newInsight, ...prev];
      storage.saveInsights(updated);
      return updated;
    });
    sound.playComplete(profile.soundEnabled);
    addXp(20);
    broadcastChange();
  }, [selectedDate, profile.soundEnabled, addXp, broadcastChange]);

  const deleteInsight = useCallback((insightId: string) => {
    setInsights(prev => {
      const updated = prev.filter(i => i.id !== insightId);
      storage.saveInsights(updated);
      return updated;
    });
    broadcastChange();
  }, [broadcastChange]);

  const getInsightsForDate = useCallback((dateStr: string) => {
    return insights.filter(i => i.date === dateStr);
  }, [insights]);

  // Reflections & Profile
  const saveDailyReflection = useCallback((reflectionData: Omit<DailyReflection, 'loggedAt'>) => {
    const entry: DailyReflection = {
      ...reflectionData,
      loggedAt: new Date().toISOString()
    };

    setReflections(prev => {
      const existingIdx = prev.findIndex(r => r.date === entry.date);
      let updated: DailyReflection[];
      if (existingIdx >= 0) {
        updated = [...prev];
        updated[existingIdx] = entry;
      } else {
        updated = [entry, ...prev];
        addXp(50);
      }
      storage.saveReflections(updated);
      return updated;
    });

    sound.playComplete(profile.soundEnabled);
    broadcastChange();
  }, [addXp, profile.soundEnabled, broadcastChange]);

  const updateProfile = useCallback((patch: Partial<UserProfile>) => {
    setProfile(prev => {
      const updated = { ...prev, ...patch };
      storage.saveProfile(updated);
      return updated;
    });
    broadcastChange();
  }, [broadcastChange]);

  const toggleSound = useCallback(() => {
    setProfile(prev => {
      const nextSoundEnabled = !prev.soundEnabled;
      const updated = { ...prev, soundEnabled: nextSoundEnabled };
      if (!nextSoundEnabled) {
        updated.ambientSound = 'off';
        sound.stopAll();
      }
      storage.saveProfile(updated);
      return updated;
    });
  }, []);

  const setAmbientSound = useCallback((ambient: 'off' | 'rain' | 'fire' | 'focus') => {
    setProfile(prev => {
      const updated = { ...prev, ambientSound: ambient };
      storage.saveProfile(updated);
      if (ambient === 'off') {
        sound.stopAmbient();
      } else {
        sound.playAmbient(ambient);
      }
      return updated;
    });
  }, []);

  const setBackgroundTheme = useCallback((themeId: string) => {
    setProfile(prev => {
      const updated = { ...prev, backgroundTheme: themeId };
      storage.saveProfile(updated);
      return updated;
    });
    broadcastChange();
  }, [broadcastChange]);

  const updateWallpaperSettings = useCallback((settings: { opacity?: number; blur?: number; grayscale?: boolean; customUrl?: string }) => {
    setProfile(prev => {
      const updated = {
        ...prev,
        wallpaperOpacity: settings.opacity !== undefined ? settings.opacity : prev.wallpaperOpacity,
        wallpaperBlur: settings.blur !== undefined ? settings.blur : prev.wallpaperBlur,
        wallpaperGrayscale: settings.grayscale !== undefined ? settings.grayscale : prev.wallpaperGrayscale,
        customWallpaperUrl: settings.customUrl !== undefined ? settings.customUrl : prev.customWallpaperUrl
      };
      storage.saveProfile(updated);
      return updated;
    });
    broadcastChange();
  }, [broadcastChange]);

  // Helpers & Stats
  const getHabitStatusForDate = useCallback((habitId: string, date: string) => {
    return logs.find(l => l.habitId === habitId && l.date === date);
  }, [logs]);

  const getCompletionRateForDate = useCallback((date: string): number => {
    const scheduled = habits.filter(h => isHabitScheduledForDate(h, date));
    if (scheduled.length === 0) return 0;
    const completed = logs.filter(l => l.date === date && l.completed && scheduled.some(h => h.id === l.habitId)).length;
    return Math.round((completed / scheduled.length) * 100);
  }, [habits, logs, isHabitScheduledForDate]);

  const getStreakForHabit = useCallback((habitId: string): { current: number; best: number } => {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return { current: 0, best: 0 };

    const habitLogs = logs
      .filter(l => l.habitId === habitId && l.completed)
      .map(l => l.date)
      .sort((a, b) => b.localeCompare(a)); // Descending order

    if (habitLogs.length === 0) return { current: 0, best: 0 };

    const todayStr = getTodayDateString();
    let currentStreak = 0;
    let checkDate = new Date();

    const isDoneToday = habitLogs.includes(todayStr);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;
    const isDoneYesterday = habitLogs.includes(yStr);

    if (isDoneToday || isDoneYesterday) {
      if (!isDoneToday) {
        checkDate = yesterday;
      }
      while (true) {
        const y = checkDate.getFullYear();
        const m = String(checkDate.getMonth() + 1).padStart(2, '0');
        const d = String(checkDate.getDate()).padStart(2, '0');
        const dStr = `${y}-${m}-${d}`;

        if (isHabitScheduledForDate(habit, dStr)) {
          if (habitLogs.includes(dStr)) {
            currentStreak++;
          } else {
            break;
          }
        }
        checkDate.setDate(checkDate.getDate() - 1);
      }
    }

    const uniqueDates = Array.from(new Set(habitLogs)).sort();
    let bestStreak = 0;
    let tempStreak = 0;
    let prevD: Date | null = null;

    for (const dStr of uniqueDates) {
      const [year, month, day] = dStr.split('-').map(Number);
      const curD = new Date(year, month - 1, day);

      if (!prevD) {
        tempStreak = 1;
      } else {
        const diffDays = Math.round((curD.getTime() - prevD.getTime()) / (1000 * 3600 * 24));
        if (diffDays <= 2) {
          tempStreak++;
        } else {
          tempStreak = 1;
        }
      }
      if (tempStreak > bestStreak) bestStreak = tempStreak;
      prevD = curD;
    }

    return { current: currentStreak, best: Math.max(bestStreak, currentStreak) };
  }, [habits, logs, isHabitScheduledForDate]);

  const getCategoryStats = useCallback(() => {
    const categories: HabitCategory[] = ['mind', 'body', 'craft', 'soul', 'vitality'];
    const result: Record<HabitCategory, { total: number; completed: number; rate: number }> = {
      mind: { total: 0, completed: 0, rate: 0 },
      body: { total: 0, completed: 0, rate: 0 },
      craft: { total: 0, completed: 0, rate: 0 },
      soul: { total: 0, completed: 0, rate: 0 },
      vitality: { total: 0, completed: 0, rate: 0 },
    };

    habits.filter(h => !h.archived).forEach(habit => {
      result[habit.category].total += 1;
    });

    logs.filter(l => l.completed).forEach(log => {
      const habit = habits.find(h => h.id === log.habitId && !h.archived);
      if (habit) {
        result[habit.category].completed += 1;
      }
    });

    categories.forEach(cat => {
      if (result[cat].total > 0) {
        result[cat].rate = Math.round((result[cat].completed / (result[cat].total * 30)) * 100);
      }
    });

    return result;
  }, [habits, logs]);

  const getYearStats = useCallback(() => {
    const startDate = profile.startDate || getTodayDateString();
    const [sYear, sMonth, sDay] = startDate.split('-').map(Number);
    const start = new Date(sYear, sMonth - 1, sDay);
    const today = new Date();

    const diffTime = today.getTime() - start.getTime();
    const daysElapsed = Math.max(1, Math.min(365, Math.floor(diffTime / (1000 * 3600 * 24)) + 1));
    const daysRemaining = Math.max(0, 365 - daysElapsed);

    const activeHabits = habits.filter(h => !h.archived);
    const completedLogs = logs.filter(l => l.completed && activeHabits.some(h => h.id === l.habitId));
    const totalCompletions = completedLogs.length;

    const logsByDate = new Map<string, number>();
    completedLogs.forEach(l => {
      logsByDate.set(l.date, (logsByDate.get(l.date) || 0) + 1);
    });

    let perfectDaysCount = 0;
    logsByDate.forEach((count, dateStr) => {
      const scheduledOnDate = activeHabits.filter(h => isHabitScheduledForDate(h, dateStr));
      if (scheduledOnDate.length > 0 && count >= scheduledOnDate.length) {
        perfectDaysCount++;
      }
    });

    let totalScheduledElapsed = 0;
    for (let i = 0; i < daysElapsed; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      totalScheduledElapsed += activeHabits.filter(h => isHabitScheduledForDate(h, dateStr)).length;
    }
    const expectedTotal = Math.max(1, totalScheduledElapsed);
    const yearCompletionRate = Math.min(100, Math.round((totalCompletions / expectedTotal) * 100));

    let currentOverallStreak = 0;
    let check = new Date();
    while (currentOverallStreak < 365) {
      const y = check.getFullYear();
      const m = String(check.getMonth() + 1).padStart(2, '0');
      const d = String(check.getDate()).padStart(2, '0');
      const dStr = `${y}-${m}-${d}`;
      const count = logsByDate.get(dStr) || 0;
      if (count > 0) {
        currentOverallStreak++;
        check.setDate(check.getDate() - 1);
      } else {
        if (currentOverallStreak === 0 && dStr === getTodayDateString()) {
          check.setDate(check.getDate() - 1);
          continue;
        }
        break;
      }
    }

    return {
      startDate,
      totalDays: 365,
      daysElapsed,
      daysRemaining,
      yearCompletionRate,
      perfectDaysCount,
      totalCompletions,
      currentOverallStreak
    };
  }, [profile.startDate, habits, logs, isHabitScheduledForDate]);

  // Data management
  const exportData = useCallback(() => storage.exportBackup(), []);

  const importData = useCallback((data: ExportData) => {
    const success = storage.importBackup(data);
    if (success) {
      setHabits(storage.getHabits());
      setLogs(storage.getLogs());
      setReflections(storage.getReflections());
      setProfile(storage.getProfile());
      setMilestones(storage.getMilestones());
      setGoals(storage.getGoals());
      setChallenges(storage.getChallenges());
      setRules(storage.getRules());
      setTasks(storage.getTasks());
      setInsights(storage.getInsights());
      broadcastChange();
    }
    return success;
  }, [broadcastChange]);

  const loadDemoData = useCallback(() => {
    const demo = storage.generateDemoHistory(45);
    setLogs(demo.logs);
    storage.saveLogs(demo.logs);

    setReflections(demo.reflections);
    storage.saveReflections(demo.reflections);

    addXp(demo.xpGained);
    sound.playLevelUp(profile.soundEnabled);
    confetti({ particleCount: 100, spread: 70 });
    broadcastChange();
  }, [addXp, profile.soundEnabled, broadcastChange]);

  const resetData = useCallback(() => {
    storage.resetAll();
    setHabits(storage.getHabits());
    setLogs([]);
    setReflections([]);
    setProfile(storage.getProfile());
    setMilestones(storage.getMilestones());
    setGoals(storage.getGoals());
    setChallenges(storage.getChallenges());
    setRules(storage.getRules());
    setTasks([]);
    setInsights([]);
    broadcastChange();
  }, [broadcastChange]);

  return (
    <HabitContext.Provider
      value={{
        habits,
        logs,
        reflections,
        profile,
        milestones,
        goals,
        challenges,
        rules,
        tasks,
        insights,
        selectedDate,
        setSelectedDate,
        levelInfo,
        activeReminderToast,
        dismissReminderToast,
        toggleHabitCompletion,
        updateHabitValue,
        addHabit,
        updateHabit,
        deleteHabit,
        moveHabit,
        reorderHabits,
        importHabitPack,
        isHabitScheduledForDate,
        addGoal,
        updateGoal,
        deleteGoal,
        toggleMilestoneGoalCompleted,
        linkHabitToGoal,
        unlinkHabitFromGoal,
        getGoalProgress,
        addChallenge,
        updateChallenge,
        deleteChallenge,
        toggleChallengeCompletion,
        linkHabitToChallenge,
        unlinkHabitFromChallenge,
        getChallengeProgress,
        addRule,
        updateRule,
        deleteRule,
        toggleRuleActive,
        addTask,
        planTomorrowTask,
        toggleTaskCompleted,
        deleteTask,
        getTasksForDate,
        addInsight,
        deleteInsight,
        getInsightsForDate,
        saveDailyReflection,
        updateProfile,
        getHabitStatusForDate,
        getCompletionRateForDate,
        getStreakForHabit,
        getCategoryStats,
        getYearStats,
        toggleSound,
        setAmbientSound,
        setBackgroundTheme,
        updateWallpaperSettings,
        exportData,
        importData,
        loadDemoData,
        resetData
      }}
    >
      {children}
    </HabitContext.Provider>
  );
};

export const useHabits = () => {
  const context = useContext(HabitContext);
  if (!context) {
    throw new Error('useHabits must be used within a HabitProvider');
  }
  return context;
};
