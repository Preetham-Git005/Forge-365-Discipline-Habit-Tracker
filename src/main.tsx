import { StrictMode, Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Forge 365 caught an error:', error, errorInfo);
  }

  handleReset = () => {
    localStorage.clear();
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-obsidian-950 text-white flex items-center justify-center p-6 font-sans">
          <div className="max-w-md w-full p-8 rounded-2xl bg-obsidian-900 border border-crimson/40 shadow-2xl space-y-5 text-center">
            <div className="w-14 h-14 rounded-2xl bg-crimson/20 border border-crimson/40 flex items-center justify-center text-crimson text-2xl mx-auto font-cinematic font-bold">
              ⚔️
            </div>
            <div>
              <h2 className="font-cinematic text-xl font-bold text-white">Forge 365 Recovery</h2>
              <p className="text-xs text-slate-400 font-mono mt-1">
                A rendering conflict was detected in local cache.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-obsidian-950 border border-white/10 text-left text-xs font-mono text-crimson overflow-x-auto max-h-32">
              {this.state.error?.message || 'Unknown render exception'}
            </div>

            <div className="flex gap-3 justify-center">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-mono"
              >
                Reload Page
              </button>
              <button
                type="button"
                onClick={this.handleReset}
                className="px-4 py-2 rounded-xl bg-crimson hover:bg-crimson-glow text-white text-xs font-bold font-mono shadow-glow-crimson"
              >
                Reset & Repair Cache
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Register Service Worker for offline PWA functionality
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
