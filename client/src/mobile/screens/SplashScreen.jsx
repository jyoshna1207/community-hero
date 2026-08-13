import React from 'react';
import { ShieldCheck, Sparkles, ChevronRight } from 'lucide-react';

const SplashScreen = ({ onProceed }) => {
  return (
    <div className="flex flex-col items-center justify-between min-h-[580px] p-6 text-center animate-fade-in relative overflow-hidden bg-gradient-to-b from-blue-50/50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 rounded-3xl">
      {/* Background Decorative Rings */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      
      {/* Top Tagline */}
      <div className="w-full pt-4 flex justify-between items-center text-xs font-semibold tracking-wider text-blue-600 dark:text-blue-400 uppercase">
        <span className="flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5" /> Civic Intelligence v2.4
        </span>
        <span className="bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 px-2.5 py-0.5 rounded-full text-[10px]">
          Apple & Linear Design
        </span>
      </div>

      {/* Hero Central Branding */}
      <div className="flex flex-col items-center my-auto z-10 space-y-5">
        <div className="relative group cursor-pointer" onClick={onProceed}>
          <div className="w-24 h-24 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-3xl flex items-center justify-center shadow-xl shadow-blue-500/25 animate-pulse-slow transition-transform transform hover:scale-105">
            <ShieldCheck className="w-13 h-13 text-white stroke-[2.2]" />
          </div>
          <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white rounded-full p-1.5 shadow-md border-2 border-white dark:border-slate-900">
            <Sparkles className="w-4 h-4" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Community <span className="text-blue-600 dark:text-blue-400">Hero</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-[260px] mx-auto font-medium leading-relaxed">
            Report civic issues in seconds. Empower cities, track real-time resolution.
          </p>
        </div>
      </div>

      {/* Bottom CTA Action */}
      <div className="w-full pb-4 z-10 space-y-3">
        <button
          onClick={onProceed}
          className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base rounded-2xl shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
        >
          Explore Experience
          <ChevronRight className="w-5 h-5" />
        </button>
        <p className="text-[11px] text-slate-400 dark:text-slate-500">
          Powered by AI Category Detection & Smart GPS Tagging
        </p>
      </div>
    </div>
  );
};

export default SplashScreen;
