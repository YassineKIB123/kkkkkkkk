import React from "react";
import { ArticleBlock, ToolCtaConfig } from "@/lib/blog/types";
import { ArticleToolCta } from "./ArticleToolCta";
import { InlineText } from "./InlineText";
import { ShieldCheck, AlertCircle, Info, Lightbulb, Terminal } from "lucide-react";

interface ArticleRendererProps {
  blocks: ArticleBlock[];
  defaultToolCta: ToolCtaConfig;
}

const TOOL_MAP: Record<string, Partial<ToolCtaConfig>> = {
  sanitize: {
    toolId: "sanitize",
    title: "Strip PDF Metadata & Flatten Forms Locally",
    description: "Remove document-level author/title fields and the XMP metadata stream, rebuild the file without old revisions, and optionally flatten form fields — in your browser.",
    buttonText: "Open PDF Sanitizer",
    href: "/tools/sanitize-pdf",
    highlightText: "Runs in your browser",
  },
  sign: {
    toolId: "sign",
    title: "Sign a PDF in Your Browser",
    description: "Draw, type, or upload a signature, add date stamps, and optionally append a SHA-256 audit summary page.",
    buttonText: "Open PDF Signer",
    href: "/tools/sign-pdf",
    highlightText: "No account needed",
  },
  compress: {
    toolId: "compress",
    title: "Compress a PDF with a Live Size Comparison",
    description: "Pick Recommended, Extreme, or Lossless / High Quality and compare the before-and-after size. Processing happens on your device.",
    buttonText: "Open PDF Compressor",
    href: "/tools/compress-pdf",
    highlightText: "Runs in your browser",
  },
  merge: {
    toolId: "merge",
    title: "Merge Multiple PDFs into One Document",
    description: "Combine PDF files in the order you choose, locally in your browser.",
    buttonText: "Open PDF Merger",
    href: "/tools/merge-pdf",
    highlightText: "No uploads",
  },
  split: {
    toolId: "split",
    title: "Split PDF Pages into Separate Documents",
    description: "Extract page ranges or split a large document into smaller files in browser memory.",
    buttonText: "Open PDF Splitter",
    href: "/tools/split-pdf",
    highlightText: "No uploads",
  },
  rotate: {
    toolId: "rotate",
    title: "Rotate PDF Pages",
    description: "Rotate individual pages or the whole document by 90°, 180°, or 270° and save the result.",
    buttonText: "Open PDF Rotator",
    href: "/tools/rotate-pdf",
    highlightText: "No uploads",
  },
  convert: {
    toolId: "convert",
    title: "Convert PDF and Office Files Locally",
    description: "Convert between PDF and Word, Excel, PowerPoint, text, and images without uploading your files.",
    buttonText: "Open PDF Converter",
    href: "/tools/convert",
    highlightText: "No uploads",
  },
  scan: {
    toolId: "scan",
    title: "Scan Paper Documents to PDF",
    description: "Capture pages with your camera or upload photos, crop and straighten them, apply a clean black-and-white filter, and save a PDF.",
    buttonText: "Open Document Scanner",
    href: "/tools/scan",
    highlightText: "Camera stays on your device",
  },
  edit: {
    toolId: "edit",
    title: "Edit PDF Text, Whiteout & Annotate",
    description: "Change existing text, add text boxes and shapes, or white out areas. Edited pages are flattened on export.",
    buttonText: "Open PDF Editor",
    href: "/tools/edit-pdf",
    highlightText: "No uploads",
  },
  watermark: {
    toolId: "watermark",
    title: "Add a Watermark to a PDF",
    description: "Stamp custom text such as CONFIDENTIAL or DRAFT across every page with adjustable opacity.",
    buttonText: "Open Watermark Tool",
    href: "/tools/watermark-pdf",
    highlightText: "No uploads",
  },
  imagesToPdf: {
    toolId: "imagesToPdf",
    title: "Convert Images to PDF",
    description: "Combine JPG, PNG, or WebP images into a single PDF in your browser.",
    buttonText: "Open Images to PDF",
    href: "/tools/images-to-pdf",
    highlightText: "No uploads",
  },
  pdfToImages: {
    toolId: "pdfToImages",
    title: "Convert PDF Pages to Images",
    description: "Export PDF pages as PNG or JPG images locally.",
    buttonText: "Open PDF to Images",
    href: "/tools/pdf-to-images",
    highlightText: "No uploads",
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
                <InlineText text={block.text} />
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
                    <InlineText text={block.text} />
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
                    <InlineText text={block.text} />
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
                    <InlineText text={item} />
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
                    <InlineText text={item} />
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
                            <InlineText text={cell} />
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
                        <InlineText text={item.answer} />
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
