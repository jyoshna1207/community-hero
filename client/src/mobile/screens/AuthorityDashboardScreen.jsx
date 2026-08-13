import React, { useState } from 'react';
import { Building2, CheckCircle2, Clock, Wrench, ShieldAlert, Upload, Sparkles, AlertCircle, ArrowUpRight, Camera, X } from 'lucide-react';

const AuthorityDashboardScreen = ({ issues, onUpdateStatus }) => {
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [proofImage, setProofImage] = useState("https://images.unsplash.com/photo-1584463688353-27c1966559c0?auto=format&fit=crop&w=800&q=80");
  const [updateText, setUpdateText] = useState("Repair crew completed asphalt patching and compaction. Verified zero safety hazard.");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenResolveModal = (issue) => {
    setSelectedIssue(issue);
  };

  const handleConfirmResolve = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onUpdateStatus(selectedIssue.id, 'Completed', updateText, proofImage);
      setSelectedIssue(null);
    }, 600);
  };

  return (
    <div className="flex flex-col min-h-[580px] p-4 space-y-4 animate-fade-in bg-slate-50 dark:bg-slate-950 pb-20 rounded-3xl relative">
      {/* Officer Header */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-extrabold text-base text-slate-900 dark:text-white">Officer Portal</h2>
            <span className="px-2 py-0.5 bg-blue-600 text-white text-[10px] font-extrabold rounded-full">
              Ward #14 PWD
            </span>
          </div>
          <p className="text-xs text-slate-500">Public Works & Infrastructure Dept</p>
        </div>

        <div className="w-10 h-10 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-bold text-xs shadow-sm">
          PWD
        </div>
      </div>

      {/* SLA Metrics Overview Grid */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-2xl space-y-1 shadow-sm">
          <div className="flex justify-between items-center text-blue-600">
            <Wrench className="w-4 h-4" />
            <span className="text-[10px] font-bold bg-blue-100 dark:bg-blue-950 px-2 py-0.5 rounded-full">Zone 4</span>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white">14</p>
          <p className="text-[11px] text-slate-500 font-medium">Assigned Issues</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-2xl space-y-1 shadow-sm">
          <div className="flex justify-between items-center text-emerald-600">
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-full">98% SLA</span>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white">9 Today</p>
          <p className="text-[11px] text-slate-500 font-medium">Resolved & Closed</p>
        </div>
      </div>

      {/* Work Queue */}
      <div className="space-y-3 pt-1">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Assigned Action Queue</h4>
          <span className="text-xs font-bold text-blue-600">{issues.length} Pending Actions</span>
        </div>

        <div className="space-y-3">
          {issues.map(issue => (
            <div
              key={issue.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3.5 rounded-3xl shadow-sm space-y-3"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-bold text-slate-400">#{issue.id}</span>
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                      issue.severity === 'Critical' ? 'bg-red-500 text-white' : 'bg-amber-500 text-white'
                    }`}>
                      {issue.severity}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">{issue.title}</h4>
                  <p className="text-xs text-slate-500">{issue.address}</p>
                </div>

                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                  issue.status === 'Completed' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' :
                  issue.status === 'In Progress' ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300' :
                  'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                }`}>
                  {issue.status}
                </span>
              </div>

              <div className="flex gap-2">
                <img src={issue.imageUrl} className="w-16 h-16 rounded-2xl object-cover" alt="" />
                <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                  <p className="line-clamp-2">{issue.description}</p>
                  <p className="text-[10px] text-slate-400">Reported by {issue.reporter.name} • {issue.reportedAt}</p>
                </div>
              </div>

              {/* Action Buttons for Authority */}
              <div className="flex gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                {issue.status !== 'In Progress' && issue.status !== 'Completed' && (
                  <button
                    onClick={() => onUpdateStatus(issue.id, 'In Progress', 'Work crew dispatched to site.')}
                    className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-all shadow-sm"
                  >
                    Start Fix (In Progress)
                  </button>
                )}

                {issue.status !== 'Completed' && (
                  <button
                    onClick={() => handleOpenResolveModal(issue)}
                    className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all shadow-sm flex items-center justify-center gap-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Close Issue & Upload Proof
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Completion Modal */}
      {selectedIssue && (
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in rounded-3xl">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 w-full max-w-[320px] space-y-4 shadow-2xl">
            <div className="flex justify-between items-center">
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Upload Fix Proof Photo</h3>
              <button onClick={() => setSelectedIssue(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="relative rounded-2xl overflow-hidden h-36 bg-slate-800">
              <img src={proofImage} className="w-full h-full object-cover" alt="Proof" />
              <div className="absolute bottom-2 right-2 px-2.5 py-1 bg-slate-900/80 text-white text-[10px] font-bold rounded-lg backdrop-blur-md">
                Verified Site Photo
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase">Officer Notes</label>
              <textarea
                rows={2}
                value={updateText}
                onChange={e => setUpdateText(e.target.value)}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white"
              />
            </div>

            <button
              onClick={handleConfirmResolve}
              disabled={isSubmitting}
              className="w-full py-3 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-1"
            >
              {isSubmitting ? 'Finalizing Signoff...' : 'Mark Closed & Complete Ticket'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthorityDashboardScreen;
