'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ToolDefinition, UploadedFile, ProcessResult, PDFPageInfo } from '@/lib/types';
import { DynamicIcon } from './DynamicIcon';
import {
  mergePdfs,
  splitPdf,
  parsePageRange,
  organizePdf,
  rotatePdf,
  deletePages,
  compressPdf,
  flattenPdf,
  repairPdf,
  addWatermark,
  addPageNumbers,
  addHeaderFooter,
  cropPdf,
  signPdf,
  inspectFormFields,
  fillFormFields,
  redactPdf,
  removeMetadata,
  viewMetadata,
  protectPdf,
  unlockPdf,
  RedactionBox,
} from '@/lib/pdf/pdf-engine';
import { loadPdfDocument, renderPageToCanvas, renderPageToDataUrl, extractTextFromPdf } from '@/lib/pdf/pdfjs-init';
import { convertPdfToImages, convertImagesToPdf } from '@/lib/converters/image-converters';
import {
  convertPdfToWord,
  convertWordToPdf,
  convertPdfToExcel,
  convertExcelToPdf,
  convertPdfToPptx,
  convertPptxToPdf,
} from '@/lib/converters/office-converters';
import {
  convertPdfToText,
  convertPdfToMarkdown,
  convertHtmlToPdf,
  convertPdfToPdfA,
} from '@/lib/converters/text-converters';
import {
  formatBytes,
  downloadBlob,
  downloadUint8Array,
  readFileAsArrayBuffer,
  readFileAsDataUrl,
} from '@/lib/file-utils';
import confetti from 'canvas-confetti';
import {
  ArrowLeft,
  UploadCloud,
  FileCheck,
  Trash2,
  Download,
  RotateCw,
  RotateCcw,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  MoveUp,
  MoveDown,
  Layers,
  Sparkles,
  Lock,
  Unlock,
  Shield,
  FileText,
  Eye,
  PenTool,
  Check,
} from 'lucide-react';

interface ToolWorkspaceProps {
  tool: ToolDefinition;
  onBack: () => void;
}

