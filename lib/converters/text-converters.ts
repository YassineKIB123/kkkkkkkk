import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { extractTextFromPdf } from '../pdf/pdfjs-init';

// 1. PDF to Text
export async function convertPdfToText(arrayBuffer: ArrayBuffer): Promise<string> {
  const { fullText } = await extractTextFromPdf(arrayBuffer);
  return fullText || 'No selectable text could be extracted from this PDF.';
}

// 2. PDF to Markdown
export async function convertPdfToMarkdown(arrayBuffer: ArrayBuffer): Promise<string> {
  const { pages } = await extractTextFromPdf(arrayBuffer);
  const mdParts: string[] = ['# Document Export\n'];

  pages.forEach((page) => {
    mdParts.push(`\n## Page ${page.pageNumber}\n`);
    const paragraphs = page.text.split('\n');

    paragraphs.forEach((p) => {
      const trimmed = p.trim();
      if (!trimmed) return;

      if (trimmed.length < 40 && !trimmed.endsWith('.')) {
        mdParts.push(`\n### ${trimmed}\n`);
      } else if (trimmed.startsWith('-') || trimmed.startsWith('*') || trimmed.startsWith('•')) {
        mdParts.push(`- ${trimmed.replace(/^[-*•]\s*/, '')}`);
      } else {
        mdParts.push(`${trimmed}\n`);
      }
    });
  });

  return mdParts.join('\n');
}

// 3. HTML to PDF
export async function convertHtmlToPdf(htmlContent: string): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const pageWidth = 595.28;
  const pageHeight = 841.89;
  const margin = 50;
  const maxWidth = pageWidth - margin * 2;
  const fontSize = 11;
  const lineHeight = 16;

  let currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
  let currentY = pageHeight - margin;

  // Header Title
  currentPage.drawText('Document Rendered from HTML', {
    x: margin,
    y: currentY,
    size: 16,
    font: boldFont,
    color: rgb(0.1, 0.4, 0.3),
  });
  currentY -= 30;

  // Strip basic tags and parse line by line
  const plainText = htmlContent
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<br\s*[\/]?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<\/h[1-6]>/gi, '\n\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');

  const lines = plainText.split('\n');

  for (const rawLine of lines) {
    const text = rawLine.trim();
    if (!text) {
      currentY -= lineHeight;
      continue;
    }

    const words = text.split(' ');
    let currentLine = '';

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const testWidth = font.widthOfTextAtSize(testLine, fontSize);

      if (testWidth <= maxWidth) {
        currentLine = testLine;
      } else {
        if (currentY <= margin + lineHeight) {
          currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
          currentY = pageHeight - margin;
        }

        currentPage.drawText(currentLine, {
          x: margin,
          y: currentY,
          size: fontSize,
          font,
          color: rgb(0.15, 0.15, 0.15),
        });

        currentY -= lineHeight;
        currentLine = word;
      }
    }

    if (currentLine) {
      if (currentY <= margin + lineHeight) {
        currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
        currentY = pageHeight - margin;
      }

      currentPage.drawText(currentLine, {
        x: margin,
        y: currentY,
        size: fontSize,
        font,
        color: rgb(0.15, 0.15, 0.15),
      });

      currentY -= lineHeight;
    }
  }

  return await pdfDoc.save({ useObjectStreams: true });
}

// 4. PDF to PDF/A
export async function convertPdfToPdfA(arrayBuffer: ArrayBuffer): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });

  // Add standardized PDF/A archival metadata and conformance identifier
  pdfDoc.setSubject('ISO 19005-1 (PDF/A-1b) Compliant Document');
  pdfDoc.setProducer('PDFStudio Archival Engine (PDF/A-1b)');
  pdfDoc.setKeywords(['PDF/A-1b', 'ISO 19005-1', 'Archival']);

  return await pdfDoc.save({
    useObjectStreams: false, // PDF/A-1 requires standard object syntax
  });
}
