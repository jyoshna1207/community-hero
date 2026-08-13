import React, { useState } from 'react';
import { Search, MapPin, Plus, ThumbsUp, CheckCircle, Clock, ChevronRight, Bell, Sparkles, Trophy } from 'lucide-react';

const CATEGORIES = ["All", "Road Damage", "Water Leakage", "Garbage & Waste", "Streetlight", "Drainage"];

const HomeScreen = ({
  issues,
  onSelectIssue,
  onOpenReport,
  onOpenMap,
  onOpenNotifications,
  isLoading
}) => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredIssues = issues.filter(issue => {
    const matchesCategory = activeCategory === "All" || issue.category.toLowerCase().includes(activeCategory.toLowerCase().slice(0, 4));
    const matchesSearch = issue.title.toLowerCase().includes(searchQuery.toLowerCase()) || issue.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex flex-col min-h-[580px] p-4 space-y-5 animate-fade-in bg-slate-50 dark:bg-slate-950 pb-20 rounded-3xl">
      {/* SCREEN 5 — TOP GREETING HEADER */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h2 className="font-extrabold text-slate-900 dark:text-white text-lg">Hi, Anusha 👋</h2>
          <p className="text-xs text-slate-500 font-medium">Let's make our community a better place.</p>
        </div>

        <button
          onClick={onOpenNotifications}
          className="relative p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 transition-all shadow-sm"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-900" />
        </button>
      </div>

      {/* COMMUNITY HERO SCORE BADGE ILLUSTRATION */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-3xl p-4 shadow-md flex items-center justify-between">
        <div className="space-y-1">
          <span className="text-[10px] font-extrabold uppercase tracking-wider bg-white/20 text-white px-2.5 py-0.5 rounded-full">
            Civic Contributor Rank
          </span>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-black tracking-tight">840</h3>
            <span className="text-xs text-blue-100 font-bold">Community Hero Score</span>
          </div>
          <p className="text-[11px] text-blue-100">Top 5% active reporter in Duvvada Ward 12</p>
        </div>
        <div className="w-12 h-12 bg-amber-400 text-slate-900 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-400/30">
          <Trophy className="w-6 h-6" />
        </div>
      </div>

      {/* QUICK ACTIONS BUTTONS */}
      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={onOpenReport}
          className="p-3 bg-blue-600 text-white rounded-2xl flex flex-col items-center justify-center gap-1.5 font-bold text-xs shadow-md shadow-blue-500/20 active:scale-95 transition-all"
        >
          <Plus className="w-5 h-5" />
          <span>Report Issue</span>
        </button>

        <button
          onClick={() => setActiveCategory("All")}
          className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-2xl flex flex-col items-center justify-center gap-1.5 font-bold text-xs shadow-sm active:scale-95 transition-all"
        >
          <Search className="w-5 h-5 text-blue-600" />
          <span>Explore Issues</span>
        </button>

        <button
          onClick={onOpenMap}
          className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-2xl flex flex-col items-center justify-center gap-1.5 font-bold text-xs shadow-sm active:scale-95 transition-all"
        >
          <MapPin className="w-5 h-5 text-blue-600" />
          <span>View Map</span>
        </button>
      </div>

      {/* SEARCH BAR & CATEGORIES */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search issues, locations or categories..."
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 shadow-sm"
          />
        </div>

        {/* Category Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* RECENT REPORTS FEED */}
      <div className="space-y-3 pt-1">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Recent Reports</h4>
          <span className="text-xs font-semibold text-blue-600">{filteredIssues.length} active</span>
        </div>

        <div className="space-y-3">
          {filteredIssues.map(issue => (
            <div
              key={issue.id}
              onClick={() => onSelectIssue(issue)}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 shadow-sm hover:shadow-md transition-all cursor-pointer flex gap-3 items-center group"
            >
              <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 flex-shrink-0">
                <img
                  src={issue.imageUrl}
                  alt={issue.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>

              <div className="flex-1 space-y-1 overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400">#{issue.id}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    issue.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
                    issue.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                    'bg-amber-100 text-amber-700'
                  }`}>
                    {issue.status}
                  </span>
                </div>
                <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate">
                  {issue.title}
                </h4>
                <p className="text-[11px] text-slate-500 truncate">📍 {issue.address}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
