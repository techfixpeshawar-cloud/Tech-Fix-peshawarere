import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Settings,
  Phone,
  MessageSquare,
  MapPin,
  Clock,
  Save,
  CheckCircle2,
  Globe,
  DollarSign,
  KeyRound,
  Mail,
} from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const { settings, updateSettings } = useApp();

  const [businessName, setBusinessName] = useState(settings?.businessName || 'TechFix Peshawar');

  const [phone, setPhone] = useState(settings?.phone || '+92 312 9876543');
  const [whatsapp, setWhatsapp] = useState(settings?.whatsappNumber || '+92 312 9876543');
  const [whatsappDefaultMessage, setWhatsappDefaultMessage] = useState(
    settings?.whatsappDefaultMessage ||
      'Hello Safiullah! I need on-site computer support in Peshawar. My problem is: '
  );
  const [businessHours, setBusinessHours] = useState(
    settings?.businessHours || 'Monday – Saturday: 9:00 AM – 9:00 PM'
  );
  const [location, setLocation] = useState(
    settings?.location || 'Peshawar, Khyber Pakhtunkhwa, Pakistan'
  );
  const [email, setEmail] = useState(settings?.email || 'techfixpeshawar@gmail.com');

  const [diagnosticFee, setDiagnosticFee] = useState(settings?.diagnosticFee || 500);
  const [baseVisitFee, setBaseVisitFee] = useState(settings?.baseVisitFee || 300);

  const [metaTitle, setMetaTitle] = useState(
    settings?.metaTitle || 'Peshawar Tech Support • On-Site Windows & Computer Services'
  );
  const [metaDescription, setMetaDescription] = useState(
    settings?.metaDescription ||
      'Professional on-site Windows installation, computer hardware troubleshooting, and data recovery across Peshawar, KPK.'
  );

  const [resendApiKey, setResendApiKey] = useState(
    settings?.resendApiKey || 're_Buuf9PGF_AbXoKs68mLpsbNEJQx8tQW7a'
  );
  const [resendSenderEmail, setResendSenderEmail] = useState(
    settings?.resendSenderEmail || 'TechFix Peshawar <onboarding@resend.dev>'
  );

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    try {
      await updateSettings({
        businessName,
        phone,
        whatsappNumber: whatsapp,
        whatsappDefaultMessage,
        businessHours,
        location,
        email,
        diagnosticFee: Number(diagnosticFee) || 0,
        baseVisitFee: Number(baseVisitFee) || 0,
        metaTitle,
        metaDescription,
        resendApiKey: resendApiKey.trim(),
        resendSenderEmail: resendSenderEmail.trim(),
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      console.error('Failed to update business settings:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Settings className="w-6 h-6 text-blue-400" />
            <span>Business Contact & Global Settings</span>
          </h2>
          <div className="space-y-1 mt-4">
            <label className="block text-xs font-semibold text-slate-300">Website Name</label>
            <input
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            Configure phone numbers, WhatsApp routing, working hours, and SEO metadata
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-blue-600/30 cursor-pointer transition-all self-start sm:self-auto disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving...' : 'Save Configuration'}</span>
        </button>

      {success && (
        <div className="p-4 rounded-xl bg-emerald-950/70 border border-emerald-600 text-emerald-300 text-xs sm:text-sm flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Business settings updated successfully and applied site-wide!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Contact Numbers & WhatsApp */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 font-bold text-white text-base border-b border-slate-800 pb-3">
            <MessageSquare className="w-4 h-4 text-emerald-400" />
            <span>Phone & WhatsApp Routing</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-300">
                Primary Phone Number
              </label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-300">
                WhatsApp Business Number (with country code)
              </label>
              <input
                type="text"
                required
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-300">
              Default WhatsApp Pre-filled Greeting
            </label>
            <textarea
              rows={2}
              value={whatsappDefaultMessage}
              onChange={(e) => setWhatsappDefaultMessage(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-blue-500 leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-300">
                Business Hours
              </label>
              <input
                type="text"
                value={businessHours}
                onChange={(e) => setBusinessHours(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-300">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Global Base Fees */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 font-bold text-white text-base border-b border-slate-800 pb-3">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <span>Base Benchmark Fees</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-300">
                Standard On-Site Diagnostic Fee (Rs)
              </label>
              <input
                type="number"
                value={diagnosticFee}
                onChange={(e) => setDiagnosticFee(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-300">
                Base Visit Fee (Rs)
              </label>
              <input
                type="number"
                value={baseVisitFee}
                onChange={(e) => setBaseVisitFee(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* SEO & Meta */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 font-bold text-white text-base border-b border-slate-800 pb-3">
            <Globe className="w-4 h-4 text-sky-400" />
            <span>Search Engine Optimization & Meta Tags</span>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-300">
              Browser Title / Meta Title
            </label>
            <input
              type="text"
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-300">
              Meta Description
            </label>
            <textarea
              rows={2}
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs leading-relaxed focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Resend Email API Key */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 font-bold text-white text-base">
              <Mail className="w-4 h-4 text-emerald-400" />
              <span>Email Delivery & Resend API Key</span>
            </div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-emerald-950/80 text-emerald-300 border border-emerald-800/60">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Live Email Notifications
            </span>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-blue-400" />
              <span>Resend API Key</span>
            </label>
            <input
              type="text"
              value={resendApiKey}
              onChange={(e) => setResendApiKey(e.target.value)}
              placeholder="re_xxxxxxxxxxxxxxxxx"
              className="w-full font-mono px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
            />
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Active sending key configured: <code className="text-emerald-400 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">re_Buuf9PGF_AbXoKs68mLpsbNEJQx8tQW7a</code>. 
              Automated notifications are sent on new inquiries and appointment scheduling.
            </p>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-800">
            <label className="block text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-emerald-400" />
              <span>Sender Email (`From` Address)</span>
            </label>
            <input
              type="text"
              value={resendSenderEmail}
              onChange={(e) => setResendSenderEmail(e.target.value)}
              placeholder="TechFix Peshawar <onboarding@resend.dev>"
              className="w-full font-mono px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
            />
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Default: <code className="text-blue-300 bg-slate-950 px-1 py-0.5 rounded">TechFix Peshawar &lt;onboarding@resend.dev&gt;</code>.
              In Resend sandbox test mode, customer notifications are safely delivered to the verified technician email (<code className="text-emerald-400">techfixpeshawar@gmail.com</code>).
              Once you verify a custom domain at <span className="text-blue-400">resend.com/domains</span>, enter your custom address here (e.g. <code className="text-blue-300 bg-slate-950 px-1 py-0.5 rounded">TechFix &lt;support@yourdomain.com&gt;</code>) to deliver directly to customer inboxes.
            </p>
          </div>
        </div>

      </form>

    </div>
  );
};
