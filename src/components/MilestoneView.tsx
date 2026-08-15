import React from 'react';
import { useHabits } from '../context/HabitContext';
import { 
  Award, 
  Flame, 
  Shield, 
  Sparkles, 
  Trophy, 
  Crown, 
  CheckCircle2, 
  Lock 
} from 'lucide-react';

const ICON_MAP: Record<string, React.ElementType> = {
  Award,
  Flame,
  Shield,
  Sparkles,
  Trophy,
  Crown
};

export const MilestoneView: React.FC = () => {
  const { milestones, levelInfo, profile, logs, habits } = useHabits();

  const totalCompletions = logs.filter(l => l.completed).length;

  const tierBadges = {
    bronze: 'border-amber-700/50 bg-amber-950/20 text-amber-500',
    silver: 'border-slate-400/50 bg-slate-800/30 text-slate-300',
    gold: 'border-gold/50 bg-gold/10 text-gold shadow-glow-gold/20',
    obsidian: 'border-crimson/50 bg-crimson/15 text-crimson shadow-glow-crimson/30'
  };

  return (
    <div className="space-y-6">
      
      {/* Header Level & Prestige Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-obsidian-900 via-obsidian-850 to-obsidian-900 border border-white/10 backdrop-blur-2xl shadow-obsidian-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-gold/20 text-gold border border-gold/40">
                LEVEL {levelInfo.level} OF 50
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {profile.xp} Total XP
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-cinematic font-black text-white tracking-wide">
              {levelInfo.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
              Every completed habit adds +25 XP. Every flawless day adds +100 XP. Advance through the 50 ranks of Stoic fortitude.
            </p>
          </div>

          <div className="w-full sm:w-64 p-4 rounded-xl bg-obsidian-950/70 border border-white/10 space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-400">Next Rank</span>
              <span className="text-gold font-bold">{levelInfo.progressPercent}%</span>
            </div>
            <div className="w-full h-2.5 bg-obsidian-900 rounded-full overflow-hidden border border-white/5">
              <div 
                className="h-full bg-gradient-to-r from-gold to-crimson rounded-full transition-all duration-500"
                style={{ width: `${levelInfo.progressPercent}%` }}
              />
            </div>
            <div className="text-[10px] font-mono text-slate-500 text-right">
              {levelInfo.maxXp - profile.xp} XP to next tier
            </div>
          </div>
        </div>
      </div>

      {/* Milestone Badges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {milestones.map((m) => {
          const IconComp = ICON_MAP[m.icon] || Award;
          
          // Dynamic calculation of progress
          let currentProg = 0;
          if (m.id === 'first-spark') currentProg = Math.min(1, totalCompletions);
          else if (m.id === 'century-club') currentProg = Math.min(100, totalCompletions);
          else if (m.id === 'titan-365') currentProg = Math.min(365, logs.length > 0 ? Math.floor(logs.length / Math.max(1, habits.length)) : 0);
          else currentProg = m.progress || 0;

          const isUnlocked = currentProg >= m.target || m.unlocked;
          const progPercent = Math.min(100, Math.round((currentProg / m.target) * 100));

          return (
            <div 
              key={m.id}
              className={`p-5 rounded-2xl border transition-all duration-300 backdrop-blur-xl ${
                isUnlocked
                  ? 'bg-obsidian-900/90 border-white/20 shadow-obsidian-card'
                  : 'bg-obsidian-950/60 border-white/5 opacity-75'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${
                  isUnlocked ? tierBadges[m.tier] : 'border-white/5 bg-obsidian-900 text-slate-600'
                }`}>
                  {isUnlocked ? (
                    <IconComp className="w-6 h-6 animate-pulse-subtle" />
                  ) : (
                    <Lock className="w-5 h-5" />
                  )}
                </div>

                <span className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded border ${
                  isUnlocked ? tierBadges[m.tier] : 'text-slate-600 border-white/5 bg-transparent'
                }`}>
                  {m.tier}
                </span>
              </div>

              <div className="mt-4 space-y-1">
                <div className="flex items-center space-x-2">
                  <h3 className="font-cinematic text-base font-bold text-white">
                    {m.title}
                  </h3>
                  {isUnlocked && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {m.description}
                </p>
              </div>

              {/* Progress Bar */}
              <div className="mt-4 pt-3 border-t border-white/5 space-y-1.5">
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-slate-500">Progress</span>
                  <span className={isUnlocked ? 'text-emerald-400 font-bold' : 'text-slate-400'}>
                    {currentProg} / {m.target}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-obsidian-950 rounded-full overflow-hidden border border-white/5">
                  <div 
                    className={`h-full transition-all duration-300 ${
                      isUnlocked ? 'bg-emerald-400' : 'bg-crimson'
                    }`}
                    style={{ width: `${progPercent}%` }}
                  />
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
