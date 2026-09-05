import type { Habit, HabitLogEntry, DailyReflection, UserProfile } from '../types';

export interface WeeklyInsightReport {
  timeframe: string;
  totalCompletions: number;
  totalScheduled: number;
  completionRate: number;
  perfectDays: number;
  strongestDay: { day: string; rate: number };
  weakestDay: { day: string; rate: number };
  topHabit: { title: string; count: number; totalPossible: number; rate: number } | null;
  strugglingHabit: { title: string; count: number; totalPossible: number; rate: number } | null;
  momentumScore: number; // 0-100
  momentumLabel: string;
  summary: string;
  tacticalAdvice: string;
}

export interface MonthlyInsightReport {
  timeframe: string;
  totalCompletions: number;
  totalScheduled: number;
  consistencyRate: number;
  perfectDaysRatio: { perfect: number; total: number; percent: number };
  bestStreak: number;
  sphereDistribution: { sphere: string; count: number; percent: number; color: string }[];
  disciplineGrade: { grade: string; title: string };
  summary: string;
  keyWin: string;
}

export interface YearlyInsightReport {
  daysElapsed: number;
  daysRemaining: number;
  totalCompletions: number;
  projectedAnnualCompletions: number;
  yearPacingRate: number; // percent of target
  archetype: { title: string; subtitle: string; icon: string; description: string };
  annualGrade: string;
  summary: string;
}

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// Default schedule check if none passed
const defaultIsHabitScheduled = (habit: Habit, dateStr: string): boolean => {
  if (!habit || habit.archived) return false;
  if (!dateStr) return true;
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  if (isNaN(date.getTime())) return true;
  const dayOfWeek = date.getDay();

  if (habit.frequency === 'daily') return true;
  if (habit.frequency === 'weekdays') return dayOfWeek >= 1 && dayOfWeek <= 5;
  if (habit.frequency === 'weekends') return dayOfWeek === 0 || dayOfWeek === 6;
  if (habit.frequency === 'custom_days' && Array.isArray(habit.customDays)) {
    return habit.customDays.includes(dayOfWeek);
  }
  return true;
};

