"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { FileDropzone } from "@/components/tools/FileDropzone";
import { embedSignaturesIntoPDF, downloadBlob } from "@/lib/pdf/pdf-utils";
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
  Plus,
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

interface PlacedSignature {
  id: string;
  dataUrl: string;
  pageNumber: number;
  position: SignaturePosition;
}

export default function SignPdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pdfDocProxy, setPdfDocProxy] = useState<any>(null);

  // Multiple Signatures Collection
  const [signatures, setSignatures] = useState<PlacedSignature[]>([]);
  const [selectedSigId, setSelectedSigId] = useState<string | null>(null);

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
  const activeDragSigId = useRef<string | null>(null);
  const dragStartRef = useRef<{ clientX: number; clientY: number; initialPos: SignaturePosition }>({
    clientX: 0,
    clientY: 0,
    initialPos: { xPercent: 35, yPercent: 75, widthPercent: 28, heightPercent: 10 },
  });

  // DOM Refs
  const pageContainerRef = useRef<HTMLDivElement>(null);
  const pdfCanvasRef = useRef<HTMLCanvasElement>(null);
  const drawCanvasRef = useRef<HTMLCanvasElement>(null);
  const drawHistoryRef = useRef<ImageData[]>([]);
  const isDrawingRef = useRef(false);
  const pointsRef = useRef<{ x: number; y: number }[]>([]);

  // Load PDF.js from CDN
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

  const handleFileSelected = async (files: File[]) => {
    const selected = files[0];
    if (!selected) return;

    setErrorMessage(null);
    setSuccessMessage(null);
    setFile(selected);
    setCurrentPage(1);
    setSignatures([]);
    setSelectedSigId(null);

    try {
      const buffer = await selected.arrayBuffer();
      if (!window.pdfjsLib) {
        await new Promise((resolve) => setTimeout(resolve, 600));
      }
      if (!window.pdfjsLib) {
        throw new Error("PDF rendering engine is initializing. Please try again.");
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

  const renderPage = useCallback(
    async (pageNum: number) => {
      if (!pdfDocProxy || !pdfCanvasRef.current) return;

      setIsRenderingPage(true);
      try {
        const page = await pdfDocProxy.getPage(pageNum);
        const canvas = pdfCanvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

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

  // ==========================================
  // SILKY-SMOOTH HIGH-DPI DRAWING LOGIC
  // ==========================================
  const initDrawCanvas = () => {
    const canvas = drawCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // High DPI scaling (2x) for razor-sharp lines
    const dpr = 2;
    const rect = canvas.getBoundingClientRect();
    canvas.width = (rect.width || 500) * dpr;
    canvas.height = 190 * dpr;
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawHistoryRef.current = [];
    pointsRef.current = [];
  };

  useEffect(() => {
    if (isModalOpen && activeTab === "draw") {
      setTimeout(initDrawCanvas, 60);
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

    pointsRef.current = [{ x, y }];

    ctx.strokeStyle = inkColor;
    ctx.fillStyle = inkColor;
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    ctx.beginPath();
    ctx.arc(x, y, 1.25, 0, Math.PI * 2);
    ctx.fill();
  };

  // Smooth quadratic bezier curve interpolation
  const drawMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    const canvas = drawCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const points = pointsRef.current;
    points.push({ x, y });

    if (points.length >= 3) {
      const p0 = points[points.length - 3];
      const p1 = points[points.length - 2];
      const p2 = points[points.length - 1];

      const mid1X = (p0.x + p1.x) / 2;
      const mid1Y = (p0.y + p1.y) / 2;
      const mid2X = (p1.x + p2.x) / 2;
      const mid2Y = (p1.y + p2.y) / 2;

      ctx.beginPath();
      ctx.moveTo(mid1X, mid1Y);
      ctx.quadraticCurveTo(p1.x, p1.y, mid2X, mid2Y);
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    isDrawingRef.current = false;
    pointsRef.current = [];
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
    pointsRef.current = [];
  };

  const generateTypedSignaturePng = (name: string, color: string): string => {
    const canvas = document.createElement("canvas");
    canvas.width = 700;
    canvas.height = 220;
    const ctx = canvas.getContext("2d");
    if (!ctx) return "";

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = color;
    ctx.font = "italic 68px 'Dancing Script', 'Caveat', 'Brush Script MT', cursive";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(name, canvas.width / 2, canvas.height / 2);

    return canvas.toDataURL("image/png");
  };

  // Add signature to document (Supports multiple additions)
  const applySignature = () => {
    let dataUrl = "";
    if (activeTab === "draw") {
      const canvas = drawCanvasRef.current;
      if (!canvas) return;
      dataUrl = canvas.toDataURL("image/png");
    } else {
      if (!typedName.trim()) return;
      dataUrl = generateTypedSignaturePng(typedName.trim(), inkColor);
    }

    const newSig: PlacedSignature = {
      id: `sig_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      dataUrl,
      pageNumber: currentPage,
      position: {
        xPercent: 35,
        yPercent: 70,
        widthPercent: 28,
        heightPercent: 10,
      },
    };

    setSignatures((prev) => [...prev, newSig]);
    setSelectedSigId(newSig.id); // Select newly added signature
    setIsModalOpen(false);
  };

  const handleRemoveSignature = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSignatures((prev) => prev.filter((s) => s.id !== id));
    if (selectedSigId === id) setSelectedSigId(null);
  };

  // ==========================================
  // DRAG & RESIZE ACTIVE SIGNATURE
  // ==========================================
  const handlePointerDownDrag = (id: string, e: React.PointerEvent) => {
    e.stopPropagation();
    setSelectedSigId(id);
    activeDragSigId.current = id;
    setIsDragging(true);

    const sig = signatures.find((s) => s.id === id);
    if (!sig) return;

    dragStartRef.current = {
      clientX: e.clientX,
      clientY: e.clientY,
      initialPos: { ...sig.position },
    };
  };

  const handlePointerDownResize = (id: string, e: React.PointerEvent) => {
    e.stopPropagation();
    setSelectedSigId(id);
    activeDragSigId.current = id;
    setIsResizing(true);

    const sig = signatures.find((s) => s.id === id);
    if (!sig) return;

    dragStartRef.current = {
      clientX: e.clientX,
      clientY: e.clientY,
      initialPos: { ...sig.position },
    };
  };

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (!pageContainerRef.current || !activeDragSigId.current) return;
      const rect = pageContainerRef.current.getBoundingClientRect();
      const deltaX = ((e.clientX - dragStartRef.current.clientX) / rect.width) * 100;
      const deltaY = ((e.clientY - dragStartRef.current.clientY) / rect.height) * 100;

      const currentId = activeDragSigId.current;

      setSignatures((prev) =>
        prev.map((sig) => {
          if (sig.id !== currentId) return sig;

          const { initialPos } = dragStartRef.current;

          if (isDragging) {
            const newX = Math.max(0, Math.min(100 - initialPos.widthPercent, initialPos.xPercent + deltaX));
            const newY = Math.max(0, Math.min(100 - initialPos.heightPercent, initialPos.yPercent + deltaY));
            return {
              ...sig,
              position: {
                ...sig.position,
                xPercent: Math.round(newX * 10) / 10,
                yPercent: Math.round(newY * 10) / 10,
              },
            };
          } else if (isResizing) {
            const newW = Math.max(8, Math.min(100 - initialPos.xPercent, initialPos.widthPercent + deltaX));
            const newH = Math.max(3, Math.min(100 - initialPos.yPercent, initialPos.heightPercent + deltaY));
            return {
              ...sig,
              position: {
                ...sig.position,
                widthPercent: Math.round(newW * 10) / 10,
                heightPercent: Math.round(newH * 10) / 10,
              },
            };
          }
          return sig;
        })
      );
    };

    const handlePointerUp = () => {
      setIsDragging(false);
      setIsResizing(false);
      activeDragSigId.current = null;
    };

    if (isDragging || isResizing) {
      window.addEventListener("pointermove", handlePointerMove);
      window.addEventListener("pointerup", handlePointerUp);
    }

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [isDragging, isResizing]);

  const handleSignDocument = async () => {
    if (!file || signatures.length === 0) return;

    setIsSigning(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const signedBytes = await embedSignaturesIntoPDF(
        file,
        signatures.map((s) => ({
          pageNumber: s.pageNumber,
          signatureDataUrl: s.dataUrl,
          position: s.position,
        }))
      );

      const fileName = `signed_${file.name.replace(/\.pdf$/i, "")}_${Date.now()}.pdf`;
      downloadBlob(signedBytes, fileName);
      setSuccessMessage(`Success! Saved and downloaded "${fileName}" with ${signatures.length} signature(s).`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to sign PDF.";
      setErrorMessage(msg);
    } finally {
      setIsSigning(false);
    }
  };

  const currentPageSignatures = signatures.filter((s) => s.pageNumber === currentPage);

  return (
    <ToolLayout
      title="Sign PDF Document"
      description="Draw or type signatures and place them anywhere on your document. Add as many signatures as needed with zero server uploads."
    >
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Caveat:wght@600&family=Dancing+Script:wght@600&display=swap");
      `}</style>

      <div className="space-y-6">
        {!file && (
          <FileDropzone
            accept="application/pdf,.pdf"
            multiple={false}
            onFilesSelected={handleFileSelected}
            title="Drop a PDF document to sign"
            description="Select a contract, agreement, or form. Files never leave your browser."
          />
        )}

        {file && (
          <div className="space-y-5 rounded-2xl border border-slate-200 bg-slate-50/60 p-5 sm:p-6 dark:border-slate-800 dark:bg-slate-900/60">
            {/* Top Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-emerald-100 bg-emerald-50 text-emerald-600 dark:border-emerald-900/40 dark:bg-emerald-950/40 dark:text-emerald-400">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-[220px] sm:max-w-xs">
                    {file.name}
                  </h2>
                  <p className="font-mono text-xs text-slate-500 dark:text-slate-400">
                    Page {currentPage} of {totalPages} • {signatures.length} signature(s) placed
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 px-4 py-2 text-xs font-bold text-white shadow-md shadow-rose-600/20 transition-all"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Signature</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setFile(null);
                    setSignatures([]);
                    setSelectedSigId(null);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 transition-colors"
                >
                  <X className="h-4 w-4" />
                  <span>Close</span>
                </button>
              </div>
            </div>

            {/* Page Navigation & Hint */}
            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
              <span className="font-medium text-slate-500 dark:text-slate-400">
                {selectedSigId ? (
                  <span className="text-rose-600 dark:text-rose-400 font-semibold">
                    Signature selected: Drag to position or resize from the corner handle. Click outside to preview.
                  </span>
                ) : (
                  <span>Click any placed signature to adjust it. Click outside to see the clean preview.</span>
                )}
              </span>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => currentPage > 1 && setCurrentPage((p) => p - 1)}
                  disabled={currentPage <= 1 || isRenderingPage}
                  className="rounded-lg border border-slate-200 p-1.5 text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-400 disabled:opacity-30 transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="font-mono text-slate-900 dark:text-white font-bold">
                  {currentPage} / {totalPages}
                </span>
                <button
                  type="button"
                  onClick={() => currentPage < totalPages && setCurrentPage((p) => p + 1)}
                  disabled={currentPage >= totalPages || isRenderingPage}
                  className="rounded-lg border border-slate-200 p-1.5 text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-400 disabled:opacity-30 transition-colors"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* DOCUMENT CANVAS & SIGNATURE OVERLAY (Light Mode) */}
            <div
              onClick={() => setSelectedSigId(null)}
              className="relative flex justify-center overflow-x-auto rounded-2xl border border-slate-200 bg-slate-100 p-4 min-h-[500px] dark:border-slate-800 dark:bg-slate-950"
            >
              {isRenderingPage && (
                <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/60 dark:bg-slate-950/60 backdrop-blur-2xs">
                  <Loader2 className="h-6 w-6 animate-spin text-rose-600" />
                </div>
              )}

              <div
                ref={pageContainerRef}
                className="relative inline-block select-none shadow-xl border border-slate-200/80 bg-white"
              >
                {/* Rendered PDF Page Canvas */}
                <canvas ref={pdfCanvasRef} className="block h-auto max-w-full rounded-sm" />

                {/* Placed Signatures on Current Page */}
                {currentPageSignatures.map((sig) => {
                  const isSelected = selectedSigId === sig.id;

                  return (
                    <div
                      key={sig.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedSigId(sig.id);
                      }}
                      onPointerDown={(e) => handlePointerDownDrag(sig.id, e)}
                      style={{
                        left: `${sig.position.xPercent}%`,
                        top: `${sig.position.yPercent}%`,
                        width: `${sig.position.widthPercent}%`,
                        height: `${sig.position.heightPercent}%`,
                        touchAction: "none",
                      }}
                      className={`group absolute cursor-move rounded transition-shadow ${
                        isSelected
                          ? "border-2 border-dashed border-rose-500 bg-rose-500/5 shadow-md"
                          : "border border-transparent hover:border-slate-300"
                      }`}
                    >
                      {/* Rendered Signature Graphic */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={sig.dataUrl}
                        alt="Signature"
                        className="pointer-events-none h-full w-full object-contain"
                      />

                      {/* Controls ONLY show when signature is selected */}
                      {isSelected && (
                        <>
                          <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex items-center gap-1 rounded bg-slate-900 px-1.5 py-0.5 font-mono text-[9px] text-white shadow">
                            <Move className="h-2.5 w-2.5 text-rose-400" />
                            <span>Drag to move</span>
                          </div>

                          <button
                            type="button"
                            onClick={(e) => handleRemoveSignature(sig.id, e)}
                            className="absolute -top-2.5 -right-2.5 rounded-full border border-slate-200 bg-white p-1 text-slate-500 hover:text-red-600 shadow-sm transition-colors"
                            title="Remove signature"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>

                          {/* Resize Handle */}
                          <div
                            onPointerDown={(e) => handlePointerDownResize(sig.id, e)}
                            className="absolute -bottom-2 -right-2 h-4 w-4 cursor-se-resize rounded-full border-2 border-rose-600 bg-white shadow-md hover:scale-125 transition-transform"
                          />
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Notifications */}
            {errorMessage && (
              <div className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400">
                <AlertCircle className="h-4 w-4 shrink-0 text-red-600 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="flex items-start gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-400">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Bottom Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-slate-200 dark:border-slate-800">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {signatures.length > 0
                  ? `${signatures.length} signature(s) placed across the document.`
                  : "Add at least one signature to download."}
              </span>

              <button
                type="button"
                onClick={handleSignDocument}
                disabled={signatures.length === 0 || isSigning}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 hover:bg-rose-500 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-rose-600/20 disabled:opacity-40 transition-all"
              >
                {isSigning ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-white" />
                    <span>Compiling PDF Document...</span>
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 text-white" />
                    <span>Sign & Download PDF ({signatures.length})</span>
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
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-2xs">
            <div className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <PenTool className="h-4 w-4 text-rose-600" />
                  <span>Create Signature</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Tabs & Colors */}
              <div className="flex items-center justify-between">
                <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 p-1 text-xs font-semibold dark:border-slate-800 dark:bg-slate-800">
                  <button
                    type="button"
                    onClick={() => setActiveTab("draw")}
                    className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 transition-colors ${
                      activeTab === "draw"
                        ? "bg-white text-slate-900 shadow-2xs dark:bg-slate-900 dark:text-white"
                        : "text-slate-600 dark:text-slate-400"
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
                        ? "bg-white text-slate-900 shadow-2xs dark:bg-slate-900 dark:text-white"
                        : "text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    <Type className="h-3.5 w-3.5" />
                    <span>Type</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 font-medium">Ink:</span>
                  <button
                    type="button"
                    onClick={() => setInkColor("#09090b")}
                    className={`h-6 w-6 rounded-full border-2 bg-slate-950 transition-all ${
                      inkColor === "#09090b" ? "border-rose-500 scale-110 shadow-sm" : "border-slate-300"
                    }`}
                    title="Black Ink"
                  />
                  <button
                    type="button"
                    onClick={() => setInkColor("#1d4ed8")}
                    className={`h-6 w-6 rounded-full border-2 bg-blue-600 transition-all ${
                      inkColor === "#1d4ed8" ? "border-rose-500 scale-110 shadow-sm" : "border-slate-300"
                    }`}
                    title="Blue Ink"
                  />
                </div>
              </div>

              {/* DRAW CANVAS TAB */}
              {activeTab === "draw" && (
                <div className="space-y-3">
                  <div className="relative rounded-xl border border-slate-200 bg-white shadow-inner overflow-hidden dark:border-slate-800">
                    <canvas
                      ref={drawCanvasRef}
                      onPointerDown={startDrawing}
                      onPointerMove={drawMove}
                      onPointerUp={stopDrawing}
                      onPointerLeave={stopDrawing}
                      className="touch-none w-full h-[190px] cursor-crosshair block"
                    />
                    <div className="pointer-events-none absolute bottom-6 left-8 right-8 border-b border-dashed border-slate-300 dark:border-slate-700" />
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Draw your signature above the line</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={undoDraw}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300"
                      >
                        <Undo2 className="h-3.5 w-3.5" />
                        <span>Undo</span>
                      </button>
                      <button
                        type="button"
                        onClick={clearDraw}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                        <span>Clear</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TYPE TAB */}
              {activeTab === "type" && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Type your full name:
                    </label>
                    <input
                      type="text"
                      value={typedName}
                      onChange={(e) => setTypedName(e.target.value)}
                      placeholder="e.g. John Doe"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 focus:border-rose-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-white"
                    />
                  </div>

                  <div className="relative flex h-[140px] items-center justify-center rounded-xl border border-slate-200 bg-white p-4 shadow-inner dark:border-slate-800 dark:bg-slate-850">
                    <div className="pointer-events-none absolute bottom-5 left-8 right-8 border-b border-dashed border-slate-300 dark:border-slate-700" />
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

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300 transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={applySignature}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 px-5 py-2 text-xs font-bold text-white transition-all shadow-md shadow-rose-600/20"
                >
                  <Check className="h-4 w-4" />
                  <span>Place Signature</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}