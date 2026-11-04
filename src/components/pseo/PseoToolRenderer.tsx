"use client";

import React from "react";
import dynamic from "next/dynamic";
import { ToolType } from "@/lib/pseo/pseo-data";
import { EmbeddedToolProvider } from "@/components/tools/ToolLayout";

/**
 * Each tool is code-split into its own chunk so a pSEO landing page only ships the JS of the
 * one tool it renders. SSR stays enabled (next/dynamic default), so the exported static HTML
 * still contains the full tool UI. The placeholder is only visible during client-side
 * navigation while the chunk downloads; it reserves height to avoid layout shift.
 */
function ToolLoadingPlaceholder() {
  return (
    <div
      aria-busy="true"
      aria-label="Loading tool"
      className="mx-auto w-full max-w-5xl min-h-[640px] animate-pulse rounded-2xl bg-slate-100/60 dark:bg-slate-900/40"
    />
  );
}

const loading = () => <ToolLoadingPlaceholder />;

const CompressPdfPage = dynamic(() => import("@/app/tools/compress-pdf/page"), { loading });
const MergePdfPage = dynamic(() => import("@/app/tools/merge-pdf/page"), { loading });
const SplitPdfPage = dynamic(() => import("@/app/tools/split-pdf/page"), { loading });
const RotatePdfPage = dynamic(() => import("@/app/tools/rotate-pdf/page"), { loading });
const SignPdfPage = dynamic(() => import("@/app/tools/sign-pdf/page"), { loading });
const ScanToPdfPage = dynamic(() => import("@/app/tools/scan/page"), { loading });
const UniversalConverterPage = dynamic(() => import("@/app/tools/convert/page"), { loading });
const ImagesToPdfPage = dynamic(() => import("@/app/tools/images-to-pdf/page"), { loading });
const PdfToImagesPage = dynamic(() => import("@/app/tools/pdf-to-images/page"), { loading });
const WatermarkPdfPage = dynamic(() => import("@/app/tools/watermark-pdf/page"), { loading });
const SanitizePdfPage = dynamic(() => import("@/app/tools/sanitize-pdf/page"), { loading });
const EditPdfPage = dynamic(() => import("@/app/tools/edit-pdf/page"), { loading });
const CompressImagePage = dynamic(() => import("@/app/tools/compress-image/page"), { loading });

interface PseoToolRendererProps {
  toolType: ToolType;
  targetKb?: number;
}

export function PseoToolRenderer({ toolType, targetKb }: PseoToolRendererProps) {
  const renderTool = () => {
    switch (toolType) {
      case "compress":
        return <CompressPdfPage targetKb={targetKb} />;
      case "compress-image":
        return <CompressImagePage targetKb={targetKb} />;
      case "merge":
        return <MergePdfPage />;
      case "split":
        return <SplitPdfPage />;
      case "rotate":
        return <RotatePdfPage />;
      case "sign":
        return <SignPdfPage />;
      case "edit":
        return <EditPdfPage />;
      case "scan":
        return <ScanToPdfPage />;
      case "watermark":
        return <WatermarkPdfPage />;
      case "sanitize":
        return <SanitizePdfPage />;
      case "jpg-to-pdf":
      case "png-to-pdf":
        return <ImagesToPdfPage targetKb={targetKb} />;
      case "pdf-to-jpg":
      case "pdf-to-png":
        return <PdfToImagesPage initialFormat={toolType === "pdf-to-jpg" ? "jpeg" : "png"} />;
      case "pdf-to-word":
      case "word-to-pdf":
      case "pdf-to-excel":
      case "excel-to-pdf":
      case "pdf-to-powerpoint":
      case "powerpoint-to-pdf":
      case "pdf-to-text":
      case "text-to-pdf":
      default:
        return <UniversalConverterPage initialToolType={toolType} />;
    }
  };

  return <EmbeddedToolProvider>{renderTool()}</EmbeddedToolProvider>;
}
