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
  ArrowDownToLine,
  Bell,
  Calendar,
  Target
} from 'lucide-react';

interface HabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  habitToEdit?: Habit | null;
  defaultGoalId?: string;
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

const DAYS_OF_WEEK = [
  { label: 'Sun', day: 0 },
  { label: 'Mon', day: 1 },
  { label: 'Tue', day: 2 },
  { label: 'Wed', day: 3 },
  { label: 'Thu', day: 4 },
  { label: 'Fri', day: 5 },
  { label: 'Sat', day: 6 }
];

export const HabitModal: React.FC<HabitModalProps> = ({ isOpen, onClose, habitToEdit, defaultGoalId }) => {
  const { addHabit, updateHabit, goals } = useHabits();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<HabitCategory>('mind');
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('morning');
  const [frequency, setFrequency] = useState<HabitFrequency>('daily');
  const [customDays, setCustomDays] = useState<number[]>([1, 2, 3, 4, 5]); // Default Mon-Fri
  const [type, setType] = useState<HabitType>('boolean');
  const [targetValue, setTargetValue] = useState<number>(20);
  const [unit, setUnit] = useState('mins');
  const [icon, setIcon] = useState('Flame');
  const [priority, setPriority] = useState<HabitPriority>('high');
  const [placement, setPlacement] = useState<'top' | 'bottom'>('top');
  const [reminderTime, setReminderTime] = useState<string>('');
  const [goalId, setGoalId] = useState<string>(defaultGoalId || '');

  useEffect(() => {
    if (habitToEdit) {
      setTitle(habitToEdit.title);
      setDescription(habitToEdit.description || '');
      setCategory(habitToEdit.category);
      setTimeOfDay(habitToEdit.timeOfDay);
      setFrequency(habitToEdit.frequency);
      setCustomDays(habitToEdit.customDays || [1, 2, 3, 4, 5]);
      setType(habitToEdit.type);
      setTargetValue(habitToEdit.targetValue || 20);
      setUnit(habitToEdit.unit || 'mins');
      setIcon(habitToEdit.icon);
      setPriority(habitToEdit.priority);
      setReminderTime(habitToEdit.reminderTime || '');
      setGoalId(habitToEdit.goalId || '');
    } else {
      setTitle('');
      setDescription('');
      setCategory('mind');
      setTimeOfDay('morning');
      setFrequency('daily');
      setCustomDays([1, 2, 3, 4, 5]);
      setType('boolean');
      setTargetValue(20);
      setUnit('mins');
      setIcon('Flame');
      setPriority('high');
      setPlacement('top');
      setReminderTime('');
      setGoalId(defaultGoalId || '');
    }
  }, [habitToEdit, isOpen, defaultGoalId]);

  if (!isOpen) return null;

  const toggleDay = (day: number) => {
    setCustomDays(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day].sort()
    );
  };

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
        customDays: frequency === 'custom_days' ? customDays : undefined,
        type,
        targetValue: type === 'numeric' ? Number(targetValue) : undefined,
        unit: type === 'numeric' ? unit.trim() : undefined,
        icon,
        priority,
        reminderTime: reminderTime.trim() || undefined,
        goalId: goalId.trim() || undefined
      });
    } else {
      addHabit({
        title: title.trim(),
        description: description.trim(),
        category,
        timeOfDay,
        frequency,
        customDays: frequency === 'custom_days' ? customDays : undefined,
        type,
        targetValue: type === 'numeric' ? Number(targetValue) : undefined,
        unit: type === 'numeric' ? unit.trim() : undefined,
        icon,
        color: '#E63946',
        priority,
        reminderTime: reminderTime.trim() || undefined,
        goalId: goalId.trim() || undefined
      }, placement);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl rounded-2xl bg-obsidian-900 border border-white/15 shadow-2xl overflow-hidden">
        
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
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[82vh] overflow-y-auto">
          
          {/* Title */}
          <div>
            <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5 font-bold">
              Habit Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Spartan Strength Session, 100 Pages Deep Reading"
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

          {/* Day Scheduling (Frequency & Rest Days) */}
          <div className="p-3.5 rounded-xl bg-obsidian-950/80 border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono uppercase text-slate-300 font-bold flex items-center space-x-1.5">
                <Calendar className="w-3.5 h-3.5 text-crimson" />
                <span>Schedule & Rest Days</span>
              </label>
              <span className="text-[11px] font-mono text-slate-400">
                Excluded days will not penalize streaks
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setFrequency('daily')}
                className={`py-1.5 px-2 rounded-lg text-xs font-mono border transition-all ${
                  frequency === 'daily' 
                    ? 'bg-crimson text-white border-crimson shadow-glow-crimson font-bold' 
                    : 'bg-obsidian-900 text-slate-400 border-white/5 hover:border-white/20'
                }`}
              >
                Every Day (365d)
              </button>

              <button
                type="button"
                onClick={() => setFrequency('weekdays')}
                className={`py-1.5 px-2 rounded-lg text-xs font-mono border transition-all ${
                  frequency === 'weekdays' 
                    ? 'bg-crimson text-white border-crimson shadow-glow-crimson font-bold' 
                    : 'bg-obsidian-900 text-slate-400 border-white/5 hover:border-white/20'
                }`}
              >
                Weekdays (M-F)
              </button>

              <button
                type="button"
                onClick={() => setFrequency('weekends')}
                className={`py-1.5 px-2 rounded-lg text-xs font-mono border transition-all ${
                  frequency === 'weekends' 
                    ? 'bg-crimson text-white border-crimson shadow-glow-crimson font-bold' 
                    : 'bg-obsidian-900 text-slate-400 border-white/5 hover:border-white/20'
                }`}
              >
                Weekends (Sat-Sun)
              </button>

              <button
                type="button"
                onClick={() => setFrequency('custom_days')}
                className={`py-1.5 px-2 rounded-lg text-xs font-mono border transition-all ${
                  frequency === 'custom_days' 
                    ? 'bg-gold text-obsidian-950 border-gold shadow-glow-gold font-bold' 
                    : 'bg-obsidian-900 text-slate-400 border-white/5 hover:border-white/20'
                }`}
              >
                Specific Days
              </button>
            </div>

            {/* Custom Day Toggles */}
            {frequency === 'custom_days' && (
              <div className="pt-2 border-t border-white/5 space-y-1.5 animate-fade-in">
                <div className="text-[11px] font-mono text-slate-400">
                  Select the exact days this habit must be performed:
                </div>
                <div className="flex gap-1.5 justify-between">
                  {DAYS_OF_WEEK.map(({ label, day }) => {
                    const isSelected = customDays.includes(day);
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => toggleDay(day)}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-mono font-bold border transition-all ${
                          isSelected
                            ? 'bg-crimson text-white border-crimson shadow-glow-crimson'
                            : 'bg-obsidian-900 text-slate-500 border-white/5 hover:text-slate-300'
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Reminder Time & Grand Goal Binding */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Reminder Time Picker */}
            <div>
              <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5 font-bold flex items-center space-x-1.5">
                <Bell className="w-3.5 h-3.5 text-amber-400" />
                <span>Timed Reminder (Optional)</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="time"
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl bg-obsidian-950 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400"
                />
                {reminderTime && (
                  <button
                    type="button"
                    onClick={() => setReminderTime('')}
                    className="px-2.5 py-2 rounded-xl bg-obsidian-950 text-slate-400 hover:text-crimson border border-white/10 text-xs"
                    title="Clear timing"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Link to Grand Objective */}
            <div>
              <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5 font-bold flex items-center space-x-1.5">
                <Target className="w-3.5 h-3.5 text-gold" />
                <span>Attach to Grand Goal</span>
              </label>
              <select
                value={goalId}
                onChange={(e) => setGoalId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-obsidian-950 border border-white/10 text-xs text-white focus:outline-none focus:border-gold"
              >
                <option value="">No goal attached (Independent)</option>
                {goals.map(g => (
                  <option key={g.id} value={g.id}>
                    🎯 {g.title}
                  </option>
                ))}
              </select>
            </div>

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
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as HabitPriority)}
                className="w-full px-3 py-2 rounded-xl bg-obsidian-950 border border-white/10 text-xs text-white focus:outline-none focus:border-crimson"
              >
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="normal">Normal</option>
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
