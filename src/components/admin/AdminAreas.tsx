import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ServiceArea } from '../../types';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';
import {
  MapPin,
  Plus,
  Edit,
  Trash2,
  Save,
  CheckCircle2,
  Globe,
  EyeOff,
  Check,
} from 'lucide-react';

export const AdminAreas: React.FC = () => {
  const { areas, addArea, updateArea, deleteArea } = useApp();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [travelFee, setTravelFee] = useState<number>(300);
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<'active' | 'inactive' | 'draft'>('active');

  const showToast = (msg: string) => {
    setActionFeedback(msg);
    setTimeout(() => setActionFeedback(null), 3500);
  };

  const startEdit = (a: ServiceArea) => {
    setEditingId(a.id);
    setIsCreating(false);
    setName(a.name);
    setTravelFee(a.travelFee);
    setNotes(a.notes || '');
    setStatus(a.status === 'active' || a.active === true ? 'active' : (a.status as any) || 'inactive');
  };

  const startCreate = () => {
    setEditingId(null);
    setIsCreating(true);
    setName('');
    setTravelFee(300);
    setNotes('');
    setStatus('active');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const isActive = status === 'active';
    const areaPayload = {
      name: name.trim(),
      travelFee: Number(travelFee) || 0,
      notes: notes.trim(),
      status: isActive ? ('active' as const) : (status as any),
      active: isActive,
    };

    if (editingId) {
      await updateArea(editingId, areaPayload);
      showToast(`Coverage area "${name}" updated successfully!`);
      setEditingId(null);
    } else {
      await addArea(areaPayload);
      showToast(`Coverage area "${name}" created successfully!`);
      setIsCreating(false);
    }
  };

  const handleToggleStatus = async (a: ServiceArea) => {
    const isCurrentlyActive = a.status === 'active' || a.active === true;
    const newStatus = isCurrentlyActive ? 'inactive' : 'active';
    await updateArea(a.id, {
      status: newStatus as any,
      active: !isCurrentlyActive,
    });
    showToast(`"${a.name}" is now ${isCurrentlyActive ? 'moved to Drafts / Unpublished' : 'Published Live'}!`);
  };

  const handleDeleteConfirmed = async () => {
    if (!deleteTarget) return;
    try {
      setIsDeleting(true);
      await deleteArea(deleteTarget.id);
      showToast(`Coverage area "${deleteTarget.name}" deleted.`);
      setDeleteTarget(null);
    } catch (err) {
      console.error('Failed to delete area:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  const activeCount = areas.filter(a => a.status === 'active' || a.active === true).length;
  const draftCount = areas.length - activeCount;

  return (
    <div className="space-y-6">
      
      {/* Toast Feedback */}
      {actionFeedback && (
        <div className="p-3 rounded-xl bg-emerald-950/90 border border-emerald-500/50 text-emerald-200 text-xs font-semibold flex items-center gap-2 shadow-lg animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{actionFeedback}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
              <MapPin className="w-6 h-6 text-rose-400" />
              <span>Peshawar Service Areas & Travel Fees</span>
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
              {areas.length} Total
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 flex items-center gap-2 flex-wrap">
            <span>Localities where on-site visits are serviced, travel fees, and publish status.</span>
            <span className="text-emerald-400 font-semibold">• {activeCount} Live</span>
            {draftCount > 0 && (
              <span className="text-amber-400 font-semibold">• {draftCount} in Drafts / Unpublished</span>
            )}
          </p>
        </div>

        <button
          onClick={startCreate}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-blue-600/30 cursor-pointer transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Area</span>
        </button>
      </div>

      {/* Inline edit/create modal */}
      {(isCreating || editingId) && (
        <div className="glass-panel-glow p-6 rounded-3xl border border-blue-500/50 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="font-bold text-white text-sm">
              {isCreating ? 'Add Peshawar Coverage Area' : 'Edit Coverage Area'}
            </h3>
            <button
              onClick={() => {
                setIsCreating(false);
                setEditingId(null);
              }}
              className="text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-3 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Locality Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Hayatabad (Phases 1–7)"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Visit / Travel Fee (Rs)</label>
                <input
                  type="number"
                  value={travelFee}
                  onChange={(e) => setTravelFee(Number(e.target.value))}
                  placeholder="300"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Notes / Key Landmarks</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Hostels, campus apartments, nearby faculties"
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
              />
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-slate-300 font-semibold block">Publishing State</span>
                <span className="text-slate-500 text-[11px]">
                  {status === 'active'
                    ? 'Visible to visitors on the public booking form & calculator.'
                    : 'Saved as draft/unpublished. Hidden from public booking form.'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setStatus('active')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition ${
                    status === 'active'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  Published Live
                </button>
                <button
                  type="button"
                  onClick={() => setStatus('draft')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition ${
                    status !== 'active'
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  Draft / Unpublished
                </button>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setIsCreating(false);
                  setEditingId(null);
                }}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold cursor-pointer"
              >
                {editingId ? 'Update Area' : 'Save Area'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Grid of Areas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {areas.map((a) => {
          const isLive = a.status === 'active' || a.active === true;
          return (
            <div
              key={a.id}
              className={`glass-panel p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                isLive ? 'border-slate-800 hover:border-slate-700' : 'border-amber-500/40 bg-amber-950/10'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-rose-400 shrink-0" />
                    <h3 className="font-bold text-white text-sm">{a.name}</h3>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      isLive
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : 'bg-amber-950 text-amber-300 border border-amber-800'
                    }`}
                  >
                    {isLive ? 'Published Live' : 'Draft / Unpublished'}
                  </span>
                </div>

                {a.notes && (
                  <p className="text-xs text-slate-400 mb-3">{a.notes}</p>
                )}
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-xs text-slate-300 font-mono font-bold">
                  Fee: Rs. {a.travelFee}
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleToggleStatus(a)}
                    className={`p-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1 cursor-pointer transition ${
                      isLive
                        ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-500'
                    }`}
                    title={isLive ? 'Unpublish & Move to Drafts' : 'Publish Live Now'}
                  >
                    {isLive ? <EyeOff className="w-3.5 h-3.5 text-amber-400" /> : <Globe className="w-3.5 h-3.5" />}
                    <span>{isLive ? 'Unpublish' : 'Publish'}</span>
                  </button>

                  <button
                    onClick={() => startEdit(a)}
                    className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white border border-slate-700 cursor-pointer"
                    title="Edit Area"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => setDeleteTarget({ id: a.id, name: a.name })}
                    className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 cursor-pointer"
                    title="Delete Area"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Confirm Delete In-App Modal */}
      <ConfirmDeleteModal
        isOpen={!!deleteTarget}
        title="Delete Coverage Area?"
        itemName={deleteTarget?.name || 'this area'}
        itemType="coverage area"
        onConfirm={handleDeleteConfirmed}
        onClose={() => setDeleteTarget(null)}
        loading={isDeleting}
      />

    </div>
  );
};
