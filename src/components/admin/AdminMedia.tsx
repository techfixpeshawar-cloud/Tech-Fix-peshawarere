import React, { useState } from 'react';
import {
  Image as ImageIcon,
  Upload,
  Copy,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';

export const AdminMedia: React.FC = () => {
  const [copied, setCopied] = useState<string | null>(null);

  const defaultMedia = [
    {
      name: 'Technician Portrait (Safiullah)',
      url: '/technician.jpg',
      type: 'Primary Photo',
      dimensions: '800 x 1000',
    },
  ];

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
          <ImageIcon className="w-6 h-6 text-purple-400" />
          <span>Media & Image Assets</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-400">
          Static portraits, icons, and branding graphics used on the public website
        </p>
      </div>

      {/* Grid of Assets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {defaultMedia.map((m) => (
          <div
            key={m.url}
            className="glass-panel p-5 rounded-3xl border border-slate-800 space-y-4"
          >
            <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 relative group">
              <img
                src={m.url}
                alt={m.name}
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <a
                  href={m.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-500"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-white text-sm">{m.name}</h3>
              <div className="text-xs text-slate-400 flex items-center justify-between mt-1 font-mono">
                <span>{m.type}</span>
                <span>{m.dimensions}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <span className="font-mono text-xs text-blue-400 truncate max-w-[180px]">
                {m.url}
              </span>
              <button
                onClick={() => handleCopy(m.url)}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                title="Copy relative path"
              >
                {copied === m.url ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
