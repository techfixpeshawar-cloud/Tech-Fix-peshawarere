import React from 'react';
import { useApp } from '../../context/AppContext';
import { defaultTrustRules } from '../../data/defaultSections';
import {
  Shield,
  Eye,
  Lock,
  FileCheck,
  CheckCircle,
  HelpCircle,
} from 'lucide-react';

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  Eye,
  Lock,
  FileCheck,
  CheckCircle,
  Shield,
};

export const TrustSection: React.FC = () => {
  const { settings } = useApp();

  const rules =
    settings?.trustRules && settings.trustRules.length > 0
      ? settings.trustRules
      : defaultTrustRules;

  return (
    <section className="py-16 bg-slate-950/70 border-b border-slate-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="p-8 sm:p-10 rounded-3xl glass-panel border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-950/70 border border-emerald-600/50 flex items-center justify-center text-emerald-400">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-mono text-emerald-400 font-bold uppercase tracking-wider">
                  Data Security & Integrity
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white">
                  Your Data Comes First: Our Trust Rules
                </h3>
              </div>
            </div>
            <div className="text-xs text-slate-400 font-mono">
              Peshawar On-Site Guarantee
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-left">
            {rules.map((rule) => {
              const Icon = (rule.icon && ICON_MAP[rule.icon]) || Shield;
              const iconColor = rule.iconColor || 'text-emerald-400';

              return (
                <div key={rule.id} className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800">
                  <Icon className={`w-5 h-5 ${iconColor} shrink-0 mt-0.5`} />
                  <div>
                    <h4 className="text-sm font-bold text-white mb-1">{rule.title}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {rule.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
