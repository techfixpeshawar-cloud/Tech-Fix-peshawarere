import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  DollarSign,
  Save,
  CheckCircle2,
  Clock,
  Layers,
  Sparkles,
} from 'lucide-react';

export const AdminPricing: React.FC = () => {
  const { services, updateService, settings, updateSettings } = useApp();

  const [prices, setPrices] = useState<Record<string, string | number>>(() => {
    const map: Record<string, string | number> = {};
    services.forEach(s => {
      map[s.id] = s.startingPrice;
    });
    return map;
  });

  const [durations, setDurations] = useState<Record<string, string>>(() => {
    const map: Record<string, string> = {};
    services.forEach(s => {
      map[s.id] = s.serviceDuration;
    });
    return map;
  });

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  const handlePriceChange = (id: string, val: string) => {
    setPrices({ ...prices, [id]: val });
  };

  const handleDurationChange = (id: string, val: string) => {
    setDurations({ ...durations, [id]: val });
  };

  const handleSaveAll = async () => {
    setSaving(true);
    setSuccessMsg(false);
    try {
      // Batch update each service
      for (const s of services) {
        const newPrice = Number(prices[s.id]) || prices[s.id];
        const newDuration = durations[s.id];
        if (newPrice !== s.startingPrice || newDuration !== s.serviceDuration) {
          await updateService(s.id, {
            startingPrice: newPrice,
            serviceDuration: newDuration,
          });
        }
      }
      setSuccessMsg(true);
      setTimeout(() => setSuccessMsg(false), 4000);
    } catch (err) {
      console.error('Failed to save prices:', err);
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
            <DollarSign className="w-6 h-6 text-emerald-400" />
            <span>Fast Pricing & Duration Manager</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Quickly adjust starting prices and typical appointment durations across all services
          </p>
        </div>

        <button
          onClick={handleSaveAll}
          disabled={saving}
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-blue-600/30 cursor-pointer transition-all self-start sm:self-auto disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving...' : 'Save All Pricing Changes'}</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-950/70 border border-emerald-600 text-emerald-300 text-xs sm:text-sm flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>All pricing and duration changes have been saved to the database and updated on the public site!</span>
        </div>
      )}

      {/* Pricing Table */}
      <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3.5">Service</th>
                <th className="px-6 py-3.5">Category</th>
                <th className="px-6 py-3.5">Starting Price (PKR)</th>
                <th className="px-6 py-3.5">Service Duration</th>
                <th className="px-6 py-3.5">Current Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {services.map((s) => (
                <tr key={s.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="px-6 py-4 font-bold text-white max-w-xs">
                    {s.name}
                  </td>
                  <td className="px-6 py-4 text-blue-400 font-medium">
                    {s.category}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 max-w-[150px]">
                      <span className="text-slate-500 font-mono">Rs.</span>
                      <input
                        type="text"
                        value={prices[s.id] !== undefined ? prices[s.id] : s.startingPrice}
                        onChange={(e) => handlePriceChange(s.id, e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono font-bold focus:outline-none focus:border-blue-500 text-xs"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <input
                      type="text"
                      value={durations[s.id] !== undefined ? durations[s.id] : s.serviceDuration}
                      onChange={(e) => handleDurationChange(s.id, e.target.value)}
                      className="w-full max-w-[160px] px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-blue-500 text-xs"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      s.status === 'published' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {s.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
