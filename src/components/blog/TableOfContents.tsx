"use client";

import React, { useEffect, useState } from "react";
import { TocHeading } from "@/lib/blog/types";
import { List, ChevronDown } from "lucide-react";

interface TableOfContentsProps {
  headings: TocHeading[];
}

export function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");
  const [isOpenMobile, setIsOpenMobile] = useState<boolean>(false);

  useEffect(() => {
    if (!headings || headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-90px 0px -65% 0px",
        threshold: 0,
      }
    );

    headings.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -90;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
      setIsOpenMobile(false);
    }
  };

  if (!headings || headings.length === 0) return null;

  return (
    <>
      {/* Mobile Collapsible Drawer */}
      <div className="lg:hidden mb-8 rounded-2xl border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-900/60">
        <button
          type="button"
          onClick={() => setIsOpenMobile(!isOpenMobile)}
          className="flex w-full items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <List className="h-4 w-4 text-rose-600" />
            Table of Contents
          </span>
          <ChevronDown
            className={`h-4 w-4 transition-transform duration-200 ${
              isOpenMobile ? "rotate-180" : ""
            }`}
          />
        </button>

        {isOpenMobile && (
          <nav className="mt-3.5 space-y-2 border-t border-slate-200/60 pt-3 text-xs dark:border-slate-800">
            {headings.map((h) => (
              <button
                key={h.id}
                type="button"
                onClick={() => scrollTo(h.id)}
                className={`block w-full text-left transition-colors cursor-pointer ${
                  h.level === 3 ? "pl-4 text-slate-500" : "font-medium"
                } ${
                  activeId === h.id
                    ? "font-bold text-rose-600 dark:text-rose-400"
                    : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                }`}
              >
                {h.text}
              </button>
            ))}
          </nav>
        )}
      </div>

      {/* Desktop Sticky Sidebar */}
      <aside className="hidden lg:block w-72 shrink-0">
        <div className="sticky top-24 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900/70">
          <p className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
            <List className="h-3.5 w-3.5 text-rose-600" />
            On This Page
          </p>

          <nav className="space-y-1 text-xs max-h-[calc(100vh-160px)] overflow-y-auto pr-1">
            {headings.map((h) => {
              const isActive = activeId === h.id;
              return (
                <button
                  key={h.id}
                  type="button"
                  onClick={() => scrollTo(h.id)}
                  className={`group block w-full text-left py-1.5 transition-all cursor-pointer ${
                    h.level === 3 ? "pl-3 text-[11px]" : "font-semibold"
                  } ${
                    isActive
                      ? "border-l-2 border-rose-600 pl-2.5 font-bold text-rose-600 dark:text-rose-400"
                      : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                  }`}
                >
                  <span className="line-clamp-2">{h.text}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
}
