"use client";

import React, { useState, useEffect, useRef } from "react";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { FileDropzone } from "@/components/tools/FileDropzone";
import { downloadBlob } from "@/lib/pdf/pdf-utils";
import { PDFDocument, degrees } from "pdf-lib";
import {
  RotateCw,
  RotateCcw,
  RefreshCw,
  Download,
  Loader2,
  Trash2,
  FileText,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

declare global {
  interface Window {
    pdfjsLib?: any;
  }
}

interface PageThumbnail {
  pageNumber: number;
  dataUrl: string;
}

export default function RotatePdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [thumbnails, setThumbnails] = useState<PageThumbnail[]>([]);
  const [rotations, setRotations] = useState<number[]>([]); // Degrees per page (0, 90, 180, 270)

  const [isLoadingDoc, setIsLoadingDoc] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Load PDF.js for visual thumbnails
  useEffect(() => {
    if (!window.pdfjsLib) {
      const script = document.createElement("script");
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
      script.async = true;
      script.onload = () => {
        if (window.pdfjsLib) {
          window.pdfjsLib.GlobalWorkerOptions.workerSrc =
            "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
        }
      };
      document.body.appendChild(script);
    }
  }, []);

  const handleFileSelected = async (files: File[]) => {
    const selected = files[0];
    if (!selected) return;

    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoadingDoc(true);
    setFile(selected);

    try {
      const arrayBuffer = await selected.arrayBuffer();

      if (!window.pdfjsLib) {
        await new Promise((resolve) => setTimeout(resolve, 600));
      }
      if (!window.pdfjsLib) {
        throw new Error("PDF renderer is loading. Please select the file again.");
      }

      const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const loadedThumbnails: PageThumbnail[] = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 0.4 });
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext("2d");

        if (ctx) {
          await page.render({ canvasContext: ctx, viewport }).promise;
          loadedThumbnails.push({
            pageNumber: i,
            dataUrl: canvas.toDataURL("image/jpeg", 0.7),
          });
        }
      }

      setThumbnails(loadedThumbnails);
      setRotations(new Array(pdf.numPages).fill(0));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load PDF.";
      setErrorMessage(msg);
      setFile(null);
    } finally {
      setIsLoadingDoc(false);
    }
  };

  const handleRotatePage = (index: number, delta: number) => {
    setRotations((prev) => {
      const next = [...prev];
      next[index] = (next[index] + delta + 360) % 360;
      return next;
    });
  };

  const handleRotateAll = (delta: number) => {
    setRotations((prev) => prev.map((angle) => (angle + delta + 360) % 360));
  };

  const handleResetAll = () => {
    setRotations(new Array(thumbnails.length).fill(0));
  };

  const handleClear = () => {
    setFile(null);
    setThumbnails([]);
    setRotations([]);
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  // Compile rotated PDF using pdf-lib
  const handleSaveAndDownload = async () => {
    if (!file) return;

    setIsProcessing(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: false });
      const pages = pdfDoc.getPages();

      pages.forEach((page, idx) => {
        const addedDegrees = rotations[idx] || 0;
        if (addedDegrees !== 0) {
          const originalRotation = page.getRotation().angle;
          page.setRotation(degrees((originalRotation + addedDegrees) % 360));
        }
      });

      const rotatedBytes = await pdfDoc.save();
      const fileName = `rotated_${file.name}`;
      downloadBlob(rotatedBytes, fileName);
      setSuccessMessage(`Success! Saved and downloaded "${fileName}".`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to rotate PDF.";
      setErrorMessage(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ToolLayout
      title="Rotate PDF Pages"
      description="Rotate individual pages or entire documents permanently. Changes are rendered locally in browser memory."
    >
      <div className="space-y-6">
        {!file && (
          <FileDropzone
            accept="application/pdf,.pdf"
            multiple={false}
            onFilesSelected={handleFileSelected}
            title="Drop a PDF document here to rotate"
            description="Select a single PDF file. Preview all pages and change orientation on demand."
          />
        )}

        {isLoadingDoc && (
          <div className="flex items-center justify-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-8 text-zinc-400">
            <Loader2 className="h-5 w-5 animate-spin text-emerald-400" />
            <span className="text-sm">Generating page thumbnails...</span>
          </div>
        )}

        {file && !isLoadingDoc && (
          <div className="space-y-6 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 sm:p-6 backdrop-blur-sm">
            {/* Top Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-950 text-emerald-400">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-white">
                    {file.name}
                  </p>
                  <p className="font-mono text-xs text-zinc-400">
                    {thumbnails.length} Pages
                  </p>
                </div>
              </div>

              {/* Global Rotation Actions */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleRotateAll(90)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:text-white transition-colors"
                >
                  <RotateCw className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Rotate All +90°</span>
                </button>

                <button
                  type="button"
                  onClick={handleResetAll}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-white transition-colors"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span>Reset</span>
                </button>

                <button
                  type="button"
                  onClick={handleClear}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-white transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Remove</span>
                </button>
              </div>
            </div>

            {/* Grid of Page Thumbnails */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {thumbnails.map((thumb, idx) => {
                const angle = rotations[idx] || 0;

                return (
                  <div
                    key={thumb.pageNumber}
                    className="flex flex-col items-center justify-between rounded-xl border border-zinc-800 bg-zinc-950/70 p-3 space-y-3"
                  >
                    {/* Thumbnail Viewport with CSS rotation preview */}
                    <div className="relative flex h-48 w-full items-center justify-center overflow-hidden rounded bg-zinc-900/40 p-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={thumb.dataUrl}
                        alt={`Page ${thumb.pageNumber}`}
                        style={{
                          transform: `rotate(${angle}deg)`,
                          transition: "transform 0.25s ease-in-out",
                        }}
                        className="max-h-full max-w-full object-contain rounded shadow"
                      />
                      <span className="absolute bottom-1 left-1 rounded bg-zinc-950/90 px-1.5 py-0.5 font-mono text-[10px] text-zinc-300">
                        P.{thumb.pageNumber}
                      </span>
                    </div>

                    {/* Per-Page Rotation Controls */}
                    <div className="flex items-center justify-between w-full border-t border-zinc-800/80 pt-2 px-1">
                      <button
                        type="button"
                        onClick={() => handleRotatePage(idx, -90)}
                        title="Rotate Left (-90°)"
                        className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                      </button>

                      <span className="font-mono text-[10px] text-zinc-500">
                        {angle}°
                      </span>

                      <button
                        type="button"
                        onClick={() => handleRotatePage(idx, 90)}
                        title="Rotate Right (+90°)"
                        className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
                      >
                        <RotateCw className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Status Notifications */}
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

            {/* Bottom Download Bar */}
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleSaveAndDownload}
                disabled={isProcessing}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 px-6 py-2.5 text-sm font-semibold text-zinc-950 shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-40 transition-all"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-zinc-950" />
                    <span>Applying Rotations...</span>
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 text-zinc-950" />
                    <span>Save & Download PDF</span>
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