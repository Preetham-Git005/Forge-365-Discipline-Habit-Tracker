import React, { useState, useEffect } from 'react';
import type { Habit, HabitCategory, TimeOfDay, HabitFrequency, HabitType, HabitPriority } from '../types';
import { useHabits } from '../context/HabitContext';
import { 
  X, 
  Flame, 
  Zap, 
  BookOpen, 
  Dumbbell, 
  Feather, 
  Moon, 
  Code, 
  Droplets, 
  Footprints, 
  Apple, 
  Heart, 
  Shield, 
  Brain, 
  Activity, 
  Sparkles,
  ArrowUpToLine,
  ArrowDownToLine
} from 'lucide-react';

interface HabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  habitToEdit?: Habit | null;
}

const AVAILABLE_ICONS = [
  { name: 'Flame', icon: Flame },
  { name: 'Dumbbell', icon: Dumbbell },
  { name: 'BookOpen', icon: BookOpen },
  { name: 'Brain', icon: Brain },
  { name: 'Zap', icon: Zap },
  { name: 'Feather', icon: Feather },
  { name: 'Code', icon: Code },
  { name: 'Droplets', icon: Droplets },
  { name: 'Footprints', icon: Footprints },
  { name: 'Apple', icon: Apple },
  { name: 'Heart', icon: Heart },
  { name: 'Shield', icon: Shield },
  { name: 'Moon', icon: Moon },
  { name: 'Activity', icon: Activity },
  { name: 'Sparkles', icon: Sparkles }
];

