import React, { useState, useRef } from 'react';
import { useHabits } from '../context/HabitContext';
import { 
  X, 
  RefreshCw, 
  Download, 
  Upload, 
  Sparkles, 
  Trash2, 
  CheckCircle2, 
  AlertTriangle,
  Radio
} from 'lucide-react';

interface DataSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DataSyncModal: React.FC<DataSyncModalProps> = ({ isOpen, onClose }) => {
  const { exportData, importData, loadDemoData, resetData } = useHabits();
  const [syncStatusMessage, setSyncStatusMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleExport = () => {
    try {
      const data = exportData();
      const jsonStr = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `forge365_backup_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setIsSuccess(true);
      setSyncStatusMessage('Backup successfully exported to JSON file.');
    } catch {
      setIsSuccess(false);
      setSyncStatusMessage('Failed to generate export file.');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);
        const ok = importData(parsed);
        if (ok) {
          setIsSuccess(true);
          setSyncStatusMessage('Data restored & synchronized successfully!');
        } else {
          setIsSuccess(false);
          setSyncStatusMessage('Failed to restore. Invalid file structure.');
        }
      } catch {
        setIsSuccess(false);
        setSyncStatusMessage('Could not parse JSON file.');
      }
    };
    reader.readAsText(file);
  };

  const handleLoadDemo = () => {
    if (confirm('Load 45 days of realistic sample habit completions to preview the 365-day charts?')) {
      loadDemoData();
      setIsSuccess(true);
      setSyncStatusMessage('Generated 45 days of discipline history!');
    }
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all tracked habits and history? This cannot be undone unless you exported a backup.')) {
      resetData();
      setIsSuccess(true);
      setSyncStatusMessage('All logs and custom habits have been reset.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg rounded-2xl bg-obsidian-900 border border-white/15 shadow-2xl overflow-hidden max-h-[85vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div className="flex items-center space-x-2">
            <RefreshCw className="w-5 h-5 text-crimson" />
            <h3 className="font-cinematic text-lg font-bold text-white">
              Data Synchronization & Storage
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
        <div className="p-6 space-y-5 overflow-y-auto">
          
          {/* Real-time sync status indicator */}
          <div className="p-4 rounded-xl bg-obsidian-950/80 border border-emerald-500/30 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Radio className="w-5 h-5 text-emerald-400 animate-pulse" />
                <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-emerald-400" />
              </div>
              <div>
                <div className="text-xs font-mono font-bold text-white">
                  Real-Time Multi-Tab Sync Active
                </div>
                <div className="text-[11px] text-slate-400 font-mono">
                  Changes automatically sync instantly across browser windows.
                </div>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              LIVE
            </span>
          </div>

          {/* Feedback message */}
          {syncStatusMessage && (
            <div className={`p-3 rounded-xl border text-xs font-mono flex items-center space-x-2 ${
              isSuccess 
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300' 
                : 'bg-crimson/15 border-crimson/40 text-crimson'
            }`}>
              {isSuccess ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
              <span>{syncStatusMessage}</span>
            </div>
          )}

          {/* Actions: Export / Import */}
          <div className="space-y-3">
            <label className="block text-xs font-mono uppercase text-slate-300 font-bold">
              Backup & Device Sync
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              
              <button
                onClick={handleExport}
                className="p-4 rounded-xl bg-obsidian-950/80 border border-white/10 hover:border-crimson/40 hover:bg-obsidian-850 flex flex-col items-start space-y-1 transition-all group"
              >
                <div className="flex items-center space-x-2 text-white font-semibold text-xs group-hover:text-crimson">
                  <Download className="w-4 h-4 text-crimson" />
                  <span>Export Backup (.JSON)</span>
                </div>
                <p className="text-[11px] text-slate-400 font-mono">
                  Download all 365-day history & habits.
                </p>
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-4 rounded-xl bg-obsidian-950/80 border border-white/10 hover:border-gold/40 hover:bg-obsidian-850 flex flex-col items-start space-y-1 transition-all group"
              >
                <div className="flex items-center space-x-2 text-white font-semibold text-xs group-hover:text-gold">
                  <Upload className="w-4 h-4 text-gold" />
                  <span>Import / Restore</span>
                </div>
                <p className="text-[11px] text-slate-400 font-mono">
                  Restore from saved JSON file.
                </p>
              </button>

              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept=".json" 
                className="hidden" 
              />
            </div>
          </div>

          {/* Demo Data & Factory Reset */}
          <div className="pt-4 border-t border-white/10 space-y-3">
            <label className="block text-xs font-mono uppercase text-slate-300 font-bold">
              Developer & Testing Tools
            </label>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleLoadDemo}
                className="flex-1 px-4 py-2.5 rounded-xl bg-obsidian-800 text-slate-200 border border-white/10 hover:bg-white/10 text-xs font-medium flex items-center justify-center space-x-2 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-gold" />
                <span>Generate 45D Demo History</span>
              </button>

              <button
                onClick={handleReset}
                className="px-4 py-2.5 rounded-xl bg-crimson/15 text-crimson border border-crimson/30 hover:bg-crimson/25 text-xs font-medium flex items-center justify-center space-x-2 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Reset All Data</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
