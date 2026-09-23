import React from 'react';
import { Volume2, Terminal, BookOpen, ShieldCheck, Key, Settings, User as UserIcon, Activity, Sparkles } from 'lucide-react';
import { UserProfile } from '../types';

interface NavbarProps {
  activeTab: 'home' | 'playground' | 'console' | 'docs' | 'pricing';
  setActiveTab: (tab: 'home' | 'playground' | 'console' | 'docs' | 'pricing') => void;
  user: UserProfile;
  remainingRequests: number;
  totalDailyQuota: number;
  onOpenAuth: () => void;
  onOpenAdmin: () => void;
  onOpenStatus: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  user,
  remainingRequests,
  totalDailyQuota,
  onOpenAuth,
  onOpenAdmin,
  onOpenStatus,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-200 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <div className="flex items-center gap-8">
          <button
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2.5 text-left focus:outline-none group"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-900 text-white shadow-sm transition-transform group-hover:scale-105">
              <Volume2 className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-neutral-900">AxiTex</span>
              <span className="ml-1.5 rounded bg-emerald-50 px-1.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200">
                Voice AI
              </span>
            </div>
          </button>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => setActiveTab('home')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'home'
                  ? 'bg-neutral-100 text-neutral-900 font-semibold'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => setActiveTab('playground')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'playground'
                  ? 'bg-neutral-100 text-neutral-900 font-semibold'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
              }`}
            >
              <Sparkles className="h-4 w-4 text-emerald-600" />
              Text to Speech
            </button>
            <button
              onClick={() => setActiveTab('console')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'console'
                  ? 'bg-neutral-100 text-neutral-900 font-semibold'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
              }`}
            >
              <Terminal className="h-4 w-4 text-neutral-500" />
              API Console
            </button>
            <button
              onClick={() => setActiveTab('docs')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'docs'
                  ? 'bg-neutral-100 text-neutral-900 font-semibold'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
              }`}
            >
              <BookOpen className="h-4 w-4 text-neutral-500" />
              Documentation
            </button>
            <button
              onClick={() => setActiveTab('pricing')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'pricing'
                  ? 'bg-neutral-100 text-neutral-900 font-semibold'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
              }`}
            >
              Pricing
            </button>
          </nav>
        </div>

        {/* Right side: Status, Quota, Profile & Admin */}
        <div className="flex items-center gap-3">
          {/* Operational Status Pill */}
          <button
            onClick={onOpenStatus}
            title="Click to check live API health and latency"
            className="hidden sm:flex items-center gap-1.5 rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-1 text-xs font-medium text-neutral-700 hover:bg-neutral-100 transition-colors"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
            </span>
            <span>API Operational</span>
          </button>

          {/* Daily Quota Badge */}
          <div
            className="flex items-center gap-1.5 rounded-md border border-neutral-200 bg-neutral-50 px-2.5 py-1 text-xs font-medium text-neutral-700"
            title="Free tier daily requests remaining"
          >
            <span className="text-neutral-500">Free Quota:</span>
            <span className={`font-semibold ${remainingRequests <= 5 ? 'text-amber-600' : 'text-neutral-900'}`}>
              {remainingRequests} / {totalDailyQuota}
            </span>
          </div>

          {/* Admin Control shortcut */}
          <button
            onClick={onOpenAdmin}
            title="Admin System Settings"
            className="p-1.5 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-md transition-colors"
          >
            <Settings className="h-4 w-4" />
          </button>

          {/* User Sign In / Profile */}
          <button
            onClick={onOpenAuth}
            className="flex items-center gap-2 rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-sm font-medium text-neutral-800 shadow-sm hover:bg-neutral-50 transition-colors"
          >
            <UserIcon className="h-4 w-4 text-neutral-500" />
            <span className="hidden sm:inline max-w-[120px] truncate">{user.name || 'Sign In'}</span>
          </button>

          {/* Primary CTA */}
          <button
            onClick={() => setActiveTab('playground')}
            className="hidden lg:inline-flex items-center gap-1.5 rounded-md bg-neutral-900 px-3.5 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-neutral-800 transition-colors"
          >
            Get Started
          </button>
        </div>
      </div>
    </header>
  );
};
