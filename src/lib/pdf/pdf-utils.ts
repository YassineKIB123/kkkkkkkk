import { PDFDocument } from "pdf-lib";

/**
 * Merges multiple PDF File objects into a single PDF document client-side.
 */
export async function mergePDFs(files: File[]): Promise<Uint8Array> {
  if (files.length < 2) {
    throw new Error("At least two PDF files are required to perform a merge.");
  }

  const mergedPdf = await PDFDocument.create();

  for (const file of files) {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const sourcePdf = await PDFDocument.load(arrayBuffer, {
        ignoreEncryption: false,
      });

      const pageIndices = sourcePdf.getPageIndices();
      const copiedPages = await mergedPdf.copyPages(sourcePdf, pageIndices);
      copiedPages.forEach((page) => mergedPdf.addPage(page));
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error";
      throw new Error(
        `Failed to read "${file.name}". It may be password-protected or corrupted. (${errorMessage})`
      );
    }
  }

  return await mergedPdf.save();
}

/**
 * Triggers a native browser file download using an in-memory Blob URL.
 */
export function downloadBlob(
  data: Uint8Array | Blob,
  fileName: string,
  mimeType: string = "application/pdf"
): void {
  const blob =
    data instanceof Blob ? data : new Blob([data as BlobPart], { type: mimeType });
  const objectUrl = URL.createObjectURL(blob);

  const downloadLink = document.createElement("a");
  downloadLink.href = objectUrl;
  downloadLink.download = fileName;
  document.body.appendChild(downloadLink);
  downloadLink.click();

  document.body.removeChild(downloadLink);
  setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
}

/**
 * Compiles a list of HTMLCanvasElements into a standard A4 multi-page PDF document.
 */
export async function canvasesToPDF(canvases: HTMLCanvasElement[]): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();

  const A4_WIDTH = 595.28;
  const A4_HEIGHT = 841.89;
  const MARGIN = 20;

  const availableWidth = A4_WIDTH - MARGIN * 2;
  const availableHeight = A4_HEIGHT - MARGIN * 2;

  for (const canvas of canvases) {
    const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
    const response = await fetch(dataUrl);
    const imageBytes = await response.arrayBuffer();

    const embeddedImage = await pdfDoc.embedJpg(imageBytes);
    const page = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT]);

    const scale = Math.min(
      availableWidth / embeddedImage.width,
      availableHeight / embeddedImage.height
    );
    const drawWidth = embeddedImage.width * scale;
    const drawHeight = embeddedImage.height * scale;

    const x = (A4_WIDTH - drawWidth) / 2;
    const y = (A4_HEIGHT - drawHeight) / 2;

    page.drawImage(embeddedImage, {
      x,
      y,
      width: drawWidth,
      height: drawHeight,
    });
  }

  return await pdfDoc.save();
}

/**
 * Internal helper to decode and format an image into PDF-compatible bytes.
 * Handles WebP by auto-rasterizing to high-quality JPEG in-memory.
 */
async function getImageEmbedData(
  pdfDoc: PDFDocument,
  file: File
): Promise<{ image: import("pdf-lib").PDFImage }> {
  const isJpeg = file.type === "image/jpeg" || file.type === "image/jpg";
  const isPng = file.type === "image/png";

  if (isJpeg) {
    const bytes = await file.arrayBuffer();
    const image = await pdfDoc.embedJpg(bytes);
    return { image };
  }

  if (isPng) {
    try {
      const bytes = await file.arrayBuffer();
      const image = await pdfDoc.embedPng(bytes);
      return { image };
    } catch {
      // Fall through to canvas rasterizer if PNG has custom color profile
    }
  }

  // Fallback for WebP and other formats via HTML5 Canvas
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = async () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Could not initialize canvas context for image conversion."));
        return;
      }
      ctx.drawImage(img, 0, 0);

      canvas.toBlob(
        async (blob) => {
          if (!blob) {
            reject(new Error(`Failed to rasterize image: ${file.name}`));
            return;
          }
          const bytes = await blob.arrayBuffer();
          const image = await pdfDoc.embedJpg(bytes);
          resolve({ image });
        },
        "image/jpeg",
        0.95
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error(`Failed to load image "${file.name}". File may be corrupt.`));
    };

    img.src = url;
  });
}

/**
 * Converts a collection of image files into a single PDF document.
 * Supports zero-margin full-bleed rendering and 1:1 image fitting without empty borders.
 */
export async function imagesToPDF(
  files: File[],
  options: {
    orientation: "portrait" | "landscape";
    margin: number;
    pageSize: "A4" | "fit";
  }
): Promise<Uint8Array> {
  if (files.length === 0) {
    throw new Error("Please select at least one image to convert.");
  }

  const pdfDoc = await PDFDocument.create();

  // Standard A4 points (72 DPI)
  const A4_PORTRAIT_W = 595.28;
  const A4_PORTRAIT_H = 841.89;

  for (const file of files) {
    const { image } = await getImageEmbedData(pdfDoc, file);

    if (options.pageSize === "fit") {
      if (options.margin === 0) {
        // EXACT pixel match — 100% zero white space on any side
        const page = pdfDoc.addPage([image.width, image.height]);
        page.drawImage(image, {
          x: 0,
          y: 0,
          width: image.width,
          height: image.height,
        });
      } else {
        const pageW = image.width + options.margin * 2;
        const pageH = image.height + options.margin * 2;
        const page = pdfDoc.addPage([pageW, pageH]);

        page.drawImage(image, {
          x: options.margin,
          y: options.margin,
          width: image.width,
          height: image.height,
        });
      }
    } else {
      // Standard A4 page
      const pageW = options.orientation === "portrait" ? A4_PORTRAIT_W : A4_PORTRAIT_H;
      const pageH = options.orientation === "portrait" ? A4_PORTRAIT_H : A4_PORTRAIT_W;
      const page = pdfDoc.addPage([pageW, pageH]);

      if (options.margin === 0) {
        // Full Bleed: scale to cover entire sheet without leaving empty gaps
        const scale = Math.max(pageW / image.width, pageH / image.height);
        const drawW = image.width * scale;
        const drawH = image.height * scale;

        const x = (pageW - drawW) / 2;
        const y = (pageH - drawH) / 2;

        page.drawImage(image, {
          x,
          y,
          width: drawW,
          height: drawH,
        });
      } else {
        // Contained within margins
        const availW = pageW - options.margin * 2;
        const availH = pageH - options.margin * 2;

        const scale = Math.min(availW / image.width, availH / image.height);
        const drawW = image.width * scale;
        const drawH = image.height * scale;

        const x = (pageW - drawW) / 2;
        const y = (pageH - drawH) / 2;

        page.drawImage(image, {
          x,
          y,
          width: drawW,
          height: drawH,
        });
      }
    }
  }

  return await pdfDoc.save();
}