export const generateWeeklyInsights = (
  habits: Habit[],
  logs: HabitLogEntry[],
  _reflections?: DailyReflection[],
  isHabitScheduled: (habit: Habit, dateStr: string) => boolean = defaultIsHabitScheduled
): WeeklyInsightReport => {
  const today = new Date();
  const weekLogs: HabitLogEntry[] = [];
  const dayStatsMap: Record<number, { completed: number; total: number }> = {
    0: { completed: 0, total: 0 },
    1: { completed: 0, total: 0 },
    2: { completed: 0, total: 0 },
    3: { completed: 0, total: 0 },
    4: { completed: 0, total: 0 },
    5: { completed: 0, total: 0 },
    6: { completed: 0, total: 0 }
  };

  const activeHabits = habits.filter(h => !h.archived);
  let perfectDays = 0;
  let totalScheduledWeek = 0;

  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const dateStr = `${y}-${m}-${day}`;
    const dayOfWeek = d.getDay();

    // Only count habits SCHEDULED for that specific day (e.g. excluding Saturday rest day)
    const scheduledToday = activeHabits.filter(h => isHabitScheduled(h, dateStr));
    totalScheduledWeek += scheduledToday.length;

    const dayCompletedLogs = logs.filter(
      l => l.date === dateStr && l.completed && scheduledToday.some(h => h.id === l.habitId)
    );

    weekLogs.push(...dayCompletedLogs);
    dayStatsMap[dayOfWeek].completed += dayCompletedLogs.length;
    dayStatsMap[dayOfWeek].total += scheduledToday.length;

    // A day is considered fully progressed / perfect if all scheduled habits are completed!
    if (scheduledToday.length > 0 && dayCompletedLogs.length >= scheduledToday.length) {
      perfectDays++;
    }
  }

  const completionRate = totalScheduledWeek > 0 
    ? Math.round((weekLogs.length / totalScheduledWeek) * 100)
    : (activeHabits.length === 0 ? 0 : 100);

  // Best & Worst day calculation
  let bestDayIndex = 1;
  let highestRate = -1;
  let worstDayIndex = 0;
  let lowestRate = 999;

  Object.entries(dayStatsMap).forEach(([dStr, stat]) => {
    const dIdx = Number(dStr);
    if (stat.total > 0) {
      const rate = stat.completed / stat.total;
      if (rate > highestRate) {
        highestRate = rate;
        bestDayIndex = dIdx;
      }
      if (rate < lowestRate) {
        lowestRate = rate;
        worstDayIndex = dIdx;
      }
    }
  });

  if (highestRate === -1) highestRate = 0;
  if (lowestRate === 999) lowestRate = 0;

  // Habit specific counts vs possible scheduled occurrences
  const habitCounts: Record<string, { completed: number; scheduled: number }> = {};
  activeHabits.forEach(h => {
    habitCounts[h.id] = { completed: 0, scheduled: 0 };
  });

  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    activeHabits.forEach(h => {
      if (isHabitScheduled(h, dateStr)) {
        habitCounts[h.id].scheduled += 1;
        const done = logs.some(l => l.habitId === h.id && l.date === dateStr && l.completed);
        if (done) habitCounts[h.id].completed += 1;
      }
    });
  }

  let topHabit: { title: string; count: number; totalPossible: number; rate: number } | null = null;
  let strugglingHabit: { title: string; count: number; totalPossible: number; rate: number } | null = null;

  for (const h of activeHabits) {
    const stat = habitCounts[h.id];
    if (stat && stat.scheduled > 0) {
      const rate = Math.round((stat.completed / stat.scheduled) * 100);
      const item = { title: h.title, count: stat.completed, totalPossible: stat.scheduled, rate };
      if (!topHabit || rate > topHabit.rate || (rate === topHabit.rate && stat.completed > topHabit.count)) {
        topHabit = item;
      }
      if (!strugglingHabit || rate < strugglingHabit.rate || (rate === strugglingHabit.rate && stat.completed < strugglingHabit.count)) {
        strugglingHabit = item;
      }
    }
  }

  let momentumLabel = 'Building Solid Baseline';
  if (completionRate >= 90) momentumLabel = '⚡ Unstoppable High-Velocity Surge';
  else if (completionRate >= 70) momentumLabel = '🔥 Strong Disciplined Momentum';
  else if (completionRate >= 45) momentumLabel = '🛡️ Steady Foundation';
  else momentumLabel = '⚠️ Resistance Encountered — Recalibrate';

  const summary = completionRate >= 75
    ? `Exceptional 7-day velocity. You executed ${weekLogs.length} of ${totalScheduledWeek} scheduled check-ins (${completionRate}%) with ${perfectDays} flawless days. Your highest energy peak occurred on ${DAY_NAMES[bestDayIndex]}.`
    : `Recorded ${weekLogs.length} of ${totalScheduledWeek} scheduled check-ins (${completionRate}% execution). ${DAY_NAMES[worstDayIndex]} saw lower adherence due to fatigue or scheduling friction.`;

  const strugglingName = strugglingHabit ? strugglingHabit.title : 'your core habits';
  const tacticalAdvice = completionRate >= 75
    ? `Maintain strict morning anchors. Protect your sleep schedule to prevent weekend energy dips.`
    : `Reduce initial friction on ${strugglingName}. Pre-commit tomorrow's battle plan the night before.`;

  return {
    timeframe: 'Past 7 Days (Weekly Cadence)',
    totalCompletions: weekLogs.length,
    totalScheduled: totalScheduledWeek,
    completionRate,
    perfectDays,
    strongestDay: { day: DAY_NAMES[bestDayIndex], rate: Math.round(highestRate * 100) },
    weakestDay: { day: DAY_NAMES[worstDayIndex], rate: Math.round(lowestRate * 100) },
    topHabit,
    strugglingHabit,
    momentumScore: completionRate,
    momentumLabel,
    summary,
    tacticalAdvice
  };
};

export const generateMonthlyInsights = (
  habits: Habit[],
  logs: HabitLogEntry[],
  _reflections?: DailyReflection[],
  isHabitScheduled: (habit: Habit, dateStr: string) => boolean = defaultIsHabitScheduled
): MonthlyInsightReport => {
  const today = new Date();
  const monthLogs: HabitLogEntry[] = [];
  const activeHabits = habits.filter(h => !h.archived);
  let perfectDays = 0;
  let totalScheduledMonth = 0;

  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const dateStr = `${y}-${m}-${day}`;

    const scheduledToday = activeHabits.filter(h => isHabitScheduled(h, dateStr));
    totalScheduledMonth += scheduledToday.length;

    const dayCompleted = logs.filter(
      l => l.date === dateStr && l.completed && scheduledToday.some(h => h.id === l.habitId)
    );
    monthLogs.push(...dayCompleted);

    if (scheduledToday.length > 0 && dayCompleted.length >= scheduledToday.length) {
      perfectDays++;
    }
  }

  const consistencyRate = totalScheduledMonth > 0 
    ? Math.round((monthLogs.length / totalScheduledMonth) * 100)
    : 0;

  // Sphere distribution
  const sphereCounts: Record<string, number> = { mind: 0, body: 0, craft: 0, soul: 0, vitality: 0 };
  const sphereColors: Record<string, string> = {
    mind: '#F59E0B',
    body: '#E63946',
    craft: '#06B6D4',
    soul: '#A855F7',
    vitality: '#10B981'
  };

  monthLogs.forEach(l => {
    const h = activeHabits.find(habit => habit.id === l.habitId);
    if (h && sphereCounts[h.category] !== undefined) {
      sphereCounts[h.category] += 1;
    }
  });

  const totalSphereHits = Math.max(1, monthLogs.length);
  const sphereDistribution = Object.entries(sphereCounts).map(([cat, count]) => ({
    sphere: cat.charAt(0).toUpperCase() + cat.slice(1),
    count,
    percent: Math.round((count / totalSphereHits) * 100),
    color: sphereColors[cat] || '#E63946'
  }));

  let grade = { grade: 'B', title: 'Solid Practitioner' };
  if (consistencyRate >= 92) grade = { grade: 'S+', title: 'Ascendant Paragon' };
  else if (consistencyRate >= 80) grade = { grade: 'S', title: 'Iron Sovereign' };
  else if (consistencyRate >= 65) grade = { grade: 'A', title: 'Disciplined Warrior' };

  const summary = `Over the last 30 days, you achieved ${monthLogs.length} of ${totalScheduledMonth} scheduled habit check-ins with an overall consistency index of ${consistencyRate}%. You recorded ${perfectDays} flawless 100% days.`;
  const keyWin = perfectDays > 5 
    ? `${perfectDays} flawless days proves your high-end capability. Focus on elevating your baseline consistency.`
    : `Consistent tracking initiated. Momentum is compound interest for willpower.`;

  return {
    timeframe: 'Past 30 Days (Monthly Crucible)',
    totalCompletions: monthLogs.length,
    totalScheduled: totalScheduledMonth,
    consistencyRate,
    perfectDaysRatio: { perfect: perfectDays, total: 30, percent: Math.round((perfectDays / 30) * 100) },
    bestStreak: Math.min(30, Math.max(perfectDays, Math.round(consistencyRate / 3.3))),
    sphereDistribution,
    disciplineGrade: grade,
    summary,
    keyWin
  };
};

