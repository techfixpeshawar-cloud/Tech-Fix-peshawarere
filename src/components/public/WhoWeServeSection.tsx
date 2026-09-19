import React from 'react';
import { useApp } from '../../context/AppContext';
import { defaultAudienceCards } from '../../data/defaultSections';
import {
  GraduationCap,
  Home,
  Building,
  CheckCircle,
  ArrowRight,
  Briefcase,
  Users,
} from 'lucide-react';

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  GraduationCap,
  Home,
  Building,
  Briefcase,
  Users,
};

export const WhoWeServeSection: React.FC = () => {
  const { settings } = useApp();

  const scrollToForm = () => {
    const el = document.getElementById('book-service');
    if (el) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const offsetPosition = elementRect - bodyRect - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  const audiences =
    settings?.audienceCards && settings.audienceCards.length > 0
      ? settings.audienceCards
      : defaultAudienceCards;

  return (
    <section id="who-we-serve" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-block px-3.5 py-1 rounded-full bg-blue-950/80 border border-blue-800/60 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-3">
            Tailored For Peshawar
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Who We Serve
          </h2>
          <p className="mt-3 text-slate-400 text-sm sm:text-base leading-relaxed">
            Whether you are a university student preparing for exam week or an office manager with 10 slow workstations, our on-site model is built around your specific workflow.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {audiences.map((aud) => {
            const Icon = (aud.icon && ICON_MAP[aud.icon]) || Users;
            const colorClass = aud.color || 'text-blue-400';

            return (
              <div
                key={aud.id}
                className="glass-panel rounded-3xl p-7 border border-slate-800 hover:border-blue-500/40 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center group-hover:border-blue-500/40 transition-colors">
                      <Icon className={`w-6 h-6 ${colorClass}`} />
                    </div>
                    {aud.badge && (
                      <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] font-semibold text-slate-300">
                        {aud.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-white mb-1">
                    {aud.title}
                  </h3>
                  <div className="text-xs text-blue-400 font-medium mb-4">
                    {aud.subtitle}
                  </div>

                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-6">
                    {aud.description}
                  </p>

                  <div className="space-y-2.5 pt-4 border-t border-slate-800/70">
                    {aud.perks?.map((perk, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                        <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{perk}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-800/80">
                  <button
                    onClick={scrollToForm}
                    className="w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold text-white bg-slate-900 hover:bg-blue-600 border border-slate-700 hover:border-blue-500 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Request Service</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
