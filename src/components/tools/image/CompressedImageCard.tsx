"use client";

import React from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Download,
  ImageIcon,
  Loader2,
  Trash2,
  XCircle,
} from "lucide-react";
import type { CompressImageResult } from "@/lib/image/compress-image";

export interface CompressQueueItem {
  id: string;
  file: File;
  /** Object URL of the original file (revoked by the owner). */
  previewUrl: string;
  status: "pending" | "processing" | "done" | "error";
  result?: CompressImageResult;
  /** Object URL of the compressed blob (revoked by the owner). */
  resultUrl?: string;
  error?: string;
}

export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 KB";
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

interface CompressedImageCardProps {
  item: CompressQueueItem;
  targetKb: number;
  disabled?: boolean;
  onRemove: (id: string) => void;
  onDownload: (item: CompressQueueItem) => void;
}

export function CompressedImageCard({
  item,
  targetKb,
  disabled,
  onRemove,
  onDownload,
}: CompressedImageCardProps) {
  const { file, result, status } = item;
  const saved =
    result && file.size > 0 ? Math.round(((file.size - result.bytes) / file.size) * 100) : null;

  return (
    <li className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-rose-100 bg-rose-50 text-rose-600 dark:border-rose-900/40 dark:bg-rose-950/40 dark:text-rose-400">
            <ImageIcon className="h-5 w-5" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-slate-900 dark:text-white" title={file.name}>
              {file.name}
            </p>
            <p className="font-mono text-xs text-slate-500 dark:text-slate-400">
              Original: {formatBytes(file.size)}
              {result ? ` · ${result.originalWidth}×${result.originalHeight}px` : ""}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onRemove(item.id)}
          disabled={disabled}
          aria-label={`Remove ${file.name}`}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 disabled:opacity-40 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
          <span className="hidden sm:inline">Remove</span>
        </button>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <figure className="space-y-1.5">
          <div className="flex h-32 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-100 sm:h-40 dark:border-slate-800 dark:bg-slate-950">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.previewUrl}
              alt={`Original: ${file.name}`}
              className="max-h-full max-w-full object-contain"
              loading="lazy"
              decoding="async"
            />
          </div>
          <figcaption className="text-center text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Before
          </figcaption>
        </figure>

        <figure className="space-y-1.5">
          <div className="flex h-32 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-100 sm:h-40 dark:border-slate-800 dark:bg-slate-950">
            {status === "done" && item.resultUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={item.resultUrl}
                alt={`Compressed: ${file.name}`}
                className="max-h-full max-w-full object-contain"
                decoding="async"
              />
            ) : status === "processing" ? (
              <Loader2 className="h-6 w-6 animate-spin text-rose-600" aria-label="Compressing" />
            ) : status === "error" ? (
              <XCircle className="h-6 w-6 text-red-500" aria-hidden="true" />
            ) : (
              <span className="px-2 text-center text-[11px] text-slate-400 dark:text-slate-500">
                Waiting to compress
              </span>
            )}
          </div>
          <figcaption className="text-center text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            After
          </figcaption>
        </figure>
      </div>

      {status === "error" && item.error && (
        <p
          role="alert"
          className="mt-3 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-2.5 text-xs text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300"
        >
          <XCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span>{item.error}</span>
        </p>
      )}

      {status === "done" && result && (
        <div className="mt-3 space-y-3">
          <dl className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
            <div className="rounded-lg bg-slate-50 p-2 dark:bg-slate-800/60">
              <dt className="text-slate-500 dark:text-slate-400">New size</dt>
              <dd className="font-mono font-bold text-slate-900 dark:text-white">
                {formatBytes(result.bytes)}
                {saved !== null && saved > 0 && (
                  <span className="ml-1 font-semibold text-emerald-600 dark:text-emerald-400">−{saved}%</span>
                )}
              </dd>
            </div>
            <div className="rounded-lg bg-slate-50 p-2 dark:bg-slate-800/60">
              <dt className="text-slate-500 dark:text-slate-400">Dimensions</dt>
              <dd className="font-mono font-bold text-slate-900 dark:text-white">
                {result.width}×{result.height}px
              </dd>
            </div>
            <div className="rounded-lg bg-slate-50 p-2 dark:bg-slate-800/60">
              <dt className="text-slate-500 dark:text-slate-400">Quality</dt>
              <dd className="font-mono font-bold text-slate-900 dark:text-white">
                {Math.round(result.quality * 100)}%
              </dd>
            </div>
            <div className="rounded-lg bg-slate-50 p-2 dark:bg-slate-800/60">
              <dt className="text-slate-500 dark:text-slate-400">Format</dt>
              <dd className="font-mono font-bold text-slate-900 dark:text-white">
                {result.format === "image/webp" ? "WebP" : "JPG"}
              </dd>
            </div>
          </dl>

          {result.reachedTarget ? (
            <p className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300">
              <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
              Target reached: under {targetKb} KB
            </p>
          ) : (
            <p className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-300">
              <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
              Target not reached
            </p>
          )}

          {result.warnings.length > 0 && (
            <ul className="space-y-1 text-xs text-amber-800 dark:text-amber-300">
              {result.warnings.map((w) => (
                <li key={w} className="flex items-start gap-1.5">
                  <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          )}

          <button
            type="button"
            onClick={() => onDownload(item)}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-emerald-600/20 transition-all hover:bg-emerald-500 sm:w-auto"
          >
            <Download className="h-4 w-4" aria-hidden="true" />
            <span>Download {result.format === "image/webp" ? "WebP" : "JPG"}</span>
          </button>
        </div>
      )}
    </li>
  );
}
