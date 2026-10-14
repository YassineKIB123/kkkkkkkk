'use client';

import React from 'react';
import { ToolDefinition } from '@/lib/types';
import { DynamicIcon } from './DynamicIcon';
import { ArrowUpRight } from 'lucide-react';

interface ToolsGridProps {
  tools: ToolDefinition[];
  onSelectTool: (tool: ToolDefinition) => void;
}

export function ToolsGrid({ tools, onSelectTool }: ToolsGridProps) {
  if (tools.length === 0) {
    return (
      <div className="py-20 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400">
          <DynamicIcon name="SearchX" className="h-8 w-8" />
        </div>
        <h3 className="mt-4 text-base font-semibold text-slate-900 dark:text-white">
          No matching PDF tools found
        </h3>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Try adjusting your search query or select another category filter.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* 6 columns on wide screens, 3 on md, 2 on sm, 1 on xs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => onSelectTool(tool)}
            className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-4.5 text-left shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-200/50 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700 dark:hover:shadow-black/40 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
          >
            <div>
              {/* Badge Icon */}
              <div className="flex items-center justify-between">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-110 ${tool.badgeBg}`}
                >
                  <DynamicIcon
                    name={tool.iconName}
                    className={`h-5 w-5 ${tool.badgeColor}`}
                  />
                </div>
                <div className="opacity-0 transition-opacity duration-200 group-hover:opacity-100 text-slate-400 group-hover:text-rose-500">
                  <ArrowUpRight className="h-4 w-4" />
                </div>
              </div>

              {/* Title */}
              <h3 className="mt-3.5 text-sm font-bold text-slate-900 group-hover:text-rose-600 dark:text-slate-100 dark:group-hover:text-rose-400 transition-colors line-clamp-1">
                {tool.name}
              </h3>

              {/* Short Description */}
              <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400 line-clamp-2">
                {tool.shortDescription}
              </p>
            </div>

            {/* Bottom Format Tag */}
            <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500">
              <span className="font-medium uppercase tracking-wider">
                {tool.acceptedFormats.join(' ')}
              </span>
              <span className="text-[10px] font-semibold text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity">
                Open →
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
