import React from 'react';
import { useApp } from '../../context/AppContext';
import { defaultDiagnosticProblems } from '../../data/defaultSections';
import { DiagnosticProblem } from '../../types';
import {
  RotateCcw,
  Gauge,
  AlertTriangle,
  Database,
  Monitor,
  HardDrive,
  Building2,
  KeyRound,
  ArrowDownRight,
  HelpCircle,
} from 'lucide-react';

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  RotateCcw,
  Gauge,
  AlertTriangle,
  Database,
  Monitor,
  HardDrive,
  Building2,
  KeyRound,
};

const ACCENT_MAP: Record<string, string> = {
  urgent: 'border-red-500/30 text-red-400 bg-red-950/20',
  high: 'border-amber-500/30 text-amber-400 bg-amber-950/20',
  normal: 'border-blue-500/30 text-blue-400 bg-blue-950/20',
};

export const ProblemSelector: React.FC = () => {
  const { settings, setSelectedProblemForBooking } = useApp();

  const rawProblems =
    settings?.diagnosticProblems && settings.diagnosticProblems.length > 0
      ? settings.diagnosticProblems
      : defaultDiagnosticProblems;

  const problems = rawProblems.filter((p) => p.published !== false);

  const handleSelect = (prob: DiagnosticProblem) => {
    setSelectedProblemForBooking(prob.serviceName || prob.title);
    const formElement = document.getElementById('book-service');
    if (formElement) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = formElement.getBoundingClientRect().top;
      const offsetPosition = elementRect - bodyRect - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  return (
    <section id="problem-selector" className="py-16 bg-slate-950/60 border-y border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-block px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
            Quick Diagnostic Selector
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            What Computer Problem Are You Having?
          </h2>
          <p className="mt-2 text-slate-400 text-xs sm:text-sm">
            Select your symptom below to instantly jump to the booking form with your issue pre-filled:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {problems.map((p) => {
            const Icon = (p.icon && ICON_MAP[p.icon]) || RotateCcw;
            const accentClass = p.accent || ACCENT_MAP[p.urgency] || ACCENT_MAP.normal;
            return (
              <button
                key={p.id}
                onClick={() => handleSelect(p)}
                className={`glass-panel p-5 rounded-2xl border text-left hover:scale-[1.02] active:scale-[0.99] transition-all group cursor-pointer relative overflow-hidden ${accentClass}`}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-slate-900/90 border border-slate-800 shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <ArrowDownRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-blue-300 transition-colors mb-1">
                  {p.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {p.subtitle}
                </p>

                <div className="mt-3.5 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-medium text-slate-300">
                  <span className="text-blue-400">Select this problem</span>
                  <span className="text-slate-500 group-hover:text-slate-300 font-mono">
                    Book &rarr;
                  </span>
                </div>
              </button>
            );
          })}
        </div>

      </div>
    </section>
  );
};
