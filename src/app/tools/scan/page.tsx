"use client";

import { ToolSuccessAlert } from "@/components/common/ToolSuccessAlert";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { useLanguage } from "@/context/LanguageContext";
import {
  warpPerspective,
  processCanvasWithFilter,
  detectDocumentCorners,
  FilterType,
} from "@/lib/scanner/image-processing";
import { canvasesToPDF, downloadBlob } from "@/lib/pdf/pdf-utils";
import {
  Camera,
  Image as ImageIcon,
  RefreshCw,
  Move,
  Check,
  X,
  AlertCircle,
  Wand2,
  SlidersHorizontal,
  FileDown,
  Plus,
  Loader2,
  Trash2,
  ArrowLeft,
  Sparkles,
} from "lucide-react";

export interface CornerPoint {
  x: number;
  y: number;
}

interface ScannedPageItem {
  id: string;
  sourceImageSrc: string;
  corners: CornerPoint[];
  warpedCanvas: HTMLCanvasElement;
  filteredCanvas: HTMLCanvasElement;
  filter: FilterType;
  /** B&W strength: -40 (lighter) … +40 (darker). */
  bwOffset: number;
  thumbnailDataUrl: string;
}

const DEFAULT_CORNERS: CornerPoint[] = [
  { x: 0.1, y: 0.1 },
  { x: 0.9, y: 0.1 },
  { x: 0.9, y: 0.9 },
  { x: 0.1, y: 0.9 },
];

const CORNER_LABELS = ["Top-Left", "Top-Right", "Bottom-Right", "Bottom-Left"];

const PREVIEW_MAX_DIM = 1600;
const LOUPE_SIZE = 112;
const LOUPE_ZOOM = 3;

/**
 * Downscaled preview for the on-screen result. B&W previews are PNG: JPEG adds ringing around
 * crisp black text, which made the B&W filter look noisy even when the page itself was clean.
 */
function canvasToPreviewUrl(canvas: HTMLCanvasElement, filter: FilterType): string {
  const scale = Math.min(1, PREVIEW_MAX_DIM / Math.max(canvas.width, canvas.height));
  let source = canvas;
  if (scale < 1) {
    const small = document.createElement("canvas");
    small.width = Math.max(1, Math.round(canvas.width * scale));
    small.height = Math.max(1, Math.round(canvas.height * scale));
    const ctx = small.getContext("2d");
    if (ctx) {
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(canvas, 0, 0, small.width, small.height);
      source = small;
    }
  }
  return filter === "bw" ? source.toDataURL("image/png") : source.toDataURL("image/jpeg", 0.88);
}

/** Lets React paint a spinner before a heavy synchronous image operation starts. */
function nextPaint(): Promise<void> {
  return new Promise((resolve) => requestAnimationFrame(() => setTimeout(resolve, 0)));
}

