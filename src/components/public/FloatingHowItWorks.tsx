import React from 'react';
import { useApp } from '../../context/AppContext';
import { defaultHowItWorksSteps } from '../../data/defaultSections';
import {
  MessageSquare,
  CalendarCheck,
  Navigation,
  Activity,
  CheckCircle2,
  Wallet,
  ArrowRight,
  HelpCircle,
} from 'lucide-react';

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  MessageSquare,
  CalendarCheck,
  Navigation,
  Activity,
  CheckCircle2,
  Wallet,
};

export const FloatingHowItWorks: React.FC = () => {
  const { settings } = useApp();

  const steps =
    settings?.howItWorksSteps && settings.howItWorksSteps.length > 0
      ? settings.howItWorksSteps
      : defaultHowItWorksSteps;

  return (
    <section id="how-it-works" className="py-16 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-block px-3 py-1 rounded-full bg-blue-950/80 border border-blue-800/60 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-3">
            The Customer Journey
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
            How On-Site Support Works
          </h2>
          <p className="mt-3 text-slate-400 text-sm sm:text-base">
            No repair shop queues, no leaving your private computer behind. Clean, transparent, and tested right in your presence.
          </p>
        </div>

        {/* Step Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((s, idx) => {
            const Icon = (s.icon && ICON_MAP[s.icon]) || CheckCircle2;
            const colorClass = s.color || 'text-blue-400';
            const bgClass = s.bg || 'bg-blue-950/60 border-blue-800/60';
            const stepNum = s.num || String(idx + 1).padStart(2, '0');

            return (
              <div
                key={s.id || s.num}
                className="glass-panel p-6 rounded-2xl border border-slate-800 hover:border-blue-500/40 transition-all group relative overflow-hidden"
              >
                {/* Step watermarked index */}
                <div className="absolute top-4 right-5 text-4xl font-extrabold text-slate-800/40 select-none group-hover:text-blue-500/10 transition-colors font-mono">
                  {stepNum}
                </div>

                <div className="flex items-center gap-3.5 mb-4">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center border ${bgClass}`}>
                    <Icon className={`w-5 h-5 ${colorClass}`} />
                  </div>
                  <div>
                    <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
                      Step {stepNum}
                    </span>
                    <h3 className="text-base font-bold text-white group-hover:text-blue-300 transition-colors">
                      {s.title}
                    </h3>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  {s.desc}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
