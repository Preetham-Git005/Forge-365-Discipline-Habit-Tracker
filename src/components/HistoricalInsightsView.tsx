import React, { useState, useMemo } from 'react';
import { useHabits } from '../context/HabitContext';
import { 
  generateWeeklyInsights, 
  generateMonthlyInsights, 
  generateYearlyInsights 
} from '../utils/analyticsEngine';
import { 
  Brain, 
  Flame, 
  TrendingUp, 
  Trophy, 
  Zap, 
  CheckCircle2, 
  Lightbulb 
} from 'lucide-react';

export const HistoricalInsightsView: React.FC = () => {
  const { habits, logs, reflections, profile } = useHabits();
  const [timeframe, setTimeframe] = useState<'weekly' | 'monthly' | 'yearly'>('weekly');

  const weeklyReport = useMemo(() => 
    generateWeeklyInsights(habits, logs, reflections),
    [habits, logs, reflections]
  );

  const monthlyReport = useMemo(() => 
    generateMonthlyInsights(habits, logs, reflections),
    [habits, logs, reflections]
  );

  const yearlyReport = useMemo(() => 
    generateYearlyInsights(profile, habits, logs),
    [profile, habits, logs]
  );

  return (
    <div className="space-y-6">
      
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-obsidian-900 via-obsidian-850 to-obsidian-900 border border-white/10 backdrop-blur-xl shadow-obsidian-card">
        <div>
          <div className="flex items-center space-x-2">
            <Brain className="w-5 h-5 text-cyan-400" />
            <h2 className="font-cinematic text-xl sm:text-2xl font-bold text-white tracking-wide">
              Stoic Intelligence & Historical Diagnostics
            </h2>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Algorithmic performance reports computed across your 7-day, 30-day, and 365-day tracking trajectory.
          </p>
        </div>

        {/* Timeframe Selector */}
        <div className="flex items-center space-x-1 p-1 rounded-xl bg-obsidian-950 border border-white/10 text-xs font-mono self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setTimeframe('weekly')}
            className={`px-3.5 py-1.5 rounded-lg transition-all ${
              timeframe === 'weekly' 
                ? 'bg-crimson text-white font-bold shadow-glow-crimson' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Weekly Debrief (7D)
          </button>

          <button
            type="button"
            onClick={() => setTimeframe('monthly')}
            className={`px-3.5 py-1.5 rounded-lg transition-all ${
              timeframe === 'monthly' 
                ? 'bg-gold text-obsidian-950 font-bold shadow-glow-gold' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Monthly Crucible (30D)
          </button>

          <button
            type="button"
            onClick={() => setTimeframe('yearly')}
            className={`px-3.5 py-1.5 rounded-lg transition-all ${
              timeframe === 'yearly' 
                ? 'bg-cyan-500 text-obsidian-950 font-bold shadow-glow-cyan' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Year Trajectory (365D)
          </button>
        </div>
      </div>

      {/* WEEKLY REPORT VIEW */}
      {timeframe === 'weekly' && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Top Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="p-5 rounded-2xl bg-obsidian-900/80 border border-white/10 shadow-obsidian-card">
              <div className="flex items-center justify-between text-xs font-mono uppercase text-slate-400">
                <span>7-Day Volume</span>
                <Flame className="w-4 h-4 text-crimson" />
              </div>
              <div className="text-3xl font-extrabold font-mono text-white mt-2">
                {weeklyReport.totalCompletions}
              </div>
              <p className="text-[11px] text-slate-500 font-mono mt-1">Check-ins recorded</p>
            </div>

            <div className="p-5 rounded-2xl bg-obsidian-900/80 border border-white/10 shadow-obsidian-card">
              <div className="flex items-center justify-between text-xs font-mono uppercase text-slate-400">
                <span>Weekly Velocity</span>
                <TrendingUp className="w-4 h-4 text-gold" />
              </div>
              <div className="text-3xl font-extrabold font-mono text-gold mt-2">
                {weeklyReport.completionRate}%
              </div>
              <p className="text-[11px] text-slate-500 font-mono mt-1">Execution consistency</p>
            </div>

            <div className="p-5 rounded-2xl bg-obsidian-900/80 border border-white/10 shadow-obsidian-card">
              <div className="flex items-center justify-between text-xs font-mono uppercase text-slate-400">
                <span>Flawless Days</span>
                <Trophy className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-3xl font-extrabold font-mono text-emerald-400 mt-2">
                {weeklyReport.perfectDays} / 7
              </div>
              <p className="text-[11px] text-slate-500 font-mono mt-1">100% habits cleared</p>
            </div>

            <div className="p-5 rounded-2xl bg-obsidian-900/80 border border-white/10 shadow-obsidian-card">
              <div className="flex items-center justify-between text-xs font-mono uppercase text-slate-400">
                <span>Peak Rhythm</span>
                <Zap className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-xl font-cinematic font-bold text-white mt-2">
                {weeklyReport.strongestDay.day}
              </div>
              <p className="text-[11px] text-slate-500 font-mono mt-1">
                {weeklyReport.strongestDay.rate}% adherence
              </p>
            </div>

          </div>

          {/* Deep Insight Analysis Card */}
          <div className="p-6 rounded-2xl bg-obsidian-900/90 border border-white/10 backdrop-blur-2xl space-y-5">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center space-x-2.5">
                <Brain className="w-5 h-5 text-crimson" />
                <h3 className="font-cinematic text-lg font-bold text-white">
                  Tactical Debrief & Momentum Analysis
                </h3>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-crimson/20 text-crimson border border-crimson/30">
                {weeklyReport.momentumLabel}
              </span>
            </div>

            <p className="text-sm text-slate-200 leading-relaxed font-sans">
              {weeklyReport.summary}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              
              <div className="p-4 rounded-xl bg-obsidian-950/70 border border-emerald-500/20 space-y-2">
                <div className="flex items-center space-x-2 text-emerald-400 text-xs font-mono uppercase font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Strongest Performing Pillar</span>
                </div>
                <div className="text-sm text-slate-200 font-medium">
                  {weeklyReport.topHabit?.title || 'Daily Discipline Rituals'}
                </div>
                <p className="text-xs text-slate-400">
                  Maintained consistent execution throughout the 7-day cycle.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-obsidian-950/70 border border-amber-500/20 space-y-2">
                <div className="flex items-center space-x-2 text-amber-400 text-xs font-mono uppercase font-bold">
                  <Lightbulb className="w-4 h-4" />
                  <span>Tactical Correction Recommendation</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {weeklyReport.tacticalAdvice}
                </p>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* MONTHLY REPORT VIEW */}
      {timeframe === 'monthly' && (
        <div className="space-y-6 animate-fade-in">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            <div className="p-6 rounded-2xl bg-gradient-to-br from-obsidian-900 via-obsidian-850 to-obsidian-900 border border-white/10 shadow-obsidian-card flex items-center justify-between">
              <div>
                <span className="text-xs font-mono uppercase text-slate-400">Monthly Grade</span>
                <div className="text-xl font-cinematic font-bold text-white mt-1">
                  {monthlyReport.disciplineGrade.title}
                </div>
                <p className="text-xs text-slate-400 font-mono mt-1">
                  {monthlyReport.consistencyRate}% 30-Day Index
                </p>
              </div>
              <div className="text-5xl font-cinematic font-black text-gold">
                {monthlyReport.disciplineGrade.grade}
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-obsidian-900/80 border border-white/10 shadow-obsidian-card">
              <span className="text-xs font-mono uppercase text-slate-400">Total Check-Ins</span>
              <div className="text-3xl font-extrabold font-mono text-white mt-1">
                {monthlyReport.totalCompletions}
              </div>
              <p className="text-xs text-slate-500 font-mono mt-1">Across 30 days</p>
            </div>

            <div className="p-6 rounded-2xl bg-obsidian-900/80 border border-white/10 shadow-obsidian-card">
              <span className="text-xs font-mono uppercase text-slate-400">Flawless Day Ratio</span>
              <div className="text-3xl font-extrabold font-mono text-emerald-400 mt-1">
                {monthlyReport.perfectDaysRatio.perfect} / 30
              </div>
              <p className="text-xs text-slate-500 font-mono mt-1">
                {monthlyReport.perfectDaysRatio.percent}% of the month flawless
              </p>
            </div>

          </div>

          {/* Sphere Balance Breakdown */}
          <div className="p-6 rounded-2xl bg-obsidian-900/90 border border-white/10 backdrop-blur-2xl space-y-4">
            <h3 className="font-cinematic text-lg font-bold text-white">
              Life Pillar Distribution (Past 30 Days)
            </h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {monthlyReport.sphereDistribution.map(s => (
                <div key={s.sphere} className="p-3.5 rounded-xl bg-obsidian-950/70 border border-white/5 space-y-1 text-center">
                  <span className="text-xs font-mono text-slate-400 uppercase">{s.sphere}</span>
                  <div className="text-xl font-bold font-mono" style={{ color: s.color }}>
                    {s.count}
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">{s.percent}% share</span>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-xl bg-obsidian-950/80 border border-gold/20 text-xs text-slate-300 leading-relaxed mt-4">
              <strong>Stoic Diagnostic:</strong> {monthlyReport.summary} {monthlyReport.keyWin}
            </div>
          </div>

        </div>
      )}

      {/* YEARLY REPORT VIEW */}
      {timeframe === 'yearly' && (
        <div className="space-y-6 animate-fade-in">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            <div className="p-6 rounded-2xl bg-gradient-to-br from-obsidian-900 via-obsidian-850 to-obsidian-900 border border-white/10 shadow-obsidian-card">
              <span className="text-xs font-mono uppercase text-slate-400">1-Year Forge Trajectory</span>
              <div className="text-3xl font-extrabold font-mono text-cyan-400 mt-2">
                Day {yearlyReport.daysElapsed} of 365
              </div>
              <p className="text-xs text-slate-500 font-mono mt-1">
                {yearlyReport.daysRemaining} days remaining in cycle
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-obsidian-900/80 border border-white/10 shadow-obsidian-card">
              <span className="text-xs font-mono uppercase text-slate-400">Projected Year Volume</span>
              <div className="text-3xl font-extrabold font-mono text-gold mt-2">
                ~{yearlyReport.projectedAnnualCompletions}
              </div>
              <p className="text-xs text-slate-500 font-mono mt-1">
                Estimated check-ins by Day 365
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-obsidian-900/80 border border-white/10 shadow-obsidian-card">
              <span className="text-xs font-mono uppercase text-slate-400">Archetype Classification</span>
              <div className="text-xl font-cinematic font-bold text-white mt-2">
                {yearlyReport.archetype.title}
              </div>
              <p className="text-[11px] text-slate-400 font-mono mt-1">
                {yearlyReport.archetype.subtitle}
              </p>
            </div>

          </div>

          <div className="p-6 rounded-2xl bg-obsidian-900/90 border border-white/10 backdrop-blur-2xl space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 font-bold">
                365
              </div>
              <div>
                <h3 className="font-cinematic text-lg font-bold text-white">
                  Annual Forge Master Narrative
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  {yearlyReport.archetype.description}
                </p>
              </div>
            </div>

            <p className="text-sm text-slate-200 leading-relaxed font-sans p-4 rounded-xl bg-obsidian-950/70 border border-white/5">
              {yearlyReport.summary}
            </p>
          </div>

        </div>
      )}

    </div>
  );
};
