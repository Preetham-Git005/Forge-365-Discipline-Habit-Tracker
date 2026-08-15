import React, { useState, useMemo } from 'react';
import { useHabits } from '../context/HabitContext';
import { formatDateDisplay } from '../utils/storage';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  Radar, 
  BarChart, 
  Bar 
} from 'recharts';
import { 
  Zap, 
  TrendingUp, 
  Flame, 
  Calendar, 
  ShieldCheck, 
  Activity, 
  BookOpen 
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { habits, logs, reflections, levelInfo, getCategoryStats, getStreakForHabit } = useHabits();
  const [timeRange, setTimeRange] = useState<7 | 14 | 30>(14);

  const activeHabits = useMemo(() => habits.filter(h => !h.archived), [habits]);

  // Completion Trend Data for Recharts AreaChart
  const trendData = useMemo(() => {
    const data = [];
    const today = new Date();

    for (let i = timeRange - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;

      const completed = logs.filter(
        l => l.date === dateStr && l.completed && activeHabits.some(h => h.id === l.habitId)
      ).length;

      const rate = activeHabits.length > 0 ? Math.round((completed / activeHabits.length) * 100) : 0;

      data.push({
        dateStr,
        label: d.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' }),
        completionRate: rate,
        completedCount: completed,
        total: activeHabits.length
      });
    }

    return data;
  }, [timeRange, logs, activeHabits]);

  // Category Radar Chart Data
  const categoryData = useMemo(() => {
    const stats = getCategoryStats();
    return [
      { subject: 'Mind', value: stats.mind.completed, fullMark: Math.max(10, stats.mind.completed * 1.2) },
      { subject: 'Body', value: stats.body.completed, fullMark: Math.max(10, stats.body.completed * 1.2) },
      { subject: 'Craft', value: stats.craft.completed, fullMark: Math.max(10, stats.craft.completed * 1.2) },
      { subject: 'Soul', value: stats.soul.completed, fullMark: Math.max(10, stats.soul.completed * 1.2) },
      { subject: 'Vitality', value: stats.vitality.completed, fullMark: Math.max(10, stats.vitality.completed * 1.2) },
    ];
  }, [getCategoryStats]);

  // Day of Week Distribution (Mon to Sun)
  const dayOfWeekData = useMemo(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const counts = [0, 0, 0, 0, 0, 0, 0];

    logs.filter(l => l.completed).forEach(log => {
      const [y, m, d] = log.date.split('-').map(Number);
      const date = new Date(y, m - 1, d);
      if (!isNaN(date.getTime())) {
        counts[date.getDay()] += 1;
      }
    });

    return days.map((dayName, idx) => ({
      day: dayName,
      completions: counts[idx]
    }));
  }, [logs]);

  // Discipline Index & Grade Calculation
  const averageRecentRate = useMemo(() => {
    if (trendData.length === 0) return 0;
    const sum = trendData.reduce((acc, curr) => acc + curr.completionRate, 0);
    return Math.round(sum / trendData.length);
  }, [trendData]);

  const disciplineGrade = useMemo(() => {
    if (averageRecentRate >= 95) return { grade: 'S+', title: 'Ascendant Paragon', color: 'text-gold' };
    if (averageRecentRate >= 85) return { grade: 'S', title: 'Iron Sovereign', color: 'text-gold' };
    if (averageRecentRate >= 70) return { grade: 'A', title: 'Disciplined Warrior', color: 'text-crimson' };
    if (averageRecentRate >= 50) return { grade: 'B', title: 'Steady Practitioner', color: 'text-cyan-400' };
    return { grade: 'C', title: 'Novice in Training', color: 'text-slate-400' };
  }, [averageRecentRate]);

  const totalCompletions = logs.filter(l => l.completed).length;

  return (
    <div className="space-y-6">
      
      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Discipline Grade Card */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-obsidian-900 via-obsidian-850 to-obsidian-900 border border-white/10 backdrop-blur-xl shadow-obsidian-card flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono uppercase text-slate-400">
              <ShieldCheck className="w-4 h-4 text-gold" />
              <span>Discipline Index</span>
            </div>
            <div className="text-xl font-cinematic font-bold text-white mt-1">
              {disciplineGrade.title}
            </div>
            <p className="text-xs text-slate-400 font-mono mt-1">
              {averageRecentRate}% Consistency ({timeRange}d avg)
            </p>
          </div>
          <div className={`text-4xl sm:text-5xl font-cinematic font-black ${disciplineGrade.color} drop-shadow-lg`}>
            {disciplineGrade.grade}
          </div>
        </div>

        {/* Level Progression Card */}
        <div className="p-6 rounded-2xl bg-obsidian-900/80 border border-white/10 backdrop-blur-xl shadow-obsidian-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-slate-400">Level Progression</span>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-gold/20 text-gold border border-gold/40">
              Level {levelInfo.level}
            </span>
          </div>
          <div className="text-xl font-cinematic font-bold text-white mt-1">
            {levelInfo.title}
          </div>
          <div className="w-full h-2 bg-obsidian-950 rounded-full overflow-hidden mt-3 border border-white/5">
            <div 
              className="h-full bg-gradient-to-r from-gold to-crimson rounded-full transition-all duration-500"
              style={{ width: `${levelInfo.progressPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] font-mono text-slate-400 mt-1.5">
            <span>Progress</span>
            <span className="text-gold font-bold">{levelInfo.progressPercent}%</span>
          </div>
        </div>

        {/* Total Discipline Volume */}
        <div className="p-6 rounded-2xl bg-obsidian-900/80 border border-white/10 backdrop-blur-xl shadow-obsidian-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-slate-400">Total Check-Ins</span>
            <Zap className="w-4 h-4 text-crimson" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-white mt-1">
            {totalCompletions}
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Across {habits.length} active daily disciplines
          </p>
        </div>

      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Trend Area Chart (8 Columns) */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-obsidian-900/90 border border-white/10 backdrop-blur-2xl shadow-obsidian-card space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-crimson" />
                <h3 className="font-cinematic text-lg font-bold text-white">Execution Trendline</h3>
              </div>
              <p className="text-xs text-slate-400">Daily habit completion rate over time</p>
            </div>

            {/* Time Filter Stepper */}
            <div className="flex items-center space-x-1 p-1 rounded-xl bg-obsidian-950 border border-white/10">
              <button
                type="button"
                onClick={() => setTimeRange(7)}
                className={`px-3 py-1 rounded-lg text-xs font-mono transition-colors ${
                  timeRange === 7 ? 'bg-crimson text-white font-bold shadow-glow-crimson' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                7D
              </button>
              <button
                type="button"
                onClick={() => setTimeRange(14)}
                className={`px-3 py-1 rounded-lg text-xs font-mono transition-colors ${
                  timeRange === 14 ? 'bg-crimson text-white font-bold shadow-glow-crimson' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                14D
              </button>
              <button
                type="button"
                onClick={() => setTimeRange(30)}
                className={`px-3 py-1 rounded-lg text-xs font-mono transition-colors ${
                  timeRange === 30 ? 'bg-crimson text-white font-bold shadow-glow-crimson' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                30D
              </button>
            </div>
          </div>

          <div className="h-64 sm:h-72 w-full pt-4 min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="crimsonGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E63946" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#E63946" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="label" 
                  stroke="#64748b" 
                  fontSize={11} 
                  tickLine={false}
                  axisLine={{ stroke: '#334155' }}
                />
                <YAxis 
                  stroke="#64748b" 
                  fontSize={11} 
                  domain={[0, 100]} 
                  tickFormatter={(val) => `${val}%`}
                  tickLine={false}
                  axisLine={{ stroke: '#334155' }}
                />
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="p-3 rounded-xl bg-obsidian-950/95 border border-white/20 shadow-2xl backdrop-blur-xl text-xs font-mono space-y-1">
                          <div className="text-slate-400 font-bold">{formatDateDisplay(data.dateStr)}</div>
                          <div className="text-crimson font-bold text-sm">
                            {data.completionRate}% Done ({data.completedCount}/{data.total})
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="completionRate" 
                  stroke="#E63946" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#crimsonGradient)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Radar Balance (4 Columns) */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-obsidian-900/90 border border-white/10 backdrop-blur-2xl shadow-obsidian-card space-y-4">
          <div>
            <div className="flex items-center space-x-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              <h3 className="font-cinematic text-lg font-bold text-white">Discipline Spheres</h3>
            </div>
            <p className="text-xs text-slate-400">Total volume across life pillars</p>
          </div>

          <div className="h-64 sm:h-72 w-full flex items-center justify-center min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={categoryData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="subject" stroke="#94a3b8" fontSize={11} />
                <Radar 
                  name="Completions" 
                  dataKey="value" 
                  stroke="#38BDF8" 
                  fill="#38BDF8" 
                  fillOpacity={0.35} 
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Bottom Section: Day-of-Week Distribution & Habit Streak Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Day of Week Consistency (6 Columns) */}
        <div className="lg:col-span-6 p-6 rounded-2xl bg-obsidian-900/90 border border-white/10 backdrop-blur-2xl shadow-obsidian-card space-y-4">
          <div>
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-gold" />
              <h3 className="font-cinematic text-lg font-bold text-white">Weekly Rhythm</h3>
            </div>
            <p className="text-xs text-slate-400">Completions recorded by weekday</p>
          </div>

          <div className="h-56 w-full pt-2 min-h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dayOfWeekData}>
                <XAxis dataKey="day" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div className="p-2 rounded-lg bg-obsidian-950 border border-white/15 text-xs font-mono">
                          <span className="text-gold font-bold">{d.day}:</span> {d.completions} check-ins
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="completions" fill="#D4AF37" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Habit Streak Table (6 Columns) */}
        <div className="lg:col-span-6 p-6 rounded-2xl bg-obsidian-900/90 border border-white/10 backdrop-blur-2xl shadow-obsidian-card space-y-4">
          <div>
            <div className="flex items-center space-x-2">
              <Flame className="w-4 h-4 text-crimson" />
              <h3 className="font-cinematic text-lg font-bold text-white">Streak Standings</h3>
            </div>
            <p className="text-xs text-slate-400">Current uninterrupted momentum</p>
          </div>

          <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
            {activeHabits.map(habit => {
              const streak = getStreakForHabit(habit.id);
              return (
                <div 
                  key={habit.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-obsidian-950/60 border border-white/5 hover:border-white/15 transition-colors text-xs font-mono"
                >
                  <div className="flex items-center space-x-2 truncate max-w-[65%]">
                    <span className="w-2 h-2 rounded-full bg-crimson" />
                    <span className="text-slate-200 font-medium truncate">{habit.title}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-right">
                    <span className="text-crimson font-bold flex items-center space-x-1">
                      <Flame className="w-3 h-3" />
                      <span>{streak.current}d</span>
                    </span>
                    <span className="text-slate-500 text-[11px]">
                      Best: {streak.best}d
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Recent Evening Reflections */}
      {reflections.length > 0 && (
        <div className="p-6 rounded-2xl bg-obsidian-900/90 border border-white/10 backdrop-blur-2xl shadow-obsidian-card space-y-4">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-4 h-4 text-emerald-400" />
            <h3 className="font-cinematic text-lg font-bold text-white">Recent Stoic Audits</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reflections.slice(0, 3).map(r => (
              <div key={r.date} className="p-4 rounded-xl bg-obsidian-950/70 border border-white/5 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-crimson font-bold">{formatDateDisplay(r.date)}</span>
                  <span className="text-gold">{'★'.repeat(r.rating)}</span>
                </div>
                <p className="text-xs text-slate-300 italic line-clamp-3">
                  "{r.reflection}"
                </p>
                {r.highlight && (
                  <div className="text-[11px] text-emerald-400/90 truncate font-mono">
                    Win: {r.highlight}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