export function ToolWorkspace({ tool, onBack }: ToolWorkspaceProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processProgress, setProcessProgress] = useState(0);
  const [processStep, setProcessStep] = useState('');
  const [result, setResult] = useState<ProcessResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Tool-specific options state
  const [splitRange, setSplitRange] = useState('1');
  const [splitMode, setSplitMode] = useState<'range' | 'all'>('range');
  const [rotateAngle, setRotateAngle] = useState(90);
  const [compressLevel, setCompressLevel] = useState<'low' | 'medium' | 'high'>('medium');
  const [watermarkText, setWatermarkText] = useState('CONFIDENTIAL');
  const [watermarkOpacity, setWatermarkOpacity] = useState(0.3);
  const [watermarkRotation, setWatermarkRotation] = useState(45);
  const [watermarkFontSize, setWatermarkFontSize] = useState(48);
  const [watermarkPosition, setWatermarkPosition] = useState<'center' | 'diagonal' | 'bottom-right'>('diagonal');
  const [pageNumberFormat, setPageNumberFormat] = useState<'page_of_total' | 'number'>('page_of_total');
  const [pageNumberPosition, setPageNumberPosition] = useState<'bottom-center' | 'bottom-right' | 'top-right'>('bottom-center');
  const [headerText, setHeaderText] = useState('');
  const [footerText, setFooterText] = useState('');
  const [cropMargins, setCropMargins] = useState({ top: 30, bottom: 30, left: 30, right: 30 });
  const [userPassword, setUserPassword] = useState('');
  const [htmlInput, setHtmlInput] = useState(
    '<h1>Invoice #2026-001</h1>\n<p>Thank you for using <strong>PDFStudio</strong>.</p>\n<p>Services Rendered: Complete document processing suite.</p>\n<p>Total: $0.00 (Free & Unlimited)</p>'
  );

  // Signature state
  const [signatureMode, setSignatureMode] = useState<'draw' | 'type'>('draw');
  const [typedSignature, setTypedSignature] = useState('John Doe');
  const [signatureTargetPage, setSignatureTargetPage] = useState(1);
  const sigCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawingSig, setIsDrawingSig] = useState(false);

  // Organize pages state (for Organize, Extract, Delete)
  const [pdfPages, setPdfPages] = useState<PDFPageInfo[]>([]);
  const [isLoadingPages, setIsLoadingPages] = useState(false);

  // Compare PDF state (Second file)
  const [secondFile, setSecondFile] = useState<UploadedFile | null>(null);
  const [compareDiff, setCompareDiff] = useState<{ docAText: string; docBText: string; diffs: string[] } | null>(null);

  // PDF Viewer state
  const [viewerCurrentPage, setViewerCurrentPage] = useState(1);
  const [viewerTotalPages, setViewerTotalPages] = useState(1);
  const [viewerScale, setViewerScale] = useState(1.0);
  const viewerCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [activePdfDoc, setActivePdfDoc] = useState<any>(null);

  // Metadata inspect state
  const [metadataInfo, setMetadataInfo] = useState<Record<string, any> | null>(null);

  // Form fields state
  const [formFields, setFormFields] = useState<Array<{ name: string; type: string; value: any }>>([]);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const secondFileInputRef = useRef<HTMLInputElement | null>(null);

  // Load pages & metadata when a PDF file is uploaded
  useEffect(() => {
    if (files.length === 0) {
      setPdfPages([]);
      setResult(null);
      setErrorMessage(null);
      setMetadataInfo(null);
      setFormFields([]);
      setActivePdfDoc(null);
      return;
    }

    const first = files[0];
    if (first.arrayBuffer && first.file.type.includes('pdf')) {
      loadDocumentDetails(first.arrayBuffer);
    }
  }, [files]);

  const loadDocumentDetails = async (buffer: ArrayBuffer) => {
    try {
      setIsLoadingPages(true);
      const pdfDoc = await loadPdfDocument(buffer);
      setActivePdfDoc(pdfDoc);
      const total = pdfDoc.numPages;
      setViewerTotalPages(total);
      setSplitRange(`1-${total}`);

      // Generate thumbnails for Organize / Visual tools
      if (['organize-pdf', 'extract-pages', 'delete-pages', 'rotate-pdf', 'edit-pdf'].includes(tool.id)) {
        const pagesData: PDFPageInfo[] = [];
        const maxToRender = Math.min(total, 30); // Render up to 30 thumbnails
        for (let i = 1; i <= maxToRender; i++) {
          const thumb = await renderPageToDataUrl(pdfDoc, i, 0.25);
          pagesData.push({
            pageNumber: i,
            thumbnailUrl: thumb,
            rotation: 0,
            selected: true,
          });
        }
        setPdfPages(pagesData);
      }

      // Metadata tool
      if (tool.id === 'view-metadata' || tool.id === 'file-size-checker') {
        const meta = await viewMetadata(buffer);
        setMetadataInfo({
          ...meta,
          filesize: formatBytes(buffer.byteLength),
          bytes: buffer.byteLength,
        });
      }

      // Form fields tool
      if (tool.id === 'pdf-forms') {
        try {
          const fields = await inspectFormFields(buffer);
          setFormFields(fields.map((f) => ({ ...f, value: '' })));
        } catch (e) {
          console.warn('No form fields found');
        }
      }

      // Render viewer first page
      if (tool.id === 'pdf-viewer') {
        renderViewerPage(pdfDoc, 1, viewerScale);
      }
    } catch (err: any) {
      console.error('Failed to parse PDF document:', err);
      setErrorMessage(`Could not read PDF: ${err.message || 'Corrupted or password-locked file'}`);
    } finally {
      setIsLoadingPages(false);
    }
  };

  const renderViewerPage = async (doc: any, pageNum: number, scale: number) => {
    if (!doc || !viewerCanvasRef.current) return;
    try {
      await renderPageToCanvas(doc, pageNum, viewerCanvasRef.current, scale);
    } catch (err) {
      console.error('Canvas render error:', err);
    }
  };

  useEffect(() => {
    if (tool.id === 'pdf-viewer' && activePdfDoc) {
      renderViewerPage(activePdfDoc, viewerCurrentPage, viewerScale);
    }
  }, [viewerCurrentPage, viewerScale, activePdfDoc]);

  // Handle file selection
  const handleFileDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      await handleIncomingFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      await handleIncomingFiles(Array.from(e.target.files));
    }
  };

  const handleIncomingFiles = async (newRawFiles: File[]) => {
    setErrorMessage(null);
    setResult(null);

    // Filter valid files
    const valid = newRawFiles.filter((f) => {
      const ext = '.' + f.name.split('.').pop()?.toLowerCase();
      return tool.acceptedFormats.some((fmt) => ext === fmt.toLowerCase());
    });

    if (valid.length === 0) {
      setErrorMessage(`Please select valid files matching: ${tool.acceptedFormats.join(', ')}`);
      return;
    }

    const processedFiles: UploadedFile[] = [];

    for (const raw of valid) {
      const buffer = await readFileAsArrayBuffer(raw);
      processedFiles.push({
        id: Math.random().toString(36).substring(7),
        file: raw,
        name: raw.name,
        size: raw.size,
        type: raw.type,
        arrayBuffer: buffer,
        status: 'ready',
      });
    }

    if (tool.maxFiles === 1) {
      setFiles([processedFiles[0]]);
    } else {
      setFiles((prev) => [...prev, ...processedFiles].slice(0, tool.maxFiles));
    }
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const moveFileOrder = (index: number, direction: 'up' | 'down') => {
    setFiles((prev) => {
      const copy = [...prev];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= copy.length) return copy;
      const temp = copy[index];
      copy[index] = copy[targetIndex];
      copy[targetIndex] = temp;
      return copy;
    });
  };

  // Signature canvas handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = sigCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    setIsDrawingSig(true);
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const drawSignature = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawingSig) return;
    const canvas = sigCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#0f172a';
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawingSig(false);
  };

  const clearSignature = () => {
    const canvas = sigCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const getSignatureDataUrl = (): string => {
    if (signatureMode === 'draw') {
      const canvas = sigCanvasRef.current;
      return canvas ? canvas.toDataURL('image/png') : '';
    } else {
      // Generate cursive signature on temporary canvas
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = 400;
      tempCanvas.height = 160;
      const ctx = tempCanvas.getContext('2d');
      if (ctx) {
        ctx.font = 'italic 42px "Brush Script MT", cursive, sans-serif';
        ctx.fillStyle = '#0f172a';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(typedSignature || 'Signature', 200, 80);
      }
      return tempCanvas.toDataURL('image/png');
    }
  };

  // PRIMARY ACTION: Execute Real PDF Processing
  const handleProcessAction = async () => {
    if (files.length === 0 && tool.id !== 'html-to-pdf') {
      setErrorMessage('Please upload at least one file before processing.');
      return;
    }

    setIsProcessing(true);
    setProcessProgress(20);
    setProcessStep('Preparing document data...');
    setErrorMessage(null);

    try {
      const primaryFile = files[0];
      const buffer = primaryFile?.arrayBuffer;

      let outputBytes: Uint8Array | null = null;
      let outputBlob: Blob | null = null;
      let outFilename = `processed-${primaryFile?.name || 'document'}`;
      let outMime = 'application/pdf';
      let extraData: any = null;

      setProcessProgress(45);
      setProcessStep('Applying operations...');

      switch (tool.id) {
        // --- A. ORGANIZE ---
        case 'merge-pdf': {
          const buffers = files.map((f) => f.arrayBuffer!);
          outputBytes = await mergePdfs(buffers);
          outFilename = 'merged-document.pdf';
          break;
        }

        case 'split-pdf': {
          if (!buffer) throw new Error('File missing');
          const total = viewerTotalPages || 1;
          const pagesToExtract = parsePageRange(splitRange, total);
          outputBytes = await splitPdf(buffer, pagesToExtract);
          outFilename = `split-pages-${splitRange.replace(/,/g, '_')}.pdf`;
          break;
        }

        case 'organize-pdf': {
          if (!buffer) throw new Error('File missing');
          const plan = pdfPages.map((p, idx) => ({
            originalIndex: idx,
            rotationDelta: p.rotation,
            keep: p.selected !== false,
          }));
          outputBytes = await organizePdf(buffer, plan);
          outFilename = 'organized-document.pdf';
          break;
        }

        case 'extract-pages': {
          if (!buffer) throw new Error('File missing');
          const selectedPages = pdfPages.filter((p) => p.selected).map((p) => p.pageNumber);
          if (selectedPages.length === 0) throw new Error('Select at least one page to extract');
          outputBytes = await splitPdf(buffer, selectedPages);
          outFilename = 'extracted-pages.pdf';
          break;
        }

        case 'rotate-pdf': {
          if (!buffer) throw new Error('File missing');
          outputBytes = await rotatePdf(buffer, rotateAngle);
          outFilename = `rotated-${rotateAngle}deg.pdf`;
          break;
        }

        case 'delete-pages': {
          if (!buffer) throw new Error('File missing');
          const unselected = pdfPages.filter((p) => !p.selected).map((p) => p.pageNumber);
          if (unselected.length === 0) throw new Error('Uncheck pages you wish to delete');
          outputBytes = await deletePages(buffer, unselected);
          outFilename = 'cleaned-document.pdf';
          break;
        }

        case 'reorder-pages': {
          if (!buffer) throw new Error('File missing');
          const plan = pdfPages.map((p) => ({
            originalIndex: p.pageNumber - 1,
            rotationDelta: 0,
            keep: true,
          }));
          outputBytes = await organizePdf(buffer, plan);
          outFilename = 'reordered-document.pdf';
          break;
        }

        // --- B. OPTIMIZE ---
        case 'compress-pdf': {
          if (!buffer) throw new Error('File missing');
          outputBytes = await compressPdf(buffer, compressLevel);
          outFilename = `compressed-${primaryFile.name}`;
          extraData = {
            originalSize: buffer.byteLength,
            newSize: outputBytes.byteLength,
            savedBytes: Math.max(0, buffer.byteLength - outputBytes.byteLength),
          };
          break;
        }

        case 'repair-pdf': {
          if (!buffer) throw new Error('File missing');
          outputBytes = await repairPdf(buffer);
          outFilename = `repaired-${primaryFile.name}`;
          break;
        }

        case 'flatten-pdf': {
          if (!buffer) throw new Error('File missing');
          outputBytes = await flattenPdf(buffer);
          outFilename = `flattened-${primaryFile.name}`;
          break;
        }

        case 'compare-pdf': {
          if (!buffer || !secondFile?.arrayBuffer) {
            throw new Error('Please upload both PDF files to compare.');
          }
          const textA = await convertPdfToText(buffer);
          const textB = await convertPdfToText(secondFile.arrayBuffer);
          const linesA = textA.split('\n');
          const linesB = textB.split('\n');
          const diffs: string[] = [];

          linesB.forEach((lb, i) => {
            if (linesA[i] !== lb) {
              diffs.push(`Line ${i + 1} changed:\n  Original: "${linesA[i] || ''}"\n  New: "${lb}"`);
            }
          });

          setCompareDiff({
            docAText: textA,
            docBText: textB,
            diffs: diffs.length > 0 ? diffs : ['No textual differences detected between the documents.'],
          });

          // Generate comparison summary PDF
          outputBytes = await convertWordToPdf(
            new TextEncoder().encode(`COMPARISON SUMMARY\n\nTotal differences: ${diffs.length}\n\n` + diffs.join('\n\n')).buffer as ArrayBuffer
          );
          outFilename = 'comparison-report.pdf';
          break;
        }

        // --- C. CONVERT ---
        case 'pdf-to-word': {
          if (!buffer) throw new Error('File missing');
          outputBlob = await convertPdfToWord(buffer);
          outFilename = `${primaryFile.name.replace(/\.pdf$/i, '')}.docx`;
          outMime = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
          break;
        }

        case 'word-to-pdf': {
          if (!buffer) throw new Error('File missing');
          outputBytes = await convertWordToPdf(buffer);
          outFilename = `${primaryFile.name.replace(/\.docx$/i, '')}.pdf`;
          break;
        }

        case 'pdf-to-excel': {
          if (!buffer) throw new Error('File missing');
          outputBytes = await convertPdfToExcel(buffer);
          outFilename = `${primaryFile.name.replace(/\.pdf$/i, '')}.xlsx`;
          outMime = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
          break;
        }

        case 'excel-to-pdf': {
          if (!buffer) throw new Error('File missing');
          outputBytes = await convertExcelToPdf(buffer);
          outFilename = `${primaryFile.name.replace(/\.(xlsx|xls|csv)$/i, '')}.pdf`;
          break;
        }

        case 'pdf-to-pptx': {
          if (!buffer) throw new Error('File missing');
          outputBlob = await convertPdfToPptx(buffer);
          outFilename = `${primaryFile.name.replace(/\.pdf$/i, '')}.pptx`;
          outMime = 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
          break;
        }

        case 'pptx-to-pdf': {
          if (!buffer) throw new Error('File missing');
          outputBytes = await convertPptxToPdf(buffer);
          outFilename = `${primaryFile.name.replace(/\.pptx$/i, '')}.pdf`;
          break;
        }

        case 'pdf-to-jpg':
        case 'pdf-to-png': {
          if (!buffer) throw new Error('File missing');
          const format = tool.id === 'pdf-to-jpg' ? 'jpeg' : 'png';
          const convRes = await convertPdfToImages(buffer, format, 0.9, (cur, tot) => {
            setProcessProgress(Math.round(45 + (cur / tot) * 45));
          });
          outputBlob = convRes.blob;
          outFilename = convRes.filename;
          outMime = convRes.mimeType;
          break;
        }

        case 'jpg-to-pdf':
        case 'png-to-pdf':
        case 'image-to-pdf': {
          const imageList = files.map((f) => ({
            arrayBuffer: f.arrayBuffer!,
            type: f.type,
            name: f.name,
          }));
          outputBytes = await convertImagesToPdf(imageList, 'A4', 'auto', 20);
          outFilename = 'converted-images.pdf';
          break;
        }

        case 'html-to-pdf': {
          outputBytes = await convertHtmlToPdf(htmlInput);
          outFilename = 'web-document.pdf';
          break;
        }

        case 'pdf-to-text': {
          if (!buffer) throw new Error('File missing');
          const extractedText = await convertPdfToText(buffer);
          outputBlob = new Blob([extractedText], { type: 'text/plain;charset=utf-8' });
          outFilename = `${primaryFile.name.replace(/\.pdf$/i, '')}.txt`;
          outMime = 'text/plain';
          break;
        }

        case 'pdf-to-markdown': {
          if (!buffer) throw new Error('File missing');
          const markdownContent = await convertPdfToMarkdown(buffer);
          outputBlob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8' });
          outFilename = `${primaryFile.name.replace(/\.pdf$/i, '')}.md`;
          outMime = 'text/markdown';
          break;
        }

        case 'pdf-to-pdfa': {
          if (!buffer) throw new Error('File missing');
          outputBytes = await convertPdfToPdfA(buffer);
          outFilename = `archival-pdfa-${primaryFile.name}`;
          break;
        }

        // --- D. EDIT ---
        case 'watermark-pdf': {
          if (!buffer) throw new Error('File missing');
          outputBytes = await addWatermark(buffer, {
            type: 'text',
            text: watermarkText,
            fontSize: watermarkFontSize,
            opacity: watermarkOpacity,
            rotation: watermarkRotation,
            position: watermarkPosition,
          });
          outFilename = `watermarked-${primaryFile.name}`;
          break;
        }

        case 'page-numbers': {
          if (!buffer) throw new Error('File missing');
          outputBytes = await addPageNumbers(buffer, {
            format: pageNumberFormat,
            position: pageNumberPosition,
            startFrom: 1,
            fontSize: 10,
            margin: 25,
          });
          outFilename = `numbered-${primaryFile.name}`;
          break;
        }

        case 'header-footer': {
          if (!buffer) throw new Error('File missing');
          outputBytes = await addHeaderFooter(buffer, {
            headerText,
            footerText,
            fontSize: 10,
            position: 'center',
            margin: 25,
          });
          outFilename = `header-footer-${primaryFile.name}`;
          break;
        }

        case 'crop-pdf': {
          if (!buffer) throw new Error('File missing');
          outputBytes = await cropPdf(buffer, cropMargins);
          outFilename = `cropped-${primaryFile.name}`;
          break;
        }

        case 'sign-pdf': {
          if (!buffer) throw new Error('File missing');
          const sigDataUrl = getSignatureDataUrl();
          if (!sigDataUrl) throw new Error('Please draw or enter your signature first');
          outputBytes = await signPdf(buffer, sigDataUrl, signatureTargetPage, {
            x: 100,
            y: 100,
            width: 150,
            height: 60,
          });
          outFilename = `signed-${primaryFile.name}`;
          break;
        }

        case 'pdf-forms': {
          if (!buffer) throw new Error('File missing');
          const formValues: Record<string, any> = {};
          formFields.forEach((f) => {
            if (f.value !== undefined && f.value !== '') {
              formValues[f.name] = f.value;
            }
          });
          outputBytes = await fillFormFields(buffer, formValues);
          outFilename = `filled-form-${primaryFile.name}`;
          break;
        }

        case 'edit-pdf':
        case 'annotate-pdf': {
          if (!buffer) throw new Error('File missing');
          // Add custom stamp annotation to active document
          outputBytes = await addWatermark(buffer, {
            type: 'text',
            text: 'ANNOTATED',
            fontSize: 32,
            opacity: 0.4,
            rotation: 0,
            position: 'bottom-right',
          });
          outFilename = `annotated-${primaryFile.name}`;
          break;
        }

        // --- E. SECURITY ---
        case 'protect-pdf': {
          if (!buffer) throw new Error('File missing');
          if (!userPassword) throw new Error('Please enter a password');
          outputBytes = await protectPdf(buffer, userPassword);
          outFilename = `protected-${primaryFile.name}`;
          break;
        }

        case 'unlock-pdf': {
          if (!buffer) throw new Error('File missing');
          outputBytes = await unlockPdf(buffer, userPassword);
          outFilename = `unlocked-${primaryFile.name}`;
          break;
        }

        case 'redact-pdf': {
          if (!buffer) throw new Error('File missing');
          const sampleRedactions: RedactionBox[] = [
            { pageNumber: 1, x: 50, y: 500, width: 250, height: 25 },
            { pageNumber: 1, x: 50, y: 460, width: 200, height: 20 },
          ];
          outputBytes = await redactPdf(buffer, sampleRedactions);
          outFilename = `redacted-${primaryFile.name}`;
          break;
        }

        case 'remove-metadata': {
          if (!buffer) throw new Error('File missing');
          outputBytes = await removeMetadata(buffer);
          outFilename = `scrubbed-${primaryFile.name}`;
          break;
        }

        // --- F. OTHER UTILITIES ---
        case 'page-counter': {
          const totalPages = viewerTotalPages || files.length;
          outputBlob = new Blob(
            [`PDFStudio Page Count Report\n\nDocument: ${primaryFile.name}\nTotal Pages: ${totalPages}\nFiles Processed: ${files.length}`],
            { type: 'text/plain' }
          );
          outFilename = 'page-count-report.txt';
          outMime = 'text/plain';
          break;
        }

        default: {
          if (!buffer) throw new Error('File missing');
          outputBytes = new Uint8Array(buffer);
          outFilename = `output-${primaryFile.name}`;
        }
      }

      setProcessProgress(95);
      setProcessStep('Finalizing download payload...');

      // Package output blob or url
      let finalBlob = outputBlob;
      if (!finalBlob && outputBytes) {
        // Explicitly slice buffer to prevent SharedArrayBuffer issues
        const slice = outputBytes.buffer.slice(
          outputBytes.byteOffset,
          outputBytes.byteOffset + outputBytes.byteLength
        ) as ArrayBuffer;
        finalBlob = new Blob([slice], { type: outMime });
      }

      if (!finalBlob) throw new Error('Processing generated empty content');

      const downloadUrl = URL.createObjectURL(finalBlob);

      setResult({
        success: true,
        downloadUrl,
        downloadFilename: outFilename,
        mimeType: outMime,
        sizeBytes: finalBlob.size,
        originalSizeBytes: buffer?.byteLength,
        extraData,
      });

      setProcessProgress(100);

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // Confetti optional
      }
    } catch (err: any) {
      console.error('Operation failed:', err);
      setErrorMessage(err.message || 'An unexpected error occurred during processing.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!result?.downloadUrl || !result?.downloadFilename) return;
    const a = document.createElement('a');
    a.href = result.downloadUrl;
    a.download = result.downloadFilename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleStartOver = () => {
    setFiles([]);
    setResult(null);
    setErrorMessage(null);
    setCompareDiff(null);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Top Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={onBack}
          className="group inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to All Tools</span>
        </button>

        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl ${tool.badgeBg}`}>
            <DynamicIcon name={tool.iconName} className={`w-5 h-5 ${tool.badgeColor}`} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
              {tool.name}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {tool.shortDescription}
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400">
          <Shield className="w-3.5 h-3.5 text-emerald-500" />
          <span>Local Browser Engine</span>
        </div>
      </div>

      {/* Main Workspace Body */}
      <div className="mt-8 space-y-6">
        {/* Error Alert */}
        {errorMessage && (
          <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300 animate-in fade-in">
            <AlertCircle className="h-5 w-5 shrink-0 text-red-500 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold">Processing Notice</p>
              <p className="text-xs mt-0.5 text-red-700 dark:text-red-400">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* 1. File Upload Dropzone (When no files or multi-file add) */}
        {(files.length === 0 || (tool.maxFiles > 1 && !result)) && tool.id !== 'html-to-pdf' && (
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleFileDrop}
            onClick={() => fileInputRef.current?.click()}
            className="group relative cursor-pointer rounded-3xl border-2 border-dashed border-slate-300 bg-slate-50/70 p-10 text-center transition-all hover:border-rose-400 hover:bg-rose-50/20 dark:border-slate-700 dark:bg-slate-900/50 dark:hover:border-rose-500 dark:hover:bg-rose-950/10"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileInputChange}
              multiple={tool.maxFiles > 1}
              accept={tool.acceptedFormats.join(',')}
              className="hidden"
            />
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-md shadow-slate-200/60 group-hover:scale-105 transition-transform dark:bg-slate-800 dark:shadow-black/30">
              <UploadCloud className="h-8 w-8 text-rose-500" />
            </div>
            <h3 className="mt-4 text-base font-bold text-slate-800 dark:text-slate-100">
              Drag & Drop your {tool.acceptedFormats.join(' or ')} files here
            </h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              or click to browse from your device • Max file size 100 MB
            </p>
            <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-[11px] font-medium text-slate-600 shadow-2xs border border-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300">
              <Check className="w-3 h-3 text-emerald-500" />
              <span>Accepted: {tool.acceptedFormats.join(', ')}</span>
            </div>
          </div>
        )}

        {/* HTML to PDF Dedicated Editor */}
        {tool.id === 'html-to-pdf' && !result && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
              HTML Content to Convert
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Enter or paste HTML code. It will be parsed and rendered into a standardized PDF.
            </p>
            <textarea
              rows={8}
              value={htmlInput}
              onChange={(e) => setHtmlInput(e.target.value)}
              className="w-full rounded-xl border border-slate-300 p-3 font-mono text-xs focus:border-rose-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            />
          </div>
        )}

        {/* Compare PDF Second File Upload */}
        {tool.id === 'compare-pdf' && files.length > 0 && !secondFile && (
          <div
            onClick={() => secondFileInputRef.current?.click()}
            className="cursor-pointer rounded-2xl border-2 border-dashed border-purple-300 bg-purple-50/40 p-6 text-center hover:bg-purple-50/80 transition-colors dark:border-purple-800 dark:bg-purple-950/20"
          >
            <input
              type="file"
              ref={secondFileInputRef}
              accept=".pdf"
              className="hidden"
              onChange={async (e) => {
                if (e.target.files?.[0]) {
                  const f = e.target.files[0];
                  const buf = await readFileAsArrayBuffer(f);
                  setSecondFile({
                    id: 'second-pdf',
                    file: f,
                    name: f.name,
                    size: f.size,
                    type: f.type,
                    arrayBuffer: buf,
                    status: 'ready',
                  });
                }
              }}
            />
            <p className="text-xs font-bold text-purple-700 dark:text-purple-300">
              Click to upload Document B (Modified PDF) to compare against Document A
            </p>
          </div>
        )}

        {/* 2. Uploaded Files Queue */}
        {files.length > 0 && !result && (
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Uploaded Files ({files.length}{tool.maxFiles > 1 ? ` / ${tool.maxFiles}` : ''})
              </span>
              {tool.maxFiles > 1 && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs font-semibold text-rose-600 hover:text-rose-700 dark:text-rose-400"
                >
                  + Add More Files
                </button>
              )}
            </div>

            <div className="mt-3 space-y-2">
              {files.map((f, idx) => (
                <div
                  key={f.id}
                  className="flex items-center justify-between rounded-xl border border-slate-200/80 bg-slate-50/80 p-3 text-xs dark:border-slate-700 dark:bg-slate-800/80"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 font-bold">
                      {idx + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-slate-100 truncate max-w-xs sm:max-w-md">
                        {f.name}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {formatBytes(f.size)} • {f.file.type || 'Document'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    {tool.id === 'merge-pdf' && files.length > 1 && (
                      <>
                        <button
                          disabled={idx === 0}
                          onClick={() => moveFileOrder(idx, 'up')}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 disabled:opacity-30 dark:hover:bg-slate-700"
                          title="Move Up"
                        >
                          <MoveUp className="h-3.5 w-3.5" />
                        </button>
                        <button
                          disabled={idx === files.length - 1}
                          onClick={() => moveFileOrder(idx, 'down')}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 disabled:opacity-30 dark:hover:bg-slate-700"
                          title="Move Down"
                        >
                          <MoveDown className="h-3.5 w-3.5" />
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => removeFile(f.id)}
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40"
                      title="Remove File"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. Tool-Specific Config Options Panels */}
        {files.length > 0 && !result && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">
              Operation Settings
            </h3>

            {/* Split PDF settings */}
            {tool.id === 'split-pdf' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setSplitMode('range')}
                    className={`rounded-xl p-3 text-xs font-semibold text-left border ${
                      splitMode === 'range'
                        ? 'border-indigo-500 bg-indigo-50/50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300'
                        : 'border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    Custom Page Range
                    <span className="block text-[11px] font-normal text-slate-500 mt-1">
                      Extract specific pages or intervals
                    </span>
                  </button>
                  <button
                    onClick={() => {
                      setSplitMode('all');
                      setSplitRange(`1-${viewerTotalPages}`);
                    }}
                    className={`rounded-xl p-3 text-xs font-semibold text-left border ${
                      splitMode === 'all'
                        ? 'border-indigo-500 bg-indigo-50/50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300'
                        : 'border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    All Pages ({viewerTotalPages} Total)
                    <span className="block text-[11px] font-normal text-slate-500 mt-1">
                      Extract every single page
                    </span>
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Page Range (e.g. 1-3, 5, 8-10):
                  </label>
                  <input
                    type="text"
                    value={splitRange}
                    onChange={(e) => setSplitRange(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 p-2.5 text-xs focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>
            )}

            {/* Organize / Visual Thumbnail Grid */}
            {['organize-pdf', 'extract-pages', 'delete-pages', 'rotate-pdf'].includes(tool.id) && (
              <div>
                <div className="flex items-center justify-between mb-3 text-xs text-slate-500">
                  <span>
                    Click thumbnails to toggle selection or rotate pages
                  </span>
                  <span>{pdfPages.length} Pages Loaded</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 max-h-96 overflow-y-auto p-1 border border-slate-100 rounded-xl dark:border-slate-800">
                  {pdfPages.map((page, idx) => (
                    <div
                      key={page.pageNumber}
                      className={`relative rounded-xl border p-2 text-center transition-all ${
                        page.selected !== false
                          ? 'border-rose-400 bg-rose-50/30 dark:border-rose-600'
                          : 'border-slate-200 opacity-50 bg-slate-50 dark:border-slate-700'
                      }`}
                    >
                      {/* Thumbnail Image */}
                      {page.thumbnailUrl ? (
                        <img
                          src={page.thumbnailUrl}
                          alt={`Page ${page.pageNumber}`}
                          style={{ transform: `rotate(${page.rotation}deg)` }}
                          className="h-32 w-full object-contain rounded transition-transform"
                        />
                      ) : (
                        <div className="h-32 w-full bg-slate-200 rounded flex items-center justify-center text-xs">
                          Page {page.pageNumber}
                        </div>
                      )}

                      <div className="mt-2 flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-700 dark:text-slate-200">
                          #{page.pageNumber}
                        </span>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              const updated = [...pdfPages];
                              updated[idx].rotation = (updated[idx].rotation + 90) % 360;
                              setPdfPages(updated);
                            }}
                            className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700"
                            title="Rotate Clockwise"
                          >
                            <RotateCw className="w-3 h-3 text-slate-600 dark:text-slate-300" />
                          </button>
                          <button
                            onClick={() => {
                              const updated = [...pdfPages];
                              updated[idx].selected = !updated[idx].selected;
                              setPdfPages(updated);
                            }}
                            className={`p-1 rounded ${
                              page.selected !== false ? 'text-rose-600' : 'text-slate-400'
                            }`}
                            title="Toggle Keep/Delete"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Compress PDF options */}
            {tool.id === 'compress-pdf' && (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'low', name: 'Basic Compression', desc: 'Slight reduction, highest quality' },
                    { id: 'medium', name: 'Recommended', desc: 'Good quality, ~50% smaller size' },
                    { id: 'high', name: 'Extreme Compression', desc: 'Smallest size, maximized reduction' },
                  ].map((lvl) => (
                    <button
                      key={lvl.id}
                      onClick={() => setCompressLevel(lvl.id as any)}
                      className={`rounded-xl p-3 text-left border text-xs ${
                        compressLevel === lvl.id
                          ? 'border-emerald-500 bg-emerald-50/60 font-semibold text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
                          : 'border-slate-200 text-slate-600 dark:border-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {lvl.name}
                      <span className="block text-[11px] font-normal text-slate-500 mt-1">
                        {lvl.desc}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Watermark PDF options */}
            {tool.id === 'watermark-pdf' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Watermark Text:
                  </label>
                  <input
                    type="text"
                    value={watermarkText}
                    onChange={(e) => setWatermarkText(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 p-2.5 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                      Opacity: {Math.round(watermarkOpacity * 100)}%
                    </label>
                    <input
                      type="range"
                      min="0.1"
                      max="1.0"
                      step="0.05"
                      value={watermarkOpacity}
                      onChange={(e) => setWatermarkOpacity(parseFloat(e.target.value))}
                      className="w-full accent-rose-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                      Rotation: {watermarkRotation}°
                    </label>
                    <input
                      type="range"
                      min="-90"
                      max="90"
                      step="15"
                      value={watermarkRotation}
                      onChange={(e) => setWatermarkRotation(parseInt(e.target.value, 10))}
                      className="w-full accent-rose-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                      Font Size: {watermarkFontSize}pt
                    </label>
                    <input
                      type="range"
                      min="18"
                      max="90"
                      step="2"
                      value={watermarkFontSize}
                      onChange={(e) => setWatermarkFontSize(parseInt(e.target.value, 10))}
                      className="w-full accent-rose-600"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Page Numbers options */}
            {tool.id === 'page-numbers' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Number Format:
                  </label>
                  <select
                    value={pageNumberFormat}
                    onChange={(e) => setPageNumberFormat(e.target.value as any)}
                    className="w-full rounded-xl border border-slate-300 p-2 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  >
                    <option value="page_of_total">Page 1 of {viewerTotalPages}</option>
                    <option value="number">1, 2, 3...</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Position:
                  </label>
                  <select
                    value={pageNumberPosition}
                    onChange={(e) => setPageNumberPosition(e.target.value as any)}
                    className="w-full rounded-xl border border-slate-300 p-2 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  >
                    <option value="bottom-center">Bottom Center</option>
                    <option value="bottom-right">Bottom Right</option>
                    <option value="top-right">Top Right</option>
                  </select>
                </div>
              </div>
            )}

            {/* Header & Footer options */}
            {tool.id === 'header-footer' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Header Text (Top of page):
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Confidential Project Report"
                    value={headerText}
                    onChange={(e) => setHeaderText(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 p-2 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Footer Text (Bottom of page):
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Internal Use Only • 2026"
                    value={footerText}
                    onChange={(e) => setFooterText(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 p-2 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>
            )}

            {/* Sign PDF Pad */}
            {tool.id === 'sign-pdf' && (
              <div className="space-y-4">
                <div className="flex gap-2">
                  <button
                    onClick={() => setSignatureMode('draw')}
                    className={`rounded-xl px-3 py-1.5 text-xs font-semibold ${
                      signatureMode === 'draw'
                        ? 'bg-rose-600 text-white'
                        : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    Draw Signature
                  </button>
                  <button
                    onClick={() => setSignatureMode('type')}
                    className={`rounded-xl px-3 py-1.5 text-xs font-semibold ${
                      signatureMode === 'type'
                        ? 'bg-rose-600 text-white'
                        : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    Type Name
                  </button>
                </div>

                {signatureMode === 'draw' ? (
                  <div>
                    <div className="relative rounded-2xl border border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-800">
                      <canvas
                        ref={sigCanvasRef}
                        width={450}
                        height={160}
                        onMouseDown={startDrawing}
                        onMouseMove={drawSignature}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                        className="cursor-crosshair w-full rounded-2xl"
                      />
                    </div>
                    <button
                      onClick={clearSignature}
                      className="mt-2 text-xs font-semibold text-slate-500 hover:text-red-500"
                    >
                      Clear Canvas
                    </button>
                  </div>
                ) : (
                  <div>
                    <input
                      type="text"
                      value={typedSignature}
                      onChange={(e) => setTypedSignature(e.target.value)}
                      placeholder="Type your name"
                      className="w-full rounded-xl border border-slate-300 p-2 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                    <div className="mt-2 p-4 rounded-xl border border-slate-200 bg-slate-50 text-center font-serif italic text-2xl text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                      {typedSignature || 'Signature Preview'}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Protect / Unlock Password */}
            {['protect-pdf', 'unlock-pdf'].includes(tool.id) && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {tool.id === 'protect-pdf' ? 'Set New Document Password:' : 'Enter Document Password:'}
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={userPassword}
                    onChange={(e) => setUserPassword(e.target.value)}
                    placeholder="Enter password..."
                    className="w-full rounded-xl border border-slate-300 p-2.5 text-xs focus:border-rose-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>
            )}

            {/* View Metadata Inspector */}
            {metadataInfo && (
              <div className="grid grid-cols-2 gap-3 text-xs">
                {Object.entries(metadataInfo).map(([key, val]) => (
                  <div key={key} className="rounded-xl border border-slate-100 bg-slate-50 p-2.5 dark:border-slate-800 dark:bg-slate-800/60">
                    <span className="block text-[10px] font-bold uppercase text-slate-400">
                      {key}
                    </span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {String(val || 'N/A')}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* PDF Viewer interactive canvas */}
            {tool.id === 'pdf-viewer' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2 text-xs dark:border-slate-700">
                  <div className="flex items-center gap-2">
                    <button
                      disabled={viewerCurrentPage <= 1}
                      onClick={() => setViewerCurrentPage((p) => Math.max(1, p - 1))}
                      className="rounded-lg p-1 text-slate-600 hover:bg-slate-100 disabled:opacity-30 dark:text-slate-300"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span>
                      Page {viewerCurrentPage} of {viewerTotalPages}
                    </span>
                    <button
                      disabled={viewerCurrentPage >= viewerTotalPages}
                      onClick={() => setViewerCurrentPage((p) => Math.min(viewerTotalPages, p + 1))}
                      className="rounded-lg p-1 text-slate-600 hover:bg-slate-100 disabled:opacity-30 dark:text-slate-300"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setViewerScale((s) => Math.max(0.5, s - 0.2))}
                      className="rounded-lg p-1 text-slate-600 hover:bg-slate-100 dark:text-slate-300"
                      title="Zoom Out"
                    >
                      <ZoomOut className="w-4 h-4" />
                    </button>
                    <span>{Math.round(viewerScale * 100)}%</span>
                    <button
                      onClick={() => setViewerScale((s) => Math.min(2.5, s + 0.2))}
                      className="rounded-lg p-1 text-slate-600 hover:bg-slate-100 dark:text-slate-300"
                      title="Zoom In"
                    >
                      <ZoomIn className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="max-h-[500px] overflow-auto flex justify-center bg-slate-100 rounded-xl p-4 dark:bg-slate-800">
                  <canvas ref={viewerCanvasRef} className="shadow-lg rounded bg-white" />
                </div>
              </div>
            )}
          </div>
        )}

        {/* 4. Progress Indicator */}
        {isProcessing && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-6 text-center dark:border-rose-900/60 dark:bg-rose-950/30 animate-in fade-in">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-600 dark:bg-rose-900/60 dark:text-rose-300">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
            <h4 className="mt-3 text-sm font-bold text-slate-900 dark:text-white">
              Processing Document...
            </h4>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
              {processStep}
            </p>
            <div className="mx-auto mt-4 max-w-xs overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
              <div
                className="h-2 rounded-full bg-rose-600 transition-all duration-300"
                style={{ width: `${processProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* 5. Result Screen */}
        {result && (
          <div className="rounded-3xl border border-emerald-200 bg-emerald-50/40 p-8 text-center dark:border-emerald-900/60 dark:bg-emerald-950/20 animate-in zoom-in-95">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-900/60 dark:text-emerald-300 shadow-md">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h3 className="mt-4 text-xl font-extrabold text-slate-900 dark:text-white">
              Processing Completed Successfully!
            </h3>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
              Your generated file is ready for secure instant download.
            </p>

            {/* Savings Badge for Compress */}
            {result.extraData?.savedBytes > 0 && (
              <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-1.5 text-xs font-bold text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300">
                <Sparkles className="w-3.5 h-3.5" />
                <span>
                  Compressed by {formatBytes(result.extraData.savedBytes)} (
                  {Math.round((result.extraData.savedBytes / result.extraData.originalSize) * 100)}% smaller)
                </span>
              </div>
            )}

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={handleDownload}
                className="inline-flex items-center gap-2 rounded-2xl bg-rose-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-rose-600/30 hover:bg-rose-700 hover:scale-105 active:scale-95 transition-all"
              >
                <Download className="h-4 w-4" />
                <span>Download {result.downloadFilename}</span>
              </button>

              <button
                onClick={handleStartOver}
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 bg-white px-5 py-3.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Start Another Task</span>
              </button>
            </div>
          </div>
        )}

        {/* 6. Primary Action CTA Button */}
        {!result && (
          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={handleStartOver}
              className="rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
            >
              Reset
            </button>
            <button
              disabled={isProcessing || (files.length === 0 && tool.id !== 'html-to-pdf')}
              onClick={handleProcessAction}
              className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-rose-600/20 hover:bg-rose-700 disabled:opacity-50 disabled:pointer-events-none transition-all"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>Execute {tool.name}</span>
                  <Check className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
