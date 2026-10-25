import React from "react";
import { ArticleBlock, ToolCtaConfig } from "@/lib/blog/types";
import { ArticleToolCta } from "./ArticleToolCta";
import { ShieldCheck, AlertCircle, Info, Lightbulb } from "lucide-react";

interface ArticleRendererProps {
  blocks: ArticleBlock[];
  defaultToolCta: ToolCtaConfig;
}

export function ArticleRenderer({ blocks, defaultToolCta }: ArticleRendererProps) {
  return (
    <div className="space-y-6 text-slate-800 dark:text-slate-200 text-sm sm:text-base leading-relaxed">
      {blocks.map((block, index) => {
        switch (block.type) {
          case "paragraph":
            return (
              <p
                key={index}
                className="leading-relaxed text-slate-700 dark:text-slate-300"
              >
                {block.text}
              </p>
            );

          case "heading2":
            return (
              <h2
                key={index}
                id={block.id}
                className="scroll-mt-24 pt-6 text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2.5"
              >
                {block.text}
              </h2>
            );

          case "heading3":
            return (
              <h3
                key={index}
                id={block.id}
                className="scroll-mt-24 pt-3 text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white"
              >
                {block.text}
              </h3>
            );

          case "callout": {
            const icons = {
              security: <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0" />,
              tip: <Lightbulb className="h-5 w-5 text-amber-500 shrink-0" />,
              warning: <AlertCircle className="h-5 w-5 text-rose-600 shrink-0" />,
              info: <Info className="h-5 w-5 text-blue-600 shrink-0" />,
            };
            const borders = {
              security:
                "border-emerald-200 bg-emerald-50/60 dark:border-emerald-900/60 dark:bg-emerald-950/20",
              tip:
                "border-amber-200 bg-amber-50/60 dark:border-amber-900/60 dark:bg-amber-950/20",
              warning:
                "border-rose-200 bg-rose-50/60 dark:border-rose-900/60 dark:bg-rose-950/20",
              info:
                "border-blue-200 bg-blue-50/60 dark:border-blue-900/60 dark:bg-blue-950/20",
            };
            return (
              <div
                key={index}
                className={`my-6 flex items-start gap-3.5 rounded-2xl border p-4 sm:p-5 text-xs sm:text-sm ${borders[block.variant]}`}
              >
                {icons[block.variant]}
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-900 dark:text-white">
                    {block.title}
                  </h4>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    {block.text}
                  </p>
                </div>
              </div>
            );
          }

          case "step":
            return (
              <div
                key={index}
                className="my-4 flex items-start gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 dark:border-slate-800 dark:bg-slate-900/50 shadow-2xs"
              >
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-rose-600 text-xs font-bold text-white">
                  {block.number}
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                    {block.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {block.text}
                  </p>
                </div>
              </div>
            );

          case "toolCta":
            return (
              <ArticleToolCta
                key={index}
                cta={
                  block.customTitle
                    ? {
                        ...defaultToolCta,
                        title: block.customTitle,
                        description: block.customDesc || defaultToolCta.description,
                      }
                    : defaultToolCta
                }
              />
            );

          case "list":
            return block.ordered ? (
              <ol
                key={index}
                className="list-decimal pl-6 space-y-2 text-slate-700 dark:text-slate-300 my-4"
              >
                {block.items.map((item, iIdx) => (
                  <li key={iIdx} className="leading-relaxed">
                    {item}
                  </li>
                ))}
              </ol>
            ) : (
              <ul
                key={index}
                className="list-disc pl-6 space-y-2 text-slate-700 dark:text-slate-300 my-4"
              >
                {block.items.map((item, iIdx) => (
                  <li key={iIdx} className="leading-relaxed">
                    {item}
                  </li>
                ))}
              </ul>
            );

          case "comparisonTable":
            return (
              <div
                key={index}
                className="my-6 overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800"
              >
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-slate-50 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
                    <tr>
                      {block.headers.map((h, hIdx) => (
                        <th key={hIdx} className="px-4 py-3 font-bold">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {block.rows.map((row, rIdx) => (
                      <tr
                        key={rIdx}
                        className="hover:bg-slate-50/50 dark:hover:bg-slate-900/40"
                      >
                        {row.map((cell, cIdx) => (
                          <td
                            key={cIdx}
                            className="px-4 py-3 text-slate-600 dark:text-slate-400"
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );

          case "faq":
            return (
              <div key={index} className="my-8 space-y-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Frequently Asked Questions
                </h3>
                <div className="divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-900/50 shadow-2xs">
                  {block.items.map((item, fIdx) => (
                    <div key={fIdx} className="py-4 first:pt-0 last:pb-0">
                      <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                        {item.question}
                      </h4>
                      <p className="mt-1.5 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                        {item.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}
