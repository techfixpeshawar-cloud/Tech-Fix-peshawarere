import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';
import {
  ShieldCheck,
  Lock,
  Mail,
  User,
  LogOut,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export const AdminAccount: React.FC = () => {
  const { adminUser, logoutAdmin } = useApp();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (newPassword !== confirmPassword) {
      setError('New password and confirmation do not match.');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    try {
      await api.updatePassword(currentPassword, newPassword);
      setSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setSuccess(false), 5000);
    } catch (err: any) {
      setError(err.message || 'Failed to update password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      
      {/* Header */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
          <ShieldCheck className="w-6 h-6 text-emerald-400" />
          <span>Admin Account & Credentials</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-400">
          Security settings, administrator profile, and login credentials
        </p>
      </div>

      {/* Account Info Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-blue-950 border border-blue-800 flex items-center justify-center text-blue-400 font-bold text-base">
              S
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Safiullah</h3>
              <div className="text-xs text-blue-400 font-mono">{adminUser?.email || 'techfixpeshawar@gmail.com'}</div>
            </div>
          </div>

          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Authorized Superadmin</span>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-300 pt-2">
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-slate-500 block mb-1">Access Role:</span>
            <span className="font-semibold text-white">Full Database & CMS Permissions</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-slate-500 block mb-1">Session Status:</span>
            <span className="font-semibold text-emerald-400">Active Verified Session</span>
          </div>
        </div>
      </div>

      {/* Change Password Form */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex items-center gap-2 font-bold text-white text-base border-b border-slate-800 pb-3">
          <Lock className="w-4 h-4 text-blue-400" />
          <span>Change Admin Password</span>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-600 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-3.5 rounded-xl bg-emerald-950/70 border border-emerald-600 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Password updated successfully!</span>
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-3.5 max-w-md text-xs">
          <div className="space-y-1">
            <label className="block text-slate-300 font-semibold">Current Password</label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-slate-300 font-semibold">New Password</label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-slate-300 font-semibold">Confirm New Password</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>

      {/* Logout Action */}
      <div className="p-6 rounded-3xl glass-panel border border-rose-900/30 flex items-center justify-between">
        <div>
          <h4 className="text-sm font-bold text-white">Sign Out of Admin Portal</h4>
          <p className="text-xs text-slate-400">Ends your current session and returns to public website</p>
        </div>

        <button
          onClick={logoutAdmin}
          className="px-4 py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900/80 border border-rose-800/60 text-rose-300 text-xs font-bold flex items-center gap-2 cursor-pointer transition-all"
        >
          <LogOut className="w-4 h-4" />
          <span>Log Out</span>
        </button>
      </div>

    </div>
  );
};
