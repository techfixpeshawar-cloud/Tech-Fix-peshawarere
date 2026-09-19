import React from 'react';
import { useApp } from '../../context/AppContext';
import { defaultWhyOnSitePoints } from '../../data/defaultSections';
import {
  XCircle,
  CheckCircle2,
  Clock,
  Shield,
  Car,
  Home,
  Eye,
  Lock,
} from 'lucide-react';

export const WhyOnSiteSection: React.FC = () => {
  const { settings } = useApp();

  const points =
    settings?.whyOnSitePoints && settings.whyOnSitePoints.length > 0
      ? settings.whyOnSitePoints
      : defaultWhyOnSitePoints;

  const shopPoints = points.filter((p) => p.type === 'shop');
  const onsitePoints = points.filter((p) => p.type === 'onsite');

  return (
    <section id="why-on-site" className="py-20 bg-slate-950/40 border-y border-slate-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-block px-3.5 py-1 rounded-full bg-blue-950/80 border border-blue-800/60 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-3">
            Your Time & Peace of Mind
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Why Choose On-Site Support?
          </h2>
          <p className="mt-3 text-slate-400 text-sm sm:text-base leading-relaxed">
            Taking your computer to a repair shop is inconvenient, stressful, and time-consuming. We bring the workshop directly to you.
          </p>
        </div>

        {/* Comparison Cards: Shop vs. On-Site */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* TRADITIONAL REPAIR SHOP (Pain points) */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-rose-900/40 bg-rose-950/10 space-y-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 rounded-lg bg-rose-950/60 border border-rose-800/60 text-rose-300 text-xs font-bold uppercase tracking-wider">
                  The Old Way
                </span>
                <span className="text-xs text-slate-400 font-mono">Traditional Shop</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                Hauling Your PC To A Repair Market
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mb-6">
                What customers in Peshawar usually suffer through when a computer breaks down:
              </p>

              <div className="space-y-4">
                {shopPoints.map((sp) => (
                  <div key={sp.id} className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-sm text-rose-200">{sp.title}</div>
                      <div className="text-xs text-slate-400">{sp.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-rose-900/30 text-xs text-rose-300/80 font-medium">
              Result: Lost workday, high stress, and privacy risks.
            </div>
          </div>

          {/* OUR ON-SITE SERVICE (Delight points) */}
          <div className="glass-panel-glow rounded-3xl p-6 sm:p-8 border border-blue-500/50 bg-blue-950/20 space-y-6 flex flex-col justify-between shadow-2xl shadow-blue-950/40">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 rounded-lg bg-blue-600 text-white text-xs font-bold uppercase tracking-wider">
                  Our Method
                </span>
                <span className="text-xs text-blue-300 font-semibold font-mono">Peshawar On-Site</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                We Come Directly To Your Door
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mb-6">
                Fast, respectful, transparent, and tested in your actual work environment:
              </p>

              <div className="space-y-4">
                {onsitePoints.map((op) => (
                  <div key={op.id} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-sm text-emerald-300">{op.title}</div>
                      <div className="text-xs text-slate-300">{op.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-blue-800/40 text-xs text-blue-200 font-semibold flex items-center justify-between">
              <span>Result: Computer fixed safely without losing your day.</span>
              <span className="text-emerald-400">Guaranteed Peace of Mind</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
