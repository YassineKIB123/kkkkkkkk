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
  Plus,
} from "lucide-react";

export default function MergePdfPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Append new files without resetting current reordered queue
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
      const outputFilename = `docforge_merged_${Date.now()}.pdf`;

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
      title="Merge PDF Documents"
      description="Combine multiple PDF files into a single document. Reorder files to determine the final page order."
    >
      <div className="space-y-6">
        {/* File Dropzone Area */}
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

        {/* Uploaded File List and Actions */}
        {files.length > 0 && (
          <div className="space-y-6 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 sm:p-6 backdrop-blur-sm">
            {/* Header & Quick Clear */}
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div>
                <h2 className="text-base font-semibold text-white">
                  Document Queue
                </h2>
                <p className="text-xs text-zinc-400">
                  Files are merged from top to bottom. Use the arrows to reorder.
                </p>
              </div>

              <button
                type="button"
                onClick={handleClearAll}
                disabled={isProcessing}
                className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs font-medium text-zinc-400 hover:border-zinc-700 hover:text-white disabled:opacity-50 transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Clear All</span>
              </button>
            </div>

            {/* Reorderable Preview List */}
            <FileListPreview
              files={files}
              onRemove={handleRemoveFile}
              onMoveUp={handleMoveUp}
              onMoveDown={handleMoveDown}
            />

            {/* Status Messages */}
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

            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <span className="text-xs text-zinc-500">
                {files.length < 2
                  ? `Add at least ${2 - files.length} more PDF to enable merging.`
                  : `Ready to merge ${files.length} PDFs into one file.`}
              </span>

              <button
                type="button"
                onClick={handleMerge}
                disabled={files.length < 2 || isProcessing}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 px-6 py-2.5 text-sm font-semibold text-zinc-950 shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-emerald-500 transition-all"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-zinc-950" />
                    <span>Merging Documents...</span>
                  </>
                ) : (
                  <>
                    <Combine className="h-4 w-4 text-zinc-950" />
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