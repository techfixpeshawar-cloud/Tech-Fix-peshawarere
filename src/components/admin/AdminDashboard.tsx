import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';
import { DashboardStats, ServiceRequest, Booking } from '../../types';
import {
  Layers,
  Inbox,
  Calendar,
  CheckCircle2,
  Clock,
  TrendingUp,
  Plus,
  ArrowRight,
  MessageSquare,
  Phone,
  MapPin,
  RefreshCw,
  Users,
  DollarSign,
} from 'lucide-react';

interface AdminDashboardProps {
  onNavigate: (tab: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const { generateWhatsAppLink } = useApp();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentRequests, setRecentRequests] = useState<ServiceRequest[]>([]);
  const [upcomingBookings, setUpcomingBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const [s, reqs, bkgs] = await Promise.all([
        api.getStats(),
        api.getRequests(),
        api.getBookings(),
      ]);
      setStats(s);
      setRecentRequests(reqs.slice(0, 5));
      setUpcomingBookings(bkgs.filter(b => b.status === 'confirmed' || b.status === 'in_progress').slice(0, 4));
    } catch (err) {
      console.error('Failed to load dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="space-y-8">
      
      {/* Top Welcome & Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Dashboard Overview
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Live operations, pending inquiries, and service statistics in Peshawar
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            disabled={loading}
            className="px-3.5 py-2 rounded-xl glass-panel border border-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={() => onNavigate('requests')}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-blue-600/30 cursor-pointer transition-all"
          >
            <Inbox className="w-4 h-4" />
            <span>Manage Requests</span>
          </button>
        </div>
      </div>

      {/* Live Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: New Requests */}
        <div
          onClick={() => onNavigate('requests')}
          className="glass-panel p-5 rounded-2xl border border-slate-800 hover:border-blue-500/50 cursor-pointer transition-all space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">New Requests</span>
            <div className="w-9 h-9 rounded-xl bg-blue-950/80 border border-blue-800/60 flex items-center justify-center text-blue-400">
              <Inbox className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
              {stats ? stats.newRequests : '...'}
            </div>
            <div className="text-[11px] text-blue-400 font-medium flex items-center gap-1 mt-1">
              <span>Requires response</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>
        </div>

        {/* Metric 2: Confirmed Bookings */}
        <div
          onClick={() => onNavigate('bookings')}
          className="glass-panel p-5 rounded-2xl border border-slate-800 hover:border-emerald-500/50 cursor-pointer transition-all space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Confirmed Visits</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-950/80 border border-emerald-800/60 flex items-center justify-center text-emerald-400">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
              {stats ? stats.confirmedBookings : '...'}
            </div>
            <div className="text-[11px] text-emerald-400 font-medium flex items-center gap-1 mt-1">
              <span>Scheduled on-site</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>
        </div>

        {/* Metric 3: Active Services */}
        <div
          onClick={() => onNavigate('services')}
          className="glass-panel p-5 rounded-2xl border border-slate-800 hover:border-indigo-500/50 cursor-pointer transition-all space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Published Services</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-950/80 border border-indigo-800/60 flex items-center justify-center text-indigo-400">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
              {stats ? `${stats.activeServices} / ${stats.totalServices}` : '...'}
            </div>
            <div className="text-[11px] text-indigo-300 font-medium flex items-center gap-1 mt-1">
              <span>On public website</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>
        </div>

        {/* Metric 4: Completed Jobs */}
        <div
          onClick={() => onNavigate('bookings')}
          className="glass-panel p-5 rounded-2xl border border-slate-800 hover:border-teal-500/50 cursor-pointer transition-all space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Completed Jobs</span>
            <div className="w-9 h-9 rounded-xl bg-teal-950/80 border border-teal-800/60 flex items-center justify-center text-teal-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
              {stats ? stats.completedJobs : '...'}
            </div>
            <div className="text-[11px] text-teal-400 font-medium flex items-center gap-1 mt-1">
              <span>Customer paid</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>
        </div>

      </div>

      {/* Quick Actions Bar */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
        <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
          Quick Management Shortcuts
        </div>
        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={() => onNavigate('services')}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-2 cursor-pointer transition-all"
          >
            <Plus className="w-3.5 h-3.5 text-blue-400" />
            <span>Add New Service</span>
          </button>

          <button
            onClick={() => onNavigate('pricing')}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-2 cursor-pointer transition-all"
          >
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
            <span>Adjust Service Pricing</span>
          </button>

          <button
            onClick={() => onNavigate('bookings')}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-2 cursor-pointer transition-all"
          >
            <Calendar className="w-3.5 h-3.5 text-sky-400" />
            <span>Schedule Appointment</span>
          </button>

          <button
            onClick={() => onNavigate('customers')}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-2 cursor-pointer transition-all"
          >
            <Users className="w-3.5 h-3.5 text-indigo-400" />
            <span>View Customers</span>
          </button>

          <button
            onClick={() => onNavigate('homepage')}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-2 cursor-pointer transition-all"
          >
            <span>Edit Hero Headline</span>
          </button>
        </div>
      </div>

      {/* Two-Column Section: Recent Requests & Upcoming Bookings */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Recent Service Inquiries (7 cols) */}
        <div className="lg:col-span-7 glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-white text-base">
              <Inbox className="w-4 h-4 text-blue-400" />
              <span>Recent Service Requests</span>
            </div>
            <button
              onClick={() => onNavigate('requests')}
              className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {recentRequests.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-500">
                No recent requests found.
              </div>
            ) : (
              recentRequests.map((req) => (
                <div
                  key={req.id}
                  className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-700 transition-all"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{req.customerName}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        req.status === 'new' ? 'bg-blue-950 text-blue-300 border border-blue-800' :
                        req.status === 'confirmed' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                        'bg-slate-800 text-slate-300'
                      }`}>
                        {req.status}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 flex items-center gap-2">
                      <span>{req.requestedService}</span>
                      <span>•</span>
                      <span>{req.area}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 line-clamp-1">
                      {req.problemDescription}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <a
                      href={generateWhatsAppLink(
                        `Salam ${req.customerName}, this is Safiullah from Peshawar Tech Support regarding your request for ${req.requestedService}.`
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-emerald-950/70 border border-emerald-700/60 text-emerald-400 hover:bg-emerald-900 transition-colors"
                      title="Message on WhatsApp"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </a>
                    <a
                      href={`tel:${req.phone}`}
                      className="p-2 rounded-xl bg-blue-950/70 border border-blue-700/60 text-blue-400 hover:bg-blue-900 transition-colors"
                      title="Call Phone"
                    >
                      <Phone className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Confirmed Scheduled Visits (5 cols) */}
        <div className="lg:col-span-5 glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-white text-base">
              <Calendar className="w-4 h-4 text-emerald-400" />
              <span>Confirmed Visits</span>
            </div>
            <button
              onClick={() => onNavigate('bookings')}
              className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <span>Calendar</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {upcomingBookings.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-500">
                No confirmed visits scheduled currently.
              </div>
            ) : (
              upcomingBookings.map((bkg) => (
                <div
                  key={bkg.id}
                  className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">{bkg.customerName}</span>
                    <span className="text-xs font-mono font-bold text-blue-400">Rs. {bkg.price}</span>
                  </div>

                  <div className="text-xs text-slate-300 flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span>{bkg.date} at {bkg.time}</span>
                  </div>

                  <div className="text-xs text-slate-400 flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                    <span className="line-clamp-1">{bkg.addressArea}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
