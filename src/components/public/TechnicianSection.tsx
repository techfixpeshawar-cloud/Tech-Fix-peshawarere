import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  Award,
  GraduationCap,
  Terminal,
  CheckCircle,
  MessageSquare,
  Lock,
  HeartHandshake,
} from 'lucide-react';

export const TechnicianSection: React.FC = () => {
  const { settings, generateWhatsAppLink } = useApp();

  const name = settings?.technicianName || 'Safiullah';
  const title = settings?.technicianTitle || 'Computer Science & Cybersecurity • Univ. of Agriculture, Peshawar';
  const experience = settings?.technicianExperience || '5+ Years Practical Experience';
  const photo = settings?.technicianPhoto || '/technician.jpg';
  const bio = settings?.technicianBio ||
    "Hi, I'm Safiullah. I'm a student at the University of Agriculture, Peshawar, developing my knowledge in Computer Science and Cybersecurity, with around 5 years of practical experience working with computers, Windows systems, troubleshooting, OS installation, migration, and recovery.\n\nI started this service because computer problems shouldn't force people to waste an entire day travelling to a repair shop, unplugging cables, and leaving their computer behind.";

  const whatsappUrl = generateWhatsAppLink('Hello Safiullah! I would like to consult with you about my computer issue.');

  return (
    <section id="technician" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-block px-3.5 py-1 rounded-full bg-blue-950/80 border border-blue-800/60 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-3">
            Real Person • Verified Background
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Meet Your Technician
          </h2>
          <p className="mt-3 text-slate-400 text-sm sm:text-base">
            No anonymous shop hands or inexperienced interns. You deal directly with a dedicated computer science practitioner.
          </p>
        </div>

        {/* Technician Profile Card */}
        <div className="glass-panel-glow rounded-3xl border border-slate-800 p-6 sm:p-10 max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            {/* Image Col (4 cols) */}
            <div className="md:col-span-5 relative">
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden border-2 border-blue-500/40 shadow-2xl bg-slate-900 mx-auto max-w-xs md:max-w-none">
                <img
                  src={photo}
                  alt={name}
                  className="w-full h-full object-cover object-top"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/technician.jpg';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-70" />
                <div className="absolute bottom-3 left-3 right-3 p-3 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-700/60 text-center">
                  <div className="text-white font-bold text-base flex items-center justify-center gap-1.5">
                    <span>{name}</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  </div>
                  <div className="text-xs text-blue-400 font-medium">{experience}</div>
                </div>
              </div>
            </div>

            {/* Text & Background Col (7 cols) */}
            <div className="md:col-span-7 space-y-5 text-left">
              <div>
                <div className="flex items-center gap-2 text-blue-400 text-xs font-semibold tracking-wide uppercase mb-1">
                  <GraduationCap className="w-4 h-4" />
                  <span>Academic & Practical Credentials</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  {name}
                </h3>
                <p className="text-sm font-medium text-slate-300 mt-1">
                  {title}
                </p>
              </div>

              {/* Bio Paragraphs */}
              <div className="text-xs sm:text-sm text-slate-300 leading-relaxed space-y-3 whitespace-pre-line">
                {bio}
              </div>

              {/* Trust & Ethics Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-2.5">
                  <Lock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-white">Strict Data Privacy</div>
                    <div className="text-[11px] text-slate-400">Personal files never opened or moved without permission.</div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-white">Anti-Piracy Policy</div>
                    <div className="text-[11px] text-slate-400">Clean, genuine Microsoft images without malware or trojans.</div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-2.5">
                  <Terminal className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-white">Direct Diagnosis</div>
                    <div className="text-[11px] text-slate-400">Clear root-cause explanation instead of mindless formatting.</div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-2.5">
                  <HeartHandshake className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-white">Test Before Payment</div>
                    <div className="text-[11px] text-slate-400">You test your Wi-Fi, audio, and performance before paying.</div>
                  </div>
                </div>
              </div>

              {/* Direct WhatsApp Action */}
              <div className="pt-3 flex items-center gap-4">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-emerald-300 bg-emerald-950/70 hover:bg-emerald-900/80 border border-emerald-600/50 transition-all shadow-md"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-400" />
                  <span>Connect With Safiullah On WhatsApp</span>
                </a>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
