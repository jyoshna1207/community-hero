import React, { useState, useEffect } from 'react';
import { INITIAL_ISSUES } from './mockData';
import SplashScreen from './screens/SplashScreen';
import OnboardingScreen from './screens/OnboardingScreen';
import AuthScreen from './screens/AuthScreen';
import HomeScreen from './screens/HomeScreen';
import ReportIssueScreen from './screens/ReportIssueScreen';
import MapScreen from './screens/MapScreen';
import IssueDetailsScreen from './screens/IssueDetailsScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import LeaderboardScreen from './screens/LeaderboardScreen';
import ProfileScreen from './screens/ProfileScreen';
import AuthorityDashboardScreen from './screens/AuthorityDashboardScreen';
import SettingsScreen from './screens/SettingsScreen';

import {
  Home,
  Map,
  PlusCircle,
  Trophy,
  User,
  Bell,
  Sun,
  Moon,
  Smartphone,
  Maximize2,
  Minimize2,
  Sparkles,
  ShieldCheck,
  Building2,
  Wifi,
  Battery,
  Layers
} from 'lucide-react';

const SCREENS = [
  { id: 'splash', name: '1. Splash Branding' },
  { id: 'onboarding', name: '2. Onboarding Flow' },
  { id: 'auth', name: '3. Auth Login & Signup' },
  { id: 'home', name: '4. Home Dashboard' },
  { id: 'report', name: '5. Report Issue (AI)' },
  { id: 'map', name: '6. Interactive Map' },
  { id: 'details', name: '7. Issue Details & Timeline' },
  { id: 'notifications', name: '8. Real-time Notifications' },
  { id: 'leaderboard', name: '9. Leaderboard & Ranks' },
  { id: 'profile', name: '10. User Profile & Badges' },
  { id: 'authority', name: '11. Authority Portal' },
  { id: 'settings', name: '12. App Settings' }
];

