import React from "react";
import { ArticleBlock, ToolCtaConfig } from "@/lib/blog/types";
import { ArticleToolCta } from "./ArticleToolCta";
import { ShieldCheck, AlertCircle, Info, Lightbulb, Terminal } from "lucide-react";

interface ArticleRendererProps {
  blocks: ArticleBlock[];
  defaultToolCta: ToolCtaConfig;
}

const TOOL_MAP: Record<string, Partial<ToolCtaConfig>> = {
  sanitize: {
    toolId: "sanitize",
    title: "Sanitize PDF Metadata & Flatten Forms Locally",
    description: "Inspect and purge hidden author metadata, GPS streams, revisions, and interactive form fields in local RAM.",
    buttonText: "Open PDF Sanitizer",
    href: "/tools/sanitize-pdf",
    highlightText: "Zero cloud egress guarantee",
  },
  sign: {
    toolId: "sign",
    title: "Sign PDF Contracts with SHA-256 Audit Certificate",
    description: "Draw, type, or stamp legal signatures on contracts locally and append tamper-evident verification certificates.",
    buttonText: "Open PDF Signer",
    href: "/tools/sign-pdf",
    highlightText: "Web Crypto SHA-256 Audit Trail",
  },
  compress: {
    toolId: "compress",
    title: "Compress PDF Online with Live Size Comparison",
    description: "Choose Extreme, Recommended, or Lossless presets. 100% computed inside your device memory with instant byte savings.",
    buttonText: "Open PDF Compressor",
    href: "/tools/compress-pdf",
    highlightText: "Instant client-side optimization",
  },
  merge: {
    toolId: "merge",
    title: "Merge Multiple PDFs into One Document",
    description: "Combine multiple PDF files and preserve bookmarks, page trees, and formatting locally.",
    buttonText: "Open PDF Merger",
    href: "/tools/merge-pdf",
    highlightText: "Zero server uploads",
  },
  split: {
    toolId: "split",
    title: "Split PDF Pages into Separate Documents",
    description: "Extract specific page ranges or split large documents into individual files in browser memory.",
    buttonText: "Open PDF Splitter",
    href: "/tools/split-pdf",
    highlightText: "Instant client-side split",
  },
  convert: {
    toolId: "convert",
    title: "Convert PDF Files Locally",
    description: "Convert PDFs to Word, Excel, PowerPoint, images, or archival standards with zero cloud exposure.",
    buttonText: "Open PDF Converter",
    href: "/tools/convert",
    highlightText: "100% client-side privacy",
  },
  scan: {
    toolId: "scan",
    title: "Scan & OCR Documents to PDF",
    description: "Capture, crop, and run client-side OCR on documents directly in your browser.",
    buttonText: "Open Scanner & OCR",
    href: "/tools/scan",
    highlightText: "Hardware-accelerated OCR",
  },
  edit: {
    toolId: "edit",
    title: "Edit PDF Text, Annotations & Forms",
    description: "Modify text, add shapes, whiteout sections, and fill interactive forms in browser RAM.",
    buttonText: "Open PDF Editor",
    href: "/tools/edit-pdf",
    highlightText: "Real-time canvas editor",
  },
};

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

          case "code":
            return (
              <div
                key={index}
                className="my-6 overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 text-slate-100 shadow-sm"
              >
                {block.title && (
                  <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/90 px-4 py-2 text-xs font-mono text-slate-400">
                    <span className="flex items-center gap-2 font-semibold text-slate-300">
                      <Terminal className="h-3.5 w-3.5 text-rose-500" />
                      {block.title}
                    </span>
                    {block.language && (
                      <span className="uppercase text-[10px] tracking-wider text-slate-500">
                        {block.language}
                      </span>
                    )}
                  </div>
                )}
                <pre className="overflow-x-auto p-4 text-xs sm:text-[13px] font-mono leading-relaxed text-emerald-300/95">
                  <code>{block.code}</code>
                </pre>
              </div>
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

          case "toolCta": {
            const baseCta: ToolCtaConfig =
              block.toolId && TOOL_MAP[block.toolId]
                ? { ...defaultToolCta, ...TOOL_MAP[block.toolId] }
                : defaultToolCta;

            const finalCta: ToolCtaConfig = block.customTitle
              ? {
                  ...baseCta,
                  title: block.customTitle,
                  description: block.customDesc || baseCta.description,
                }
              : baseCta;

            return <ArticleToolCta key={index} cta={finalCta} />;
          }

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
