import React, { useState, useEffect } from 'react';
import { useHabits } from '../context/HabitContext';
import { requestNotificationPermission, getNotificationPermission } from '../utils/notifications';
import { 
  Flame, 
  BarChart3, 
  CalendarDays, 
  Award, 
  Plus, 
  Volume2, 
  VolumeX, 
  Image as ImageIcon, 
  RefreshCw, 
  Headphones, 
  BookOpen, 
  Sparkles,
  Square,
  Target,
  Bell,
  BellOff,
  Swords,
  Brain
} from 'lucide-react';

interface NavbarProps {
  activeTab: 'habits' | 'goals' | 'challenges' | 'insights' | 'heatmap' | 'analytics' | 'milestones';
  setActiveTab: (tab: 'habits' | 'goals' | 'challenges' | 'insights' | 'heatmap' | 'analytics' | 'milestones') => void;
  onOpenNewHabit: () => void;
  onOpenHabitPacks: () => void;
  onOpenSync: () => void;
  onOpenWallpaper: () => void;
  onOpenReflection: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenNewHabit,
  onOpenHabitPacks,
  onOpenSync,
  onOpenWallpaper,
  onOpenReflection,
}) => {
  const { profile, levelInfo, toggleSound, setAmbientSound, getYearStats } = useHabits();
  const [ambientMenuOpen, setAmbientMenuOpen] = useState(false);
  const [notifPermission, setNotifPermission] = useState<NotificationPermission>('default');

  const yearStats = getYearStats();
  const isAmbientActive = profile.ambientSound && profile.ambientSound !== 'off';

  useEffect(() => {
    setNotifPermission(getNotificationPermission());
  }, []);

  const handleToggleNotifications = async () => {
    const granted = await requestNotificationPermission();
    setNotifPermission(granted ? 'granted' : 'denied');
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-obsidian-950/85 backdrop-blur-xl transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-4">
            <div className="relative group cursor-pointer" onClick={() => setActiveTab('habits')}>
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-crimson to-crimson-dark flex items-center justify-center shadow-glow-crimson group-hover:scale-105 transition-transform duration-300 border border-crimson-glow/40">
                <Flame className="w-6 h-6 text-white animate-pulse-subtle" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-gold flex items-center justify-center text-[9px] font-extrabold text-obsidian-950 shadow-sm border border-obsidian-900">
                365
              </div>
            </div>
            
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="font-cinematic text-xl font-bold tracking-wider text-white uppercase m-0 leading-tight">
                  Forge <span className="text-crimson">365</span>
                </h1>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] uppercase font-mono tracking-widest bg-white/5 text-titanium-light rounded border border-white/10">
                  Discipline OS
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono tracking-wide m-0 hidden sm:block">
                Day {yearStats.daysElapsed} of {yearStats.totalDays} • {yearStats.daysRemaining} days left
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden lg:flex items-center p-1.5 rounded-xl bg-obsidian-900/90 border border-white/10 space-x-1 shadow-inner">
            <button
              onClick={() => setActiveTab('habits')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                activeTab === 'habits'
                  ? 'bg-crimson text-white shadow-glow-crimson font-bold'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Rituals</span>
            </button>

            <button
              onClick={() => setActiveTab('goals')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                activeTab === 'goals'
                  ? 'bg-gold text-obsidian-950 font-bold shadow-glow-gold'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
              }`}
            >
              <Target className="w-3.5 h-3.5" />
              <span>Goals</span>
            </button>

            <button
              onClick={() => setActiveTab('challenges')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                activeTab === 'challenges'
                  ? 'bg-crimson text-white font-bold shadow-glow-crimson'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
              }`}
            >
              <Swords className="w-3.5 h-3.5 text-crimson" />
              <span>Winter Arc</span>
            </button>

            <button
              onClick={() => setActiveTab('insights')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                activeTab === 'insights'
                  ? 'bg-cyan-500 text-obsidian-950 font-bold shadow-glow-cyan'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
              }`}
            >
              <Brain className="w-3.5 h-3.5" />
              <span>Insights</span>
            </button>

            <button
              onClick={() => setActiveTab('heatmap')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                activeTab === 'heatmap'
                  ? 'bg-white/15 text-white font-bold'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
              }`}
            >
              <CalendarDays className="w-3.5 h-3.5" />
              <span>365 Grid</span>
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                activeTab === 'analytics'
                  ? 'bg-white/15 text-white font-bold'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Stats</span>
            </button>

            <button
              onClick={() => setActiveTab('milestones')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                activeTab === 'milestones'
                  ? 'bg-white/15 text-white font-bold'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Badges</span>
            </button>
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Notification Permission Bell */}
            <button
              type="button"
              onClick={handleToggleNotifications}
              className={`p-2.5 rounded-xl border transition-all duration-200 relative ${
                notifPermission === 'granted'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-glow-gold'
                  : 'bg-obsidian-850 text-slate-500 border-white/10 hover:text-slate-200'
              }`}
              title={
                notifPermission === 'granted' 
                  ? 'Habit Reminders Active (Notifications Enabled)' 
                  : 'Click to Enable Habit Time Reminders & Notifications'
              }
            >
              {notifPermission === 'granted' ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
            </button>

            {/* Level & XP Pill */}
            <div className="hidden xl:flex items-center space-x-3 px-3.5 py-1.5 rounded-xl bg-obsidian-850 border border-gold/30 shadow-glow-gold">
              <div className="flex flex-col items-end">
                <div className="flex items-center space-x-1.5">
                  <span className="text-[11px] font-cinematic font-bold text-gold uppercase tracking-wider">
                    {levelInfo.title}
                  </span>
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-gold/20 text-gold border border-gold/40">
                    LVL {levelInfo.level}
                  </span>
                </div>
                <div className="w-20 h-1.5 bg-obsidian-950 rounded-full overflow-hidden mt-1 border border-white/5">
                  <div 
                    className="h-full bg-gradient-to-r from-gold to-crimson rounded-full transition-all duration-500" 
                    style={{ width: `${levelInfo.progressPercent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Routine Packs Trigger */}
            <button
              onClick={onOpenHabitPacks}
              className="p-2.5 rounded-xl bg-obsidian-850 text-slate-400 border border-white/10 hover:text-gold hover:border-gold/40 transition-all duration-200"
              title="Discipline Protocols & Starter Packs"
            >
              <Sparkles className="w-4 h-4" />
            </button>

            {/* Ambient Sound Dropdown & Toggle */}
            <div className="relative">
              <button
                onClick={() => setAmbientMenuOpen(!ambientMenuOpen)}
                className={`p-2.5 rounded-xl border transition-all duration-200 relative ${
                  isAmbientActive
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/60 shadow-glow-cyan'
                    : 'bg-obsidian-850 text-slate-400 border-white/10 hover:text-slate-200 hover:bg-white/5'
                }`}
                title="Ambient Focus Soundscapes (Rain, Fire, 432Hz)"
              >
                <Headphones className="w-4 h-4" />
                {isAmbientActive && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                )}
              </button>

              {ambientMenuOpen && (
                <div className="absolute right-0 mt-2 w-52 rounded-xl bg-obsidian-900 border border-white/15 shadow-2xl p-2 z-50 animate-fade-in backdrop-blur-2xl">
                  <div className="px-2 py-1 text-[10px] font-mono uppercase text-slate-400 tracking-wider flex items-center justify-between">
                    <span>Focus Soundscape</span>
                    {isAmbientActive && <span className="text-cyan-400 font-bold">PLAYING</span>}
                  </div>

                  <button
                    onClick={() => { setAmbientSound('off'); setAmbientMenuOpen(false); }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center space-x-2 my-1 transition-all ${
                      !isAmbientActive 
                        ? 'bg-white/10 text-white font-semibold' 
                        : 'bg-crimson/20 text-crimson hover:bg-crimson/30 font-bold border border-crimson/40'
                    }`}
                  >
                    <Square className="w-3.5 h-3.5 fill-current" />
                    <span>Turn Off Audio</span>
                  </button>

                  <div className="h-[1px] bg-white/10 my-1" />

                  <button
                    onClick={() => { setAmbientSound('rain'); setAmbientMenuOpen(false); }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                      profile.ambientSound === 'rain' ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40' : 'text-slate-300 hover:bg-white/5'
                    }`}
                  >
                    <span>🌧️ Noir Rainfall</span>
                    {profile.ambientSound === 'rain' && <span className="text-[10px] font-mono">ON</span>}
                  </button>
                  <button
                    onClick={() => { setAmbientSound('focus'); setAmbientMenuOpen(false); }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                      profile.ambientSound === 'focus' ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40' : 'text-slate-300 hover:bg-white/5'
                    }`}
                  >
                    <span>⚡ 432Hz Alpha Waves</span>
                    {profile.ambientSound === 'focus' && <span className="text-[10px] font-mono">ON</span>}
                  </button>
                  <button
                    onClick={() => { setAmbientSound('fire'); setAmbientMenuOpen(false); }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                      profile.ambientSound === 'fire' ? 'bg-crimson/20 text-crimson font-bold border border-crimson/40' : 'text-slate-300 hover:bg-white/5'
                    }`}
                  >
                    <span>🔥 Forge Hearth Fire</span>
                    {profile.ambientSound === 'fire' && <span className="text-[10px] font-mono">ON</span>}
                  </button>
                </div>
              )}
            </div>

            {/* Sound FX Toggle */}
            <button
              onClick={toggleSound}
              className={`p-2.5 rounded-xl border transition-all duration-200 ${
                profile.soundEnabled
                  ? 'bg-obsidian-850 text-slate-200 border-white/10 hover:border-crimson/50'
                  : 'bg-obsidian-850 text-slate-500 border-white/5 hover:text-slate-300'
              }`}
              title={profile.soundEnabled ? 'Click to Mute All Sound Effects' : 'Click to Enable Sound Effects'}
            >
              {profile.soundEnabled ? <Volume2 className="w-4 h-4 text-slate-300" /> : <VolumeX className="w-4 h-4 text-slate-600" />}
            </button>

            {/* Wallpaper Selector */}
            <button
              onClick={onOpenWallpaper}
              className="p-2.5 rounded-xl bg-obsidian-850 text-slate-400 border border-white/10 hover:text-slate-200 hover:border-white/20 transition-all duration-200"
              title="Cinematic Wallpaper & Atmosphere Studio"
            >
              <ImageIcon className="w-4 h-4" />
            </button>

            {/* Sync & Backup */}
            <button
              onClick={onOpenSync}
              className="p-2.5 rounded-xl bg-obsidian-850 text-slate-400 border border-white/10 hover:text-slate-200 hover:border-white/20 transition-all duration-200"
              title="Cloud Sync, Backup & Restore"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            {/* Quick Evening Reflection */}
            <button
              onClick={onOpenReflection}
              className="hidden sm:flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-obsidian-800 text-slate-300 border border-white/10 hover:border-gold/40 hover:text-gold transition-all duration-200 text-xs font-medium"
              title="Daily Evening Audit & Reflection"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Evening Log</span>
            </button>

            {/* Add Habit Button */}
            <button
              onClick={onOpenNewHabit}
              className="flex items-center space-x-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-crimson hover:bg-crimson-glow text-white font-medium text-xs sm:text-sm shadow-glow-crimson transition-all duration-200 active:scale-95 border border-crimson-glow/50"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Habit</span>
            </button>

          </div>
        </div>

        {/* Mobile Bottom Tab Bar */}
        <div className="flex lg:hidden items-center justify-around py-2 border-t border-white/5 overflow-x-auto">
          <button
            onClick={() => setActiveTab('habits')}
            className={`flex flex-col items-center py-1 px-2 text-xs ${activeTab === 'habits' ? 'text-crimson font-bold' : 'text-slate-400'}`}
          >
            <Flame className="w-4 h-4" />
            <span>Rituals</span>
          </button>
          <button
            onClick={() => setActiveTab('goals')}
            className={`flex flex-col items-center py-1 px-2 text-xs ${activeTab === 'goals' ? 'text-gold font-bold' : 'text-slate-400'}`}
          >
            <Target className="w-4 h-4" />
            <span>Goals</span>
          </button>
          <button
            onClick={() => setActiveTab('challenges')}
            className={`flex flex-col items-center py-1 px-2 text-xs ${activeTab === 'challenges' ? 'text-crimson font-bold' : 'text-slate-400'}`}
          >
            <Swords className="w-4 h-4" />
            <span>Winter Arc</span>
          </button>
          <button
            onClick={() => setActiveTab('insights')}
            className={`flex flex-col items-center py-1 px-2 text-xs ${activeTab === 'insights' ? 'text-cyan-400 font-bold' : 'text-slate-400'}`}
          >
            <Brain className="w-4 h-4" />
            <span>Insights</span>
          </button>
          <button
            onClick={() => setActiveTab('heatmap')}
            className={`flex flex-col items-center py-1 px-2 text-xs ${activeTab === 'heatmap' ? 'text-crimson font-bold' : 'text-slate-400'}`}
          >
            <CalendarDays className="w-4 h-4" />
            <span>365 Grid</span>
          </button>
        </div>

      </div>
    </header>
  );
};
