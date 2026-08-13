import React, { useState } from 'react';
import { ShieldCheck, Mail, Lock, User, Phone, Eye, EyeOff, ArrowRight, CheckCircle2 } from 'lucide-react';

const AuthScreen = ({ onLoginSuccess }) => {
  const [role, setRole] = useState('citizen'); // 'citizen' | 'authority'
  const [isSignup, setIsSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: 'Alex Rivera',
    email: 'alex.rivera@civic.gov',
    phone: '+1 (555) 019-2834',
    password: '••••••••••••'
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess(role);
    }, 600);
  };

  return (
    <div className="flex flex-col justify-between min-h-[580px] p-6 animate-fade-in bg-slate-50 dark:bg-slate-900 rounded-3xl">
      {/* Header & Segmented Persona Control */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-md">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-slate-900 dark:text-white">Community Hero</span>
          </div>
          <span className="text-[11px] font-semibold px-2.5 py-1 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full">
            {role === 'citizen' ? 'Citizen App' : 'Authority Portal'}
          </span>
        </div>

        {/* Role Switcher Pills */}
        <div className="grid grid-cols-2 p-1 bg-slate-200/80 dark:bg-slate-800/80 rounded-2xl">
          <button
            type="button"
            onClick={() => setRole('citizen')}
            className={`py-2 text-xs font-bold rounded-xl transition-all ${
              role === 'citizen'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
            }`}
          >
            👤 Citizen
          </button>
          <button
            type="button"
            onClick={() => setRole('authority')}
            className={`py-2 text-xs font-bold rounded-xl transition-all ${
              role === 'authority'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
            }`}
          >
            🏛️ Municipal Officer
          </button>
        </div>
      </div>

      {/* Main Form */}
      <div className="my-auto py-4 space-y-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            {isSignup ? 'Create your account' : 'Welcome back'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {role === 'citizen'
              ? 'Join over 12,800 active citizens improving city infrastructure.'
              : 'Authorized municipal portal for ward officers & work crews.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {isSignup && (
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Alex Rivera"
                  className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition-all shadow-sm"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
              {role === 'authority' ? 'Official Gov Email' : 'Email or Phone'}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                placeholder="alex.rivera@civic.gov"
                className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition-all shadow-sm"
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">Password</label>
              {!isSignup && (
                <button type="button" className="text-[11px] font-semibold text-blue-600 hover:underline">
                  Forgot?
                </button>
              )}
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-10 pr-10 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition-all shadow-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3.5 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Authenticating...
              </span>
            ) : (
              <>
                {isSignup ? 'Create Account' : 'Sign In'}
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Social Auth Divider */}
        {role === 'citizen' && (
          <div className="space-y-3 pt-2">
            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
              <span className="flex-shrink mx-3 text-[11px] font-medium text-slate-400 uppercase">or continue with</span>
              <div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onLoginSuccess('citizen')}
                className="py-2.5 px-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <span> Apple ID</span>
              </button>
              <button
                type="button"
                onClick={() => onLoginSuccess('citizen')}
                className="py-2.5 px-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <span>G Google</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer Toggle */}
      <div className="text-center pt-2 border-t border-slate-200/60 dark:border-slate-800">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {isSignup ? "Already have an account?" : "Don't have an account yet?"}{' '}
          <button
            type="button"
            onClick={() => setIsSignup(!isSignup)}
            className="font-bold text-blue-600 dark:text-blue-400 hover:underline"
          >
            {isSignup ? "Sign In" : "Sign Up"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthScreen;
