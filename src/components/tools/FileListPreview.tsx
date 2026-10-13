"use client";

import React from "react";
import { FileText, Trash2, ArrowUp, ArrowDown } from "lucide-react";

interface FileListPreviewProps {
  files: File[];
  onRemove: (index: number) => void;
  onMoveUp?: (index: number) => void;
  onMoveDown?: (index: number) => void;
}

function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export function FileListPreview({
  files,
  onRemove,
  onMoveUp,
  onMoveDown,
}: FileListPreviewProps) {
  if (files.length === 0) return null;

  const totalSize = files.reduce((acc, file) => acc + file.size, 0);

  return (
    <div className="space-y-3">
      {/* List Header / Summary */}
      <div className="flex items-center justify-between text-xs text-zinc-400 px-1">
        <span>
          Selected Files ({files.length})
        </span>
        <span className="font-mono">
          Total: {formatBytes(totalSize)}
        </span>
      </div>

      {/* Items List */}
      <div className="space-y-2">
        {files.map((file, idx) => (
          <div
            key={`${file.name}-${file.size}-${idx}`}
            className="flex items-center justify-between gap-3 rounded-xl border border-zinc-800 bg-zinc-900/70 p-3 transition-colors hover:border-zinc-700 hover:bg-zinc-900"
          >
            {/* Left: Position & File Details */}
            <div className="flex items-center gap-3 min-w-0">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-zinc-800 bg-zinc-950 font-mono text-[11px] font-semibold text-zinc-400">
                {idx + 1}
              </span>

              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-950 text-zinc-400">
                <FileText className="h-4 w-4" />
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-zinc-200">
                  {file.name}
                </p>
                <p className="font-mono text-xs text-zinc-500">
                  {formatBytes(file.size)}
                </p>
              </div>
            </div>

            {/* Right: Order & Remove Actions */}
            <div className="flex items-center gap-1 shrink-0">
              {onMoveUp && (
                <button
                  type="button"
                  onClick={() => onMoveUp(idx)}
                  disabled={idx === 0}
                  title="Move up"
                  className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                >
                  <ArrowUp className="h-4 w-4" />
                </button>
              )}

              {onMoveDown && (
                <button
                  type="button"
                  onClick={() => onMoveDown(idx)}
                  disabled={idx === files.length - 1}
                  title="Move down"
                  className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                >
                  <ArrowDown className="h-4 w-4" />
                </button>
              )}

              <button
                type="button"
                onClick={() => onRemove(idx)}
                title="Remove file"
                className="rounded-lg p-1.5 text-zinc-400 hover:bg-red-950/50 hover:text-red-400 transition-colors ml-1"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}