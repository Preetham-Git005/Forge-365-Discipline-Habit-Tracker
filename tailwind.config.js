/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        obsidian: {
          950: '#040507',
          900: '#08090C',
          850: '#0D0F14',
          800: '#12151D',
          750: '#181C26',
          700: '#1F2430',
          600: '#2A3142',
          500: '#3D465C',
        },
        crimson: {
          DEFAULT: '#E63946',
          glow: '#FF4D5E',
          dark: '#8B1E27',
        },
        gold: {
          DEFAULT: '#D4AF37',
          glow: '#F3C94F',
          dark: '#8F711E',
        },
        titanium: {
          DEFAULT: '#A0AEC0',
          light: '#E2E8F0',
          dark: '#4A5568',
        }
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
        cinematic: ['"Cinzel"', '"Trajan Pro"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'glow-crimson': '0 0 25px -5px rgba(230, 57, 70, 0.35)',
        'glow-gold': '0 0 25px -5px rgba(212, 175, 55, 0.35)',
        'glow-cyan': '0 0 25px -5px rgba(56, 189, 248, 0.35)',
        'obsidian-card': '0 10px 30px -10px rgba(0, 0, 0, 0.8), 0 0 1px 1px rgba(255, 255, 255, 0.07)',
        'glass-inset': 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.1)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'fade-in': 'fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}
