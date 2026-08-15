import React, { useState, useEffect } from 'react';
import { useHabits } from '../context/HabitContext';
import { formatDateDisplay } from '../utils/storage';
import { X, BookOpen, Star, Sparkles, ShieldAlert } from 'lucide-react';

interface ReflectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReflectionModal: React.FC<ReflectionModalProps> = ({ isOpen, onClose }) => {
  const { selectedDate, reflections, saveDailyReflection } = useHabits();

  const [rating, setRating] = useState<number>(5);
  const [reflection, setReflection] = useState('');
  const [highlight, setHighlight] = useState('');
  const [obstacle, setObstacle] = useState('');
  const [morningIntention, setMorningIntention] = useState('');

  useEffect(() => {
    const existing = reflections.find(r => r.date === selectedDate);
    if (existing) {
      setRating(existing.rating);
      setReflection(existing.reflection);
      setHighlight(existing.highlight || '');
      setObstacle(existing.obstacle || '');
      setMorningIntention(existing.morningIntention || '');
    } else {
      setRating(5);
      setReflection('');
      setHighlight('');
      setObstacle('');
      setMorningIntention('');
    }
  }, [selectedDate, reflections, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reflection.trim()) return;

    saveDailyReflection({
      date: selectedDate,
      rating,
      reflection: reflection.trim(),
      highlight: highlight.trim(),
      obstacle: obstacle.trim(),
      morningIntention: morningIntention.trim()
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg rounded-2xl bg-obsidian-900 border border-white/15 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="font-cinematic text-lg font-bold text-white">
                Daily Stoic Audit & Debrief
              </h3>
              <p className="text-[11px] font-mono text-slate-400">
                Log for {formatDateDisplay(selectedDate)}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          
          {/* Discipline Self-Rating */}
          <div>
            <label className="block text-xs font-mono uppercase text-slate-300 mb-2 font-bold">
              Discipline Rating Today
            </label>
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className={`p-2 rounded-xl border transition-all ${
                    rating >= star 
                      ? 'bg-gold/20 text-gold border-gold/50 shadow-glow-gold' 
                      : 'bg-obsidian-950 text-slate-600 border-white/5'
                  }`}
                >
                  <Star className="w-5 h-5 fill-current" />
                </button>
              ))}
              <span className="text-xs font-mono text-slate-400 ml-2">
                {rating === 5 ? 'Flawless Execution' : rating === 4 ? 'Solid Discipline' : rating === 3 ? 'Acceptable' : 'Faltered'}
              </span>
            </div>
          </div>

          {/* Core Evening Reflection */}
          <div>
            <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5 font-bold">
              Evening Audit & Observations *
            </label>
            <textarea
              required
              rows={3}
              placeholder="What went well? Where did you hesitate or waste energy? What did you learn about your willpower today?"
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-obsidian-950 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
            />
          </div>

          {/* Primary Victory / Highlight */}
          <div>
            <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5 font-bold flex items-center space-x-1 text-emerald-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Key Victory of the Day</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Conquered morning resistance, hit PB in lifting"
              value={highlight}
              onChange={(e) => setHighlight(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-obsidian-950 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
            />
          </div>

          {/* Obstacle / Resistance */}
          <div>
            <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5 font-bold flex items-center space-x-1 text-crimson">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Resistance Encountered & Countermeasure</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Afternoon sugar craving, tackled with hydration"
              value={obstacle}
              onChange={(e) => setObstacle(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-obsidian-950 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-crimson"
            />
          </div>

          {/* Tomorrow's Intention */}
          <div>
            <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5 font-bold text-cyan-400">
              Tomorrow's Non-Negotiable Directive
            </label>
            <input
              type="text"
              placeholder="e.g. 6:00 AM wake up without snooze, 90m deep work"
              value={morningIntention}
              onChange={(e) => setMorningIntention(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-obsidian-950 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>

          {/* Submit */}
          <div className="pt-4 border-t border-white/10 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-obsidian-950 text-xs font-bold shadow-lg transition-all active:scale-95"
            >
              Save Audit (+50 XP)
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
