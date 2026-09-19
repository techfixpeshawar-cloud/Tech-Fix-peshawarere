import React from 'react';
import { useApp } from '../../context/AppContext';
import { MessageSquare } from 'lucide-react';

export const FloatingWhatsAppButton: React.FC = () => {
  const { generateWhatsAppLink } = useApp();
  const whatsappUrl = generateWhatsAppLink('Hello Safiullah! I need on-site computer support in Peshawar.');

  return (
    <aside aria-label="WhatsApp quick contact" className="fixed bottom-6 right-6 z-40 flex items-center gap-3">
      {/* Tooltip callout */}
      <span className="hidden md:inline-flex items-center px-3 py-1.5 rounded-xl bg-slate-900/90 text-xs font-semibold text-slate-200 border border-slate-700/80 shadow-lg pointer-events-none animate-bounce">
        Chat with Safiullah
      </span>

      {/* WhatsApp Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-14 h-14 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center justify-center shadow-xl shadow-emerald-600/30 hover:shadow-emerald-500/50 hover:scale-110 active:scale-95 transition-all duration-200 group"
        aria-label="Contact Safiullah on WhatsApp"
      >
        <MessageSquare className="w-7 h-7 text-slate-950 fill-slate-950" />
      </a>
    </aside>
  );
};
