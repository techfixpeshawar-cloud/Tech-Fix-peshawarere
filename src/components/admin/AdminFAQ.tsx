import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FAQItem } from '../../types';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';
import {
  HelpCircle,
  Plus,
  Edit,
  Trash2,
  Save,
  CheckCircle2,
  ChevronDown,
  EyeOff,
  Globe,
} from 'lucide-react';

export const AdminFAQ: React.FC = () => {
  const { faq, addFAQ, updateFAQ, deleteFAQ } = useApp();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [category, setCategory] = useState('General');
  const [published, setPublished] = useState(true);

  const startEdit = (item: FAQItem) => {
    setEditingId(item.id);
    setIsCreating(false);
    setQuestion(item.question);
    setAnswer(item.answer);
    setCategory(item.category || 'General');
    setPublished(item.published ?? true);
  };

  const startCreate = () => {
    setEditingId(null);
    setIsCreating(true);
    setQuestion('');
    setAnswer('');
    setCategory('General');
    setPublished(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !answer.trim()) return;

    console.log("FAQ Save - Attempting to save FAQ item:", { question, answer, category, published });
    
    try {
      if (editingId) {
        await updateFAQ(editingId, { question, answer, category, published, isPublished: published } as any);
        console.log("FAQ Save - Successfully updated FAQ item:", editingId);
        setEditingId(null);
      } else {
        await addFAQ({ question, answer, category, published, isPublished: published } as any);
        console.log("FAQ Save - Successfully added new FAQ item");
        setIsCreating(false);
      }
    } catch (error) {
      console.error("FAQ Save - Error saving FAQ item:", error);
    }
  };

  const handleTogglePublished = async (item: FAQItem) => {
    const next = !item.published;
    try {
      await updateFAQ(item.id, { published: next, isPublished: next } as any);
    } catch (err) {
      console.error('Failed to toggle FAQ status:', err);
    }
  };

  const handleDeleteConfirmed = async () => {
    if (!deleteTarget) return;
    try {
      setIsDeleting(true);
      await deleteFAQ(deleteTarget.id);
      setDeleteTarget(null);
    } catch (err) {
      console.error('Failed to delete FAQ:', err);
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
            <HelpCircle className="w-6 h-6 text-blue-400" />
            <span>Frequently Asked Questions Manager</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Add, update, or remove answers displayed in the public accordion
          </p>
        </div>

        <button
          onClick={startCreate}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-blue-600/30 cursor-pointer transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New FAQ</span>
        </button>
      </div>

      {/* Form modal/inline */}
      {(isCreating || editingId) && (
        <div className="glass-panel-glow p-6 rounded-3xl border border-blue-500/50 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="font-bold text-white text-sm">
              {isCreating ? 'Create New FAQ' : 'Edit FAQ Item'}
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
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Question *</label>
              <input
                type="text"
                required
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="e.g. Do you service laptops on-site?"
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Answer *</label>
              <textarea
                rows={4}
                required
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Write detailed, helpful answer..."
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white leading-relaxed"
              />
            </div>

            <div className="flex items-center gap-2">
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
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold"
              >
                Save To Database
              </button>
            </div>
          </form>
        </div>
      )}

      {/* FAQ Items List */}
      <div className="space-y-3">
        {faq.map((item, idx) => (
          <div
            key={item.id}
            className="glass-panel p-5 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all space-y-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-lg bg-blue-950 border border-blue-800/60 flex items-center justify-center text-blue-400 font-mono text-xs font-bold shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <div>
                  <h4 className="font-bold text-white text-sm">{item.question}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${item.published ? 'bg-emerald-950 text-emerald-400' : 'bg-rose-950 text-rose-400'}`}>
                      {item.published ? 'PUBLISHED' : 'UNPUBLISHED'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed whitespace-pre-line">
                    {item.answer}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {/* 1-click Quick Toggle Publish / Unpublish */}
                <button
                  onClick={() => handleTogglePublished(item)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    item.published
                      ? 'bg-amber-950/60 hover:bg-amber-900/80 text-amber-300 border border-amber-800/60'
                      : 'bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-800/60'
                  }`}
                  title={item.published ? 'Unpublish FAQ (moves to Drafts/Unpublished)' : 'Publish FAQ live to public website'}
                >
                  {item.published ? (
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
                  onClick={() => startEdit(item)}
                  className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                  title="Edit FAQ"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button
                  disabled
                  className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-700"
                  title="Delete FAQ (Disabled)"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Confirm Delete In-App Modal */}
      <ConfirmDeleteModal
        isOpen={!!deleteTarget}
        title="Delete FAQ Item?"
        itemName={deleteTarget?.name || 'this question'}
        itemType="FAQ entry"
        onConfirm={handleDeleteConfirmed}
        onClose={() => setDeleteTarget(null)}
        loading={isDeleting}
      />

    </div>
  );
};
