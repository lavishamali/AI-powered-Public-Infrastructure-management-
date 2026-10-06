import React, { useState } from 'react';
import {
  ShieldAlert,
  FilePlus,
  Search,
  LayoutDashboard,
  MapPin,
  Info,
  RotateCcw,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { resetDemoDatabase } from '../services/api.js';

interface NavbarProps {
  currentTab: 'landing' | 'report' | 'track' | 'dashboard' | 'map' | 'about';
  onSelectTab: (tab: 'landing' | 'report' | 'track' | 'dashboard' | 'map' | 'about') => void;
  onRefreshData?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onSelectTab, onRefreshData }) => {
  const [resetting, setResetting] = useState(false);
  const [resetMessage, setResetMessage] = useState<string | null>(null);

  const handleResetDemo = async () => {
    if (!window.confirm('Reset all incidents and citizen reports to the original demo dataset?')) {
      return;
    }
    setResetting(true);
    try {
      await resetDemoDatabase();
      setResetMessage('Demo dataset reset successfully');
      if (onRefreshData) onRefreshData();
      setTimeout(() => setResetMessage(null), 3500);
    } catch (err: any) {
      alert(`Error resetting demo: ${err.message}`);
    } finally {
      setResetting(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-900 border-b border-slate-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Civic Identity */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => onSelectTab('landing')}
          >
            <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm ring-2 ring-blue-400/20 group-hover:bg-blue-500 transition-colors">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight text-white group-hover:text-blue-400 transition-colors">
                  CivicVision<span className="text-blue-500">AI</span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-900/60 text-blue-300 border border-blue-700/50 px-1.5 py-0.5 rounded">
                  v2.6 Triage
                </span>
              </div>
              <p className="text-[11px] text-slate-400 tracking-wide font-medium hidden sm:block">
                Infrastructure Monitoring &amp; Prioritization System
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => onSelectTab('landing')}
              className={`px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                currentTab === 'landing'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              Home
            </button>

            <button
              onClick={() => onSelectTab('report')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                currentTab === 'report'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <FilePlus className="w-3.5 h-3.5 text-blue-400" />
              Report an Issue
            </button>

            <button
              onClick={() => onSelectTab('track')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                currentTab === 'track'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Search className="w-3.5 h-3.5 text-slate-400" />
              Track Report
            </button>

            <button
              onClick={() => onSelectTab('dashboard')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                currentTab === 'dashboard'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-amber-400" />
              Authority Dashboard
            </button>

            <button
              onClick={() => onSelectTab('map')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                currentTab === 'map'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              Map View
            </button>

            <button
              onClick={() => onSelectTab('about')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                currentTab === 'about'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Info className="w-3.5 h-3.5 text-slate-400" />
              How It Works
            </button>
          </nav>

          {/* Quick Controls: Demo Reset & Citizen Shortcut */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleResetDemo}
              disabled={resetting}
              title="Reset sample reports and incidents to pristine demo state"
              className="flex items-center gap-1 text-[11px] font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 px-2.5 py-1.5 rounded-lg transition-colors disabled:opacity-50"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${resetting ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Reset Demo</span>
            </button>

            <button
              onClick={() => onSelectTab('report')}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-3 py-1.5 rounded-lg shadow transition-all flex items-center gap-1.5 active:scale-95"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New Report</span>
              <span className="sm:hidden">Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation bar */}
      <div className="md:hidden flex items-center justify-around bg-slate-950/80 border-t border-slate-800/80 px-2 py-2 text-xs">
        <button
          onClick={() => onSelectTab('landing')}
          className={`px-2 py-1 rounded font-medium ${currentTab === 'landing' ? 'text-blue-400 font-bold' : 'text-slate-400'}`}
        >
          Home
        </button>
        <button
          onClick={() => onSelectTab('report')}
          className={`px-2 py-1 rounded font-medium ${currentTab === 'report' ? 'text-blue-400 font-bold' : 'text-slate-400'}`}
        >
          Report
        </button>
        <button
          onClick={() => onSelectTab('dashboard')}
          className={`px-2 py-1 rounded font-medium ${currentTab === 'dashboard' ? 'text-blue-400 font-bold' : 'text-slate-400'}`}
        >
          Dashboard
        </button>
        <button
          onClick={() => onSelectTab('map')}
          className={`px-2 py-1 rounded font-medium ${currentTab === 'map' ? 'text-blue-400 font-bold' : 'text-slate-400'}`}
        >
          Map
        </button>
        <button
          onClick={() => onSelectTab('track')}
          className={`px-2 py-1 rounded font-medium ${currentTab === 'track' ? 'text-blue-400 font-bold' : 'text-slate-400'}`}
        >
          Track
        </button>
      </div>

      {/* Floating Demo Reset Toast Notification */}
      {resetMessage && (
        <div className="bg-emerald-600 text-white text-xs font-semibold py-1.5 px-4 text-center flex items-center justify-center gap-1.5 transition-all">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>{resetMessage}</span>
        </div>
      )}
    </header>
  );
};
