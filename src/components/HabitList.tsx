import React, { useState, useMemo } from 'react';
import { useHabits } from '../context/HabitContext';
import { HabitCard } from './HabitCard';
import { DateNavigator } from './DateNavigator';
import { RulesWidget } from './RulesWidget';
import { BattlePlanWidget } from './BattlePlanWidget';
import type { Habit, TimeOfDay } from '../types';
import { 
  Sparkles, 
  Layers, 
  Sun, 
  Sunset, 
  Moon, 
  Clock, 
  PlusCircle, 
  ShieldCheck, 
  BookOpen, 
  Search,
  Filter
} from 'lucide-react';

interface HabitListProps {
  onOpenNewHabit: () => void;
  onOpenHabitPacks: () => void;
  onOpenReflection: () => void;
  onEditHabit: (habit: Habit) => void;
}

export const HabitList: React.FC<HabitListProps> = ({
  onOpenNewHabit,
  onOpenHabitPacks,
  onOpenReflection,
  onEditHabit
}) => {
  const { habits, logs, selectedDate, reflections, isHabitScheduledForDate } = useHabits();
  const [filterTime, setFilterTime] = useState<'all' | TimeOfDay>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showScheduledOnly, setShowScheduledOnly] = useState(true);

  const activeHabits = useMemo(() => (habits || []).filter(h => !h.archived), [habits]);

  // Scheduled on the selected date (Rest days will be excluded)
  const scheduledTodayHabits = useMemo(() => {
    return activeHabits.filter(h => isHabitScheduledForDate(h, selectedDate));
  }, [activeHabits, selectedDate, isHabitScheduledForDate]);

  const habitsToFilter = showScheduledOnly ? scheduledTodayHabits : activeHabits;

  const filteredHabits = useMemo(() => {
    return (habitsToFilter || []).filter(h => {
      const matchesTime = filterTime === 'all' || h.timeOfDay === filterTime;
      const matchesSearch = h.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (h.description && h.description.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesTime && matchesSearch;
    });
  }, [habitsToFilter, filterTime, searchQuery]);

  const completedTodayCount = (logs || []).filter(
    l => l.date === selectedDate && l.completed && scheduledTodayHabits.some(h => h.id === l.habitId)
  ).length;

  const todayReflection = (reflections || []).find(r => r.date === selectedDate);
  const completionPercentage = scheduledTodayHabits.length > 0 ? Math.round((completedTodayCount / scheduledTodayHabits.length) * 100) : 0;

  return (
    <div className="space-y-6">
      
      {/* Date Navigation & Stepper */}
      <DateNavigator />

      {/* Progress Summary Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-obsidian-900 via-obsidian-850 to-obsidian-900 border border-white/10 backdrop-blur-xl shadow-obsidian-card">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Daily Execution</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-white/5 text-slate-300 border border-white/10">
              {completedTodayCount} of {scheduledTodayHabits.length} Scheduled Done
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-cinematic font-bold text-white mt-1">
            {completionPercentage === 100 
              ? 'Flawless Discipline Achieved' 
              : completionPercentage >= 50 
              ? 'Momentum Building' 
              : 'Hold The Standard'}
          </h2>
        </div>

        {/* Progress Bar & Evening Callout */}
        <div className="flex items-center space-x-4">
          <div className="w-36 sm:w-48 space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-400">Scheduled</span>
              <span className="text-crimson font-bold">{completionPercentage}%</span>
            </div>
            <div className="w-full h-2.5 bg-obsidian-950 rounded-full overflow-hidden border border-white/5">
              <div 
                className="h-full bg-gradient-to-r from-crimson via-gold to-emerald-400 rounded-full transition-all duration-500 shadow-glow-crimson"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>

          <button
            onClick={onOpenReflection}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-medium border transition-all duration-200 ${
              todayReflection 
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-obsidian-950 text-slate-300 border-white/10 hover:border-gold/50 hover:text-gold'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>{todayReflection ? 'Reflection Logged' : 'Audit Day'}</span>
          </button>
        </div>
      </div>

      {/* The Stoic Code (Personal Iron Rules) on Main Page */}
      <RulesWidget />

      {/* Strategic Battle Plan (Today's Tasks, Tomorrow Planner & Insights) */}
      <BattlePlanWidget />

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        
        {/* Time of Day Tabs */}
        <div className="flex items-center space-x-1 p-1 rounded-xl bg-obsidian-900 border border-white/10 overflow-x-auto max-w-full">
          <button
            onClick={() => setFilterTime('all')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filterTime === 'all' ? 'bg-white/15 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>All ({habitsToFilter.length})</span>
          </button>

          <button
            onClick={() => setFilterTime('morning')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filterTime === 'morning' ? 'bg-amber-500/20 text-amber-300 font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sun className="w-3.5 h-3.5" />
            <span>Morning</span>
          </button>

          <button
            onClick={() => setFilterTime('afternoon')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filterTime === 'afternoon' ? 'bg-crimson/20 text-crimson font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sunset className="w-3.5 h-3.5" />
            <span>Afternoon</span>
          </button>

          <button
            onClick={() => setFilterTime('evening')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filterTime === 'evening' ? 'bg-purple-500/20 text-purple-300 font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Moon className="w-3.5 h-3.5" />
            <span>Evening</span>
          </button>

          <button
            onClick={() => setFilterTime('anytime')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filterTime === 'anytime' ? 'bg-cyan-500/20 text-cyan-300 font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Anytime</span>
          </button>
        </div>

        {/* Schedule Filter & Search */}
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setShowScheduledOnly(!showScheduledOnly)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-mono flex items-center space-x-1.5 transition-all ${
              showScheduledOnly 
                ? 'bg-crimson/20 text-crimson border-crimson/40 font-bold' 
                : 'bg-obsidian-900 text-slate-400 border-white/10'
            }`}
            title="Toggle whether rest-day habits are hidden"
          >
            <Filter className="w-3.5 h-3.5" />
            <span>{showScheduledOnly ? 'Scheduled Today' : 'Show All (incl. Rest Days)'}</span>
          </button>

          <div className="relative flex-1 sm:w-56">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search habits..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-obsidian-900 border border-white/10 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-crimson/60"
            />
          </div>
        </div>

      </div>

      {/* Habits Grid with Ordering Position Info */}
      {filteredHabits.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredHabits.map((habit, idx) => (
            <HabitCard 
              key={habit.id} 
              habit={habit} 
              index={idx}
              totalHabits={filteredHabits.length}
              onEdit={onEditHabit} 
            />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center rounded-2xl bg-obsidian-900/60 border border-white/10 backdrop-blur-md space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 mx-auto flex items-center justify-center text-slate-500">
            <Sparkles className="w-7 h-7" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="text-lg font-cinematic font-bold text-white">
              {showScheduledOnly ? 'Rest Day or No Habits Scheduled' : 'No Habits Found'}
            </h3>
            <p className="text-xs text-slate-400">
              {showScheduledOnly 
                ? 'No habits are scheduled for this specific day of the week, or all scheduled habits match your filter.'
                : 'Create a custom daily habit or load one of our pre-built discipline packs to forge your routine.'}
            </p>
          </div>
          <div className="flex items-center justify-center space-x-3 pt-2">
            <button
              onClick={onOpenNewHabit}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-crimson text-white text-xs font-semibold shadow-glow-crimson hover:bg-crimson-glow transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Custom Habit</span>
            </button>
            <button
              onClick={onOpenHabitPacks}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-obsidian-800 text-slate-200 border border-white/10 text-xs font-medium hover:bg-white/10 transition-all"
            >
              <ShieldCheck className="w-4 h-4 text-gold" />
              <span>Browse Routine Packs</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
