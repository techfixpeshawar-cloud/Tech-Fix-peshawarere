import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Service, FAQItem, RealServiceCase, ServiceArea } from '../../types';
import {
  Layers,
  HelpCircle,
  FileText,
  Globe,
  CheckCircle2,
  EyeOff,
  Search,
  ArrowRight,
  Filter,
  DollarSign,
  Clock,
  AlertCircle,
  ExternalLink,
  Tag,
  Sparkles,
  RefreshCw,
  MapPin,
} from 'lucide-react';

interface AdminUnpublishedProps {
  onNavigate?: (tab: string) => void;
}

type TabType = 'all' | 'services' | 'faq' | 'cases' | 'areas';

export const AdminUnpublished: React.FC<AdminUnpublishedProps> = ({ onNavigate }) => {
  const {
    services,
    faq,
    faqs,
    cases,
    areas,
    updateService,
    updateFAQ,
    updateCase,
    updateArea,
    refreshPublicData,
  } = useApp();

  const [activeFilter, setActiveFilter] = useState<TabType>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [publishingId, setPublishingId] = useState<string | null>(null);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  // Safely grab FAQs from either alias
  const allFaqs = faq || faqs || [];

  // Filter unpublished items comprehensively across all conventions:
  // - Services: status !== 'published' OR published === false OR isPublished === false
  // - FAQs: published === false OR isPublished === false OR status === 'draft' / 'unpublished'
  // - Cases: published === false OR isPublished === false OR status === 'draft' / 'unpublished'
  const unpublishedServices = (services || []).filter(
    s =>
      s.status === 'draft' ||
      s.status === 'unpublished' ||
      s.status === 'archived' ||
      (s as any).published === false ||
      (s as any).isPublished === false
  );

  const unpublishedFaqs = allFaqs.filter(
    f =>
      f.published === false ||
      (f as any).isPublished === false ||
      (f as any).status === 'draft' ||
      (f as any).status === 'unpublished'
  );

  const unpublishedCases = (cases || []).filter(
    c =>
      c.published === false ||
      (c as any).isPublished === false ||
      (c as any).status === 'draft' ||
      (c as any).status === 'unpublished'
  );

  const unpublishedAreas = (areas || []).filter(
    a =>
      a.status === 'inactive' ||
      a.status === 'draft' ||
      a.status === 'unpublished' ||
      a.active === false ||
      (a as any).published === false
  );

  const totalUnpublished =
    unpublishedServices.length +
    unpublishedFaqs.length +
    unpublishedCases.length +
    unpublishedAreas.length;

  console.log('Unpublished Debug Log:', {
    totalUnpublished,
    unpublishedServicesCount: unpublishedServices.length,
    unpublishedFaqsCount: unpublishedFaqs.length,
    unpublishedCasesCount: unpublishedCases.length,
    unpublishedAreasCount: unpublishedAreas.length,
  });

  const showFeedback = (msg: string) => {
    setActionFeedback(msg);
    setTimeout(() => setActionFeedback(null), 4000);
  };

  // 1-Click Handlers to Publish Live
  const handlePublishService = async (service: Service) => {
    try {
      setPublishingId(service.id);
      await updateService(service.id, {
        status: 'published',
        published: true,
        isPublished: true,
      } as any);
      showFeedback(`"${service.name}" is now published live on the website!`);
    } catch (err) {
      console.error('Failed to publish service:', err);
      showFeedback('Failed to publish service. Please try again.');
    } finally {
      setPublishingId(null);
    }
  };

  const handlePublishFAQ = async (item: FAQItem) => {
    try {
      setPublishingId(item.id);
      await updateFAQ(item.id, {
        published: true,
        isPublished: true,
      } as any);
      showFeedback(`FAQ "${item.question.slice(0, 35)}..." is now live!`);
    } catch (err) {
      console.error('Failed to publish FAQ:', err);
      showFeedback('Failed to publish FAQ. Please try again.');
    } finally {
      setPublishingId(null);
    }
  };

  const handlePublishCase = async (c: RealServiceCase) => {
    try {
      setPublishingId(c.id);
      await updateCase(c.id, {
        published: true,
        isPublished: true,
      } as any);
      showFeedback(`Case "${c.title}" is now published live on the website!`);
    } catch (err) {
      console.error('Failed to publish case:', err);
      showFeedback('Failed to publish case. Please try again.');
    } finally {
      setPublishingId(null);
    }
  };

  const handlePublishArea = async (area: ServiceArea) => {
    try {
      setPublishingId(area.id);
      await updateArea(area.id, {
        status: 'active',
        active: true,
      } as any);
      showFeedback(`Coverage area "${area.name}" is now live and published!`);
    } catch (err) {
      console.error('Failed to publish area:', err);
      showFeedback('Failed to publish area. Please try again.');
    } finally {
      setPublishingId(null);
    }
  };

  // Switch service between Draft and Unpublished
  const handleToggleServiceStatus = async (
    service: Service,
    newStatus: 'draft' | 'unpublished'
  ) => {
    try {
      await updateService(service.id, {
        status: newStatus,
        published: false,
        isPublished: false,
      } as any);
      showFeedback(`Status updated to ${newStatus}`);
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  // Filter by search query
  const searchLower = searchTerm.toLowerCase();

  const filteredServices = unpublishedServices.filter(
    s =>
      s.name.toLowerCase().includes(searchLower) ||
      s.category.toLowerCase().includes(searchLower) ||
      (s.shortDescription && s.shortDescription.toLowerCase().includes(searchLower))
  );

  const filteredFaqs = unpublishedFaqs.filter(
    f =>
      f.question.toLowerCase().includes(searchLower) ||
      f.answer.toLowerCase().includes(searchLower) ||
      (f.category && f.category.toLowerCase().includes(searchLower))
  );

  const filteredCases = unpublishedCases.filter(
    c =>
      c.title.toLowerCase().includes(searchLower) ||
      c.problem.toLowerCase().includes(searchLower) ||
      c.serviceType.toLowerCase().includes(searchLower)
  );

  const filteredAreas = unpublishedAreas.filter(
    a =>
      a.name.toLowerCase().includes(searchLower) ||
      (a.notes && a.notes.toLowerCase().includes(searchLower)) ||
      String(a.travelFee).includes(searchLower)
  );

  return (
    <div className="space-y-6">
      
      {/* Top Notification / Toast Feedback */}
      {actionFeedback && (
        <div className="p-3.5 rounded-2xl bg-emerald-950/90 border border-emerald-500/50 text-emerald-200 text-xs font-semibold flex items-center justify-between shadow-lg shadow-emerald-950/40 animate-fade-in">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{actionFeedback}</span>
          </div>
          <button
            onClick={() => setActionFeedback(null)}
            className="text-emerald-400 hover:text-emerald-200 text-xs font-bold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
              <EyeOff className="w-6 h-6 text-amber-400" />
              <span>Drafts & Unpublished Content</span>
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
              {totalUnpublished} Items
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Safely stored in your database but hidden from public visitors. Review, edit, or click "Publish Live" to immediately restore.
          </p>
        </div>

        <button
          onClick={() => refreshPublicData()}
          className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer self-start sm:self-auto"
          title="Refresh unpublished list from database"
        >
          <RefreshCw className="w-3.5 h-3.5 text-blue-400" />
          <span>Sync Database</span>
        </button>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <button
          onClick={() => setActiveFilter('all')}
          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
            activeFilter === 'all'
              ? 'bg-blue-950/60 border-blue-600 shadow-md shadow-blue-900/20'
              : 'glass-panel border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="text-[11px] font-medium text-slate-400">All Drafts / Hidden</div>
          <div className="text-xl font-extrabold text-white mt-1 font-mono">
            {totalUnpublished}
          </div>
        </button>

        <button
          onClick={() => setActiveFilter('services')}
          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
            activeFilter === 'services'
              ? 'bg-blue-950/60 border-blue-600 shadow-md shadow-blue-900/20'
              : 'glass-panel border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="text-[11px] font-medium text-slate-400 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-blue-400" />
            <span>Services</span>
          </div>
          <div className="text-xl font-extrabold text-white mt-1 font-mono">
            {unpublishedServices.length}
          </div>
        </button>

        <button
          onClick={() => setActiveFilter('faq')}
          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
            activeFilter === 'faq'
              ? 'bg-blue-950/60 border-blue-600 shadow-md shadow-blue-900/20'
              : 'glass-panel border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="text-[11px] font-medium text-slate-400 flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-purple-400" />
            <span>FAQs</span>
          </div>
          <div className="text-xl font-extrabold text-white mt-1 font-mono">
            {unpublishedFaqs.length}
          </div>
        </button>

        <button
          onClick={() => setActiveFilter('cases')}
          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
            activeFilter === 'cases'
              ? 'bg-blue-950/60 border-blue-600 shadow-md shadow-blue-900/20'
              : 'glass-panel border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="text-[11px] font-medium text-slate-400 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-emerald-400" />
            <span>Cases</span>
          </div>
          <div className="text-xl font-extrabold text-white mt-1 font-mono">
            {unpublishedCases.length}
          </div>
        </button>

        <button
          onClick={() => setActiveFilter('areas')}
          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
            activeFilter === 'areas'
              ? 'bg-blue-950/60 border-blue-600 shadow-md shadow-blue-900/20'
              : 'glass-panel border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="text-[11px] font-medium text-slate-400 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-rose-400" />
            <span>Service Areas</span>
          </div>
          <div className="text-xl font-extrabold text-white mt-1 font-mono">
            {unpublishedAreas.length}
          </div>
        </button>
      </div>

      {/* Search Bar */}
      <div className="glass-panel p-3.5 rounded-2xl border border-slate-800 flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-500 shrink-0 ml-1" />
        <input
          type="text"
          placeholder="Filter unpublished items by name, question, category or issue..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="text-xs text-slate-400 hover:text-white px-2 py-0.5 rounded bg-slate-800"
          >
            Clear
          </button>
        )}
      </div>

      {/* Reassuring Empty State */}
      {totalUnpublished === 0 && (
        <div className="glass-panel p-12 rounded-3xl border border-slate-800 text-center space-y-4 max-w-xl mx-auto my-8">
          <div className="w-14 h-14 rounded-2xl bg-emerald-950/60 border border-emerald-800/60 flex items-center justify-center mx-auto text-emerald-400">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">All Content is Live & Published</h3>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              Every Service, FAQ item, and Case Study is currently live on your public website.
              When you toggle any item to "Unpublished" or "Draft", it will automatically appear here with a 1-click restore button.
            </p>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-2.5">
            <button
              onClick={() => onNavigate?.('services')}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5 text-blue-400" />
              <span>Services Catalog</span>
            </button>
            <button
              onClick={() => onNavigate?.('faq')}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5 text-purple-400" />
              <span>FAQ Manager</span>
            </button>
            <button
              onClick={() => onNavigate?.('cases')}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-emerald-400" />
              <span>Service Cases</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Content Sections */}
      <div className="space-y-6">

        {/* --- 1. UNPUBLISHED SERVICES --- */}
        {(activeFilter === 'all' || activeFilter === 'services') && filteredServices.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-400" />
                <h3 className="font-bold text-white text-sm">Unpublished Services</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-950 text-blue-300 border border-blue-800">
                  {filteredServices.length}
                </span>
              </div>

              {onNavigate && (
                <button
                  onClick={() => onNavigate('services')}
                  className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-semibold"
                >
                  <span>Open Services Manager</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredServices.map((s) => (
                <div
                  key={s.id}
                  className="glass-panel p-5 rounded-2xl border border-slate-800/90 hover:border-slate-700 transition-all space-y-3 relative overflow-hidden"
                >
                  {/* Subtle top indicator */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-amber-500/40"></div>

                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">
                          {s.category}
                        </span>
                        <span
                          className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase border ${
                            s.status === 'draft'
                              ? 'bg-amber-950/80 text-amber-300 border-amber-800/80'
                              : s.status === 'unpublished'
                              ? 'bg-rose-950/80 text-rose-300 border-rose-800/80'
                              : 'bg-slate-800 text-slate-300 border-slate-700'
                          }`}
                        >
                          {s.status}
                        </span>
                      </div>
                      <h4 className="font-bold text-white text-base leading-snug">{s.name}</h4>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="font-mono font-bold text-white text-sm">
                        Rs. {s.startingPrice}
                      </div>
                      <div className="text-[10px] text-slate-400 flex items-center justify-end gap-1 mt-0.5">
                        <Clock className="w-3 h-3 text-slate-500" />
                        <span>{s.serviceDuration}</span>
                      </div>
                    </div>
                  </div>

                  {s.shortDescription && (
                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                      {s.shortDescription}
                    </p>
                  )}

                  {/* Actions */}
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                      <span className="text-slate-500">Status:</span>
                      <button
                        onClick={() =>
                          handleToggleServiceStatus(
                            s,
                            s.status === 'draft' ? 'unpublished' : 'draft'
                          )
                        }
                        className="text-amber-400 hover:underline font-medium cursor-pointer"
                        title="Toggle between Draft and Unpublished"
                      >
                        {s.status === 'draft' ? 'Switch to Unpublished' : 'Switch to Draft'}
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      {onNavigate && (
                        <button
                          onClick={() => onNavigate('services')}
                          className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <ExternalLink className="w-3 h-3 text-blue-400" />
                          <span>Edit</span>
                        </button>
                      )}

                      <button
                        onClick={() => handlePublishService(s)}
                        disabled={publishingId === s.id}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-600/20 cursor-pointer transition-all"
                      >
                        <Globe className="w-3.5 h-3.5" />
                        <span>{publishingId === s.id ? 'Publishing...' : 'Publish Live'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- 2. UNPUBLISHED FAQS --- */}
        {(activeFilter === 'all' || activeFilter === 'faq') && filteredFaqs.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-purple-400" />
                <h3 className="font-bold text-white text-sm">Unpublished FAQs</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-950 text-purple-300 border border-purple-800">
                  {filteredFaqs.length}
                </span>
              </div>

              {onNavigate && (
                <button
                  onClick={() => onNavigate('faq')}
                  className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 font-semibold"
                >
                  <span>Open FAQ Manager</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>

            <div className="space-y-2.5">
              {filteredFaqs.map((f) => (
                <div
                  key={f.id}
                  className="glass-panel p-4 rounded-2xl border border-slate-800/90 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-purple-400 font-bold uppercase">
                        {f.category || 'General'}
                      </span>
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-rose-950/80 text-rose-300 border border-rose-800/80">
                        Hidden from Public
                      </span>
                    </div>
                    <h4 className="font-bold text-white text-sm">{f.question}</h4>
                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                      {f.answer}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    {onNavigate && (
                      <button
                        onClick={() => onNavigate('faq')}
                        className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <ExternalLink className="w-3 h-3 text-purple-400" />
                        <span>Edit</span>
                      </button>
                    )}

                    <button
                      onClick={() => handlePublishFAQ(f)}
                      disabled={publishingId === f.id}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-600/20 cursor-pointer transition-all"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span>{publishingId === f.id ? 'Publishing...' : 'Publish Live'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- 3. UNPUBLISHED SERVICE CASES --- */}
        {(activeFilter === 'all' || activeFilter === 'cases') && filteredCases.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-400" />
                <h3 className="font-bold text-white text-sm">Unpublished Service Cases</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                  {filteredCases.length}
                </span>
              </div>

              {onNavigate && (
                <button
                  onClick={() => onNavigate('cases')}
                  className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-semibold"
                >
                  <span>Open Cases Manager</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>

            <div className="space-y-2.5">
              {filteredCases.map((c) => (
                <div
                  key={c.id}
                  className="glass-panel p-5 rounded-2xl border border-slate-800/90 hover:border-slate-700 transition-all space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase">
                          {c.serviceType} • {c.date}
                        </span>
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-rose-950/80 text-rose-300 border border-rose-800/80">
                          Hidden from Public
                        </span>
                      </div>
                      <h4 className="font-bold text-white text-base">{c.title}</h4>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {onNavigate && (
                        <button
                          onClick={() => onNavigate('cases')}
                          className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <ExternalLink className="w-3 h-3 text-emerald-400" />
                          <span>Edit</span>
                        </button>
                      )}

                      <button
                        onClick={() => handlePublishCase(c)}
                        disabled={publishingId === c.id}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-600/20 cursor-pointer transition-all"
                      >
                        <Globe className="w-3.5 h-3.5" />
                        <span>{publishingId === c.id ? 'Publishing...' : 'Publish Live'}</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                      <span className="text-rose-400 font-bold block mb-0.5">Problem Reported:</span>
                      <p className="text-slate-300 line-clamp-2">{c.problem}</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                      <span className="text-emerald-400 font-bold block mb-0.5">Solution Delivered:</span>
                      <p className="text-slate-300 line-clamp-2">{c.solution}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- 4. UNPUBLISHED / DRAFT PESHAWAR SERVICE AREAS & TRAVEL FEES --- */}
        {(activeFilter === 'all' || activeFilter === 'areas') && (
          filteredAreas.length > 0 ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-rose-400" />
                  <h3 className="font-bold text-white text-sm">Peshawar Service Areas & Travel Fees (Draft & Inactive)</h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-950 text-rose-300 border border-rose-800">
                    {filteredAreas.length}
                  </span>
                </div>

                {onNavigate && (
                  <button
                    onClick={() => onNavigate('areas')}
                    className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 font-semibold cursor-pointer"
                  >
                    <span>Open Areas & Travel Fees Manager</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>

              <div className="space-y-2.5">
                {filteredAreas.map((a) => (
                  <div
                    key={a.id}
                    className="glass-panel p-4 rounded-2xl border border-slate-800/90 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-rose-400 font-bold uppercase">
                          Rs. {a.travelFee} Travel Fee
                        </span>
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-rose-950/80 text-rose-300 border border-rose-800/80">
                          {a.status === 'draft' ? 'Draft Locality' : 'Hidden from Booking Form'}
                        </span>
                      </div>
                      <h4 className="font-bold text-white text-sm">{a.name}</h4>
                      {a.notes && (
                        <p className="text-xs text-slate-400 line-clamp-1">
                          {a.notes}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      {onNavigate && (
                        <button
                          onClick={() => onNavigate('areas')}
                          className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <ExternalLink className="w-3 h-3 text-rose-400" />
                          <span>Edit</span>
                        </button>
                      )}

                      <button
                        onClick={() => handlePublishArea(a)}
                        disabled={publishingId === a.id}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-600/20 cursor-pointer transition-all"
                      >
                        <Globe className="w-3.5 h-3.5" />
                        <span>{publishingId === a.id ? 'Publishing...' : 'Publish Live'}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : activeFilter === 'areas' ? (
            <div className="glass-panel p-8 rounded-2xl border border-slate-800 text-center space-y-3">
              <MapPin className="w-8 h-8 text-rose-400 mx-auto opacity-60" />
              <h4 className="text-sm font-bold text-white">All Peshawar Service Areas Are Currently Active & Published</h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                All coverage localities (Hayatabad, University Town, Cantt, Saddar, Warsak Road, etc.) are live on the public booking form.
              </p>
              {onNavigate && (
                <button
                  onClick={() => onNavigate('areas')}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold inline-flex items-center gap-2 cursor-pointer mt-2"
                >
                  <MapPin className="w-3.5 h-3.5 text-rose-400" />
                  <span>Manage Service Areas & Travel Fees</span>
                </button>
              )}
            </div>
          ) : null
        )}

      </div>

    </div>
  );
};
