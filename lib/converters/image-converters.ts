import { PDFDocument } from 'pdf-lib';
import JSZip from 'jszip';
import { loadPdfDocument, renderPageToDataUrl } from '../pdf/pdfjs-init';

export async function convertPdfToImages(
  arrayBuffer: ArrayBuffer,
  format: 'jpeg' | 'png',
  quality: number = 0.9,
  progressCallback?: (current: number, total: number) => void
): Promise<{ blob: Blob; filename: string; mimeType: string }> {
  const pdfDoc = await loadPdfDocument(arrayBuffer);
  const total = pdfDoc.numPages;
  const mimeType = format === 'jpeg' ? 'image/jpeg' : 'image/png';
  const ext = format === 'jpeg' ? 'jpg' : 'png';

  if (total === 1) {
    // Single page output as direct image
    const dataUrl = await renderPageToDataUrl(pdfDoc, 1, 1.5, mimeType, quality);
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    return {
      blob,
      filename: `page-1.${ext}`,
      mimeType,
    };
  }

  // Multi-page: Bundle into ZIP
  const zip = new JSZip();

  for (let i = 1; i <= total; i++) {
    if (progressCallback) progressCallback(i, total);
    const dataUrl = await renderPageToDataUrl(pdfDoc, i, 1.5, mimeType, quality);
    const base64Data = dataUrl.split(',')[1];
    zip.file(`page-${i}.${ext}`, base64Data, { base64: true });
  }

  const zipBlob = await zip.generateAsync({ type: 'blob' });
  return {
    blob: zipBlob,
    filename: `pdf-pages-${format}.zip`,
    mimeType: 'application/zip',
  };
}

export async function convertImagesToPdf(
  images: { arrayBuffer: ArrayBuffer; type: string; name: string }[],
  pageSize: 'A4' | 'Letter' | 'Fit' = 'A4',
  orientation: 'portrait' | 'landscape' | 'auto' = 'auto',
  margin: number = 20
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();

  // Dimensions in points (72 points = 1 inch)
  const SIZES = {
    A4: { width: 595.28, height: 841.89 },
    Letter: { width: 612.0, height: 792.0 },
  };

  for (const imgItem of images) {
    let embeddedImage: any;

    if (imgItem.type.includes('png')) {
      embeddedImage = await pdfDoc.embedPng(imgItem.arrayBuffer);
    } else {
      // JPEG or WebP converted
      try {
        embeddedImage = await pdfDoc.embedJpg(imgItem.arrayBuffer);
      } catch {
        // Fallback to PNG embed if JPG fails
        embeddedImage = await pdfDoc.embedPng(imgItem.arrayBuffer);
      }
    }

    const imgWidth = embeddedImage.width;
    const imgHeight = embeddedImage.height;

    let targetPageWidth: number;
    let targetPageHeight: number;

    if (pageSize === 'Fit') {
      targetPageWidth = imgWidth + margin * 2;
      targetPageHeight = imgHeight + margin * 2;
    } else {
      const base = SIZES[pageSize];
      const isImgLandscape = imgWidth > imgHeight;

      if (orientation === 'landscape' || (orientation === 'auto' && isImgLandscape)) {
        targetPageWidth = Math.max(base.width, base.height);
        targetPageHeight = Math.min(base.width, base.height);
      } else {
        targetPageWidth = Math.min(base.width, base.height);
        targetPageHeight = Math.max(base.width, base.height);
      }
    }

    const page = pdfDoc.addPage([targetPageWidth, targetPageHeight]);

    // Calculate fitted dimensions within margins
    const availWidth = targetPageWidth - margin * 2;
    const availHeight = targetPageHeight - margin * 2;
    const scale = Math.min(availWidth / imgWidth, availHeight / imgHeight);

    const drawWidth = imgWidth * scale;
    const drawHeight = imgHeight * scale;
    const drawX = (targetPageWidth - drawWidth) / 2;
    const drawY = (targetPageHeight - drawHeight) / 2;

    page.drawImage(embeddedImage, {
      x: drawX,
      y: drawY,
      width: drawWidth,
      height: drawHeight,
    });
  }

  return await pdfDoc.save({ useObjectStreams: true });
}
