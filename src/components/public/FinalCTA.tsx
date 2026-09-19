import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Calendar,
  MessageSquare,
  ArrowRight,
  Sparkles,
  Phone,
} from 'lucide-react';

export const FinalCTA: React.FC = () => {
  const { generateWhatsAppLink, settings } = useApp();

  const phone = settings?.phone || '+92 312 9876543';
  const whatsappUrl = generateWhatsAppLink('Hello Safiullah! I need on-site computer support in Peshawar.');

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

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-600/15 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="glass-panel-glow rounded-3xl p-8 sm:p-14 border border-blue-500/40 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-950/80 border border-blue-800/60 text-blue-300 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span>Fast • Convenient • Transparent</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Stop Wasting Your Day On Computer Problems.
          </h2>

          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Get your Windows system, sluggish laptop, crashed drive, or office computer network running smoothly with convenient on-site support right in Peshawar.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={scrollToForm}
              className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-base text-white bg-blue-600 hover:bg-blue-500 shadow-xl shadow-blue-600/30 transition-all flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <Calendar className="w-5 h-5 text-blue-200" />
              <span>BOOK AN ON-SITE VISIT</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-base text-emerald-300 bg-emerald-950/70 hover:bg-emerald-900/80 border border-emerald-600/50 transition-all flex items-center justify-center gap-2.5 shadow-md"
            >
              <MessageSquare className="w-5 h-5 text-emerald-400" />
              <span>CHAT ON WHATSAPP DIRECTLY</span>
            </a>
          </div>

          <div className="pt-2 text-xs text-slate-400 flex items-center justify-center gap-2">
            <span>Or call directly:</span>
            <a href={`tel:${phone}`} className="font-mono font-semibold text-blue-400 hover:underline">
              {phone}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
