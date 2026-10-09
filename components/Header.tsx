'use client';

import React, { useState, useEffect } from 'react';
import { TOOLS_REGISTRY, CATEGORIES_CONFIG } from '@/lib/tools-registry';
import { ToolDefinition } from '@/lib/types';
import { DynamicIcon } from './DynamicIcon';
import {
  FileText,
  Search,
  ChevronDown,
  Sun,
  Moon,
  Globe,
  Menu,
  X,
  Sparkles,
  Layers,
} from 'lucide-react';

interface HeaderProps {
  onSelectTool: (tool: ToolDefinition) => void;
  onOpenSearch: () => void;
  currentToolId?: string | null;
  onGoHome: () => void;
}

export function Header({
  onSelectTool,
  onOpenSearch,
  currentToolId,
  onGoHome,
}: HeaderProps) {
  const [isDark, setIsDark] = useState(false);
  const [convertOpen, setConvertOpen] = useState(false);
  const [allToolsOpen, setAllToolsOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('EN');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Check local storage or system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    } else {
      document.documentElement.classList.remove('dark');
      setIsDark(false);
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  const convertTools = TOOLS_REGISTRY.filter((t) => t.category === 'convert').slice(0, 8);

  const languages = [
    { code: 'EN', name: 'English' },
    { code: 'ES', name: 'Español' },
    { code: 'FR', name: 'Français' },
    { code: 'DE', name: 'Deutsch' },
    { code: 'JA', name: '日本語' },
    { code: 'PT', name: 'Português' },
  ];

  const handleToolClick = (toolId: string) => {
    const tool = TOOLS_REGISTRY.find((t) => t.id === toolId);
    if (tool) {
      onSelectTool(tool);
      setConvertOpen(false);
      setAllToolsOpen(false);
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/90 transition-colors">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Brand Logo */}
        <div className="flex items-center gap-8">
          <button
            onClick={onGoHome}
            className="group flex items-center gap-2.5 text-left focus:outline-none"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-rose-500 via-rose-600 to-red-600 text-white shadow-md shadow-rose-500/25 transition-transform group-hover:scale-105">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                PDF<span className="text-rose-600">Studio</span>
              </span>
              <span className="block text-[10px] font-medium uppercase tracking-wider text-slate-600 dark:text-slate-300">
                All-in-One Suite
              </span>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-1 md:flex">
            <button
              onClick={() => handleToolClick('merge-pdf')}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                currentToolId === 'merge-pdf'
                  ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400'
                  : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              Merge PDF
            </button>
            <button
              onClick={() => handleToolClick('split-pdf')}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                currentToolId === 'split-pdf'
                  ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400'
                  : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              Split PDF
            </button>
            <button
              onClick={() => handleToolClick('compress-pdf')}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                currentToolId === 'compress-pdf'
                  ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400'
                  : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              Compress PDF
            </button>

            {/* Convert Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setConvertOpen(!convertOpen);
                  setAllToolsOpen(false);
                }}
                className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800 transition-colors"
              >
                <span>Convert PDF</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${convertOpen ? 'rotate-180' : ''}`} />
              </button>

              {convertOpen && (
                <div className="absolute left-0 mt-2 w-64 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl dark:border-slate-800 dark:bg-slate-900 animate-in fade-in slide-in-from-top-2">
                  <div className="px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                    Popular Conversions
                  </div>
                  {convertTools.map((tool) => (
                    <button
                      key={tool.id}
                      onClick={() => handleToolClick(tool.id)}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800 transition-colors"
                    >
                      <div className={`p-1.5 rounded-lg ${tool.badgeBg}`}>
                        <DynamicIcon name={tool.iconName} className={`w-4 h-4 ${tool.badgeColor}`} />
                      </div>
                      <span className="font-medium">{tool.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* All PDF Tools Mega Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setAllToolsOpen(!allToolsOpen);
                  setConvertOpen(false);
                }}
                className="flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                <Layers className="h-4 w-4 text-rose-500" />
                <span>All PDF Tools</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${allToolsOpen ? 'rotate-180' : ''}`} />
              </button>

              {allToolsOpen && (
                <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-[760px] rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 animate-in fade-in slide-in-from-top-2">
                  <div className="grid grid-cols-3 gap-6">
                    {CATEGORIES_CONFIG.filter((c) => c.id !== 'all').map((cat) => (
                      <div key={cat.id} className="space-y-2">
                        <div className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                          {cat.name}
                        </div>
                        <div className="space-y-1">
                          {TOOLS_REGISTRY.filter((t) => t.category === cat.id)
                            .slice(0, 5)
                            .map((tool) => (
                              <button
                                key={tool.id}
                                onClick={() => handleToolClick(tool.id)}
                                className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-xs font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
                              >
                                <DynamicIcon name={tool.iconName} className="h-3.5 w-3.5 text-slate-600 dark:text-slate-300" />
                                <span className="truncate">{tool.name}</span>
                              </button>
                            ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs text-slate-600 dark:text-slate-300">
                    <span>Explore all 42 client-side secure tools</span>
                    <button
                      onClick={onGoHome}
                      className="font-medium text-rose-600 hover:underline dark:text-rose-400"
                    >
                      View Full Catalog →
                    </button>
                  </div>
                </div>
              )}
            </div>
          </nav>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Quick Search Button */}
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-600 hover:border-slate-300 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
          >
            <Search className="h-3.5 w-3.5 text-slate-600 dark:text-slate-300" />
            <span className="hidden sm:inline">Search tools</span>
            <kbd className="hidden rounded bg-white px-1.5 py-0.5 text-[10px] font-semibold text-slate-600 shadow-sm dark:bg-slate-700 dark:text-slate-300 sm:inline">
              ⌘K
            </kbd>
          </button>

          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1 rounded-xl p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
              title="Select Language"
            >
              <Globe className="h-4 w-4" />
              <span className="text-xs font-semibold">{currentLang}</span>
            </button>

            {langOpen && (
              <div className="absolute right-0 mt-2 w-36 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl dark:border-slate-800 dark:bg-slate-900 animate-in fade-in">
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setCurrentLang(l.code);
                      setLangOpen(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs ${
                      currentLang === l.code
                        ? 'bg-rose-50 font-semibold text-rose-600 dark:bg-rose-950/40 dark:text-rose-400'
                        : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span>{l.name}</span>
                    <span className="text-[10px] text-slate-600 dark:text-slate-300">{l.code}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDark ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4" />}
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 md:hidden"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="border-b border-slate-200 bg-white px-4 py-4 dark:border-slate-800 dark:bg-slate-900 md:hidden animate-in slide-in-from-top">
          <div className="space-y-1">
            <button
              onClick={() => handleToolClick('merge-pdf')}
              className="flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Merge PDF
            </button>
            <button
              onClick={() => handleToolClick('split-pdf')}
              className="flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Split PDF
            </button>
            <button
              onClick={() => handleToolClick('compress-pdf')}
              className="flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Compress PDF
            </button>
            <button
              onClick={() => handleToolClick('pdf-to-word')}
              className="flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              PDF to Word
            </button>
            <button
              onClick={() => handleToolClick('sign-pdf')}
              className="flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Sign PDF
            </button>
            <button
              onClick={onGoHome}
              className="flex w-full items-center rounded-lg px-3 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
            >
              Browse All 42 Tools
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
