'use client';

import React from 'react';
import { CATEGORIES_CONFIG, TOOLS_REGISTRY } from '@/lib/tools-registry';
import { ToolCategory } from '@/lib/types';
import { Search, Shield, Zap, Sparkles } from 'lucide-react';

interface HeroProps {
  selectedCategory: ToolCategory;
  onSelectCategory: (category: ToolCategory) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function Hero({
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
}: HeroProps) {
  const getCategoryCount = (catId: string) => {
    if (catId === 'all') return TOOLS_REGISTRY.length;
    return TOOLS_REGISTRY.filter((t) => t.category === catId).length;
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50/50 pt-10 pb-8 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 border-b border-slate-200/60 dark:border-slate-800/80">
      {/* Subtle background glow accents */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-30 dark:opacity-20">
        <div className="h-96 w-96 rounded-full bg-rose-400/20 blur-3xl"></div>
        <div className="h-80 w-80 -translate-x-32 rounded-full bg-indigo-400/20 blur-3xl"></div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        {/* Trust pill */}
        <div className="inline-flex items-center gap-2 rounded-full border border-rose-200/60 bg-rose-50/80 px-3.5 py-1 text-xs font-semibold text-rose-700 shadow-sm dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300 mb-5">
          <Shield className="h-3.5 w-3.5 text-rose-500" />
          <span>100% Client-Side Privacy • Zero Server Uploads • Unlimited Free Processing</span>
        </div>

        {/* Mandatory headline from prompt */}
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl dark:text-white">
          Every PDF Tool You Need, <span className="text-rose-600 dark:text-rose-500">All in One Place</span>
        </h1>

        {/* Mandatory supporting text from prompt */}
        <p className="mx-auto mt-3.5 max-w-2xl text-base text-slate-600 sm:text-lg dark:text-slate-300">
          Merge, split, compress, convert, edit, and organize your PDF files with powerful, easy-to-use tools.
        </p>

        {/* Search input bar */}
        <div className="mx-auto mt-7 max-w-xl">
          <div className="relative flex items-center shadow-sm">
            <Search className="pointer-events-none absolute left-4 h-5 w-5 text-slate-600 dark:text-slate-300" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search all 42 PDF tools (e.g., merge, compress, sign, excel)..."
              className="w-full rounded-2xl border border-slate-300 bg-white py-3.5 pl-12 pr-10 text-sm text-slate-900 placeholder-slate-600 focus:border-rose-500 focus:outline-none focus:ring-4 focus:ring-rose-500/10 dark:border-slate-700 dark:bg-slate-800/90 dark:text-white dark:placeholder-slate-400 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3.5 rounded-lg p-1 text-xs text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Category Pills Navigation */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
          {CATEGORIES_CONFIG.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const count = getCategoryCount(cat.id);

            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id as ToolCategory)}
                className={`group flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-rose-600 text-white shadow-md shadow-rose-600/25 scale-[1.02]'
                    : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/80 dark:bg-slate-800/80 dark:border-slate-700/80 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white'
                }`}
              >
                <span>{cat.name}</span>
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                    isSelected
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
