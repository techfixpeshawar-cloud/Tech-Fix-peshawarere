import React from 'react';
import { useApp } from '../../context/AppContext';
import { defaultInstitutionalDeployments } from '../../data/defaultSections';
import {
  Building2,
  Cpu,
  ShieldCheck,
  CheckCircle,
  FileSpreadsheet,
  ArrowRight,
  MessageSquare,
  Layers,
  Sparkles,
} from 'lucide-react';

export const BulkDeploymentSection: React.FC = () => {
  const { settings, setSelectedProblemForBooking, generateWhatsAppLink } = useApp();

  const title = settings?.bulkServiceTitle || 'Need Windows On 5, 10, 20 Or 50+ PCs?';
  const desc = settings?.bulkServiceDescription ||
    'Standardized Windows deployment, driver provisioning, SSD upgrades, and lab software setups for schools, academies, and business offices across Peshawar.';

  const deployments =
    settings?.institutionalDeployments && settings.institutionalDeployments.length > 0
      ? settings.institutionalDeployments
      : defaultInstitutionalDeployments;

  const handleBulkQuote = () => {
    setSelectedProblemForBooking('Bulk Windows Deployment for Offices & Labs');
    const el = document.getElementById('book-service');
    if (el) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const offsetPosition = elementRect - bodyRect - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  const whatsappUrl = generateWhatsAppLink(
    'Hello Safiullah, I am looking for a bulk Windows deployment quote for multiple computers in Peshawar (Office / Lab).'
  );

  return (
    <section id="bulk-deployment" className="py-20 bg-slate-950/70 border-y border-slate-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="glass-panel-glow rounded-3xl p-8 sm:p-12 border border-blue-500/30 relative overflow-hidden">
          
          {/* Subtle background graphics */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-950/80 border border-blue-800/70 text-blue-300 text-xs font-semibold uppercase tracking-wider">
                <Building2 className="w-4 h-4 text-blue-400" />
                <span>Commercial & Educational Systems</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
                {title}
              </h2>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
                {desc} We use rapid image deployment and automated driver configurations so each system is identical, clean, virus-free, and ready for work or study in hours, not weeks.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Standardized Clean Windows 10/11</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Batch SSD Upgrades & Clones</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Office / Browsers / Utility Bundles</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Substantial Per-Machine Discount</span>
                </div>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  onClick={handleBulkQuote}
                  className="px-6 py-3.5 rounded-xl font-bold text-sm sm:text-base text-white bg-blue-600 hover:bg-blue-500 shadow-xl shadow-blue-600/30 transition-all flex items-center justify-center gap-2.5 cursor-pointer"
                >
                  <FileSpreadsheet className="w-5 h-5 text-blue-200" />
                  <span>Get A Bulk Estimate</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3.5 rounded-xl font-bold text-sm sm:text-base text-emerald-300 bg-emerald-950/60 hover:bg-emerald-900/70 border border-emerald-600/50 transition-all flex items-center justify-center gap-2.5"
                >
                  <MessageSquare className="w-5 h-5 text-emerald-400" />
                  <span>Discuss On WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Right illustration / feature pill summary */}
            <div className="lg:col-span-5">
              <div className="glass-panel p-6 rounded-2xl border border-slate-700/80 space-y-4">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <Layers className="w-4 h-4 text-blue-400" />
                  <span>Typical Institutional Deployments</span>
                </div>

                <div className="space-y-3">
                  {deployments.map((dep) => (
                    <div key={dep.id} className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
                      <div className="flex items-center justify-between text-xs font-bold text-white mb-1">
                        <span>{dep.title}</span>
                        <span className="text-blue-400 font-mono">{dep.scale}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 leading-relaxed">
                        {dep.details}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-2 text-[11px] text-slate-400 text-center italic">
                  Flexible scheduling: Available Friday, Saturday, Sunday & evening batches.
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