export default function ScanToPdfPage() {
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState<"input" | "crop" | "result">("input");

  const [currentImageSrc, setCurrentImageSrc] = useState<string | null>(null);
  const [corners, setCorners] = useState<CornerPoint[]>(DEFAULT_CORNERS);
  const [activeCornerIdx, setActiveCornerIdx] = useState<number | null>(null);

  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const [scannedPages, setScannedPages] = useState<ScannedPageItem[]>([]);
  const [activePageIndex, setActivePageIndex] = useState<number>(0);

  const [isProcessing, setIsProcessing] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);
  /** Slider value being dragged, tied to the page it belongs to. */
  const [bwDraft, setBwDraft] = useState<{ pageId: string; value: number } | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [feedbackError, setFeedbackError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });

  const shouldAutoDetectRef = useRef<boolean>(true);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const isCameraModalOpenRef = useRef(false);

  // Automatically pick up files passed from the Homepage Hero Dropzone
  useEffect(() => {
    const win = window as Window & { __pdfStudioPendingFiles?: File[] | null };
    if (win.__pdfStudioPendingFiles && win.__pdfStudioPendingFiles.length > 0) {
      const pendingFile = win.__pdfStudioPendingFiles[0];
      win.__pdfStudioPendingFiles = null;
      if (pendingFile && pendingFile.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          if (typeof ev.target?.result === "string") {
            shouldAutoDetectRef.current = true;
            setCurrentImageSrc(ev.target.result);
            setCorners(DEFAULT_CORNERS);
            setCurrentStep("crop");
          }
        };
        reader.readAsDataURL(pendingFile);
      }
    }
  }, []);

  const stopCameraStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      isCameraModalOpenRef.current = false;
      stopCameraStream();
    };
  }, [stopCameraStream]);

  const openCamera = async () => {
    setCameraError(null);
    setIsCameraOpen(true);
    isCameraModalOpenRef.current = true;

    try {
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: "environment" },
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      if (!isCameraModalOpenRef.current) {
        mediaStream.getTracks().forEach((track) => track.stop());
        return;
      }

      streamRef.current = mediaStream;

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play().catch(() => {});
      }
    } catch (err: unknown) {
      if (!isCameraModalOpenRef.current) return;
      const message =
        err instanceof Error
          ? err.message
          : "Unable to access device camera. Please check camera permissions.";
      setCameraError(message);
    }
  };

  const closeCamera = () => {
    isCameraModalOpenRef.current = false;
    stopCameraStream();
    setIsCameraOpen(false);
    setCameraError(null);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const capturedDataUrl = canvas.toDataURL("image/jpeg", 0.95);

    shouldAutoDetectRef.current = true;
    setCurrentImageSrc(capturedDataUrl);
    setCorners(DEFAULT_CORNERS);
    setCurrentStep("crop");
    closeCamera();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === "string") {
        shouldAutoDetectRef.current = true;
        setCurrentImageSrc(event.target.result);
        setCorners(DEFAULT_CORNERS);
        setCurrentStep("crop");
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const updateContainerSize = useCallback(() => {
    if (editorContainerRef.current) {
      const rect = editorContainerRef.current.getBoundingClientRect();
      setContainerDimensions({ width: rect.width, height: rect.height });
    }
  }, []);

  const handleImageLoad = useCallback(() => {
    updateContainerSize();
    if (imageRef.current) {
      if (shouldAutoDetectRef.current) {
        const detected = detectDocumentCorners(imageRef.current);
        setCorners(detected);
        shouldAutoDetectRef.current = false;
      }
    }
  }, [updateContainerSize]);

  const handleAutoDetectEdges = () => {
    if (imageRef.current) {
      setCorners(detectDocumentCorners(imageRef.current));
    }
  };

  useEffect(() => {
    window.addEventListener("resize", updateContainerSize);
    return () => window.removeEventListener("resize", updateContainerSize);
  }, [updateContainerSize]);

  const handlePointerMove = useCallback(
    (e: PointerEvent) => {
      if (activeCornerIdx === null || !editorContainerRef.current) return;

      const rect = editorContainerRef.current.getBoundingClientRect();
      const rawNormX = Math.max(0, Math.min(1, (e.clientX - rect.left) / (rect.width || 1)));
      const rawNormY = Math.max(0, Math.min(1, (e.clientY - rect.top) / (rect.height || 1)));

      setCorners((prev) => {
        const next = [...prev];
        next[activeCornerIdx] = { x: rawNormX, y: rawNormY };
        return next;
      });
    },
    [activeCornerIdx]
  );

  const handlePointerUp = useCallback(() => {
    setActiveCornerIdx(null);
  }, []);

  useEffect(() => {
    if (activeCornerIdx !== null) {
      window.addEventListener("pointermove", handlePointerMove);
      window.addEventListener("pointerup", handlePointerUp);
      window.addEventListener("pointercancel", handlePointerUp);
    }
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerUp);
    };
  }, [activeCornerIdx, handlePointerMove, handlePointerUp]);

  const getPixelCoord = (corner: CornerPoint) => ({
    x: corner.x * containerDimensions.width,
    y: corner.y * containerDimensions.height,
  });

  const handleEnhanceAndCrop = async () => {
    if (!imageRef.current || !currentImageSrc) return;

    setIsProcessing(true);
    setFeedbackError(null);

    try {
      const img = imageRef.current;
      const absoluteCorners = corners.map((c) => ({
        x: Math.round(c.x * img.naturalWidth),
        y: Math.round(c.y * img.naturalHeight),
      }));

      await nextPaint();
      const warpedCanvas = await warpPerspective(img, absoluteCorners);

      // Re-cropping an existing page keeps the filter the user already picked.
      const existing =
        scannedPages[activePageIndex]?.sourceImageSrc === currentImageSrc ? scannedPages[activePageIndex] : null;
      const filter: FilterType = existing?.filter ?? "magic";
      const bwOffset = existing?.bwOffset ?? 0;
      const filteredCanvas = processCanvasWithFilter(warpedCanvas, filter, { bwOffset });
      const thumb = canvasToPreviewUrl(filteredCanvas, filter);

      const newPageItem: ScannedPageItem = {
        id: `page_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        sourceImageSrc: currentImageSrc,
        corners: [...corners],
        warpedCanvas,
        filteredCanvas,
        filter,
        bwOffset,
        thumbnailDataUrl: thumb,
      };

      if (existing) {
        setScannedPages((prev) => prev.map((p) => (p.id === existing.id ? newPageItem : p)));
      } else {
        setScannedPages((prev) => [...prev, newPageItem]);
        setActivePageIndex(scannedPages.length);
      }

      setCurrentStep("result");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to process document crop.";
      setFeedbackError(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  const applyFilter = useCallback(
    async (filter: FilterType, bwOffset: number) => {
      const page = scannedPages[activePageIndex];
      if (!page) return;
      setIsFiltering(true);
      setFeedbackError(null);
      try {
        await nextPaint();
        const filteredCanvas = processCanvasWithFilter(page.warpedCanvas, filter, { bwOffset });
        const thumbnailDataUrl = canvasToPreviewUrl(filteredCanvas, filter);
        setScannedPages((prev) =>
          prev.map((p) => (p.id === page.id ? { ...p, filter, bwOffset, filteredCanvas, thumbnailDataUrl } : p))
        );
      } catch (err: unknown) {
        setFeedbackError(err instanceof Error ? err.message : "Failed to apply the filter.");
      } finally {
        setIsFiltering(false);
      }
    },
    [scannedPages, activePageIndex]
  );

  const handleFilterChange = (filter: FilterType) => {
    const page = scannedPages[activePageIndex];
    if (!page || isFiltering || page.filter === filter) return;
    void applyFilter(filter, page.bwOffset);
  };

  const viewedPage = scannedPages[activePageIndex];
  const bwSlider = viewedPage && bwDraft?.pageId === viewedPage.id ? bwDraft.value : viewedPage?.bwOffset ?? 0;

  // Re-run B&W shortly after the slider stops moving.
  useEffect(() => {
    if (!viewedPage || !bwDraft || bwDraft.pageId !== viewedPage.id) return;
    if (viewedPage.filter !== "bw" || viewedPage.bwOffset === bwDraft.value) return;
    const timer = setTimeout(() => void applyFilter("bw", bwDraft.value), 180);
    return () => clearTimeout(timer);
  }, [bwDraft, viewedPage, applyFilter]);

  const handleBackToAdjustCorners = () => {
    const page = scannedPages[activePageIndex];
    if (page) {
      shouldAutoDetectRef.current = false;
      setCurrentImageSrc(page.sourceImageSrc);
      setCorners(page.corners);
    }
    setCurrentStep("crop");
  };

  const handleScanAnotherPage = () => {
    setCurrentImageSrc(null);
    setCorners(DEFAULT_CORNERS);
    setCurrentStep("input");
  };

  const handleDeletePage = (index: number) => {
    if (scannedPages.length <= 1) {
      setScannedPages([]);
      setCurrentStep("input");
      setCurrentImageSrc(null);
      return;
    }

    setScannedPages((prev) => prev.filter((_, idx) => idx !== index));
    setActivePageIndex((prev) => Math.max(0, index <= prev ? prev - 1 : prev));
  };

  const handleDownloadPDF = async () => {
    if (scannedPages.length === 0) return;

    setIsExporting(true);
    setFeedbackError(null);

    try {
      const canvasesToEmbed = scannedPages.map((p) => p.filteredCanvas);
      const pdfBytes = await canvasesToPDF(
        canvasesToEmbed,
        scannedPages.map((p) => (p.filter === "bw" ? "png" : "jpeg"))
      );
      const filename = `scan_${Date.now()}.pdf`;
      downloadBlob(pdfBytes, filename);
      setSuccessMessage(`Success! Saved and downloaded "${filename}" with ${scannedPages.length} scanned page(s).`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to assemble PDF document.";
      setFeedbackError(msg);
    } finally {
      setIsExporting(false);
    }
  };

  const activePage = scannedPages[activePageIndex];

  return (
    <ToolLayout toolId="scan"
      title="Online Document Scanner to PDF"
      description="Scan physical receipts, invoices, IDs, and paper contracts using your phone camera or uploaded photos with automatic edge detection and perspective correction."
      faqs={[
        {
          question: "How does the browser-based document scanner work?",
          answer:
            "Take a photo with your smartphone or webcam or upload an existing picture. Our computer-vision engine automatically detects the 4 corners of your paper, flattens skewed camera angles into a straight rectangle, and applies studio readability filters.",
        },
        {
          question: "Which scan filter should I use for text documents and receipts?",
          answer:
            "Use 'Magic Color' to brighten paper backgrounds while keeping ink colors vibrant, or 'B&W Clean' for high-contrast black-and-white output that looks like a laser-printed office scan.",
        },
        {
          question: "Can I scan multiple pages into a single PDF?",
          answer:
            "Yes. After cropping and enhancing your first page, click 'Add Page' or 'Scan Another Page' to capture additional sheets before exporting the entire batch as a standard A4 PDF.",
        },
      ]}
    >
      <div className="space-y-6">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileUpload}
        />

        {/* STAGE 1: INTAKE CARDS */}
        {currentStep === "input" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <button
                type="button"
                onClick={openCamera}
                className="group flex flex-col items-center justify-center gap-4 rounded-2xl border border-slate-200 bg-slate-50/60 p-10 hover:border-rose-400 hover:bg-white hover:shadow-md dark:border-slate-800 dark:bg-slate-900/50 dark:hover:border-rose-500 transition-all text-center"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-rose-100 bg-rose-50 text-rose-600 dark:border-rose-900/50 dark:bg-rose-950/50 dark:text-rose-400 group-hover:scale-105 transition-transform">
                  <Camera className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-rose-600 transition-colors">{t.toolUi.scan.takePhoto}</h3>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{t.toolUi.scan.takePhotoDesc}</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="group flex flex-col items-center justify-center gap-4 rounded-2xl border border-slate-200 bg-slate-50/60 p-10 hover:border-rose-400 hover:bg-white hover:shadow-md dark:border-slate-800 dark:bg-slate-900/50 dark:hover:border-rose-500 transition-all text-center"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-rose-100 bg-rose-50 text-rose-600 dark:border-rose-900/50 dark:bg-rose-950/50 dark:text-rose-400 group-hover:scale-105 transition-transform">
                  <ImageIcon className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-rose-600 transition-colors">{t.toolUi.scan.uploadImage}</h3>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{t.toolUi.scan.uploadImageDesc}</p>
                </div>
              </button>
            </div>

            {scannedPages.length > 0 && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setCurrentStep("result")}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 shadow-2xs"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Return to Scanned Batch ({scannedPages.length} Pages)</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* STAGE 2: 4-CORNER BOUNDARY EDITOR */}
        {currentStep === "crop" && currentImageSrc && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900 px-4 py-3">
              <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                <Move className="h-4 w-4 text-rose-600 shrink-0" />
                <span>Auto-detected document edges. Drag the 4 corner pins to fine-tune.</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleAutoDetectEdges}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 dark:border-rose-900/50 dark:bg-rose-950/40 px-3 py-1.5 text-xs font-semibold text-rose-700 dark:text-rose-300 hover:bg-rose-100 transition-colors"
                >
                  <Sparkles className="h-3.5 w-3.5 text-rose-600" />
                  <span>Auto-Snap Edges</span>
                </button>

                
                <button
                  type="button"
                  onClick={() => setCorners(DEFAULT_CORNERS)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition-colors shadow-2xs"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span>Reset</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentStep("input")}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 transition-colors shadow-2xs"
                >
                  <X className="h-3.5 w-3.5" />
                  <span>Cancel</span>
                </button>
              </div>
            </div>

            <div className="relative flex justify-center rounded-2xl border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-950 p-3 sm:p-4 overflow-visible select-none">
              <div
                ref={editorContainerRef}
                className="relative inline-block max-w-full touch-none"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  ref={imageRef}
                  src={currentImageSrc}
                  alt="Scan Subject"
                  onLoad={handleImageLoad}
                  className="max-h-[62vh] w-auto max-w-full rounded-lg object-contain shadow-lg pointer-events-none"
                />

                {containerDimensions.width > 0 && (
                  <svg
                    className="absolute inset-0 h-full w-full pointer-events-none"
                    viewBox={`0 0 ${containerDimensions.width} ${containerDimensions.height}`}
                  >
                    <polygon
                      points={corners
                        .map((c) => {
                          const pt = getPixelCoord(c);
                          return `${pt.x},${pt.y}`;
                        })
                        .join(" ")}
                      fill="rgba(225, 29, 72, 0.18)"
                      stroke="#e11d48"
                      strokeWidth="2.5"
                      strokeDasharray="6 3"
                    />
                  </svg>
                )}

                {containerDimensions.width > 0 &&
                  corners.map((corner, idx) => {
                    const pt = getPixelCoord(corner);
                    const isActive = activeCornerIdx === idx;

                    return (
                      <div
                        key={idx}
                        onPointerDown={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setActiveCornerIdx(idx);
                        }}
                        style={{
                          left: `${pt.x}px`,
                          top: `${pt.y}px`,
                          touchAction: "none",
                        }}
                        className="group absolute -translate-x-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing p-3.5 z-20"
                      >
                        {/* Sleek precision handle */}
                        <div
                          className={`relative flex h-3.5 w-3.5 items-center justify-center rounded-full border-[1.5px] transition-transform ${
                            isActive
                              ? "border-rose-600 bg-white/40 ring-4 ring-rose-500/40 scale-125"
                              : "border-rose-600 bg-white/60 dark:bg-slate-900/60 shadow-xs ring-1 ring-white/90 dark:ring-black/90 hover:scale-125"
                          }`}
                        >
                          <div className="h-1 w-1 rounded-full bg-rose-600" />
                        </div>

                        <span className="pointer-events-none absolute left-6 top-1/2 -translate-y-1/2 whitespace-nowrap rounded bg-slate-900 px-1.5 py-0.5 text-[9px] font-mono text-white opacity-0 group-hover:opacity-100 transition-opacity">
                          {CORNER_LABELS[idx]}
                        </span>
                      </div>
                    );
                  })}

                {/* Magnifier: shows what is under the finger/cursor while a corner is dragged. */}
                {containerDimensions.width > 0 && activeCornerIdx !== null && (() => {
                  const pt = getPixelCoord(corners[activeCornerIdx]);
                  const half = LOUPE_SIZE / 2;
                  const above = pt.y - LOUPE_SIZE - 28 >= -12;
                  const left = Math.min(
                    Math.max(pt.x - half, -8),
                    containerDimensions.width - LOUPE_SIZE + 8
                  );
                  const top = above ? pt.y - LOUPE_SIZE - 28 : pt.y + 28;
                  return (
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute z-30 overflow-hidden rounded-full border-2 border-white bg-slate-900 shadow-xl ring-1 ring-black/30"
                      style={{
                        width: LOUPE_SIZE,
                        height: LOUPE_SIZE,
                        left,
                        top,
                        backgroundImage: `url(${currentImageSrc})`,
                        backgroundRepeat: "no-repeat",
                        backgroundSize: `${containerDimensions.width * LOUPE_ZOOM}px ${containerDimensions.height * LOUPE_ZOOM}px`,
                        backgroundPosition: `${half - pt.x * LOUPE_ZOOM}px ${half - pt.y * LOUPE_ZOOM}px`,
                      }}
                    >
                      <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-rose-500/90" />
                      <div className="absolute top-1/2 left-0 h-px w-full -translate-y-1/2 bg-rose-500/90" />
                    </div>
                  );
                })()}
              </div>
            </div>

            {successMessage && (
              <ToolSuccessAlert message={successMessage} className="mb-4" />
            )}

            {feedbackError && (
              <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-700">
                <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
                <span>{feedbackError}</span>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleEnhanceAndCrop}
                disabled={isProcessing}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 hover:bg-rose-500 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-rose-600/20 disabled:opacity-40 transition-all"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-white" />
                    <span>Warping Document...</span>
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4 text-white" />
                    <span>Next: Enhance & Crop</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* STAGE 3: RESULT & FILTER */}
        {currentStep === "result" && activePage && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900 p-4">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-200">
                <SlidersHorizontal className="h-4 w-4 text-rose-600" />
                <span>Document Filter:</span>
              </div>

              <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 w-full sm:w-auto">
                {(
                  [
                    { id: "original", label: "Original" },
                    { id: "magic", label: "Magic Color", icon: Wand2 },
                    { id: "bw", label: "B&W Clean" },
                    { id: "grayscale", label: "Grayscale" },
                  ] as const
                ).map((f) => {
                  const isSelected = activePage.filter === f.id;
                  const Icon = "icon" in f ? f.icon : null;

                  return (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => handleFilterChange(f.id)}
                      disabled={isFiltering}
                      aria-pressed={isSelected}
                      className={`inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all disabled:cursor-wait ${
                        isSelected
                          ? "border border-rose-600 bg-rose-600 text-white shadow-xs"
                          : "border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 text-slate-600 dark:text-slate-300 hover:border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      {Icon && (
                        <Icon
                          className={`h-3 w-3 ${isSelected ? "text-white" : "text-rose-600"}`}
                        />
                      )}
                      <span>{f.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {activePage.filter === "bw" && (
              <div className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center sm:gap-4">
                <label htmlFor="bw-strength" className="text-xs font-semibold text-slate-700 dark:text-slate-200 shrink-0">
                  B&amp;W strength
                </label>
                <div className="flex flex-1 items-center gap-3">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">Lighter</span>
                  <input
                    id="bw-strength"
                    type="range"
                    min={-40}
                    max={40}
                    step={5}
                    value={bwSlider}
                    onChange={(e) => setBwDraft({ pageId: activePage.id, value: Number(e.target.value) })}
                    className="flex-1 accent-rose-600"
                  />
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">Darker</span>
                </div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 sm:max-w-[220px]">
                  Darker keeps faint pencil and light print; lighter removes more background marks.
                </span>
              </div>
            )}

            <div className="relative flex justify-center rounded-2xl border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-950 p-4 overflow-hidden">
              {isFiltering && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/50 dark:bg-slate-950/50">
                  <Loader2 className="h-6 w-6 animate-spin text-rose-600" />
                </div>
              )}
              <div className="relative inline-block max-h-[62vh] overflow-hidden rounded-lg shadow-xl border border-slate-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={activePage.thumbnailDataUrl}
                  alt={`Scanned Page ${activePageIndex + 1}`}
                  className="max-h-[62vh] w-auto max-w-full object-contain bg-white"
                />
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50/80 dark:border-slate-800 dark:bg-slate-900 p-4 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
                <span className="font-semibold">Batch Pages ({scannedPages.length})</span>
                <span className="font-mono text-slate-500">
                  Page {activePageIndex + 1} of {scannedPages.length}
                </span>
              </div>

              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {scannedPages.map((page, idx) => (
                  <div
                    key={page.id}
                    onClick={() => setActivePageIndex(idx)}
                    role="button"
                    tabIndex={0}
                    className={`group relative flex-shrink-0 cursor-pointer rounded-lg border p-1 transition-all ${
                      idx === activePageIndex
                        ? "border-rose-600 ring-2 ring-rose-500/20 bg-white dark:bg-slate-950 shadow-xs"
                        : "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 hover:border-slate-300"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={page.thumbnailDataUrl}
                      alt={`Page ${idx + 1}`}
                      className="h-20 w-16 rounded object-cover"
                    />

                    <span className="absolute bottom-1.5 left-1.5 rounded bg-slate-900/90 px-1 py-0.2 font-mono text-[9px] text-white">
                      P.{idx + 1}
                    </span>

                    {scannedPages.length > 1 && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeletePage(idx);
                        }}
                        title="Delete page"
                        className="absolute -top-1.5 -right-1.5 rounded-full border border-slate-200 bg-white p-1 text-slate-400 opacity-0 group-hover:opacity-100 hover:text-red-600 transition-opacity shadow-xs"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                ))}

                <button
                  type="button"
                  onClick={handleScanAnotherPage}
                  className="flex h-[88px] w-16 flex-shrink-0 flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-950 text-slate-500 hover:border-rose-500 hover:text-rose-600 transition-all shadow-2xs"
                >
                  <Plus className="h-4 w-4" />
                  <span className="text-[10px] font-semibold">Add Page</span>
                </button>
              </div>
            </div>

            {feedbackError && (
              <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-700">
                <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
                <span>{feedbackError}</span>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleBackToAdjustCorners}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 transition-colors shadow-2xs"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Adjust Corners</span>
                </button>

                <button
                  type="button"
                  onClick={handleScanAnotherPage}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 transition-colors shadow-2xs"
                >
                  <Plus className="h-3.5 w-3.5 text-rose-600" />
                  <span>Scan Another Page</span>
                </button>
              </div>

              <button
                type="button"
                onClick={handleDownloadPDF}
                disabled={isExporting || isFiltering}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 hover:bg-rose-500 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-rose-600/20 disabled:opacity-40 transition-all"
              >
                {isExporting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-white" />
                    <span>Compiling Standard A4 PDF...</span>
                  </>
                ) : (
                  <>
                    <FileDown className="h-4 w-4 text-white" />
                    <span>Download as PDF ({scannedPages.length} Pages)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* CAMERA MODAL FEED */}
        {isCameraOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xs">
            <div className="relative flex h-full max-h-[85vh] w-full max-w-2xl flex-col items-center justify-between rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 p-4 sm:p-6 overflow-hidden shadow-2xl">
              <div className="flex w-full items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                  <Camera className="h-4 w-4 text-rose-600" />
                  <span>Document Camera</span>
                </div>
                <button
                  type="button"
                  onClick={closeCamera}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="relative my-4 flex h-full w-full items-center justify-center overflow-hidden rounded-xl bg-black">
                {cameraError ? (
                  <div className="flex flex-col items-center gap-2 p-6 text-center text-xs text-red-400">
                    <AlertCircle className="h-6 w-6" />
                    <span>{cameraError}</span>
                  </div>
                ) : (
                  <>
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="h-full w-full object-cover rounded-xl"
                    />
                    <div className="pointer-events-none absolute inset-6 sm:inset-10 rounded-xl border border-white/30 shadow-[0_0_0_9999px_rgba(0,0,0,0.3)]" />
                  </>
                )}
              </div>

              {!cameraError && (
                <div className="flex w-full items-center justify-center pt-2">
                  <button
                    type="button"
                    onClick={capturePhoto}
                    className="group flex h-16 w-16 items-center justify-center rounded-full border-4 border-slate-300 bg-slate-100 p-1 hover:border-rose-600 hover:scale-105 active:scale-95 transition-all"
                  >
                    <div className="h-12 w-12 rounded-full bg-rose-600 transition-colors" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
