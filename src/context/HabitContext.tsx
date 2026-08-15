import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import type { Habit, HabitLogEntry, DailyReflection, UserProfile, Milestone, HabitCategory } from '../types';
import { storage, getTodayDateString, SYNC_CHANNEL_NAME } from '../utils/storage';
import type { ExportData } from '../utils/storage';
import { calculateLevelInfo } from '../utils/levelSystem';
import type { LevelInfo } from '../utils/levelSystem';
import { sound } from '../utils/sound';
import confetti from 'canvas-confetti';

interface HabitContextType {
  habits: Habit[];
  logs: HabitLogEntry[];
  reflections: DailyReflection[];
  profile: UserProfile;
  milestones: Milestone[];
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  levelInfo: LevelInfo;
  
  // Actions
  toggleHabitCompletion: (habitId: string, date?: string) => void;
  updateHabitValue: (habitId: string, value: number, date?: string) => void;
  addHabit: (habit: Omit<Habit, 'id' | 'createdAt'>, position?: 'top' | 'bottom') => void;
  updateHabit: (habit: Habit) => void;
  deleteHabit: (habitId: string) => void;
  moveHabit: (habitId: string, direction: 'up' | 'down') => void;
  reorderHabits: (newHabits: Habit[]) => void;
  importHabitPack: (habits: Omit<Habit, 'id' | 'createdAt'>[]) => void;
  
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
  const [selectedDate, setSelectedDate] = useState<string>(getTodayDateString());

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

        // Check if all habits are completed today for a perfect day celebration!
        const activeHabits = habits.filter(h => !h.archived);
        const completedCountToday = updatedLogs.filter(
          l => l.date === date && l.completed && activeHabits.some(h => h.id === l.habitId)
        ).length;

        if (completedCountToday === activeHabits.length && activeHabits.length > 0) {
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
  }, [habits, selectedDate, profile.soundEnabled, addXp, broadcastChange]);

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

  // Habit management with Ordering
  const addHabit = useCallback((newHabitData: Omit<Habit, 'id' | 'createdAt'>, position: 'top' | 'bottom' = 'top') => {
    const newHabit: Habit = {
      ...newHabitData,
      id: `h-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString()
    };

    setHabits(prev => {
      const updated = position === 'top' ? [newHabit, ...prev] : [...prev, newHabit];
      storage.saveHabits(updated);
      return updated;
    });

    sound.playClick(profile.soundEnabled);
    broadcastChange();
  }, [profile.soundEnabled, broadcastChange]);

  const updateHabit = useCallback((updatedHabit: Habit) => {
    setHabits(prev => {
      const updated = prev.map(h => h.id === updatedHabit.id ? updatedHabit : h);
      storage.saveHabits(updated);
      return updated;
    });
    broadcastChange();
  }, [broadcastChange]);

  const deleteHabit = useCallback((habitId: string) => {
    setHabits(prev => {
      const updated = prev.filter(h => h.id !== habitId);
      storage.saveHabits(updated);
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
      const updated = [...createdHabits, ...prev]; // Place imported pack at top
      storage.saveHabits(updated);
      return updated;
    });

    sound.playLevelUp(profile.soundEnabled);
    confetti({ particleCount: 50, spread: 60 });
    broadcastChange();
  }, [profile.soundEnabled, broadcastChange]);

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
    const active = habits.filter(h => !h.archived);
    if (active.length === 0) return 0;
    const completed = logs.filter(l => l.date === date && l.completed && active.some(h => h.id === l.habitId)).length;
    return Math.round((completed / active.length) * 100);
  }, [habits, logs]);

  const getStreakForHabit = useCallback((habitId: string): { current: number; best: number } => {
    const habitLogs = logs
      .filter(l => l.habitId === habitId && l.completed)
      .map(l => l.date)
      .sort((a, b) => b.localeCompare(a)); // Descending order

    if (habitLogs.length === 0) return { current: 0, best: 0 };

    const todayStr = getTodayDateString();
    let currentStreak = 0;
    let checkDate = new Date();

    // Check if done today or yesterday
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

        if (habitLogs.includes(dStr)) {
          currentStreak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }
    }

    // Calculate all-time best streak
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
        if (diffDays === 1) {
          tempStreak++;
        } else if (diffDays > 1) {
          tempStreak = 1;
        }
      }
      if (tempStreak > bestStreak) bestStreak = tempStreak;
      prevD = curD;
    }

    return { current: currentStreak, best: Math.max(bestStreak, currentStreak) };
  }, [logs]);

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

    // Calculate perfect days
    const logsByDate = new Map<string, number>();
    completedLogs.forEach(l => {
      logsByDate.set(l.date, (logsByDate.get(l.date) || 0) + 1);
    });

    let perfectDaysCount = 0;
    logsByDate.forEach((count) => {
      if (activeHabits.length > 0 && count >= activeHabits.length) {
        perfectDaysCount++;
      }
    });

    const expectedTotal = Math.max(1, daysElapsed * activeHabits.length);
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
  }, [profile.startDate, habits, logs]);

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
        selectedDate,
        setSelectedDate,
        levelInfo,
        toggleHabitCompletion,
        updateHabitValue,
        addHabit,
        updateHabit,
        deleteHabit,
        moveHabit,
        reorderHabits,
        importHabitPack,
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
