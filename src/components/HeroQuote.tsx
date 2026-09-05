import React, { useState } from 'react';
import { DISCIPLINE_QUOTES, getRandomQuote } from '../utils/quotes';
import { Quote, RefreshCw, Sparkles, Flame, Trophy, ShieldCheck } from 'lucide-react';
import { useHabits } from '../context/HabitContext';

export const HeroQuote: React.FC = () => {
  const [currentQuote, setCurrentQuote] = useState(getRandomQuote);
  const [isRotating, setIsRotating] = useState(false);
  const { getYearStats, habits, logs, selectedDate, isHabitScheduledForDate } = useHabits();

  const nextQuote = () => {
    setIsRotating(true);
    setTimeout(() => {
      let next = getRandomQuote();
      while (next.id === currentQuote.id && DISCIPLINE_QUOTES.length > 1) {
        next = getRandomQuote();
      }
      setCurrentQuote(next);
      setIsRotating(false);
    }, 200);
  };

  const yearStats = getYearStats();
  const activeHabits = (habits || []).filter(h => !h.archived);
  const scheduledOnDate = activeHabits.filter(h => isHabitScheduledForDate(h, selectedDate));
  const completedToday = (logs || []).filter(
    l => l.date === selectedDate && l.completed && scheduledOnDate.some(h => h.id === l.habitId)
  ).length;
  const completionPercentage = scheduledOnDate.length > 0 
    ? Math.round((completedToday / scheduledOnDate.length) * 100) 
    : (activeHabits.length === 0 ? 0 : 100);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-r from-obsidian-900/90 via-obsidian-850/80 to-obsidian-900/90 p-6 md:p-8 backdrop-blur-xl shadow-obsidian-card mb-8">
      
      {/* Decorative ambient glows */}
      <div className="absolute top-0 right-1/4 w-72 h-72 bg-crimson/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-gold/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-crimson/40 to-transparent" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        {/* Quote Block */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center space-x-3">
            <span className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-widest bg-crimson/15 text-crimson border border-crimson/30">
              <Sparkles className="w-3 h-3" />
              <span>Stoic Axiom • {currentQuote.category}</span>
            </span>
            <button
              onClick={nextQuote}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              title="Next Axiom"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRotating ? 'animate-spin' : ''}`} />
            </button>
          </div>

          <div className="relative pl-6 sm:pl-8 border-l-2 border-crimson/60">
            <Quote className="absolute -left-2.5 -top-2 w-5 h-5 text-crimson/60 bg-obsidian-900 rounded p-0.5" />
            <p className={`font-cinematic text-lg sm:text-xl md:text-2xl text-slate-100 italic leading-relaxed tracking-wide transition-opacity duration-200 ${isRotating ? 'opacity-0' : 'opacity-100'}`}>
              "{currentQuote.text}"
            </p>
            <div className="mt-2 flex items-center space-x-2 text-xs font-mono text-slate-400">
              <span className="text-gold font-semibold uppercase tracking-wider">— {currentQuote.author}</span>
              {currentQuote.source && (
                <>
                  <span>•</span>
                  <span className="text-slate-500 italic">{currentQuote.source}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* 365-Day Micro Dashboard Widget */}
        <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3">
          
          <div className="flex-1 p-4 rounded-xl bg-obsidian-950/70 border border-white/10 backdrop-blur-md flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-crimson/20 border border-crimson/30 flex items-center justify-center text-crimson">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] font-mono uppercase text-slate-400">Daily Forge</div>
                <div className="text-sm font-bold text-white">
                  {completedToday} of {activeHabits.length} Habits
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-mono font-extrabold text-crimson">
                {completionPercentage}%
              </div>
              <div className="text-[10px] text-slate-500 font-mono">Today's Log</div>
            </div>
          </div>

          <div className="flex-1 p-4 rounded-xl bg-obsidian-950/70 border border-white/10 backdrop-blur-md flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-gold/20 border border-gold/30 flex items-center justify-center text-gold">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] font-mono uppercase text-slate-400">365-Day Journey</div>
                <div className="text-sm font-bold text-white">
                  Day {yearStats.daysElapsed}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-mono font-bold text-gold flex items-center justify-end space-x-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{yearStats.currentOverallStreak}d Streak</span>
              </div>
              <div className="text-[10px] text-slate-500 font-mono">{yearStats.daysRemaining} days left</div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
