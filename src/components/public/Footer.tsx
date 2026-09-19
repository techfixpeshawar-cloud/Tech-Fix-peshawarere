import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Wrench,
  Phone,
  MessageSquare,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  ChevronRight,
  Search,
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { settings, services, generateWhatsAppLink, setIsAdminRoute, isAuthenticated, navigateToTrack } = useApp();

  const phone = settings?.phone || '+92 312 9876543';
  const email = settings?.email || 'techfixpeshawar@gmail.com';
  const hours = settings?.businessHours || 'Monday – Saturday: 9:00 AM – 9:00 PM';
  const location = settings?.location || 'Peshawar, Khyber Pakhtunkhwa, Pakistan';
  const copyright = settings?.footerCopyright || '© 2026 Peshawar Tech Support. Professional on-site computer services.';

  const whatsappUrl = generateWhatsAppLink('Hello Safiullah! I need computer support in Peshawar.');

  const openAdmin = () => {
    setIsAdminRoute(true);
    window.location.hash = '#admin';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const offsetPosition = elementRect - bodyRect - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-[#05080e] border-t border-slate-800/80 pt-16 pb-12 text-slate-400 text-xs sm:text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800/80">
          
          {/* Col 1: Brand & Bio */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                <Wrench className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-white text-base tracking-tight">
                  Peshawar Tech Support
                </div>
                <div className="text-xs text-blue-400 font-medium">
                  On-Site Computer Service
                </div>
              </div>
            </div>

            <p className="text-slate-400 text-xs leading-relaxed">
              Fast, respectful, and transparent on-site Windows installation, computer hardware troubleshooting, and data recovery across Peshawar, KPK. We visit your location by appointment.
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>Personal Data Protection Guaranteed</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-sm uppercase tracking-wider">
              Quick Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => scrollToSection('services')}
                  className="hover:text-blue-400 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                  <span>Services & Pricing</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('how-it-works')}
                  className="hover:text-blue-400 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                  <span>How It Works</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('why-on-site')}
                  className="hover:text-blue-400 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                  <span>Why Choose On-Site?</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('who-we-serve')}
                  className="hover:text-blue-400 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                  <span>Who We Serve</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('bulk-deployment')}
                  className="hover:text-blue-400 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                  <span>Bulk Windows for Labs & Offices</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('technician')}
                  className="hover:text-blue-400 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                  <span>Meet Technician Safiullah</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('faq')}
                  className="hover:text-blue-400 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                  <span>Frequently Asked Questions</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateToTrack()}
                  className="text-blue-300 hover:text-white font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Search className="w-3.5 h-3.5 text-blue-400" />
                  <span>Track Service Request</span>
                </button>
              </li>
              <li className="pt-1.5">
                <button
                  onClick={openAdmin}
                  className="text-blue-400 hover:text-blue-300 font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                  <span>Technician Admin Portal</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Core Services */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-sm uppercase tracking-wider">
              Popular Services
            </h4>
            <ul className="space-y-2 text-xs">
              {services.filter(s => s.status === 'published').slice(0, 6).map((s) => (
                <li key={s.id}>
                  <button
                    onClick={() => scrollToSection('services')}
                    className="hover:text-blue-400 transition-colors flex items-center gap-1.5 cursor-pointer text-left"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                    <span>{s.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Contact & Hours */}
          <div className="space-y-3.5">
            <h4 className="font-bold text-white text-sm uppercase tracking-wider">
              Contact & Coverage
            </h4>
            <div className="space-y-2.5 text-xs text-slate-300">
              <a
                href={`tel:${phone}`}
                className="flex items-center gap-2.5 hover:text-blue-400 transition-colors"
              >
                <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                <span className="font-mono">{phone}</span>
              </a>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 hover:text-emerald-400 transition-colors"
              >
                <MessageSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>WhatsApp: {settings?.whatsappNumber || phone}</span>
              </a>

              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>{email}</span>
              </div>

              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{location}</span>
              </div>

              <div className="flex items-start gap-2.5 pt-1">
                <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{hours}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom micro copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 text-center sm:text-left">
          <div>{copyright}</div>
          <div className="flex items-center gap-3">
            <span>Professional On-Site Windows Support • Peshawar</span>
            <span>•</span>
            <button
              onClick={openAdmin}
              className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-blue-300 font-medium transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>Admin Login</span>
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
