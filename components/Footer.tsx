'use client';

import React from 'react';
import { CATEGORIES_CONFIG, TOOLS_REGISTRY } from '@/lib/tools-registry';
import { ToolDefinition } from '@/lib/types';
import { FileText, Shield, Heart } from 'lucide-react';

interface FooterProps {
  onSelectTool: (tool: ToolDefinition) => void;
  onGoHome: () => void;
}

export function Footer({ onSelectTool, onGoHome }: FooterProps) {
  const handleToolClick = (toolId: string) => {
    const tool = TOOLS_REGISTRY.find((t) => t.id === toolId);
    if (tool) onSelectTool(tool);
  };

  return (
    <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 transition-colors">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-2">
            <button
              onClick={onGoHome}
              className="flex items-center gap-2.5 focus:outline-none"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-rose-500 to-red-600 text-white shadow-sm shadow-rose-500/30">
                <FileText className="h-4.5 w-4.5" />
              </div>
              <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                PDF<span className="text-rose-600">Studio</span>
              </span>
            </button>
            <p className="mt-3 max-w-sm text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              A complete, professional, platform-independent PDF tool suite. Merge, split, compress, convert, edit, sign, and protect your documents with 100% client-side privacy.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
              <Shield className="h-4 w-4 text-emerald-500" />
              <span>Zero server document retention</span>
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
              Organize & Optimize
            </h4>
            <ul className="mt-3 space-y-2 text-xs">
              {['merge-pdf', 'split-pdf', 'organize-pdf', 'compress-pdf', 'flatten-pdf'].map((id) => {
                const tool = TOOLS_REGISTRY.find((t) => t.id === id);
                if (!tool) return null;
                return (
                  <li key={id}>
                    <button
                      onClick={() => handleToolClick(id)}
                      className="text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 transition-colors"
                    >
                      {tool.name}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
              Convert PDF
            </h4>
            <ul className="mt-3 space-y-2 text-xs">
              {['pdf-to-word', 'word-to-pdf', 'pdf-to-excel', 'pdf-to-jpg', 'image-to-pdf'].map((id) => {
                const tool = TOOLS_REGISTRY.find((t) => t.id === id);
                if (!tool) return null;
                return (
                  <li key={id}>
                    <button
                      onClick={() => handleToolClick(id)}
                      className="text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 transition-colors"
                    >
                      {tool.name}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
              Edit & Security
            </h4>
            <ul className="mt-3 space-y-2 text-xs">
              {['sign-pdf', 'watermark-pdf', 'protect-pdf', 'unlock-pdf', 'redact-pdf'].map((id) => {
                const tool = TOOLS_REGISTRY.find((t) => t.id === id);
                if (!tool) return null;
                return (
                  <li key={id}>
                    <button
                      onClick={() => handleToolClick(id)}
                      className="text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 transition-colors"
                    >
                      {tool.name}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-100 pt-6 text-xs text-slate-400 sm:flex-row dark:border-slate-800">
          <p>© {new Date().getFullYear()} PDFStudio. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Container-ready</span>
            <span>•</span>
            <span>Next.js App Router</span>
            <span>•</span>
            <span>Client & Server Portability</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
