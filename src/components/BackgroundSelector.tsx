import React, { useState } from 'react';
import { WALLPAPERS } from '../utils/wallpapers';
import { useHabits } from '../context/HabitContext';
import { 
  X, 
  Image as ImageIcon, 
  Check, 
  Sliders, 
  Link2 
} from 'lucide-react';

interface BackgroundSelectorProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BackgroundSelector: React.FC<BackgroundSelectorProps> = ({ isOpen, onClose }) => {
  const { profile, setBackgroundTheme, updateWallpaperSettings } = useHabits();
  const [customInputUrl, setCustomInputUrl] = useState(profile.customWallpaperUrl || '');

  if (!isOpen) return null;

  const currentOpacity = profile.wallpaperOpacity !== undefined ? profile.wallpaperOpacity : 45;
  const currentBlur = profile.wallpaperBlur !== undefined ? profile.wallpaperBlur : 0;
  const isGrayscale = profile.wallpaperGrayscale ?? false;

  const handleApplyCustomUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInputUrl.trim()) return;
    updateWallpaperSettings({ customUrl: customInputUrl.trim() });
    setBackgroundTheme('custom');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl rounded-2xl bg-obsidian-900 border border-white/15 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div className="flex items-center space-x-2">
            <ImageIcon className="w-5 h-5 text-crimson" />
            <h3 className="font-cinematic text-lg font-bold text-white">
              Discipline Atmosphere & Wallpaper Studio
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
        <div className="p-6 space-y-6 overflow-y-auto">
          
          {/* Controls: Opacity & Blur & Tone */}
          <div className="p-4 rounded-xl bg-obsidian-950/80 border border-white/10 space-y-4">
            <div className="flex items-center space-x-2 text-xs font-mono uppercase text-slate-300 font-bold">
              <Sliders className="w-4 h-4 text-gold" />
              <span>Backdrop Tuning Controls</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              {/* Opacity Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono text-slate-400">
                  <span>Photo Opacity</span>
                  <span className="text-white font-bold">{currentOpacity}%</span>
                </div>
                <input 
                  type="range" 
                  min="15" 
                  max="85" 
                  step="5"
                  value={currentOpacity}
                  onChange={(e) => updateWallpaperSettings({ opacity: Number(e.target.value) })}
                  className="w-full accent-crimson cursor-pointer"
                />
              </div>

              {/* Blur Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono text-slate-400">
                  <span>Depth Blur</span>
                  <span className="text-white font-bold">{currentBlur}px</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="12" 
                  step="1"
                  value={currentBlur}
                  onChange={(e) => updateWallpaperSettings({ blur: Number(e.target.value) })}
                  className="w-full accent-gold cursor-pointer"
                />
              </div>

              {/* Monochrome vs Color Mode */}
              <div className="space-y-1.5 flex flex-col justify-end">
                <button
                  type="button"
                  onClick={() => updateWallpaperSettings({ grayscale: !isGrayscale })}
                  className={`w-full py-2 px-3 rounded-lg border text-xs font-mono font-semibold transition-all ${
                    isGrayscale 
                      ? 'bg-white/10 text-white border-white/30' 
                      : 'bg-crimson/20 text-crimson border-crimson/40 shadow-glow-crimson'
                  }`}
                >
                  {isGrayscale ? 'Noir Monochrome' : 'Cinematic Color'}
                </button>
              </div>

            </div>
          </div>

          {/* Preset Wallpaper Gallery */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-slate-300 font-bold">
                Curated Discipline backdrops
              </span>
              <span className="text-[11px] font-mono text-slate-500">
                Click any photo to apply instantly
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {WALLPAPERS.map(wp => {
                const isSelected = profile.backgroundTheme === wp.id;

                return (
                  <button
                    key={wp.id}
                    onClick={() => setBackgroundTheme(wp.id)}
                    className={`group relative text-left rounded-xl overflow-hidden border transition-all duration-200 ${
                      isSelected 
                        ? 'border-crimson ring-2 ring-crimson shadow-glow-crimson' 
                        : 'border-white/10 hover:border-white/30'
                    }`}
                  >
                    {/* Image or gradient box */}
                    <div className="h-32 w-full bg-obsidian-950 relative overflow-hidden">
                      {wp.url ? (
                        <img 
                          src={wp.thumbnail || wp.url} 
                          alt={wp.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-obsidian-950 via-obsidian-900 to-obsidian-850 flex items-center justify-center">
                          <span className="text-xs font-mono text-slate-500">Pure Obsidian Void</span>
                        </div>
                      )}
                      
                      <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950/80 via-transparent to-black/30" />

                      {isSelected && (
                        <div className="absolute top-2 right-2 px-2 py-1 rounded-md bg-crimson text-white text-[10px] font-mono font-bold flex items-center space-x-1 shadow-glow-crimson">
                          <Check className="w-3 h-3 stroke-[3]" />
                          <span>Active</span>
                        </div>
                      )}
                    </div>

                    <div className="p-3 bg-obsidian-900/95 border-t border-white/5 space-y-0.5">
                      <div className="flex items-center justify-between">
                        <span className="font-cinematic text-sm font-bold text-white group-hover:text-crimson transition-colors">
                          {wp.name}
                        </span>
                        <span className="text-[10px] font-mono uppercase text-slate-500">
                          {wp.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-1">
                        {wp.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom URL Input */}
          <form onSubmit={handleApplyCustomUrl} className="pt-2 border-t border-white/10 space-y-2">
            <label className="block text-xs font-mono uppercase text-slate-300 font-bold flex items-center space-x-1.5">
              <Link2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Use Custom Discipline Image URL</span>
            </label>
            <div className="flex gap-2">
              <input 
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={customInputUrl}
                onChange={(e) => setCustomInputUrl(e.target.value)}
                className="flex-1 px-3.5 py-2 rounded-xl bg-obsidian-950 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-crimson"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500 text-cyan-300 hover:text-obsidian-950 border border-cyan-500/40 text-xs font-bold transition-all"
              >
                Apply Custom Photo
              </button>
            </div>
          </form>

        </div>

      </div>
    </div>
  );
};
