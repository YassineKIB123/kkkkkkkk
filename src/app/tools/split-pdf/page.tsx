"use client";

import { ToolSuccessAlert } from "@/components/common/ToolSuccessAlert";

import React, { useState, useEffect, useRef } from "react";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { FileDropzone } from "@/components/tools/FileDropzone";
import { useLanguage } from "@/context/LanguageContext";
import {
  splitPDF,
  getPDFPageCount,
  parsePageRangeString,
  downloadBlob,
  loadPdfJs,
} from "@/lib/pdf/pdf-utils";
import {
  Scissors,
  FileText,
  Loader2,
  AlertCircle,
  Trash2,
  Layers,
  Check,
} from "lucide-react";

interface PageThumb {
  pageNumber: number;
  url: string;
}

export default function SplitPdfPage() {
  const { t, language } = useLanguage();
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number | null>(null);
  const [rangeString, setRangeString] = useState<string>("");
  const [thumbs, setThumbs] = useState<PageThumb[]>([]);

  const [isLoadingDoc, setIsLoadingDoc] = useState(false);
  const [isSplitting, setIsSplitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const thumbsRef = useRef<PageThumb[]>([]);
  useEffect(() => {
    thumbsRef.current = thumbs;
  }, [thumbs]);

  useEffect(() => {
    return () => {
      thumbsRef.current.forEach((thumb) => URL.revokeObjectURL(thumb.url));
    };
  }, []);

  const handleFileSelected = async (files: File[]) => {
    const selected = files[0];
    if (!selected) return;

    thumbs.forEach((thumb) => URL.revokeObjectURL(thumb.url));
    setThumbs([]);
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoadingDoc(true);

    try {
      const count = await getPDFPageCount(selected);
      setFile(selected);
      setPageCount(count);
      setRangeString(`1-${count}`);

      // Asynchronously load interactive page thumbnails for click-to-toggle page selection
      loadPdfJs()
        .then(async (pdfjs) => {
          const buffer = await selected.arrayBuffer();
          const pdf = await pdfjs.getDocument({ data: buffer }).promise;
          const maxPreviewPages = Math.min(pdf.numPages, 40);
          const list: PageThumb[] = [];
          const canvas = document.createElement("canvas");

          try {
            for (let i = 1; i <= maxPreviewPages; i++) {
              const page = await pdf.getPage(i);
              const viewport = page.getViewport({ scale: 0.35 });
              canvas.width = viewport.width;
              canvas.height = viewport.height;
              const ctx = canvas.getContext("2d");
              if (ctx) {
                await page.render({ canvasContext: ctx, viewport }).promise;
                const blob = await new Promise<Blob | null>((res) =>
                  canvas.toBlob((b) => res(b), "image/jpeg", 0.72)
                );
                if (blob) {
                  list.push({ pageNumber: i, url: URL.createObjectURL(blob) });
                }
              }
            }
            setThumbs(list);
          } finally {
            canvas.width = 0;
            canvas.height = 0;
            if (pdf && typeof pdf.destroy === "function") {
              pdf.destroy().catch(() => {});
            }
          }
        })
        .catch(() => {});
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Failed to open PDF. It may be password-protected or corrupted.";
      setErrorMessage(msg);
      setFile(null);
      setPageCount(null);
    } finally {
      setIsLoadingDoc(false);
    }
  };

  const handleClear = () => {
    thumbs.forEach((thumb) => URL.revokeObjectURL(thumb.url));
    setThumbs([]);
    setFile(null);
    setPageCount(null);
    setRangeString("");
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const handlePresetAll = () => {
    if (!pageCount) return;
    setRangeString(`1-${pageCount}`);
  };

  const handlePresetOdd = () => {
    if (!pageCount) return;
    const odds: number[] = [];
    for (let i = 1; i <= pageCount; i += 2) odds.push(i);
    setRangeString(odds.join(", "));
  };

  const handlePresetEven = () => {
    if (!pageCount) return;
    const evens: number[] = [];
    for (let i = 2; i <= pageCount; i += 2) evens.push(i);
    setRangeString(evens.length > 0 ? evens.join(", ") : "1");
  };

  const handlePresetFirstPage = () => {
    setRangeString("1");
  };

  const getSelectedSet = (): Set<number> => {
    if (!pageCount || !rangeString.trim()) return new Set();
    try {
      const indices = parsePageRangeString(rangeString, pageCount);
      return new Set(indices.map((i) => i + 1));
    } catch {
      return new Set();
    }
  };

  const togglePageSelection = (pageNumber: number) => {
    if (!pageCount) return;
    const current = getSelectedSet();
    if (current.has(pageNumber)) {
      current.delete(pageNumber);
    } else {
      current.add(pageNumber);
    }
    const sorted = Array.from(current).sort((a, b) => a - b);
    setRangeString(sorted.join(", "));
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const selectedSet = getSelectedSet();
  const extractedCount = selectedSet.size > 0 ? selectedSet.size : null;

  const handleSplit = async () => {
    if (!file || !pageCount) return;

    setIsSplitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const splitBytes = await splitPDF(file, rangeString);
      const outputFilename = `split_${file.name.replace(/\.pdf$/i, "")}_${Date.now()}.pdf`;

      downloadBlob(splitBytes, outputFilename);
      setSuccessMessage(
        `Success! Downloaded "${outputFilename}" (${extractedCount ?? ""} pages).`
      );
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "An unexpected error occurred while splitting the document.";
      setErrorMessage(msg);
    } finally {
      setIsSplitting(false);
    }
  };

  return (
    <ToolLayout toolId="split"
      title="Split PDF & Extract Pages Online"
      description="Extract specific page ranges, odd or even sheets, or click page thumbnails visually to build a custom PDF locally in your browser."
      faqs={[
        {
          question: "How can I extract specific pages from a large PDF?",
          answer:
            "Upload your PDF and either type custom page ranges (such as '1-3, 5, 8-10') or click directly on the visual page thumbnails to toggle which pages you want to include before clicking 'Split & Download PDF'.",
        },
        {
          question: "Can I extract only odd or even pages from a scanned PDF?",
          answer:
            "Yes. Use the 'Odd Pages' or 'Even Pages' quick preset buttons to automatically select alternating pages, which is ideal for fixing single-sided duplex scans.",
        },
        {
          question: "Is my original PDF file modified when I split it?",
          answer:
            "No. Your original file on your computer or phone remains untouched. Our tool generates a brand-new, watermark-free PDF containing only your selected pages.",
        },
        {
          question: "How fast is client-side PDF splitting?",
          answer:
            "Because there is zero file uploading or downloading from remote cloud servers, extracting pages from even a 200-page PDF takes less than a second in your browser.",
        },
      ]}
    >
      <div className="space-y-6">
        {!file && (
          <FileDropzone
            accept="application/pdf,.pdf"
            multiple={false}
            onFilesSelected={handleFileSelected}
          />
        )}

        {isLoadingDoc && (
          <div className="flex items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-slate-50/60 p-8 text-slate-500 dark:border-slate-800 dark:bg-slate-900/40">
            <Loader2 className="h-5 w-5 animate-spin text-rose-600" />
            <span className="text-sm font-semibold">Reading document structure...</span>
          </div>
        )}

        {file && pageCount !== null && (
          <div className="space-y-6 rounded-2xl border border-slate-200 bg-slate-50/60 p-5 sm:p-6 dark:border-slate-800 dark:bg-slate-900/60">
            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-rose-100 bg-rose-50 text-rose-600 dark:border-rose-900/40 dark:bg-rose-950/40 dark:text-rose-400">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-slate-900 dark:text-white">
                    {file.name}
                  </p>
                  <p className="font-mono text-xs text-slate-500 dark:text-slate-400">
                    {language === "AR" ? "إجمالي الصفحات:" : language === "FR" ? "Total pages :" : language === "ES" ? "Páginas totales:" : language === "RU" ? "Всего страниц:" : "Total Pages:"} <span className="text-rose-600 dark:text-rose-400 font-bold">{pageCount}</span>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleClear}
                disabled={isSplitting}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>{t.common.clear}</span>
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  {t.toolUi.split.rangeTitle}
                </label>
                {extractedCount !== null && (
                  <span className="text-xs font-mono font-bold text-rose-600 dark:text-rose-400">
                    {language === "AR" ? `سيتم استخراج ${extractedCount} من ${pageCount} صفحة` : `Will extract ${extractedCount} of ${pageCount} pages`}
                  </span>
                )}
              </div>

              <input
                type="text"
                value={rangeString}
                onChange={(e) => {
                  setRangeString(e.target.value);
                  setErrorMessage(null);
                  setSuccessMessage(null);
                }}
                placeholder={t.toolUi.split.rangePlaceholder}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 font-mono text-sm text-slate-900 placeholder-slate-400 focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/15 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
              />

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                  <Layers className="h-3.5 w-3.5 text-rose-600" /> {language === "AR" ? "خيارات سريعة:" : language === "FR" ? "Préréglages :" : language === "ES" ? "Preajustes:" : language === "RU" ? "Шаблоны:" : "Quick Presets:"}
                </span>

                <button
                  type="button"
                  onClick={handlePresetAll}
                  className="rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:border-rose-400 hover:text-rose-600 transition-colors"
                >
                  {language === "AR" ? `الكل (${pageCount})` : `All (${pageCount})`}
                </button>

                <button
                  type="button"
                  onClick={handlePresetOdd}
                  className="rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:border-rose-400 hover:text-rose-600 transition-colors"
                >
                  {language === "AR" ? "الصفحات الفردية" : language === "FR" ? "Pages impaires" : language === "ES" ? "Páginas impares" : language === "RU" ? "Нечетные" : "Odd Pages"}
                </button>

                <button
                  type="button"
                  onClick={handlePresetEven}
                  className="rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:border-rose-400 hover:text-rose-600 transition-colors"
                >
                  {language === "AR" ? "الصفحات الزوجية" : language === "FR" ? "Pages paires" : language === "ES" ? "Páginas pares" : language === "RU" ? "Четные" : "Even Pages"}
                </button>

                <button
                  type="button"
                  onClick={handlePresetFirstPage}
                  className="rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:border-rose-400 hover:text-rose-600 transition-colors"
                >
                  {language === "AR" ? "الصفحة الأولى فقط" : language === "FR" ? "Première page" : language === "ES" ? "Primera página" : language === "RU" ? "Только 1-я стр." : "First Page Only"}
                </button>
              </div>
            </div>

            {/* Interactive Visual Page Picker */}
            {thumbs.length > 0 && (
              <div className="space-y-2.5 pt-2">
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {language === "AR" ? "انقر على مصغرة أي صفحة لتحديدها أو استبعادها:" : "Click any page thumbnail to include or exclude it:"}
                </p>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 max-h-80 overflow-y-auto p-1">
                  {thumbs.map((thumb) => {
                    const isSelected = selectedSet.has(thumb.pageNumber);
                    return (
                      <button
                        key={thumb.pageNumber}
                        type="button"
                        onClick={() => togglePageSelection(thumb.pageNumber)}
                        className={`relative flex flex-col items-center rounded-xl border p-2 transition-all ${
                          isSelected
                            ? "border-rose-600 bg-rose-50/50 ring-2 ring-rose-500/20 dark:border-rose-500 dark:bg-rose-950/30"
                            : "border-slate-200 bg-white opacity-60 hover:opacity-100 dark:border-slate-800 dark:bg-slate-950"
                        }`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={thumb.url}
                          alt={`Page ${thumb.pageNumber}`}
                          className="h-24 w-auto object-contain rounded shadow-2xs"
                        />
                        <span className="mt-1.5 font-mono text-[10px] font-bold text-slate-700 dark:text-slate-300">
                          {t.toolUi.split.page} {thumb.pageNumber}
                        </span>
                        {isSelected && (
                          <span className="absolute top-1.5 right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-rose-600 text-white shadow-xs">
                            <Check className="h-3 w-3" />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {errorMessage && (
              <div className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
                <AlertCircle className="h-4 w-4 shrink-0 text-red-600 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <ToolSuccessAlert message={successMessage} />
            )}

            <div className="flex justify-end pt-2 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={handleSplit}
                disabled={isSplitting || !rangeString.trim()}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 hover:bg-rose-500 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-rose-600/20 disabled:cursor-not-allowed disabled:opacity-40 transition-all"
              >
                {isSplitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-white" />
                    <span>{t.toolUi.split.extracting}</span>
                  </>
                ) : (
                  <>
                    <Scissors className="h-4 w-4 text-white" />
                    <span>{t.toolUi.split.splitBtn}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}