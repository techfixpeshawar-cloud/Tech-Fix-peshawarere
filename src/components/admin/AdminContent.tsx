import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Type,
  Save,
  CheckCircle2,
  Sparkles,
  Layout,
} from 'lucide-react';

export const AdminContent: React.FC = () => {
  const { settings, updateSettings } = useApp();

  const [heroHeadline, setHeroHeadline] = useState(
    settings?.heroHeadline || 'Computer Problems Solved At Your Home Or Office In Peshawar.'
  );
  const [heroSubtitle, setHeroSubtitle] = useState(
    settings?.heroSubtitle ||
      'Clean Windows 10/11 installation, genuine drivers, HDD to SSD migration, BSOD crash diagnosis, and data recovery assistance. No carrying heavy towers to repair markets — we come directly to you.'
  );
  const [heroBadge, setHeroBadge] = useState(
    settings?.heroBadge || 'ON-SITE COMPUTER & WINDOWS SUPPORT • PESHAWAR, KPK'
  );
  const [bulkTitle, setBulkTitle] = useState(
    settings?.bulkServiceTitle || 'Need Windows On 5, 10, 20 Or 50+ PCs?'
  );
  const [bulkDesc, setBulkDesc] = useState(
    settings?.bulkServiceDescription ||
      'Standardized Windows deployment, driver provisioning, SSD upgrades, and lab software setups for schools, academies, and business offices across Peshawar.'
  );
  const [footerCopyright, setFooterCopyright] = useState(
    settings?.footerCopyright || '© 2026 Peshawar Tech Support. Professional on-site computer services.'
  );

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    try {
      await updateSettings({
        heroHeadline,
        heroSubtitle,
        heroBadge,
        bulkServiceTitle: bulkTitle,
        bulkServiceDescription: bulkDesc,
        footerCopyright,
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      console.error('Failed to update content:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Layout className="w-6 h-6 text-blue-400" />
            <span>Homepage Copy & Section CMS</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Edit headlines, subtitles, and key website announcements live on the public site
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-blue-600/30 cursor-pointer transition-all self-start sm:self-auto disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving...' : 'Publish Content Changes'}</span>
        </button>
      </div>

      {success && (
        <div className="p-4 rounded-xl bg-emerald-950/70 border border-emerald-600 text-emerald-300 text-xs sm:text-sm flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Homepage copy updated successfully and immediately rendered on the public website!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Card 1: Hero Section */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 font-bold text-white text-base border-b border-slate-800 pb-3">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span>Hero Header Settings</span>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-300">
              Hero Top Badge
            </label>
            <input
              type="text"
              value={heroBadge}
              onChange={(e) => setHeroBadge(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-300">
              Main Hero Headline
            </label>
            <textarea
              rows={2}
              value={heroHeadline}
              onChange={(e) => setHeroHeadline(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm font-bold focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-300">
              Hero Subtitle / Description
            </label>
            <textarea
              rows={3}
              value={heroSubtitle}
              onChange={(e) => setHeroSubtitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs leading-relaxed focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Card 2: Bulk Windows Deployment */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 font-bold text-white text-base border-b border-slate-800 pb-3">
            <Type className="w-4 h-4 text-indigo-400" />
            <span>Bulk Deployment Section Text</span>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-300">
              Section Title
            </label>
            <input
              type="text"
              value={bulkTitle}
              onChange={(e) => setBulkTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-300">
              Section Description
            </label>
            <textarea
              rows={3}
              value={bulkDesc}
              onChange={(e) => setBulkDesc(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs leading-relaxed focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Card 3: Footer Copyright */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 font-bold text-white text-base border-b border-slate-800 pb-3">
            <Type className="w-4 h-4 text-emerald-400" />
            <span>Footer Text</span>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-300">
              Copyright Notice
            </label>
            <input
              type="text"
              value={footerCopyright}
              onChange={(e) => setFooterCopyright(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

      </form>

    </div>
  );
};
