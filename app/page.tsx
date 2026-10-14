'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { ToolsGrid } from '@/components/ToolsGrid';
import { ToolWorkspace } from '@/components/ToolWorkspace';
import { FeatureHighlights } from '@/components/FeatureHighlights';
import { Footer } from '@/components/Footer';
import { SearchModal } from '@/components/SearchModal';
import { TOOLS_REGISTRY } from '@/lib/tools-registry';
import { ToolCategory, ToolDefinition } from '@/lib/types';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTool, setActiveTool] = useState<ToolDefinition | null>(null);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  // Sync with URL query parameter or hash if present
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const toolParam = params.get('tool');
      if (toolParam) {
        const found = TOOLS_REGISTRY.find((t) => t.id === toolParam);
        if (found) setActiveTool(found);
      }
    }
  }, []);

  const handleSelectTool = (tool: ToolDefinition) => {
    setActiveTool(tool);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('tool', tool.id);
      window.history.pushState({}, '', url);
    }
  };

  const handleGoHome = () => {
    setActiveTool(null);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.delete('tool');
      window.history.pushState({}, '', url);
    }
  };

  // Filter tools based on category and search query
  const filteredTools = useMemo(() => {
    return TOOLS_REGISTRY.filter((tool) => {
      const matchesCategory =
        selectedCategory === 'all' || tool.category === selectedCategory;

      const matchesSearch =
        searchQuery === '' ||
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.acceptedFormats.some((f) =>
          f.toLowerCase().includes(searchQuery.toLowerCase())
        );

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/40 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors">
      {/* Header */}
      <Header
        onSelectTool={handleSelectTool}
        onOpenSearch={() => setIsSearchModalOpen(true)}
        currentToolId={activeTool?.id}
        onGoHome={handleGoHome}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTool ? (
          <ToolWorkspace tool={activeTool} onBack={handleGoHome} />
        ) : (
          <>
            <Hero
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
            <ToolsGrid tools={filteredTools} onSelectTool={handleSelectTool} />
            <FeatureHighlights />
          </>
        )}
      </main>

      {/* Footer */}
      <Footer onSelectTool={handleSelectTool} onGoHome={handleGoHome} />

      {/* Quick Search Modal */}
      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onSelectTool={handleSelectTool}
      />
    </div>
  );
}