export const HabitModal: React.FC<HabitModalProps> = ({ isOpen, onClose, habitToEdit }) => {
  const { addHabit, updateHabit } = useHabits();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<HabitCategory>('mind');
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('morning');
  const [frequency, setFrequency] = useState<HabitFrequency>('daily');
  const [type, setType] = useState<HabitType>('boolean');
  const [targetValue, setTargetValue] = useState<number>(20);
  const [unit, setUnit] = useState('mins');
  const [icon, setIcon] = useState('Flame');
  const [priority, setPriority] = useState<HabitPriority>('high');
  const [placement, setPlacement] = useState<'top' | 'bottom'>('top');

  useEffect(() => {
    if (habitToEdit) {
      setTitle(habitToEdit.title);
      setDescription(habitToEdit.description || '');
      setCategory(habitToEdit.category);
      setTimeOfDay(habitToEdit.timeOfDay);
      setFrequency(habitToEdit.frequency);
      setType(habitToEdit.type);
      setTargetValue(habitToEdit.targetValue || 20);
      setUnit(habitToEdit.unit || 'mins');
      setIcon(habitToEdit.icon);
      setPriority(habitToEdit.priority);
    } else {
      setTitle('');
      setDescription('');
      setCategory('mind');
      setTimeOfDay('morning');
      setFrequency('daily');
      setType('boolean');
      setTargetValue(20);
      setUnit('mins');
      setIcon('Flame');
      setPriority('high');
      setPlacement('top');
    }
  }, [habitToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (habitToEdit) {
      updateHabit({
        ...habitToEdit,
        title: title.trim(),
        description: description.trim(),
        category,
        timeOfDay,
        frequency,
        type,
        targetValue: type === 'numeric' ? Number(targetValue) : undefined,
        unit: type === 'numeric' ? unit.trim() : undefined,
        icon,
        priority
      });
    } else {
      addHabit({
        title: title.trim(),
        description: description.trim(),
        category,
        timeOfDay,
        frequency,
        type,
        targetValue: type === 'numeric' ? Number(targetValue) : undefined,
        unit: type === 'numeric' ? unit.trim() : undefined,
        icon,
        color: '#E63946',
        priority
      }, placement);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg rounded-2xl bg-obsidian-900 border border-white/15 shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div className="flex items-center space-x-2">
            <Flame className="w-5 h-5 text-crimson" />
            <h3 className="font-cinematic text-lg font-bold text-white">
              {habitToEdit ? 'Edit Discipline' : 'Forge New Habit'}
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          
          {/* Title */}
          <div>
            <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5 font-bold">
              Habit Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. 100 Daily Pushups, Deep Reading"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-obsidian-950 border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-crimson focus:ring-1 focus:ring-crimson"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5 font-bold">
              Purpose & Stoic Rationale
            </label>
            <textarea
              rows={2}
              placeholder="Why is this non-negotiable for your growth?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-obsidian-950 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-crimson focus:ring-1 focus:ring-crimson"
            />
          </div>

          {/* Placement in List (Only for New Habits) */}
          {!habitToEdit && (
            <div>
              <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5 font-bold">
                Position in Daily Rituals
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPlacement('top')}
                  className={`p-2.5 rounded-xl border text-xs font-mono flex items-center justify-center space-x-2 transition-all ${
                    placement === 'top'
                      ? 'bg-crimson/20 text-crimson border-crimson/50 font-bold shadow-glow-crimson'
                      : 'bg-obsidian-950 text-slate-400 border-white/5 hover:border-white/20'
                  }`}
                >
                  <ArrowUpToLine className="w-3.5 h-3.5" />
                  <span>Insert at Top (First)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPlacement('bottom')}
                  className={`p-2.5 rounded-xl border text-xs font-mono flex items-center justify-center space-x-2 transition-all ${
                    placement === 'bottom'
                      ? 'bg-crimson/20 text-crimson border-crimson/50 font-bold shadow-glow-crimson'
                      : 'bg-obsidian-950 text-slate-400 border-white/5 hover:border-white/20'
                  }`}
                >
                  <ArrowDownToLine className="w-3.5 h-3.5" />
                  <span>Insert at Bottom (Last)</span>
                </button>
              </div>
            </div>
          )}

          {/* Category & Time of Day */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5 font-bold">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as HabitCategory)}
                className="w-full px-3 py-2 rounded-xl bg-obsidian-950 border border-white/10 text-xs text-white focus:outline-none focus:border-crimson"
              >
                <option value="mind">Mind (Cognition & Wisdom)</option>
                <option value="body">Body (Strength & Endurance)</option>
                <option value="craft">Craft (Skills & Deep Work)</option>
                <option value="soul">Soul (Meditation & Peace)</option>
                <option value="vitality">Vitality (Hydration & Sleep)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5 font-bold">
                Time of Day
              </label>
              <select
                value={timeOfDay}
                onChange={(e) => setTimeOfDay(e.target.value as TimeOfDay)}
                className="w-full px-3 py-2 rounded-xl bg-obsidian-950 border border-white/10 text-xs text-white focus:outline-none focus:border-crimson"
              >
                <option value="morning">Morning Dawn</option>
                <option value="afternoon">Afternoon</option>
                <option value="evening">Evening Dusk</option>
                <option value="anytime">Anytime / All Day</option>
              </select>
            </div>
          </div>

          {/* Tracking Type (Boolean vs Numeric) */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5 font-bold">
                Tracking Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as HabitType)}
                className="w-full px-3 py-2 rounded-xl bg-obsidian-950 border border-white/10 text-xs text-white focus:outline-none focus:border-crimson"
              >
                <option value="boolean">Simple Check-off (Done / Not Done)</option>
                <option value="numeric">Target Metric (Pages, Reps, Mins, Liters)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5 font-bold">
                Frequency
              </label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value as HabitFrequency)}
                className="w-full px-3 py-2 rounded-xl bg-obsidian-950 border border-white/10 text-xs text-white focus:outline-none focus:border-crimson"
              >
                <option value="daily">Every Day (365 Days)</option>
                <option value="weekdays">Weekdays Only</option>
                <option value="weekends">Weekends Only</option>
              </select>
            </div>
          </div>

          {/* Numeric Target if Selected */}
          {type === 'numeric' && (
            <div className="grid grid-cols-2 gap-4 p-3 rounded-xl bg-obsidian-950/70 border border-white/5">
              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">Target Quota</label>
                <input
                  type="number"
                  min="1"
                  value={targetValue}
                  onChange={(e) => setTargetValue(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded-lg bg-obsidian-900 border border-white/10 text-xs text-white focus:outline-none focus:border-crimson"
                />
              </div>
              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">Unit</label>
                <input
                  type="text"
                  placeholder="e.g. pages, reps, mins, L"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-obsidian-900 border border-white/10 text-xs text-white focus:outline-none focus:border-crimson"
                />
              </div>
            </div>
          )}

          {/* Icon Selector */}
          <div>
            <label className="block text-xs font-mono uppercase text-slate-300 mb-2 font-bold">
              Icon Symbol
            </label>
            <div className="grid grid-cols-5 gap-2">
              {AVAILABLE_ICONS.map(({ name, icon: IconC }) => (
                <button
                  type="button"
                  key={name}
                  onClick={() => setIcon(name)}
                  className={`p-2.5 rounded-xl border flex items-center justify-center transition-all ${
                    icon === name 
                      ? 'bg-crimson text-white border-crimson-glow shadow-glow-crimson'
                      : 'bg-obsidian-950 text-slate-400 border-white/5 hover:border-white/20'
                  }`}
                >
                  <IconC className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
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
              className="px-5 py-2 rounded-xl bg-crimson hover:bg-crimson-glow text-white text-xs font-bold shadow-glow-crimson transition-all active:scale-95"
            >
              {habitToEdit ? 'Save Changes' : 'Add To Forge'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
