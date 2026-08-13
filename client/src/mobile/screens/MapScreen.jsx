import React, { useState } from 'react';
import { MapPin, Navigation, Filter, Layers, ChevronRight, ThumbsUp, AlertCircle, Droplets, Zap, Trash2, X } from 'lucide-react';

const CATEGORY_MAP = {
  Pothole: { color: "bg-red-500 text-white", icon: AlertCircle },
  "Water Leakage": { color: "bg-blue-500 text-white", icon: Droplets },
  Streetlight: { color: "bg-amber-500 text-white", icon: Zap },
  "Garbage Overflow": { color: "bg-emerald-500 text-white", icon: Trash2 }
};

const MapScreen = ({ issues, onSelectIssue }) => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedIssue, setSelectedIssue] = useState(issues[0]);

  const filteredIssues = issues.filter(issue => {
    if (selectedCategory === "All") return true;
    return issue.category === selectedCategory;
  });

  return (
    <div className="flex flex-col min-h-[580px] h-full relative animate-fade-in bg-slate-900 rounded-3xl overflow-hidden pb-16">
      {/* Top Filter Floating Bar */}
      <div className="absolute top-4 left-4 right-4 z-20 space-y-2">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {["All", "Pothole", "Water Leakage", "Streetlight", "Garbage Overflow"].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-extrabold whitespace-nowrap shadow-md backdrop-blur-md transition-all ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white border border-blue-400'
                  : 'bg-slate-900/80 text-slate-300 border border-slate-700 hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Uber-Style SVG Map Canvas */}
      <div className="relative flex-1 w-full min-h-[420px] bg-[#0d1527] overflow-hidden">
        {/* SVG Grid Vector Background */}
        <svg className="absolute inset-0 w-full h-full opacity-40" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="mapGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#mapGrid)" />
          {/* Simulated Roads */}
          <path d="M -50 150 Q 200 120 450 180" stroke="#334155" strokeWidth="18" fill="none" />
          <path d="M 120 -50 Q 140 250 160 550" stroke="#334155" strokeWidth="14" fill="none" />
          <path d="M 300 -50 Q 280 200 320 550" stroke="#334155" strokeWidth="12" fill="none" />
          <path d="M -50 340 L 450 320" stroke="#334155" strokeWidth="16" fill="none" />
        </svg>

        {/* GPS User Current Location Marker */}
        <div className="absolute top-[48%] left-[50%] -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center">
          <div className="w-5 h-5 bg-blue-500 rounded-full border-2 border-white shadow-lg shadow-blue-500/50 animate-ping absolute" />
          <div className="w-5 h-5 bg-blue-500 rounded-full border-2 border-white shadow-lg relative flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full" />
          </div>
          <span className="mt-1 px-2 py-0.5 bg-slate-900/90 text-white text-[9px] font-bold rounded-full border border-slate-700 shadow">
            You are here
          </span>
        </div>

        {/* Issue Pins on Map */}
        {filteredIssues.map((issue) => {
          const catInfo = CATEGORY_MAP[issue.category] || { color: "bg-blue-500 text-white", icon: MapPin };
          const IconComp = catInfo.icon;
          const isSelected = selectedIssue?.id === issue.id;

          return (
            <div
              key={issue.id}
              onClick={() => setSelectedIssue(issue)}
              style={{ left: `${issue.coords.x}%`, top: `${issue.coords.y}%` }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10 transition-transform duration-300 ${
                isSelected ? 'scale-125 z-30' : 'hover:scale-110'
              }`}
            >
              <div className={`p-2 rounded-2xl shadow-xl flex items-center gap-1 border-2 ${
                isSelected ? 'border-white ring-4 ring-blue-500/40' : 'border-slate-800'
              } ${catInfo.color}`}>
                <IconComp className="w-4 h-4" />
                {isSelected && (
                  <span className="text-[10px] font-extrabold pr-1 whitespace-nowrap">
                    #{issue.id}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Sheet Drawer for Selected Issue */}
      {selectedIssue && (
        <div className="absolute bottom-16 left-4 right-4 bg-slate-900 border border-slate-800 rounded-3xl p-4 text-white shadow-2xl z-30 animate-fade-in space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                selectedIssue.severity === 'Critical' ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'
              }`}>
                {selectedIssue.severity}
              </span>
              <span className="text-xs font-bold text-slate-400">#{selectedIssue.id}</span>
            </div>
            <button
              onClick={() => setSelectedIssue(null)}
              className="p-1 rounded-full text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex gap-3">
            <img
              src={selectedIssue.imageUrl}
              alt=""
              className="w-16 h-16 rounded-2xl object-cover border border-slate-700 flex-shrink-0"
            />
            <div className="space-y-1 overflow-hidden">
              <h4 className="font-bold text-sm text-white truncate">{selectedIssue.title}</h4>
              <p className="text-xs text-slate-400 truncate">{selectedIssue.address}</p>
              <p className="text-[11px] font-semibold text-blue-400 flex items-center gap-1">
                <Navigation className="w-3 h-3" /> {selectedIssue.distance} • Status: {selectedIssue.status}
              </p>
            </div>
          </div>

          <button
            onClick={() => onSelectIssue(selectedIssue)}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-2xl flex items-center justify-center gap-1 shadow-md"
          >
            View Full Issue Details <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default MapScreen;
