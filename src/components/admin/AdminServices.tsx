import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Service } from '../../types';
import { IconRenderer } from '../common/IconRenderer';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';
import {
  Layers,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  DollarSign,
  AlertCircle,
  Eye,
  EyeOff,
  Globe,
  Star,
  Search,
} from 'lucide-react';

export const AdminServices: React.FC = () => {
  const { services, addService, updateService, deleteService } = useApp();
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Windows');
  const [startingPrice, setStartingPrice] = useState<number | string>(1500);
  const [serviceDuration, setServiceDuration] = useState('45–60 mins');
  const [shortDescription, setShortDescription] = useState('');
  const [icon, setIcon] = useState('Monitor');
  const [featured, setFeatured] = useState(false);
  const [status, setStatus] = useState<'published' | 'draft' | 'archived'>('published');
  const [workflowStepsInput, setWorkflowStepsInput] = useState('');
  const [warningMessage, setWarningMessage] = useState('');

  const openEdit = (s: Service) => {
    setEditingService(s);
    setIsCreating(false);
    setName(s.name);
    setCategory(s.category);
    setStartingPrice(s.startingPrice);
    setServiceDuration(s.serviceDuration);
    setShortDescription(s.shortDescription);
    setIcon(s.icon || 'Monitor');
    setFeatured(Boolean(s.featured));
    setStatus(s.status || 'published');
    setWorkflowStepsInput(s.workflowSteps ? s.workflowSteps.join('\n') : '');
    setWarningMessage(s.warningMessage || '');
  };

  const openCreate = () => {
    setEditingService(null);
    setIsCreating(true);
    setName('');
    setCategory('Windows');
    setStartingPrice(1500);
    setServiceDuration('45–60 mins');
    setShortDescription('');
    setIcon('Monitor');
    setFeatured(false);
    setStatus('published');
    setWorkflowStepsInput('Diagnose Issue\nApply Technical Fix\nVerify Stability');
    setWarningMessage('');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const steps = workflowStepsInput
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    const payload = {
      name: name.trim(),
      category,
      startingPrice: Number(startingPrice) || startingPrice,
      serviceDuration,
      shortDescription,
      icon,
      featured,
      status,
      published: status === 'published',
      isPublished: status === 'published',
      workflowSteps: steps,
      warningMessage: warningMessage.trim() || undefined,
    };

    console.log("Services Save - Attempting to save service:", { id: editingService?.id, payload });
    console.log("Services Save - Current status value:", status);

    try {
      if (editingService) {
        await updateService(editingService.id, payload as any);
        console.log("Services Save - Successfully updated service:", editingService.id);
      } else {
        await addService(payload as any);
        console.log("Services Save - Successfully added new service");
      }
    } catch (error) {
      console.error("Services Save - Error saving service:", error);
    }

    setEditingService(null);
    setIsCreating(false);
  };

  const handleQuickToggleStatus = async (service: Service, nextStatus: 'published' | 'unpublished' | 'draft') => {
    try {
      await updateService(service.id, {
        status: nextStatus,
        published: nextStatus === 'published',
        isPublished: nextStatus === 'published'
      } as any);
    } catch (err) {
      console.error('Failed to toggle status:', err);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      setIsDeleting(true);
      await deleteService(deleteTarget.id);
      if (editingService?.id === deleteTarget.id) {
        setEditingService(null);
      }
      setDeleteTarget(null);
    } catch (err) {
      console.error('Failed to delete service:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  const filtered = services.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Layers className="w-6 h-6 text-blue-400" />
            <span>Services & Pricing Catalog</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            One source of truth: edits here immediately update the public website and booking form
          </p>
        </div>

        <button
          onClick={openCreate}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-blue-600/30 cursor-pointer transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Service</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="glass-panel p-3.5 rounded-2xl border border-slate-800">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-2.5" />
          <input
            type="text"
            placeholder="Search services by title or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Services List and Edit Form Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Services List (7 cols or 12) */}
        <div className={`${(editingService || isCreating) ? 'lg:col-span-6' : 'lg:col-span-12'} space-y-3`}>
          {filtered.map((s) => (
            <div
              key={s.id}
              className={`glass-panel p-5 rounded-2xl border transition-all space-y-3 ${
                editingService?.id === s.id
                  ? 'border-blue-500 bg-blue-950/20'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-950/80 border border-blue-800/60 flex items-center justify-center text-blue-400">
                    <IconRenderer name={s.icon} className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-blue-400 uppercase">{s.category}</span>
                      {s.featured && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-950 text-amber-300 border border-amber-800 flex items-center gap-1">
                          <Star className="w-2.5 h-2.5 fill-amber-300" />
                          Featured
                        </span>
                      )}
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase border ${
                        s.status === 'published'
                          ? 'bg-emerald-950/90 text-emerald-300 border-emerald-800'
                          : s.status === 'draft'
                          ? 'bg-amber-950/90 text-amber-300 border-amber-800'
                          : s.status === 'unpublished'
                          ? 'bg-rose-950/90 text-rose-300 border-rose-800'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}>
                        {s.status}
                      </span>
                    </div>
                    <h3 className="font-bold text-white text-base mt-0.5">{s.name}</h3>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="font-mono font-extrabold text-sm text-white">
                    Rs. {s.startingPrice}
                  </div>
                  <div className="text-[11px] text-slate-400">{s.serviceDuration}</div>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                {s.shortDescription}
              </p>

              <div className="pt-2 border-t border-slate-800/70 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">
                  {s.workflowSteps?.length || 0} process steps configured
                </span>

                <div className="flex items-center gap-2">
                  {/* Quick Toggle Publish / Unpublish */}
                  {s.status === 'published' ? (
                    <button
                      onClick={() => handleQuickToggleStatus(s, 'unpublished')}
                      className="px-2.5 py-1 rounded-lg bg-amber-950/60 hover:bg-amber-900/80 border border-amber-800/60 text-amber-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                      title="Unpublish this service (moves to Drafts/Unpublished)"
                    >
                      <EyeOff className="w-3.5 h-3.5" />
                      <span>Unpublish</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleQuickToggleStatus(s, 'published')}
                      className="px-2.5 py-1 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-800/60 text-emerald-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                      title="Publish live to public website"
                    >
                      <Globe className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Publish Live</span>
                    </button>
                  )}

                  <button
                    onClick={() => openEdit(s)}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Edit className="w-3.5 h-3.5 text-blue-400" />
                    <span>Edit</span>
                  </button>

                  <button
                    disabled
                    className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-600 text-xs font-semibold flex items-center gap-1.5 cursor-not-allowed"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-slate-700" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Editor Form (6 cols) */}
        {(editingService || isCreating) && (
          <div className="lg:col-span-6 glass-panel-glow p-6 rounded-3xl border border-blue-500/50 space-y-4 sticky top-24 self-start">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white text-lg">
                {isCreating ? 'Create New Service' : `Edit: ${editingService?.name}`}
              </h3>
              <button
                onClick={() => {
                  setEditingService(null);
                  setIsCreating(false);
                }}
                className="text-xs text-slate-400 hover:text-white cursor-pointer"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Service Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Windows Installation & Setup"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  >
                    <option value="Windows">Windows</option>
                    <option value="SSD / OS Migration">SSD / OS Migration</option>
                    <option value="Data Recovery">Data Recovery</option>
                    <option value="Troubleshooting">Troubleshooting</option>
                    <option value="Software Setup">Software Setup</option>
                    <option value="Bulk Deployment">Bulk Deployment</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Icon</label>
                  <select
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  >
                    <option value="Monitor">Monitor</option>
                    <option value="HardDrive">HardDrive</option>
                    <option value="Database">Database</option>
                    <option value="AlertTriangle">AlertTriangle</option>
                    <option value="Gauge">Gauge</option>
                    <option value="RotateCcw">RotateCcw</option>
                    <option value="Settings">Settings</option>
                    <option value="ShieldCheck">ShieldCheck</option>
                    <option value="Building2">Building2</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Starting Price (Rs)</label>
                  <input
                    type="text"
                    required
                    value={startingPrice}
                    onChange={(e) => setStartingPrice(e.target.value)}
                    placeholder="1500"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Typical Duration</label>
                  <input
                    type="text"
                    value={serviceDuration}
                    onChange={(e) => setServiceDuration(e.target.value)}
                    placeholder="45–60 mins"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Short Description</label>
                <textarea
                  rows={2}
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  placeholder="Clear description of the service..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">
                  Technical Workflow Steps (1 per line)
                </label>
                <textarea
                  rows={3}
                  value={workflowStepsInput}
                  onChange={(e) => setWorkflowStepsInput(e.target.value)}
                  placeholder="Step 1\nStep 2\nStep 3"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">
                  Warning Notice (Optional - e.g. Data Recovery warning)
                </label>
                <input
                  type="text"
                  value={warningMessage}
                  onChange={(e) => setWarningMessage(e.target.value)}
                  placeholder="DO NOT FORMAT THE DRIVE. STOP USING COMPUTER."
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-rose-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  >
                    <option value="published">Published (Live on Website)</option>
                    <option value="draft">Draft (Hidden from Public)</option>
                    <option value="unpublished">Unpublished (Hidden from Public)</option>
                    <option value="archived">Archived (Hidden from Public)</option>
                  </select>
                </div>

                <div className="flex items-end pb-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={featured}
                      onChange={(e) => setFeatured(e.target.checked)}
                      className="rounded border-slate-700 text-blue-600 w-4 h-4 bg-slate-900"
                    />
                    <span className="text-slate-300 font-medium">Highlight / Featured</span>
                  </label>
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditingService(null);
                    setIsCreating(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold"
                >
                  Save to Database
                </button>
              </div>
            </form>
          </div>
        )}

      </div>

      {/* In-App Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={!!deleteTarget}
        title="Delete Service?"
        itemName={deleteTarget?.name || 'this service'}
        itemType="service"
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteTarget(null)}
        loading={isDeleting}
      />

    </div>
  );
};
