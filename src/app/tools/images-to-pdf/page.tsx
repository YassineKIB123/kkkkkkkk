"use client";

import React, { useState, useEffect } from "react";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { FileDropzone } from "@/components/tools/FileDropzone";
import { FileListPreview } from "@/components/tools/FileListPreview";
import { imagesToPDF, downloadBlob } from "@/lib/pdf/pdf-utils";
import {
  Images,
  Loader2,
  Trash2,
  Settings2,
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Eye,
} from "lucide-react";

interface ImageMeta {
  url: string;
  width: number;
  height: number;
}

export default function ImagesToPdfPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [imageMetas, setImageMetas] = useState<ImageMeta[]>([]);
  const [previewIndex, setPreviewIndex] = useState<number>(0);

  // Settings: Default margin is 0 (None)
  const [orientation, setOrientation] = useState<"portrait" | "landscape">("portrait");
  const [margin, setMargin] = useState<number>(0);
  const [pageSize, setPageSize] = useState<"A4" | "fit">("A4");

  const [isConverting, setIsConverting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Ingest files & detect natural dimensions
  const handleFilesSelected = async (newFiles: File[]) => {
    setErrorMessage(null);
    setSuccessMessage(null);

    // Load dimensions for the newly added files
    const loadMetas = newFiles.map(
      (file) =>
        new Promise<ImageMeta>((resolve) => {
          const url = URL.createObjectURL(file);
          const img = new Image();
          img.onload = () => {
            resolve({ url, width: img.naturalWidth, height: img.naturalHeight });
          };
          img.onerror = () => {
            resolve({ url, width: 800, height: 1100 });
          };
          img.src = url;
        })
    );

    const resolvedMetas = await Promise.all(loadMetas);

    // Smart default: If first batch of images, auto-detect orientation
    if (files.length === 0 && resolvedMetas[0]) {
      const first = resolvedMetas[0];
      setOrientation(first.width > first.height ? "landscape" : "portrait");
    }

    setFiles((prev) => [...prev, ...newFiles]);
    setImageMetas((prev) => [...prev, ...resolvedMetas]);
  };

  // Revoke object URLs on unmount
  useEffect(() => {
    return () => {
      imageMetas.forEach((meta) => URL.revokeObjectURL(meta.url));
    };
  }, [imageMetas]);

  const handleRemoveFile = (index: number) => {
    if (imageMetas[index]) {
      URL.revokeObjectURL(imageMetas[index].url);
    }
    setFiles((prev) => prev.filter((_, idx) => idx !== index));
    setImageMetas((prev) => prev.filter((_, idx) => idx !== index));
    setPreviewIndex((prev) => Math.max(0, index <= prev ? prev - 1 : prev));
    setSuccessMessage(null);
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    setFiles((prev) => {
      const next = [...prev];
      const temp = next[index];
      next[index] = next[index - 1];
      next[index - 1] = temp;
      return next;
    });
    setImageMetas((prev) => {
      const next = [...prev];
      const temp = next[index];
      next[index] = next[index - 1];
      next[index - 1] = temp;
      return next;
    });
    setPreviewIndex(index - 1);
  };

  const handleMoveDown = (index: number) => {
    if (index === files.length - 1) return;
    setFiles((prev) => {
      const next = [...prev];
      const temp = next[index];
      next[index] = next[index + 1];
      next[index + 1] = temp;
      return next;
    });
    setImageMetas((prev) => {
      const next = [...prev];
      const temp = next[index];
      next[index] = next[index + 1];
      next[index + 1] = temp;
      return next;
    });
    setPreviewIndex(index + 1);
  };

  const handleClearAll = () => {
    imageMetas.forEach((meta) => URL.revokeObjectURL(meta.url));
    setFiles([]);
    setImageMetas([]);
    setPreviewIndex(0);
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const handleConvert = async () => {
    if (files.length === 0) return;

    setIsConverting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const pdfBytes = await imagesToPDF(files, {
        orientation,
        margin,
        pageSize,
      });

      const fileName = `images_converted_${Date.now()}.pdf`;
      downloadBlob(pdfBytes, fileName);
      setSuccessMessage(`Success! Converted ${files.length} images into "${fileName}".`);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "An unexpected error occurred while converting images.";
      setErrorMessage(message);
    } finally {
      setIsConverting(false);
    }
  };

  // Preview Aspect Ratio calculation
  const currentMeta = imageMetas[previewIndex];

  const getPreviewAspectRatio = () => {
    if (pageSize === "fit" && currentMeta) {
      return `${currentMeta.width} / ${currentMeta.height}`;
    }
    return orientation === "portrait" ? "595 / 842" : "842 / 595";
  };

  // Padding percentage based on selected margin
  const getPaddingClass = () => {
    if (margin === 0) return "p-0";
    if (margin === 20) return "p-3 sm:p-4";
    return "p-6 sm:p-8"; // 40
  };

  return (
    <ToolLayout
      title="Convert Images to PDF"
      description="Transform JPG, PNG, and WebP images into clean, formatted PDF documents with live interactive sheet preview and zero-margin support."
    >
      <div className="space-y-6">
        {/* Dropzone */}
        <FileDropzone
          accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
          multiple={true}
          onFilesSelected={handleFilesSelected}
          title={
            files.length > 0
              ? "Add more images to this document"
              : "Drop image files here to convert"
          }
          description="Supports JPG, PNG, and WebP. Drop multiple photos or paste images with Ctrl+V."
        />

        {files.length > 0 && (
          <div className="space-y-6 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 sm:p-6 backdrop-blur-sm">
            {/* Conversion Settings Toolbar */}
            <div className="space-y-4 rounded-xl border border-zinc-800 bg-zinc-950/60 p-4">
              <div className="flex items-center gap-2 border-b border-zinc-800 pb-2.5 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                <Settings2 className="h-4 w-4 text-emerald-400" />
                <span>PDF Document Settings</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                {/* Page Sizing */}
                <div className="space-y-1.5">
                  <label className="text-zinc-400 font-medium">Page Sizing</label>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      type="button"
                      onClick={() => setPageSize("A4")}
                      className={`rounded-lg py-1.5 px-3 font-medium transition-colors ${
                        pageSize === "A4"
                          ? "border border-emerald-500/70 bg-emerald-950/60 text-emerald-300"
                          : "border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white"
                      }`}
                    >
                      Standard A4
                    </button>
                    <button
                      type="button"
                      onClick={() => setPageSize("fit")}
                      className={`rounded-lg py-1.5 px-3 font-medium transition-colors ${
                        pageSize === "fit"
                          ? "border border-emerald-500/70 bg-emerald-950/60 text-emerald-300"
                          : "border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white"
                      }`}
                    >
                      Fit Image Size
                    </button>
                  </div>
                </div>

                {/* Orientation */}
                <div className="space-y-1.5">
                  <label className="text-zinc-400 font-medium">Orientation</label>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      type="button"
                      disabled={pageSize === "fit"}
                      onClick={() => setOrientation("portrait")}
                      className={`rounded-lg py-1.5 px-3 font-medium transition-colors disabled:opacity-40 ${
                        orientation === "portrait"
                          ? "border border-emerald-500/70 bg-emerald-950/60 text-emerald-300"
                          : "border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white"
                      }`}
                    >
                      Portrait
                    </button>
                    <button
                      type="button"
                      disabled={pageSize === "fit"}
                      onClick={() => setOrientation("landscape")}
                      className={`rounded-lg py-1.5 px-3 font-medium transition-colors disabled:opacity-40 ${
                        orientation === "landscape"
                          ? "border border-emerald-500/70 bg-emerald-950/60 text-emerald-300"
                          : "border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white"
                      }`}
                    >
                      Landscape
                    </button>
                  </div>
                </div>

                {/* Margins */}
                <div className="space-y-1.5">
                  <label className="text-zinc-400 font-medium">Page Margins</label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { label: "None (0)", val: 0 },
                      { label: "Small (20)", val: 20 },
                      { label: "Big (40)", val: 40 },
                    ].map((m) => (
                      <button
                        key={m.val}
                        type="button"
                        onClick={() => setMargin(m.val)}
                        className={`rounded-lg py-1.5 px-2 font-medium transition-colors ${
                          margin === m.val
                            ? "border border-emerald-500/70 bg-emerald-950/60 text-emerald-300"
                            : "border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white"
                        }`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* LIVE DOCUMENT PREVIEW SECTION */}
            {currentMeta && (
              <div className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5">
                  <div className="flex items-center gap-2 text-xs font-semibold text-zinc-300">
                    <Eye className="h-4 w-4 text-emerald-400" />
                    <span>Live Document Sheet Preview</span>
                  </div>

                  {/* Multi-page Switcher */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={previewIndex === 0}
                      onClick={() => setPreviewIndex((prev) => Math.max(0, prev - 1))}
                      className="rounded-lg border border-zinc-800 p-1 text-zinc-400 hover:text-white disabled:opacity-30 transition-colors"
                      title="Previous Page"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <span className="font-mono text-xs text-zinc-400">
                      Page {previewIndex + 1} of {files.length}
                    </span>
                    <button
                      type="button"
                      disabled={previewIndex === files.length - 1}
                      onClick={() =>
                        setPreviewIndex((prev) => Math.min(files.length - 1, prev + 1))
                      }
                      className="rounded-lg border border-zinc-800 p-1 text-zinc-400 hover:text-white disabled:opacity-30 transition-colors"
                      title="Next Page"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Realistic Paper Viewport */}
                <div className="relative flex min-h-[360px] sm:min-h-[420px] items-center justify-center rounded-lg bg-zinc-900/60 p-4 overflow-hidden">
                  <div
                    style={{
                      aspectRatio: getPreviewAspectRatio(),
                      maxHeight: "380px",
                      maxWidth: "100%",
                    }}
                    className={`relative mx-auto flex items-center justify-center bg-white shadow-[0_20px_50px_rgba(0,0,0,0.8)] transition-all duration-300 overflow-hidden ${getPaddingClass()}`}
                  >
                    {/* Render Image with full-bleed when margin is 0 */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={currentMeta.url}
                      alt={`Preview page ${previewIndex + 1}`}
                      className={`h-full w-full transition-all duration-200 ${
                        margin === 0 && pageSize === "A4"
                          ? "object-cover"
                          : "object-contain"
                      }`}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-zinc-500 px-1 font-mono">
                  <span>
                    Current Sheet:{" "}
                    {pageSize === "fit" ? "Fit to Image" : `A4 ${orientation.toUpperCase()}`}
                  </span>
                  <span>
                    Margin: {margin === 0 ? "Full Bleed (None)" : `${margin}pt`}
                  </span>
                </div>
              </div>
            )}

            {/* Image Sequence List */}
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div>
                <h2 className="text-base font-semibold text-white">
                  Image Sequence ({files.length})
                </h2>
                <p className="text-xs text-zinc-400">
                  Click a page in the list to inspect it in the preview above. Use arrows to reorder.
                </p>
              </div>

              <button
                type="button"
                onClick={handleClearAll}
                disabled={isConverting}
                className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs font-medium text-zinc-400 hover:border-zinc-700 hover:text-white disabled:opacity-50 transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Clear All</span>
              </button>
            </div>

            {/* Reorderable List */}
            <FileListPreview
              files={files}
              onRemove={handleRemoveFile}
              onMoveUp={handleMoveUp}
              onMoveDown={handleMoveDown}
            />

            {/* Feedback Notifications */}
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
                {files.length} {files.length === 1 ? "page" : "pages"} ready to compile.
              </span>

              <button
                type="button"
                onClick={handleConvert}
                disabled={files.length === 0 || isConverting}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 px-6 py-2.5 text-sm font-semibold text-zinc-950 shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-40 transition-all"
              >
                {isConverting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-zinc-950" />
                    <span>Generating PDF...</span>
                  </>
                ) : (
                  <>
                    <Images className="h-4 w-4 text-zinc-950" />
                    <span>Convert {files.length} Images to PDF</span>
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