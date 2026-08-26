import React from 'react';
import { useHabits } from '../context/HabitContext';
import { Bell, Check, X } from 'lucide-react';
import { formatTime12h } from '../utils/notifications';

export const InAppReminderToast: React.FC = () => {
  const { activeReminderToast, dismissReminderToast, toggleHabitCompletion, habits } = useHabits();

  if (!activeReminderToast) return null;

  const habit = habits.find(h => h.title === activeReminderToast.habitTitle);

  const handleComplete = () => {
    if (habit) {
      toggleHabitCompletion(habit.id);
    }
    dismissReminderToast();
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md w-full p-4 rounded-2xl bg-obsidian-900/95 border border-amber-500/50 shadow-2xl shadow-amber-500/20 backdrop-blur-2xl animate-fade-in flex items-start space-x-3">
      <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 flex-shrink-0 animate-pulse">
        <Bell className="w-5 h-5" />
      </div>

      <div className="flex-1 pr-2 space-y-1">
        <div className="flex items-center space-x-2">
          <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold">
            ⚔️ Discipline Hour ({formatTime12h(activeReminderToast.time)})
          </span>
        </div>
        <h4 className="text-sm font-bold text-white">
          Time for "{activeReminderToast.habitTitle}"
        </h4>
        <p className="text-xs text-slate-400 font-sans">
          Do not negotiate with weakness. Execute your scheduled ritual now.
        </p>

        <div className="flex items-center space-x-2 pt-2">
          <button
            type="button"
            onClick={handleComplete}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-crimson hover:bg-crimson-glow text-white text-xs font-bold shadow-glow-crimson transition-all"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Check In Now</span>
          </button>
          <button
            type="button"
            onClick={dismissReminderToast}
            className="px-3 py-1.5 rounded-lg text-xs font-mono text-slate-400 hover:text-white"
          >
            Dismiss
          </button>
        </div>
      </div>

      <button
        type="button"
        onClick={dismissReminderToast}
        className="p-1 rounded text-slate-500 hover:text-white"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
