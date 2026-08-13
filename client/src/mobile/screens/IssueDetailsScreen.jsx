import React, { useState } from 'react';
import { ArrowLeft, MapPin, Clock, ThumbsUp, Share2, CheckCircle2, ShieldAlert, User, Send, Building2, AlertTriangle, Sparkles, MessageSquare } from 'lucide-react';

const IssueDetailsScreen = ({ issue, onBack }) => {
  const [upvotes, setUpvotes] = useState(issue?.upvotes || 42);
  const [hasUpvoted, setHasUpvoted] = useState(issue?.hasUpvoted || false);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState(issue?.comments || []);

  if (!issue) return null;

  const handleUpvote = () => {
    if (hasUpvoted) {
      setUpvotes(prev => prev - 1);
      setHasUpvoted(false);
    } else {
      setUpvotes(prev => prev + 1);
      setHasUpvoted(true);
    }
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    const added = {
      id: Date.now().toString(),
      user: "Alex Rivera (You)",
      text: newComment,
      timestamp: "Just now"
    };
    setComments([...comments, added]);
    setNewComment("");
  };

  return (
    <div className="flex flex-col min-h-[580px] p-4 space-y-4 animate-fade-in bg-slate-50 dark:bg-slate-950 pb-20 rounded-3xl">
      {/* Top Header */}
      <div className="flex items-center justify-between pt-1">
        <button
          onClick={onBack}
          className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <span className="font-bold text-xs text-slate-400">Issue #{issue.id}</span>
        <button className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
          <Share2 className="w-4 h-4" />
        </button>
      </div>

      {/* Large Banner Image */}
      <div className="relative rounded-3xl overflow-hidden shadow-md bg-slate-900 h-48">
        <img
          src={issue.imageUrl}
          alt={issue.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20 p-3.5 flex flex-col justify-between">
          <div className="flex justify-between items-center">
            <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
              issue.severity === 'Critical' ? 'bg-red-600 text-white' : 'bg-blue-600 text-white'
            }`}>
              {issue.severity} Priority
            </span>
            <span className="bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
              {issue.category}
            </span>
          </div>

          <div className="text-white space-y-0.5">
            <h2 className="text-lg font-bold line-clamp-1">{issue.title}</h2>
            <p className="text-xs text-slate-300 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-blue-400" /> {issue.address}
            </p>
          </div>
        </div>
      </div>

      {/* Upvote & Action Bar */}
      <div className="flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-2xl shadow-sm">
        <button
          onClick={handleUpvote}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            hasUpvoted
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
          }`}
        >
          <ThumbsUp className={`w-4 h-4 ${hasUpvoted ? 'fill-white' : ''}`} />
          <span>{upvotes} Upvotes</span>
        </button>

        <div className="text-xs font-semibold text-slate-500 flex items-center gap-1">
          <Clock className="w-3.5 h-3.5 text-blue-600" /> Reported {issue.reportedAt}
        </div>
      </div>

      {/* Linear-Inspired Status Timeline */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-3xl shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Resolution Progress Timeline</h4>
          <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
            {issue.status}
          </span>
        </div>

        <div className="space-y-4 pt-1 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
          {issue.timeline.map((item, idx) => (
            <div key={idx} className="relative pl-8 flex items-start justify-between group">
              {/* Dot Icon Indicator */}
              <div className={`absolute left-0 top-0.5 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border-2 transition-all ${
                item.completed
                  ? item.current
                    ? 'bg-blue-600 text-white border-blue-400 ring-4 ring-blue-500/20'
                    : 'bg-emerald-500 text-white border-emerald-400'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-300 dark:border-slate-700'
              }`}>
                {item.completed ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
              </div>

              <div className="space-y-0.5">
                <p className={`text-xs font-bold ${item.completed ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>
                  {item.label}
                </p>
                {item.by && <p className="text-[10px] text-slate-500">By {item.by}</p>}
              </div>

              <span className="text-[10px] font-medium text-slate-400 whitespace-nowrap">{item.date}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Official Authority Updates & Proof Photo (if present) */}
      {issue.updates && issue.updates.length > 0 && (
        <div className="bg-blue-50/60 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 p-4 rounded-3xl space-y-2">
          <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300 font-extrabold text-xs">
            <Building2 className="w-4 h-4" /> Official Municipal Update
          </div>
          {issue.updates.map(up => (
            <div key={up.id} className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
              <p className="font-medium">{up.text}</p>
              <div className="flex justify-between items-center text-[10px] text-slate-500">
                <span className="font-bold">{up.author}</span>
                <span>{up.timestamp}</span>
              </div>
            </div>
          ))}
          {issue.completedImageUrl && (
            <div className="pt-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Completion Proof Photo</span>
              <img src={issue.completedImageUrl} className="w-full h-32 object-cover rounded-2xl border border-blue-300 dark:border-blue-800" alt="Completed Fix" />
            </div>
          )}
        </div>
      )}

      {/* Comments Section */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-3xl shadow-sm space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <MessageSquare className="w-3.5 h-3.5" /> Community Discussion ({comments.length})
        </h4>

        <form onSubmit={handleAddComment} className="flex gap-2">
          <input
            type="text"
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            placeholder="Add a helpful comment..."
            className="flex-1 px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            className="p-2.5 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 active:scale-95"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        <div className="space-y-2.5 pt-1">
          {comments.map(c => (
            <div key={c.id} className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1 text-xs">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-900 dark:text-white">{c.user}</span>
                <span className="text-[10px] text-slate-400">{c.timestamp}</span>
              </div>
              <p className="text-slate-600 dark:text-slate-300">{c.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IssueDetailsScreen;
