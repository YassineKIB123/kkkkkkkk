"use client";

import { ToolSuccessAlert } from "@/components/common/ToolSuccessAlert";

import React, { useEffect, useRef, useState } from "react";
import { ToolLayout, type SupportedToolId } from "@/components/tools/ToolLayout";
import { FileDropzone } from "@/components/tools/FileDropzone";
import {
  CompressedImageCard,
  formatBytes,
  type CompressQueueItem,
} from "@/components/tools/image/CompressedImageCard";
import { downloadBlob } from "@/lib/pdf/pdf-utils";
import {
  compressImageToTarget,
  outputFileName,
  type ImageFitMode,
  type ImageOutputFormat,
} from "@/lib/image/compress-image";
import { useLanguage } from "@/context/LanguageContext";
import {
  AlertCircle,
  Archive,
  Loader2,
  Maximize2,
  Minimize2,
  ShieldCheck,
  Target,
  Trash2,
  Zap,
} from "lucide-react";

// "compressImage" is not (yet) part of ToolLayout's SupportedToolId union; the widening cast keeps
// this compiling before and after it is added there (ToolLayout falls back to the English title).
const TOOL_ID = "compressImage" as string as SupportedToolId;

const SIZE_PRESETS = [10, 20, 30, 50, 100, 200, 500];
const DEFAULT_TARGET_KB = 50;
const MAX_TARGET_KB = 20000;
const MAX_PIXELS_SIDE = 10000;

type ResizeMode = "original" | "max" | "exact";

const ACCEPT =
  "image/jpeg,image/png,image/webp,image/avif,image/gif,image/bmp,image/heic,image/heif,.jpg,.jpeg,.png,.webp,.avif,.gif,.bmp,.heic,.heif";

interface CompressImagePageProps {
  targetKb?: number;
}

let idCounter = 0;
const nextId = () => `img-${Date.now().toString(36)}-${(idCounter++).toString(36)}`;

function parsePositive(value: string): number | null {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : null;
}

const chipClass = (active: boolean) =>
  `rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors disabled:opacity-40 ${
    active
      ? "border border-rose-500 bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300"
      : "border border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300"
  }`;

const inputClass =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-mono text-sm text-slate-900 outline-none transition-colors focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 disabled:opacity-40 dark:border-slate-700 dark:bg-slate-950 dark:text-white";

const labelClass = "text-xs font-semibold text-slate-600 dark:text-slate-400";

