import React from 'react';
import { useHabits } from '../context/HabitContext';
import { getTodayDateString, formatDateDisplay } from '../utils/storage';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

export const DateNavigator: React.FC = () => {
  const { selectedDate, setSelectedDate, getCompletionRateForDate } = useHabits();
  const todayStr = getTodayDateString();

  const changeDateBy = (offsetDays: number) => {
    const [y, m, d] = selectedDate.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    date.setDate(date.getDate() + offsetDays);
    const newY = date.getFullYear();
    const newM = String(date.getMonth() + 1).padStart(2, '0');
    const newD = String(date.getDate()).padStart(2, '0');
    setSelectedDate(`${newY}-${newM}-${newD}`);
  };

  // Generate 7 days around selected date for carousel view
  const daysCarousel = React.useMemo(() => {
    const [y, m, d] = selectedDate.split('-').map(Number);
    const baseDate = new Date(y, m - 1, d);
    const items = [];

    for (let i = -3; i <= 3; i++) {
      const date = new Date(baseDate);
      date.setDate(baseDate.getDate() + i);
      const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      const rate = getCompletionRateForDate(dateStr);
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      const dayNum = date.getDate();
      const isToday = dateStr === todayStr;
      const isSelected = dateStr === selectedDate;

      items.push({
        dateStr,
        dayName,
        dayNum,
        rate,
        isToday,
        isSelected
      });
    }
    return items;
  }, [selectedDate, todayStr, getCompletionRateForDate]);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-obsidian-900/80 border border-white/10 backdrop-blur-md mb-6">
      
      {/* Date Header & Step Controls */}
      <div className="flex items-center space-x-3">
        <button
          onClick={() => changeDateBy(-1)}
          className="p-2 rounded-lg bg-obsidian-850 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10 transition-colors"
          title="Previous Day"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center space-x-2">
          <CalendarIcon className="w-4 h-4 text-crimson" />
          <span className="font-mono text-sm font-semibold text-white">
            {formatDateDisplay(selectedDate)}
          </span>
          {selectedDate === todayStr && (
            <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-crimson/20 text-crimson border border-crimson/40 font-bold">
              Today
            </span>
          )}
        </div>

        <button
          onClick={() => changeDateBy(1)}
          className="p-2 rounded-lg bg-obsidian-850 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10 transition-colors"
          title="Next Day"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {selectedDate !== todayStr && (
          <button
            onClick={() => setSelectedDate(todayStr)}
            className="text-xs font-mono text-slate-400 hover:text-crimson transition-colors underline underline-offset-4"
          >
            Jump to Today
          </button>
        )}
      </div>

      {/* 7-Day Quick Strip */}
      <div className="flex items-center space-x-1.5 sm:space-x-2 overflow-x-auto max-w-full pb-1 sm:pb-0">
        {daysCarousel.map(day => (
          <button
            key={day.dateStr}
            onClick={() => setSelectedDate(day.dateStr)}
            className={`flex flex-col items-center justify-center w-11 h-13 sm:w-12 sm:h-14 rounded-xl border transition-all duration-200 ${
              day.isSelected
                ? 'bg-crimson text-white border-crimson-glow shadow-glow-crimson scale-105'
                : 'bg-obsidian-850/80 text-slate-400 border-white/10 hover:border-white/20 hover:text-slate-200'
            }`}
          >
            <span className="text-[10px] font-mono uppercase leading-tight">{day.dayName}</span>
            <span className="text-sm font-bold leading-tight my-0.5">{day.dayNum}</span>
            {day.rate > 0 ? (
              <span className={`text-[9px] font-mono ${day.isSelected ? 'text-white' : 'text-crimson'}`}>
                {day.rate === 100 ? '★' : `${day.rate}%`}
              </span>
            ) : (
              <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
            )}
          </button>
        ))}
      </div>

    </div>
  );
};
