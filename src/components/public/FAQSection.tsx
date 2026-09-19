import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ChevronDown,
  HelpCircle,
  MessageSquare,
} from 'lucide-react';

export const FAQSection: React.FC = () => {
  const { faq, generateWhatsAppLink } = useApp();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  const whatsappUrl = generateWhatsAppLink('Hello Safiullah! I have a question not listed in the FAQ.');

  return (
    <section id="faq" className="py-20 bg-slate-950/40 border-y border-slate-900 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-block px-3.5 py-1 rounded-full bg-blue-950/80 border border-blue-800/60 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-3">
            Common Inquiries
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-slate-400 text-sm sm:text-base">
            Clear, honest answers about on-site procedures, timing, pricing, and data protection.
          </p>
        </div>

        {/* Accordion Container */}
        <div className="space-y-3.5">
          {faq.filter(item => item.published).map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={item.id}
                className={`glass-panel rounded-2xl border transition-all overflow-hidden ${
                  isOpen ? 'border-blue-500/40 bg-slate-900/90' : 'border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 focus:outline-none cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-3.5">
                    <span className="w-7 h-7 rounded-lg bg-blue-950/80 border border-blue-800/60 flex items-center justify-center text-blue-400 font-mono text-xs font-bold shrink-0">
                      {idx + 1}
                    </span>
                    <span className="font-bold text-sm sm:text-base text-white">
                      {item.question}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-blue-400' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-6 sm:px-6 sm:pb-6 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/60 mt-1">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer Prompt */}
        <div className="mt-10 p-6 rounded-2xl glass-panel border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <h4 className="font-bold text-white text-sm">Have a question not answered here?</h4>
            <p className="text-xs text-slate-400 mt-0.5">Send a quick WhatsApp message and Safiullah will answer directly.</p>
          </div>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-xl font-semibold text-xs text-emerald-300 bg-emerald-950/60 hover:bg-emerald-900/70 border border-emerald-600/50 flex items-center gap-2 shrink-0"
          >
            <MessageSquare className="w-4 h-4 text-emerald-400" />
            <span>Ask On WhatsApp</span>
          </a>
        </div>

      </div>
    </section>
  );
};
