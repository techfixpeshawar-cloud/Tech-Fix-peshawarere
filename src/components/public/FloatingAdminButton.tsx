import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, Lock } from 'lucide-react';

export const FloatingAdminButton: React.FC = () => {
  const { setIsAdminRoute, isAuthenticated } = useApp();

  const handleOpenAdmin = () => {
    setIsAdminRoute(true);
    window.location.hash = '#admin';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <aside
      aria-label="Admin panel quick switch"
      className="fixed bottom-6 left-6 z-40 flex items-center"
    >
      <button
        onClick={handleOpenAdmin}
        className="group flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-slate-900/95 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 hover:border-blue-500/60 shadow-xl shadow-black/50 backdrop-blur-md transition-all duration-200 cursor-pointer active:scale-95"
        title="Open Technician Admin Panel"
      >
        <div className="w-6 h-6 rounded-lg bg-blue-950/80 border border-blue-500/40 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
          {isAuthenticated ? (
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          ) : (
            <Lock className="w-3.5 h-3.5 text-blue-400" />
          )}
        </div>
        <div className="text-left leading-none">
          <div className="text-xs font-bold text-slate-200 group-hover:text-white flex items-center gap-1.5">
            <span>Admin Panel</span>
            {isAuthenticated && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            )}
          </div>
          <div className="text-[10px] text-slate-400 font-mono mt-0.5">
            {isAuthenticated ? 'Active Session' : 'Login'}
          </div>
        </div>
      </button>
    </aside>
  );
};
