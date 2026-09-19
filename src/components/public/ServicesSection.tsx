import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Service } from '../../types';
import { IconRenderer } from '../common/IconRenderer';
import {
  Clock,
  CheckCircle,
  AlertOctagon,
  ArrowRight,
  MessageSquare,
  Calendar,
  Layers,
  Sparkles,
  Zap,
} from 'lucide-react';

export const ServicesSection: React.FC = () => {
  const { services, setSelectedProblemForBooking, generateWhatsAppLink } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Windows', 'SSD / OS Migration', 'Data Recovery', 'Troubleshooting', 'Software Setup', 'Bulk Deployment'];

  const filteredServices = (selectedCategory === 'All'
    ? services
    : services.filter(s => s.category === selectedCategory)
  ).filter(s => s.status === 'published');

  const handleBook = (serviceName: string) => {
    setSelectedProblemForBooking(serviceName);
    const element = document.getElementById('book-service');
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const offsetPosition = elementRect - bodyRect - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  return (
    <section id="services" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-block px-3.5 py-1 rounded-full bg-blue-950/80 border border-blue-800/60 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-3">
            On-Site Technical Services
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Comprehensive Windows & PC Support
          </h2>
          <p className="mt-3 text-slate-400 text-sm sm:text-base leading-relaxed">
            Transparent pricing, thorough diagnostics, genuine drivers, and on-site testing. We come to your home, hostel, or office in Peshawar.
          </p>

          {/* Category Filter Pills */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Services List Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredServices.map((service) => {
            const isDataRecovery = service.category === 'Data Recovery' || service.name.includes('Data Recovery');
            const isSSD = service.category === 'SSD / OS Migration' || service.name.includes('SSD');
            const isBSOD = service.name.includes('BSOD') || service.name.includes('Blue Screen');

            return (
              <div
                key={service.id}
                className={`glass-panel rounded-3xl p-6 sm:p-8 border transition-all flex flex-col justify-between relative overflow-hidden ${
                  service.featured
                    ? 'border-blue-500/40 shadow-xl shadow-blue-950/20'
                    : 'border-slate-800/80 hover:border-slate-700'
                }`}
              >
                {/* Background decorative corner glow */}
                <div className="absolute top-0 right-0 w-36 h-36 bg-blue-500/5 rounded-bl-full pointer-events-none" />

                <div>
                  {/* Top metadata: Icon, Category, Price & Duration */}
                  <div className="flex items-start justify-between gap-4 mb-5">
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-blue-950/70 border border-blue-800/60 flex items-center justify-center text-blue-400 shrink-0 shadow-inner">
                        <IconRenderer name={service.icon} className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-400">
                          {service.category}
                        </span>
                        <h3 className="text-xl font-bold text-white tracking-tight">
                          {service.name}
                        </h3>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-xs text-slate-400 font-medium">Starting from</div>
                      <div className="text-xl font-extrabold text-white font-mono">
                        {typeof service.startingPrice === 'number'
                          ? `Rs. ${service.startingPrice.toLocaleString()}`
                          : service.startingPrice}
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center justify-end gap-1 mt-0.5">
                        <Clock className="w-3 h-3 text-slate-500" />
                        <span>{service.serviceDuration}</span>
                      </div>
                    </div>
                  </div>

                  {/* Descriptions */}
                  <p className="text-slate-300 text-sm leading-relaxed mb-4">
                    {service.shortDescription}
                  </p>

                  {/* CRITICAL WARNING BOX FOR DATA RECOVERY */}
                  {(isDataRecovery || service.warningMessage) && (
                    <div className="mb-5 p-4 rounded-2xl bg-rose-950/50 border border-rose-600/60 text-rose-200 text-xs sm:text-sm space-y-1.5 shadow-lg">
                      <div className="flex items-center gap-2 font-bold text-rose-300">
                        <AlertOctagon className="w-4 h-4 text-rose-400 shrink-0" />
                        <span>CRITICAL WARNING FOR LOST DATA:</span>
                      </div>
                      <p className="text-rose-200/90 leading-relaxed font-medium">
                        {service.warningMessage ||
                          'DO NOT FORMAT THE DRIVE. DO NOT INSTALL WINDOWS. DO NOT COPY NEW FILES. Stop using the computer immediately to prevent overwriting.'}
                      </p>
                    </div>
                  )}

                  {/* SSD PERFORMANCE COMPARISON CALLOUT */}
                  {isSSD && (
                    <div className="mb-5 p-4 rounded-2xl bg-sky-950/40 border border-sky-800/60 text-sky-200 text-xs space-y-2">
                      <div className="font-bold flex items-center gap-2 text-sky-300">
                        <Zap className="w-4 h-4 text-sky-400" />
                        <span>Real Hardware Speed Comparison:</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[11px]">
                        <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                          <div className="text-slate-400">Old Mechanical HDD:</div>
                          <div className="font-semibold text-rose-300 font-mono">~2–4 mins boot time</div>
                          <div className="text-[10px] text-slate-500">Freezes on heavy apps</div>
                        </div>
                        <div className="p-2 rounded-xl bg-slate-900/80 border border-sky-900/80">
                          <div className="text-slate-400">Modern Solid-State SSD:</div>
                          <div className="font-semibold text-emerald-300 font-mono">~10–15 sec boot time</div>
                          <div className="text-[10px] text-sky-400">Instant app launches</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* BSOD ROOT CAUSE CALLOUT */}
                  {isBSOD && (
                    <div className="mb-5 p-3.5 rounded-2xl bg-indigo-950/30 border border-indigo-800/50 text-indigo-200 text-xs">
                      <div className="font-semibold text-indigo-300 mb-1 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                        <span>We Diagnose The Real Cause:</span>
                      </div>
                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        Reinstalling Windows without knowing why it crashed causes the blue screen to come back. We inspect minidump crash logs, test RAM sticks, and test drive controller health.
                      </p>
                    </div>
                  )}

                  {/* Workflow Steps / Key Points */}
                  {service.workflowSteps && service.workflowSteps.length > 0 && (
                    <div className="mb-6 space-y-2">
                      <div className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-blue-400" />
                        <span>Technical Process:</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                        {service.workflowSteps.map((step, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-xs text-slate-400">
                            <CheckCircle className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                            <span>{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Bottom Action Buttons */}
                <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                  <button
                    onClick={() => handleBook(service.name)}
                    className="flex-1 py-2.5 px-4 rounded-xl font-semibold text-xs sm:text-sm text-white bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Book This Service</span>
                  </button>

                  <a
                    href={generateWhatsAppLink(
                      `Hello Safiullah! I have a question about ${service.name}. Can you provide support in Peshawar?`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-4 rounded-xl font-semibold text-xs sm:text-sm text-emerald-300 bg-emerald-950/50 hover:bg-emerald-900/60 border border-emerald-700/50 transition-all flex items-center justify-center gap-2"
                  >
                    <MessageSquare className="w-4 h-4 text-emerald-400" />
                    <span>Ask On WhatsApp</span>
                  </a>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
