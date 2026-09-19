import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { TrackingResult } from '../../types';
import { useApp } from '../../context/AppContext';
import { ServiceProgressStepper } from './ServiceProgressStepper';
import {
  Search,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Car,
  Wrench,
  Sparkles,
  Phone,
  MessageSquare,
  MapPin,
  Laptop,
  Calendar,
  AlertCircle,
  ShieldCheck,
  Copy,
  Check,
  Printer,
  RotateCcw,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';

export const TrackRequestPage: React.FC = () => {
  const { settings, generateWhatsAppLink, navigateToHome, trackingRefQuery, setTrackingRefQuery } = useApp();

  const [query, setQuery] = useState(trackingRefQuery || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<TrackingResult | null>(null);
  const [copied, setCopied] = useState(false);

  // Auto-search if query was provided via route/prop
  useEffect(() => {
    if (trackingRefQuery) {
      setQuery(trackingRefQuery);
      performSearch(trackingRefQuery);
    }
  }, [trackingRefQuery]);

  const performSearch = async (searchStr: string) => {
    const q = searchStr.trim();
    if (!q) {
      setError('Please enter a Reference ID (e.g. PK-REQ-101) or your phone number.');
      setResult(null);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await api.trackRequest(q);
      setResult(data);
    } catch (err: any) {
      setResult(null);
      setError(
        err.message ||
          `No active service request or booking found matching "${q}". Please verify your reference number or phone number.`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(query);
  };

  const handleCopyId = (text: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleQuickSearch = (refId: string) => {
    setQuery(refId);
    if (setTrackingRefQuery) setTrackingRefQuery(refId);
    performSearch(refId);
  };

  const handleReset = () => {
    setQuery('');
    setResult(null);
    setError(null);
    if (setTrackingRefQuery) setTrackingRefQuery('');
  };

  const phone = settings?.phone || '+92 312 9876543';
  const whatsappNumber = settings?.whatsappNumber || phone;

  // Status mapping for badges & descriptions
  const getStatusConfig = (status?: string) => {
    const s = (status || '').toLowerCase();
    switch (s) {
      case 'completed':
        return {
          badge: 'Completed & Tested',
          color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
          dot: 'bg-emerald-400',
          desc: 'Service has been finalized on-site. Hardware and operating system tested and confirmed working.',
        };
      case 'in_progress':
        return {
          badge: 'In Progress / On-Site',
          color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
          dot: 'bg-indigo-400 animate-ping',
          desc: 'Technician is actively dispatched or performing diagnosis/repairs at your location in Peshawar.',
        };
      case 'confirmed':
        return {
          badge: 'Confirmed & Scheduled',
          color: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
          dot: 'bg-blue-400',
          desc: 'Appointment is locked in the schedule. Technician will arrive at the scheduled address & time.',
        };
      case 'pending':
      case 'requested':
      case 'new':
      case 'contacted':
      case 'appointment_requested':
        return {
          badge: 'Pending Review',
          color: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          dot: 'bg-amber-400',
          desc: 'Your request has been logged. Technician Safiullah is reviewing the hardware issue to prep tools.',
        };
      case 'cancelled':
        return {
          badge: 'Cancelled',
          color: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
          dot: 'bg-rose-400',
          desc: 'This service appointment has been cancelled.',
        };
      default:
        return {
          badge: status || 'Under Review',
          color: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
          dot: 'bg-blue-400',
          desc: 'Status updated by technician.',
        };
    }
  };

  const statusConfig = getStatusConfig(result?.status);

  const currentStep = typeof result?.stepIndex === 'number' ? result.stepIndex : 1;

  return (
    <div className="min-h-screen bg-[#070b12] text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-[#090e17]/90 backdrop-blur-xl border-b border-slate-800/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={navigateToHome}
              className="p-2 -ml-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
              title="Return to Main Website"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back to Home</span>
            </button>
            <div className="h-5 w-px bg-slate-800" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                <Wrench className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-sm sm:text-base text-white tracking-tight">
                  {settings?.businessName || 'Peshawar Tech Support'}
                </span>
                <span className="hidden md:inline text-xs text-blue-400 ml-2 font-mono">
                  • Request Tracker
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <a
              href={`tel:${phone}`}
              className="hidden sm:flex items-center gap-1.5 text-slate-300 hover:text-blue-400 transition"
            >
              <Phone className="w-3.5 h-3.5 text-blue-400" />
              <span className="font-mono">{phone}</span>
            </a>
            <a
              href={generateWhatsAppLink('Hello Safiullah! I need help tracking my computer service request.')}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-600/50 text-emerald-300 font-medium flex items-center gap-1.5 transition"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
        
        {/* Page Title & Hero */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-950/80 border border-blue-800/70 text-blue-300 text-xs font-semibold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            <span>Public Customer Portal • Live Tracking</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Track Service Request
          </h1>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Enter your unique <strong className="text-slate-200">Reference ID</strong> or registered phone number to check the live status of your computer troubleshooting, SSD migration, or Windows installation visit in Peshawar.
          </p>
        </div>

        {/* Search Input Box */}
        <div className="glass-panel-glow rounded-3xl p-6 sm:p-8 border border-blue-500/30 shadow-2xl bg-slate-900/60">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-5 h-5 text-blue-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Enter Reference ID (e.g. PK-REQ-101) or phone number..."
                  className="w-full pl-12 pr-10 py-3.5 rounded-2xl bg-slate-950/90 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm sm:text-base font-medium transition"
                  disabled={loading}
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery('')}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-slate-300 px-2 py-1 rounded-lg hover:bg-slate-800"
                  >
                    Clear
                  </button>
                )}
              </div>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3.5 rounded-2xl font-bold text-sm sm:text-base text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/30 transition flex items-center justify-center gap-2 cursor-pointer shrink-0 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Searching...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span>Track Request</span>
                  </>
                )}
              </button>
            </div>

            {/* Quick Demo Reference Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-400">
              <span className="text-slate-500">Quick test examples:</span>
              <button
                type="button"
                onClick={() => handleQuickSearch('PK-REQ-101')}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-blue-900/60 hover:text-blue-300 border border-slate-700 transition cursor-pointer font-mono"
              >
                PK-REQ-101 (Confirmed)
              </button>
              <button
                type="button"
                onClick={() => handleQuickSearch('PK-REQ-102')}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-blue-900/60 hover:text-blue-300 border border-slate-700 transition cursor-pointer font-mono"
              >
                PK-REQ-102 (In Progress)
              </button>
              <button
                type="button"
                onClick={() => handleQuickSearch('PK-REQ-103')}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-blue-900/60 hover:text-blue-300 border border-slate-700 transition cursor-pointer font-mono"
              >
                PK-REQ-103 (Completed)
              </button>
            </div>
          </form>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="p-5 rounded-2xl bg-rose-950/40 border border-rose-600/60 text-rose-200 text-sm space-y-3 animate-in fade-in">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-semibold text-white">Record Not Found</p>
                <p className="text-rose-300 text-xs sm:text-sm">{error}</p>
              </div>
            </div>
            <div className="pt-2 border-t border-rose-900/40 flex flex-wrap items-center gap-3 text-xs text-rose-300">
              <span>Need help finding your request?</span>
              <a
                href={generateWhatsAppLink(`Hello Safiullah! I could not find my tracking record with query: "${query}". Could you please verify my service status?`)}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-600/60 text-emerald-300 font-semibold inline-flex items-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                <span>Ask Technician on WhatsApp</span>
              </a>
            </div>
          </div>
        )}

        {/* Found Result Display */}
        {result && result.found && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
            
            {/* Status Top Reference Header */}
            <div className="glass-panel rounded-3xl p-6 sm:p-7 border border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div className="space-y-1">
                  <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                    Service Reference ID
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl sm:text-3xl font-black text-white font-mono tracking-wider">
                      {result.trackingId}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyId(result.trackingId || '')}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
                      title="Copy Reference ID"
                    >
                      {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                    {copied && (
                      <span className="text-xs text-emerald-400 font-semibold animate-pulse">
                        Copied to clipboard!
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:items-end gap-1">
                  <div className="text-xs text-slate-400 font-mono">Current Status</div>
                  <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs sm:text-sm font-bold tracking-wide ${statusConfig.color}`}>
                    <span className={`w-2 h-2 rounded-full ${statusConfig.dot}`} />
                    <span>{statusConfig.badge}</span>
                  </div>
                </div>
              </div>

              {/* Status Explanation banner */}
              <div className="p-4 rounded-2xl bg-blue-950/40 border border-blue-900/50 text-xs sm:text-sm text-blue-200 leading-relaxed flex items-start gap-3">
                <Sparkles className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block mb-0.5">{result.statusLabel || statusConfig.badge}</strong>
                  <span>{statusConfig.desc}</span>
                </div>
              </div>
            </div>

            {/* Enhanced Visual Progress Stepper Component */}
            <ServiceProgressStepper
              currentStepIndex={currentStep}
              status={result.status || ''}
              statusLabel={result.statusLabel || statusConfig.badge}
              trackingId={result.trackingId || ''}
              customerName={result.customerName || ''}
              technicianName={result.technician || 'Safiullah'}
              technicianPhone={phone}
              scheduledDate={result.preferredDate || result.date}
              scheduledTime={result.preferredTime || result.time}
              area={result.area}
              onWhatsAppClick={() => {
                const text = `Hello Safiullah! I am tracking my request ${result.trackingId} for ${result.requestedService || 'computer service'} in ${result.area || 'Peshawar'}. Could you share an update on arrival time?`;
                window.open(generateWhatsAppLink(text), '_blank');
              }}
            />

            {/* Detailed Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Card 1: Job & Customer Details */}
              <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <Laptop className="w-4 h-4 text-blue-400" />
                  <span>Job & Customer Details</span>
                </div>

                <div className="space-y-3 text-xs sm:text-sm">
                  <div className="flex justify-between py-2 border-b border-slate-800/80">
                    <span className="text-slate-400">Customer Name</span>
                    <span className="font-semibold text-white">{result.customerName || 'N/A'}</span>
                  </div>

                  <div className="flex justify-between py-2 border-b border-slate-800/80">
                    <span className="text-slate-400">Service Requested</span>
                    <span className="font-semibold text-blue-300 text-right">{result.service || 'Diagnostic'}</span>
                  </div>

                  <div className="flex justify-between py-2 border-b border-slate-800/80">
                    <span className="text-slate-400">Computer Device</span>
                    <span className="font-medium text-slate-200">{result.device || 'PC / Laptop'}</span>
                  </div>

                  <div className="flex justify-between py-2">
                    <span className="text-slate-400">Service Area</span>
                    <span className="font-semibold text-emerald-400 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{result.area || 'Peshawar'}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Card 2: Appointment & Technician Details */}
              <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-emerald-400" />
                  <span>Appointment & Dispatch</span>
                </div>

                <div className="space-y-3 text-xs sm:text-sm">
                  <div className="flex justify-between py-2 border-b border-slate-800/80">
                    <span className="text-slate-400">Scheduled Date</span>
                    <span className="font-semibold text-white font-mono">
                      {result.confirmedDate || result.scheduledDate || 'To be determined'}
                    </span>
                  </div>

                  <div className="flex justify-between py-2 border-b border-slate-800/80">
                    <span className="text-slate-400">Arrival Window</span>
                    <span className="font-semibold text-blue-300">
                      {result.confirmedTime || result.scheduledTime || 'Flexible Slot'}
                    </span>
                  </div>

                  <div className="flex justify-between py-2 border-b border-slate-800/80">
                    <span className="text-slate-400">Assigned Technician</span>
                    <span className="font-semibold text-slate-200">
                      {result.technician || 'Safiullah (BSc CS & Cybersecurity)'}
                    </span>
                  </div>

                  <div className="flex justify-between py-2">
                    <span className="text-slate-400">Direct Helpline</span>
                    <a
                      href={`tel:${result.technicianPhone || phone}`}
                      className="font-mono text-emerald-400 hover:underline font-semibold"
                    >
                      {result.technicianPhone || phone}
                    </a>
                  </div>
                </div>
              </div>

            </div>

            {/* Technician Notes Box */}
            {result.notes && (
              <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <MessageSquare className="w-3.5 h-3.5 text-blue-400" />
                  <span>Technician Note / Latest Instructions</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/60">
                  "{result.notes}"
                </p>
              </div>
            )}

            {/* Quick Action Toolbar */}
            <div className="p-6 rounded-3xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="space-y-0.5 text-left">
                <div className="font-semibold text-white text-sm">Need urgent updates or have questions?</div>
                <div className="text-xs text-slate-400">Connect directly with Safiullah with your Reference ID attached.</div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <a
                  href={generateWhatsAppLink(
                    `Salam Safiullah! I am tracking service request #${result.trackingId}.\n` +
                    `• Customer: ${result.customerName || 'Customer'}\n` +
                    `• Service: ${result.service || 'Diagnostic'}\n` +
                    `• Area: ${result.area || 'Peshawar'}\n` +
                    `Could you please provide an update on your arrival window?`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-emerald-300 bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-600/60 flex items-center justify-center gap-2 transition"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-400" />
                  <span>WhatsApp Safiullah</span>
                </a>

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 flex items-center justify-center gap-2 transition cursor-pointer"
                  title="Print or save tracking details"
                >
                  <Printer className="w-4 h-4 text-slate-400" />
                  <span>Print Record</span>
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>New Search</span>
                </button>
              </div>
            </div>

          </div>
        )}

        {/* Empty State / Tips Accordion */}
        {!result && !loading && !error && (
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <HelpCircle className="w-5 h-5 text-blue-400" />
              <h3 className="font-bold text-white text-base">
                How to Locate Your Reference ID
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs text-slate-400">
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-2">
                <div className="font-semibold text-white flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-900/60 text-blue-400 flex items-center justify-center text-[10px] font-bold">1</span>
                  <span>Confirmation Screen</span>
                </div>
                <p className="leading-relaxed">
                  Immediately after booking your on-site visit on this website, a box displaying your tracking code (e.g. <span className="text-blue-300 font-mono">PK-REQ-101</span>) was shown.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-2">
                <div className="font-semibold text-white flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-900/60 text-blue-400 flex items-center justify-center text-[10px] font-bold">2</span>
                  <span>Email Confirmation</span>
                </div>
                <p className="leading-relaxed">
                  If you provided an email address during appointment submission, your reference details and appointment schedule were automatically sent to your inbox.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-2">
                <div className="font-semibold text-white flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-900/60 text-blue-400 flex items-center justify-center text-[10px] font-bold">3</span>
                  <span>Phone Number Search</span>
                </div>
                <p className="leading-relaxed">
                  Cannot find your reference number? Simply type the exact phone or WhatsApp number used when booking to view your active appointment status.
                </p>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Page Footer */}
      <footer className="border-t border-slate-800/80 bg-[#05080e] py-8 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            © 2026 Peshawar Tech Support • Professional On-Site Computer Care
          </div>
          <div className="flex items-center gap-4 text-xs">
            <button
              onClick={navigateToHome}
              className="text-slate-400 hover:text-white transition cursor-pointer"
            >
              Main Website
            </button>
            <span>•</span>
            <a
              href={`tel:${phone}`}
              className="text-slate-400 hover:text-blue-400 transition"
            >
              Helpline: {phone}
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
