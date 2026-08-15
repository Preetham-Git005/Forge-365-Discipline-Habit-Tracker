export interface Wallpaper {
  id: string;
  name: string;
  category: 'stoic' | 'training' | 'nature' | 'minimal' | 'focus';
  url: string;
  thumbnail: string;
  description: string;
}

export const WALLPAPERS: Wallpaper[] = [
  {
    id: 'marcus-bust',
    name: 'Marcus Aurelius & Stoic Citadel',
    category: 'stoic',
    url: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?auto=format&fit=crop&w=2400&q=85',
    thumbnail: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?auto=format&fit=crop&w=400&q=60',
    description: 'Classical Roman marble bust representing timeless fortitude and internal empire.'
  },
  {
    id: 'iron-forge',
    name: 'The Iron Crucible & Weights',
    category: 'training',
    url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=2400&q=85',
    thumbnail: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=400&q=60',
    description: 'Dark monochrome gym and heavy iron where bodily weakness is conquered daily.'
  },
  {
    id: 'monk-solitude',
    name: 'Misty Alpine Solitude',
    category: 'nature',
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2400&q=85',
    thumbnail: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=60',
    description: 'Moody, towering peaks piercing through storm clouds — quiet solitary discipline.'
  },
  {
    id: 'deep-scholar',
    name: 'Midnight Stoic Library',
    category: 'focus',
    url: 'https://images.unsplash.com/photo-1507842229451-79b1be886a20?auto=format&fit=crop&w=2400&q=85',
    thumbnail: 'https://images.unsplash.com/photo-1507842229451-79b1be886a20?auto=format&fit=crop&w=400&q=60',
    description: 'Atmospheric library of deep knowledge, candlelit reflection, and undivided focus.'
  },
  {
    id: 'boxing-grit',
    name: 'Dark Boxing Shadow Arena',
    category: 'training',
    url: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&w=2400&q=85',
    thumbnail: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&w=400&q=60',
    description: 'Dramatic silhouette in the ring, focused on relentless persistence.'
  },
  {
    id: 'samurai-blade',
    name: 'The Dokkodo / Way of the Sword',
    category: 'minimal',
    url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=2400&q=85',
    thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=400&q=60',
    description: 'Dark obsidian minimalist aesthetic inspired by Musashi and strict martial focus.'
  },
  {
    id: 'rain-nocturne',
    name: 'Noir Night Rainfall',
    category: 'focus',
    url: 'https://images.unsplash.com/photo-1519692933481-e162a57d6721?auto=format&fit=crop&w=2400&q=85',
    thumbnail: 'https://images.unsplash.com/photo-1519692933481-e162a57d6721?auto=format&fit=crop&w=400&q=60',
    description: 'Rain glistening on dark asphalt under neon glow, contemplative solitude.'
  },
  {
    id: 'obsidian-void',
    name: 'Pure Obsidian Carbon Minimal',
    category: 'minimal',
    url: '',
    thumbnail: '',
    description: 'Zero distractions. Deep velvety obsidian black gradient for laser focus.'
  }
];

export const getWallpaperById = (id: string, customUrl?: string): Wallpaper => {
  if (id === 'custom' && customUrl) {
    return {
      id: 'custom',
      name: 'Custom Discipline Backdrop',
      category: 'focus',
      url: customUrl,
      thumbnail: customUrl,
      description: 'Your personalized high-resolution background image.'
    };
  }
  return WALLPAPERS.find(w => w.id === id) || WALLPAPERS[0];
};
