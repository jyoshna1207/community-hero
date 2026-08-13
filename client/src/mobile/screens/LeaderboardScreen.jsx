import React, { useState } from 'react';
import { Trophy, Award, Crown, Sparkles, ChevronRight, Zap, CheckCircle2 } from 'lucide-react';
import { LEADERBOARD_USERS } from '../mockData';

const LeaderboardScreen = () => {
  const [timeframe, setTimeframe] = useState("This Month");
  const topThree = LEADERBOARD_USERS.slice(0, 3);
  const restUsers = LEADERBOARD_USERS.slice(3);

  return (
    <div className="flex flex-col min-h-[580px] p-4 space-y-4 animate-fade-in bg-slate-50 dark:bg-slate-950 pb-20 rounded-3xl">
      {/* Header */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h2 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-1.5">
            <Trophy className="w-5 h-5 text-amber-500" /> Community Champions
          </h2>
          <p className="text-xs text-slate-500">Ward #14 Hero Rankings</p>
        </div>

        {/* Timeframe Filter Pills */}
        <div className="flex p-0.5 bg-slate-200 dark:bg-slate-800 rounded-xl text-[10px] font-extrabold">
          {["This Week", "This Month", "All Time"].map(tf => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                timeframe === tf
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {tf.split(" ")[1] || tf}
            </button>
          ))}
        </div>
      </div>

      {/* Top 3 Podium Showcase */}
      <div className="bg-gradient-to-br from-blue-900 via-indigo-950 to-slate-950 rounded-3xl p-4 text-white shadow-xl space-y-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="text-center space-y-1">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-300 bg-amber-500/20 px-3 py-0.5 rounded-full border border-amber-400/30">
            Top Community Contributors
          </span>
        </div>

        <div className="flex items-end justify-center gap-4 pt-2">
          {/* 2nd Place */}
          <div className="flex flex-col items-center space-y-1.5">
            <div className="relative">
              <img
                src={topThree[1].avatar}
                alt=""
                className="w-14 h-14 rounded-2xl object-cover border-2 border-slate-300 shadow-md"
              />
              <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-sm">🥈</span>
            </div>
            <span className="font-extrabold text-xs text-slate-200 truncate max-w-[70px] text-center">
              {topThree[1].name.split(" ")[0]}
            </span>
            <span className="bg-slate-800 text-slate-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-slate-700">
              {topThree[1].points} pts
            </span>
          </div>

          {/* 1st Place (Center Crown) */}
          <div className="flex flex-col items-center space-y-1.5 -translate-y-2">
            <div className="relative">
              <img
                src={topThree[0].avatar}
                alt=""
                className="w-18 h-18 rounded-3xl object-cover border-4 border-amber-400 shadow-xl ring-4 ring-amber-400/30"
              />
              <Crown className="w-6 h-6 text-amber-400 absolute -top-4 left-1/2 -translate-x-1/2 fill-amber-400 animate-bounce" />
            </div>
            <span className="font-extrabold text-sm text-amber-300 truncate max-w-[90px] text-center">
              {topThree[0].name.split(" ")[0]}
            </span>
            <span className="bg-amber-500/30 text-amber-200 text-xs font-extrabold px-3 py-0.5 rounded-full border border-amber-400/40">
              {topThree[0].points} pts
            </span>
          </div>

          {/* 3rd Place */}
          <div className="flex flex-col items-center space-y-1.5">
            <div className="relative">
              <img
                src={topThree[2].avatar}
                alt=""
                className="w-14 h-14 rounded-2xl object-cover border-2 border-amber-700 shadow-md"
              />
              <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-sm">🥉</span>
            </div>
            <span className="font-extrabold text-xs text-slate-200 truncate max-w-[70px] text-center">
              {topThree[2].name.split(" ")[0]}
            </span>
            <span className="bg-slate-800 text-slate-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-slate-700">
              {topThree[2].points} pts
            </span>
          </div>
        </div>
      </div>

      {/* Ranked List */}
      <div className="space-y-2.5 pt-1">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Ward Leaderboard Rankings</h4>
        <div className="space-y-2">
          {LEADERBOARD_USERS.map(user => (
            <div
              key={user.rank}
              className={`p-3 rounded-2xl border flex items-center justify-between transition-all ${
                user.name === 'Alex Rivera'
                  ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-300 dark:border-blue-800 shadow-md ring-1 ring-blue-500/30'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`w-6 text-center font-extrabold text-xs ${
                  user.rank === 1 ? 'text-amber-500 text-sm' :
                  user.rank === 2 ? 'text-slate-400' :
                  user.rank === 3 ? 'text-amber-700' : 'text-slate-500'
                }`}>
                  #{user.rank}
                </span>

                <img src={user.avatar} className="w-10 h-10 rounded-xl object-cover" alt="" />

                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white">{user.name}</h4>
                    {user.name === 'Alex Rivera' && (
                      <span className="text-[9px] font-extrabold bg-blue-600 text-white px-1.5 py-0.2 rounded">YOU</span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-500 font-medium">{user.badge} • {user.solvedCount} Solved</p>
                </div>
              </div>

              <div className="text-right">
                <span className="font-extrabold text-xs text-blue-600 dark:text-blue-400">{user.points} pts</span>
                <p className="text-[10px] text-slate-400">{user.level}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LeaderboardScreen;
