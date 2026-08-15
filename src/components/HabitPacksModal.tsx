import React from 'react';
import { PRESET_HABIT_PACKS } from '../utils/presets';
import type { HabitPack } from '../utils/presets';
import { useHabits } from '../context/HabitContext';
import { X, Plus, Check, Shield } from 'lucide-react';

interface HabitPacksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HabitPacksModal: React.FC<HabitPacksModalProps> = ({ isOpen, onClose }) => {
  const { importHabitPack } = useHabits();

  if (!isOpen) return null;

  const handleImport = (pack: HabitPack) => {
    importHabitPack(pack.habits);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl rounded-2xl bg-obsidian-900 border border-white/15 shadow-2xl overflow-hidden max-h-[85vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-gold" />
            <h3 className="font-cinematic text-lg font-bold text-white">
              Curated Discipline Protocols
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 overflow-y-auto">
          <p className="text-xs text-slate-400">
            One-click import battle-tested routine blueprints designed for extreme consistency, mental toughness, and physical mastery.
          </p>

          <div className="space-y-4">
            {PRESET_HABIT_PACKS.map(pack => (
              <div 
                key={pack.id}
                className="p-5 rounded-2xl bg-obsidian-950/80 border border-white/10 hover:border-gold/40 transition-all duration-300 space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="font-cinematic text-base font-bold text-white flex items-center space-x-2">
                      <span>{pack.name}</span>
                      <span className="text-xs font-mono font-normal text-gold">({pack.habits.length} Habits)</span>
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">{pack.subtitle}</p>
                  </div>

                  <button
                    onClick={() => handleImport(pack)}
                    className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-gold/15 hover:bg-gold text-gold hover:text-obsidian-950 border border-gold/40 text-xs font-bold transition-all self-start sm:self-auto"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Import Blueprint</span>
                  </button>
                </div>

                <p className="text-xs text-slate-400/90 leading-relaxed">
                  {pack.description}
                </p>

                {/* Habit preview pills */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {pack.habits.map((h, i) => (
                    <span 
                      key={i} 
                      className="px-2.5 py-1 rounded-lg bg-obsidian-900 border border-white/5 text-[11px] font-mono text-slate-300 flex items-center space-x-1"
                    >
                      <Check className="w-3 h-3 text-crimson" />
                      <span>{h.title}</span>
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
