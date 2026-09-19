import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ServiceCase } from '../../types';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';
import {
  FileText,
  Plus,
  Trash2,
  Edit,
  CheckCircle2,
  Calendar,
  EyeOff,
  Globe,
} from 'lucide-react';

export const AdminCases: React.FC = () => {
  const { cases, addCase, updateCase, deleteCase } = useApp();
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [title, setTitle] = useState('');
  const [serviceType, setServiceType] = useState('Windows Installation');
  const [problem, setProblem] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [solution, setSolution] = useState('');
  const [result, setResult] = useState('');
  const [date, setDate] = useState('');
  const [published, setPublished] = useState(true);

  const startCreate = () => {
    setEditingId(null);
    setIsCreating(true);
    setTitle('');
    setServiceType('Windows Installation');
    setProblem('');
    setDiagnosis('');
    setSolution('');
    setResult('');
    setPublished(true);
    setDate(new Date().toISOString().split('T')[0]);
  };

  const startEdit = (c: any) => {
    setIsCreating(false);
    setEditingId(c.id);
    setTitle(c.title || '');
    setServiceType(c.serviceType || 'Windows Installation');
    setProblem(c.problem || '');
    setDiagnosis(c.diagnosis || '');
    setSolution(c.solution || '');
    setResult(c.result || '');
    setPublished(c.published ?? true);
    setDate(c.date || new Date().toISOString().split('T')[0]);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !problem.trim() || !solution.trim()) return;

    const payload = {
      title: title.trim(),
      serviceType,
      problem: problem.trim(),
      diagnosis: diagnosis.trim() || 'Comprehensive hardware and OS diagnostic performed.',
      solution: solution.trim(),
      result: result.trim() || 'Computer fully restored and tested in customer presence.',
      published,
      isPublished: published,
      date: date || new Date().toISOString().split('T')[0],
    };

    console.log("Cases Save - Attempting to save case study:", { payload, id: editingId });
    console.log("Cases Save - Current published value:", published);

    try {
      if (editingId) {
        await updateCase(editingId, payload as any);
        console.log("Cases Save - Successfully updated case study:", editingId);
        setEditingId(null);
      } else {
        await addCase(payload as any);
        console.log("Cases Save - Successfully added new case study");
        setIsCreating(false);
      }
    } catch (error) {
      console.error("Cases Save - Error saving case study:", error);
    }

    setTitle('');
    setProblem('');
    setDiagnosis('');
    setSolution('');
    setResult('');
  };

  const handleTogglePublished = async (c: any) => {
    const next = !c.published;
    try {
      await updateCase(c.id, { published: next, isPublished: next } as any);
    } catch (err) {
      console.error('Failed to toggle case status:', err);
    }
  };

  const handleDeleteConfirmed = async () => {
    if (!deleteTarget) return;
    try {
      setIsDeleting(true);
      await deleteCase(deleteTarget.id);
      setDeleteTarget(null);
    } catch (err) {
      console.error('Failed to delete case:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <FileText className="w-6 h-6 text-sky-400" />
            <span>Real Service Cases Publisher</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Publish verified repair jobs to build customer trust and showcase real diagnostic expertise
          </p>
        </div>

        <button
          onClick={startCreate}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-blue-600/30 cursor-pointer transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Publish New Case</span>
        </button>
      </div>

      {/* Create / Edit Modal */}
      {(isCreating || editingId) && (
        <div className="glass-panel-glow p-6 rounded-3xl border border-blue-500/50 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="font-bold text-white text-sm">
              {editingId ? 'Edit Service Case Study' : 'Publish Service Case Study'}
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
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Case Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Dell Inspiron 15 Endless BSOD Fix"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Service Type</label>
                <input
                  type="text"
                  value={serviceType}
                  onChange={(e) => setServiceType(e.target.value)}
                  placeholder="e.g. Blue Screen (BSOD) Diagnosis"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Customer Problem *</label>
              <textarea
                rows={2}
                required
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
                placeholder="Describe symptoms reported by the customer..."
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Diagnostic Findings</label>
              <textarea
                rows={2}
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                placeholder="What was discovered during live diagnosis? (e.g. Bad RAM stick, corrupted NTFS partition...)"
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Solution Applied *</label>
              <textarea
                rows={2}
                required
                value={solution}
                onChange={(e) => setSolution(e.target.value)}
                placeholder="What steps did Safiullah perform to fix the machine?"
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Final Result</label>
                <input
                  type="text"
                  value={result}
                  onChange={(e) => setResult(e.target.value)}
                  placeholder="e.g. 100% stability confirmed over 2-hour stress test"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 mb-2">
              <input
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="w-4 h-4 rounded border-slate-700 bg-slate-900 checked:bg-blue-600"
              />
              <label className="text-slate-300 font-semibold text-xs">Published</label>
            </div>

            <div className="flex justify-end gap-2 pt-2">
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
                {editingId ? 'Save Changes' : 'Publish Case'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Case Studies List */}
      <div className="space-y-4">
        {cases.length === 0 ? (
          <div className="glass-panel p-12 rounded-3xl border border-slate-800 text-center text-slate-400 space-y-2">
            <FileText className="w-8 h-8 mx-auto text-slate-600" />
            <div className="font-bold text-white text-sm">No Published Cases</div>
            <div className="text-xs">
              The public site currently displays the reassuring default: "No service cases published yet."
              Click "Publish New Case" above when you want to add your first case study.
            </div>
          </div>
        ) : (
          cases.map((c) => (
            <div
              key={c.id}
              className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-[10px] font-mono text-blue-400 font-bold uppercase tracking-wider">
                    {c.serviceType} • {c.date}
                  </span>
                  <h3 className="font-bold text-white text-base mt-0.5">{c.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${c.published ? 'bg-emerald-950 text-emerald-400' : 'bg-rose-950 text-rose-400'}`}>
                      {c.published ? 'PUBLISHED' : 'UNPUBLISHED'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* 1-click Quick Toggle Publish / Unpublish */}
                  <button
                    onClick={() => handleTogglePublished(c)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                      c.published
                        ? 'bg-amber-950/60 hover:bg-amber-900/80 text-amber-300 border border-amber-800/60'
                        : 'bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-800/60'
                    }`}
                    title={c.published ? 'Unpublish Case (moves to Drafts/Unpublished)' : 'Publish Case live to public website'}
                  >
                    {c.published ? (
                      <>
                        <EyeOff className="w-3.5 h-3.5" />
                        <span>Unpublish</span>
                      </>
                    ) : (
                      <>
                        <Globe className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Publish Live</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => startEdit(c)}
                    className="p-1.5 rounded-lg bg-blue-950/70 text-blue-300 hover:text-blue-200 border border-blue-800/80 cursor-pointer flex items-center gap-1 text-xs"
                    title="Edit Case"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>

                  <button
                    disabled
                    className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-700 cursor-not-allowed"
                    title="Delete Case (Disabled)"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-rose-400 font-bold block mb-1">Problem:</span>
                  <span className="text-slate-300">{c.problem}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-sky-400 font-bold block mb-1">Diagnosis:</span>
                  <span className="text-slate-300">{c.diagnosis}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-emerald-400 font-bold block mb-1">Solution:</span>
                  <span className="text-slate-300">{c.solution}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Confirm Delete In-App Modal */}
      <ConfirmDeleteModal
        isOpen={!!deleteTarget}
        title="Delete Case Study?"
        itemName={deleteTarget?.name || 'this case'}
        itemType="case study"
        onConfirm={handleDeleteConfirmed}
        onClose={() => setDeleteTarget(null)}
        loading={isDeleting}
      />

    </div>
  );
};
