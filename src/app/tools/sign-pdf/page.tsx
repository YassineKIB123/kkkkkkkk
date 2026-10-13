"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { FileDropzone } from "@/components/tools/FileDropzone";
import { embedSignatureIntoPDF, downloadBlob } from "@/lib/pdf/pdf-utils";
import {
  PenTool,
  Type,
  RotateCcw,
  Undo2,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Download,
  AlertCircle,
  CheckCircle2,
  FileText,
  Move,
  Trash2,
} from "lucide-react";

declare global {
  interface Window {
    pdfjsLib?: any;
  }
}

interface SignaturePosition {
  xPercent: number;
  yPercent: number;
  widthPercent: number;
  heightPercent: number;
}

export default function SignPdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pdfDocProxy, setPdfDocProxy] = useState<any>(null);

  // Signature Overlay States
  const [signatureDataUrl, setSignatureDataUrl] = useState<string | null>(null);
  const [signaturePage, setSignaturePage] = useState<number>(1);
  const [sigPosition, setSigPosition] = useState<SignaturePosition>({
    xPercent: 35,
    yPercent: 75,
    widthPercent: 28,
    heightPercent: 10,
  });

  // Modal & Tab States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"draw" | "type">("draw");
  const [inkColor, setInkColor] = useState<string>("#09090b");
  const [typedName, setTypedName] = useState<string>("");

  // Processing States
  const [isRenderingPage, setIsRenderingPage] = useState(false);
  const [isSigning, setIsSigning] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Drag & Resize tracking
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const dragStartRef = useRef<{ clientX: number; clientY: number; initialPos: SignaturePosition }>({
    clientX: 0,
    clientY: 0,
    initialPos: sigPosition,
  });

  // DOM Refs
  const pageContainerRef = useRef<HTMLDivElement>(null);
  const pdfCanvasRef = useRef<HTMLCanvasElement>(null);
  const drawCanvasRef = useRef<HTMLCanvasElement>(null);
  const drawHistoryRef = useRef<ImageData[]>([]);
  const isDrawingRef = useRef(false);

  // Dynamically load PDF.js client-side without worker packaging issues
  useEffect(() => {
    if (!window.pdfjsLib) {
      const script = document.createElement("script");
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
      script.async = true;
      script.onload = () => {
        if (window.pdfjsLib) {
          window.pdfjsLib.GlobalWorkerOptions.workerSrc =
            "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
        }
      };
      document.body.appendChild(script);
    }
  }, []);

  // Ingest PDF file
  const handleFileSelected = async (files: File[]) => {
    const selected = files[0];
    if (!selected) return;

    setErrorMessage(null);
    setSuccessMessage(null);
    setFile(selected);
    setCurrentPage(1);

    try {
      const buffer = await selected.arrayBuffer();
      // Wait for PDF.js to be ready if loading
      if (!window.pdfjsLib) {
        await new Promise((resolve) => setTimeout(resolve, 600));
      }

      if (!window.pdfjsLib) {
        throw new Error("PDF rendering engine is initializing. Please try again in a moment.");
      }

      const pdf = await window.pdfjsLib.getDocument({ data: buffer }).promise;
      setPdfDocProxy(pdf);
      setTotalPages(pdf.numPages);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load PDF document.";
      setErrorMessage(msg);
      setFile(null);
    }
  };

  // Render current page to canvas
  const renderPage = useCallback(
    async (pageNum: number) => {
      if (!pdfDocProxy || !pdfCanvasRef.current) return;

      setIsRenderingPage(true);
      try {
        const page = await pdfDocProxy.getPage(pageNum);
        const canvas = pdfCanvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Render at high resolution (1.6x) for crisp display
        const viewport = page.getViewport({ scale: 1.6 });
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({ canvasContext: ctx, viewport }).promise;
      } catch (err: unknown) {
        console.error("Error rendering PDF page:", err);
      } finally {
        setIsRenderingPage(false);
      }
    },
    [pdfDocProxy]
  );

  useEffect(() => {
    if (pdfDocProxy) {
      renderPage(currentPage);
    }
  }, [pdfDocProxy, currentPage, renderPage]);

  // Page Switchers
  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const goToPrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  // ==========================================
  // SIGNATURE MODAL & DRAWING LOGIC
  // ==========================================
  const initDrawCanvas = () => {
    const canvas = drawCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawHistoryRef.current = [];
  };

  useEffect(() => {
    if (isModalOpen && activeTab === "draw") {
      setTimeout(initDrawCanvas, 50);
    }
  }, [isModalOpen, activeTab]);

  const saveCanvasHistory = () => {
    const canvas = drawCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    drawHistoryRef.current.push(imgData);
  };

  const startDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = drawCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    saveCanvasHistory();
    isDrawingRef.current = true;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = inkColor;
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  };

  const drawMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    const canvas = drawCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    isDrawingRef.current = false;
  };

  const undoDraw = () => {
    const canvas = drawCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prev = drawHistoryRef.current.pop();
    if (prev) {
      ctx.putImageData(prev, 0, 0);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const clearDraw = () => {
    const canvas = drawCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawHistoryRef.current = [];
  };

  // Convert Typed Name to transparent PNG
  const generateTypedSignaturePng = (name: string, color: string): string => {
    const canvas = document.createElement("canvas");
    canvas.width = 600;
    canvas.height = 200;
    const ctx = canvas.getContext("2d");
    if (!ctx) return "";

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = color;
    // Uses web calligraphic cursive fonts
    ctx.font = "italic 64px 'Dancing Script', 'Caveat', 'Brush Script MT', cursive";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(name, canvas.width / 2, canvas.height / 2);

    return canvas.toDataURL("image/png");
  };

  const applySignature = () => {
    if (activeTab === "draw") {
      const canvas = drawCanvasRef.current;
      if (!canvas) return;
      const dataUrl = canvas.toDataURL("image/png");
      setSignatureDataUrl(dataUrl);
    } else {
      if (!typedName.trim()) return;
      const dataUrl = generateTypedSignaturePng(typedName.trim(), inkColor);
      setSignatureDataUrl(dataUrl);
    }

    setSignaturePage(currentPage);
    setIsModalOpen(false);
  };

  // ==========================================
  // DRAG & RESIZE SIGNATURE OVERLAY
  // ==========================================
  const handlePointerDownDrag = (e: React.PointerEvent) => {
    e.stopPropagation();
    setIsDragging(true);
    dragStartRef.current = {
      clientX: e.clientX,
      clientY: e.clientY,
      initialPos: { ...sigPosition },
    };
  };

  const handlePointerDownResize = (e: React.PointerEvent) => {
    e.stopPropagation();
    setIsResizing(true);
    dragStartRef.current = {
      clientX: e.clientX,
      clientY: e.clientY,
      initialPos: { ...sigPosition },
    };
  };

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (!pageContainerRef.current) return;
      const rect = pageContainerRef.current.getBoundingClientRect();
      const deltaX = ((e.clientX - dragStartRef.current.clientX) / rect.width) * 100;
      const deltaY = ((e.clientY - dragStartRef.current.clientY) / rect.height) * 100;

      if (isDragging) {
        const { initialPos } = dragStartRef.current;
        const newX = Math.max(0, Math.min(100 - initialPos.widthPercent, initialPos.xPercent + deltaX));
        const newY = Math.max(0, Math.min(100 - initialPos.heightPercent, initialPos.yPercent + deltaY));

        setSigPosition((prev) => ({
          ...prev,
          xPercent: Math.round(newX * 10) / 10,
          yPercent: Math.round(newY * 10) / 10,
        }));
      } else if (isResizing) {
        const { initialPos } = dragStartRef.current;
        const newW = Math.max(8, Math.min(100 - initialPos.xPercent, initialPos.widthPercent + deltaX));
        const newH = Math.max(4, Math.min(100 - initialPos.yPercent, initialPos.heightPercent + deltaY));

        setSigPosition((prev) => ({
          ...prev,
          widthPercent: Math.round(newW * 10) / 10,
          heightPercent: Math.round(newH * 10) / 10,
        }));
      }
    };

    const handlePointerUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      window.addEventListener("pointermove", handlePointerMove);
      window.addEventListener("pointerup", handlePointerUp);
    }

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [isDragging, isResizing, sigPosition]);

  // Sign & Download execution
  const handleSignDocument = async () => {
    if (!file || !signatureDataUrl) return;

    setIsSigning(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const signedBytes = await embedSignatureIntoPDF(
        file,
        signaturePage,
        signatureDataUrl,
        sigPosition
      );

      const fileName = `signed_${file.name.replace(/\.pdf$/i, "")}_${Date.now()}.pdf`;
      downloadBlob(signedBytes, fileName);
      setSuccessMessage(`Success! Downloaded "${fileName}" signed on Page ${signaturePage}.`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to sign PDF.";
      setErrorMessage(msg);
    } finally {
      setIsSigning(false);
    }
  };

  return (
    <ToolLayout
      title="Sign PDF Document"
      description="Draw or type your signature and place it anywhere on your PDF. 100% private and compiled locally in your browser."
    >
      {/* Google cursive fonts for realistic typed signatures */}
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Caveat:wght@600&family=Dancing+Script:wght@600&display=swap");
      `}</style>

      <div className="space-y-6">
        {/* Upload Dropzone */}
        {!file && (
          <FileDropzone
            accept="application/pdf,.pdf"
            multiple={false}
            onFilesSelected={handleFileSelected}
            title="Drop a PDF document to sign"
            description="Select a contract, agreement, or form. Files never leave your browser."
          />
        )}

        {/* Active PDF Signing Workspace */}
        {file && (
          <div className="space-y-5 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 sm:p-6 backdrop-blur-sm">
            {/* Top Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-950 text-emerald-400">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-white truncate max-w-[220px] sm:max-w-xs">
                    {file.name}
                  </h2>
                  <p className="font-mono text-xs text-zinc-400">
                    Page {currentPage} of {totalPages}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 px-4 py-2 text-xs font-semibold text-zinc-950 shadow-md shadow-emerald-500/10 transition-all"
                >
                  <PenTool className="h-4 w-4" />
                  <span>{signatureDataUrl ? "Edit Signature" : "Add Signature"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setFile(null);
                    setSignatureDataUrl(null);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs font-medium text-zinc-400 hover:text-white transition-colors"
                >
                  <X className="h-4 w-4" />
                  <span>Close</span>
                </button>
              </div>
            </div>

            {/* Page Navigation Bar */}
            <div className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-950/70 px-4 py-2.5 text-xs text-zinc-400">
              <span>
                {signatureDataUrl && signaturePage === currentPage ? (
                  <span className="text-emerald-400 font-medium">
                    Signature active on this page. Drag to reposition.
                  </span>
                ) : signatureDataUrl ? (
                  <span>
                    Signature is placed on <span className="text-white font-medium">Page {signaturePage}</span>
                  </span>
                ) : (
                  <span>Click &quot;Add Signature&quot; to sign this document</span>
                )}
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={goToPrevPage}
                  disabled={currentPage <= 1 || isRenderingPage}
                  className="rounded-lg border border-zinc-800 p-1.5 text-zinc-400 hover:text-white disabled:opacity-30 transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="font-mono text-white">
                  {currentPage} / {totalPages}
                </span>
                <button
                  type="button"
                  onClick={goToNextPage}
                  disabled={currentPage >= totalPages || isRenderingPage}
                  className="rounded-lg border border-zinc-800 p-1.5 text-zinc-400 hover:text-white disabled:opacity-30 transition-colors"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* DOCUMENT CANVAS & SIGNATURE OVERLAY VIEWPORT */}
            <div className="relative flex justify-center overflow-x-auto rounded-2xl border border-zinc-800 bg-zinc-950 p-4 min-h-[500px]">
              {isRenderingPage && (
                <div className="absolute inset-0 z-20 flex items-center justify-center bg-zinc-950/50 backdrop-blur-xs">
                  <Loader2 className="h-6 w-6 animate-spin text-emerald-400" />
                </div>
              )}

              <div
                ref={pageContainerRef}
                className="relative inline-block select-none shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
              >
                {/* Rendered PDF Page */}
                <canvas
                  ref={pdfCanvasRef}
                  className="block h-auto max-w-full rounded-sm bg-white"
                />

                {/* Draggable & Resizable Signature Overlay */}
                {signatureDataUrl && signaturePage === currentPage && (
                  <div
                    onPointerDown={handlePointerDownDrag}
                    style={{
                      left: `${sigPosition.xPercent}%`,
                      top: `${sigPosition.yPercent}%`,
                      width: `${sigPosition.widthPercent}%`,
                      height: `${sigPosition.heightPercent}%`,
                      touchAction: "none",
                    }}
                    className={`group absolute cursor-move rounded border-2 p-1 transition-shadow ${
                      isDragging || isResizing
                        ? "border-emerald-400 bg-emerald-500/15 shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                        : "border-dashed border-emerald-500/80 bg-emerald-500/5 hover:border-emerald-400 hover:bg-emerald-500/10"
                    }`}
                  >
                    {/* Rendered Signature Graphic */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={signatureDataUrl}
                      alt="Signature Overlay"
                      className="pointer-events-none h-full w-full object-contain"
                    />

                    {/* Move Handle Pill */}
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex items-center gap-1 rounded bg-zinc-950/90 px-1.5 py-0.5 font-mono text-[9px] text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Move className="h-2.5 w-2.5 text-emerald-400" />
                      <span>Drag to move</span>
                    </div>

                    {/* Delete signature button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSignatureDataUrl(null);
                      }}
                      className="absolute -top-3 -right-3 rounded-full border border-zinc-700 bg-zinc-950 p-1 text-zinc-400 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Remove signature"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>

                    {/* Bottom-Right Resize Handle */}
                    <div
                      onPointerDown={handlePointerDownResize}
                      className="absolute -bottom-2 -right-2 h-4 w-4 cursor-se-resize rounded-full border-2 border-emerald-400 bg-zinc-950 shadow hover:scale-125 transition-transform"
                    />
                  </div>
                )}
              </div>
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

            {/* Bottom Final Action Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <span className="text-xs text-zinc-500">
                {signatureDataUrl
                  ? `Signature applied to Page ${signaturePage}. Ready to compile.`
                  : "Add your signature to enable document export."}
              </span>

              <button
                type="button"
                onClick={handleSignDocument}
                disabled={!signatureDataUrl || isSigning}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 px-6 py-2.5 text-sm font-semibold text-zinc-950 shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-40 transition-all"
              >
                {isSigning ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-zinc-950" />
                    <span>Signing PDF Document...</span>
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 text-zinc-950" />
                    <span>Sign & Download PDF</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ========================================================
            SIGNATURE CREATOR MODAL
        ======================================================== */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
            <div className="relative w-full max-w-lg rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl space-y-5">
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <h3 className="text-base font-semibold text-white flex items-center gap-2">
                  <PenTool className="h-4 w-4 text-emerald-400" />
                  <span>Create Signature</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-900 hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Tab Selector & Color Picker */}
              <div className="flex items-center justify-between">
                <div className="flex items-center rounded-lg border border-zinc-800 bg-zinc-900/60 p-1 text-xs font-medium">
                  <button
                    type="button"
                    onClick={() => setActiveTab("draw")}
                    className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 transition-colors ${
                      activeTab === "draw"
                        ? "bg-zinc-800 text-white"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    <PenTool className="h-3.5 w-3.5" />
                    <span>Draw</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("type")}
                    className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 transition-colors ${
                      activeTab === "type"
                        ? "bg-zinc-800 text-white"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    <Type className="h-3.5 w-3.5" />
                    <span>Type</span>
                  </button>
                </div>

                {/* Ink Color Picker */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-zinc-500">Color:</span>
                  <button
                    type="button"
                    onClick={() => setInkColor("#09090b")}
                    className={`h-6 w-6 rounded-full border-2 bg-zinc-950 transition-all ${
                      inkColor === "#09090b" ? "border-emerald-400 scale-110" : "border-zinc-700"
                    }`}
                    title="Black Ink"
                  />
                  <button
                    type="button"
                    onClick={() => setInkColor("#1d4ed8")}
                    className={`h-6 w-6 rounded-full border-2 bg-blue-600 transition-all ${
                      inkColor === "#1d4ed8" ? "border-emerald-400 scale-110" : "border-zinc-700"
                    }`}
                    title="Blue Ink"
                  />
                </div>
              </div>

              {/* TAB 1: DRAW CANVAS */}
              {activeTab === "draw" && (
                <div className="space-y-3">
                  <div className="relative rounded-xl border border-zinc-800 bg-white shadow-inner overflow-hidden">
                    <canvas
                      ref={drawCanvasRef}
                      width={500}
                      height={180}
                      onPointerDown={startDrawing}
                      onPointerMove={drawMove}
                      onPointerUp={stopDrawing}
                      onPointerLeave={stopDrawing}
                      className="touch-none w-full h-[180px] cursor-crosshair"
                    />
                    <div className="pointer-events-none absolute bottom-5 left-8 right-8 border-b border-dashed border-zinc-300" />
                  </div>

                  <div className="flex items-center justify-between text-xs text-zinc-500">
                    <span>Draw your signature above the line</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={undoDraw}
                        className="inline-flex items-center gap-1 rounded-lg border border-zinc-800 bg-zinc-900 px-2.5 py-1 text-zinc-400 hover:text-white"
                      >
                        <Undo2 className="h-3.5 w-3.5" />
                        <span>Undo</span>
                      </button>
                      <button
                        type="button"
                        onClick={clearDraw}
                        className="inline-flex items-center gap-1 rounded-lg border border-zinc-800 bg-zinc-900 px-2.5 py-1 text-zinc-400 hover:text-white"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                        <span>Clear</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: TYPE SIGNATURE */}
              {activeTab === "type" && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-zinc-400 block mb-1">
                      Type your full name or initials:
                    </label>
                    <input
                      type="text"
                      value={typedName}
                      onChange={(e) => setTypedName(e.target.value)}
                      placeholder="e.g. John Doe"
                      className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  {/* Live Cursive Script Preview */}
                  <div className="relative flex h-[140px] items-center justify-center rounded-xl border border-zinc-800 bg-white p-4 shadow-inner">
                    <div className="pointer-events-none absolute bottom-5 left-8 right-8 border-b border-dashed border-zinc-300" />
                    <span
                      style={{
                        color: inkColor,
                        fontFamily: "'Dancing Script', 'Caveat', 'Brush Script MT', cursive",
                      }}
                      className="text-4xl sm:text-5xl italic tracking-wide"
                    >
                      {typedName || "Your Signature"}
                    </span>
                  </div>
                </div>
              )}

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2 text-xs font-medium text-zinc-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={applySignature}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 px-5 py-2 text-xs font-semibold text-zinc-950 transition-all shadow-md shadow-emerald-500/10"
                >
                  <Check className="h-4 w-4" />
                  <span>Apply Signature</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}