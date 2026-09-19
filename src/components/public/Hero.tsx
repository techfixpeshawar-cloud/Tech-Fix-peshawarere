import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Calendar,
  MessageSquare,
  ShieldCheck,
  CheckCircle,
  HardDrive,
  Monitor,
  AlertTriangle,
  Database,
  ArrowRight,
  Clock,
  MapPin,
  Sparkles,
} from 'lucide-react';

export const Hero: React.FC = () => {
  const { settings, generateWhatsAppLink } = useApp();

  const headline = settings?.heroHeadline || "COMPUTER PROBLEM?\nDON'T WASTE YOUR DAY.";
  const subtitle = settings?.heroSubtitle || "Fast On-Site Computer Support in Peshawar";
  const description = settings?.heroDescription || "Windows installation, computer troubleshooting, OS migration, data recovery assistance, and BSOD diagnosis — delivered directly at your home or office by appointment.";
  const technicianPhoto = settings?.technicianPhoto || '/technician.jpg';

  const whatsappUrl = generateWhatsAppLink('Hello Safiullah! I need on-site computer support in Peshawar.');

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const offsetPosition = elementRect - bodyRect - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="relative pt-32 pb-20 md:pt-36 md:pb-28 overflow-hidden">
      {/* Background tech glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Offer & Conversion Actions (7 cols on desktop) */}
          <div className="lg:col-span-7 text-left space-y-6">
            
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-950/70 border border-blue-800/60 text-blue-300 text-xs sm:text-sm font-medium shadow-inner">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span>ON-SITE COMPUTER SUPPORT • WE COME TO YOU</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
              COMPUTER PROBLEM? <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300">
                DON'T WASTE YOUR DAY.
              </span>
            </h1>

            {/* Subtitle & Value Proposition */}
            <p className="text-lg sm:text-xl font-medium text-slate-300">
              {subtitle}
            </p>

            <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-2xl">
              {description} No unplugging heavy desktop towers or risking delicate laptop screens in crowded market traffic. Professional diagnostic, repair, and testing right in front of your eyes.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
              <button
                onClick={() => scrollToSection('book-service')}
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-bold text-base text-white bg-blue-600 hover:bg-blue-500 shadow-xl shadow-blue-600/30 hover:shadow-blue-500/50 transition-all cursor-pointer group"
              >
                <Calendar className="w-5 h-5 text-blue-200" />
                <span>BOOK A SERVICE</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-bold text-base text-emerald-300 bg-emerald-950/60 hover:bg-emerald-900/70 border border-emerald-600/50 transition-all shadow-md"
              >
                <MessageSquare className="w-5 h-5 text-emerald-400" />
                <span>CONTACT ON WHATSAPP</span>
              </a>
            </div>

            {/* Trust Bullet Grid */}
            <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs sm:text-sm text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>On-Site in Peshawar</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>5+ Years Experience</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Transparent Quotes</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Test Before You Pay</span>
              </div>
            </div>

          </div>

          {/* Right Column: Landscape-First Tech Visual & Floating Interface (5 cols on desktop) */}
          <div className="lg:col-span-5 relative mt-6 lg:mt-0">
            
            {/* Ambient Backing Frame */}
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Main Technician Media Container */}
              <div className="relative rounded-3xl overflow-hidden glass-panel-glow border-2 border-blue-500/30 p-2 shadow-2xl">
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-slate-900">
                  <img
                    src={technicianPhoto}
                    alt="Safiullah - Computer Support Technician Peshawar"
                    className="w-full h-full object-cover object-top"
                    onError={(e) => {
                      // Fallback to placeholder if local image still caching
                      (e.target as HTMLImageElement).src = '/technician.jpg';
                    }}
                  />
                  {/* Subtle tech gradient overlay at base */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#090e17] via-transparent to-transparent opacity-85" />

                  {/* Technician Info Banner on Image */}
                  <div className="absolute bottom-3 left-3 right-3 p-3.5 rounded-xl bg-slate-950/80 backdrop-blur-md border border-slate-700/60 text-left">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-white font-bold text-base flex items-center gap-1.5">
                          <span>Safiullah</span>
                          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400"></span>
                        </div>
                        <div className="text-xs text-blue-400 font-medium">
                          Computer Science & Cybersecurity
                        </div>
                        <div className="text-[11px] text-slate-400">
                          University of Agriculture, Peshawar
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="inline-block px-2 py-1 rounded bg-blue-900/60 text-blue-200 border border-blue-700/50 text-xs font-semibold">
                          5+ Yrs Hands-On
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Glass Badges around Technician */}
              {/* Floating Top Left: Windows Install */}
              <div className="hidden sm:flex absolute -top-4 -left-6 items-center gap-2.5 px-3.5 py-2.5 rounded-xl glass-panel border border-blue-500/40 shadow-xl text-xs text-white">
                <div className="w-7 h-7 rounded-lg bg-blue-600/30 border border-blue-500/50 flex items-center justify-center text-blue-300">
                  <Monitor className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-slate-100">Windows 10 / 11</div>
                  <div className="text-[10px] text-blue-400">Clean Install + Drivers</div>
                </div>
              </div>

              {/* Floating Top Right: SSD Migration */}
              <div className="hidden sm:flex absolute top-10 -right-6 items-center gap-2.5 px-3.5 py-2.5 rounded-xl glass-panel border border-sky-500/40 shadow-xl text-xs text-white">
                <div className="w-7 h-7 rounded-lg bg-sky-600/30 border border-sky-500/50 flex items-center justify-center text-sky-300">
                  <HardDrive className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-slate-100">HDD → Fast SSD</div>
                  <div className="text-[10px] text-sky-300">10x Speed Boost</div>
                </div>
              </div>

              {/* Floating Mid Left: Data Recovery */}
              <div className="hidden sm:flex absolute bottom-28 -left-8 items-center gap-2.5 px-3.5 py-2.5 rounded-xl glass-panel border border-amber-500/40 shadow-xl text-xs text-white">
                <div className="w-7 h-7 rounded-lg bg-amber-600/30 border border-amber-500/50 flex items-center justify-center text-amber-300">
                  <Database className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-slate-100">Data Recovery</div>
                  <div className="text-[10px] text-amber-400">Non-Destructive Clone</div>
                </div>
              </div>

              {/* Floating Bottom Right: BSOD Diagnostic */}
              <div className="hidden sm:flex absolute -bottom-4 -right-4 items-center gap-2.5 px-3.5 py-2.5 rounded-xl glass-panel border border-indigo-500/40 shadow-xl text-xs text-white">
                <div className="w-7 h-7 rounded-lg bg-indigo-600/30 border border-indigo-500/50 flex items-center justify-center text-indigo-300">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-slate-100">BSOD Diagnosis</div>
                  <div className="text-[10px] text-indigo-300">Minidump & RAM Test</div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
