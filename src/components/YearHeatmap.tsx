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
  Info,
  CheckCircle2,
  XCircle,
  X
} from 'lucide-react';

export const YearHeatmap: React.FC = () => {
  const { profile, habits, logs, reflections, setSelectedDate, isHabitScheduledForDate, getYearStats } = useHabits();
  
  const [hoveredDay, setHoveredDay] = useState<{
    dateStr: string;
    total: number;
    completed: number;
    rate: number;
    isRestDay: boolean;
    reflection?: string;
  } | null>(null);

  const [selectedDayDetails, setSelectedDayDetails] = useState<{
    dateStr: string;
    total: number;
    completed: number;
    rate: number;
    isRestDay: boolean;
    scheduledHabits: { id: string; title: string; completed: boolean; color: string; icon: string }[];
    reflection?: string;
  } | null>(null);

  const [filterMode, setFilterMode] = useState<'all' | 'perfect' | 'incomplete' | 'rest'>('all');

  const activeHabits = useMemo(() => (habits || []).filter(h => !h.archived), [habits]);
  const todayStr = getTodayDateString();
  const yearStats = getYearStats();

  // Generate 365 days from start date aligned to day of week
  const yearDays = useMemo(() => {
    const startDateStr = profile.startDate || todayStr;
    const [sYear, sMonth, sDay] = startDateStr.split('-').map(Number);
    const start = new Date(sYear, sMonth - 1, sDay);
    
    // Align to the previous Sunday for clean 7-row columns
    const dayOfWeek = start.getDay(); // 0 = Sunday
    const alignedStart = new Date(start);
    alignedStart.setDate(start.getDate() - dayOfWeek);

    const days = [];
    const totalDaysToRender = 371; // 53 weeks * 7 days to cover full 1-year journey

    for (let i = 0; i < totalDaysToRender; i++) {
      const d = new Date(alignedStart);
      d.setDate(alignedStart.getDate() + i);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;

      // Calculate SCHEDULED habits specifically for this day of week!
      const scheduledOnDate = activeHabits.filter(h => isHabitScheduledForDate(h, dateStr));
      const totalScheduled = scheduledOnDate.length;

      const dayCompletedLogs = logs.filter(
        l => l.date === dateStr && l.completed && scheduledOnDate.some(h => h.id === l.habitId)
      );
      const completedCount = dayCompletedLogs.length;

      const isRestDay = totalScheduled === 0;
      
      // If it's a rest day (0 scheduled habits), it doesn't penalize.
      // If there are 8 or 11 habits scheduled and ALL completed, it's 100% and a perfect day!
      const rate = totalScheduled > 0 
        ? Math.min(100, Math.round((completedCount / totalScheduled) * 100))
        : (isRestDay ? 100 : 0);

      const isPerfect = totalScheduled > 0 && completedCount >= totalScheduled;
      const ref = reflections.find(r => r.date === dateStr);

      const scheduledHabitDetails = scheduledOnDate.map(h => ({
        id: h.id,
        title: h.title,
        completed: dayCompletedLogs.some(l => l.habitId === h.id),
        color: h.color,
        icon: h.icon
      }));

      days.push({
        date: d,
        dateStr,
        dayOfWeek: d.getDay(),
        month: d.getMonth(),
        monthName: d.toLocaleDateString('en-US', { month: 'short' }),
        dayOfMonth: d.getDate(),
        completedCount,
        totalHabits: totalScheduled,
        rate,
        isRestDay,
        isPerfect,
        isToday: dateStr === todayStr,
        isFuture: dateStr > todayStr,
        reflection: ref?.reflection,
        scheduledHabits: scheduledHabitDetails
      });
    }

    return days;
  }, [profile.startDate, todayStr, logs, activeHabits, reflections, isHabitScheduledForDate]);

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

  // Metrics summary calculated with exact schedule awareness!
  const pastDays = yearDays.filter(d => !d.isFuture);
  const perfectDaysCount = pastDays.filter(d => d.isPerfect).length;
  const totalCompletedHabits = logs.filter(l => l.completed && activeHabits.some(h => h.id === l.habitId)).length;
  const restDaysCount = pastDays.filter(d => d.isRestDay).length;

  const getTileColor = (day: typeof yearDays[0]) => {
    if (day.isFuture) {
      return 'bg-obsidian-950/40 border border-white/5 opacity-30';
    }
    if (day.isRestDay) {
      return 'bg-obsidian-900 border border-cyan-500/20 text-cyan-400';
    }
    if (day.rate === 0) {
      return 'bg-obsidian-950/80 border border-white/5 hover:border-white/20';
    }
    // Fully progressed / perfect day gets gold glow!
    if (day.isPerfect || day.rate >= 100) {
      return 'bg-gradient-to-br from-gold via-crimson to-crimson shadow-glow-gold/50 border border-gold';
    }
    if (day.rate >= 75) {
      return 'bg-crimson border-crimson-glow shadow-glow-crimson/40';
    }
    if (day.rate >= 50) {
      return 'bg-crimson/70 border-crimson/40';
    }
    return 'bg-crimson/35 border-crimson/25';
  };

  const isTileMatchingFilter = (day: typeof yearDays[0]) => {
    if (filterMode === 'all') return true;
    if (filterMode === 'perfect') return day.isPerfect && !day.isFuture;
    if (filterMode === 'incomplete') return !day.isPerfect && !day.isRestDay && !day.isFuture;
    if (filterMode === 'rest') return day.isRestDay && !day.isFuture;
    return true;
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
          <p className="text-[11px] text-slate-500 font-mono mt-1">Across {yearStats.daysElapsed} days elapsed</p>
        </div>

        <div className="p-5 rounded-2xl bg-obsidian-900/80 border border-white/10 backdrop-blur-xl shadow-obsidian-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-slate-400">Flawless 100% Days</span>
            <Trophy className="w-4 h-4 text-gold" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-gold mt-2">
            {perfectDaysCount}
          </div>
          <p className="text-[11px] text-slate-500 font-mono mt-1">All scheduled habits cleared</p>
        </div>

        <div className="p-5 rounded-2xl bg-obsidian-900/80 border border-white/10 backdrop-blur-xl shadow-obsidian-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-slate-400">Current Momentum</span>
            <Calendar className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-cyan-400 mt-2">
            {yearStats.currentOverallStreak} Days
          </div>
          <p className="text-[11px] text-slate-500 font-mono mt-1">Unbroken daily consistency</p>
        </div>

        <div className="p-5 rounded-2xl bg-obsidian-900/80 border border-white/10 backdrop-blur-xl shadow-obsidian-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-slate-400">Year Pacing Rate</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-400 mt-2">
            {yearStats.yearCompletionRate}%
          </div>
          <p className="text-[11px] text-slate-500 font-mono mt-1">Expected vs executed volume</p>
        </div>

      </div>

      {/* 365-Day Contribution Grid Container */}
      <div className="p-6 sm:p-8 rounded-2xl bg-obsidian-900/90 border border-white/10 backdrop-blur-2xl shadow-obsidian-card space-y-6">
        
        {/* Heatmap Header & Filters */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-crimson" />
              <h2 className="font-cinematic text-xl font-bold text-white tracking-wide">
                Enhanced 365-Day Discipline Matrix
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              52 Weeks • Day {yearStats.daysElapsed} of 365 • Rest days automatically respected without streak penalty
            </p>
          </div>

          {/* Filter Bar & Legend */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center space-x-1 p-1 rounded-xl bg-obsidian-950 border border-white/10 text-xs font-mono">
              <button
                type="button"
                onClick={() => setFilterMode('all')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  filterMode === 'all' ? 'bg-white/15 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                All Days
              </button>
              <button
                type="button"
                onClick={() => setFilterMode('perfect')}
                className={`px-3 py-1 rounded-lg transition-all flex items-center space-x-1 ${
                  filterMode === 'perfect' ? 'bg-gold text-obsidian-950 font-bold shadow-glow-gold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>🏆 Flawless ({perfectDaysCount})</span>
              </button>
              <button
                type="button"
                onClick={() => setFilterMode('incomplete')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  filterMode === 'incomplete' ? 'bg-crimson text-white font-bold shadow-glow-crimson' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Incomplete
              </button>
              <button
                type="button"
                onClick={() => setFilterMode('rest')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  filterMode === 'rest' ? 'bg-cyan-500 text-obsidian-950 font-bold shadow-glow-cyan' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Rest ({restDaysCount})
              </button>
            </div>

            {/* Legend */}
            <div className="flex items-center space-x-2 text-[11px] font-mono text-slate-400">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 rounded bg-obsidian-950 border border-white/10" title="0% or Empty" />
                <div className="w-3 h-3 rounded bg-crimson/35" title="<50%" />
                <div className="w-3 h-3 rounded bg-crimson/70" title="50-74%" />
                <div className="w-3 h-3 rounded bg-crimson" title="75-99%" />
                <div className="w-3 h-3 rounded bg-gradient-to-br from-gold to-crimson shadow-glow-gold" title="100% Flawless" />
                <div className="w-3 h-3 rounded bg-obsidian-900 border border-cyan-500/40" title="Rest Day" />
              </div>
              <span>100% Flawless</span>
            </div>
          </div>
        </div>

        {/* The Matrix Grid */}
        <div className="overflow-x-auto pb-4">
          <div className="min-w-[860px]">
            
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
                  const matchesFilter = isTileMatchingFilter(day);

                  return (
                    <button
                      key={day.dateStr}
                      onClick={() => {
                        setSelectedDayDetails({
                          dateStr: day.dateStr,
                          total: day.totalHabits,
                          completed: day.completedCount,
                          rate: day.rate,
                          isRestDay: day.isRestDay,
                          scheduledHabits: day.scheduledHabits,
                          reflection: day.reflection
                        });
                      }}
                      onMouseEnter={() => setHoveredDay({
                        dateStr: day.dateStr,
                        total: day.totalHabits,
                        completed: day.completedCount,
                        rate: day.rate,
                        isRestDay: day.isRestDay,
                        reflection: day.reflection
                      })}
                      onMouseLeave={() => setHoveredDay(null)}
                      className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded transition-all duration-150 relative ${tileStyle} ${
                        isSelectedDay ? 'ring-2 ring-gold ring-offset-1 ring-offset-obsidian-950 scale-110' : ''
                      } ${!matchesFilter ? 'opacity-10 scale-75' : 'hover:scale-125 hover:z-20 cursor-pointer'}`}
                      title={`${formatDateDisplay(day.dateStr)}: ${day.isRestDay ? 'Rest Day' : `${day.completedCount}/${day.totalHabits} habits (${day.rate}%)`}`}
                    />
                  );
                })}
              </div>

            </div>

          </div>
        </div>

        {/* Hover Inspector Bar */}
        <div className="p-4 rounded-xl bg-obsidian-950/70 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
          {hoveredDay ? (
            <div className="flex flex-wrap items-center gap-3 text-slate-200">
              <span className="font-bold text-crimson">{formatDateDisplay(hoveredDay.dateStr)}:</span>
              {hoveredDay.isRestDay ? (
                <span className="text-cyan-400 font-bold">🛡️ Scheduled Rest Day (All disciplines rested)</span>
              ) : (
                <>
                  <span>{hoveredDay.completed} / {hoveredDay.total} Scheduled Done</span>
                  <span className={`font-bold ${hoveredDay.rate === 100 ? 'text-gold' : 'text-slate-300'}`}>
                    ({hoveredDay.rate}%{hoveredDay.rate === 100 ? ' — Flawless 100%' : ''})
                  </span>
                </>
              )}
              {hoveredDay.reflection && (
                <span className="text-slate-400 italic truncate max-w-sm">
                  "{hoveredDay.reflection}"
                </span>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-2 text-slate-500">
              <Info className="w-4 h-4" />
              <span>Click any date tile to inspect full habit breakdown and audit details.</span>
            </div>
          )}

          <div className="flex items-center space-x-1 text-slate-400">
            <span>Click to inspect</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </div>
        </div>

      </div>

      {/* Interactive Day Details Modal */}
      {selectedDayDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-950/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-md rounded-2xl bg-obsidian-900 border border-white/15 shadow-2xl overflow-hidden p-6 space-y-4">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-400">Date Audit</span>
                <h3 className="font-cinematic text-lg font-bold text-white">
                  {formatDateDisplay(selectedDayDetails.dateStr)}
                </h3>
              </div>
              <button
                onClick={() => setSelectedDayDetails(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Score Pill */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-obsidian-950 border border-white/5">
              <div>
                <div className="text-xs font-mono text-slate-400">Day Execution Status</div>
                <div className="text-base font-bold text-white mt-0.5">
                  {selectedDayDetails.isRestDay ? (
                    <span className="text-cyan-400">Rest Day (No scheduled habits)</span>
                  ) : selectedDayDetails.rate === 100 ? (
                    <span className="text-gold flex items-center space-x-1.5">
                      <Trophy className="w-4 h-4" />
                      <span>100% Flawless Execution</span>
                    </span>
                  ) : (
                    <span>{selectedDayDetails.completed} of {selectedDayDetails.total} Completed</span>
                  )}
                </div>
              </div>
              <div className={`text-2xl font-mono font-extrabold ${selectedDayDetails.rate === 100 ? 'text-gold' : 'text-crimson'}`}>
                {selectedDayDetails.rate}%
              </div>
            </div>

            {/* Scheduled Habits List */}
            <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
              <div className="text-xs font-mono uppercase text-slate-400 font-bold">
                Scheduled Habits ({selectedDayDetails.scheduledHabits.length})
              </div>

              {selectedDayDetails.scheduledHabits.length > 0 ? (
                selectedDayDetails.scheduledHabits.map(h => (
                  <div
                    key={h.id}
                    className={`flex items-center justify-between p-2.5 rounded-xl border text-xs font-mono ${
                      h.completed ? 'bg-obsidian-950 border-emerald-500/30' : 'bg-obsidian-950 border-white/5 opacity-60'
                    }`}
                  >
                    <div className="flex items-center space-x-2 truncate pr-2">
                      <Flame className="w-3.5 h-3.5" style={{ color: h.color }} />
                      <span className={h.completed ? 'text-slate-100 font-medium' : 'text-slate-400'}>{h.title}</span>
                    </div>

                    {h.completed ? (
                      <span className="flex items-center space-x-1 text-emerald-400 font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Done</span>
                      </span>
                    ) : (
                      <span className="flex items-center space-x-1 text-slate-500">
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Missed</span>
                      </span>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-xs font-mono text-slate-500 italic p-3 text-center">
                  Zero habits scheduled for this day (Rest day).
                </div>
              )}
            </div>

            {/* Reflection if present */}
            {selectedDayDetails.reflection && (
              <div className="p-3 rounded-xl bg-obsidian-950 border border-white/5 space-y-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase">Evening Reflection</span>
                <p className="text-xs text-slate-300 italic leading-relaxed">
                  "{selectedDayDetails.reflection}"
                </p>
              </div>
            )}

            {/* Action to Jump to that date */}
            <div className="pt-2 flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setSelectedDayDetails(null)}
                className="px-4 py-2 rounded-xl text-xs font-mono text-slate-400 hover:text-white"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedDate(selectedDayDetails.dateStr);
                  setSelectedDayDetails(null);
                }}
                className="px-4 py-2 rounded-xl bg-crimson hover:bg-crimson-glow text-white text-xs font-bold font-mono shadow-glow-crimson flex items-center space-x-1.5"
              >
                <span>Open in Daily Rituals</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
