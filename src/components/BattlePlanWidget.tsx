import React, { useState } from 'react';
import { useHabits } from '../context/HabitContext';
import { formatDateDisplay, getTomorrowDateString } from '../utils/storage';
import { 
  Target, 
  CheckSquare, 
  Square, 
  Trash2, 
  Lightbulb, 
  Calendar, 
  ArrowRight
} from 'lucide-react';

export const BattlePlanWidget: React.FC = () => {
  const { 
    selectedDate, 
    addTask, 
    planTomorrowTask, 
    toggleTaskCompleted, 
    deleteTask, 
    getTasksForDate,
    addInsight,
    deleteInsight,
    getInsightsForDate
  } = useHabits();

  const [activeTab, setActiveTab] = useState<'today_tasks' | 'tomorrow_planner' | 'insights'>('today_tasks');
  const [taskInput, setTaskInput] = useState('');
  const [taskPriority, setTaskPriority] = useState<'high' | 'medium' | 'normal'>('high');
  
  const [tomorrowTaskInput, setTomorrowTaskInput] = useState('');
  const [tomorrowPriority, setTomorrowPriority] = useState<'high' | 'medium' | 'normal'>('high');
  
  const [insightInput, setInsightInput] = useState('');

  const todayTasks = getTasksForDate(selectedDate) || [];
  const tomorrowStr = getTomorrowDateString();
  const tomorrowTasks = getTasksForDate(tomorrowStr) || [];
  const todayInsights = getInsightsForDate(selectedDate) || [];

  const handleAddTodayTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskInput.trim()) return;
    addTask(taskInput, selectedDate, taskPriority);
    setTaskInput('');
  };

  const handleAddTomorrowTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tomorrowTaskInput.trim()) return;
    planTomorrowTask(tomorrowTaskInput, tomorrowPriority);
    setTomorrowTaskInput('');
  };

  const handleAddInsight = (e: React.FormEvent) => {
    e.preventDefault();
    if (!insightInput.trim()) return;
    addInsight(insightInput, selectedDate);
    setInsightInput('');
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-obsidian-900 via-obsidian-850 to-obsidian-900 p-5 backdrop-blur-xl shadow-obsidian-card space-y-4">
      
      {/* Top Header Row & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-cinematic text-sm sm:text-base font-bold text-white tracking-wide">
              Strategic Battle Plan & Insights
            </h3>
            <p className="text-[11px] text-slate-400 font-mono">
              Action items for {formatDateDisplay(selectedDate)}
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center space-x-1 p-1 rounded-xl bg-obsidian-950 border border-white/10 text-xs font-mono">
          <button
            type="button"
            onClick={() => setActiveTab('today_tasks')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center space-x-1.5 ${
              activeTab === 'today_tasks' 
                ? 'bg-crimson text-white font-bold shadow-glow-crimson' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Action Tasks</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-black/40">
              {todayTasks.filter(t => !t.completed).length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('tomorrow_planner')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center space-x-1.5 ${
              activeTab === 'tomorrow_planner' 
                ? 'bg-gold text-obsidian-950 font-bold shadow-glow-gold' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Plan Tomorrow</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-black/40 text-white">
              {tomorrowTasks.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('insights')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center space-x-1.5 ${
              activeTab === 'insights' 
                ? 'bg-cyan-500 text-obsidian-950 font-bold shadow-glow-cyan' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Lightbulb className="w-3 h-3" />
            <span>Insights ({todayInsights.length})</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Today's Action Tasks */}
      {activeTab === 'today_tasks' && (
        <div className="space-y-3 animate-fade-in">
          
          {/* Quick Add Form */}
          <form onSubmit={handleAddTodayTask} className="flex gap-2">
            <input
              type="text"
              required
              placeholder="Add key priority task for today..."
              value={taskInput}
              onChange={(e) => setTaskInput(e.target.value)}
              className="flex-1 px-3.5 py-2 rounded-xl bg-obsidian-950 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-crimson"
            />
            <select
              value={taskPriority}
              onChange={(e) => setTaskPriority(e.target.value as 'high' | 'medium' | 'normal')}
              className="px-2.5 py-2 rounded-xl bg-obsidian-950 border border-white/10 text-xs text-slate-300 focus:outline-none focus:border-crimson font-mono"
            >
              <option value="high">⚡ Critical</option>
              <option value="medium">🔥 Important</option>
              <option value="normal">Normal</option>
            </select>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-crimson hover:bg-crimson-glow text-white text-xs font-bold shadow-glow-crimson transition-all"
            >
              Add Task
            </button>
          </form>

          {/* Tasks List */}
          {todayTasks.length > 0 ? (
            <div className="space-y-2">
              {todayTasks.map(task => (
                <div
                  key={task.id}
                  className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                    task.completed 
                      ? 'bg-obsidian-950/40 border-white/5 opacity-60' 
                      : 'bg-obsidian-950/80 border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center space-x-3 flex-1 pr-2">
                    <button
                      type="button"
                      onClick={() => toggleTaskCompleted(task.id)}
                      className="text-slate-400 hover:text-crimson transition-colors"
                    >
                      {task.completed ? (
                        <CheckSquare className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-500" />
                      )}
                    </button>
                    <span className={`text-xs ${task.completed ? 'line-through text-slate-500' : 'text-slate-200 font-medium'}`}>
                      {task.title}
                    </span>
                    {task.priority === 'high' && (
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-crimson/20 text-crimson border border-crimson/30">
                        CRITICAL
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => deleteTask(task.id)}
                    className="p-1 rounded text-slate-600 hover:text-crimson hover:bg-crimson/10 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-xs font-mono text-slate-500 border border-dashed border-white/10 rounded-xl">
              No specific action tasks scheduled for this day yet. Add one above or plan tomorrow's directives!
            </div>
          )}

        </div>
      )}

      {/* Tab 2: Tomorrow's Strategic Planner */}
      {activeTab === 'tomorrow_planner' && (
        <div className="space-y-3 animate-fade-in">
          
          <div className="p-3 rounded-xl bg-gold/10 border border-gold/30 text-xs font-mono text-gold flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>Planning for Tomorrow: {formatDateDisplay(tomorrowStr)}</span>
            </div>
            <span className="text-[10px] text-slate-400">Loads automatically tomorrow</span>
          </div>

          {/* Tomorrow Add Form */}
          <form onSubmit={handleAddTomorrowTask} className="flex gap-2">
            <input
              type="text"
              required
              placeholder="What are tomorrow's 3 non-negotiable battles?"
              value={tomorrowTaskInput}
              onChange={(e) => setTomorrowTaskInput(e.target.value)}
              className="flex-1 px-3.5 py-2 rounded-xl bg-obsidian-950 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-gold"
            />
            <select
              value={tomorrowPriority}
              onChange={(e) => setTomorrowPriority(e.target.value as 'high' | 'medium' | 'normal')}
              className="px-2.5 py-2 rounded-xl bg-obsidian-950 border border-white/10 text-xs text-slate-300 focus:outline-none focus:border-gold font-mono"
            >
              <option value="high">⚡ Critical</option>
              <option value="medium">🔥 Important</option>
              <option value="normal">Normal</option>
            </select>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-gold hover:bg-gold-glow text-obsidian-950 text-xs font-bold shadow-glow-gold transition-all"
            >
              Lock for Tomorrow
            </button>
          </form>

          {/* Tomorrow Tasks Preview */}
          {tomorrowTasks.length > 0 ? (
            <div className="space-y-2">
              {tomorrowTasks.map(task => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-obsidian-950/80 border border-white/10"
                >
                  <div className="flex items-center space-x-2.5">
                    <ArrowRight className="w-3.5 h-3.5 text-gold" />
                    <span className="text-xs text-slate-200 font-medium">{task.title}</span>
                    {task.priority === 'high' && (
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-gold/20 text-gold border border-gold/30">
                        CRITICAL
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => deleteTask(task.id)}
                    className="p-1 rounded text-slate-600 hover:text-crimson hover:bg-crimson/10 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-xs font-mono text-slate-500 border border-dashed border-white/10 rounded-xl">
              Tomorrow is an unwritten slate. Pre-commit your top priorities tonight so you wake up with zero hesitation.
            </div>
          )}

        </div>
      )}

      {/* Tab 3: Daily Insights & Wisdom */}
      {activeTab === 'insights' && (
        <div className="space-y-3 animate-fade-in">
          
          <form onSubmit={handleAddInsight} className="flex gap-2">
            <input
              type="text"
              required
              placeholder="What principle or tactical lesson did you realize today?"
              value={insightInput}
              onChange={(e) => setInsightInput(e.target.value)}
              className="flex-1 px-3.5 py-2 rounded-xl bg-obsidian-950 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-obsidian-950 text-xs font-bold shadow-glow-cyan transition-all"
            >
              Log Insight (+20 XP)
            </button>
          </form>

          {todayInsights.length > 0 ? (
            <div className="space-y-2">
              {todayInsights.map(insight => (
                <div
                  key={insight.id}
                  className="flex items-start justify-between p-3 rounded-xl bg-obsidian-950/80 border border-cyan-500/20"
                >
                  <div className="flex items-start space-x-2.5">
                    <Lightbulb className="w-3.5 h-3.5 text-cyan-400 mt-0.5" />
                    <p className="text-xs text-slate-200 italic leading-relaxed">
                      "{insight.content}"
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => deleteInsight(insight.id)}
                    className="p-1 rounded text-slate-600 hover:text-crimson hover:bg-crimson/10 transition-colors ml-2"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-xs font-mono text-slate-500 border border-dashed border-white/10 rounded-xl">
              No wisdom insights captured yet for this date. Write a quick realization above.
            </div>
          )}

        </div>
      )}

    </div>
  );
};