export default function CompressImagePage({ targetKb }: CompressImagePageProps = {}) {
  const { t } = useLanguage();
  const presetTarget =
    targetKb && Number.isFinite(targetKb) && targetKb > 0 ? Math.round(targetKb) : undefined;

  const [items, setItems] = useState<CompressQueueItem[]>([]);
  const [targetInput, setTargetInput] = useState<string>(String(presetTarget ?? DEFAULT_TARGET_KB));
  const [minInput, setMinInput] = useState<string>("");
  const [resizeMode, setResizeMode] = useState<ResizeMode>("original");
  const [maxDimInput, setMaxDimInput] = useState<string>("1600");
  const [widthInput, setWidthInput] = useState<string>("");
  const [heightInput, setHeightInput] = useState<string>("");
  const [fit, setFit] = useState<ImageFitMode>("cover");
  const [format, setFormat] = useState<ImageOutputFormat>("image/jpeg");

  const [isProcessing, setIsProcessing] = useState(false);
  const [isZipping, setIsZipping] = useState(false);
  const [progressText, setProgressText] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const targetValue = parsePositive(targetInput);
  const activeTargetKb = targetValue ?? DEFAULT_TARGET_KB;
  const isPresetValue = targetValue !== null && SIZE_PRESETS.includes(targetValue);

  // Object-URL bookkeeping: revoke everything on unmount.
  const itemsRef = useRef<CompressQueueItem[]>([]);
  const mountedRef = useRef(true);
  useEffect(() => {
    itemsRef.current = items;
  }, [items]);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      itemsRef.current.forEach((it) => {
        URL.revokeObjectURL(it.previewUrl);
        if (it.resultUrl) URL.revokeObjectURL(it.resultUrl);
      });
    };
  }, []);

  /** Any settings change makes existing results stale. */
  const invalidateResults = () => {
    setSuccessMessage(null);
    setErrorMessage(null);
    if (!items.some((it) => it.status === "done" || it.status === "error")) return;
    items.forEach((it) => {
      if (it.resultUrl) URL.revokeObjectURL(it.resultUrl);
    });
    setItems(
      items.map((it) => ({ ...it, status: "pending", result: undefined, resultUrl: undefined, error: undefined }))
    );
  };

  const withInvalidate =
    <T,>(setter: (v: T) => void) =>
    (v: T) => {
      setter(v);
      invalidateResults();
    };

  const handleFilesSelected = (files: File[]) => {
    setErrorMessage(null);
    setSuccessMessage(null);
    const added: CompressQueueItem[] = files.map((file) => ({
      id: nextId(),
      file,
      previewUrl: URL.createObjectURL(file),
      status: "pending",
    }));
    setItems((prev) => [...prev, ...added]);
  };

  const handleRemove = (id: string) => {
    const it = items.find((x) => x.id === id);
    if (it) {
      URL.revokeObjectURL(it.previewUrl);
      if (it.resultUrl) URL.revokeObjectURL(it.resultUrl);
    }
    setItems((prev) => prev.filter((x) => x.id !== id));
    setSuccessMessage(null);
  };

  const handleClearAll = () => {
    items.forEach((it) => {
      URL.revokeObjectURL(it.previewUrl);
      if (it.resultUrl) URL.revokeObjectURL(it.resultUrl);
    });
    setItems([]);
    setErrorMessage(null);
    setSuccessMessage(null);
    setProgressText("");
  };

  const validateSettings = (): string | null => {
    if (targetValue === null) return "Enter a target size in KB (for example 50).";
    if (targetValue > MAX_TARGET_KB) return `Target size can be at most ${MAX_TARGET_KB} KB.`;
    const minValue = minInput.trim() ? parsePositive(minInput) : null;
    if (minInput.trim() && minValue === null) return "Minimum size must be a positive number of KB.";
    if (minValue !== null && minValue >= targetValue)
      return "Minimum size must be smaller than the target size.";
    if (resizeMode === "max") {
      const md = parsePositive(maxDimInput);
      if (md === null || md < 16 || md > MAX_PIXELS_SIDE)
        return `Max dimension must be between 16 and ${MAX_PIXELS_SIDE} px.`;
    }
    if (resizeMode === "exact") {
      const w = parsePositive(widthInput);
      const h = parsePositive(heightInput);
      if (w === null || h === null) return "Enter both width and height in pixels.";
      if (w < 16 || h < 16 || w > MAX_PIXELS_SIDE || h > MAX_PIXELS_SIDE)
        return `Width and height must be between 16 and ${MAX_PIXELS_SIDE} px.`;
    }
    return null;
  };

  const handleCompress = async () => {
    const validation = validateSettings();
    if (validation) {
      setErrorMessage(validation);
      return;
    }
    const queue = items.filter((it) => it.status !== "done");
    if (queue.length === 0) return;

    const target = targetValue as number;
    const minValue = minInput.trim() ? parsePositive(minInput) ?? undefined : undefined;
    const opts = {
      targetKb: target,
      minKb: minValue,
      format,
      fit,
      maxDimension: resizeMode === "max" ? Math.round(Number(maxDimInput)) : undefined,
      width: resizeMode === "exact" ? Math.round(Number(widthInput)) : undefined,
      height: resizeMode === "exact" ? Math.round(Number(heightInput)) : undefined,
    };

    setIsProcessing(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    let okCount = 0;
    let reachedCount = 0;
    let beforeBytes = 0;
    let afterBytes = 0;

    for (let i = 0; i < queue.length; i++) {
      const item = queue[i];
      if (!mountedRef.current) break;
      setProgressText(`Compressing ${i + 1} of ${queue.length}…`);
      setItems((prev) =>
        prev.map((p) => (p.id === item.id ? { ...p, status: "processing", error: undefined } : p))
      );

      try {
        const result = await compressImageToTarget(item.file, opts);
        if (!mountedRef.current) break;
        const resultUrl = URL.createObjectURL(result.blob);
        okCount++;
        if (result.reachedTarget) reachedCount++;
        beforeBytes += item.file.size;
        afterBytes += result.bytes;
        setItems((prev) =>
          prev.map((p) => (p.id === item.id ? { ...p, status: "done", result, resultUrl } : p))
        );
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Failed to compress this image.";
        setItems((prev) =>
          prev.map((p) => (p.id === item.id ? { ...p, status: "error", error: msg } : p))
        );
      }
    }

    if (!mountedRef.current) return;
    setIsProcessing(false);
    setProgressText("");

    if (okCount > 0) {
      const ratio = beforeBytes > 0 ? Math.max(0, Math.round(((beforeBytes - afterBytes) / beforeBytes) * 100)) : 0;
      const missed = okCount - reachedCount;
      setSuccessMessage(
        `Success! Compressed ${okCount} image${okCount === 1 ? "" : "s"} from ${formatBytes(beforeBytes)} to ${formatBytes(afterBytes)} (${ratio}% smaller).` +
          (missed > 0 ? ` ${missed} image${missed === 1 ? "" : "s"} could not fully meet the size limits - see the warnings below.` : "")
      );
    } else {
      setErrorMessage("None of the images could be compressed. Check the messages on each file.");
    }
  };

  const handleDownloadOne = (item: CompressQueueItem) => {
    if (!item.result) return;
    downloadBlob(item.result.blob, outputFileName(item.file.name, item.result.format, `${activeTargetKb}kb`));
  };

  const doneItems = items.filter((it) => it.status === "done" && it.result);

  const handleDownloadAll = async () => {
    if (doneItems.length === 0) return;
    if (doneItems.length === 1) {
      handleDownloadOne(doneItems[0]);
      return;
    }
    setIsZipping(true);
    setErrorMessage(null);
    try {
      const { default: JSZip } = await import("jszip");
      const zip = new JSZip();
      const used = new Set<string>();
      for (const it of doneItems) {
        const result = it.result!;
        let name = outputFileName(it.file.name, result.format, `${activeTargetKb}kb`);
        let n = 2;
        while (used.has(name.toLowerCase())) {
          name = outputFileName(it.file.name, result.format, `${activeTargetKb}kb-${n++}`);
        }
        used.add(name.toLowerCase());
        zip.file(name, result.blob);
      }
      // Images are already compressed - STORE avoids wasting CPU on deflate.
      const zipBlob = await zip.generateAsync({ type: "blob", compression: "STORE" });
      downloadBlob(zipBlob, `compressed-images-${activeTargetKb}kb.zip`, "application/zip");
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Failed to create the ZIP file.");
    } finally {
      setIsZipping(false);
    }
  };

  const pendingCount = items.filter((it) => it.status !== "done").length;
  const settingsDisabled = isProcessing;

  return (
    <ToolLayout
      toolId={TOOL_ID}
      title="Compress Image to 20KB, 50KB or 100KB"
      description="Shrink JPG, PNG and WebP photos to an exact file size for exam forms, job portals and visa applications. Optional exact pixel size. 100% in your browser - nothing is uploaded."
      faqs={[
        {
          question: "Are my photos uploaded to a server?",
          answer:
            "No. Decoding, resizing and re-encoding all happen inside your browser using the Canvas API. Your images never leave your device, and the tool keeps working even if you go offline after the page has loaded.",
        },
        {
          question: "How does it hit an exact target like 20KB or 50KB?",
          answer:
            "It re-encodes the image at different quality levels and picks the highest quality that still fits under your limit. If even the lowest quality is too large, it gradually reduces the pixel dimensions (unless you set an exact width and height). The maximum is counted as 1 KB = 1,000 bytes, so the file also passes portals that use 1,024.",
        },
        {
          question: "My exam form needs a photo between 10KB and 20KB at a fixed pixel size. Can it do that?",
          answer:
            "Yes. Set the target to 20 KB, the minimum to 10 KB, choose 'Exact size' and enter the required width and height (crop fills the frame, fit adds white borders). Always check the latest official notification, because requirements for SSC, NEET, UPSC, IBPS, passport and visa forms change.",
        },
        {
          question: "What is the difference between dimensions and file size?",
          answer:
            "Dimensions are the number of pixels (for example 200×230 px); file size is how many kilobytes the saved file takes. Two photos with the same dimensions can have very different file sizes depending on quality and detail. This tool lets you control both.",
        },
        {
          question: "Which image formats are supported?",
          answer:
            "You can add JPG, PNG, WebP and iPhone HEIC photos (plus AVIF, GIF and BMP where your browser supports them). HEIC works in every browser: if yours can't open it, a built-in decoder does. Output is JPG (best for forms) or WebP. Transparent PNG areas become white in JPG.",
        },
      ]}
    >
      <div className="space-y-6">
        {presetTarget && (
          <div className="flex items-center justify-between rounded-xl border border-rose-200 bg-rose-50/70 px-4 py-2.5 text-xs text-rose-800 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300">
            <div className="flex items-center gap-2 font-semibold">
              <Target className="h-4 w-4 text-rose-600 dark:text-rose-400" aria-hidden="true" />
              <span>Preset Active: Target File Size Under {presetTarget} KB</span>
            </div>
            <span className="font-mono text-[11px] font-bold uppercase">Auto-Tuned</span>
          </div>
        )}

        <FileDropzone
          accept={ACCEPT}
          multiple={true}
          onFilesSelected={handleFilesSelected}
          title="Drop JPG, PNG, WebP or HEIC photos here"
          description="Add one or many images. They are compressed on this device and never uploaded."
        />

        {/* Settings */}
        <div className="space-y-5 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          {/* Target size */}
          <fieldset className="space-y-2" disabled={settingsDisabled}>
            <legend className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              <Minimize2 className="h-4 w-4 text-rose-600" aria-hidden="true" />
              <span>Target file size (maximum)</span>
            </legend>
            <div className="flex flex-wrap gap-1.5" role="group" aria-label="Target size presets">
              {SIZE_PRESETS.map((kb) => (
                <button
                  key={kb}
                  type="button"
                  aria-pressed={targetValue === kb}
                  onClick={() => withInvalidate(setTargetInput)(String(kb))}
                  className={chipClass(targetValue === kb)}
                >
                  {kb} KB
                </button>
              ))}
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <label htmlFor="ci-target" className={labelClass}>
                  Custom maximum (KB){!isPresetValue && targetValue !== null ? " - active" : ""}
                </label>
                <input
                  id="ci-target"
                  type="number"
                  inputMode="decimal"
                  min={1}
                  max={MAX_TARGET_KB}
                  step="any"
                  value={targetInput}
                  onChange={(e) => withInvalidate(setTargetInput)(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div className="space-y-1">
                <label htmlFor="ci-min" className={labelClass}>
                  Minimum size (KB, optional)
                </label>
                <input
                  id="ci-min"
                  type="number"
                  inputMode="decimal"
                  min={0}
                  step="any"
                  placeholder="e.g. 10"
                  value={minInput}
                  onChange={(e) => withInvalidate(setMinInput)(e.target.value)}
                  aria-describedby="ci-min-hint"
                  className={inputClass}
                />
                <p id="ci-min-hint" className="text-[11px] text-slate-500 dark:text-slate-400">
                  Some exam portals also reject files that are too small.
                </p>
              </div>
            </div>
          </fieldset>

          {/* Resize */}
          <fieldset className="space-y-2 border-t border-slate-100 pt-4 dark:border-slate-800" disabled={settingsDisabled}>
            <legend className="sr-only">Resize</legend>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300" aria-hidden="true">
              <Maximize2 className="h-4 w-4 text-rose-600" />
              <span>Resize</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5" role="group" aria-label="Resize mode">
              {(
                [
                  { id: "original", label: "Keep size" },
                  { id: "max", label: "Max side" },
                  { id: "exact", label: "Exact W×H" },
                ] as const
              ).map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  aria-pressed={resizeMode === opt.id}
                  onClick={() => withInvalidate(setResizeMode)(opt.id)}
                  className={chipClass(resizeMode === opt.id)}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {resizeMode === "original" && (
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Keeps the original pixel size where possible. If the target can&apos;t be reached, the image is scaled down automatically.
              </p>
            )}

            {resizeMode === "max" && (
              <div className="max-w-xs space-y-1">
                <label htmlFor="ci-maxdim" className={labelClass}>
                  Longest side (px)
                </label>
                <input
                  id="ci-maxdim"
                  type="number"
                  inputMode="numeric"
                  min={16}
                  max={MAX_PIXELS_SIDE}
                  value={maxDimInput}
                  onChange={(e) => withInvalidate(setMaxDimInput)(e.target.value)}
                  className={inputClass}
                />
              </div>
            )}

            {resizeMode === "exact" && (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <div className="space-y-1">
                  <label htmlFor="ci-width" className={labelClass}>
                    Width (px)
                  </label>
                  <input
                    id="ci-width"
                    type="number"
                    inputMode="numeric"
                    min={16}
                    max={MAX_PIXELS_SIDE}
                    placeholder="e.g. 200"
                    value={widthInput}
                    onChange={(e) => withInvalidate(setWidthInput)(e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="ci-height" className={labelClass}>
                    Height (px)
                  </label>
                  <input
                    id="ci-height"
                    type="number"
                    inputMode="numeric"
                    min={16}
                    max={MAX_PIXELS_SIDE}
                    placeholder="e.g. 230"
                    value={heightInput}
                    onChange={(e) => withInvalidate(setHeightInput)(e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div className="col-span-2 space-y-1 sm:col-span-1">
                  <label htmlFor="ci-fit" className={labelClass}>
                    Fit
                  </label>
                  <select
                    id="ci-fit"
                    value={fit}
                    onChange={(e) => withInvalidate(setFit)(e.target.value as ImageFitMode)}
                    className={inputClass}
                  >
                    <option value="cover">Crop to fill</option>
                    <option value="contain">Fit with white borders</option>
                    <option value="stretch">Stretch</option>
                  </select>
                </div>
              </div>
            )}
          </fieldset>

          {/* Format */}
          <fieldset className="space-y-2 border-t border-slate-100 pt-4 dark:border-slate-800" disabled={settingsDisabled}>
            <legend className="sr-only">Output format</legend>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300" aria-hidden="true">
              Output format
            </p>
            <div className="grid max-w-xs grid-cols-2 gap-1.5" role="group" aria-label="Output format">
              <button
                type="button"
                aria-pressed={format === "image/jpeg"}
                onClick={() => withInvalidate(setFormat)("image/jpeg")}
                className={chipClass(format === "image/jpeg")}
              >
                JPG (forms)
              </button>
              <button
                type="button"
                aria-pressed={format === "image/webp"}
                onClick={() => withInvalidate(setFormat)("image/webp")}
                className={chipClass(format === "image/webp")}
              >
                WebP
              </button>
            </div>
          </fieldset>
        </div>

        {items.length > 0 && (
          <div className="space-y-6 rounded-2xl border border-slate-200 bg-slate-50/60 p-5 sm:p-6 dark:border-slate-800 dark:bg-slate-900/60">
            {/* Queue header */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 dark:border-slate-800">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Images ({items.length})
                </h2>
                <p className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
                  <span>Processed locally - your photos never leave this device.</span>
                </p>
              </div>
              <button
                type="button"
                onClick={handleClearAll}
                disabled={isProcessing}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
              >
                <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                <span>{t.common.clearAll}</span>
              </button>
            </div>

            <ul className="space-y-3" aria-live="polite">
              {items.map((item) => (
                <CompressedImageCard
                  key={item.id}
                  item={item}
                  targetKb={activeTargetKb}
                  disabled={isProcessing}
                  onRemove={handleRemove}
                  onDownload={handleDownloadOne}
                />
              ))}
            </ul>

            {successMessage && <ToolSuccessAlert message={successMessage} />}

            {errorMessage && (
              <div
                role="alert"
                className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" aria-hidden="true" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-2 sm:flex-row dark:border-slate-800">
              <span className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400" aria-live="polite">
                <Zap className="h-3.5 w-3.5 text-amber-500" aria-hidden="true" />
                <span>{progressText || t.dropzone.processedLocally}</span>
              </span>

              <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
                {doneItems.length > 1 && (
                  <button
                    type="button"
                    onClick={handleDownloadAll}
                    disabled={isZipping || isProcessing}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-emerald-600/20 transition-all hover:bg-emerald-500 disabled:opacity-40 sm:w-auto"
                  >
                    {isZipping ? (
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    ) : (
                      <Archive className="h-4 w-4" aria-hidden="true" />
                    )}
                    <span>Download all (ZIP)</span>
                  </button>
                )}

                {pendingCount > 0 && (
                  <button
                    type="button"
                    onClick={handleCompress}
                    disabled={isProcessing}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-rose-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-rose-600/20 transition-all hover:bg-rose-500 disabled:opacity-40 sm:w-auto"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin text-white" aria-hidden="true" />
                        <span>{progressText || t.common.processing}</span>
                      </>
                    ) : (
                      <span>
                        Compress {pendingCount} image{pendingCount === 1 ? "" : "s"} to {activeTargetKb} KB
                      </span>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
