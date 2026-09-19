import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';
import { ServiceRequest } from '../../types';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';
import {
  Inbox,
  Search,
  Filter,
  MessageSquare,
  Phone,
  Calendar,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertTriangle,
  Clock,
  MapPin,
  Laptop,
  Check,
  RefreshCw,
  Mail,
  Send,
  Hash,
  ExternalLink,
  CalendarCheck
} from 'lucide-react';

export const AdminRequests: React.FC = () => {
  const { generateWhatsAppLink } = useApp();
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [internalNotes, setInternalNotes] = useState('');
  const [savingNote, setSavingNote] = useState(false);

  // Date & Time confirmation state
  const [confirmedDate, setConfirmedDate] = useState('');
  const [confirmedTime, setConfirmedTime] = useState('11:00 AM');
  const [savingSchedule, setSavingSchedule] = useState(false);
  const [scheduleFeedback, setScheduleFeedback] = useState<string | null>(null);

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Email resend state
  const [resendingEmail, setResendingEmail] = useState(false);
  const [emailFeedback, setEmailFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Edit Request Modal state
  const [isEditingModal, setIsEditingModal] = useState(false);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editWhatsapp, setEditWhatsapp] = useState('');
  const [editArea, setEditArea] = useState('');
  const [editService, setEditService] = useState('');
  const [editDeviceType, setEditDeviceType] = useState<'laptop' | 'desktop' | 'all-in-one' | 'other'>('laptop');
  const [editOS, setEditOS] = useState('Windows 11');
  const [editProblem, setEditProblem] = useState('');
  const [editUrgency, setEditUrgency] = useState<'normal' | 'high' | 'urgent'>('normal');
  const [savingEdit, setSavingEdit] = useState(false);

  const loadRequests = async () => {
    try {
      setLoading(true);
      const data = await api.getRequests();
      setRequests(data);
    } catch (err) {
      console.error('Failed to load requests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleSelectRequest = (req: ServiceRequest) => {
    setSelectedRequest(req);
    setInternalNotes(req.adminNotes || '');
    setConfirmedDate(req.preferredDate || new Date().toISOString().split('T')[0]);
    setConfirmedTime(req.preferredTime || '03:30 PM');
    setEmailFeedback(null);
    setScheduleFeedback(null);
  };

  const openEditModal = (req: ServiceRequest) => {
    handleSelectRequest(req);
    setEditName(req.customerName || '');
    setEditEmail(req.email || '');
    setEditPhone(req.phone || '');
    setEditWhatsapp(req.whatsapp || req.phone || '');
    setEditArea(req.area || '');
    setEditService(req.requestedService || '');
    setEditDeviceType(req.deviceType || 'laptop');
    setEditOS(req.operatingSystem || 'Windows 11');
    setEditProblem(req.problemDescription || '');
    setEditUrgency(req.urgency || 'normal');
    setIsEditingModal(true);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRequest) return;
    try {
      setSavingEdit(true);
      const updated = await api.updateRequest(selectedRequest.id, {
        customerName: editName.trim(),
        email: editEmail.trim(),
        phone: editPhone.trim(),
        whatsapp: editWhatsapp.trim(),
        area: editArea.trim(),
        requestedService: editService.trim(),
        deviceType: editDeviceType,
        operatingSystem: editOS,
        problemDescription: editProblem.trim(),
        urgency: editUrgency,
      });

      setRequests(requests.map(r => r.id === selectedRequest.id ? updated : r));
      setSelectedRequest(updated);
      setIsEditingModal(false);
    } catch (err: any) {
      console.error('Failed to update request:', err);
      alert('Failed to update request: ' + err.message);
    } finally {
      setSavingEdit(false);
    }
  };

  const handleStatusChange = async (reqId: string, newStatus: any) => {
    try {
      const updated = await api.updateRequest(reqId, { status: newStatus });
      setRequests(requests.map(r => r.id === reqId ? updated : r));
      if (selectedRequest?.id === reqId) {
        setSelectedRequest(updated);
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handleSaveConfirmedTime = async () => {
    if (!selectedRequest) return;
    try {
      setSavingSchedule(true);
      const updated = await api.updateRequest(selectedRequest.id, {
        preferredDate: confirmedDate,
        preferredTime: confirmedTime,
        status: 'confirmed',
      });
      setRequests(requests.map(r => r.id === selectedRequest.id ? updated : r));
      setSelectedRequest(updated);
      setScheduleFeedback('Visit schedule confirmed in database!');
      setTimeout(() => setScheduleFeedback(null), 4000);
    } catch (err: any) {
      setScheduleFeedback('Error saving schedule: ' + err.message);
    } finally {
      setSavingSchedule(false);
    }
  };

  const handleSendWhatsAppConfirmation = () => {
    if (!selectedRequest) return;
    const phone = selectedRequest.whatsapp || selectedRequest.phone;
    const cleanPhone = phone.replace(/\D/g, '');
    const dateStr = confirmedDate || selectedRequest.preferredDate || 'Upcoming Date';
    const timeStr = confirmedTime || selectedRequest.preferredTime || 'Agreed Time';
    const tracking = selectedRequest.trackingId || selectedRequest.id;

    const message =
      `Salam ${selectedRequest.customerName}! 🔧 Peshawar Tech Support\n\n` +
      `Your on-site computer support visit has been CONFIRMED by technician Safiullah.\n\n` +
      `📅 Confirmed Date: ${dateStr}\n` +
      `⏰ Arrival Time: ${timeStr}\n` +
      `📍 Location: ${selectedRequest.area || 'Peshawar'}\n` +
      `💻 Service: ${selectedRequest.requestedService}\n` +
      `🔖 Tracking ID: ${tracking}\n\n` +
      `I will bring genuine tools, bootable drives, and hardware accessories right to your door. Please let me know if you need to adjust this timing!`;

    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const handleSendEmailConfirmation = async () => {
    if (!selectedRequest) return;
    if (!selectedRequest.email) {
      setEmailFeedback({ type: 'error', message: 'This customer does not have an email address recorded.' });
      return;
    }
    try {
      setResendingEmail(true);
      // Save the confirmed date/time first
      const updated = await api.updateRequest(selectedRequest.id, {
        preferredDate: confirmedDate,
        preferredTime: confirmedTime,
        status: 'confirmed',
      });
      setRequests(requests.map(r => r.id === selectedRequest.id ? updated : r));
      setSelectedRequest(updated);

      // Now trigger resend email
      const result = await api.resendRequestEmail(selectedRequest.id);
      setEmailFeedback({ type: 'success', message: result.message || `Confirmation email sent to ${selectedRequest.email}!` });
    } catch (err: any) {
      setEmailFeedback({ type: 'error', message: err.message || 'Failed to dispatch email' });
    } finally {
      setResendingEmail(false);
    }
  };

  const handleCreateBookingFromRequest = async () => {
    if (!selectedRequest) return;
    try {
      setSavingSchedule(true);
      const booking = await api.createBooking({
        requestId: selectedRequest.id,
        trackingId: selectedRequest.trackingId,
        customerName: selectedRequest.customerName,
        phone: selectedRequest.phone,
        whatsapp: selectedRequest.whatsapp || selectedRequest.phone,
        email: selectedRequest.email || '',
        service: selectedRequest.requestedService,
        device: `${selectedRequest.deviceType} (${selectedRequest.operatingSystem || 'Windows'})`,
        date: confirmedDate || selectedRequest.preferredDate || new Date().toISOString().split('T')[0],
        time: confirmedTime || selectedRequest.preferredTime || '11:00 AM',
        addressArea: selectedRequest.address || selectedRequest.area,
        status: 'confirmed',
        technician: 'Safiullah',
        notes: `Converted from Service Request ${selectedRequest.trackingId || selectedRequest.id}. ${selectedRequest.problemDescription}`,
        price: 2000,
        paymentStatus: 'pending'
      });

      // Update request status to confirmed
      const updatedReq = await api.updateRequest(selectedRequest.id, { status: 'confirmed' });
      setRequests(requests.map(r => r.id === selectedRequest.id ? updatedReq : r));
      setSelectedRequest(updatedReq);

      setScheduleFeedback(`Booking #${booking.trackingId || booking.id} created & confirmed on calendar!`);
      setTimeout(() => setScheduleFeedback(null), 5000);
    } catch (err: any) {
      setScheduleFeedback('Failed to create booking: ' + err.message);
    } finally {
      setSavingSchedule(false);
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedRequest) return;
    try {
      setSavingNote(true);
      const updated = await api.updateRequest(selectedRequest.id, { adminNotes: internalNotes });
      setRequests(requests.map(r => r.id === selectedRequest.id ? updated : r));
      setSelectedRequest(updated);
    } catch (err) {
      console.error('Failed to save notes:', err);
    } finally {
      setSavingNote(false);
    }
  };

  const handleDeleteConfirmed = async () => {
    if (!deleteTarget) return;
    try {
      setIsDeleting(true);
      await api.deleteRequest(deleteTarget.id);
      setRequests(prev => prev.filter(r => r.id !== deleteTarget.id));
      if (selectedRequest?.id === deleteTarget.id) {
        setSelectedRequest(null);
      }
      setDeleteTarget(null);
    } catch (err: any) {
      console.error('Failed to delete request:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredRequests = requests.filter((r) => {
    const matchesStatus = filterStatus === 'all' || r.status === filterStatus;
    const matchesSearch =
      r.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.phone.includes(searchTerm) ||
      (r.email && r.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (r.trackingId && r.trackingId.toLowerCase().includes(searchTerm.toLowerCase())) ||
      r.area.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.requestedService.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Inbox className="w-6 h-6 text-blue-400" />
            <span>Service Inquiries & Requests</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Incoming customer submissions from the website with automated email dispatch and instant WhatsApp alerts
          </p>
        </div>

        <button
          onClick={loadRequests}
          disabled={loading}
          className="px-3.5 py-2 rounded-xl glass-panel border border-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh List</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by customer name, phone, email, Tracking ID, or Peshawar area..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {['all', 'new', 'contacted', 'confirmed', 'in_progress', 'completed', 'cancelled'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize whitespace-nowrap transition-all cursor-pointer ${
                filterStatus === st
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {st === 'all' ? 'All' : st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Requests List and Detail Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Request Cards (7 cols or full) */}
        <div className={`${selectedRequest ? 'lg:col-span-7' : 'lg:col-span-12'} space-y-3`}>
          {filteredRequests.length === 0 ? (
            <div className="glass-panel p-12 rounded-3xl border border-slate-800 text-center text-slate-400 space-y-2">
              <Inbox className="w-8 h-8 mx-auto text-slate-600" />
              <div className="font-bold text-white text-sm">No requests found</div>
              <div className="text-xs">No service requests match your search or filter.</div>
            </div>
          ) : (
            filteredRequests.map((req) => {
              const isSelected = selectedRequest?.id === req.id;
              return (
                <div
                  key={req.id}
                  onClick={() => {
                    setSelectedRequest(req);
                    setInternalNotes(req.notes || '');
                    setEmailFeedback(null);
                  }}
                  className={`glass-panel p-5 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                    isSelected
                      ? 'border-blue-500 bg-blue-950/20'
                      : 'border-slate-800/90 hover:border-slate-700'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-white text-sm">{req.customerName}</span>
                      
                      {/* Tracking ID Badge */}
                      <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-blue-950 text-blue-300 border border-blue-800">
                        {req.trackingId || req.id}
                      </span>

                      <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider ${
                        req.status === 'new' ? 'bg-blue-950 text-blue-300 border border-blue-800' :
                        req.status === 'contacted' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                        req.status === 'confirmed' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                        req.status === 'completed' ? 'bg-teal-950 text-teal-300 border border-teal-800' :
                        'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}>
                        {req.status.replace('_', ' ')}
                      </span>

                      {/* Email Status Indicator */}
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold flex items-center gap-1 ${
                        req.emailSent
                          ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-700/60'
                          : req.email
                          ? 'bg-amber-950/80 text-amber-300 border border-amber-700/60'
                          : 'bg-slate-900 text-slate-500 border border-slate-800'
                      }`}>
                        <Mail className="w-3 h-3" />
                        <span>{req.emailSent ? 'Email Sent' : req.email ? 'Pending' : 'No Email'}</span>
                      </span>

                      {req.urgency === 'urgent' && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-rose-950 text-rose-300 border border-rose-800">
                          URGENT
                        </span>
                      )}
                    </div>

                    <div className="text-[11px] text-slate-400 font-mono">
                      {req.preferredDate} ({req.preferredTime})
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                    <div className="flex items-center gap-1.5 text-blue-400 font-semibold">
                      <Laptop className="w-3.5 h-3.5 shrink-0" />
                      <span>{req.requestedService}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-500" />
                      <span>{req.area}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80">
                    "{req.problemDescription}"
                  </p>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-800/60 text-xs">
                    <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                      <span className="font-mono">{req.phone}</span>
                      {req.email && <span>• {req.email}</span>}
                    </div>

                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => openEditModal(req)}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
                        title="Edit Request Details"
                      >
                        <Edit2 className="w-3 h-3 text-blue-400" />
                        <span>Edit</span>
                      </button>

                      <a
                        href={generateWhatsAppLink(
                          `Salam ${req.customerName}, this is Safiullah from TechFix Peshawar regarding your request #${req.trackingId || req.id} for ${req.requestedService} in ${req.area}.`
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 rounded-lg bg-emerald-950/80 border border-emerald-700/60 text-emerald-300 hover:bg-emerald-900 text-[11px] font-semibold flex items-center gap-1"
                      >
                        <MessageSquare className="w-3 h-3 text-emerald-400" />
                        <span>WhatsApp</span>
                      </a>

                      <a
                        href={`tel:${req.phone}`}
                        className="px-2.5 py-1 rounded-lg bg-blue-950/80 border border-blue-700/60 text-blue-300 hover:bg-blue-900 text-[11px] font-semibold flex items-center gap-1"
                      >
                        <Phone className="w-3 h-3 text-blue-400" />
                        <span>Call</span>
                      </a>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Active Request Full Inspector (5 cols) */}
        {selectedRequest && (
          <div className="lg:col-span-5 glass-panel p-6 rounded-3xl border border-blue-500/40 space-y-5 sticky top-24 self-start">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-mono text-slate-500 uppercase">Request Details</span>
                <h3 className="font-bold text-white text-lg">{selectedRequest.customerName}</h3>
                <span className="font-mono text-xs text-blue-400 font-bold block">
                  Ref: {selectedRequest.trackingId || selectedRequest.id}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEditModal(selectedRequest)}
                  className="px-2.5 py-1 rounded-lg bg-blue-950/60 border border-blue-700/60 text-blue-300 text-xs font-semibold hover:bg-blue-900 flex items-center gap-1 cursor-pointer"
                >
                  <Edit2 className="w-3 h-3" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  Close
                </button>
              </div>
            </div>

            {/* Technician Visit Confirmation & Dispatch (WhatsApp & Email) */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-blue-950/40 via-slate-900 to-slate-900 border border-blue-500/30 space-y-3 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-400" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Technician Visit Time
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  {selectedRequest.preferredDate ? `${selectedRequest.preferredDate} @ ${selectedRequest.preferredTime}` : 'Not set'}
                </span>
              </div>

              <p className="text-[11px] text-slate-300 leading-snug">
                When coordinating with the customer on WhatsApp, set the confirmed arrival date & time below and dispatch confirmation:
              </p>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 mb-1">
                    Confirmed Date
                  </label>
                  <input
                    type="date"
                    value={confirmedDate}
                    onChange={(e) => setConfirmedDate(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 mb-1">
                    Confirmed Time
                  </label>
                  <input
                    type="text"
                    value={confirmedTime}
                    placeholder="e.g. 03:30 PM"
                    onChange={(e) => setConfirmedTime(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
              </div>

              {/* Quick Preset Time Pickers */}
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {['10:00 AM', '11:30 AM', '02:30 PM', '04:00 PM', '05:30 PM', '07:00 PM'].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setConfirmedTime(t)}
                    className={`px-2 py-1 rounded-lg text-[10px] font-mono font-semibold transition-all cursor-pointer ${
                      confirmedTime === t
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  onClick={handleSaveConfirmedTime}
                  disabled={savingSchedule}
                  className="w-full py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md shadow-blue-600/20 disabled:opacity-50"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{savingSchedule ? 'Saving...' : 'Save Confirmed Time & Status'}</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={handleSendWhatsAppConfirmation}
                    className="py-2 px-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-md shadow-emerald-600/20 active:scale-95"
                    title="Open WhatsApp with pre-composed confirmation"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Send WhatsApp</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSendEmailConfirmation}
                    disabled={resendingEmail}
                    className="py-2 px-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-md shadow-indigo-600/20 disabled:opacity-50 active:scale-95"
                    title="Send confirmed date & time email to customer"
                  >
                    <Mail className={`w-3.5 h-3.5 ${resendingEmail ? 'animate-spin' : ''}`} />
                    <span>{resendingEmail ? 'Sending...' : 'Send Email'}</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleCreateBookingFromRequest}
                  disabled={savingSchedule}
                  className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-emerald-400 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                >
                  <CalendarCheck className="w-3.5 h-3.5" />
                  <span>Add To Bookings Schedule</span>
                </button>
              </div>

              {scheduleFeedback && (
                <div className="p-2 rounded-xl bg-emerald-950/80 border border-emerald-700/60 text-emerald-300 text-[11px] flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>{scheduleFeedback}</span>
                </div>
              )}
            </div>

            {/* Email Dispatch Status Box */}
            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-blue-400" />
                  <span>Customer Email:</span>
                </span>
                <span className="font-mono text-white text-xs">{selectedRequest.email || 'No email provided'}</span>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-slate-800/80">
                <span className="text-slate-400">Confirmation Sent:</span>
                <span className={`font-bold ${selectedRequest.emailSent ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {selectedRequest.emailSent ? '✓ Sent to customer' : 'Pending / Not Sent'}
                </span>
              </div>

              {emailFeedback && (
                <div className={`p-2.5 rounded-xl text-xs flex items-center gap-2 ${
                  emailFeedback.type === 'success'
                    ? 'bg-emerald-950/80 border border-emerald-700/60 text-emerald-300'
                    : 'bg-rose-950/80 border border-rose-700/60 text-rose-300'
                }`}>
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{emailFeedback.message}</span>
                </div>
              )}
            </div>

            {/* Change Status Dropdown */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-400">
                Update Service Status
              </label>
              <select
                value={selectedRequest.status}
                onChange={(e) => handleStatusChange(selectedRequest.id, e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500 font-semibold"
              >
                <option value="new">New Inquiry</option>
                <option value="contacted">Contacted via Phone/WhatsApp</option>
                <option value="confirmed">Visit Confirmed / Scheduled</option>
                <option value="in_progress">On-Site Diagnosis / In Progress</option>
                <option value="completed">Completed & Paid</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Metadata pills */}
            <div className="space-y-2 text-xs bg-slate-900/90 p-3.5 rounded-xl border border-slate-800">
              <div className="flex justify-between">
                <span className="text-slate-400">Contact:</span>
                <span className="font-mono text-slate-200">{selectedRequest.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">WhatsApp:</span>
                <span className="font-mono text-emerald-400">{selectedRequest.whatsapp || selectedRequest.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Area:</span>
                <span className="text-slate-200">{selectedRequest.area}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Device & OS:</span>
                <span className="text-slate-200">{selectedRequest.deviceType} ({selectedRequest.operatingSystem})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Important Data:</span>
                <span className={selectedRequest.importantData ? 'text-amber-400 font-bold' : 'text-slate-400'}>
                  {selectedRequest.importantData ? 'YES - Preserve Files' : 'Standard'}
                </span>
              </div>
            </div>

            {/* Full Problem Text */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-400">Customer Problem Description:</label>
              <div className="text-xs text-slate-200 p-3 rounded-xl bg-slate-900/60 border border-slate-800 leading-relaxed">
                {selectedRequest.problemDescription}
              </div>
            </div>

            {/* Internal Technician Notes */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-400">Internal Safiullah Notes:</label>
              <textarea
                rows={3}
                placeholder="Write private notes: e.g. Promised to visit at 3pm, customer mentioned Samsung SSD, needs 500GB clone..."
                value={internalNotes}
                onChange={(e) => setInternalNotes(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={handleSaveNotes}
                disabled={savingNote}
                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
              >
                {savingNote ? 'Saving...' : 'Save Notes'}
              </button>
            </div>

            {/* Danger Zone: Delete with working In-App Modal */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <button
                onClick={() => setDeleteTarget({ id: selectedRequest.id, name: selectedRequest.customerName })}
                className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Request</span>
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Edit Request Modal */}
      {isEditingModal && selectedRequest && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="glass-panel-glow w-full max-w-2xl rounded-3xl p-6 sm:p-8 border border-blue-500/50 space-y-5 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-white">Edit Service Request</h3>
                <span className="font-mono text-xs text-blue-400">ID: {selectedRequest.trackingId || selectedRequest.id}</span>
              </div>
              <button
                onClick={() => setIsEditingModal(false)}
                className="text-slate-400 hover:text-white text-xs font-bold"
              >
                ✕ Close
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Customer Name *</label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Email Address</label>
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">WhatsApp Number</label>
                  <input
                    type="tel"
                    value={editWhatsapp}
                    onChange={(e) => setEditWhatsapp(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Service Requested</label>
                  <input
                    type="text"
                    value={editService}
                    onChange={(e) => setEditService(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Peshawar Area</label>
                  <input
                    type="text"
                    value={editArea}
                    onChange={(e) => setEditArea(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Device Type</label>
                  <select
                    value={editDeviceType}
                    onChange={(e) => setEditDeviceType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  >
                    <option value="laptop">Laptop</option>
                    <option value="desktop">Desktop Tower</option>
                    <option value="all-in-one">All-In-One</option>
                    <option value="other">Multiple / Lab</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">OS</label>
                  <select
                    value={editOS}
                    onChange={(e) => setEditOS(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  >
                    <option value="Windows 11">Windows 11</option>
                    <option value="Windows 10">Windows 10</option>
                    <option value="Windows 7 / 8.1">Windows 7 / 8.1</option>
                    <option value="Linux / Other">Linux / Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Urgency</label>
                  <select
                    value={editUrgency}
                    onChange={(e) => setEditUrgency(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  >
                    <option value="normal">Normal</option>
                    <option value="high">High Priority</option>
                    <option value="urgent">Urgent Same-Day</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Problem Description</label>
                <textarea
                  rows={3}
                  value={editProblem}
                  onChange={(e) => setEditProblem(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditingModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all disabled:opacity-50"
                >
                  {savingEdit ? 'Saving Changes...' : 'Save Request Details'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Delete In-App Modal */}
      <ConfirmDeleteModal
        isOpen={!!deleteTarget}
        title="Delete Service Request?"
        itemName={deleteTarget?.name || 'this request'}
        itemType="request"
        onConfirm={handleDeleteConfirmed}
        onClose={() => setDeleteTarget(null)}
        loading={isDeleting}
      />

    </div>
  );
};
