import React, { useState } from 'react';
import { Moon, Sun, Globe, Bell, Shield, HelpCircle, LogOut, ChevronRight, Lock, Check } from 'lucide-react';

const SettingsScreen = ({ isDarkMode, onToggleDarkMode, onSignOut }) => {
  const [language, setLanguage] = useState("English (US)");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [locationHighAccuracy, setLocationHighAccuracy] = useState(true);

  return (
    <div className="flex flex-col min-h-[580px] p-4 space-y-4 animate-fade-in bg-slate-50 dark:bg-slate-950 pb-20 rounded-3xl">
      {/* Header */}
      <div className="flex items-center justify-between pt-1">
        <h2 className="font-extrabold text-base text-slate-900 dark:text-white">Settings & Preferences</h2>
      </div>

      {/* Appearance Section */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Appearance & Theme</h4>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-3.5 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              {isDarkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </div>
            <div>
              <h5 className="font-bold text-xs text-slate-900 dark:text-white">Dark Mode</h5>
              <p className="text-[10px] text-slate-500">{isDarkMode ? 'Dark theme active' : 'Light theme active'}</p>
            </div>
          </div>

          <button
            onClick={onToggleDarkMode}
            className={`w-12 h-6 rounded-full p-1 transition-colors ${
              isDarkMode ? 'bg-blue-600' : 'bg-slate-300'
            }`}
          >
            <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
              isDarkMode ? 'translate-x-6' : 'translate-x-0'
            }`} />
          </button>
        </div>
      </div>

      {/* Language Selection */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Localization</h4>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-3.5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <h5 className="font-bold text-xs text-slate-900 dark:text-white">App Language</h5>
                <p className="text-[10px] text-slate-500">{language}</p>
              </div>
            </div>

            <select
              value={language}
              onChange={e => setLanguage(e.target.value)}
              className="bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold py-1.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none"
            >
              <option>English (US)</option>
              <option>Spanish (Español)</option>
              <option>Hindi (हिन्दी)</option>
              <option>French (Français)</option>
              <option>German (Deutsch)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notifications & Privacy */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Privacy & Notifications</h4>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-3.5 shadow-sm space-y-3">
          {/* Push Notifications Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h5 className="font-bold text-xs text-slate-900 dark:text-white">Push Notifications</h5>
                <p className="text-[10px] text-slate-500">Real-time status updates</p>
              </div>
            </div>

            <button
              onClick={() => setNotificationsEnabled(!notificationsEnabled)}
              className={`w-12 h-6 rounded-full p-1 transition-colors ${
                notificationsEnabled ? 'bg-blue-600' : 'bg-slate-300'
              }`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                notificationsEnabled ? 'translate-x-6' : 'translate-x-0'
              }`} />
            </button>
          </div>

          <div className="border-t border-slate-100 dark:border-slate-800 pt-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h5 className="font-bold text-xs text-slate-900 dark:text-white">High Accuracy GPS</h5>
                <p className="text-[10px] text-slate-500">Precise location tagging</p>
              </div>
            </div>

            <button
              onClick={() => setLocationHighAccuracy(!locationHighAccuracy)}
              className={`w-12 h-6 rounded-full p-1 transition-colors ${
                locationHighAccuracy ? 'bg-blue-600' : 'bg-slate-300'
              }`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                locationHighAccuracy ? 'translate-x-6' : 'translate-x-0'
              }`} />
            </button>
          </div>
        </div>
      </div>

      {/* Support & Sign Out */}
      <div className="space-y-2 pt-2">
        <button
          onClick={onSignOut}
          className="w-full py-3.5 px-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 font-bold text-xs rounded-2xl flex items-center justify-center gap-2 hover:bg-red-100 transition-all"
        >
          <LogOut className="w-4 h-4" /> Sign Out of Account
        </button>
      </div>
    </div>
  );
};

export default SettingsScreen;
