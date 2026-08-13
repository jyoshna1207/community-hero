import React, { useState } from 'react';
import { Camera, Cpu, Award, ArrowRight, Check } from 'lucide-react';

const ONBOARDING_STEPS = [
  {
    icon: Camera,
    iconBg: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900",
    badge: "STEP 01 • CAMERA FIRST",
    title: "Snap & Report Civic Issues Instantly",
    desc: "Spot a pothole, broken streetlight, or garbage overflow? Capture a photo and submit in under 10 seconds."
  },
  {
    icon: Cpu,
    iconBg: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-900",
    badge: "STEP 02 • SMART AI",
    title: "AI Category & Severity Detection",
    desc: "Our neural vision engine automatically identifies issue categories, estimates severity, and tags exact GPS location."
  },
  {
    icon: Award,
    iconBg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900",
    badge: "STEP 03 • IMPACT & REWARDS",
    title: "Track Live Fixes & Earn Hero Points",
    desc: "Watch government crews resolve issues step-by-step. Earn badges, climb the community leaderboard, and upgrade your city."
  }
];

const OnboardingScreen = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  const stepData = ONBOARDING_STEPS[currentStep];
  const IconComponent = stepData.icon;

  return (
    <div className="flex flex-col items-center justify-between min-h-[580px] p-6 animate-fade-in relative bg-slate-50 dark:bg-slate-900 rounded-3xl">
      {/* Top Header Navigation */}
      <div className="w-full flex items-center justify-between pt-2">
        <span className="text-xs font-bold text-slate-400 tracking-wider">
          {currentStep + 1} OF {ONBOARDING_STEPS.length}
        </span>
        <button
          onClick={onComplete}
          className="text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white px-3 py-1.5 rounded-full hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-all"
        >
          Skip
        </button>
      </div>

      {/* Main Slide Card */}
      <div className="flex flex-col items-center text-center my-auto px-2 space-y-6">
        <div className={`w-28 h-28 rounded-3xl border-2 flex items-center justify-center shadow-lg transition-all duration-300 transform hover:scale-105 ${stepData.iconBg}`}>
          <IconComponent className="w-14 h-14 stroke-[2]" />
        </div>

        <div className="space-y-3">
          <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
            {stepData.badge}
          </span>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white leading-tight">
            {stepData.title}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-[280px] mx-auto leading-relaxed">
            {stepData.desc}
          </p>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="w-full space-y-6 pb-2">
        {/* Step Indicator Dots */}
        <div className="flex justify-center gap-2">
          {ONBOARDING_STEPS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentStep(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentStep ? 'w-8 bg-blue-600' : 'w-2 bg-slate-300 dark:bg-slate-700'
              }`}
            />
          ))}
        </div>

        {/* Action Button */}
        <button
          onClick={handleNext}
          className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base rounded-2xl shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
        >
          {currentStep === ONBOARDING_STEPS.length - 1 ? (
            <>
              Get Started Now <Check className="w-5 h-5" />
            </>
          ) : (
            <>
              Continue <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default OnboardingScreen;
