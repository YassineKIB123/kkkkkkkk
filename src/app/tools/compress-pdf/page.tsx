"use client";

import { ToolSuccessAlert } from "@/components/common/ToolSuccessAlert";

import React, { useState } from "react";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { FileDropzone } from "@/components/tools/FileDropzone";
import { compressPDFDocument, downloadBlob } from "@/lib/pdf/pdf-utils";
import { useLanguage } from "@/context/LanguageContext";
import {
  FileText,
  Sliders,
  Download,
  Loader2,
  Trash2,
  AlertCircle,
  Zap,
  Target,
} from "lucide-react";

type CompressionLevel = "recommended" | "extreme" | "low";

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

interface CompressPdfPageProps {
  targetKb?: number;
}

export default function CompressPdfPage({ targetKb }: CompressPdfPageProps = {}) {
  const { t, language } = useLanguage();
  const [file, setFile] = useState<File | null>(null);
  const [level, setLevel] = useState<CompressionLevel>(
    targetKb && targetKb <= 200 ? "extreme" : "recommended"
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressText, setProgressText] = useState<string>("");
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
    setProgressText("");
  };

  const handleLevelChange = (newLevel: CompressionLevel) => {
    setLevel(newLevel);
    setResultBytes(null);
    setSavedRatio(null);
  };

  const handleCompress = async () => {
    if (!file) return;

    setIsProcessing(true);
    setErrorMessage(null);
    setProgressText(t.toolUi.compress.analyzing);

    try {
      const compressed = await compressPDFDocument(
        file,
        level,
        targetKb,
        (current, total) => {
          setProgressText(
            language === "AR"
              ? `جاري تحسين الصفحة ${current} من ${total}...`
              : language === "FR"
                ? `Optimisation de la page ${current} sur ${total}...`
                : language === "ES"
                  ? `Optimizando página ${current} de ${total}...`
                  : language === "RU"
                    ? `Оптимизация страницы ${current} из ${total}...`
                    : `Optimizing page ${current} of ${total}...`
          );
        }
      );

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
      setProgressText("");
    }
  };

  const handleDownload = () => {
    if (!resultBytes || !file) return;
    downloadBlob(resultBytes, `compressed_${file.name}`);
  };

  const compressionOptions = [
    {
      id: "recommended" as const,
      title: t.toolUi.compress.recommended,
      desc: t.toolUi.compress.recommendedDesc,
    },
    {
      id: "extreme" as const,
      title: t.toolUi.compress.extreme,
      desc: t.toolUi.compress.extremeDesc,
    },
    {
      id: "low" as const,
      title: t.toolUi.compress.lossless,
      desc: t.toolUi.compress.losslessDesc,
    },
  ];

  return (
    <ToolLayout
      toolId="compress"
      title="Compress PDF"
      description="Reduce PDF file size while maintaining document fidelity. All compression runs 100% inside your browser."
    >
      <div className="space-y-6">
        {targetKb && (
          <div className="flex items-center justify-between rounded-xl border border-rose-200 bg-rose-50/70 px-4 py-2.5 text-xs text-rose-800 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300">
            <div className="flex items-center gap-2 font-semibold">
              <Target className="h-4 w-4 text-rose-600 dark:text-rose-400" />
              <span>
                {language === "AR"
                  ? `الهدف النشط: حجم الملف أقل من ${targetKb} كيلوبايت`
                  : `Preset Active: Target File Size Under ${targetKb} KB`}
              </span>
            </div>
            <span className="font-mono text-[11px] uppercase font-bold">Auto-Tuned</span>
          </div>
        )}

        {!file && (
          <FileDropzone
            accept="application/pdf,.pdf"
            multiple={false}
            onFilesSelected={handleFileSelected}
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
                    {t.common.originalSize}: {formatBytes(file.size)}
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
                <span>{t.common.remove}</span>
              </button>
            </div>

            {/* Compression Options */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                <Sliders className="h-4 w-4 text-rose-600" />
                <span>
                  {language === "AR"
                    ? "مستوى الضغط"
                    : language === "FR"
                      ? "Niveau de compression"
                      : language === "ES"
                        ? "Nivel de compresión"
                        : language === "RU"
                          ? "Уровень сжатия"
                          : "Compression Level"}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {compressionOptions.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleLevelChange(item.id)}
                    className={`rounded-xl border p-4 text-left rtl:text-right transition-all ${
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
              <ToolSuccessAlert
                message={
                  language === "AR"
                    ? `\u0627\u0643\u062A\u0645\u0644 \u0627\u0644\u0636\u063A\u0637 \u0628\u0646\u062C\u0627\u062D! \u0627\u0644\u062D\u062C\u0645 \u0627\u0644\u0645\u0636\u063A\u0648\u0637: ${formatBytes(resultBytes.length)} (\u0646\u0633\u0628\u0629 \u0627\u0644\u062A\u062E\u0641\u064A\u0636: ${savedRatio}%)`
                    : language === "FR"
                      ? `Compression terminee ! Taille : ${formatBytes(resultBytes.length)} (reduction : ${savedRatio}%)`
                      : language === "ES"
                        ? `¡Compresión completada! Tamaño: ${formatBytes(resultBytes.length)} (reducción: ${savedRatio}%)`
                        : language === "RU"
                          ? `\u0421\u0436\u0430\u0442\u0438\u0435 \u0437\u0430\u0432\u0435\u0440\u0448\u0435\u043D\u043E! \u0420\u0430\u0437\u043C\u0435\u0440: ${formatBytes(resultBytes.length)} (\u0441\u043E\u043A\u0440\u0430\u0449\u0435\u043D\u0438\u0435: ${savedRatio}%)`
                          : `Success! Compressed from ${formatBytes(file.size)} to ${formatBytes(resultBytes.length)} (${savedRatio}% reduction).`
                }
              />
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
                <span>{progressText || t.dropzone.processedLocally}</span>
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
                      <span>{progressText || t.common.processing}</span>
                    </>
                  ) : (
                    <span>{t.toolUi.compress.compressBtn}</span>
                  )}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleDownload}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-emerald-600/20 transition-all"
                >
                  <Download className="h-4 w-4 text-white" />
                  <span>{t.toolUi.compress.downloadBtn}</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}

