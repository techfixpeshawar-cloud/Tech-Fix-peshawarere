import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Booking } from '../../types';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  DollarSign,
  Plus,
  Trash2,
  Edit2,
  Phone,
  MessageSquare,
  Search,
  Filter,
  Mail,
  Send,
  RefreshCw,
} from 'lucide-react';

export const AdminBookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Email resend state
  const [resendingId, setResendingId] = useState<string | null>(null);
  const [emailNotification, setEmailNotification] = useState<{ id: string; message: string; type: 'success' | 'error' } | null>(null);

  // New Booking form state
  const [customerName, setCustomerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [service, setService] = useState('Windows Installation & Setup');
  const [addressArea, setAddressArea] = useState('University Town');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('3:00 PM');
  const [price, setPrice] = useState('1800');
  const [notes, setNotes] = useState('');

  // Edit Booking form state
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editService, setEditService] = useState('');
  const [editArea, setEditArea] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editTime, setEditTime] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editStatus, setEditStatus] = useState<any>('confirmed');
  const [editPaymentStatus, setEditPaymentStatus] = useState<any>('pending');
  const [editNotes, setEditNotes] = useState('');
  const [savingEdit, setSavingEdit] = useState(false);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const data = await api.getBookings();
      setBookings(data);
    } catch (err) {
      console.error('Failed to load bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
    const today = new Date().toISOString().split('T')[0];
    setDate(today);
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !phone) return;

    try {
      const created = await api.createBooking({
        customerName: customerName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        service: service.trim(),
        addressArea: addressArea.trim(),
        date,
        time,
        price: Number(price) || 0,
        status: 'confirmed',
        paymentStatus: 'pending',
        notes: notes.trim(),
      });
      setBookings([created, ...bookings]);
      setShowAddModal(false);
      setCustomerName('');
      setEmail('');
      setPhone('');
      setNotes('');
    } catch (err) {
      console.error('Failed to create booking:', err);
    }
  };

  const openEdit = (b: Booking) => {
    setEditingBooking(b);
    setEditName(b.customerName || '');
    setEditEmail(b.email || '');
    setEditPhone(b.phone || '');
    setEditService(b.service || '');
    setEditArea(b.addressArea || '');
    setEditDate(b.date || '');
    setEditTime(b.time || '');
    setEditPrice(String(b.price || '0'));
    setEditStatus(b.status || 'confirmed');
    setEditPaymentStatus(b.paymentStatus || 'pending');
    setEditNotes(b.notes || '');
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBooking) return;

    try {
      setSavingEdit(true);
      const updated = await api.updateBooking(editingBooking.id, {
        customerName: editName.trim(),
        email: editEmail.trim(),
        phone: editPhone.trim(),
        service: editService.trim(),
        addressArea: editArea.trim(),
        date: editDate,
        time: editTime,
        price: Number(editPrice) || 0,
        status: editStatus,
        paymentStatus: editPaymentStatus,
        notes: editNotes.trim(),
      });
      setBookings(bookings.map(b => b.id === editingBooking.id ? updated : b));
      setEditingBooking(null);
    } catch (err: any) {
      console.error('Failed to update booking:', err);
      alert('Failed to update appointment: ' + err.message);
    } finally {
      setSavingEdit(false);
    }
  };

  const handleResendEmail = async (bkgId: string) => {
    setEmailNotification(null);
    try {
      setResendingId(bkgId);
      const res = await api.resendBookingEmail(bkgId);
      setEmailNotification({ id: bkgId, message: res.message || 'Appointment confirmation email dispatched!', type: 'success' });
      setBookings(bookings.map(b => b.id === bkgId ? { ...b, emailSent: true } : b));
    } catch (err: any) {
      console.error('Failed to resend booking email:', err);
      setEmailNotification({ id: bkgId, message: err.message || 'Failed to dispatch email', type: 'error' });
    } finally {
      setResendingId(null);
    }
  };

  const handleUpdateStatus = async (id: string, status: any) => {
    try {
      const updated = await api.updateBooking(id, { status });
      setBookings(bookings.map(b => b.id === id ? updated : b));
    } catch (err) {
      console.error('Failed to update booking status:', err);
    }
  };

  const handleUpdatePayment = async (id: string, paymentStatus: any) => {
    try {
      const updated = await api.updateBooking(id, { paymentStatus });
      setBookings(bookings.map(b => b.id === id ? updated : b));
    } catch (err) {
      console.error('Failed to update payment status:', err);
    }
  };

  const handleDeleteConfirmed = async () => {
    if (!deleteTarget) return;
    try {
      setIsDeleting(true);
      await api.deleteBooking(deleteTarget.id);
      setBookings(prev => prev.filter(b => b.id !== deleteTarget.id));
      if (editingBooking?.id === deleteTarget.id) setEditingBooking(null);
      setDeleteTarget(null);
    } catch (err) {
      console.error('Failed to delete booking:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  const filtered = bookings.filter(b =>
    b.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.phone.includes(searchTerm) ||
    (b.email && b.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (b.trackingId && b.trackingId.toLowerCase().includes(searchTerm.toLowerCase())) ||
    b.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.addressArea.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Calendar className="w-6 h-6 text-emerald-400" />
            <span>On-Site Appointments & Bookings</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Confirmed visits, scheduling schedule, technician visit logs, and payment settlement
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-blue-600/30 cursor-pointer transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Appointment</span>
        </button>
      </div>

      {/* Search */}
      <div className="glass-panel p-3.5 rounded-2xl border border-slate-800">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-2.5" />
          <input
            type="text"
            placeholder="Search bookings by customer, phone, location or service..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Bookings List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.length === 0 ? (
          <div className="col-span-full glass-panel p-12 rounded-3xl border border-slate-800 text-center text-slate-400">
            No bookings found. Click "New Appointment" above to create one.
          </div>
        ) : (
          filtered.map((bkg) => (
            <div
              key={bkg.id}
              className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4 hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-white text-base">{bkg.customerName}</h3>
                      <span className="px-1.5 py-0.5 rounded font-mono text-[10px] font-bold bg-blue-950 text-blue-300 border border-blue-800">
                        {bkg.trackingId || bkg.id}
                      </span>
                    </div>
                    <div className="text-xs text-blue-400 font-medium mt-0.5">{bkg.service}</div>
                  </div>

                  <div className="text-right">
                    <span className="font-mono font-extrabold text-sm text-white">
                      Rs. {bkg.price}
                    </span>
                    <div className="mt-1">
                      <button
                        onClick={() => handleUpdatePayment(bkg.id, bkg.paymentStatus === 'paid' ? 'pending' : 'paid')}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider cursor-pointer ${
                          bkg.paymentStatus === 'paid'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : 'bg-amber-950 text-amber-300 border border-amber-800'
                        }`}
                      >
                        {bkg.paymentStatus}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Email and Confirmation Badge */}
                <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800/90 text-xs space-y-1.5">
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="flex items-center gap-1 text-slate-400 text-[11px]">
                      <Mail className="w-3 h-3 text-blue-400" />
                      <span>Email:</span>
                    </span>
                    <span className="font-mono text-[11px] text-white truncate max-w-[170px]">
                      {bkg.email || 'No email saved'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-800">
                    <span className={`text-[10px] font-semibold ${bkg.emailSent ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {bkg.emailSent ? '✓ Confirmation Sent' : 'Email Pending'}
                    </span>

                    {bkg.email && (
                      <button
                        onClick={() => handleResendEmail(bkg.id)}
                        disabled={resendingId === bkg.id}
                        className="px-2 py-0.5 rounded bg-blue-950 hover:bg-blue-900 text-blue-300 border border-blue-700/60 text-[10px] font-bold flex items-center gap-1 cursor-pointer disabled:opacity-50"
                      >
                        <Send className={`w-2.5 h-2.5 ${resendingId === bkg.id ? 'animate-spin' : ''}`} />
                        <span>{resendingId === bkg.id ? 'Sending...' : 'Resend Email'}</span>
                      </button>
                    )}
                  </div>

                  {emailNotification && emailNotification.id === bkg.id && (
                    <div className={`text-[10px] p-1.5 rounded-lg ${
                      emailNotification.type === 'success'
                        ? 'bg-emerald-950 text-emerald-300'
                        : 'bg-rose-950 text-rose-300'
                    }`}>
                      {emailNotification.message}
                    </div>
                  )}
                </div>

                <div className="space-y-1.5 text-xs text-slate-300 bg-slate-900/70 p-3 rounded-xl border border-slate-800">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span>{bkg.date} at {bkg.time}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{bkg.addressArea}</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-slate-400">
                    <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span>{bkg.phone}</span>
                  </div>
                </div>

                {bkg.notes && (
                  <p className="text-[11px] text-slate-400 italic bg-slate-950/40 p-2 rounded-lg border border-slate-800/60">
                    "{bkg.notes}"
                  </p>
                )}
              </div>

              {/* Status and Action Buttons */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                <select
                  value={bkg.status}
                  onChange={(e) => handleUpdateStatus(bkg.id, e.target.value)}
                  className="px-2 py-1 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none font-medium"
                >
                  <option value="confirmed">Confirmed</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>

                <div className="flex items-center gap-1.5">
                  {/* WhatsApp Visit Confirmation */}
                  <a
                    href={`https://wa.me/${(bkg.whatsapp || bkg.phone).replace(/\D/g, '')}?text=${encodeURIComponent(
                      `Salam ${bkg.customerName}! 🔧 Technician Safiullah confirmed your on-site appointment.\n\n📅 Confirmed Date: ${bkg.date}\n⏰ Arrival Time: ${bkg.time}\n📍 Area: ${bkg.addressArea}\n💻 Service: ${bkg.service}\n🔖 Tracking Ref: ${bkg.trackingId || bkg.id}\n\nI will be arriving at your location on time. JazakAllah!`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded-lg bg-emerald-950/80 border border-emerald-700/60 text-emerald-300 hover:bg-emerald-900 cursor-pointer flex items-center gap-1 text-xs"
                    title="Send Confirmed Time via WhatsApp"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">WhatsApp Time</span>
                  </a>

                  <button
                    onClick={() => openEdit(bkg)}
                    className="p-1.5 rounded-lg bg-blue-950/80 border border-blue-700/60 text-blue-300 hover:bg-blue-900 cursor-pointer flex items-center gap-1 text-xs"
                    title="Edit Appointment"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>

                  <button
                    onClick={() => setDeleteTarget({ id: bkg.id, name: `${bkg.customerName} - ${bkg.service}` })}
                    className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-950/50 rounded-lg cursor-pointer transition-colors"
                    title="Delete Appointment"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="glass-panel-glow max-w-lg w-full rounded-3xl p-6 sm:p-8 border border-slate-700 space-y-4 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white text-lg">Schedule New On-Site Appointment</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white text-sm cursor-pointer"
              >
                ✕ Cancel
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Customer Name *</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Muhammad Hamza"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Customer Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="customer@gmail.com"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0333 1234567"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Service</label>
                  <input
                    type="text"
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Peshawar Address / Area</label>
                <input
                  type="text"
                  value={addressArea}
                  onChange={(e) => setAddressArea(e.target.value)}
                  placeholder="e.g. University Town, Street 4, House 12"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-2 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Time Slot</label>
                  <input
                    type="text"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    placeholder="3:00 PM"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Agreed Price (Rs)</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="1800"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Notes</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Hardware notes, SSD model, etc."
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold cursor-pointer"
                >
                  Save & Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Appointment Modal */}
      {editingBooking && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="glass-panel-glow max-w-lg w-full rounded-3xl p-6 sm:p-8 border border-blue-500/50 space-y-4 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="font-bold text-white text-lg">Edit Appointment</h3>
                <span className="font-mono text-xs text-blue-400">Ref: {editingBooking.trackingId || editingBooking.id}</span>
              </div>
              <button
                onClick={() => setEditingBooking(null)}
                className="text-slate-400 hover:text-white text-sm cursor-pointer"
              >
                ✕ Cancel
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Customer Name *</label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Customer Email</label>
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Service</label>
                  <input
                    type="text"
                    value={editService}
                    onChange={(e) => setEditService(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Peshawar Address / Area</label>
                <input
                  type="text"
                  value={editArea}
                  onChange={(e) => setEditArea(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Date</label>
                  <input
                    type="date"
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                    className="w-full px-2 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Time Slot</label>
                  <input
                    type="text"
                    value={editTime}
                    onChange={(e) => setEditTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Agreed Fee (Rs)</label>
                  <input
                    type="number"
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Visit Status</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  >
                    <option value="confirmed">Confirmed</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Payment Status</label>
                  <select
                    value={editPaymentStatus}
                    onChange={(e) => setEditPaymentStatus(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Notes</label>
                <textarea
                  rows={2}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingBooking(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold cursor-pointer transition-all disabled:opacity-50"
                >
                  {savingEdit ? 'Saving...' : 'Save Appointment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Delete In-App Modal */}
      <ConfirmDeleteModal
        isOpen={!!deleteTarget}
        title="Delete Appointment?"
        itemName={deleteTarget?.name || 'this booking'}
        itemType="appointment"
        onConfirm={handleDeleteConfirmed}
        onClose={() => setDeleteTarget(null)}
        loading={isDeleting}
      />

    </div>
  );
};
