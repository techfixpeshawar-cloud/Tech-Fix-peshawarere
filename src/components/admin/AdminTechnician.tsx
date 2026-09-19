import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  User,
  Save,
  CheckCircle2,
  Image as ImageIcon,
  GraduationCap,
} from 'lucide-react';

export const AdminTechnician: React.FC = () => {
  const { settings, updateSettings } = useApp();

  const [name, setName] = useState(settings?.technicianName || 'Safiullah');
  const [title, setTitle] = useState(
    settings?.technicianTitle || 'Computer Science & Cybersecurity • Univ. of Agriculture, Peshawar'
  );
  const [experience, setExperience] = useState(settings?.technicianExperience || '5+ Years Practical Experience');
  const [photo, setPhoto] = useState(settings?.technicianPhoto || '/technician.jpg');
  const [bio, setBio] = useState(
    settings?.technicianBio ||
      "Hi, I'm Safiullah. I'm a student at the University of Agriculture, Peshawar, developing my knowledge in Computer Science and Cybersecurity, with around 5 years of practical experience working with computers, Windows systems, troubleshooting, OS installation, migration, and recovery.\n\nI started this service because computer problems shouldn't force people to waste an entire day travelling to a repair shop, unplugging cables, and leaving their computer behind."
  );

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    try {
      await updateSettings({
        technicianName: name,
        technicianTitle: title,
        technicianExperience: experience,
        technicianPhoto: photo,
        technicianBio: bio,
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      console.error('Failed to update technician profile:', err);
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
            <User className="w-6 h-6 text-blue-400" />
            <span>Technician Profile & Biography</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Edit Safiullah's public credentials, university background, hands-on experience, and photo
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-blue-600/30 cursor-pointer transition-all self-start sm:self-auto disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving...' : 'Save Profile Changes'}</span>
        </button>
      </div>

      {success && (
        <div className="p-4 rounded-xl bg-emerald-950/70 border border-emerald-600 text-emerald-300 text-xs sm:text-sm flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Technician profile updated successfully on the public website!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Inputs (8 cols) */}
        <div className="lg:col-span-8 glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-300">
                Technician Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-bold focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-300">
                Experience Badge
              </label>
              <input
                type="text"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                placeholder="5+ Years Practical Experience"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-300">
              Academic & Cybersecurity Subtitle
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-300">
              Photo URL or Relative Path
            </label>
            <input
              type="text"
              value={photo}
              onChange={(e) => setPhoto(e.target.value)}
              placeholder="/technician.jpg"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-300">
              Biography & Work Philosophy
            </label>
            <textarea
              rows={6}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs leading-relaxed focus:outline-none focus:border-blue-500 whitespace-pre-line"
            />
          </div>
        </div>

        {/* Right: Live Preview (4 cols) */}
        <div className="lg:col-span-4 glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Public Card Preview
          </div>

          <div className="aspect-[4/5] rounded-2xl overflow-hidden border-2 border-blue-500/40 relative bg-slate-900">
            <img
              src={photo}
              alt={name}
              className="w-full h-full object-cover object-top"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/technician.jpg';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
            <div className="absolute bottom-3 left-3 right-3 p-3 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-700/60 text-center">
              <div className="text-white font-bold text-sm">{name}</div>
              <div className="text-[11px] text-blue-400">{experience}</div>
            </div>
          </div>

          <div className="text-xs text-slate-400 leading-relaxed">
            <div className="font-bold text-white mb-1">{title}</div>
            <p className="line-clamp-4">{bio}</p>
          </div>
        </div>

      </form>

    </div>
  );
};
