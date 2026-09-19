import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AdminDashboard } from './AdminDashboard';
import { AdminRequests } from './AdminRequests';
import { AdminBookings } from './AdminBookings';
import { AdminServices } from './AdminServices';
import { AdminPricing } from './AdminPricing';
import { AdminCustomers } from './AdminCustomers';
import { AdminContent } from './AdminContent';
import { AdminTechnician } from './AdminTechnician';
import { AdminFAQ } from './AdminFAQ';
import { AdminAreas } from './AdminAreas';
import { AdminCases } from './AdminCases';
import { AdminUnpublished } from './AdminUnpublished';
import { AdminMedia } from './AdminMedia';
import { AdminSettings } from './AdminSettings';
import { AdminAccount } from './AdminAccount';
import {
  LayoutDashboard,
  Inbox,
  Calendar,
  Layers,
  DollarSign,
  Users,
  Layout,
  User,
  HelpCircle,
  MapPin,
  FileText,
  XCircle,
  Image as ImageIcon,
  Settings as SettingsIcon,
  ShieldCheck,
  Globe,
  LogOut,
  Menu,
  X,
  Database,
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { adminUser, logoutAdmin, setIsAdminRoute, services, faq, faqs, cases } = useApp();
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const allFaqs = faq || faqs || [];
  const unpublishedCount =
    (services?.filter(
      s =>
        s.status === 'draft' ||
        s.status === 'unpublished' ||
        s.status === 'archived' ||
        (s as any).published === false ||
        (s as any).isPublished === false
    )?.length || 0) +
    (allFaqs.filter(
      f =>
        f.published === false ||
        (f as any).isPublished === false ||
        (f as any).status === 'draft' ||
        (f as any).status === 'unpublished'
    )?.length || 0) +
    (cases?.filter(
      c =>
        c.published === false ||
        (c as any).isPublished === false ||
        (c as any).status === 'draft' ||
        (c as any).status === 'unpublished'
    )?.length || 0);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'requests', label: 'Leads / Inquiries', icon: Inbox },
    { id: 'bookings', label: 'Appointments / Bookings', icon: Calendar },
    { id: 'services', label: 'Services Catalog', icon: Layers },
    { id: 'pricing', label: 'Pricing & Durations', icon: DollarSign },
    { id: 'customers', label: 'Customer Directory', icon: Users },
    { id: 'homepage', label: 'Homepage CMS', icon: Layout },
    { id: 'technician', label: 'Technician Profile', icon: User },
    { id: 'faq', label: 'FAQ Manager', icon: HelpCircle },
    { id: 'areas', label: 'Coverage Areas', icon: MapPin },
    { id: 'cases', label: 'Service Cases', icon: FileText },
    { id: 'unpublished', label: 'Drafts / Unpublished', icon: XCircle },
    { id: 'media', label: 'Media Library', icon: ImageIcon },
    { id: 'settings', label: 'Business & SEO', icon: SettingsIcon },
    { id: 'account', label: 'Admin Security', icon: ShieldCheck },
  ];

  const handleReturnToPublic = () => {
    setIsAdminRoute(false);
    window.location.hash = '#';
  };

  return (
    <div className="min-h-screen bg-[#060910] text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white">
      
      {/* Top Admin Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#080d17]/95 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Mobile menu toggle button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 font-bold">
              PTS
            </div>
            <div>
              <div className="font-bold text-white text-sm tracking-tight flex items-center gap-2">
                <span>Peshawar Tech Support</span>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-950 text-blue-300 border border-blue-800">
                  ADMIN
                </span>
              </div>
              <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>Database Synced</span>
              </div>
            </div>
          </div>
        </div>

        {/* Top Right Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleReturnToPublic}
            className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden sm:inline">View Public Website</span>
            <span className="sm:hidden">Website</span>
          </button>

          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="text-slate-300 font-medium">Safiullah</span>
          </div>

          <button
            onClick={logoutAdmin}
            className="p-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-900/60 text-rose-300 hover:text-rose-200 transition-colors cursor-pointer"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Sidebar (Desktop) */}
        <aside className="hidden lg:flex w-64 flex-col justify-between bg-[#080d17] border-r border-slate-800/80 p-4 space-y-4 shrink-0 overflow-y-auto">
          <div className="space-y-1">
            <div className="px-3 py-2 text-[10px] font-mono text-slate-500 uppercase tracking-wider">
              Management Modules
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-3 transition-all cursor-pointer text-left ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900/90'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span className="flex-1 truncate">{item.label}</span>
                  {item.id === 'unpublished' && unpublishedCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      {unpublishedCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Database Info footer */}
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1.5 text-[11px] text-slate-400">
            <div className="flex items-center gap-1.5 font-bold text-slate-200">
              <Database className="w-3.5 h-3.5 text-blue-400" />
              <span>Full-Stack Storage</span>
            </div>
            <p className="text-[10px] text-slate-400 leading-tight">
              One source of truth: edits update the public website and booking form immediately.
            </p>
          </div>
        </aside>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex flex-col p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="font-bold text-white text-base">Admin Navigation</span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full px-4 py-3 rounded-xl text-xs font-semibold flex items-center gap-3 ${
                      isActive ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-900'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="flex-1 truncate">{item.label}</span>
                    {item.id === 'unpublished' && unpublishedCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                        {unpublishedCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Main Admin Working Area */}
        <main className="flex-1 p-4 sm:p-8 lg:p-10 overflow-y-auto max-w-7xl">
          {activeTab === 'dashboard' && <AdminDashboard onNavigate={(t) => setActiveTab(t)} />}
          {activeTab === 'requests' && <AdminRequests />}
          {activeTab === 'bookings' && <AdminBookings />}
          {activeTab === 'services' && <AdminServices />}
          {activeTab === 'pricing' && <AdminPricing />}
          {activeTab === 'customers' && <AdminCustomers />}
          {activeTab === 'homepage' && <AdminContent />}
          {activeTab === 'technician' && <AdminTechnician />}
          {activeTab === 'faq' && <AdminFAQ />}
          {activeTab === 'areas' && <AdminAreas />}
          {activeTab === 'cases' && <AdminCases />}
          {activeTab === 'unpublished' && <AdminUnpublished onNavigate={(t) => setActiveTab(t)} />}
          {activeTab === 'media' && <AdminMedia />}
          {activeTab === 'settings' && <AdminSettings />}
          {activeTab === 'account' && <AdminAccount />}
        </main>

      </div>

    </div>
  );
};
