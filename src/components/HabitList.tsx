import React, { useState, useMemo } from 'react';
import { useHabits } from '../context/HabitContext';
import { HabitCard } from './HabitCard';
import { DateNavigator } from './DateNavigator';
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
  Search 
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
  const { habits, logs, selectedDate, reflections } = useHabits();
  const [filterTime, setFilterTime] = useState<'all' | TimeOfDay>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const activeHabits = useMemo(() => habits.filter(h => !h.archived), [habits]);

  const filteredHabits = useMemo(() => {
    return activeHabits.filter(h => {
      const matchesTime = filterTime === 'all' || h.timeOfDay === filterTime;
      const matchesSearch = h.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (h.description && h.description.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesTime && matchesSearch;
    });
  }, [activeHabits, filterTime, searchQuery]);

  const completedTodayCount = logs.filter(
    l => l.date === selectedDate && l.completed && activeHabits.some(h => h.id === l.habitId)
  ).length;

  const todayReflection = reflections.find(r => r.date === selectedDate);
  const completionPercentage = activeHabits.length > 0 ? Math.round((completedTodayCount / activeHabits.length) * 100) : 0;

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
              {completedTodayCount} of {activeHabits.length} Done
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
              <span className="text-slate-400">Completion</span>
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
            <span>All ({activeHabits.length})</span>
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

        {/* Search */}
        <div className="relative w-full sm:w-64">
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
            <h3 className="text-lg font-cinematic font-bold text-white">No Habits In This View</h3>
            <p className="text-xs text-slate-400">
              Create a custom daily habit or load one of our pre-built discipline packs to forge your routine.
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
