import React, { useState } from 'react';
import { useHabits } from '../context/HabitContext';
import type { Challenge, HabitCategory } from '../types';
import { getTodayDateString } from '../utils/storage';
import { 
  Flame, 
  Trophy, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle, 
  Dumbbell, 
  Brain, 
  Shield, 
  BookOpen, 
  Zap, 
  Activity, 
  Sparkles,
  X
} from 'lucide-react';

const ICON_MAP: Record<string, React.ElementType> = {
  Dumbbell,
  Brain,
  Shield,
  BookOpen,
  Flame,
  Zap,
  Activity,
  Trophy,
  Sparkles
};

export const ChallengesSection: React.FC = () => {
  const { 
    challenges, 
    habits, 
    addChallenge, 
    updateChallenge, 
    deleteChallenge, 
    toggleChallengeCompletion, 
    getChallengeProgress 
  } = useHabits();

  const [activeTab, setActiveTab] = useState<'all' | 'weekly' | 'monthly'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingChallenge, setEditingChallenge] = useState<Challenge | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'weekly' | 'monthly'>('weekly');
  const [category, setCategory] = useState<HabitCategory>('body');
  const [targetCount, setTargetCount] = useState<number>(7);
  const [unit, setUnit] = useState('Days');
  const [rewardXp, setRewardXp] = useState<number>(350);
  const [color, setColor] = useState('#E63946');
  const [icon, setIcon] = useState('Dumbbell');
  const [linkedHabitId, setLinkedHabitId] = useState('');

  const openCreateModal = () => {
    setEditingChallenge(null);
    setTitle('');
    setDescription('');
    setType('weekly');
    setCategory('body');
    setTargetCount(7);
    setUnit('Days');
    setRewardXp(350);
    setColor('#E63946');
    setIcon('Dumbbell');
    setLinkedHabitId('');
    setIsModalOpen(true);
  };

  const openEditModal = (c: Challenge) => {
    setEditingChallenge(c);
    setTitle(c.title);
    setDescription(c.description);
    setType(c.type);
    setCategory(c.category);
    setTargetCount(c.targetCount);
    setUnit(c.unit || 'Days');
    setRewardXp(c.rewardXp);
    setColor(c.color);
    setIcon(c.icon);
    setLinkedHabitId(c.linkedHabitId || '');
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingChallenge) {
      updateChallenge({
        ...editingChallenge,
        title: title.trim(),
        description: description.trim(),
        type,
        category,
        targetCount: Number(targetCount),
        unit: unit.trim(),
        rewardXp: Number(rewardXp),
        color,
        icon,
        linkedHabitId: linkedHabitId || undefined
      });
    } else {
      addChallenge({
        title: title.trim(),
        description: description.trim(),
        type,
        category,
        targetCount: Number(targetCount),
        unit: unit.trim(),
        rewardXp: Number(rewardXp),
        color,
        icon,
        linkedHabitId: linkedHabitId || undefined,
        startDate: getTodayDateString(),
        endDate: '2027-12-31',
        status: 'active'
      });
    }

    setIsModalOpen(false);
  };

  const filteredChallenges = challenges.filter(c => 
    activeTab === 'all' || c.type === activeTab
  );

  return (
    <div className="space-y-6">
      
      {/* Top Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-obsidian-900 via-obsidian-850 to-obsidian-900 border border-white/10 backdrop-blur-xl shadow-obsidian-card">
        <div>
          <div className="flex items-center space-x-2">
            <Flame className="w-5 h-5 text-crimson" />
            <h2 className="font-cinematic text-xl sm:text-2xl font-bold text-white tracking-wide">
              Winter Arc & Periodic Challenges
            </h2>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Weekly & Monthly high-intensity discipline sprints for Gymrats and Stoic practitioners.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-crimson hover:bg-crimson-glow text-white font-bold text-xs shadow-glow-crimson transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Forge Custom Challenge</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 p-1 rounded-xl bg-obsidian-900 border border-white/10 w-fit">
        <button
          type="button"
          onClick={() => setActiveTab('all')}
          className={`px-4 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
            activeTab === 'all' ? 'bg-white/15 text-white' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          All Challenges ({challenges.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('weekly')}
          className={`px-4 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
            activeTab === 'weekly' ? 'bg-crimson text-white shadow-glow-crimson' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          ⚡ Weekly Sprints (7 Days)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('monthly')}
          className={`px-4 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
            activeTab === 'monthly' ? 'bg-gold text-obsidian-950 shadow-glow-gold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          🏆 Monthly Winter Arc (30 Days)
        </button>
      </div>

      {/* Challenges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredChallenges.map(challenge => {
          const progress = getChallengeProgress(challenge.id);
          const IconC = ICON_MAP[challenge.icon] || Dumbbell;
          const isCompleted = challenge.status === 'completed';
          const linkedHabit = habits.find(h => h.id === challenge.linkedHabitId);

          return (
            <div
              key={challenge.id}
              className={`rounded-2xl border transition-all duration-300 backdrop-blur-xl p-6 space-y-4 ${
                isCompleted
                  ? 'bg-obsidian-900/90 border-emerald-500/40 shadow-glow-emerald'
                  : 'bg-obsidian-900/80 border-white/10 hover:border-crimson/40 shadow-obsidian-card'
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start space-x-3">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center border shadow-md"
                    style={{ backgroundColor: `${challenge.color}20`, borderColor: `${challenge.color}50`, color: challenge.color }}
                  >
                    <IconC className="w-6 h-6" />
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-1.5 mb-1">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider font-bold ${
                        challenge.type === 'weekly' ? 'bg-crimson/20 text-crimson border border-crimson/30' : 'bg-gold/20 text-gold border border-gold/30'
                      }`}>
                        {challenge.type === 'weekly' ? '7-Day Sprint' : '30-Day Protocol'}
                      </span>

                      <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-white/5 text-slate-400 border border-white/5">
                        {challenge.category}
                      </span>

                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                        +{challenge.rewardXp} XP
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-cinematic font-bold text-white">
                      {challenge.title}
                    </h3>
                  </div>
                </div>

                {/* Edit & Delete */}
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => openEditModal(challenge)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => deleteChallenge(challenge.id)}
                    className="p-1.5 rounded-lg text-slate-600 hover:text-crimson hover:bg-crimson/10 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-300 leading-relaxed">
                {challenge.description}
              </p>

              {/* Linked Habit */}
              {linkedHabit && (
                <div className="flex items-center space-x-2 text-xs font-mono text-slate-400 bg-obsidian-950/60 p-2.5 rounded-xl border border-white/5">
                  <Flame className="w-3.5 h-3.5 text-crimson" />
                  <span>Tracking Habit: <strong className="text-slate-200">{linkedHabit.title}</strong></span>
                </div>
              )}

              {/* Progress & Completion */}
              <div className="p-3.5 rounded-xl bg-obsidian-950/80 border border-white/5 space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">Challenge Progress</span>
                  <span className="text-white font-bold">
                    {progress.currentCount} / {progress.targetCount} {challenge.unit} ({progress.percent}%)
                  </span>
                </div>

                <div className="w-full h-2.5 bg-obsidian-900 rounded-full overflow-hidden border border-white/5">
                  <div 
                    className="h-full rounded-full transition-all duration-500 shadow-glow-crimson"
                    style={{ 
                      width: `${progress.percent}%`,
                      backgroundColor: challenge.color || '#E63946'
                    }}
                  />
                </div>
              </div>

              {/* Bottom Action */}
              <div className="flex items-center justify-between pt-2 border-t border-white/5">
                <span className="text-[11px] font-mono text-slate-500">
                  {isCompleted ? '✓ Protocol Completed' : 'Active Challenge Cycle'}
                </span>

                <button
                  type="button"
                  onClick={() => toggleChallengeCompletion(challenge.id)}
                  className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold font-mono transition-all active:scale-95 ${
                    isCompleted 
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                      : 'bg-crimson hover:bg-crimson-glow text-white shadow-glow-crimson'
                  }`}
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>{isCompleted ? 'Completed' : 'Claim Completion'}</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Challenge Creation & Editing Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-950/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-lg rounded-2xl bg-obsidian-900 border border-white/15 shadow-2xl overflow-hidden">
            
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <div className="flex items-center space-x-2">
                <Flame className="w-5 h-5 text-crimson" />
                <h3 className="font-cinematic text-lg font-bold text-white">
                  {editingChallenge ? 'Edit Winter Arc Challenge' : 'Forge New Challenge'}
                </h3>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              
              <div>
                <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5 font-bold">
                  Challenge Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Winter Arc: 7-Day Iron Crucible"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-obsidian-950 border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-crimson"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5 font-bold">
                  Duration & Cadence
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => { setType('weekly'); setTargetCount(7); }}
                    className={`p-2.5 rounded-xl border font-mono text-xs font-bold transition-all ${
                      type === 'weekly' ? 'bg-crimson text-white border-crimson shadow-glow-crimson' : 'bg-obsidian-950 text-slate-400 border-white/10'
                    }`}
                  >
                    ⚡ Weekly Sprint (7 Days)
                  </button>
                  <button
                    type="button"
                    onClick={() => { setType('monthly'); setTargetCount(30); }}
                    className={`p-2.5 rounded-xl border font-mono text-xs font-bold transition-all ${
                      type === 'monthly' ? 'bg-gold text-obsidian-950 border-gold shadow-glow-gold' : 'bg-obsidian-950 text-slate-400 border-white/10'
                    }`}
                  >
                    🏆 Monthly Protocol (30 Days)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5 font-bold">
                  Mission Directives & Rules
                </label>
                <textarea
                  rows={2}
                  placeholder="What is the non-negotiable standard for this challenge?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-obsidian-950 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-crimson"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5 font-bold">
                    Target Quota & Unit
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      min="1"
                      value={targetCount}
                      onChange={(e) => setTargetCount(Number(e.target.value))}
                      className="w-20 px-3 py-2 rounded-xl bg-obsidian-950 border border-white/10 text-xs text-white"
                    />
                    <input
                      type="text"
                      placeholder="Days / Reps"
                      value={unit}
                      onChange={(e) => setUnit(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-xl bg-obsidian-950 border border-white/10 text-xs text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5 font-bold">
                    Reward XP
                  </label>
                  <input
                    type="number"
                    min="50"
                    step="50"
                    value={rewardXp}
                    onChange={(e) => setRewardXp(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-obsidian-950 border border-white/10 text-xs text-white"
                  />
                </div>
              </div>

              {/* Linked Habit */}
              <div>
                <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5 font-bold">
                  Link Habit (Optional)
                </label>
                <select
                  value={linkedHabitId}
                  onChange={(e) => setLinkedHabitId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-obsidian-950 border border-white/10 text-xs text-white focus:outline-none focus:border-crimson"
                >
                  <option value="">Any habit check-in counts</option>
                  {habits.map(h => (
                    <option key={h.id} value={h.id}>
                      {h.title}
                    </option>
                  ))}
                </select>
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
                  className="px-5 py-2 rounded-xl bg-crimson hover:bg-crimson-glow text-white text-xs font-bold shadow-glow-crimson"
                >
                  {editingChallenge ? 'Save Challenge' : 'Forge Challenge'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
