import React, { useState } from 'react';
import { Bell, CheckCircle2, Wrench, Award, Trophy, ChevronRight, Check } from 'lucide-react';
import { MOCK_NOTIFICATIONS } from '../mockData';

const NotificationsScreen = ({ onSelectIssue }) => {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [filter, setFilter] = useState("all");

  const handleMarkAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  const filtered = notifications.filter(n => {
    if (filter === "all") return true;
    return n.type === filter;
  });

  return (
    <div className="flex flex-col min-h-[580px] p-4 space-y-4 animate-fade-in bg-slate-50 dark:bg-slate-950 pb-20 rounded-3xl">
      {/* Header */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2">
          <h2 className="font-extrabold text-base text-slate-900 dark:text-white">Notifications</h2>
          <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-[10px] font-bold rounded-full">
            {notifications.filter(n => n.unread).length} New
          </span>
        </div>
        <button
          onClick={handleMarkAllRead}
          className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
        >
          <Check className="w-3.5 h-3.5" /> Mark all read
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {[
          { id: "all", label: "All Updates" },
          { id: "status", label: "🛠️ Status" },
          { id: "points", label: "🌟 Points" },
          { id: "achievement", label: "🏆 Badges" }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setFilter(t.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              filter === t.id
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filtered.map(item => (
          <div
            key={item.id}
            onClick={() => {
              setNotifications(notifications.map(n => n.id === item.id ? { ...n, unread: false } : n));
            }}
            className={`p-3.5 rounded-3xl border transition-all cursor-pointer space-y-2 relative ${
              item.unread
                ? 'bg-white dark:bg-slate-900 border-blue-200 dark:border-blue-900/60 shadow-md ring-1 ring-blue-500/20'
                : 'bg-white/60 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                  item.type === 'status' ? 'bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400' :
                  item.type === 'points' ? 'bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400' :
                  item.type === 'completed' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400' :
                  'bg-purple-100 text-purple-600 dark:bg-purple-950 dark:text-purple-400'
                }`}>
                  {item.type === 'status' ? <Wrench className="w-5 h-5" /> :
                   item.type === 'points' ? <Award className="w-5 h-5" /> :
                   item.type === 'completed' ? <CheckCircle2 className="w-5 h-5" /> :
                   <Trophy className="w-5 h-5" />}
                </div>

                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white">{item.title}</h4>
                    {item.unread && (
                      <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
                    )}
                  </div>
                  <p className="text-xs text-slate-500 leading-snug">{item.message}</p>
                </div>
              </div>

              <span className="text-[10px] font-semibold text-slate-400 whitespace-nowrap">{item.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationsScreen;
