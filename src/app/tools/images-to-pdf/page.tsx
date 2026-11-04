"use client";

import { ToolSuccessAlert } from "@/components/common/ToolSuccessAlert";

import React, { useState, useEffect } from "react";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { FileDropzone } from "@/components/tools/FileDropzone";
import { useLanguage } from "@/context/LanguageContext";
import { FileListPreview } from "@/components/tools/FileListPreview";
import { imagesToPDF, downloadBlob } from "@/lib/pdf/pdf-utils";
import {
  Images,
  Loader2,
  Trash2,
  Settings2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Eye,
  Target,
  AlertTriangle,
} from "lucide-react";

interface ImageMeta {
  url: string;
  width: number;
  height: number;
}

interface ImagesToPdfPageProps {
  /** Optional maximum PDF size in KB (pSEO presets such as "JPG to PDF under 200KB"). */
  targetKb?: number;
}

function formatKb(bytes: number): string {
  return bytes < 1024 * 1024
    ? `${(bytes / 1024).toFixed(1)} KB`
    : `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

/** Rough fixed PDF cost (header, xref, catalog) plus per-page objects, in bytes. */
const PDF_BASE_OVERHEAD = 3000;
const PDF_PAGE_OVERHEAD = 500;
const MAX_TARGET_PASSES = 4;

export default function ImagesToPdfPage({ targetKb }: ImagesToPdfPageProps = {}) {
  const { t, language } = useLanguage();
  const presetTarget =
    targetKb && Number.isFinite(targetKb) && targetKb > 0 ? Math.round(targetKb) : undefined;
  const [progressText, setProgressText] = useState<string>("");
  const [warningMessage, setWarningMessage] = useState<string | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [imageMetas, setImageMetas] = useState<ImageMeta[]>([]);
  const [previewIndex, setPreviewIndex] = useState<number>(0);

  const [orientation, setOrientation] = useState<"portrait" | "landscape">("portrait");
  const [margin, setMargin] = useState<number>(0);
  const [pageSize, setPageSize] = useState<"A4" | "fit">("A4");

  const [isConverting, setIsConverting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleFilesSelected = async (newFiles: File[]) => {
    setErrorMessage(null);
    setSuccessMessage(null);

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

    if (files.length === 0 && resolvedMetas[0]) {
      const first = resolvedMetas[0];
      setOrientation(first.width > first.height ? "landscape" : "portrait");
    }

    setFiles((prev) => [...prev, ...newFiles]);
    setImageMetas((prev) => [...prev, ...resolvedMetas]);
  };

  const imageMetasRef = React.useRef<ImageMeta[]>([]);
  useEffect(() => {
    imageMetasRef.current = imageMetas;
  }, [imageMetas]);

  useEffect(() => {
    return () => {
      imageMetasRef.current.forEach((meta) => URL.revokeObjectURL(meta.url));
    };
  }, []);

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
    setWarningMessage(null);
  };

  /**
   * Re-encode the embedded images (JPEG, lower quality / smaller scale) until the PDF fits
   * under `maxBytes`. Returns the smallest PDF produced, even if it is still above target.
   */
  const shrinkPdfToTarget = async (
    initial: Uint8Array,
    maxBytes: number,
    options: Parameters<typeof imagesToPDF>[1]
  ): Promise<Uint8Array> => {
    const { compressImageToTarget } = await import("@/lib/image/compress-image");
    const count = files.length;
    let best = initial;
    let budget = (maxBytes - PDF_BASE_OVERHEAD - PDF_PAGE_OVERHEAD * count) / count;

    for (let pass = 0; pass < MAX_TARGET_PASSES && budget >= 1000; pass++) {
      const compressed: File[] = [];
      let imageBytes = 0;
      for (let i = 0; i < count; i++) {
        setProgressText(`Optimizing image ${i + 1} of ${count} to fit under ${presetTarget} KB…`);
        const result = await compressImageToTarget(files[i], {
          targetKb: budget / 1000,
          format: "image/jpeg",
          // ~A4 at 300 DPI: plenty for print, keeps "fit to image" pages a sane size.
          maxDimension: 2480,
        });
        imageBytes += result.bytes;
        compressed.push(new File([result.blob], `page-${i + 1}.jpg`, { type: "image/jpeg" }));
      }

      const candidate = await imagesToPDF(compressed, options);
      if (candidate.length < best.length) best = candidate;
      if (candidate.length <= maxBytes) break;

      // Use the measured container overhead to size the next, tighter per-image budget.
      const overhead = Math.max(0, candidate.length - imageBytes);
      budget = Math.min(budget * 0.85, ((maxBytes - overhead) / count) * 0.97);
    }
    return best;
  };

  const handleConvert = async () => {
    if (files.length === 0) return;

    setIsConverting(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    setWarningMessage(null);

    try {
      const pdfOptions = { orientation, margin, pageSize };
      let pdfBytes = await imagesToPDF(files, pdfOptions);

      let targetNote = "";
      if (presetTarget) {
        const maxBytes = presetTarget * 1000;
        if (pdfBytes.length > maxBytes) {
          pdfBytes = await shrinkPdfToTarget(pdfBytes, maxBytes, pdfOptions);
        }
        if (pdfBytes.length <= maxBytes) {
          targetNote = ` Size: ${formatKb(pdfBytes.length)} (under ${presetTarget} KB).`;
        } else {
          setWarningMessage(
            `Couldn't get this PDF under ${presetTarget} KB - the smallest version is ${formatKb(pdfBytes.length)}. Try fewer images, or compress the PDF further with Compress PDF.`
          );
        }
      }

      const fileName = `images_converted_${Date.now()}.pdf`;
      downloadBlob(pdfBytes, fileName);
      setSuccessMessage(`Success! Converted ${files.length} images into "${fileName}".${targetNote}`);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "An unexpected error occurred while converting images.";
      setErrorMessage(message);
    } finally {
      setIsConverting(false);
      setProgressText("");
    }
  };

  const currentMeta = imageMetas[previewIndex];

  const getPreviewAspectRatio = () => {
    if (pageSize === "fit" && currentMeta) {
      return `${currentMeta.width} / ${currentMeta.height}`;
    }
    return orientation === "portrait" ? "595 / 842" : "842 / 595";
  };

  const getPaddingClass = () => {
    if (margin === 0) return "p-0";
    if (margin === 20) return "p-3 sm:p-4";
    return "p-6 sm:p-8";
  };

  return (
    <ToolLayout toolId="imagesToPdf"
      title="Convert Images to PDF — JPG, PNG & WebP to PDF"
      description="Combine JPG, PNG, and WebP photos into a clean PDF document with live sheet preview, custom A4 or Fit-to-Image sizing, and zero-margin options."
      faqs={[
        {
          question: "How do I combine multiple JPG or PNG images into one PDF?",
          answer: `Drop all your images into the upload box, reorder them using the sequence arrows, choose your preferred page size (${t.toolUi.imagesToPdf.standardA4} or ${t.toolUi.imagesToPdf.fitImage}) and orientation, and click 'Convert Images to PDF'.`,
        },
        {
          question: "Can I create a borderless PDF with no white margins?",
          answer:
            "Yes. Set Page Margins to 'None (0)' or choose 'Fit Image Size' so every page in the exported PDF matches the exact pixel aspect ratio of your source photo.",
        },
        {
          question: "Are my personal ID photos or passport scans uploaded anywhere?",
          answer:
            "Never. All image decoding and PDF compilation happen 100% locally inside your browser tab, making it safe for passports, driver's licenses, and medical images.",
        },
      ]}
    >
      <div className="space-y-6">
        {presetTarget && (
          <div className="flex items-center justify-between rounded-xl border border-rose-200 bg-rose-50/70 px-4 py-2.5 text-xs text-rose-800 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300">
            <div className="flex items-center gap-2 font-semibold">
              <Target className="h-4 w-4 text-rose-600 dark:text-rose-400" aria-hidden="true" />
              <span>Preset Active: PDF File Size Under {presetTarget} KB</span>
            </div>
            <span className="font-mono text-[11px] uppercase font-bold">Auto-Tuned</span>
          </div>
        )}

        <FileDropzone
          accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
          multiple={true}
          onFilesSelected={handleFilesSelected}
        />

        {files.length > 0 && (
          <div className="space-y-6 rounded-2xl border border-slate-200 bg-slate-50/60 p-5 sm:p-6 dark:border-slate-800 dark:bg-slate-900/60">
            {/* Conversion Settings Toolbar */}
            <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2.5 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                <Settings2 className="h-4 w-4 text-rose-600" />
                <span>PDF Document Settings</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="space-y-1.5">
                  <label className="text-slate-600 dark:text-slate-400 font-semibold">Page Sizing</label>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      type="button"
                      onClick={() => setPageSize("A4")}
                      className={`rounded-lg py-1.5 px-3 font-semibold transition-colors ${
                        pageSize === "A4"
                          ? "border border-rose-500 bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300"
                          : "border border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-400"
                      }`}
                    >
                      {language === "AR" ? "A4 قياسي" : language === "FR" ? "A4 standard" : language === "ES" ? "A4 estándar" : language === "RU" ? "Стандартный A4" : "Standard A4"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setPageSize("fit")}
                      className={`rounded-lg py-1.5 px-3 font-semibold transition-colors ${
                        pageSize === "fit"
                          ? "border border-rose-500 bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300"
                          : "border border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-400"
                      }`}
                    >
                      {language === "AR" ? "حسب حجم الصورة" : language === "FR" ? "Ajuster à l'image" : language === "ES" ? "Ajustar a imagen" : language === "RU" ? "По размеру фото" : "Fit Image Size"}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-600 dark:text-slate-400 font-semibold">{language === "AR" ? "الاتجاه" : language === "FR" ? "Orientation" : language === "ES" ? "Orientación" : language === "RU" ? "Ориентация" : "Orientation"}</label>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      type="button"
                      disabled={pageSize === "fit"}
                      onClick={() => setOrientation("portrait")}
                      className={`rounded-lg py-1.5 px-3 font-semibold transition-colors disabled:opacity-40 ${
                        orientation === "portrait"
                          ? "border border-rose-500 bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300"
                          : "border border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-400"
                      }`}
                    >
                      {language === "AR" ? "عمودي" : language === "FR" ? "Portrait" : language === "ES" ? "Vertical" : language === "RU" ? "Портретная" : "Portrait"}
                    </button>
                    <button
                      type="button"
                      disabled={pageSize === "fit"}
                      onClick={() => setOrientation("landscape")}
                      className={`rounded-lg py-1.5 px-3 font-semibold transition-colors disabled:opacity-40 ${
                        orientation === "landscape"
                          ? "border border-rose-500 bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300"
                          : "border border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-400"
                      }`}
                    >
                      {language === "AR" ? "أفقي" : language === "FR" ? "Paysage" : language === "ES" ? "Horizontal" : language === "RU" ? "Альбомная" : "Landscape"}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-600 dark:text-slate-400 font-semibold">Page Margins</label>
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
                        className={`rounded-lg py-1.5 px-2 font-semibold transition-colors ${
                          margin === m.val
                            ? "border border-rose-500 bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300"
                            : "border border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-400"
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
              <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3 dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-200">
                    <Eye className="h-4 w-4 text-rose-600" />
                    <span>Live Document Sheet Preview</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={previewIndex === 0}
                      onClick={() => setPreviewIndex((prev) => Math.max(0, prev - 1))}
                      className="rounded-lg border border-slate-200 dark:border-slate-800 p-1 text-slate-500 hover:text-slate-900 dark:hover:text-white disabled:opacity-30 transition-colors"
                      title="Previous Page"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <span className="font-mono text-xs text-slate-600 dark:text-slate-400">
                      Page {previewIndex + 1} of {files.length}
                    </span>
                    <button
                      type="button"
                      disabled={previewIndex === files.length - 1}
                      onClick={() =>
                        setPreviewIndex((prev) => Math.min(files.length - 1, prev + 1))
                      }
                      className="rounded-lg border border-slate-200 dark:border-slate-800 p-1 text-slate-500 hover:text-slate-900 dark:hover:text-white disabled:opacity-30 transition-colors"
                      title="Next Page"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="relative flex min-h-[360px] sm:min-h-[420px] items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-950 p-4 overflow-hidden">
                  <div
                    style={{
                      aspectRatio: getPreviewAspectRatio(),
                      maxHeight: "380px",
                      maxWidth: "100%",
                    }}
                    className={`relative mx-auto flex items-center justify-center bg-white shadow-xl border border-slate-200 transition-all duration-300 overflow-hidden ${getPaddingClass()}`}
                  >
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

                <div className="flex items-center justify-between text-[11px] text-slate-500 px-1 font-mono">
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

            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Image Sequence ({files.length})
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Use arrows to reorder pages before compiling.
                </p>
              </div>

              <button
                type="button"
                onClick={handleClearAll}
                disabled={isConverting}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 disabled:opacity-50 transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>{t.common.clearAll}</span>
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

            {warningMessage && (
              <div
                role="alert"
                className="flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-xs text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-300"
              >
                <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" aria-hidden="true" />
                <span>{warningMessage}</span>
              </div>
            )}

            {successMessage && (
              <ToolSuccessAlert message={successMessage} />
            )}

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-slate-200 dark:border-slate-800">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium" aria-live="polite">
                {progressText ||
                  `${files.length} ${files.length === 1 ? "page" : "pages"} ready to compile${presetTarget ? ` (target: under ${presetTarget} KB)` : ""}.`}
              </span>

              <button
                type="button"
                onClick={handleConvert}
                disabled={files.length === 0 || isConverting}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 hover:bg-rose-500 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-rose-600/20 disabled:cursor-not-allowed disabled:opacity-40 transition-all"
              >
                {isConverting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-white" />
                    <span>{t.toolUi.imagesToPdf.converting}</span>
                  </>
                ) : (
                  <>
                    <Images className="h-4 w-4 text-white" />
                    <span>{t.toolUi.imagesToPdf.convertBtn} ({files.length})</span>
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