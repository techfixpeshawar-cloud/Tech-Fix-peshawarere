import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';
import { Customer } from '../../types';
import {
  Users,
  Search,
  Phone,
  MessageSquare,
  MapPin,
  Calendar,
  Layers,
  FileText,
  Plus,
  Edit2,
  Trash2,
  Mail,
  RefreshCw,
} from 'lucide-react';

export const AdminCustomers: React.FC = () => {
  const { generateWhatsAppLink } = useApp();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Add customer modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [addName, setAddName] = useState('');
  const [addPhone, setAddPhone] = useState('');
  const [addWhatsapp, setAddWhatsapp] = useState('');
  const [addEmail, setAddEmail] = useState('');
  const [addArea, setAddArea] = useState('University Town');
  const [addNotes, setAddNotes] = useState('');
  const [savingAdd, setSavingAdd] = useState(false);

  // Edit customer modal state
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editWhatsapp, setEditWhatsapp] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editArea, setEditArea] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [savingEdit, setSavingEdit] = useState(false);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const data = await api.getCustomers();
      setCustomers(data);
    } catch (err) {
      console.error('Failed to load customers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const handleCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addName.trim() || !addPhone.trim()) return;

    try {
      setSavingAdd(true);
      const created = await api.createCustomer({
        name: addName.trim(),
        phone: addPhone.trim(),
        whatsapp: addWhatsapp.trim() || addPhone.trim(),
        email: addEmail.trim() || undefined,
        area: addArea.trim(),
        notes: addNotes.trim() || undefined,
        requestCount: 0,
        completedCount: 0,
        totalRequests: 0,
        completedVisits: 0,
      });
      setCustomers([created, ...customers]);
      setShowAddModal(false);
      setAddName('');
      setAddPhone('');
      setAddWhatsapp('');
      setAddEmail('');
      setAddNotes('');
    } catch (err: any) {
      console.error('Failed to create customer:', err);
      alert('Error creating customer: ' + err.message);
    } finally {
      setSavingAdd(false);
    }
  };

  const openEdit = (c: Customer) => {
    setEditingCustomer(c);
    setEditName(c.name || '');
    setEditPhone(c.phone || '');
    setEditWhatsapp(c.whatsapp || c.phone || '');
    setEditEmail(c.email || '');
    setEditArea(c.area || '');
    setEditNotes(c.notes || '');
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCustomer) return;

    try {
      setSavingEdit(true);
      const updated = await api.updateCustomer(editingCustomer.id, {
        name: editName.trim(),
        phone: editPhone.trim(),
        whatsapp: editWhatsapp.trim() || editPhone.trim(),
        email: editEmail.trim() || undefined,
        area: editArea.trim(),
        notes: editNotes.trim() || undefined,
      });
      setCustomers(customers.map(c => c.id === editingCustomer.id ? updated : c));
      setEditingCustomer(null);
    } catch (err: any) {
      console.error('Failed to update customer:', err);
      alert('Error updating customer: ' + err.message);
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete customer record for "${name}"?`)) return;

    try {
      await api.deleteCustomer(id);
      setCustomers(customers.filter(c => c.id !== id));
      if (editingCustomer?.id === id) setEditingCustomer(null);
    } catch (err: any) {
      console.error('Failed to delete customer:', err);
      alert('Error deleting customer: ' + err.message);
    }
  };

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone.includes(searchTerm) ||
    (c.email && c.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    c.area.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Users className="w-6 h-6 text-indigo-400" />
            <span>Customer Records</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Client directory aggregated from service inquiries and completed visits in Peshawar
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadCustomers}
            className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white cursor-pointer"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-blue-600/30 cursor-pointer transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Customer</span>
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="glass-panel p-3.5 rounded-2xl border border-slate-800">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-2.5" />
          <input
            type="text"
            placeholder="Search customers by name, phone, email, or Peshawar area..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Customers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.length === 0 ? (
          <div className="col-span-full glass-panel p-12 rounded-3xl border border-slate-800 text-center text-slate-400">
            No customers found. Click "Add Customer" above to create one.
          </div>
        ) : (
          filtered.map((c) => (
            <div
              key={c.id}
              className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4 hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-indigo-950/80 border border-indigo-800/60 flex items-center justify-center text-indigo-400 font-bold text-sm">
                      {c.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-sm">{c.name}</h3>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-500" />
                        <span>{c.area}</span>
                      </div>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-950 text-blue-300 border border-blue-800">
                    {c.totalRequests || c.requestCount || 0} {(c.totalRequests || c.requestCount) === 1 ? 'Job' : 'Jobs'}
                  </span>
                </div>

                <div className="space-y-1 text-xs text-slate-300 bg-slate-900/70 p-3 rounded-xl border border-slate-800">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Phone:</span>
                    <span className="font-mono text-white">{c.phone}</span>
                  </div>
                  {c.email && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">Email:</span>
                      <span className="font-mono text-white truncate max-w-[160px]">{c.email}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-slate-500">Completed Visits:</span>
                    <span className="font-mono text-emerald-400 font-bold">{c.completedVisits || c.completedCount || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Last Service:</span>
                    <span className="text-slate-300 font-medium">{c.lastServiceDate || 'Recent'}</span>
                  </div>
                </div>

                {c.notes && (
                  <p className="text-[11px] text-slate-400 italic bg-slate-950/40 p-2 rounded-lg border border-slate-800/60">
                    "{c.notes}"
                  </p>
                )}
              </div>

              {/* Action Buttons: WhatsApp, Call, Edit, Delete */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-1.5 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <a
                    href={generateWhatsAppLink(`Salam ${c.name}, this is Safiullah from Peshawar Tech Support.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 rounded-lg bg-emerald-950/80 border border-emerald-700/60 text-emerald-300 hover:bg-emerald-900 text-xs font-semibold flex items-center gap-1"
                  >
                    <MessageSquare className="w-3 h-3 text-emerald-400" />
                    <span>WhatsApp</span>
                  </a>

                  <a
                    href={`tel:${c.phone}`}
                    className="px-2.5 py-1 rounded-lg bg-blue-950/80 border border-blue-700/60 text-blue-300 hover:bg-blue-900 text-xs font-semibold flex items-center gap-1"
                  >
                    <Phone className="w-3 h-3 text-blue-400" />
                    <span>Call</span>
                  </a>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEdit(c)}
                    className="p-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700 cursor-pointer flex items-center gap-1 text-xs"
                    title="Edit Customer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>

                  <button
                    onClick={() => handleDelete(c.id, c.name)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/50 cursor-pointer transition-colors"
                    title="Delete Customer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Customer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="glass-panel-glow max-w-md w-full rounded-3xl p-6 border border-slate-700 space-y-4 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white text-lg">Add New Customer Record</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white text-sm cursor-pointer"
              >
                ✕ Cancel
              </button>
            </div>

            <form onSubmit={handleCreateCustomer} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Customer Full Name *</label>
                <input
                  type="text"
                  required
                  value={addName}
                  onChange={(e) => setAddName(e.target.value)}
                  placeholder="Muhammad Hamza"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={addPhone}
                    onChange={(e) => setAddPhone(e.target.value)}
                    placeholder="0333 1234567"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">WhatsApp Number</label>
                  <input
                    type="tel"
                    value={addWhatsapp}
                    onChange={(e) => setAddWhatsapp(e.target.value)}
                    placeholder="Same as phone"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Customer Email</label>
                <input
                  type="email"
                  value={addEmail}
                  onChange={(e) => setAddEmail(e.target.value)}
                  placeholder="customer@example.com"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Peshawar Area / Address</label>
                <input
                  type="text"
                  value={addArea}
                  onChange={(e) => setAddArea(e.target.value)}
                  placeholder="e.g. University Town, Hayatabad Phase 3"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Customer Notes / History</label>
                <textarea
                  rows={2}
                  value={addNotes}
                  onChange={(e) => setAddNotes(e.target.value)}
                  placeholder="Dell laptop client, preferred evening visits..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingAdd}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold cursor-pointer disabled:opacity-50"
                >
                  {savingAdd ? 'Saving...' : 'Add Customer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Customer Modal */}
      {editingCustomer && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="glass-panel-glow max-w-md w-full rounded-3xl p-6 border border-blue-500/50 space-y-4 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="font-bold text-white text-lg">Edit Customer Record</h3>
                <span className="font-mono text-xs text-blue-400">ID: {editingCustomer.id}</span>
              </div>
              <button
                onClick={() => setEditingCustomer(null)}
                className="text-slate-400 hover:text-white text-sm cursor-pointer"
              >
                ✕ Cancel
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Customer Full Name *</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                />
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
                  <label className="block text-slate-300 mb-1 font-semibold">WhatsApp Number</label>
                  <input
                    type="tel"
                    value={editWhatsapp}
                    onChange={(e) => setEditWhatsapp(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
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

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Peshawar Area / Address</label>
                <input
                  type="text"
                  value={editArea}
                  onChange={(e) => setEditArea(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Customer Notes / History</label>
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
                  onClick={() => setEditingCustomer(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold cursor-pointer disabled:opacity-50"
                >
                  {savingEdit ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
