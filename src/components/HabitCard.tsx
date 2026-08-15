import React, { useState } from 'react';
import type { Habit, HabitLogEntry } from '../types';
import { useHabits } from '../context/HabitContext';
import { 
  Check, 
  Flame, 
  Zap, 
  MoreVertical, 
  Edit3, 
  Trash2, 
  Plus, 
  Minus, 
  Sparkles, 
  BookOpen, 
  Dumbbell, 
  Feather, 
  Moon, 
  Code, 
  Droplets, 
  Footprints, 
  Apple, 
  Heart, 
  Shield, 
  Brain, 
  Activity, 
  Clock,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

interface HabitCardProps {
  habit: Habit;
  onEdit: (habit: Habit) => void;
  index: number;
  totalHabits: number;
}

const ICON_MAP: Record<string, React.ElementType> = {
  Flame,
  Zap,
  BookOpen,
  Dumbbell,
  Feather,
  Moon,
  Code,
  Droplets,
  Footprints,
  Apple,
  Heart,
  Shield,
  Brain,
  Activity,
  Sparkles
};

export const HabitCard: React.FC<HabitCardProps> = ({ habit, onEdit, index, totalHabits }) => {
  const { 
    selectedDate, 
    getHabitStatusForDate, 
    toggleHabitCompletion, 
    updateHabitValue, 
    deleteHabit, 
    moveHabit,
    getStreakForHabit 
  } = useHabits();

  const [menuOpen, setMenuOpen] = useState(false);
  const logEntry: HabitLogEntry | undefined = getHabitStatusForDate(habit.id, selectedDate);
  const isCompleted = logEntry?.completed ?? false;
  const currentValue = logEntry?.currentValue ?? (isCompleted ? (habit.targetValue || 1) : 0);
  const streak = getStreakForHabit(habit.id);

  const IconComponent = ICON_MAP[habit.icon] || Flame;

  const handleToggle = () => {
    toggleHabitCompletion(habit.id, selectedDate);
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    const target = habit.targetValue || 1;
    const nextVal = Math.min(target * 2, currentValue + (habit.unit === 'L' ? 0.5 : 1));
    updateHabitValue(habit.id, nextVal, selectedDate);
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    const step = habit.unit === 'L' ? 0.5 : 1;
    const nextVal = Math.max(0, currentValue - step);
    updateHabitValue(habit.id, nextVal, selectedDate);
  };

  const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
    mind: { bg: 'bg-amber-500/15', text: 'text-amber-400', border: 'border-amber-500/30' },
    body: { bg: 'bg-crimson/15', text: 'text-crimson', border: 'border-crimson/30' },
    craft: { bg: 'bg-cyan-500/15', text: 'text-cyan-400', border: 'border-cyan-500/30' },
    soul: { bg: 'bg-purple-500/15', text: 'text-purple-400', border: 'border-purple-500/30' },
    vitality: { bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/30' }
  };

  const catStyle = categoryColors[habit.category] || categoryColors.mind;

  return (
    <div 
      className={`group relative rounded-2xl border transition-all duration-300 backdrop-blur-xl ${
        isCompleted
          ? 'bg-obsidian-900/90 border-crimson/40 shadow-glow-crimson/30'
          : 'bg-obsidian-900/70 border-white/10 hover:border-white/20 hover:bg-obsidian-850/80 shadow-obsidian-card'
      }`}
    >
      <div className="p-5 sm:p-6">
        
        {/* Top Header Row */}
        <div className="flex items-start justify-between gap-3 mb-3">
          
          <div className="flex items-center space-x-3">
            <div 
              className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-transform duration-300 group-hover:scale-105 ${
                isCompleted 
                  ? 'bg-crimson text-white border-crimson-glow shadow-glow-crimson'
                  : 'bg-obsidian-950 text-slate-300 border-white/10'
              }`}
            >
              <IconComponent className="w-5 h-5" />
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider border ${catStyle.bg} ${catStyle.text} ${catStyle.border}`}>
                  {habit.category}
                </span>
                <span className="text-[11px] font-mono text-slate-400 flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span className="capitalize">{habit.timeOfDay}</span>
                </span>
              </div>
              <h3 className={`text-base sm:text-lg font-bold font-sans mt-1 transition-colors ${
                isCompleted ? 'text-white line-through decoration-crimson/70' : 'text-slate-100'
              }`}>
                {habit.title}
              </h3>
            </div>
          </div>

          {/* Ordering Arrows & Action Menu */}
          <div className="flex items-center space-x-1">
            
            {/* Move Up / Down Buttons */}
            <div className="flex items-center bg-obsidian-950/80 border border-white/10 rounded-lg p-0.5">
              <button
                type="button"
                onClick={() => moveHabit(habit.id, 'up')}
                disabled={index === 0}
                className={`p-1 rounded text-slate-400 hover:text-white hover:bg-white/10 transition-colors ${index === 0 ? 'opacity-30 cursor-not-allowed' : ''}`}
                title="Move Habit Up"
              >
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => moveHabit(habit.id, 'down')}
                disabled={index === totalHabits - 1}
                className={`p-1 rounded text-slate-400 hover:text-white hover:bg-white/10 transition-colors ${index === totalHabits - 1 ? 'opacity-30 cursor-not-allowed' : ''}`}
                title="Move Habit Down"
              >
                <ArrowDown className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Menu */}
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-white/10 transition-colors"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-1 w-36 rounded-xl bg-obsidian-900 border border-white/15 shadow-2xl p-1.5 z-30 animate-fade-in">
                  <button
                    onClick={() => { onEdit(habit); setMenuOpen(false); }}
                    className="w-full px-2.5 py-1.5 text-xs text-slate-300 hover:bg-white/10 rounded-lg flex items-center space-x-2"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Habit</span>
                  </button>
                  <button
                    onClick={() => { moveHabit(habit.id, 'up'); setMenuOpen(false); }}
                    className="w-full px-2.5 py-1.5 text-xs text-slate-300 hover:bg-white/10 rounded-lg flex items-center space-x-2"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                    <span>Move Up</span>
                  </button>
                  <button
                    onClick={() => { moveHabit(habit.id, 'down'); setMenuOpen(false); }}
                    className="w-full px-2.5 py-1.5 text-xs text-slate-300 hover:bg-white/10 rounded-lg flex items-center space-x-2"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                    <span>Move Down</span>
                  </button>
                  <button
                    onClick={() => { deleteHabit(habit.id); setMenuOpen(false); }}
                    className="w-full px-2.5 py-1.5 text-xs text-crimson hover:bg-crimson/15 rounded-lg flex items-center space-x-2"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Description */}
        {habit.description && (
          <p className="text-xs text-slate-400 font-sans line-clamp-2 mb-4">
            {habit.description}
          </p>
        )}

        {/* Numeric / Quantitative Tracker Bar */}
        {habit.type === 'numeric' && habit.targetValue && (
          <div className="my-4 p-3 rounded-xl bg-obsidian-950/60 border border-white/5 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Progress:</span>
              <span className="text-white font-bold">
                {currentValue} / {habit.targetValue} {habit.unit || ''}
              </span>
            </div>

            <div className="w-full h-2 bg-obsidian-900 rounded-full overflow-hidden border border-white/5">
              <div 
                className="h-full bg-gradient-to-r from-crimson to-gold rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, Math.round((currentValue / habit.targetValue) * 100))}%` }}
              />
            </div>

            <div className="flex items-center justify-end space-x-2 pt-1">
              <button
                onClick={handleDecrement}
                className="p-1 rounded bg-obsidian-850 hover:bg-white/10 text-slate-300 border border-white/10 text-xs"
                title="Decrease"
              >
                <Minus className="w-3 h-3" />
              </button>
              <button
                onClick={handleIncrement}
                className="p-1 rounded bg-obsidian-850 hover:bg-white/10 text-slate-300 border border-white/10 text-xs"
                title="Increase"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}

        {/* Bottom Status & Main Complete Button */}
        <div className="flex items-center justify-between pt-3 border-t border-white/5 mt-2">
          
          {/* Streaks Badge */}
          <div className="flex items-center space-x-3 text-xs font-mono">
            <div className="flex items-center space-x-1 text-slate-300" title="Current Active Streak">
              <Flame className={`w-3.5 h-3.5 ${streak.current > 0 ? 'text-crimson animate-pulse' : 'text-slate-600'}`} />
              <span className="font-bold">{streak.current}d streak</span>
            </div>
            {streak.best > streak.current && (
              <div className="flex items-center space-x-1 text-slate-500 text-[11px]" title="Best All-Time Streak">
                <Zap className="w-3 h-3 text-gold" />
                <span>Best: {streak.best}d</span>
              </div>
            )}
          </div>

          {/* Interactive Checkmark Trigger */}
          <button
            onClick={handleToggle}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl font-medium text-xs transition-all duration-200 active:scale-95 ${
              isCompleted
                ? 'bg-crimson text-white shadow-glow-crimson border border-crimson-glow/60 font-semibold'
                : 'bg-obsidian-950 text-slate-400 hover:text-slate-100 hover:bg-white/10 border border-white/10'
            }`}
          >
            <div className={`w-4 h-4 rounded-md flex items-center justify-center border ${
              isCompleted ? 'bg-white text-crimson border-white' : 'border-slate-500'
            }`}>
              {isCompleted && <Check className="w-3 h-3 stroke-[3]" />}
            </div>
            <span>{isCompleted ? 'Completed' : 'Check In'}</span>
          </button>

        </div>

      </div>
    </div>
  );
};