/**
 * Inspects a PDF file in-memory and returns its total page count.
 */
export async function getPDFPageCount(file: File): Promise<number> {
  const bytes = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(bytes, { ignoreEncryption: true });
  return pdfDoc.getPageCount();
}

/**
 * Parses a page range string (e.g. "1-3, 5, 8-10") into a sorted array of 0-based page indices.
 */
export function parsePageRangeString(rangeStr: string, totalPages: number): number[] {
  const cleaned = rangeStr.replace(/\s+/g, "");
  if (!cleaned) throw new Error("Please specify at least one page number or range.");

  const tokens = cleaned.split(",");
  const selectedPages = new Set<number>();

  for (const token of tokens) {
    if (!token) continue;

    if (token.includes("-")) {
      const [startStr, endStr] = token.split("-");
      const start = parseInt(startStr, 10);
      const end = parseInt(endStr, 10);

      if (isNaN(start) || isNaN(end)) {
        throw new Error(`Invalid range format: "${token}"`);
      }
      if (start < 1 || end > totalPages || start > end) {
        throw new Error(`Range "${token}" is outside document limits (1 to ${totalPages} pages).`);
      }

      for (let i = start; i <= end; i++) {
        selectedPages.add(i - 1);
      }
    } else {
      const pageNum = parseInt(token, 10);
      if (isNaN(pageNum)) {
        throw new Error(`Invalid page number: "${token}"`);
      }
      if (pageNum < 1 || pageNum > totalPages) {
        throw new Error(`Page ${pageNum} is out of bounds (Document has ${totalPages} pages).`);
      }
      selectedPages.add(pageNum - 1);
    }
  }

  if (selectedPages.size === 0) {
    throw new Error("No valid pages were extracted from the specified range.");
  }

  return Array.from(selectedPages).sort((a, b) => a - b);
}

/**
 * Splits a PDF document by extracting only the requested 1-based page range.
 */
export async function splitPDF(file: File, pageRangeStr: string): Promise<Uint8Array> {
  const bytes = await file.arrayBuffer();
  const sourcePdf = await PDFDocument.load(bytes, { ignoreEncryption: false });
  const totalPages = sourcePdf.getPageCount();

  const pageIndices = parsePageRangeString(pageRangeStr, totalPages);

  const targetPdf = await PDFDocument.create();
  const copiedPages = await targetPdf.copyPages(sourcePdf, pageIndices);

  copiedPages.forEach((page) => targetPdf.addPage(page));

  return await targetPdf.save();
}

/**
 * Embeds a PNG signature into a target page of a PDF document at specific percentage coordinates.
 * Translates web coordinates (top-left origin) to PDF points (bottom-left origin).
 */
export async function embedSignatureIntoPDF(
  pdfFile: File,
  pageNumber: number,
  signatureDataUrl: string,
  position: {
    xPercent: number;
    yPercent: number;
    widthPercent: number;
    heightPercent: number;
  }
): Promise<Uint8Array> {
  const bytes = await pdfFile.arrayBuffer();
  const pdfDoc = await PDFDocument.load(bytes, { ignoreEncryption: false });

  const pages = pdfDoc.getPages();
  const targetPageIndex = pageNumber - 1;

  if (targetPageIndex < 0 || targetPageIndex >= pages.length) {
    throw new Error(`Page ${pageNumber} does not exist in the document.`);
  }

  const page = pages[targetPageIndex];
  const { width: pageWidth, height: pageHeight } = page.getSize();

  // Load and embed the PNG signature
  const response = await fetch(signatureDataUrl);
  const signatureBytes = await response.arrayBuffer();
  const signatureImage = await pdfDoc.embedPng(signatureBytes);

  // Normalize percentages (supports 0-1 or 0-100)
  const xRatio = position.xPercent > 1 ? position.xPercent / 100 : position.xPercent;
  const yRatio = position.yPercent > 1 ? position.yPercent / 100 : position.yPercent;
  const wRatio =
    position.widthPercent > 1 ? position.widthPercent / 100 : position.widthPercent;
  const hRatio =
    position.heightPercent > 1 ? position.heightPercent / 100 : position.heightPercent;

  // Convert to PDF points
  const drawWidth = wRatio * pageWidth;
  const drawHeight = hRatio * pageHeight;
  const drawX = xRatio * pageWidth;
  // Invert Y coordinate: PDF origin (0,0) is bottom-left
  const drawY = pageHeight - (yRatio + hRatio) * pageHeight;

  page.drawImage(signatureImage, {
    x: drawX,
    y: drawY,
    width: drawWidth,
    height: drawHeight,
  });

  return await pdfDoc.save();
}