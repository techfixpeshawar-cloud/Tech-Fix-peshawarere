import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Lock,
  Mail,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  AlertCircle,
  Eye,
  EyeOff,
  Home,
} from 'lucide-react';

export const AdminLogin: React.FC = () => {
  const { loginAdmin, setIsAdminRoute } = useApp();
  const [email, setEmail] = useState('techfixpeshawar@gmail.com');
  const [password, setPassword] = useState('Safiullah@12');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await loginAdmin(email, password);
    } catch (err: any) {
      setError(err.message || 'Login failed. Please verify email and password.');
    } finally {
      setLoading(false);
    }
  };

  const handleOneClickLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      await loginAdmin('techfixpeshawar@gmail.com', 'Safiullah@12');
    } catch (err: any) {
      setError(err.message || 'One-click login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070b12] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-md w-full glass-panel-glow rounded-3xl p-8 sm:p-10 border border-slate-800 shadow-2xl relative z-10 space-y-6">
        
        {/* Brand and Shield Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-blue-950/80 border border-blue-500/50 flex items-center justify-center text-blue-400 mx-auto shadow-lg shadow-blue-500/20">
            <Lock className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Admin Panel Login
          </h1>
          <p className="text-xs text-slate-400">
            Peshawar Tech Support Business Management Portal
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-600 text-rose-300 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Quick One-Click Sign In Banner for hassle-free access */}
        <div className="p-4 rounded-2xl bg-blue-950/40 border border-blue-800/60 text-left space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-blue-300">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span>Authorized Admin Access</span>
            </span>
            <span className="font-mono text-[10px] text-slate-400">Safiullah</span>
          </div>
          <p className="text-[11px] text-slate-300">
            Click below for instant one-click login with pre-authorized administrator credentials:
          </p>
          <button
            type="button"
            onClick={handleOneClickLogin}
            disabled={loading}
            className="w-full py-2 px-3 rounded-xl font-bold text-xs text-white bg-blue-600 hover:bg-blue-500 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
          >
            <ShieldCheck className="w-4 h-4 text-blue-200" />
            <span>One-Click Sign In (Safiullah@12)</span>
          </button>
        </div>

        {/* Or form login */}
        <form onSubmit={handleLogin} className="space-y-4 text-left">
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-300">
              Admin Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="techfixpeshawar@gmail.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-300">
              Admin Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500 font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-500 hover:text-slate-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl font-bold text-xs text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Sign In To Admin Portal</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Back to public site */}
        <div className="pt-2 text-center">
          <button
            onClick={() => {
              setIsAdminRoute(false);
              window.location.hash = '#';
            }}
            className="text-xs text-slate-400 hover:text-white flex items-center justify-center gap-1.5 mx-auto transition-colors cursor-pointer"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Return to Public Website</span>
          </button>
        </div>

      </div>
    </div>
  );
};
