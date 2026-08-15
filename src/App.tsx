import React, { useState } from 'react';
import { HabitProvider, useHabits } from './context/HabitContext';
import { Navbar } from './components/Navbar';
import { HeroQuote } from './components/HeroQuote';
import { HabitList } from './components/HabitList';
import { YearHeatmap } from './components/YearHeatmap';
import { Dashboard } from './components/Dashboard';
import { MilestoneView } from './components/MilestoneView';
import { HabitModal } from './components/HabitModal';
import { HabitPacksModal } from './components/HabitPacksModal';
import { ReflectionModal } from './components/ReflectionModal';
import { BackgroundSelector } from './components/BackgroundSelector';
import { DataSyncModal } from './components/DataSyncModal';
import { getWallpaperById } from './utils/wallpapers';
import type { Habit } from './types';
import { Flame } from 'lucide-react';

const MainApp: React.FC = () => {
  const { profile } = useHabits();
  const [activeTab, setActiveTab] = useState<'habits' | 'heatmap' | 'analytics' | 'milestones'>('habits');
  
  // Modal States
  const [isHabitModalOpen, setIsHabitModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [isHabitPacksOpen, setIsHabitPacksOpen] = useState(false);
  const [isReflectionOpen, setIsReflectionOpen] = useState(false);
  const [isWallpaperOpen, setIsWallpaperOpen] = useState(false);
  const [isSyncOpen, setIsSyncOpen] = useState(false);

  const activeWallpaper = getWallpaperById(profile.backgroundTheme || 'marcus-bust', profile.customWallpaperUrl);
  const opacityVal = (profile.wallpaperOpacity !== undefined ? profile.wallpaperOpacity : 45) / 100;
  const blurVal = profile.wallpaperBlur !== undefined ? profile.wallpaperBlur : 0;
  const isGrayscale = profile.wallpaperGrayscale ?? false;

  const handleEditHabit = (habit: Habit) => {
    setEditingHabit(habit);
    setIsHabitModalOpen(true);
  };

  const handleOpenNewHabit = () => {
    setEditingHabit(null);
    setIsHabitModalOpen(true);
  };

  return (
    <div className="relative min-h-screen bg-obsidian-950 text-slate-100 flex flex-col selection:bg-crimson selection:text-white">
      
      {/* Dynamic Cinematic Wallpaper Backdrop with Real-Time Vivid Styles */}
      {activeWallpaper.url && (
        <div 
          className="fixed inset-0 pointer-events-none -z-20 bg-cover bg-center bg-no-repeat transition-all duration-500"
          style={{ 
            backgroundImage: `url("${activeWallpaper.url}")`,
            opacity: opacityVal,
            filter: `${isGrayscale ? 'grayscale(100%)' : 'grayscale(15%)'} contrast(115%) blur(${blurVal}px)`,
            transform: 'scale(1.02)'
          }}
        />
      )}

      {/* Cinematic Dark Gradient & Vignette (Tuned to preserve photo visibility while maintaining high text readability) */}
      <div className="fixed inset-0 pointer-events-none -z-10 bg-gradient-to-b from-obsidian-950/70 via-obsidian-950/85 to-obsidian-950/95" />
      <div className="fixed inset-0 pointer-events-none -z-10 cinematic-vignette opacity-80" />

      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenNewHabit={handleOpenNewHabit}
        onOpenHabitPacks={() => setIsHabitPacksOpen(true)}
        onOpenSync={() => setIsSyncOpen(true)}
        onOpenWallpaper={() => setIsWallpaperOpen(true)}
        onOpenReflection={() => setIsReflectionOpen(true)}
      />

      {/* Main App Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* Stoic Hero Quote Banner */}
        <HeroQuote />

        {/* Dynamic Tab Views */}
        {activeTab === 'habits' && (
          <HabitList
            onOpenNewHabit={handleOpenNewHabit}
            onOpenHabitPacks={() => setIsHabitPacksOpen(true)}
            onOpenReflection={() => setIsReflectionOpen(true)}
            onEditHabit={handleEditHabit}
          />
        )}

        {activeTab === 'heatmap' && (
          <YearHeatmap />
        )}

        {activeTab === 'analytics' && (
          <Dashboard />
        )}

        {activeTab === 'milestones' && (
          <MilestoneView />
        )}

      </main>

      {/* Cinematic Minimal Footer */}
      <footer className="border-t border-white/5 py-8 mt-12 bg-obsidian-950/90 text-center text-xs font-mono text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Flame className="w-4 h-4 text-crimson" />
            <span className="font-cinematic font-bold text-slate-300">FORGE 365</span>
            <span>• Built for relentless daily discipline</span>
          </div>
          <div className="text-slate-500">
            "Amor Fati • Memento Mori • No Excuses"
          </div>
        </div>
      </footer>

      {/* Modals */}
      <HabitModal
        isOpen={isHabitModalOpen}
        onClose={() => { setIsHabitModalOpen(false); setEditingHabit(null); }}
        habitToEdit={editingHabit}
      />

      <HabitPacksModal
        isOpen={isHabitPacksOpen}
        onClose={() => setIsHabitPacksOpen(false)}
      />

      <ReflectionModal
        isOpen={isReflectionOpen}
        onClose={() => setIsReflectionOpen(false)}
      />

      <BackgroundSelector
        isOpen={isWallpaperOpen}
        onClose={() => setIsWallpaperOpen(false)}
      />

      <DataSyncModal
        isOpen={isSyncOpen}
        onClose={() => setIsSyncOpen(false)}
      />

    </div>
  );
};

export function App() {
  return (
    <HabitProvider>
      <MainApp />
    </HabitProvider>
  );
}

export default App;
