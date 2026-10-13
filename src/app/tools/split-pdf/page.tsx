"use client";

import React, { useState } from "react";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { FileDropzone } from "@/components/tools/FileDropzone";
import {
  splitPDF,
  getPDFPageCount,
  parsePageRangeString,
  downloadBlob,
} from "@/lib/pdf/pdf-utils";
import {
  Scissors,
  FileText,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Layers,
} from "lucide-react";

export default function SplitPdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number | null>(null);
  const [rangeString, setRangeString] = useState<string>("");

  const [isLoadingDoc, setIsLoadingDoc] = useState(false);
  const [isSplitting, setIsSplitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleFileSelected = async (files: File[]) => {
    const selected = files[0];
    if (!selected) return;

    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoadingDoc(true);

    try {
      const count = await getPDFPageCount(selected);
      setFile(selected);
      setPageCount(count);
      setRangeString(`1-${count}`);
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
    setRangeString(evens.length > 0 ? evens.join(", ") : "2");
  };

  const handlePresetFirstPage = () => {
    setRangeString("1");
  };

  const getExtractedCount = (): number | null => {
    if (!pageCount || !rangeString.trim()) return null;
    try {
      const indices = parsePageRangeString(rangeString, pageCount);
      return indices.length;
    } catch {
      return null;
    }
  };

  const handleSplit = async () => {
    if (!file || !pageCount) return;

    setIsSplitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const splitBytes = await splitPDF(file, rangeString);
      const outputFilename = `split_${file.name.replace(/\.pdf$/i, "")}_${Date.now()}.pdf`;

      downloadBlob(splitBytes, outputFilename);
      const extractedCount = getExtractedCount();
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

  const extractedCount = getExtractedCount();

  return (
    <ToolLayout
      title="Split PDF Document"
      description="Extract specific page ranges, odd/even pages, or select individual sheets into a new PDF document."
    >
      <div className="space-y-6">
        {!file && (
          <FileDropzone
            accept="application/pdf,.pdf"
            multiple={false}
            onFilesSelected={handleFileSelected}
            title="Drop a PDF document here to split"
            description="Select a single PDF file. All page inspection and extraction happens locally in your browser."
          />
        )}

        {isLoadingDoc && (
          <div className="flex items-center justify-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-8 text-zinc-400">
            <Loader2 className="h-5 w-5 animate-spin text-emerald-400" />
            <span className="text-sm">Reading document structure...</span>
          </div>
        )}

        {file && pageCount !== null && (
          <div className="space-y-6 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 sm:p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-950/70 p-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 text-emerald-400">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-white">
                    {file.name}
                  </p>
                  <p className="font-mono text-xs text-zinc-400">
                    Total Pages: <span className="text-emerald-400 font-bold">{pageCount}</span>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleClear}
                disabled={isSplitting}
                className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs font-medium text-zinc-400 hover:border-zinc-700 hover:text-white transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Choose Another</span>
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
                  Pages to Extract
                </label>
                {extractedCount !== null && (
                  <span className="text-xs font-mono text-emerald-400">
                    Will extract {extractedCount} of {pageCount} pages
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
                placeholder="e.g. 1-3, 5, 8-10"
                className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-2.5 font-mono text-sm text-white placeholder-zinc-600 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-xs text-zinc-500 flex items-center gap-1">
                  <Layers className="h-3 w-3" /> Quick Presets:
                </span>

                <button
                  type="button"
                  onClick={handlePresetAll}
                  className="rounded-lg border border-zinc-800 bg-zinc-900 px-2.5 py-1 text-xs font-medium text-zinc-300 hover:border-zinc-700 hover:text-white transition-colors"
                >
                  All ({pageCount})
                </button>

                <button
                  type="button"
                  onClick={handlePresetOdd}
                  className="rounded-lg border border-zinc-800 bg-zinc-900 px-2.5 py-1 text-xs font-medium text-zinc-300 hover:border-zinc-700 hover:text-white transition-colors"
                >
                  Odd Pages
                </button>

                <button
                  type="button"
                  onClick={handlePresetEven}
                  className="rounded-lg border border-zinc-800 bg-zinc-900 px-2.5 py-1 text-xs font-medium text-zinc-300 hover:border-zinc-700 hover:text-white transition-colors"
                >
                  Even Pages
                </button>

                <button
                  type="button"
                  onClick={handlePresetFirstPage}
                  className="rounded-lg border border-zinc-800 bg-zinc-900 px-2.5 py-1 text-xs font-medium text-zinc-300 hover:border-zinc-700 hover:text-white transition-colors"
                >
                  First Page Only
                </button>
              </div>
            </div>

            {errorMessage && (
              <div className="flex items-start gap-2.5 rounded-xl border border-red-900/60 bg-red-950/40 p-3.5 text-xs text-red-300">
                <AlertCircle className="h-4 w-4 shrink-0 text-red-400 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="flex items-start gap-2.5 rounded-xl border border-emerald-900/60 bg-emerald-950/40 p-3.5 text-xs text-emerald-300">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
                <span>{successMessage}</span>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleSplit}
                disabled={isSplitting || !rangeString.trim()}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 px-6 py-2.5 text-sm font-semibold text-zinc-950 shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-40 transition-all"
              >
                {isSplitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-zinc-950" />
                    <span>Extracting Pages...</span>
                  </>
                ) : (
                  <>
                    <Scissors className="h-4 w-4 text-zinc-950" />
                    <span>Split & Download PDF</span>
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