const MobileAppContainer = () => {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [userRole, setUserRole] = useState('citizen'); // 'citizen' | 'authority'
  const [issues, setIssues] = useState(INITIAL_ISSUES);
  const [selectedIssue, setSelectedIssue] = useState(INITIAL_ISSUES[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [isMobileFrameMode, setIsMobileFrameMode] = useState(true);

  // Time state for status bar
  const [currentTime, setCurrentTime] = useState("9:41");

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const handleSelectIssue = (issue) => {
    setSelectedIssue(issue);
    setCurrentScreen('details');
  };

  const handleUpdateStatus = (issueId, newStatus, text, proofPhoto) => {
    setIssues(prev => prev.map(iss => {
      if (iss.id === issueId) {
        const updatedTimeline = iss.timeline.map(t => {
          if (t.step.toLowerCase() === newStatus.toLowerCase()) {
            return { ...t, completed: true, current: true, date: "Just now" };
          }
          return { ...t, current: false };
        });
        const updatedUpdates = text ? [
          ...(iss.updates || []),
          {
            id: Date.now().toString(),
            author: "Public Works Dept",
            role: "Official Authority",
            text,
            timestamp: "Just now",
            isOfficial: true
          }
        ] : iss.updates;

        return {
          ...iss,
          status: newStatus,
          timeline: updatedTimeline,
          updates: updatedUpdates,
          completedImageUrl: proofPhoto || iss.completedImageUrl
        };
      }
      return iss;
    }));
  };

  const handleAddNewReport = () => {
    const newIssueObj = {
      id: `CH-${Math.floor(8922 + Math.random() * 100)}`,
      title: "Severe Pothole on 5th Ave",
      category: "Pothole",
      severity: "Critical",
      status: "Reported",
      address: "5th Ave & 42nd St, Ward 14",
      distance: "0.1 km away",
      reportedAt: "Just now",
      upvotes: 1,
      hasUpvoted: true,
      description: "Deep pothole causing vehicle tire damage and severe traffic slowdown.",
      imageUrl: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80",
      assignedDepartment: "Public Works & Road Maintenance",
      reporter: {
        name: "Alex Rivera",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
      },
      timeline: [
        { step: "Reported", label: "Report Submitted", date: "Just now", completed: true, current: true },
        { step: "Verified", label: "Pending Officer Check", date: "Pending", completed: false },
        { step: "Assigned", label: "Pending PWD Crew", date: "Pending", completed: false },
        { step: "In Progress", label: "Repair Work", date: "Pending", completed: false },
        { step: "Completed", label: "Inspection Signoff", date: "Pending", completed: false }
      ],
      coords: { x: 40, y: 40 }
    };

    setIssues([newIssueObj, ...issues]);
    setSelectedIssue(newIssueObj);
    setCurrentScreen('home');
  };

  const renderScreenBody = () => {
    switch (currentScreen) {
      case 'splash':
        return <SplashScreen onProceed={() => setCurrentScreen('onboarding')} />;
      case 'onboarding':
        return <OnboardingScreen onComplete={() => setCurrentScreen('auth')} />;
      case 'auth':
        return (
          <AuthScreen
            onLoginSuccess={(role) => {
              setUserRole(role);
              setCurrentScreen(role === 'authority' ? 'authority' : 'home');
            }}
          />
        );
      case 'home':
        return (
          <HomeScreen
            issues={issues}
            onSelectIssue={handleSelectIssue}
            onOpenReport={() => setCurrentScreen('report')}
            onOpenMap={() => setCurrentScreen('map')}
            onOpenNotifications={() => setCurrentScreen('notifications')}
            isLoading={isLoading}
          />
        );
      case 'report':
        return (
          <ReportIssueScreen
            onSubmitSuccess={handleAddNewReport}
            onBack={() => setCurrentScreen('home')}
          />
        );
      case 'map':
        return <MapScreen issues={issues} onSelectIssue={handleSelectIssue} />;
      case 'details':
        return <IssueDetailsScreen issue={selectedIssue} onBack={() => setCurrentScreen('home')} />;
      case 'notifications':
        return <NotificationsScreen onSelectIssue={handleSelectIssue} />;
      case 'leaderboard':
        return <LeaderboardScreen />;
      case 'profile':
        return (
          <ProfileScreen
            onOpenSettings={() => setCurrentScreen('settings')}
            onSelectIssue={handleSelectIssue}
            userIssues={issues}
          />
        );
      case 'authority':
        return <AuthorityDashboardScreen issues={issues} onUpdateStatus={handleUpdateStatus} />;
      case 'settings':
        return (
          <SettingsScreen
            isDarkMode={isDarkMode}
            onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
            onSignOut={() => setCurrentScreen('auth')}
          />
        );
      default:
        return (
          <HomeScreen
            issues={issues}
            onSelectIssue={handleSelectIssue}
            onOpenReport={() => setCurrentScreen('report')}
            onOpenMap={() => setCurrentScreen('map')}
            onOpenNotifications={() => setCurrentScreen('notifications')}
            isLoading={isLoading}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center py-6 px-3 font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Demo Control Toolbar */}
      <div className="w-full max-w-4xl bg-slate-900/90 border border-slate-800 rounded-3xl p-3.5 mb-6 backdrop-blur-xl shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Branding & Status */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-extrabold text-white text-base">Community Hero</h2>
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                PROTOTYPE LIVE
              </span>
            </div>
            <p className="text-xs text-slate-400">Apple • Linear • Uber • Notion Inspired</p>
          </div>
        </div>

        {/* Screen Showcase Selector */}
        <div className="flex items-center gap-2 overflow-x-auto max-w-full no-scrollbar">
          <select
            value={currentScreen}
            onChange={(e) => setCurrentScreen(e.target.value)}
            className="bg-slate-800 text-white text-xs font-bold py-2 px-3 rounded-2xl border border-slate-700 focus:outline-none focus:border-blue-500"
          >
            {SCREENS.map(s => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>

          {/* Persona Switcher Toggle */}
          <button
            onClick={() => {
              const nextRole = userRole === 'citizen' ? 'authority' : 'citizen';
              setUserRole(nextRole);
              setCurrentScreen(nextRole === 'authority' ? 'authority' : 'home');
            }}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold rounded-2xl flex items-center gap-1.5 transition-all text-slate-200"
          >
            {userRole === 'citizen' ? (
              <>👤 Citizen Persona</>
            ) : (
              <><Building2 className="w-3.5 h-3.5 text-blue-400" /> Authority Portal</>
            )}
          </button>

          {/* Skeleton Loader Toggle */}
          <button
            onClick={() => {
              setIsLoading(true);
              setTimeout(() => setIsLoading(false), 1200);
            }}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold rounded-2xl transition-all text-slate-300"
          >
            ⚡ Test Skeleton
          </button>

          {/* Theme Toggle */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-2xl transition-all"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-blue-400" />}
          </button>

          {/* Device Frame View Switcher */}
          <button
            onClick={() => setIsMobileFrameMode(!isMobileFrameMode)}
            className="p-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-2xl transition-all"
          >
            {isMobileFrameMode ? <Maximize2 className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Device Shell Container */}
      <div className={`transition-all duration-300 ${
        isMobileFrameMode
          ? 'w-full max-w-[390px] min-h-[780px] bg-slate-900 rounded-[50px] border-[10px] border-slate-800 shadow-[0_25px_70px_rgba(0,0,0,0.8)] relative p-3 overflow-hidden ring-1 ring-slate-700'
          : 'w-full max-w-xl bg-slate-900 rounded-3xl border border-slate-800 p-4 shadow-2xl relative'
      }`}>
        {/* iOS Dynamic Island & Status Bar Header (Only visible in frame mode) */}
        {isMobileFrameMode && (
          <div className="w-full flex items-center justify-between px-6 pt-2 pb-3 text-white text-xs font-semibold select-none z-40 relative">
            <span>{currentTime}</span>

            {/* Apple Dynamic Island Notch */}
            <div className="w-24 h-5 bg-black rounded-full flex items-center justify-between px-2.5 shadow-md">
              <div className="w-2.5 h-2.5 bg-slate-800 rounded-full border border-slate-700" />
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            </div>

            <div className="flex items-center gap-1.5 text-slate-300">
              <Wifi className="w-3.5 h-3.5" />
              <Battery className="w-4 h-4 fill-white text-white" />
            </div>
          </div>
        )}

        {/* Screen View Container */}
        <div className="w-full h-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white rounded-[36px] overflow-y-auto no-scrollbar relative">
          {renderScreenBody()}
        </div>

        {/* Bottom Mobile Navigation Bar (Shown on core citizen/authority tabs) */}
        {['home', 'map', 'leaderboard', 'profile', 'authority'].includes(currentScreen) && (
          <div className="absolute bottom-6 left-6 right-6 z-40">
            <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-800 text-white rounded-3xl py-2 px-4 shadow-2xl flex items-center justify-around">
              <button
                onClick={() => setCurrentScreen(userRole === 'authority' ? 'authority' : 'home')}
                className={`flex flex-col items-center gap-1 py-1 transition-all ${
                  ['home', 'authority'].includes(currentScreen) ? 'text-blue-500 scale-110' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Home className="w-5 h-5" />
                <span className="text-[9px] font-bold">Home</span>
              </button>

              <button
                onClick={() => setCurrentScreen('map')}
                className={`flex flex-col items-center gap-1 py-1 transition-all ${
                  currentScreen === 'map' ? 'text-blue-500 scale-110' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Map className="w-5 h-5" />
                <span className="text-[9px] font-bold">Map</span>
              </button>

              {/* Floating Center Report Button */}
              <button
                onClick={() => setCurrentScreen('report')}
                className="w-12 h-12 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/40 -translate-y-4 border-4 border-slate-900 active:scale-90 transition-transform"
              >
                <PlusCircle className="w-6 h-6" />
              </button>

              <button
                onClick={() => setCurrentScreen('leaderboard')}
                className={`flex flex-col items-center gap-1 py-1 transition-all ${
                  currentScreen === 'leaderboard' ? 'text-blue-500 scale-110' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Trophy className="w-5 h-5" />
                <span className="text-[9px] font-bold">Ranks</span>
              </button>

              <button
                onClick={() => setCurrentScreen('profile')}
                className={`flex flex-col items-center gap-1 py-1 transition-all ${
                  currentScreen === 'profile' ? 'text-blue-500 scale-110' : 'text-slate-400 hover:text-white'
                }`}
              >
                <User className="w-5 h-5" />
                <span className="text-[9px] font-bold">Profile</span>
              </button>
            </div>
          </div>
        )}

        {/* Bottom iOS Home Bar Indicator */}
        {isMobileFrameMode && (
          <div className="w-32 h-1 bg-slate-400/60 rounded-full mx-auto my-1 pointer-events-none" />
        )}
      </div>
    </div>
  );
};

export default MobileAppContainer;
