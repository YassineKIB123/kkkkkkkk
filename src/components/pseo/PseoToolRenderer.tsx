"use client";

import React from "react";
import { ToolType } from "@/lib/pseo/pseo-data";
import CompressPdfPage from "@/app/tools/compress-pdf/page";
import MergePdfPage from "@/app/tools/merge-pdf/page";
import SplitPdfPage from "@/app/tools/split-pdf/page";
import RotatePdfPage from "@/app/tools/rotate-pdf/page";
import SignPdfPage from "@/app/tools/sign-pdf/page";
import ScanToPdfPage from "@/app/tools/scan/page";
import UniversalConverterPage from "@/app/tools/convert/page";
import ImagesToPdfPage from "@/app/tools/images-to-pdf/page";
import PdfToImagesPage from "@/app/tools/pdf-to-images/page";

interface PseoToolRendererProps {
  toolType: ToolType;
}

export function PseoToolRenderer({ toolType }: PseoToolRendererProps) {
  switch (toolType) {
    case "compress":
      return <CompressPdfPage />;
    case "merge":
      return <MergePdfPage />;
    case "split":
      return <SplitPdfPage />;
    case "rotate":
      return <RotatePdfPage />;
    case "sign":
      return <SignPdfPage />;
    case "scan":
      return <ScanToPdfPage />;
    case "jpg-to-pdf":
    case "png-to-pdf":
      return <ImagesToPdfPage />;
    case "pdf-to-jpg":
    case "pdf-to-png":
      return <PdfToImagesPage />;
    case "pdf-to-word":
    case "word-to-pdf":
    case "pdf-to-excel":
    case "excel-to-pdf":
    case "pdf-to-powerpoint":
    case "powerpoint-to-pdf":
    case "pdf-to-text":
    case "text-to-pdf":
    default:
      return <UniversalConverterPage />;
  }
}