"use client";

import React, { useState } from "react";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { FileDropzone } from "@/components/tools/FileDropzone";
import {
  wordToPDF,
  excelToPDF,
  textToPDF,
  pdfToWord,
  pdfToExcel,
  pdfToPowerPoint,
  pdfToText,
} from "@/lib/pdf/universal-converter";
import { imagesToPDF, downloadBlob } from "@/lib/pdf/pdf-utils";
import {
  FileText,
  FileSpreadsheet,
  Presentation,
  FileCode,
  ArrowRight,
  Download,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Trash2,
  FileType,
  Sparkles,
  Layers,
} from "lucide-react";

type TargetFormat = "pdf" | "docx" | "xlsx" | "pptx" | "txt";

interface ConversionOption {
  id: TargetFormat;
  label: string;
  ext: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
}

export default function UniversalConverterPage() {
  const [file, setFile] = useState<File | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<TargetFormat>("pdf");
  const [isConverting, setIsConverting] = useState(false);
  const [progressStatus, setProgressStatus] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Detect file category from extension
  const getFileCategory = (
    fileName: string
  ): "pdf" | "word" | "excel" | "text" | "image" | "unknown" => {
    const ext = fileName.split(".").pop()?.toLowerCase();
    if (ext === "pdf") return "pdf";
    if (["docx", "doc"].includes(ext || "")) return "word";
    if (["xlsx", "xls", "csv"].includes(ext || "")) return "excel";
    if (["txt", "md", "json", "rtf"].includes(ext || "")) return "text";
    if (["png", "jpg", "jpeg", "webp"].includes(ext || "")) return "image";
    return "unknown";
  };

  const handleFileSelected = (files: File[]) => {
    const selected = files[0];
    if (!selected) return;

    setErrorMessage(null);
    setSuccessMessage(null);
    setFile(selected);

    const cat = getFileCategory(selected.name);
    if (cat === "pdf") {
      setSelectedFormat("docx"); // Default target format for PDF is Word
    } else {
      setSelectedFormat("pdf"); // Non-PDFs default to converting to PDF
    }
  };

  const handleClear = () => {
    setFile(null);
    setErrorMessage(null);
    setSuccessMessage(null);
    setProgressStatus("");
  };

  const handleConvert = async () => {
    if (!file) return;

    setIsConverting(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    setProgressStatus("Reading file structures...");

    try {
      const category = getFileCategory(file.name);
      const baseName = file.name.replace(/\.[^/.]+$/, "");

      // CASE A: Converting TO PDF
      if (selectedFormat === "pdf") {
        setProgressStatus("Compiling to PDF...");
        let pdfBytes: Uint8Array;

        if (category === "word") {
          pdfBytes = await wordToPDF(file);
        } else if (category === "excel") {
          pdfBytes = await excelToPDF(file);
        } else if (category === "image") {
          pdfBytes = await imagesToPDF([file], {
            orientation: "portrait",
            margin: 0,
            pageSize: "fit",
          });
        } else {
          pdfBytes = await textToPDF(file);
        }

        const outName = `${baseName}_converted.pdf`;
        downloadBlob(pdfBytes, outName);
        setSuccessMessage(`Success! Converted "${file.name}" to "${outName}".`);
      }
      // CASE B: Converting FROM PDF
      else {
        if (selectedFormat === "docx") {
          setProgressStatus("Reconstructing Word paragraphs...");
          const docxBlob = await pdfToWord(file);
          downloadBlob(
            docxBlob,
            `${baseName}.docx`,
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          );
        } else if (selectedFormat === "xlsx") {
          setProgressStatus("Tabulating spreadsheet data...");
          const xlsxBlob = await pdfToExcel(file);
          downloadBlob(
            xlsxBlob,
            `${baseName}.xlsx`,
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          );
        } else if (selectedFormat === "pptx") {
          setProgressStatus("Generating slide presentation...");
          const pptxBlob = await pdfToPowerPoint(file);
          downloadBlob(
            pptxBlob,
            `${baseName}.pptx`,
            "application/vnd.openxmlformats-officedocument.presentationml.presentation"
          );
        } else if (selectedFormat === "txt") {
          setProgressStatus("Extracting raw text...");
          const text = await pdfToText(file);
          const textBlob = new Blob([text], { type: "text/plain" });
          downloadBlob(textBlob, `${baseName}.txt`, "text/plain");
        }

        setSuccessMessage(
          `Success! Finished converting "${file.name}" to .${selectedFormat}.`
        );
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to convert document.";
      setErrorMessage(msg);
    } finally {
      setIsConverting(false);
      setProgressStatus("");
    }
  };

  const isPdf = file ? getFileCategory(file.name) === "pdf" : false;

  const PDF_OPTIONS: ConversionOption[] = [
    {
      id: "docx",
      label: "Microsoft Word",
      ext: ".docx",
      desc: "Editable Word document with reconstructed paragraphs",
      icon: FileText,
    },
    {
      id: "xlsx",
      label: "Microsoft Excel",
      ext: ".xlsx",
      desc: "Structured spreadsheet data and rows",
      icon: FileSpreadsheet,
    },
    {
      id: "pptx",
      label: "PowerPoint",
      ext: ".pptx",
      desc: "Formatted slide deck presentation",
      icon: Presentation,
    },
    {
      id: "txt",
      label: "Plain Text",
      ext: ".txt",
      desc: "Clean raw text extraction",
      icon: FileCode,
    },
  ];

  return (
    <ToolLayout
      title="Universal Document Converter"
      description="Convert Word, Excel, PowerPoint, Text, and Images to and from PDF. All document parsing executes 100% locally in your browser."
    >
      <div className="space-y-6">
        {/* Upload Dropzone */}
        {!file && (
          <FileDropzone
            accept=".pdf,.docx,.doc,.xlsx,.xls,.txt,.md,.png,.jpg,.jpeg,.webp"
            multiple={false}
            onFilesSelected={handleFileSelected}
            title="Drop any document or image here to convert"
            description="Supports PDF, Word (.docx), Excel (.xlsx), Text (.txt), and Images. Files never leave your device."
          />
        )}

        {/* Selected Document Workspace */}
        {file && (
          <div className="space-y-6 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 sm:p-6 backdrop-blur-sm">
            {/* File Header */}
            <div className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-950/70 p-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 text-emerald-400">
                  <FileType className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-white">
                    {file.name}
                  </p>
                  <p className="font-mono text-xs text-zinc-400">
                    Type:{" "}
                    <span className="text-emerald-400 uppercase font-bold">
                      {getFileCategory(file.name)}
                    </span>{" "}
                    • {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleClear}
                disabled={isConverting}
                className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs font-medium text-zinc-400 hover:border-zinc-700 hover:text-white transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Choose Another</span>
              </button>
            </div>

            {/* Target Conversion Options */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-300">
                <Layers className="h-4 w-4 text-emerald-400" />
                <span>Select Target Output Format</span>
              </div>

              {/* IF NON-PDF WAS UPLOADED: Auto-Target PDF */}
              {!isPdf && (
                <div className="rounded-xl border border-emerald-500/50 bg-emerald-950/30 p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
                      <FileType className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">
                        Portable Document Format (.pdf)
                      </h4>
                      <p className="text-xs text-zinc-400">
                        Compile into an optimized, standard PDF document
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-emerald-400 font-semibold uppercase border border-emerald-500/40 px-2 py-0.5 rounded">
                    Selected
                  </span>
                </div>
              )}

              {/* IF PDF WAS UPLOADED: Show Format Picker */}
              {isPdf && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {PDF_OPTIONS.map((opt) => {
                    const Icon = opt.icon;
                    const isSelected = selectedFormat === opt.id;

                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setSelectedFormat(opt.id)}
                        className={`flex items-start gap-3 rounded-xl border p-4 text-left transition-all ${
                          isSelected
                            ? "border-emerald-500 bg-emerald-950/40 shadow-[0_0_15px_-3px_rgba(16,185,129,0.3)]"
                            : "border-zinc-800 bg-zinc-950/60 hover:border-zinc-700 hover:bg-zinc-900"
                        }`}
                      >
                        <div
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition-colors ${
                            isSelected
                              ? "border-emerald-500/60 bg-emerald-900/50 text-emerald-400"
                              : "border-zinc-800 bg-zinc-900 text-zinc-400"
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-white">
                              {opt.label}
                            </span>
                            <span className="rounded bg-zinc-900 px-1.5 py-0.2 font-mono text-[10px] text-zinc-400 border border-zinc-800">
                              {opt.ext}
                            </span>
                          </div>
                          <p className="mt-1 text-xs text-zinc-400 leading-snug">
                            {opt.desc}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
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

            {/* Bottom Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <span className="text-xs text-zinc-500">
                {progressStatus || "Ready to process in browser memory."}
              </span>

              <button
                type="button"
                onClick={handleConvert}
                disabled={isConverting}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 px-6 py-2.5 text-sm font-semibold text-zinc-950 shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-40 transition-all"
              >
                {isConverting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-zinc-950" />
                    <span>Processing Conversion...</span>
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 text-zinc-950" />
                    <span>Convert & Download</span>
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