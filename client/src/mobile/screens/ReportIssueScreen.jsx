import React, { useState } from 'react';
import { Camera, Sparkles, MapPin, AlertTriangle, CheckCircle2, RefreshCw, Upload, Image as ImageIcon, X, ArrowLeft } from 'lucide-react';

const SEVERITIES = [
  { id: "Low", label: "Low", color: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border-blue-300" },
  { id: "Medium", label: "Medium", color: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border-amber-300" },
  { id: "High", label: "High", color: "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300 border-orange-300" },
  { id: "Critical", label: "Critical", color: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 border-red-300" }
];

const MOCK_PHOTOS = [
  "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=800&q=80"
];

const ReportIssueScreen = ({ onSubmitSuccess, onBack }) => {
  const [capturedPhoto, setCapturedPhoto] = useState(MOCK_PHOTOS[0]);
  const [isAiDetecting, setIsAiDetecting] = useState(false);
  const [detectedCategory, setDetectedCategory] = useState("Pothole & Road Hazard");
  const [aiConfidence, setAiConfidence] = useState(98);
  const [severity, setSeverity] = useState("Critical");
  const [title, setTitle] = useState("Severe Pothole on 5th Ave");
  const [description, setDescription] = useState("Deep crater near pedestrian crosswalk causing vehicular alignment damage and lane obstruction.");
  const [address, setAddress] = useState("5th Ave & 42nd St, Ward 14, Central Metro");
  const [isLocating, setIsLocating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleSnapPhoto = () => {
    setIsAiDetecting(true);
    const nextIdx = (MOCK_PHOTOS.indexOf(capturedPhoto) + 1) % MOCK_PHOTOS.length;
    setCapturedPhoto(MOCK_PHOTOS[nextIdx]);

    setTimeout(() => {
      setIsAiDetecting(false);
      if (nextIdx === 1) {
        setDetectedCategory("Water Pipe Burst");
        setAiConfidence(96);
        setSeverity("High");
        setTitle("Water Leakage at Oak Street");
      } else if (nextIdx === 2) {
        setDetectedCategory("Broken Streetlight");
        setAiConfidence(94);
        setSeverity("Medium");
        setTitle("Streetlight Pole Damaged");
      } else {
        setDetectedCategory("Pothole & Road Hazard");
        setAiConfidence(98);
        setSeverity("Critical");
        setTitle("Severe Pothole on 5th Ave");
      }
    }, 700);
  };

  const handleAutoGPS = () => {
    setIsLocating(true);
    setTimeout(() => {
      setIsLocating(false);
      setAddress("42nd St Cross, Ward #14 GPS: 40.7589° N, 73.9851° W");
    }, 500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccessModal(true);
    }, 800);
  };

  return (
    <div className="flex flex-col min-h-[580px] p-4 space-y-4 animate-fade-in bg-slate-50 dark:bg-slate-950 pb-20 rounded-3xl relative">
      {/* Top Header */}
      <div className="flex items-center justify-between pt-1">
        <button
          onClick={onBack}
          className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h2 className="font-extrabold text-base text-slate-900 dark:text-white">Report Civic Issue</h2>
        <span className="w-8" />
      </div>

      {/* 1. Camera-First Viewport Box */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-900 shadow-md border-2 border-blue-500/30 group">
        <img
          src={capturedPhoto}
          alt="Captured Issue"
          className="w-full h-52 object-cover"
        />

        {/* Camera HUD Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/30 p-3 flex flex-col justify-between">
          <div className="flex justify-between items-center">
            <span className="px-2.5 py-1 bg-red-600 text-white rounded-full text-[10px] font-extrabold flex items-center gap-1">
              <span className="w-2 h-2 bg-white rounded-full animate-ping" /> LIVE CAMERA HUD
            </span>
            <button
              type="button"
              onClick={handleSnapPhoto}
              className="p-2 bg-slate-900/80 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold backdrop-blur-md flex items-center gap-1"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isAiDetecting ? 'animate-spin' : ''}`} /> Retake
            </button>
          </div>

          {/* AI Category Detection Badge */}
          <div className="bg-slate-900/90 backdrop-blur-md border border-blue-500/40 rounded-2xl p-2.5 text-white space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold flex items-center gap-1.5 text-blue-400">
                <Sparkles className="w-4 h-4 text-amber-400" /> AI Detection Engine
              </span>
              <span className="text-[10px] font-semibold bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full border border-blue-400/30">
                {aiConfidence}% Confidence
              </span>
            </div>
            <p className="text-xs font-extrabold text-white">
              {isAiDetecting ? 'Analyzing image vectors...' : detectedCategory}
            </p>
          </div>
        </div>
      </div>

      {/* 2. Form Details */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Severity Selector Chips */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Severity Level
          </label>
          <div className="grid grid-cols-4 gap-2">
            {SEVERITIES.map(sev => (
              <button
                key={sev.id}
                type="button"
                onClick={() => setSeverity(sev.id)}
                className={`py-2 text-xs font-bold rounded-2xl border transition-all ${
                  severity === sev.id
                    ? `${sev.color} shadow-sm border-2`
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                {sev.label}
              </button>
            ))}
          </div>
        </div>

        {/* Title Input */}
        <div className="space-y-1">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Issue Title</label>
          <input
            type="text"
            required
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full px-3.5 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 shadow-sm"
          />
        </div>

        {/* Location Picker */}
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Location Tag</label>
            <button
              type="button"
              onClick={handleAutoGPS}
              className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1 hover:underline"
            >
              <MapPin className="w-3 h-3" /> Auto GPS Tag
            </button>
          </div>
          <div className="relative">
            <input
              type="text"
              required
              value={address}
              onChange={e => setAddress(e.target.value)}
              className="w-full pl-9 pr-3.5 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 shadow-sm"
            />
            <MapPin className="w-4 h-4 text-blue-600 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Description Input */}
        <div className="space-y-1">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Description</label>
          <textarea
            rows={3}
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Add details about the civic issue..."
            className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 shadow-sm resize-none"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold text-base rounded-2xl shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Submitting Report...
            </span>
          ) : (
            <>
              Submit Civic Report <CheckCircle2 className="w-5 h-5" />
            </>
          )}
        </button>
      </form>

      {/* Success Modal Backdrop */}
      {showSuccessModal && (
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-6 animate-fade-in rounded-3xl">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 text-center space-y-4 max-w-[300px] shadow-2xl">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-inner animate-pulse-slow">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">Report Submitted!</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Ticket <span className="font-bold text-blue-600">#CH-8922</span> generated. Ward Officer Patel will verify within 2 hours.
              </p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-950/60 p-3 rounded-2xl border border-blue-200 dark:border-blue-900 text-xs font-bold text-blue-700 dark:text-blue-300">
              🎉 +50 Hero Points Added to Profile!
            </div>
            <button
              onClick={onSubmitSuccess}
              className="w-full py-3 bg-blue-600 text-white font-bold text-sm rounded-xl shadow-md"
            >
              View in Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportIssueScreen;
