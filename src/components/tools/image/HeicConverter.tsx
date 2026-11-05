"use client";

import React, { useEffect, useRef, useState } from "react";
import { FileDropzone } from "@/components/tools/FileDropzone";
import { ToolSuccessAlert } from "@/components/common/ToolSuccessAlert";
import { convertHeic, isHeicFile, type HeicOutputType } from "@/lib/image/heic";
import { downloadBlob, imagesToPDF } from "@/lib/pdf/pdf-utils";
import { AlertCircle, CheckCircle2, Download, FileArchive, Loader2, Trash2 } from "lucide-react";

export type HeicTarget = "jpg" | "png" | "pdf";

interface Item {
  id: string;
  file: File;
  status: "pending" | "working" | "done" | "error";
  output?: File;
  /** Settings the output was produced with (reused only if unchanged). */
  outputKey?: string;
  previewUrl?: string;
  error?: string;
}

let idCounter = 0;
const nextId = () => `heic_${Date.now()}_${idCounter++}`;

const ACCEPT = "image/heic,image/heif,.heic,.heif,.HEIC,.HEIF";

function formatSize(bytes: number): string {
  return bytes >= 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(2)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

export function HeicConverter({ initialTarget = "jpg" }: { initialTarget?: HeicTarget }) {
  const [items, setItems] = useState<Item[]>([]);
  const [target, setTarget] = useState<HeicTarget>(initialTarget);
  const [quality, setQuality] = useState<"high" | "small">("high");
  const [resize, setResize] = useState<"original" | "2048">("original");
  const [pdfPage, setPdfPage] = useState<"A4" | "fit">("A4");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const itemsRef = useRef<Item[]>([]);
  useEffect(() => {
    itemsRef.current = items;
  }, [items]);
  useEffect(
    () => () => {
      itemsRef.current.forEach((it) => it.previewUrl && URL.revokeObjectURL(it.previewUrl));
    },
    []
  );

  const outputType: HeicOutputType = target === "png" ? "image/png" : "image/jpeg";

  const handleFiles = (files: File[]) => {
    setError(null);
    setSuccess(null);
    const heic = files.filter(isHeicFile);
    if (heic.length < files.length) {
      setError(`${files.length - heic.length} file(s) skipped: only .heic and .heif photos are converted here.`);
    }
    setItems((prev) => [...prev, ...heic.map((file) => ({ id: nextId(), file, status: "pending" as const }))]);
  };

  const removeItem = (id: string) => {
    setItems((prev) => {
      const it = prev.find((x) => x.id === id);
      if (it?.previewUrl) URL.revokeObjectURL(it.previewUrl);
      return prev.filter((x) => x.id !== id);
    });
  };

  const clearAll = () => {
    items.forEach((it) => it.previewUrl && URL.revokeObjectURL(it.previewUrl));
    setItems([]);
    setError(null);
    setSuccess(null);
  };

  const convertAll = async () => {
    if (items.length === 0 || busy) return;
    setBusy(true);
    setError(null);
    setSuccess(null);
    const results: File[] = [];
    let failed = 0;
    const settingsKey = `${outputType}|${quality}|${resize}`;
    for (const it of items) {
      // Reuse earlier results when the output settings haven't changed.
      if (it.status === "done" && it.output && it.outputKey === settingsKey) {
        results.push(it.output);
        continue;
      }
      setItems((prev) => prev.map((x) => (x.id === it.id ? { ...x, status: "working", error: undefined } : x)));
      try {
        const output = await convertHeic(it.file, {
          type: outputType,
          quality: quality === "high" ? 0.92 : 0.8,
          maxLongSide: resize === "2048" ? 2048 : undefined,
        });
        results.push(output);
        const previewUrl = URL.createObjectURL(output);
        setItems((prev) =>
          prev.map((x) => {
            if (x.id !== it.id) return x;
            if (x.previewUrl) URL.revokeObjectURL(x.previewUrl);
            return { ...x, status: "done", output, outputKey: settingsKey, previewUrl };
          })
        );
      } catch (err: unknown) {
        failed++;
        const msg = err instanceof Error ? err.message : "Conversion failed.";
        setItems((prev) => prev.map((x) => (x.id === it.id ? { ...x, status: "error", error: msg } : x)));
      }
    }

    try {
      if (results.length === 0) {
        setError("None of the photos could be converted.");
      } else if (target === "pdf") {
        const pdf = await imagesToPDF(results, { orientation: "portrait", margin: pdfPage === "A4" ? 20 : 0, pageSize: pdfPage });
        const name = results.length === 1 ? results[0].name.replace(/\.jpg$/i, ".pdf") : `heic_photos_${results.length}.pdf`;
        downloadBlob(pdf, name);
        setSuccess(`Saved "${name}" with ${results.length} page(s).${failed ? ` ${failed} photo(s) failed.` : ""}`);
      } else if (results.length === 1) {
        downloadBlob(results[0], results[0].name, results[0].type);
        setSuccess(`Converted and downloaded "${results[0].name}".`);
      } else {
        const JSZip = (await import("jszip")).default;
        const zip = new JSZip();
        const used = new Set<string>();
        for (const f of results) {
          let name = f.name;
          for (let n = 2; used.has(name); n++) name = f.name.replace(/(\.\w+)$/, `_${n}$1`);
          used.add(name);
          zip.file(name, f);
        }
        const blob = await zip.generateAsync({ type: "blob" });
        downloadBlob(blob, `heic_to_${target}_${results.length}_photos.zip`, "application/zip");
        setSuccess(`Converted ${results.length} photo(s) and downloaded them as a ZIP.${failed ? ` ${failed} failed.` : ""}`);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Saving the converted files failed.");
    } finally {
      setBusy(false);
    }
  };

  const optionBtn = (active: boolean) =>
    `rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors disabled:opacity-50 ${
      active
        ? "bg-rose-600 text-white"
        : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
    }`;

  return (
    <div className="space-y-5">
      <FileDropzone
        accept={ACCEPT}
        multiple={true}
        onFilesSelected={handleFiles}
        title="Drop iPhone HEIC photos here"
        description="Add one or many .heic / .heif files. They are converted on this device and never uploaded."
      />

      <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Convert to">
          <span className="w-24 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">Convert to</span>
          {(["jpg", "png", "pdf"] as const).map((t) => (
            <button key={t} type="button" disabled={busy} aria-pressed={target === t} onClick={() => setTarget(t)} className={optionBtn(target === t)}>
              {t === "pdf" ? "PDF (one file)" : t.toUpperCase()}
            </button>
          ))}
        </div>

        {target !== "png" && (
          <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Quality">
            <span className="w-24 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">Quality</span>
            <button type="button" disabled={busy} aria-pressed={quality === "high"} onClick={() => setQuality("high")} className={optionBtn(quality === "high")}>
              High
            </button>
            <button type="button" disabled={busy} aria-pressed={quality === "small"} onClick={() => setQuality("small")} className={optionBtn(quality === "small")}>
              Smaller file
            </button>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Size">
          <span className="w-24 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">Size</span>
          <button type="button" disabled={busy} aria-pressed={resize === "original"} onClick={() => setResize("original")} className={optionBtn(resize === "original")}>
            Original
          </button>
          <button type="button" disabled={busy} aria-pressed={resize === "2048"} onClick={() => setResize("2048")} className={optionBtn(resize === "2048")}>
            Max 2048 px
          </button>
        </div>

        {target === "pdf" && (
          <div className="flex flex-wrap items-center gap-2" role="group" aria-label="PDF page size">
            <span className="w-24 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">Page</span>
            <button type="button" disabled={busy} aria-pressed={pdfPage === "A4"} onClick={() => setPdfPage("A4")} className={optionBtn(pdfPage === "A4")}>
              A4
            </button>
            <button type="button" disabled={busy} aria-pressed={pdfPage === "fit"} onClick={() => setPdfPage("fit")} className={optionBtn(pdfPage === "fit")}>
              Same size as photo
            </button>
          </div>
        )}
      </div>

      {items.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
            <span className="font-semibold">{items.length} photo(s)</span>
            <button type="button" onClick={clearAll} disabled={busy} className="font-semibold text-slate-500 hover:text-rose-600 disabled:opacity-40">
              Clear all
            </button>
          </div>
          <ul className="divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-900">
            {items.map((it) => (
              <li key={it.id} className="flex items-center gap-3 p-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800">
                  {it.previewUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={it.previewUrl} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <span className="font-mono text-[10px] font-bold text-slate-500">HEIC</span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-slate-900 dark:text-white">{it.file.name}</p>
                  <p className="font-mono text-[11px] text-slate-500 dark:text-slate-400">
                    {formatSize(it.file.size)}
                    {it.output ? ` → ${formatSize(it.output.size)} ${it.output.type === "image/png" ? "PNG" : "JPG"}` : ""}
                  </p>
                  {it.error && <p className="text-[11px] text-red-600 dark:text-red-400">{it.error}</p>}
                </div>
                {it.status === "working" && <Loader2 className="h-4 w-4 animate-spin text-rose-600" aria-label="Converting" />}
                {it.status === "done" && it.output && target !== "pdf" && (
                  <button
                    type="button"
                    onClick={() => downloadBlob(it.output!, it.output!.name, it.output!.type)}
                    className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-rose-600 dark:hover:bg-slate-800"
                    aria-label={`Download ${it.output.name}`}
                  >
                    <Download className="h-4 w-4" />
                  </button>
                )}
                {it.status === "done" && target === "pdf" && <CheckCircle2 className="h-4 w-4 text-emerald-600" aria-label="Converted" />}
                <button
                  type="button"
                  onClick={() => removeItem(it.id)}
                  disabled={busy}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-red-600 disabled:opacity-40 dark:hover:bg-slate-800"
                  aria-label={`Remove ${it.file.name}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {error && (
        <div role="alert" className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}
      {success && <ToolSuccessAlert message={success} />}

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => void convertAll()}
          disabled={busy || items.length === 0}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-rose-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-rose-600/20 hover:bg-rose-500 disabled:opacity-40 sm:w-auto"
        >
          {busy ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : target !== "pdf" && items.length > 1 ? (
            <FileArchive className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Download className="h-4 w-4" aria-hidden="true" />
          )}
          <span>
            {busy
              ? "Converting…"
              : target === "pdf"
                ? `Convert to PDF${items.length ? ` (${items.length})` : ""}`
                : `Convert to ${target.toUpperCase()}${items.length > 1 ? ` & download ZIP (${items.length})` : ""}`}
          </span>
        </button>
      </div>
    </div>
  );
}
