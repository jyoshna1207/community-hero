import React, { useState } from 'react';
import { User, Award, ShieldCheck, MapPin, CheckCircle2, AlertCircle, ThumbsUp, Flame, Settings as SettingsIcon, ChevronRight } from 'lucide-react';
import { MOCK_USER_PROFILE } from '../mockData';

const ProfileScreen = ({ onOpenSettings, onSelectIssue, userIssues }) => {
  const profile = MOCK_USER_PROFILE;

  return (
    <div className="flex flex-col min-h-[580px] p-4 space-y-4 animate-fade-in bg-slate-50 dark:bg-slate-950 pb-20 rounded-3xl">
      {/* Header with Settings Trigger */}
      <div className="flex items-center justify-between pt-1">
        <h2 className="font-extrabold text-base text-slate-900 dark:text-white">Citizen Profile</h2>
        <button
          onClick={onOpenSettings}
          className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all shadow-sm"
        >
          <SettingsIcon className="w-4 h-4" />
        </button>
      </div>

      {/* Hero Profile Card */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-3xl p-4 shadow-xl space-y-4 relative overflow-hidden">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={profile.avatar}
              alt={profile.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-white/80 shadow-md"
            />
            <div className="absolute -bottom-1 -right-1 bg-amber-400 text-slate-900 text-[10px] font-extrabold px-1.5 py-0.5 rounded-md border border-white">
              #{profile.rank}
            </div>
          </div>

          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5">
              <h3 className="font-extrabold text-lg text-white">{profile.name}</h3>
              <ShieldCheck className="w-4 h-4 text-emerald-300 fill-emerald-400" />
            </div>
            <p className="text-xs text-blue-100 font-semibold">{profile.levelTitle}</p>
            <p className="text-[11px] text-blue-200 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-amber-300" /> {profile.ward}
            </p>
          </div>
        </div>

        {/* Impact Metrics Grid */}
        <div className="grid grid-cols-4 gap-2 pt-2 border-t border-white/20 text-center">
          <div>
            <p className="text-lg font-extrabold">{profile.points}</p>
            <p className="text-[10px] text-blue-200 font-medium">Hero Pts</p>
          </div>
          <div>
            <p className="text-lg font-extrabold">{profile.stats.submitted}</p>
            <p className="text-[10px] text-blue-200 font-medium">Reports</p>
          </div>
          <div>
            <p className="text-lg font-extrabold">{profile.stats.solved}</p>
            <p className="text-[10px] text-blue-200 font-medium">Solved</p>
          </div>
          <div>
            <p className="text-lg font-extrabold">{profile.stats.upvotes}</p>
            <p className="text-[10px] text-blue-200 font-medium">Upvotes</p>
          </div>
        </div>
      </div>

      {/* Badges & Achievements Section */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Earned Hero Badges ({profile.badges.length})</h4>
          <span className="text-[11px] text-blue-600 dark:text-blue-400 font-bold">View All</span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {profile.badges.map(b => (
            <div key={b.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-2xl shadow-sm flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0 font-bold">
                <Award className="w-5 h-5" />
              </div>
              <div className="space-y-0.5 overflow-hidden">
                <h5 className="font-bold text-xs text-slate-900 dark:text-white truncate">{b.title}</h5>
                <p className="text-[10px] text-slate-500 line-clamp-1">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* My Recent Reports */}
      <div className="space-y-2 pt-1">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">My Activity Reports</h4>
        <div className="space-y-2">
          {userIssues.slice(0, 3).map(issue => (
            <div
              key={issue.id}
              onClick={() => onSelectIssue(issue)}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-2xl shadow-sm flex items-center justify-between cursor-pointer hover:border-blue-500 transition-all"
            >
              <div className="flex items-center gap-3">
                <img src={issue.imageUrl} className="w-12 h-12 rounded-xl object-cover" alt="" />
                <div className="space-y-0.5">
                  <h5 className="font-bold text-xs text-slate-900 dark:text-white line-clamp-1">{issue.title}</h5>
                  <p className="text-[10px] text-slate-400">{issue.address}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  issue.status === 'Completed' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                }`}>
                  {issue.status}
                </span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;
