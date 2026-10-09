'use client';

import React, { useState, useEffect } from 'react';
import { TOOLS_REGISTRY } from '@/lib/tools-registry';
import { ToolDefinition } from '@/lib/types';
import { DynamicIcon } from './DynamicIcon';
import { Search, X, ArrowRight } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTool: (tool: ToolDefinition) => void;
}

export function SearchModal({ isOpen, onClose, onSelectTool }: SearchModalProps) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open handled by parent or state
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filtered = TOOLS_REGISTRY.filter(
    (t) =>
      t.name.toLowerCase().includes(query.toLowerCase()) ||
      t.shortDescription.toLowerCase().includes(query.toLowerCase()) ||
      t.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-20 sm:pt-24 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-3 dark:border-slate-800">
          <Search className="h-5 w-5 text-slate-400" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a tool name (e.g. merge, compress, protect, excel)..."
            className="flex-1 bg-transparent text-sm text-slate-900 placeholder-slate-400 focus:outline-none dark:text-white"
          />
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-3 max-h-80 overflow-y-auto space-y-1">
          {filtered.length === 0 ? (
            <p className="py-6 text-center text-xs text-slate-400">
              No matching tools found for "{query}"
            </p>
          ) : (
            filtered.map((tool) => (
              <button
                key={tool.id}
                onClick={() => {
                  onSelectTool(tool);
                  onClose();
                }}
                className="flex w-full items-center justify-between rounded-xl p-2.5 text-left hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${tool.badgeBg}`}>
                    <DynamicIcon name={tool.iconName} className={`w-4 h-4 ${tool.badgeColor}`} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-rose-600 dark:text-slate-100 dark:group-hover:text-rose-400">
                      {tool.name}
                    </h4>
                    <p className="text-[11px] text-slate-400 line-clamp-1">
                      {tool.shortDescription}
                    </p>
                  </div>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-slate-300 group-hover:text-rose-500 transition-colors" />
              </button>
            ))
          )}
        </div>

        <div className="mt-3 border-t border-slate-100 pt-2 flex items-center justify-between text-[11px] text-slate-400 dark:border-slate-800">
          <span>Press ESC to close</span>
          <span>{filtered.length} tools available</span>
        </div>
      </div>
    </div>
  );
}
