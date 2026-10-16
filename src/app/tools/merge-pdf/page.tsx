"use client";

import React, { useState } from "react";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { FileDropzone } from "@/components/tools/FileDropzone";
import { FileListPreview } from "@/components/tools/FileListPreview";
import { mergePDFs, downloadBlob } from "@/lib/pdf/pdf-utils";
import {
  Combine,
  Loader2,
  Trash2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

export default function MergePdfPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleFilesSelected = (newFiles: File[]) => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, idx) => idx !== index));
    setSuccessMessage(null);
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    setFiles((prev) => {
      const updated = [...prev];
      const temp = updated[index];
      updated[index] = updated[index - 1];
      updated[index - 1] = temp;
      return updated;
    });
  };

  const handleMoveDown = (index: number) => {
    if (index === files.length - 1) return;
    setFiles((prev) => {
      const updated = [...prev];
      const temp = updated[index];
      updated[index] = updated[index + 1];
      updated[index + 1] = temp;
      return updated;
    });
  };

  const handleClearAll = () => {
    setFiles([]);
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const handleMerge = async () => {
    if (files.length < 2) return;

    setIsProcessing(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const mergedBytes = await mergePDFs(files);
      const outputFilename = `pdfstudio_merged_${Date.now()}.pdf`;

      downloadBlob(mergedBytes, outputFilename);
      setSuccessMessage(
        `Success! Downloaded "${outputFilename}" with ${files.length} documents merged.`
      );
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "An unexpected error occurred while merging your files.";
      setErrorMessage(message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ToolLayout
      title="Merge PDF Documents Online"
      description="Combine multiple PDF files into a single organized document in seconds. Reorder files freely with 100% client-side browser privacy and zero server uploads."
      faqs={[
        {
          question: "How do I merge multiple PDF files into one document?",
          answer:
            "Drop two or more PDF files into the workspace above, use the up and down arrows to arrange your exact document order, and click 'Merge PDFs' to instantly compile and download your combined PDF.",
        },
        {
          question: "Are my confidential PDF contracts uploaded to a cloud server?",
          answer:
            "Never. iKnowAPDF merges your documents 100% locally inside your web browser memory using WebAssembly. Your tax records, legal agreements, and bank statements never leave your device.",
        },
        {
          question: "Does merging PDFs reduce image or text quality?",
          answer:
            "No. Our merger copies the exact native vector streams, embedded fonts, and high-resolution images from each source PDF into a new container without re-compressing or degrading quality.",
        },
        {
          question: "Is there a limit on how many PDF files I can combine?",
          answer:
            "There are no artificial paywalls, daily task limits, or watermarks. You can combine as many PDF files and pages as your device's available memory supports.",
        },
      ]}
    >
      <div className="space-y-6">
        <FileDropzone
          accept="application/pdf,.pdf"
          multiple={true}
          onFilesSelected={handleFilesSelected}
          title={
            files.length > 0
              ? "Add more PDF documents"
              : "Drop PDF documents here to merge"
          }
          description="Select 2 or more PDF files. You can drop them together or add them one by one."
        />

        {files.length > 0 && (
          <div className="space-y-6 rounded-2xl border border-slate-200 bg-slate-50/60 p-5 sm:p-6 dark:border-slate-800 dark:bg-slate-900/60">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Document Queue
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Files are merged from top to bottom. Use the arrows to reorder.
                </p>
              </div>

              <button
                type="button"
                onClick={handleClearAll}
                disabled={isProcessing}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 disabled:opacity-50 transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Clear All</span>
              </button>
            </div>

            <FileListPreview
              files={files}
              onRemove={handleRemoveFile}
              onMoveUp={handleMoveUp}
              onMoveDown={handleMoveDown}
            />

            {errorMessage && (
              <div className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
                <AlertCircle className="h-4 w-4 shrink-0 text-red-600 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="flex items-start gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
                <span>{successMessage}</span>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-slate-200 dark:border-slate-800">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {files.length < 2
                  ? `Add at least ${2 - files.length} more PDF to enable merging.`
                  : `Ready to merge ${files.length} PDFs into one file.`}
              </span>

              <button
                type="button"
                onClick={handleMerge}
                disabled={files.length < 2 || isProcessing}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 hover:bg-rose-500 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-rose-600/20 disabled:cursor-not-allowed disabled:opacity-40 transition-all"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-white" />
                    <span>Merging Documents...</span>
                  </>
                ) : (
                  <>
                    <Combine className="h-4 w-4 text-white" />
                    <span>Merge {files.length} PDFs</span>
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