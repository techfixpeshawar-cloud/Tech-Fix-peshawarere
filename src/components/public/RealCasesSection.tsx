import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileText,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Sparkles,
} from 'lucide-react';

export const RealCasesSection: React.FC = () => {
  const { cases } = useApp();

  return (
    <section id="cases" className="py-20 bg-slate-950/40 border-y border-slate-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-block px-3.5 py-1 rounded-full bg-blue-950/80 border border-blue-800/60 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-3">
            Real Work Logs
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Verified Service Cases
          </h2>
          <p className="mt-3 text-slate-400 text-sm sm:text-base">
            Transparent job documentation showing the problem, live diagnostic, technical solution, and final test result.
          </p>
        </div>

        {cases.filter(c => c.published).length === 0 ? (
          /* Empty state as requested by user */
          <div className="glass-panel max-w-2xl mx-auto rounded-3xl p-10 text-center border border-slate-800 space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-blue-950/60 border border-blue-800/60 flex items-center justify-center text-blue-400 mx-auto">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">
              No Service Cases Published Yet
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
              We publish actual case studies and diagnostic write-ups with customer consent as on-site jobs are completed across Peshawar.
            </p>
          </div>
        ) : (
          /* List of published real cases */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cases.filter(c => c.published).map((c) => (
              <div
                key={c.id}
                className="glass-panel rounded-3xl p-6 sm:p-7 border border-slate-800 hover:border-blue-500/40 transition-all space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-950/80 text-blue-300 border border-blue-800/60">
                    {c.serviceType}
                  </span>
                  <span className="text-xs text-slate-500 font-mono flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{c.date}</span>
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white tracking-tight">
                  {c.title}
                </h3>

                <div className="space-y-2.5 text-xs sm:text-sm">
                  <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800/80">
                    <div className="font-semibold text-rose-300 text-xs mb-1">Customer Problem:</div>
                    <div className="text-slate-300">{c.problem}</div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800/80">
                    <div className="font-semibold text-sky-300 text-xs mb-1">Diagnostic Findings:</div>
                    <div className="text-slate-300">{c.diagnosis}</div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800/80">
                    <div className="font-semibold text-emerald-300 text-xs mb-1">Applied Solution:</div>
                    <div className="text-slate-300">{c.solution}</div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center gap-2 text-xs font-semibold text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Final Result: {c.result}</span>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
