import React, { useState } from 'react';
import { useHabits } from '../context/HabitContext';
import type { Goal, HabitCategory, GoalType } from '../types';
import { formatDateDisplay } from '../utils/storage';
import { 
  Target, 
  Plus, 
  Trash2, 
  Edit3, 
  Clock, 
  Flame, 
  Link2, 
  TrendingUp, 
  X,
  Brain,
  Dumbbell,
  BookOpen,
  Zap,
  Activity,
  Layers,
  CheckCircle2,
  Circle,
  Sparkles
} from 'lucide-react';

const ICON_MAP: Record<string, React.ElementType> = {
  Brain,
  Dumbbell,
  BookOpen,
  Flame,
  Zap,
  Activity,
  Target,
  Sparkles
};

interface GoalsSectionProps {
  onOpenNewHabitForGoal?: (goalId: string) => void;
}

export const GoalsSection: React.FC<GoalsSectionProps> = ({ onOpenNewHabitForGoal }) => {
  const { 
    goals, 
    habits, 
    addGoal, 
    updateGoal, 
    deleteGoal, 
    toggleMilestoneGoalCompleted,
    linkHabitToGoal, 
    unlinkHabitFromGoal, 
    getGoalProgress 
  } = useHabits();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [linkingGoalId, setLinkingGoalId] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [goalType, setGoalType] = useState<GoalType>('progressive');
  const [targetDate, setTargetDate] = useState('');
  const [category, setCategory] = useState<HabitCategory>('craft');
  const [icon, setIcon] = useState('Brain');
  const [color, setColor] = useState('#D4AF37');

  const openCreateModal = () => {
    setEditingGoal(null);
    setTitle('');
    setDescription('');
    setGoalType('progressive');
    setTargetDate('');
    setCategory('craft');
    setIcon('Brain');
    setColor('#D4AF37');
    setIsModalOpen(true);
  };

  const openEditModal = (goal: Goal) => {
    setEditingGoal(goal);
    setTitle(goal.title);
    setDescription(goal.description || '');
    setGoalType(goal.type || 'progressive');
    setTargetDate(goal.targetDate || '');
    setCategory(goal.category);
    setIcon(goal.icon || 'Brain');
    setColor(goal.color || '#D4AF37');
    setIsModalOpen(true);
  };

  const handleSaveGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingGoal) {
      updateGoal({
        ...editingGoal,
        title: title.trim(),
        description: description.trim(),
        type: goalType,
        targetDate: targetDate || undefined,
        category,
        icon,
        color
      });
    } else {
      addGoal({
        title: title.trim(),
        description: description.trim(),
        type: goalType,
        completed: false,
        targetDate: targetDate || undefined,
        category,
        status: 'in_progress',
        color,
        icon,
        linkedHabitIds: []
      });
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-obsidian-900 via-obsidian-850 to-obsidian-900 border border-white/10 backdrop-blur-xl shadow-obsidian-card">
        <div>
          <div className="flex items-center space-x-2">
            <Target className="w-5 h-5 text-gold" />
            <h2 className="font-cinematic text-xl sm:text-2xl font-bold text-white tracking-wide">
              Grand Objectives & Unfinished Summits
            </h2>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Choose between **Progressive Tracking Goals** (habit-backed) and **Milestone Goals** (1-click checkoff).
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gold hover:bg-gold-glow text-obsidian-950 font-bold text-xs shadow-glow-gold transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>New Grand Objective</span>
        </button>
      </div>

      {/* Goals Grid */}
      {goals.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {goals.map(goal => {
            const progress = getGoalProgress(goal.id);
            const IconC = ICON_MAP[goal.icon] || Target;
            const isMilestone = goal.type === 'milestone';
            const isCompleted = isMilestone ? goal.completed : goal.status === 'achieved';

            return (
              <div
                key={goal.id}
                className={`rounded-2xl border transition-all duration-300 backdrop-blur-xl p-6 space-y-4 ${
                  isCompleted
                    ? 'bg-obsidian-900/90 border-emerald-500/40 shadow-glow-emerald'
                    : 'bg-obsidian-900/80 border-white/10 hover:border-gold/40 shadow-obsidian-card'
                }`}
              >
                {/* Top Info */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start space-x-3">
                    <div 
                      className="w-11 h-11 rounded-xl flex items-center justify-center border shadow-md mt-0.5"
                      style={{ backgroundColor: `${goal.color}20`, borderColor: `${goal.color}50`, color: goal.color }}
                    >
                      <IconC className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-1.5 mb-1">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-white/5 text-slate-300 border border-white/10">
                          {goal.category}
                        </span>
                        
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider font-bold ${
                          isMilestone ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'bg-gold/20 text-gold border border-gold/30'
                        }`}>
                          {isMilestone ? 'Milestone' : 'Progressive'}
                        </span>

                        {goal.targetDate && (
                          <span className="text-[11px] font-mono text-slate-400 flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>Target: {formatDateDisplay(goal.targetDate)}</span>
                          </span>
                        )}
                      </div>

                      <h3 className={`text-base sm:text-lg font-cinematic font-bold text-white transition-colors ${
                        isCompleted && isMilestone ? 'line-through decoration-emerald-400/80 text-slate-300' : ''
                      }`}>
                        {goal.title}
                      </h3>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => openEditModal(goal)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                      title="Edit Goal"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteGoal(goal.id)}
                      className="p-1.5 rounded-lg text-slate-600 hover:text-crimson hover:bg-crimson/10 transition-colors"
                      title="Delete Goal"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Description */}
                {goal.description && (
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {goal.description}
                  </p>
                )}

                {/* MILESTONE TYPE GOAL: Simple Direct Check / Uncheck Card */}
                {isMilestone ? (
                  <div className="p-4 rounded-xl bg-obsidian-950/80 border border-white/10 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-mono text-slate-400">Milestone Status:</div>
                      <div className={`text-sm font-bold font-mono ${isCompleted ? 'text-emerald-400' : 'text-slate-300'}`}>
                        {isCompleted ? '✓ Conquered & Achieved' : 'Pending Achievement'}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleMilestoneGoalCompleted(goal.id)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all duration-200 active:scale-95 ${
                        isCompleted
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-glow-emerald'
                          : 'bg-gold hover:bg-gold-glow text-obsidian-950 shadow-glow-gold'
                      }`}
                    >
                      {isCompleted ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 fill-emerald-500 text-obsidian-950" />
                          <span>Conquered</span>
                        </>
                      ) : (
                        <>
                          <Circle className="w-4 h-4" />
                          <span>Mark Conquered (+150 XP)</span>
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  /* PROGRESSIVE TYPE GOAL: Habit Tracking Bar & Attached Habits */
                  <>
                    <div className="p-3.5 rounded-xl bg-obsidian-950/70 border border-white/5 space-y-2">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-slate-400 flex items-center space-x-1">
                          <TrendingUp className="w-3.5 h-3.5 text-gold" />
                          <span>Habit Execution Rate</span>
                        </span>
                        <span className="text-gold font-bold">{progress.completionRate}%</span>
                      </div>
                      <div className="w-full h-2.5 bg-obsidian-900 rounded-full overflow-hidden border border-white/5">
                        <div 
                          className="h-full rounded-full transition-all duration-500 shadow-glow-gold"
                          style={{ 
                            width: `${progress.completionRate}%`,
                            backgroundColor: goal.color || '#D4AF37'
                          }}
                        />
                      </div>
                      <div className="flex justify-between text-[11px] font-mono text-slate-500 pt-0.5">
                        <span>{progress.totalCompletions} Total Check-Ins</span>
                        <span>{progress.daysActive} Active Days</span>
                      </div>
                    </div>

                    {/* Attached Habits Section */}
                    <div className="space-y-2 pt-1 border-t border-white/5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono uppercase text-slate-400 font-bold flex items-center space-x-1.5">
                          <Layers className="w-3.5 h-3.5 text-crimson" />
                          <span>Linked Habits ({goal.linkedHabitIds.length})</span>
                        </span>
                        <div className="flex items-center space-x-2">
                          {onOpenNewHabitForGoal && (
                            <button
                              type="button"
                              onClick={() => onOpenNewHabitForGoal(goal.id)}
                              className="text-xs font-mono text-crimson hover:text-crimson-glow flex items-center space-x-1"
                            >
                              <Plus className="w-3 h-3" />
                              <span>New Dedicated</span>
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => setLinkingGoalId(linkingGoalId === goal.id ? null : goal.id)}
                            className="text-xs font-mono text-gold hover:text-gold-glow flex items-center space-x-1"
                          >
                            <Link2 className="w-3 h-3" />
                            <span>Attach Existing</span>
                          </button>
                        </div>
                      </div>

                      {/* Habit Linker Dropdown */}
                      {linkingGoalId === goal.id && (
                        <div className="p-3 rounded-xl bg-obsidian-950 border border-gold/30 space-y-2 animate-fade-in">
                          <div className="text-[11px] font-mono text-slate-400">
                            Select a habit to tie into this grand objective:
                          </div>
                          <div className="max-h-36 overflow-y-auto space-y-1">
                            {habits.filter(h => !goal.linkedHabitIds.includes(h.id)).map(h => (
                              <div 
                                key={h.id}
                                className="flex items-center justify-between p-2 rounded-lg bg-obsidian-900 border border-white/5 hover:border-white/20 text-xs font-mono text-slate-200"
                              >
                                <span>{h.title}</span>
                                <button
                                  type="button"
                                  onClick={() => { linkHabitToGoal(goal.id, h.id); setLinkingGoalId(null); }}
                                  className="px-2 py-0.5 rounded bg-gold/20 text-gold border border-gold/30 hover:bg-gold hover:text-obsidian-950 transition-colors text-[10px] font-bold"
                                >
                                  Attach
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* List of Attached Habits Chips */}
                      <div className="flex flex-wrap gap-2">
                        {goal.linkedHabitIds.map(hId => {
                          const linkedH = habits.find(h => h.id === hId);
                          if (!linkedH) return null;

                          return (
                            <div 
                              key={hId}
                              className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-obsidian-950 border border-white/10 text-xs font-mono text-slate-200"
                            >
                              <Flame className="w-3 h-3 text-crimson" />
                              <span>{linkedH.title}</span>
                              <button
                                type="button"
                                onClick={() => unlinkHabitFromGoal(goal.id, hId)}
                                className="text-slate-500 hover:text-crimson ml-1"
                                title="Unlink habit"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          );
                        })}

                        {goal.linkedHabitIds.length === 0 && (
                          <div className="text-xs font-mono text-slate-500 italic">
                            No habits attached yet. Connect your daily routines to forge progress!
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}

              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-12 text-center rounded-2xl bg-obsidian-900/60 border border-white/10 backdrop-blur-md space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-gold/10 border border-gold/30 mx-auto flex items-center justify-center text-gold">
            <Target className="w-7 h-7" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="text-lg font-cinematic font-bold text-white">No Grand Objectives Created</h3>
            <p className="text-xs text-slate-400">
              Define high-stakes long-term targets (e.g. Monetize Knowledge, Get Your First Book, Spartan Conditioning).
            </p>
          </div>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-gold text-obsidian-950 font-bold text-xs shadow-glow-gold"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Create First Objective</span>
          </button>
        </div>
      )}

      {/* Goal Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-950/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-lg rounded-2xl bg-obsidian-900 border border-white/15 shadow-2xl overflow-hidden">
            
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <div className="flex items-center space-x-2">
                <Target className="w-5 h-5 text-gold" />
                <h3 className="font-cinematic text-lg font-bold text-white">
                  {editingGoal ? 'Edit Grand Objective' : 'Forge Grand Objective'}
                </h3>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveGoal} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              
              {/* Title */}
              <div>
                <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5 font-bold">
                  Objective Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Get your first book, Monetize Knowledge & Craft"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-obsidian-950 border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-gold"
                />
              </div>

              {/* Goal Type Choice: Progressive vs Milestone */}
              <div>
                <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5 font-bold">
                  Goal Mode & Structure
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setGoalType('progressive')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      goalType === 'progressive'
                        ? 'bg-gold/20 text-gold border-gold font-bold shadow-glow-gold'
                        : 'bg-obsidian-950 text-slate-400 border-white/10'
                    }`}
                  >
                    <div className="font-mono text-xs font-bold">📈 Progressive Tracking</div>
                    <div className="text-[10px] text-slate-400 font-sans mt-0.5">
                      Tracked continuously via daily linked habits (e.g. Complete book, Gym conditioning).
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setGoalType('milestone')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      goalType === 'milestone'
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 font-bold shadow-glow-cyan'
                        : 'bg-obsidian-950 text-slate-400 border-white/10'
                    }`}
                  >
                    <div className="font-mono text-xs font-bold">✓ Direct Check / Uncheck</div>
                    <div className="text-[10px] text-slate-400 font-sans mt-0.5">
                      Single milestone event (e.g. Get first book, Buy gym equipment, Sign contract).
                    </div>
                  </button>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5 font-bold">
                  Strategic Scope & Purpose
                </label>
                <textarea
                  rows={2}
                  placeholder="Why does achieving this summit redefine your life?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-obsidian-950 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-gold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5 font-bold">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as HabitCategory)}
                    className="w-full px-3 py-2 rounded-xl bg-obsidian-950 border border-white/10 text-xs text-white focus:outline-none focus:border-gold"
                  >
                    <option value="craft">Craft & Wealth</option>
                    <option value="mind">Mind & Wisdom</option>
                    <option value="body">Body & Caliber</option>
                    <option value="soul">Soul & Peace</option>
                    <option value="vitality">Vitality & Health</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5 font-bold">
                    Target Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-obsidian-950 border border-white/10 text-xs text-white focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gold hover:bg-gold-glow text-obsidian-950 text-xs font-bold shadow-glow-gold"
                >
                  {editingGoal ? 'Save Objective' : 'Forge Objective'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
