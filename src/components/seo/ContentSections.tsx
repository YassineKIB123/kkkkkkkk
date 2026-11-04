import React from "react";
import Link from "next/link";
import type { ContentSection } from "@/lib/seo/pseo-content";

const linkClass =
  "inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50/70 px-3 py-1.5 text-xs font-medium text-slate-700 hover:border-rose-400 hover:bg-white hover:text-rose-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-rose-500 transition-colors";

export function LinkPills({ links }: { links: { href: string; label: string }[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {links.map((l) => (
        <Link key={l.href} href={l.href} className={linkClass}>
          {l.label}
        </Link>
      ))}
    </div>
  );
}

/** Server-rendered prose sections (headings, paragraphs, lists, tables, links). */
export function ContentSections({ sections }: { sections: ContentSection[] }) {
  if (sections.length === 0) return null;
  return (
    <div className="space-y-6">
      {sections.map((s) => (
        <section
          key={s.id}
          id={s.id}
          className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xs dark:border-slate-800 dark:bg-slate-900/50 space-y-3"
        >
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">{s.heading}</h2>
          {s.paragraphs?.map((p, i) => (
            <p key={i} className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              {p}
            </p>
          ))}
          {s.table && (
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left text-xs sm:text-sm">
                {s.table.caption && (
                  <caption className="caption-bottom px-3 py-2 text-left text-xs text-slate-500 dark:text-slate-400">
                    {s.table.caption}
                  </caption>
                )}
                <thead className="bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300">
                  <tr>
                    {s.table.headers.map((h) => (
                      <th key={h} scope="col" className="px-3 py-2 font-bold">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-600 dark:text-slate-400">
                  {s.table.rows.map((row, i) => (
                    <tr key={i}>
                      {row.map((cell, j) => (
                        <td key={j} className={`px-3 py-2 ${j === 0 ? "font-semibold text-slate-800 dark:text-slate-200" : ""}`}>
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {s.bullets && (
            <ul className="list-disc space-y-1.5 ps-5 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              {s.bullets.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          )}
          {s.ordered && (
            <ol className="list-decimal space-y-1.5 ps-5 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              {s.ordered.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ol>
          )}
          {s.links && s.links.length > 0 && <LinkPills links={s.links} />}
        </section>
      ))}
    </div>
  );
}

/** Numbered "how to" steps, server-rendered. */
export function StepsSection({ heading, steps }: { heading: string; steps: { title: string; desc: string }[] }) {
  if (steps.length === 0) return null;
  return (
    <section className="rounded-2xl border border-slate-200 bg-slate-50/60 p-6 sm:p-8 dark:border-slate-800 dark:bg-slate-900/40">
      <h2 className="text-lg font-extrabold text-slate-900 dark:text-white mb-5">{heading}</h2>
      <ol className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        {steps.map((s) => (
          <li key={s.title} className="space-y-1.5">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">{s.title}</h3>
            <p className="text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-400">{s.desc}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
