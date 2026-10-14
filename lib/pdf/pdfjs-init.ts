'use client';

let pdfjsLib: any = null;

export async function getPdfjs() {
  if (typeof window === 'undefined') {
    throw new Error('PDF.js can only be loaded in the browser');
  }

  if (pdfjsLib) return pdfjsLib;

  try {
    const pdfjs = await import('pdfjs-dist');
    pdfjsLib = pdfjs;

    // Configure the worker source using a reliable CDN matching version or fallback
    const version = pdfjs.version || '4.10.38';
    if (!pdfjs.GlobalWorkerOptions.workerSrc) {
      pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${version}/pdf.worker.min.mjs`;
    }

    return pdfjsLib;
  } catch (err) {
    console.error('Failed to load PDF.js:', err);
    throw err;
  }
}

export async function loadPdfDocument(arrayBuffer: ArrayBuffer) {
  const pdfjs = await getPdfjs();
  const loadingTask = pdfjs.getDocument({
    data: new Uint8Array(arrayBuffer),
    cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/cmaps/',
    cMapPacked: true,
  });
  return await loadingTask.promise;
}

export async function renderPageToCanvas(
  pdfDoc: any,
  pageNumber: number,
  canvas: HTMLCanvasElement,
  scale: number = 1.0
): Promise<{ width: number; height: number }> {
  const page = await pdfDoc.getPage(pageNumber);
  const viewport = page.getViewport({ scale });

  canvas.width = viewport.width;
  canvas.height = viewport.height;

  const context = canvas.getContext('2d');
  if (!context) throw new Error('Could not get 2d canvas context');

  // Fill with white background
  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, canvas.width, canvas.height);

  const renderContext = {
    canvasContext: context,
    viewport: viewport,
  };

  await page.render(renderContext).promise;
  return { width: viewport.width, height: viewport.height };
}

export async function renderPageToDataUrl(
  pdfDoc: any,
  pageNumber: number,
  scale: number = 0.5,
  format: 'image/jpeg' | 'image/png' = 'image/jpeg',
  quality: number = 0.8
): Promise<string> {
  const canvas = document.createElement('canvas');
  await renderPageToCanvas(pdfDoc, pageNumber, canvas, scale);
  return canvas.toDataURL(format, quality);
}

export async function extractTextFromPdf(arrayBuffer: ArrayBuffer): Promise<{
  pages: { pageNumber: number; text: string }[];
  fullText: string;
}> {
  const pdfDoc = await loadPdfDocument(arrayBuffer);
  const pages: { pageNumber: number; text: string }[] = [];
  const fullTextParts: string[] = [];

  for (let i = 1; i <= pdfDoc.numPages; i++) {
    const page = await pdfDoc.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item: any) => item.str || '')
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();

    pages.push({ pageNumber: i, text: pageText });
    fullTextParts.push(`--- Page ${i} ---\n${pageText}`);
  }

  return {
    pages,
    fullText: fullTextParts.join('\n\n'),
  };
}
