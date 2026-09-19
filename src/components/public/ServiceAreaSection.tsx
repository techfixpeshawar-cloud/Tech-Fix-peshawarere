import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  MapPin,
  CheckCircle2,
  Navigation,
  Clock,
} from 'lucide-react';

export const ServiceAreaSection: React.FC = () => {
  const { areas } = useApp();

  return (
    <section id="service-areas" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-block px-3.5 py-1 rounded-full bg-blue-950/80 border border-blue-800/60 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-3">
            Coverage Map
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Service Areas Across Peshawar
          </h2>
          <p className="mt-3 text-slate-400 text-sm sm:text-base">
            We provide on-site computer support across major residential, campus, and commercial districts in Peshawar.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {areas.map((area) => (
            <div
              key={area.id}
              className="glass-panel p-5 rounded-2xl border border-slate-800/80 hover:border-blue-500/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-950/60 border border-blue-800/50 flex items-center justify-center text-blue-400">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-950/70 text-emerald-300 border border-emerald-800/60">
                    Active Coverage
                  </span>
                </div>

                <h3 className="font-bold text-white text-sm mb-1">
                  {area.name}
                </h3>

                {area.notes && (
                  <p className="text-xs text-slate-400 leading-relaxed mb-3">
                    {area.notes}
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-300">
                <span className="text-slate-500">Visit / Travel fee:</span>
                <span className="font-mono font-semibold text-blue-400">
                  Rs. {area.travelFee}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Coverage note */}
        <div className="mt-8 text-center text-xs text-slate-400">
          <span>Don't see your specific neighborhood? </span>
          <span className="text-slate-300">We cover most surrounding areas in Peshawar by prior arrangement. Contact us on WhatsApp to confirm your location.</span>
        </div>

      </div>
    </section>
  );
};
