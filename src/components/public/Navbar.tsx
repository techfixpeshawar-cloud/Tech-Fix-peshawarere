import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Wrench,
  Phone,
  MessageSquare,
  Calendar,
  Menu,
  X,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Search,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { settings, generateWhatsAppLink, setIsAdminRoute, isAuthenticated, navigateToTrack } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const phone = settings?.phone || '+92 312 9876543';
  const whatsappUrl = generateWhatsAppLink('Hello Safiullah! I need on-site computer support in Peshawar.');

  const openAdmin = () => {
    setMobileMenuOpen(false);
    setIsAdminRoute(true);
    window.location.hash = '#admin';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-slate-800/80">
      {/* Top micro-bar: Location & Quick On-Site Notice */}
      <div className="bg-blue-950/40 border-b border-blue-900/30 text-xs py-1.5 px-4 text-slate-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-medium text-slate-200">On-Site Windows & PC Support in Peshawar</span>
            <span className="hidden sm:inline text-slate-400">• We Come To Your Home or Office</span>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <a
              href={`tel:${phone}`}
              className="flex items-center gap-1.5 hover:text-blue-400 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-blue-400" />
              <span className="font-mono">{phone}</span>
            </a>

            <span className="text-slate-600">|</span>

            <button
              onClick={openAdmin}
              className="flex items-center gap-1.5 text-slate-400 hover:text-blue-400 transition-colors cursor-pointer font-medium"
              title="Open Technician Admin Portal"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>{isAuthenticated ? 'Admin Dashboard' : 'Admin Panel'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Nav Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Brand Logo */}
          <button
            onClick={() => scrollToSection('hero')}
            className="flex items-center gap-3 text-left group focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-lg text-white tracking-tight flex items-center gap-1.5">
                {settings?.businessName || 'Peshawar Tech Support'}
              </div>
              <div className="text-xs text-blue-400 font-medium tracking-wide flex items-center gap-1">
                <span>On-Site Computer Service</span>
                <span className="text-slate-600">•</span>
                <span className="text-slate-400">Peshawar, KPK</span>
              </div>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              onClick={() => scrollToSection('services')}
              className="px-3 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-colors"
            >
              Services
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="px-3 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-colors"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection('why-on-site')}
              className="px-3 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-colors"
            >
              Why On-Site?
            </button>
            <button
              onClick={() => scrollToSection('who-we-serve')}
              className="px-3 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-colors"
            >
              Who We Serve
            </button>
            <button
              onClick={() => scrollToSection('bulk-deployment')}
              className="px-3 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-colors"
            >
              Bulk PCs
            </button>
            <button
              onClick={() => scrollToSection('technician')}
              className="px-3 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-colors"
            >
              Technician
            </button>
            <button
              onClick={() => scrollToSection('faq')}
              className="px-3 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-colors cursor-pointer"
            >
              FAQ
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                navigateToTrack();
              }}
              className="px-3 py-2 text-sm font-semibold text-blue-300 hover:text-white bg-blue-950/50 hover:bg-blue-900/60 border border-blue-800/50 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
              title="Track Service Request by Reference ID"
            >
              <Search className="w-3.5 h-3.5 text-blue-400" />
              <span>Track Request</span>
            </button>
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-2.5">
            <button
              onClick={openAdmin}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-slate-300 hover:text-white bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 rounded-xl transition-all shadow-sm cursor-pointer"
              title="Open Technician Administration Panel"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>Admin Panel</span>
            </button>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-semibold text-emerald-300 bg-emerald-950/50 hover:bg-emerald-900/60 border border-emerald-700/50 rounded-xl transition-all shadow-sm"
            >
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              <span>WhatsApp</span>
            </a>
            <button
              onClick={() => scrollToSection('book-service')}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-all shadow-lg shadow-blue-600/30 hover:shadow-blue-500/50 cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Service</span>
            </button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex lg:hidden items-center gap-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="sm:hidden p-2 rounded-lg bg-emerald-950/60 border border-emerald-700/50 text-emerald-400"
              aria-label="WhatsApp"
            >
              <MessageSquare className="w-4 h-4" />
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-slate-800/80 text-slate-300 hover:text-white border border-slate-700/60 focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800/90 bg-[#090e17]/95 backdrop-blur-xl px-4 pt-3 pb-6 space-y-2">
          <button
            onClick={() => scrollToSection('services')}
            className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-800/60"
          >
            Services & Pricing
          </button>
          <button
            onClick={() => scrollToSection('how-it-works')}
            className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-800/60"
          >
            How It Works (Customer Journey)
          </button>
          <button
            onClick={() => scrollToSection('why-on-site')}
            className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-800/60"
          >
            Why On-Site? (Zero Hassle)
          </button>
          <button
            onClick={() => scrollToSection('who-we-serve')}
            className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-800/60"
          >
            Who We Serve (Students, Homes, Offices)
          </button>
          <button
            onClick={() => scrollToSection('bulk-deployment')}
            className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-800/60"
          >
            Bulk Windows for Labs & Offices
          </button>
          <button
            onClick={() => scrollToSection('technician')}
            className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-800/60"
          >
            Meet Your Technician (Safiullah)
          </button>
          <button
            onClick={() => scrollToSection('faq')}
            className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-800/60"
          >
            Frequently Asked Questions
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              navigateToTrack();
            }}
            className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-semibold text-blue-300 bg-blue-950/40 border border-blue-800/50 hover:bg-blue-900/60 flex items-center gap-2 cursor-pointer"
          >
            <Search className="w-4 h-4 text-blue-400" />
            <span>Track Request Status</span>
          </button>

          <div className="pt-3 flex flex-col gap-2 border-t border-slate-800">
            <button
              onClick={() => scrollToSection('book-service')}
              className="w-full py-3 px-4 rounded-xl text-center font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-md flex items-center justify-center gap-2 cursor-pointer text-sm"
            >
              <Calendar className="w-4 h-4" />
              Book An On-Site Appointment
            </button>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-xl text-center font-semibold text-emerald-300 bg-emerald-950/60 border border-emerald-700/60 hover:bg-emerald-900/60 flex items-center justify-center gap-2 text-sm"
            >
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              Chat on WhatsApp Directly
            </a>
            <button
              onClick={openAdmin}
              className="w-full py-2.5 px-4 rounded-xl text-center text-sm font-semibold text-slate-300 bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              <span>Technician Admin Portal {isAuthenticated ? '(Active)' : '(Login)'}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
