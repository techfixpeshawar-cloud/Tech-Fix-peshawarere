import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Calendar,
  Send,
  CheckCircle2,
  AlertTriangle,
  Clock,
  MapPin,
  Laptop,
  Monitor,
  ShieldCheck,
  MessageSquare,
  Sparkles,
  Phone,
  Search,
} from 'lucide-react';

export const ServiceRequestForm: React.FC = () => {
  const {
    services,
    areas,
    selectedProblemForBooking,
    submitServiceRequest,
    generateWhatsAppLink,
    settings,
    navigateToTrack
  } = useApp();

  const [customerName, setCustomerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [sameAsPhone, setSameAsPhone] = useState(true);
  const [area, setArea] = useState('University Town & University Campuses');
  const [customArea, setCustomArea] = useState('');
  const [deviceType, setDeviceType] = useState<'laptop' | 'desktop' | 'all-in-one' | 'other'>('laptop');
  const [computerBrandModel, setComputerBrandModel] = useState('');
  const [operatingSystem, setOperatingSystem] = useState('Windows 11');
  const [requestedService, setRequestedService] = useState('');
  const [problemDescription, setProblemDescription] = useState('');
  const [importantData, setImportantData] = useState(true);
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('Afternoon (12:00 PM – 4:00 PM)');
  const [urgency, setUrgency] = useState<'normal' | 'high' | 'urgent'>('normal');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submittedRequest, setSubmittedRequest] = useState<any | null>(null);

  // Sync selected problem from selector
  useEffect(() => {
    const publishedServices = services.filter(s => s.status === 'published');
    if (selectedProblemForBooking) {
      setRequestedService(selectedProblemForBooking);
    } else if (publishedServices.length > 0 && !requestedService) {
      setRequestedService(publishedServices[0].name);
    }
  }, [selectedProblemForBooking, services]);

  // Set default preferred date to tomorrow
  useEffect(() => {
    const tomorrow = new Date(Date.now() + 86400000);
    setPreferredDate(tomorrow.toISOString().split('T')[0]);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!customerName.trim() || !email.trim() || !phone.trim() || !problemDescription.trim()) {
      setSubmitError('Please fill in your full name, email address, contact phone number, and computer problem description.');
      return;
    }

    try {
      setIsSubmitting(true);
      const finalArea = area === 'Other Area in Peshawar' && customArea.trim() ? customArea.trim() : area;
      const finalWhatsapp = sameAsPhone ? phone.trim() : (whatsapp.trim() || phone.trim());

      const created = await submitServiceRequest({
        customerName: customerName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        whatsapp: finalWhatsapp,
        area: finalArea,
        deviceType,
        computerBrandModel: computerBrandModel.trim() || 'Not specified',
        operatingSystem,
        requestedService: requestedService || 'Windows Support',
        problemDescription: problemDescription.trim(),
        importantData,
        preferredDate,
        preferredTime,
        urgency,
      });

      setSubmittedRequest(created);
    } catch (err: any) {
      console.error('Submission error:', err);
      setSubmitError(err.message || 'Unable to send service request. Please contact directly on WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmittedRequest(null);
    setProblemDescription('');
    setComputerBrandModel('');
  };

  return (
    <section id="book-service" className="py-20 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-block px-3.5 py-1 rounded-full bg-blue-950/80 border border-blue-800/60 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-3">
            Schedule An On-Site Visit
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Submit Service Request
          </h2>
          <p className="mt-3 text-slate-400 text-sm sm:text-base">
            Tell us what is wrong with your computer and when you would like Safiullah to visit your home or office in Peshawar.
          </p>
        </div>

        {/* Confirmation Screen */}
        {submittedRequest ? (
          <div className="glass-panel-glow rounded-3xl p-6 sm:p-10 border border-emerald-500/40 text-center space-y-6 shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-emerald-950/80 border border-emerald-500/60 flex items-center justify-center text-emerald-400 mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/60 border border-emerald-700/60 text-emerald-300 text-xs font-bold uppercase tracking-wider">
                <span>✓ REQUEST RECEIVED & LOGGED</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                TechFix Peshawar • Booking Confirmation
              </h3>
              <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
                Hello <span className="text-white font-semibold">{submittedRequest.customerName}</span>, thank you for booking with TechFix Peshawar! We have successfully received your on-site service request. Our head technician, <strong>Safiullah</strong>, has been alerted and will contact you shortly to review the issue and confirm our technician's arrival time.
              </p>
            </div>

            {/* Tracking ID Hero Box */}
            <div className="p-4 rounded-2xl bg-blue-950/50 border border-blue-600/60 text-center max-w-md mx-auto space-y-2 shadow-inner">
              <span className="text-[11px] font-bold text-blue-300 uppercase tracking-widest block">
                YOUR REFERENCE TRACKING ID
              </span>
              <span className="font-mono text-xl sm:text-2xl font-black text-white tracking-wider block">
                {submittedRequest.trackingId || submittedRequest.id}
              </span>
              {submittedRequest.email && (
                <span className="text-xs text-emerald-400 block pt-1">
                  ✓ Booking confirmation & tracking info dispatched to: <strong>{submittedRequest.email}</strong>
                </span>
              )}
              <button
                type="button"
                onClick={() => navigateToTrack(submittedRequest.trackingId || submittedRequest.id)}
                className="mt-2 w-full py-2.5 px-4 rounded-xl text-xs font-bold text-blue-200 bg-blue-900/60 hover:bg-blue-800/80 border border-blue-600/60 flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <Search className="w-3.5 h-3.5 text-blue-400" />
                <span>View on Dedicated Tracking Page</span>
              </button>
            </div>

            {/* Request Summary Table */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800 text-left max-w-md mx-auto space-y-2 text-xs sm:text-sm">
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400 font-medium">Service:</span>
                <span className="font-semibold text-white">{submittedRequest.requestedService}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400 font-medium">Device:</span>
                <span className="font-medium text-slate-200">{submittedRequest.deviceType?.toUpperCase()} ({submittedRequest.operatingSystem})</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400 font-medium">Location / Area:</span>
                <span className="font-semibold text-slate-200">{submittedRequest.area}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400 font-medium">Preferred Window:</span>
                <span className="font-medium text-slate-200">{submittedRequest.preferredDate} — {submittedRequest.preferredTime}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-400 font-medium">Data Safety Alert:</span>
                <span className={submittedRequest.importantData ? 'text-amber-400 font-bold' : 'text-slate-300'}>
                  {submittedRequest.importantData ? 'Preserve Important Files' : 'Standard'}
                </span>
              </div>
            </div>

            {/* What Happens Next Note */}
            <div className="p-3.5 rounded-xl bg-slate-900/60 border-l-4 border-blue-500 text-left max-w-md mx-auto text-xs text-slate-300 leading-relaxed">
              <strong className="text-blue-300">What happens next?</strong> Submitting this request allows our technician to prep tools & replacement parts. We will call or WhatsApp you at <strong>{submittedRequest.phone}</strong> to confirm the exact address and arrival slot before dispatching.
            </div>

            {/* Direct WhatsApp Call-to-action */}
            <div className="pt-2 space-y-3 max-w-md mx-auto">
              <a
                href={generateWhatsAppLink(
                  `Hello Safiullah! I just submitted request #${submittedRequest.trackingId || submittedRequest.id} on the website.\n` +
                  `• Name: ${submittedRequest.customerName}\n` +
                  `• Service: ${submittedRequest.requestedService}\n` +
                  `• Area: ${submittedRequest.area}\n` +
                  `• Preferred Visit: ${submittedRequest.preferredDate} (${submittedRequest.preferredTime})\n` +
                  `Please confirm arrival slot.`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-5 rounded-xl font-bold text-sm text-emerald-300 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-600/60 shadow-lg flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-5 h-5 text-emerald-400" />
                <span>💬 Chat with Technician on WhatsApp (+92 327 5226107)</span>
              </a>

              <div className="text-center text-[11px] text-slate-500">
                TechFix On-Site Computer Repair & IT Support • Peshawar, KP • Helpline: +92 327 5226107
              </div>

              <button
                onClick={handleReset}
                className="text-xs text-slate-400 hover:text-slate-200 underline pt-2 cursor-pointer block mx-auto"
              >
                Submit another request
              </button>
            </div>
          </div>
        ) : (
          /* Form Content */
          <form
            onSubmit={handleSubmit}
            className="glass-panel rounded-3xl p-6 sm:p-10 border border-slate-800/80 space-y-6"
          >
            {submitError && (
              <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-600 text-rose-300 text-xs sm:text-sm flex items-start gap-2.5">
                <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <span>{submitError}</span>
              </div>
            )}

            {/* Row 1: Name & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  Your Full Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Muhammad Hamza"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  Contact Phone Number <span className="text-rose-400">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 0333 1234567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Email Address <span className="text-rose-400">*</span>
                <span className="text-slate-400 font-normal ml-2 text-[11px]">(Required for booking confirmation email, Reference ID & arrival alerts)</span>
              </label>
              <input
                type="email"
                required
                placeholder="e.g. hamza.peshawar@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* WhatsApp Checkbox & input */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={sameAsPhone}
                  onChange={(e) => setSameAsPhone(e.target.checked)}
                  className="rounded border-slate-700 text-blue-600 focus:ring-0 w-4 h-4 bg-slate-900"
                />
                <span>WhatsApp number is the same as contact phone</span>
              </label>

              {!sameAsPhone && (
                <div className="pt-1">
                  <input
                    type="tel"
                    placeholder="Enter WhatsApp number (e.g. 0300 9876543)"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
              )}
            </div>

            {/* Row 2: Peshawar Area */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Area in Peshawar <span className="text-rose-400">*</span>
              </label>
              <select
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white text-sm focus:outline-none focus:border-blue-500"
              >
                {areas.map((a) => (
                  <option key={a.id} value={a.name}>
                    {a.name} (Travel fee: Rs. {a.travelFee})
                  </option>
                ))}
                <option value="Other Area in Peshawar">Other Neighborhood in Peshawar...</option>
              </select>

              {area === 'Other Area in Peshawar' && (
                <input
                  type="text"
                  placeholder="Specify your street / sector / colony in Peshawar"
                  value={customArea}
                  onChange={(e) => setCustomArea(e.target.value)}
                  className="w-full mt-2 px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500"
                />
              )}
            </div>

            {/* Row 3: Device Type & Model */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  Device Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'laptop', label: 'Laptop', icon: Laptop },
                    { id: 'desktop', label: 'Desktop Tower', icon: Monitor },
                    { id: 'all-in-one', label: 'All-In-One', icon: Monitor },
                    { id: 'other', label: 'Multiple / Lab', icon: Sparkles },
                  ].map((dev) => (
                    <button
                      type="button"
                      key={dev.id}
                      onClick={() => setDeviceType(dev.id as any)}
                      className={`py-2 px-3 rounded-xl border text-xs font-medium flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        deviceType === dev.id
                          ? 'bg-blue-600/30 border-blue-500 text-white'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <dev.icon className="w-3.5 h-3.5" />
                      <span>{dev.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  Computer Brand & Model
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dell Inspiron 15, HP G3 Tower, Lenovo T480"
                  value={computerBrandModel}
                  onChange={(e) => setComputerBrandModel(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Row 4: Requested Service & OS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  Service Needed
                </label>
                <select
                  value={requestedService}
                  onChange={(e) => setRequestedService(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white text-sm focus:outline-none focus:border-blue-500"
                >
                  {services.filter(s => s.status === 'published').map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.name} (from Rs. {s.startingPrice})
                    </option>
                  ))}
                  <option value="General Troubleshooting / Other">General Troubleshooting / Other</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  Current Operating System
                </label>
                <select
                  value={operatingSystem}
                  onChange={(e) => setOperatingSystem(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white text-sm focus:outline-none focus:border-blue-500"
                >
                  <option value="Windows 11">Windows 11</option>
                  <option value="Windows 10">Windows 10</option>
                  <option value="Windows 7 / 8">Windows 7 / 8</option>
                  <option value="Not sure / Won't boot">Not sure / Computer won't boot</option>
                </select>
              </div>
            </div>

            {/* Problem Description */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Detailed Problem Description <span className="text-rose-400">*</span>
              </label>
              <textarea
                required
                rows={3}
                placeholder="What exactly is happening? (e.g. Blue screen error code, slow startup, deleted photos from D: drive, needs fresh Windows after update crash...)"
                value={problemDescription}
                onChange={(e) => setProblemDescription(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 leading-relaxed"
              />
            </div>

            {/* Important Data Notice Toggle */}
            <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-800/50">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={importantData}
                  onChange={(e) => setImportantData(e.target.checked)}
                  className="mt-0.5 rounded border-amber-600 text-amber-500 focus:ring-0 w-4 h-4 bg-slate-900 shrink-0"
                />
                <div className="text-xs text-amber-200">
                  <span className="font-bold">I have important files on this computer that must be preserved.</span>
                  <div className="text-amber-300/80 mt-0.5">
                    We will take special care to back up or isolate your documents, project files, and photos before making system modifications.
                  </div>
                </div>
              </label>
            </div>

            {/* Date, Time Slot & Urgency */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  Preferred Visit Date
                </label>
                <input
                  type="date"
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  Preferred Time Slot
                </label>
                <select
                  value={preferredTime}
                  onChange={(e) => setPreferredTime(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white text-xs focus:outline-none focus:border-blue-500"
                >
                  <option value="Morning (9:00 AM – 12:00 PM)">Morning (9:00 AM – 12:00 PM)</option>
                  <option value="Afternoon (12:00 PM – 4:00 PM)">Afternoon (12:00 PM – 4:00 PM)</option>
                  <option value="Evening (4:00 PM – 8:00 PM)">Evening (4:00 PM – 8:00 PM)</option>
                  <option value="Flexible / Anytime Today">Flexible / Anytime Today</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  Urgency Level
                </label>
                <select
                  value={urgency}
                  onChange={(e) => setUrgency(e.target.value as any)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white text-xs focus:outline-none focus:border-blue-500"
                >
                  <option value="normal">Normal (Within 24–48 hours)</option>
                  <option value="high">High (Need it today)</option>
                  <option value="urgent">Urgent (Immediate emergency)</option>
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-slate-800">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-6 rounded-2xl font-bold text-base text-white bg-blue-600 hover:bg-blue-500 shadow-xl shadow-blue-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Transmitting Request...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 text-blue-200" />
                    <span>Submit Service Request</span>
                  </>
                )}
              </button>

              <div className="mt-3 flex items-center justify-center gap-2 text-[11px] text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>No upfront advance payment. You test the computer and pay on-site when satisfied.</span>
              </div>
            </div>

          </form>
        )}

      </div>
    </section>
  );
};
