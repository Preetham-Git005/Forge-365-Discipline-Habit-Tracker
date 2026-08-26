import React, { useState } from 'react';
import { useHabits } from '../context/HabitContext';
import { 
  ShieldAlert, 
  Plus, 
  Trash2, 
  CheckCircle, 
  Circle, 
  ChevronDown, 
  ChevronUp 
} from 'lucide-react';

export const RulesWidget: React.FC = () => {
  const { rules = [], addRule, deleteRule, toggleRuleActive } = useHabits();
  const [newRuleText, setNewRuleText] = useState('');
  const [category, setCategory] = useState('Discipline');
  const [isAdding, setIsAdding] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  const handleAddRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRuleText.trim()) return;
    addRule(newRuleText, category);
    setNewRuleText('');
    setIsAdding(false);
  };

  const safeRules = rules || [];
  const activeRulesCount = safeRules.filter(r => r.active).length;

  return (
    <div className="rounded-2xl border border-white/10 bg-gradient-to-r from-obsidian-900 via-obsidian-850 to-obsidian-900 p-5 backdrop-blur-xl shadow-obsidian-card space-y-3">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
          <div className="w-8 h-8 rounded-lg bg-crimson/20 border border-crimson/30 flex items-center justify-center text-crimson">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-cinematic text-sm sm:text-base font-bold text-white tracking-wide">
                The Iron Code • Personal Rules
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-gold/15 text-gold border border-gold/30">
                {activeRulesCount} Active
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono">
              Non-negotiable personal boundaries and operational standards
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-slate-200 transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-crimson" />
            <span>Add Rule</span>
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-white/5 transition-colors"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expandable Section */}
      {isExpanded && (
        <div className="space-y-3 pt-2">
          
          {/* Add Rule Form */}
          {isAdding && (
            <form onSubmit={handleAddRule} className="p-3 rounded-xl bg-obsidian-950/80 border border-crimson/30 space-y-2 animate-fade-in">
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  placeholder="e.g. No digital screens in bedroom, 30m reading before bed..."
                  value={newRuleText}
                  onChange={(e) => setNewRuleText(e.target.value)}
                  className="flex-1 px-3 py-1.5 rounded-lg bg-obsidian-900 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-crimson"
                />
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg bg-obsidian-900 border border-white/10 text-xs text-slate-300 focus:outline-none focus:border-crimson"
                >
                  <option value="Discipline">Discipline</option>
                  <option value="Mindset">Mindset</option>
                  <option value="Body">Body</option>
                  <option value="Focus">Focus</option>
                  <option value="Stoicism">Stoicism</option>
                </select>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-3 py-1 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1 rounded-lg bg-crimson text-white text-xs font-bold shadow-glow-crimson"
                >
                  Save to Creed
                </button>
              </div>
            </form>
          )}

          {/* Rules List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {safeRules.map((rule, idx) => (
              <div
                key={rule.id}
                className={`flex items-start justify-between p-2.5 sm:p-3 rounded-xl border transition-all ${
                  rule.active
                    ? 'bg-obsidian-950/70 border-white/10 hover:border-white/20'
                    : 'bg-obsidian-950/30 border-white/5 opacity-50'
                }`}
              >
                <div className="flex items-start space-x-2.5 flex-1 pr-2">
                  <button
                    type="button"
                    onClick={() => toggleRuleActive(rule.id)}
                    className="mt-0.5 text-slate-500 hover:text-gold transition-colors"
                  >
                    {rule.active ? (
                      <CheckCircle className="w-4 h-4 text-gold fill-gold/20" />
                    ) : (
                      <Circle className="w-4 h-4 text-slate-600" />
                    )}
                  </button>
                  <div>
                    <div className="flex items-center space-x-1.5">
                      <span className="text-[10px] font-mono uppercase text-crimson font-bold">
                        RULE #{idx + 1}
                      </span>
                      {rule.category && (
                        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-white/5 text-slate-400 border border-white/5">
                          {rule.category}
                        </span>
                      )}
                    </div>
                    <p className={`text-xs font-sans mt-0.5 leading-relaxed ${rule.active ? 'text-slate-200 font-medium' : 'text-slate-500 line-through'}`}>
                      {rule.rule}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => deleteRule(rule.id)}
                  className="p-1 rounded text-slate-600 hover:text-crimson hover:bg-crimson/10 transition-colors"
                  title="Remove Rule"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

        </div>
      )}

    </div>
  );
};
