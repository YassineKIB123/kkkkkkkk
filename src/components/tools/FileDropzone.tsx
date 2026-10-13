"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { UploadCloud, AlertCircle } from "lucide-react";

interface FileDropzoneProps {
  accept: string; // e.g. "application/pdf" or "image/*" or ".pdf,.png"
  multiple?: boolean;
  onFilesSelected: (files: File[]) => void;
  title?: string;
  description?: string;
}

export function FileDropzone({
  accept,
  multiple = false,
  onFilesSelected,
  title,
  description,
}: FileDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Validate incoming files against accept criteria
  const validateFile = useCallback(
    (file: File): boolean => {
      if (!accept || accept === "*") return true;

      const acceptedTokens = accept
        .split(",")
        .map((token) => token.trim().toLowerCase());
      const fileType = file.type.toLowerCase();
      const fileName = file.name.toLowerCase();

      return acceptedTokens.some((token) => {
        if (token.startsWith(".")) {
          return fileName.endsWith(token);
        }
        if (token.endsWith("/*")) {
          const baseType = token.slice(0, -2);
          return fileType.startsWith(baseType);
        }
        return fileType === token;
      });
    },
    [accept]
  );

  const processFiles = useCallback(
    (rawFiles: FileList | File[]) => {
      setErrorMessage(null);
      const fileArray = Array.from(rawFiles);
      if (fileArray.length === 0) return;

      const validFiles: File[] = [];
      const invalidFiles: File[] = [];

      fileArray.forEach((file) => {
        if (validateFile(file)) {
          validFiles.push(file);
        } else {
          invalidFiles.push(file);
        }
      });

      if (invalidFiles.length > 0) {
        setErrorMessage(
          `Some files were rejected because they do not match "${accept}".`
        );
      }

      if (validFiles.length > 0) {
        if (!multiple) {
          onFilesSelected([validFiles[0]]);
        } else {
          onFilesSelected(validFiles);
        }
      }
    },
    [accept, multiple, onFilesSelected, validateFile]
  );

  // Drag & drop handlers
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  // Clipboard Paste support (Ctrl+V / Cmd+V)
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (e.clipboardData?.files && e.clipboardData.files.length > 0) {
        processFiles(e.clipboardData.files);
      }
    };

    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, [processFiles]);

  return (
    <div className="w-full space-y-3">
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            fileInputRef.current?.click();
          }
        }}
        className={`group relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-10 text-center cursor-pointer transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 ${
          isDragging
            ? "border-emerald-500 bg-emerald-950/20 scale-[0.99]"
            : "border-zinc-800 bg-zinc-900/40 hover:border-zinc-700 hover:bg-zinc-900/70"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => {
            if (e.target.files) {
              processFiles(e.target.files);
              e.target.value = ""; // Reset input so same file can be selected again
            }
          }}
          className="hidden"
        />

        <div
          className={`flex h-14 w-14 items-center justify-center rounded-xl border transition-colors ${
            isDragging
              ? "border-emerald-500/60 bg-emerald-950 text-emerald-400"
              : "border-zinc-800 bg-zinc-900 text-zinc-400 group-hover:border-zinc-700 group-hover:text-emerald-400"
          }`}
        >
          <UploadCloud className="h-7 w-7" />
        </div>

        <h3 className="mt-4 text-base font-semibold text-white">
          {title || "Click to browse or drop your files here"}
        </h3>

        <p className="mt-1.5 text-xs sm:text-sm text-zinc-400 max-w-sm">
          {description ||
            `Supports ${multiple ? "multiple files" : "a single file"} matching ${accept}. You can also paste directly with Ctrl+V.`}
        </p>

        <div className="mt-4 inline-flex items-center gap-1.5 rounded-md border border-zinc-800 bg-zinc-950/70 px-2.5 py-1 text-[11px] font-mono text-zinc-400">
          <span>Processed locally in browser memory</span>
        </div>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="flex items-center gap-2 rounded-lg border border-red-900/60 bg-red-950/40 px-3 py-2 text-xs text-red-400 animate-fadeIn">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
}