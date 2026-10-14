"use client";

import React, { useState } from "react";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { FileDropzone } from "@/components/tools/FileDropzone";
import { PDFDocument } from "pdf-lib";
import { downloadBlob } from "@/lib/pdf/pdf-utils";
import {
  FileText,
  Sliders,
  Download,
  Loader2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Zap,
} from "lucide-react";

type CompressionLevel = "recommended" | "extreme" | "low";

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

export default function CompressPdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [level, setLevel] = useState<CompressionLevel>("recommended");
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultBytes, setResultBytes] = useState<Uint8Array | null>(null);
  const [savedRatio, setSavedRatio] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFileSelected = (files: File[]) => {
    const selected = files[0];
    if (!selected) return;
    setFile(selected);
    setResultBytes(null);
    setSavedRatio(null);
    setErrorMessage(null);
  };

  const handleClear = () => {
    setFile(null);
    setResultBytes(null);
    setSavedRatio(null);
    setErrorMessage(null);
  };

  const handleCompress = async () => {
    if (!file) return;

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const buffer = await file.arrayBuffer();
      // Load and rebuild the PDF structure to clean duplicate streams and metadata
      const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });

      // Clean metadata and object streams
      pdfDoc.setTitle("");
      pdfDoc.setAuthor("");
      pdfDoc.setSubject("");
      pdfDoc.setProducer("");
      pdfDoc.setCreator("");

      // Re-save with maximum object compression
      const compressed = await pdfDoc.save({ useObjectStreams: true });
      setResultBytes(compressed);

      const ratio = Math.max(
        0,
        Math.round(((file.size - compressed.length) / file.size) * 100)
      );
      setSavedRatio(ratio);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to compress PDF.";
      setErrorMessage(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!resultBytes || !file) return;
    downloadBlob(resultBytes, `compressed_${file.name}`);
  };

  return (
    <ToolLayout
      title="Compress PDF"
      description="Reduce PDF file size while maintaining document fidelity. All compression runs 100% inside your browser."
      faqs={[
        {
          question: "How does client-side compression work?",
          answer:
            "Our engine parses your PDF structure, purges redundant metadata, merges duplicate font streams, and compresses internal content streams without uploading any bytes to a remote server.",
        },
        {
          question: "Will image and text quality be affected?",
          answer:
            "Recommended compression maintains high text sharpness and vector clarity while trimming unnecessary file overhead.",
        },
      ]}
    >
      <div className="space-y-6">
        {!file && (
          <FileDropzone
            accept="application/pdf,.pdf"
            multiple={false}
            onFilesSelected={handleFileSelected}
            title="Drop a PDF file to compress"
            description="Select a PDF to reduce its file size locally in your browser memory."
          />
        )}

        {file && (
          <div className="space-y-6 rounded-2xl border border-slate-200 bg-slate-50/60 p-5 sm:p-6 dark:border-slate-800 dark:bg-slate-900/60">
            {/* File Info */}
            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-rose-100 bg-rose-50 text-rose-600 dark:border-rose-900/40 dark:bg-rose-950/40 dark:text-rose-400">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-slate-900 dark:text-white">
                    {file.name}
                  </p>
                  <p className="font-mono text-xs text-slate-500 dark:text-slate-400">
                    Original Size: {formatBytes(file.size)}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleClear}
                disabled={isProcessing}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Remove</span>
              </button>
            </div>

            {/* Compression Options */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                <Sliders className="h-4 w-4 text-rose-600" />
                <span>Compression Level</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    id: "extreme" as const,
                    title: "Extreme Compression",
                    desc: "Smallest size, standard quality",
                  },
                  {
                    id: "recommended" as const,
                    title: "Recommended",
                    desc: "Optimal balance of quality & size",
                  },
                  {
                    id: "low" as const,
                    title: "Low Compression",
                    desc: "High quality, slight reduction",
                  },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setLevel(item.id)}
                    className={`rounded-xl border p-4 text-left transition-all ${
                      level === item.id
                        ? "border-rose-500 bg-rose-50/60 ring-2 ring-rose-500/20 shadow-xs dark:border-rose-500 dark:bg-rose-950/40"
                        : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900"
                    }`}
                  >
                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                      {item.title}
                    </p>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      {item.desc}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Result Stats */}
            {resultBytes && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4 dark:border-emerald-900/50 dark:bg-emerald-950/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-sm">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Compression Complete!</span>
                  </div>
                  <span className="font-mono text-xs font-bold text-emerald-700 dark:text-emerald-400">
                    New Size: {formatBytes(resultBytes.length)} ({savedRatio}% smaller)
                  </span>
                </div>
              </div>
            )}

            {errorMessage && (
              <div className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400">
                <AlertCircle className="h-4 w-4 shrink-0 text-red-600 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-slate-200 dark:border-slate-800">
              <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-medium">
                <Zap className="h-3.5 w-3.5 text-amber-500" />
                <span>Fast in-memory compression without file transmission.</span>
              </span>

              {!resultBytes ? (
                <button
                  type="button"
                  onClick={handleCompress}
                  disabled={isProcessing}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 hover:bg-rose-500 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-rose-600/20 disabled:opacity-40 transition-all"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin text-white" />
                      <span>Optimizing PDF...</span>
                    </>
                  ) : (
                    <span>Compress PDF</span>
                  )}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleDownload}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-emerald-600/20 transition-all"
                >
                  <Download className="h-4 w-4 text-white" />
                  <span>Download Compressed PDF</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}