export const generateYearlyInsights = (
  profile: UserProfile,
  habits: Habit[],
  logs: HabitLogEntry[],
  isHabitScheduled: (habit: Habit, dateStr: string) => boolean = defaultIsHabitScheduled
): YearlyInsightReport => {
  const startDate = profile.startDate || '2026-08-15';
  const [sY, sM, sD] = startDate.split('-').map(Number);
  const start = new Date(sY, sM - 1, sD);
  const today = new Date();

  const diffTime = today.getTime() - start.getTime();
  const daysElapsed = Math.max(1, Math.min(365, Math.floor(diffTime / (1000 * 3600 * 24)) + 1));
  const daysRemaining = Math.max(0, 365 - daysElapsed);

  const activeHabits = habits.filter(h => !h.archived);
  const completedLogs = logs.filter(l => l.completed && activeHabits.some(h => h.id === l.habitId));
  const totalCompletions = completedLogs.length;

  // Calculate real scheduled count across the elapsed days
  let totalScheduledElapsed = 0;
  for (let i = 0; i < daysElapsed; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    totalScheduledElapsed += activeHabits.filter(h => isHabitScheduled(h, dateStr)).length;
  }

  const averageDailyCompletions = totalCompletions / daysElapsed;
  const projectedAnnualCompletions = Math.round(totalCompletions + (averageDailyCompletions * daysRemaining));

  // Average scheduled per day projected across 365
  const avgScheduledPerDay = daysElapsed > 0 ? (totalScheduledElapsed / daysElapsed) : activeHabits.length;
  const targetAnnualCompletions = Math.round(avgScheduledPerDay * 365);

  const yearPacingRate = targetAnnualCompletions > 0 
    ? Math.min(100, Math.round((projectedAnnualCompletions / targetAnnualCompletions) * 100))
    : 0;

  let archetype = {
    title: 'The Stoic Architect',
    subtitle: 'Relentless systematic builder',
    icon: 'Brain',
    description: 'You prioritize structural routine and mental fortitude over fleeting bursts of motivation.'
  };

  if (profile.level >= 10) {
    archetype = {
      title: 'The Iron Sovereign',
      subtitle: 'Master of Unyielding Will',
      icon: 'Shield',
      description: 'Your consistency has transcended conscious effort and become second nature.'
    };
  } else if (profile.level >= 5) {
    archetype = {
      title: 'The Forge Vanguard',
      subtitle: 'Relentless Daily Warrior',
      icon: 'Flame',
      description: 'You attack resistance with ruthless discipline and unwavering focus.'
    };
  }

  let annualGrade = 'A';
  if (yearPacingRate >= 90) annualGrade = 'S+';
  else if (yearPacingRate >= 75) annualGrade = 'S';
  else if (yearPacingRate >= 50) annualGrade = 'B';

  const summary = `Day ${daysElapsed} of 365. You have forged ${totalCompletions} total check-ins out of ${totalScheduledElapsed} scheduled habits (${Math.round((totalCompletions / Math.max(1, totalScheduledElapsed)) * 100)}% execution). On current pacing, you are on track to achieve ~${projectedAnnualCompletions} habit executions by the end of your 1-year forge.`;

  return {
    daysElapsed,
    daysRemaining,
    totalCompletions,
    projectedAnnualCompletions,
    yearPacingRate,
    archetype,
    annualGrade,
    summary
  };
};
