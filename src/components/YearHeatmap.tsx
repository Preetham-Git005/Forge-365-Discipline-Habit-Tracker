import React, { useState, useMemo } from 'react';
import { useHabits } from '../context/HabitContext';
import { formatDateDisplay, getTodayDateString } from '../utils/storage';
import { 
  Flame, 
  Trophy, 
  Calendar, 
  ShieldCheck, 
  Sparkles, 
  ArrowUpRight,
  Info
} from 'lucide-react';

export const YearHeatmap: React.FC = () => {
  const { profile, habits, logs, reflections, setSelectedDate } = useHabits();
  const [hoveredDay, setHoveredDay] = useState<{
    dateStr: string;
    total: number;
    completed: number;
    rate: number;
    reflection?: string;
  } | null>(null);

  const activeHabits = useMemo(() => habits.filter(h => !h.archived), [habits]);
  const todayStr = getTodayDateString();

  // Generate 365 days from start date
  const yearDays = useMemo(() => {
    const startDateStr = profile.startDate || todayStr;
    const [sYear, sMonth, sDay] = startDateStr.split('-').map(Number);
    const start = new Date(sYear, sMonth - 1, sDay);
    
    // Align to the previous Sunday or Monday for clean 7-row columns
    const dayOfWeek = start.getDay(); // 0 = Sunday
    const alignedStart = new Date(start);
    alignedStart.setDate(start.getDate() - dayOfWeek);

    const days = [];
    const totalDaysToRender = 371; // 53 weeks * 7 days to cover full year nicely

    for (let i = 0; i < totalDaysToRender; i++) {
      const d = new Date(alignedStart);
      d.setDate(alignedStart.getDate() + i);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;

      const completedCount = logs.filter(
        l => l.date === dateStr && l.completed && activeHabits.some(h => h.id === l.habitId)
      ).length;

      const rate = activeHabits.length > 0 ? Math.round((completedCount / activeHabits.length) * 100) : 0;
      const ref = reflections.find(r => r.date === dateStr);

      days.push({
        date: d,
        dateStr,
        dayOfWeek: d.getDay(),
        month: d.getMonth(),
        monthName: d.toLocaleDateString('en-US', { month: 'short' }),
        dayOfMonth: d.getDate(),
        completedCount,
        totalHabits: activeHabits.length,
        rate,
        isToday: dateStr === todayStr,
        isFuture: dateStr > todayStr,
        reflection: ref?.reflection
      });
    }

    return days;
  }, [profile.startDate, todayStr, logs, activeHabits, reflections]);

  // Group into 53 weeks
  const weeks = useMemo(() => {
    const result = [];
    for (let i = 0; i < yearDays.length; i += 7) {
      result.push(yearDays.slice(i, i + 7));
    }
    return result;
  }, [yearDays]);

  // Month label positions
  const monthLabels = useMemo(() => {
    const labels: { name: string; weekIndex: number }[] = [];
    let lastMonth = -1;

    weeks.forEach((week, weekIdx) => {
      const firstDay = week[0];
      if (firstDay && firstDay.month !== lastMonth) {
        labels.push({ name: firstDay.monthName, weekIndex: weekIdx });
        lastMonth = firstDay.month;
      }
    });

    return labels;
  }, [weeks]);

  // Metrics summary
  const perfectDaysCount = yearDays.filter(d => !d.isFuture && d.rate === 100 && d.totalHabits > 0).length;
  const totalCompletedHabits = logs.filter(l => l.completed && activeHabits.some(h => h.id === l.habitId)).length;
  const activeTrackedDays = yearDays.filter(d => !d.isFuture && d.completedCount > 0).length;

  const getTileColor = (day: typeof yearDays[0]) => {
    if (day.isFuture) {
      return 'bg-obsidian-950/40 border border-white/5 opacity-40';
    }
    if (day.rate === 0) {
      return 'bg-obsidian-950/80 border border-white/5 hover:border-white/20';
    }
    if (day.rate >= 100) {
      return 'bg-gradient-to-br from-gold via-crimson to-crimson shadow-glow-gold/40 border border-gold/70';
    }
    if (day.rate >= 75) {
      return 'bg-crimson border-crimson-glow shadow-glow-crimson/50';
    }
    if (day.rate >= 50) {
      return 'bg-crimson/70 border-crimson/50';
    }
    return 'bg-crimson/35 border-crimson/30';
  };

  return (
    <div className="space-y-6">
      
      {/* Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-2xl bg-obsidian-900/80 border border-white/10 backdrop-blur-xl shadow-obsidian-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-slate-400">Total Check-Ins</span>
            <Flame className="w-4 h-4 text-crimson" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white mt-2">
            {totalCompletedHabits}
          </div>
          <p className="text-[11px] text-slate-500 font-mono mt-1">Across 365 days</p>
        </div>

        <div className="p-5 rounded-2xl bg-obsidian-900/80 border border-white/10 backdrop-blur-xl shadow-obsidian-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-slate-400">Perfect 100% Days</span>
            <Trophy className="w-4 h-4 text-gold" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-gold mt-2">
            {perfectDaysCount}
          </div>
          <p className="text-[11px] text-slate-500 font-mono mt-1">100% habits cleared</p>
        </div>

        <div className="p-5 rounded-2xl bg-obsidian-900/80 border border-white/10 backdrop-blur-xl shadow-obsidian-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-slate-400">Active Days</span>
            <Calendar className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white mt-2">
            {activeTrackedDays}
          </div>
          <p className="text-[11px] text-slate-500 font-mono mt-1">With recorded progress</p>
        </div>

        <div className="p-5 rounded-2xl bg-obsidian-900/80 border border-white/10 backdrop-blur-xl shadow-obsidian-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-slate-400">Standard Score</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-400 mt-2">
            {activeTrackedDays > 0 ? Math.round((perfectDaysCount / Math.max(1, activeTrackedDays)) * 100) : 0}%
          </div>
          <p className="text-[11px] text-slate-500 font-mono mt-1">Perfection efficiency</p>
        </div>

      </div>

      {/* 365-Day Contribution Grid Container */}
      <div className="p-6 sm:p-8 rounded-2xl bg-obsidian-900/90 border border-white/10 backdrop-blur-2xl shadow-obsidian-card space-y-6">
        
        {/* Heatmap Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-crimson" />
              <h2 className="font-cinematic text-xl font-bold text-white tracking-wide">
                1-Year Discipline Matrix
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              52 Weeks • 365 Days of unyielding habit tracking from {formatDateDisplay(profile.startDate || todayStr)}
            </p>
          </div>

          {/* Legend */}
          <div className="flex items-center space-x-2 text-[11px] font-mono text-slate-400">
            <span>Low</span>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded bg-obsidian-950 border border-white/10" />
              <div className="w-3 h-3 rounded bg-crimson/35" />
              <div className="w-3 h-3 rounded bg-crimson/70" />
              <div className="w-3 h-3 rounded bg-crimson" />
              <div className="w-3 h-3 rounded bg-gradient-to-br from-gold to-crimson shadow-glow-gold" />
            </div>
            <span>100% Flawless</span>
          </div>
        </div>

        {/* The Matrix Grid */}
        <div className="overflow-x-auto pb-4">
          <div className="min-w-[850px]">
            
            {/* Month Labels Bar */}
            <div className="flex text-[10px] font-mono text-slate-400 mb-2 pl-8">
              {monthLabels.map((lbl, idx) => (
                <div 
                  key={idx} 
                  className="overflow-visible" 
                  style={{ width: `${(100 / 53) * (idx < monthLabels.length - 1 ? monthLabels[idx + 1].weekIndex - lbl.weekIndex : 4)}%` }}
                >
                  {lbl.name}
                </div>
              ))}
            </div>

            {/* Matrix with Day of Week Rows */}
            <div className="flex">
              
              {/* Day Labels on Left */}
              <div className="flex flex-col justify-between text-[9px] font-mono text-slate-500 pr-2 py-0.5 select-none w-7">
                <span>Sun</span>
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
              </div>

              {/* 53 Columns */}
              <div className="grid grid-flow-col grid-rows-7 gap-1.5 flex-1">
                {yearDays.map((day) => {
                  const tileStyle = getTileColor(day);
                  const isSelectedDay = day.dateStr === todayStr;

                  return (
                    <button
                      key={day.dateStr}
                      onClick={() => setSelectedDate(day.dateStr)}
                      onMouseEnter={() => setHoveredDay({
                        dateStr: day.dateStr,
                        total: day.totalHabits,
                        completed: day.completedCount,
                        rate: day.rate,
                        reflection: day.reflection
                      })}
                      onMouseLeave={() => setHoveredDay(null)}
                      className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded transition-all duration-150 relative ${tileStyle} ${
                        isSelectedDay ? 'ring-2 ring-gold ring-offset-1 ring-offset-obsidian-950 scale-110' : ''
                      }`}
                      title={`${formatDateDisplay(day.dateStr)}: ${day.completedCount}/${day.totalHabits} habits (${day.rate}%)`}
                    />
                  );
                })}
              </div>

            </div>

          </div>
        </div>

        {/* Hover Inspector Bar */}
        <div className="p-4 rounded-xl bg-obsidian-950/70 border border-white/5 flex items-center justify-between text-xs font-mono">
          {hoveredDay ? (
            <div className="flex flex-wrap items-center gap-4 text-slate-200">
              <span className="font-bold text-crimson">{formatDateDisplay(hoveredDay.dateStr)}:</span>
              <span>{hoveredDay.completed} / {hoveredDay.total} Habits Done</span>
              <span className="font-bold text-gold">({hoveredDay.rate}%)</span>
              {hoveredDay.reflection && (
                <span className="text-slate-400 italic truncate max-w-sm">
                  "{hoveredDay.reflection}"
                </span>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-2 text-slate-500">
              <Info className="w-4 h-4" />
              <span>Hover over any day on the 365-day grid to inspect stats, or click to open that date.</span>
            </div>
          )}

          <div className="hidden sm:flex items-center space-x-1 text-slate-400">
            <span>Click to log past/future day</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </div>
        </div>

      </div>

    </div>
  );
};
