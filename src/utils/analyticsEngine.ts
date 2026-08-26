import type { Habit, HabitLogEntry, DailyReflection, UserProfile } from '../types';

export interface WeeklyInsightReport {
  timeframe: string;
  totalCompletions: number;
  completionRate: number;
  perfectDays: number;
  strongestDay: { day: string; rate: number };
  weakestDay: { day: string; rate: number };
  topHabit: { title: string; count: number } | null;
  strugglingHabit: { title: string; count: number } | null;
  momentumScore: number; // 0-100
  momentumLabel: string;
  summary: string;
  tacticalAdvice: string;
}

export interface MonthlyInsightReport {
  timeframe: string;
  totalCompletions: number;
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

export const generateWeeklyInsights = (
  habits: Habit[],
  logs: HabitLogEntry[],
  _reflections?: DailyReflection[]
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

  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const dateStr = `${y}-${m}-${day}`;
    const dayOfWeek = d.getDay();

    const dayCompletedLogs = logs.filter(
      l => l.date === dateStr && l.completed && activeHabits.some(h => h.id === l.habitId)
    );

    weekLogs.push(...dayCompletedLogs);
    dayStatsMap[dayOfWeek].completed += dayCompletedLogs.length;
    dayStatsMap[dayOfWeek].total += activeHabits.length;

    if (activeHabits.length > 0 && dayCompletedLogs.length >= activeHabits.length) {
      perfectDays++;
    }
  }

  const totalPossible = Math.max(1, activeHabits.length * 7);
  const completionRate = Math.round((weekLogs.length / totalPossible) * 100);

  // Best & Worst day calculation
  let bestDayIndex = 1;
  let highestRate = -1;
  let worstDayIndex = 0;
  let lowestRate = 999;

  Object.entries(dayStatsMap).forEach(([dStr, stat]) => {
    const dIdx = Number(dStr);
    const rate = stat.total > 0 ? stat.completed / stat.total : 0;
    if (rate > highestRate) {
      highestRate = rate;
      bestDayIndex = dIdx;
    }
    if (rate < lowestRate) {
      lowestRate = rate;
      worstDayIndex = dIdx;
    }
  });

  // Habit specific counts
  const habitCounts: Record<string, number> = {};
  weekLogs.forEach(l => {
    habitCounts[l.habitId] = (habitCounts[l.habitId] || 0) + 1;
  });

  let topHabit: { title: string; count: number } | null = null;
  let strugglingHabit: { title: string; count: number } | null = null;

  activeHabits.forEach(h => {
    const c = habitCounts[h.id] || 0;
    if (!topHabit || c > topHabit.count) {
      topHabit = { title: h.title, count: c };
    }
    if (!strugglingHabit || c < strugglingHabit.count) {
      strugglingHabit = { title: h.title, count: c };
    }
  });

  let momentumLabel = 'Building Solid Baseline';
  if (completionRate >= 90) momentumLabel = '⚡ Unstoppable High-Velocity Surge';
  else if (completionRate >= 70) momentumLabel = '🔥 Strong Disciplined Momentum';
  else if (completionRate >= 45) momentumLabel = '🛡️ Steady Foundation';
  else momentumLabel = '⚠️ Resistance Encountered — Recalibrate';

  const summary = completionRate >= 75
    ? `Exceptional 7-day velocity. You executed ${weekLogs.length} total habit check-ins with ${perfectDays} flawless days. Your highest energy peak occurred on ${DAY_NAMES[bestDayIndex]}.`
    : `Recorded ${weekLogs.length} completions across the week (${completionRate}% execution). ${DAY_NAMES[worstDayIndex]} saw lower adherence due to fatigue or scheduling friction.`;

  const strugglingName = strugglingHabit ? (strugglingHabit as { title: string; count: number }).title : 'your core habits';
  const tacticalAdvice = completionRate >= 75
    ? `Maintain strict morning anchors. Protect your sleep schedule to prevent weekend energy dips.`
    : `Reduce initial friction on ${strugglingName}. Pre-commit tomorrow's battle plan the night before.`;

  return {
    timeframe: 'Past 7 Days (Weekly Cadence)',
    totalCompletions: weekLogs.length,
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
  _reflections?: DailyReflection[]
): MonthlyInsightReport => {
  const today = new Date();
  const monthLogs: HabitLogEntry[] = [];
  const activeHabits = habits.filter(h => !h.archived);
  let perfectDays = 0;

  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const dateStr = `${y}-${m}-${day}`;

    const dayCompleted = logs.filter(
      l => l.date === dateStr && l.completed && activeHabits.some(h => h.id === l.habitId)
    );
    monthLogs.push(...dayCompleted);

    if (activeHabits.length > 0 && dayCompleted.length >= activeHabits.length) {
      perfectDays++;
    }
  }

  const totalPossible = Math.max(1, activeHabits.length * 30);
  const consistencyRate = Math.round((monthLogs.length / totalPossible) * 100);

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

  const summary = `Over the last 30 days, you achieved ${monthLogs.length} total habit check-ins with an overall consistency index of ${consistencyRate}%. You recorded ${perfectDays} flawless 100% days.`;
  const keyWin = perfectDays > 5 
    ? `${perfectDays} flawless days proves your high-end capability. Focus on elevating your baseline consistency.`
    : `Consistent tracking initiated. Momentum is compound interest for willpower.`;

  return {
    timeframe: 'Past 30 Days (Monthly Crucible)',
    totalCompletions: monthLogs.length,
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
  logs: HabitLogEntry[]
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

  const averageDailyCompletions = totalCompletions / daysElapsed;
  const projectedAnnualCompletions = Math.round(totalCompletions + (averageDailyCompletions * daysRemaining));

  const targetAnnualCompletions = activeHabits.length * 365;
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

  const summary = `Day ${daysElapsed} of 365. You have forged ${totalCompletions} total check-ins. On current pacing, you are on track to achieve ~${projectedAnnualCompletions} habit executions by the end of your 1-year forge.`;

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
