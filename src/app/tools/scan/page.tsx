"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { ToolLayout } from "@/components/tools/ToolLayout";
import {
  warpPerspective,
  processCanvasWithFilter,
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
} from "lucide-react";

export interface CornerPoint {
  x: number; // Normalized coordinate: 0.0 to 1.0
  y: number; // Normalized coordinate: 0.0 to 1.0
}

interface ScannedPageItem {
  id: string;
  sourceImageSrc: string;
  corners: CornerPoint[];
  warpedCanvas: HTMLCanvasElement;
  filteredCanvas: HTMLCanvasElement;
  filter: FilterType;
  thumbnailDataUrl: string;
}

const DEFAULT_CORNERS: CornerPoint[] = [
  { x: 0.1, y: 0.1 },
  { x: 0.9, y: 0.1 },
  { x: 0.9, y: 0.9 },
  { x: 0.1, y: 0.9 },
];

const CORNER_LABELS = ["Top-Left", "Top-Right", "Bottom-Right", "Bottom-Left"];

export default function CamScannerPage() {
  // Screen Stage: 'input' -> 'crop' -> 'result'
  const [currentStep, setCurrentStep] = useState<"input" | "crop" | "result">("input");

  // Ingestion & Cropping
  const [currentImageSrc, setCurrentImageSrc] = useState<string | null>(null);
  const [corners, setCorners] = useState<CornerPoint[]>(DEFAULT_CORNERS);
  const [activeCornerIdx, setActiveCornerIdx] = useState<number | null>(null);

  // Camera States
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Multi-Page Batch Document State
  const [scannedPages, setScannedPages] = useState<ScannedPageItem[]>([]);
  const [activePageIndex, setActivePageIndex] = useState<number>(0);

  // Processing Loaders & Errors
  const [isProcessing, setIsProcessing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [feedbackError, setFeedbackError] = useState<string | null>(null);

  // Container Dimensions for SVG Sync
  const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const previewCanvasContainerRef = useRef<HTMLDivElement>(null);

  // Camera Cleanup
  const stopCameraStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => stopCameraStream();
  }, [stopCameraStream]);

  // Open Camera
  const openCamera = async () => {
    setCameraError(null);
    setIsCameraOpen(true);

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
      streamRef.current = mediaStream;

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play();
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Unable to access device camera. Please check camera permissions.";
      setCameraError(message);
    }
  };

  const closeCamera = () => {
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
        setCurrentImageSrc(event.target.result);
        setCorners(DEFAULT_CORNERS);
        setCurrentStep("crop");
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  // Resize listener for SVG coordinate matching
  const updateContainerSize = useCallback(() => {
    if (editorContainerRef.current) {
      const rect = editorContainerRef.current.getBoundingClientRect();
      setContainerDimensions({ width: rect.width, height: rect.height });
    }
  }, []);

  useEffect(() => {
    window.addEventListener("resize", updateContainerSize);
    return () => window.removeEventListener("resize", updateContainerSize);
  }, [updateContainerSize]);

  // Pointer dragging logic for 4 corners
  const handlePointerMove = useCallback(
    (e: PointerEvent) => {
      if (activeCornerIdx === null || !editorContainerRef.current) return;

      const rect = editorContainerRef.current.getBoundingClientRect();
      const normX = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const normY = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));

      setCorners((prev) => {
        const next = [...prev];
        next[activeCornerIdx] = { x: normX, y: normY };
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
    }
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [activeCornerIdx, handlePointerMove, handlePointerUp]);

  const getPixelCoord = (corner: CornerPoint) => ({
    x: corner.x * containerDimensions.width,
    y: corner.y * containerDimensions.height,
  });

  // STEP TRANSITION: Warp Perspective and apply default "Magic Color"
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

      // 1. Run perspective transformation
      const warpedCanvas = await warpPerspective(img, absoluteCorners);

      // 2. Default to "Magic Color"
      const defaultFilter: FilterType = "magic";
      const filteredCanvas = processCanvasWithFilter(warpedCanvas, defaultFilter);
      const thumb = filteredCanvas.toDataURL("image/jpeg", 0.6);

      const newPageItem: ScannedPageItem = {
        id: `page_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        sourceImageSrc: currentImageSrc,
        corners: [...corners],
        warpedCanvas,
        filteredCanvas,
        filter: defaultFilter,
        thumbnailDataUrl: thumb,
      };

      setScannedPages((prev) => {
        // If re-cropping existing active page, replace it
        if (currentStep === "crop" && prev[activePageIndex]?.sourceImageSrc === currentImageSrc) {
          const next = [...prev];
          next[activePageIndex] = newPageItem;
          return next;
        }
        const updated = [...prev, newPageItem];
        setActivePageIndex(updated.length - 1);
        return updated;
      });

      setCurrentStep("result");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to process document crop.";
      setFeedbackError(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  // Change Filter on active page
  const handleFilterChange = (filter: FilterType) => {
    if (scannedPages.length === 0) return;

    setScannedPages((prev) => {
      const next = [...prev];
      const page = next[activePageIndex];
      if (!page) return prev;

      const newFiltered = processCanvasWithFilter(page.warpedCanvas, filter);
      const thumb = newFiltered.toDataURL("image/jpeg", 0.6);

      next[activePageIndex] = {
        ...page,
        filter,
        filteredCanvas: newFiltered,
        thumbnailDataUrl: thumb,
      };
      return next;
    });
  };

  // Return to crop screen with original corners intact
  const handleBackToAdjustCorners = () => {
    const page = scannedPages[activePageIndex];
    if (page) {
      setCurrentImageSrc(page.sourceImageSrc);
      setCorners(page.corners);
    }
    setCurrentStep("crop");
  };

  // Initiate scan of another page for batch
  const handleScanAnotherPage = () => {
    setCurrentImageSrc(null);
    setCorners(DEFAULT_CORNERS);
    setCurrentStep("input");
  };

  // Delete page from batch
  const handleDeletePage = (index: number) => {
    if (scannedPages.length <= 1) {
      // Reset back to input if last page deleted
      setScannedPages([]);
      setCurrentStep("input");
      setCurrentImageSrc(null);
      return;
    }

    setScannedPages((prev) => prev.filter((_, idx) => idx !== index));
    setActivePageIndex((prev) => Math.max(0, index <= prev ? prev - 1 : prev));
  };

  // Download all batch pages as PDF
  const handleDownloadPDF = async () => {
    if (scannedPages.length === 0) return;

    setIsExporting(true);
    setFeedbackError(null);

    try {
      const canvasesToEmbed = scannedPages.map((p) => p.filteredCanvas);
      const pdfBytes = await canvasesToPDF(canvasesToEmbed);
      const filename = `docforge_scan_${Date.now()}.pdf`;
      downloadBlob(pdfBytes, filename);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to assemble PDF document.";
      setFeedbackError(msg);
    } finally {
      setIsExporting(false);
    }
  };

  const activePage = scannedPages[activePageIndex];

  return (
    <ToolLayout
      title="Mobile / Web CamScanner"
      description="Scan documents with automatic rear camera selection, perspective correction, and document threshold filters."
    >
      <div className="space-y-6">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileUpload}
        />

        {/* ========================================================
            STAGE 1: INPUT INTAKE
        ======================================================== */}
        {currentStep === "input" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={openCamera}
                className="group flex flex-col items-center justify-center gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-10 hover:border-emerald-500/50 hover:bg-zinc-900/80 transition-all"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-950 text-zinc-300 group-hover:border-emerald-500/50 group-hover:text-emerald-400 group-hover:scale-105 transition-all">
                  <Camera className="h-8 w-8" />
                </div>
                <div className="text-center">
                  <h3 className="text-base font-semibold text-white">Take Photo</h3>
                  <p className="mt-1 text-xs text-zinc-400">
                    Use your device camera with automatic rear-lens selection
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="group flex flex-col items-center justify-center gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-10 hover:border-emerald-500/50 hover:bg-zinc-900/80 transition-all"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-950 text-zinc-300 group-hover:border-emerald-500/50 group-hover:text-emerald-400 group-hover:scale-105 transition-all">
                  <ImageIcon className="h-8 w-8" />
                </div>
                <div className="text-center">
                  <h3 className="text-base font-semibold text-white">Upload Image</h3>
                  <p className="mt-1 text-xs text-zinc-400">
                    Select a JPG or PNG receipt, invoice, or document photo
                  </p>
                </div>
              </button>
            </div>

            {scannedPages.length > 0 && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setCurrentStep("result")}
                  className="inline-flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2 text-xs font-medium text-zinc-300 hover:text-white"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Return to Scanned Batch ({scannedPages.length} Pages)</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            STAGE 2: 4-CORNER BOUNDARY ADJUSTMENT
        ======================================================== */}
        {currentStep === "crop" && currentImageSrc && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-3">
              <div className="flex items-center gap-2 text-xs text-zinc-400">
                <Move className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Drag the 4 corner handles to define the document boundary</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCorners(DEFAULT_CORNERS)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:border-zinc-700 hover:text-white transition-all"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span>Reset Corners</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentStep("input")}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs font-medium text-zinc-400 hover:border-zinc-700 hover:text-white transition-all"
                >
                  <X className="h-3.5 w-3.5" />
                  <span>Cancel</span>
                </button>
              </div>
            </div>

            <div className="relative flex justify-center rounded-2xl border border-zinc-800 bg-zinc-950 p-2 sm:p-4 overflow-hidden select-none">
              <div
                ref={editorContainerRef}
                className="relative inline-block max-w-full touch-none"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  ref={imageRef}
                  src={currentImageSrc}
                  alt="Scan Subject"
                  onLoad={updateContainerSize}
                  className="max-h-[65vh] w-auto max-w-full rounded-lg object-contain shadow-2xl pointer-events-none"
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
                      fill="rgba(16, 185, 129, 0.18)"
                      stroke="#10b981"
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
                        className="absolute -translate-x-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing p-4 z-20"
                      >
                        <div
                          className={`flex h-7 w-7 items-center justify-center rounded-full border-2 transition-transform ${
                            isActive
                              ? "border-white bg-emerald-500 scale-125 shadow-[0_0_15px_rgba(16,185,129,0.8)]"
                              : "border-emerald-400 bg-zinc-950/90 shadow-md hover:scale-110"
                          }`}
                        >
                          <div className="h-2 w-2 rounded-full bg-white" />
                        </div>

                        <span className="pointer-events-none absolute left-8 top-1/2 -translate-y-1/2 whitespace-nowrap rounded bg-zinc-950/80 px-1.5 py-0.5 text-[9px] font-mono text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity">
                          {CORNER_LABELS[idx]}
                        </span>
                      </div>
                    );
                  })}

                
              </div>
            </div>

            {feedbackError && (
              <div className="flex items-center gap-2 rounded-xl border border-red-900/60 bg-red-950/40 p-3.5 text-xs text-red-300">
                <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
                <span>{feedbackError}</span>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleEnhanceAndCrop}
                disabled={isProcessing}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 px-6 py-2.5 text-sm font-semibold text-zinc-950 shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 disabled:opacity-40 transition-all"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-zinc-950" />
                    <span>Warping Document...</span>
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4 text-zinc-950" />
                    <span>Next: Enhance & Crop</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ========================================================
            STAGE 3: SCAN RESULT, FILTERS & MULTI-PAGE BATCH
        ======================================================== */}
        {currentStep === "result" && activePage && (
          <div className="space-y-6">
            {/* Top Filter Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
              <div className="flex items-center gap-2 text-xs font-medium text-zinc-300">
                <SlidersHorizontal className="h-4 w-4 text-emerald-400" />
                <span>Enhancement Filter:</span>
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
                      className={`inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                        isSelected
                          ? "border border-emerald-500/70 bg-emerald-950/60 text-emerald-300 shadow-[0_0_12px_-2px_rgba(16,185,129,0.3)]"
                          : "border border-zinc-800 bg-zinc-950/60 text-zinc-400 hover:border-zinc-700 hover:text-white"
                      }`}
                    >
                      {Icon && <Icon className="h-3 w-3 text-emerald-400" />}
                      <span>{f.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Document Render Viewport */}
            <div
              ref={previewCanvasContainerRef}
              className="relative flex justify-center rounded-2xl border border-zinc-800 bg-zinc-950 p-4 overflow-hidden"
            >
              <div className="relative inline-block max-h-[65vh] overflow-hidden rounded-lg shadow-2xl border border-zinc-800/80">
                {/* Dynamically Mount Filtered Canvas */}
                <img
                  src={activePage.thumbnailDataUrl}
                  alt={`Scanned Page ${activePageIndex + 1}`}
                  className="max-h-[65vh] w-auto max-w-full object-contain"
                />
              </div>
            </div>

            {/* Multi-Page Thumbnail Strip */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-4 space-y-3">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span>
                  Batch Document Pages ({scannedPages.length})
                </span>
                <span className="font-mono text-zinc-500">
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
                        ? "border-emerald-500 bg-emerald-950/30 shadow-md shadow-emerald-950/50"
                        : "border-zinc-800 bg-zinc-900/60 hover:border-zinc-700"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={page.thumbnailDataUrl}
                      alt={`Page ${idx + 1}`}
                      className="h-20 w-16 rounded object-cover"
                    />

                    <span className="absolute bottom-1.5 left-1.5 rounded bg-zinc-950/90 px-1 py-0.2 font-mono text-[9px] text-zinc-300">
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
                        className="absolute -top-1.5 -right-1.5 rounded-full border border-zinc-700 bg-zinc-950 p-1 text-zinc-400 opacity-0 group-hover:opacity-100 hover:text-red-400 transition-opacity"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                ))}

                {/* Quick Add Page Card */}
                <button
                  type="button"
                  onClick={handleScanAnotherPage}
                  className="flex h-[88px] w-16 flex-shrink-0 flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-zinc-800 bg-zinc-900/30 text-zinc-500 hover:border-emerald-500/50 hover:text-emerald-400 transition-all"
                >
                  <Plus className="h-4 w-4" />
                  <span className="text-[10px] font-medium">Add Page</span>
                </button>
              </div>
            </div>

            {feedbackError && (
              <div className="flex items-center gap-2 rounded-xl border border-red-900/60 bg-red-950/40 p-3.5 text-xs text-red-300">
                <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
                <span>{feedbackError}</span>
              </div>
            )}

            {/* Bottom Primary Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleBackToAdjustCorners}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-xs font-medium text-zinc-300 hover:border-zinc-700 hover:text-white transition-all"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Adjust Corners</span>
                </button>

                <button
                  type="button"
                  onClick={handleScanAnotherPage}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-xs font-medium text-zinc-300 hover:border-zinc-700 hover:text-white transition-all"
                >
                  <Plus className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Scan Another Page</span>
                </button>
              </div>

              <button
                type="button"
                onClick={handleDownloadPDF}
                disabled={isExporting}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 px-6 py-2.5 text-sm font-semibold text-zinc-950 shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 disabled:opacity-40 transition-all"
              >
                {isExporting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-zinc-950" />
                    <span>Compiling PDF Document...</span>
                  </>
                ) : (
                  <>
                    <FileDown className="h-4 w-4 text-zinc-950" />
                    <span>Download as PDF ({scannedPages.length} Pages)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ========================================================
            WEBRTC CAMERA MODAL
        ======================================================== */}
        {isCameraOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md">
            <div className="relative flex h-full max-h-[85vh] w-full max-w-2xl flex-col items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-950 p-4 sm:p-6 overflow-hidden">
              <div className="flex w-full items-center justify-between border-b border-zinc-800 pb-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-white">
                  <Camera className="h-4 w-4 text-emerald-400" />
                  <span>Document Camera</span>
                </div>
                <button
                  type="button"
                  onClick={closeCamera}
                  className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
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
                    <div className="pointer-events-none absolute inset-6 sm:inset-10 rounded-xl border border-white/20 shadow-[0_0_0_9999px_rgba(0,0,0,0.3)]" />
                  </>
                )}
              </div>

              {!cameraError && (
                <div className="flex w-full items-center justify-center pt-2">
                  <button
                    type="button"
                    onClick={capturePhoto}
                    className="group flex h-16 w-16 items-center justify-center rounded-full border-4 border-white/30 bg-white/10 p-1 hover:border-emerald-400 hover:scale-105 active:scale-95 transition-all"
                  >
                    <div className="h-12 w-12 rounded-full bg-white group-hover:bg-emerald-400 transition-colors" />
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