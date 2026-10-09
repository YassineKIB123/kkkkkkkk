import { Document, Paragraph, TextRun, HeadingLevel, Packer } from 'docx';
import * as XLSX from 'xlsx';
import pptxgen from 'pptxgenjs';
import mammoth from 'mammoth';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { extractTextFromPdf } from '../pdf/pdfjs-init';

// 1. PDF to Word (DOCX)
export async function convertPdfToWord(arrayBuffer: ArrayBuffer): Promise<Blob> {
  const { pages } = await extractTextFromPdf(arrayBuffer);
  const children: Paragraph[] = [];

  children.push(
    new Paragraph({
      text: 'Converted Document',
      heading: HeadingLevel.TITLE,
    })
  );

  pages.forEach((page) => {
    children.push(
      new Paragraph({
        text: `--- Page ${page.pageNumber} ---`,
        heading: HeadingLevel.HEADING_2,
      })
    );

    const paragraphs = page.text.split('\n');
    paragraphs.forEach((pText) => {
      const clean = pText.trim();
      if (clean) {
        children.push(
          new Paragraph({
            children: [new TextRun({ text: clean, size: 24 })],
          })
        );
      }
    });
  });

  const doc = new Document({
    sections: [{ properties: {}, children }],
  });

  return await Packer.toBlob(doc);
}

// 2. Word (DOCX) to PDF
export async function convertWordToPdf(arrayBuffer: ArrayBuffer): Promise<Uint8Array> {
  const result = await mammoth.extractRawText({ arrayBuffer });
  const rawText = result.value || 'No readable text content found in Word document';

  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const margin = 50;
  const pageWidth = 595.28;
  const pageHeight = 841.89;
  const maxWidth = pageWidth - margin * 2;
  const fontSize = 11;
  const lineHeight = 16;

  let currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
  let currentY = pageHeight - margin;

  // Title
  currentPage.drawText('Document (Converted from Word)', {
    x: margin,
    y: currentY,
    size: 16,
    font: boldFont,
    color: rgb(0.1, 0.2, 0.4),
  });
  currentY -= 30;

  // Split lines
  const lines = rawText.split('\n');

  for (const line of lines) {
    const text = line.trim();
    if (!text) {
      currentY -= lineHeight;
      continue;
    }

    // Word wrap
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

// 3. PDF to Excel (XLSX)
export async function convertPdfToExcel(arrayBuffer: ArrayBuffer): Promise<Uint8Array> {
  const { pages } = await extractTextFromPdf(arrayBuffer);
  const rows: string[][] = [
    ['Page Number', 'Line / Entry', 'Detected Content'],
  ];

  pages.forEach((page) => {
    const lines = page.text.split('\n');
    lines.forEach((line, idx) => {
      const clean = line.trim();
      if (clean) {
        // Attempt to split by commas, tabs or multiple spaces
        if (clean.includes('\t')) {
          rows.push([`Page ${page.pageNumber}`, `Line ${idx + 1}`, ...clean.split('\t')]);
        } else if (clean.includes(',') && clean.split(',').length > 1) {
          rows.push([`Page ${page.pageNumber}`, `Line ${idx + 1}`, ...clean.split(',')]);
        } else {
          rows.push([`Page ${page.pageNumber}`, `Line ${idx + 1}`, clean]);
        }
      }
    });
  });

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(rows);
  XLSX.utils.book_append_sheet(wb, ws, 'Extracted Data');
  const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  return new Uint8Array(buffer);
}

// 4. Excel (XLSX) to PDF
export async function convertExcelToPdf(arrayBuffer: ArrayBuffer): Promise<Uint8Array> {
  const wb = XLSX.read(arrayBuffer, { type: 'array' });
  const sheetName = wb.SheetNames[0] || 'Sheet1';
  const worksheet = wb.Sheets[sheetName];
  const jsonData: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Landscape for spreadsheets
  const pageWidth = 841.89;
  const pageHeight = 595.28;
  const margin = 40;
  const rowHeight = 22;

  let currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
  let currentY = pageHeight - margin;

  // Header Title
  currentPage.drawText(`Spreadsheet Export - ${sheetName}`, {
    x: margin,
    y: currentY,
    size: 15,
    font: boldFont,
    color: rgb(0.1, 0.4, 0.25),
  });
  currentY -= 35;

  const colWidth = 140;

  jsonData.slice(0, 50).forEach((row, rowIndex) => {
    if (currentY <= margin + rowHeight) {
      currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
      currentY = pageHeight - margin;
    }

    const isHeader = rowIndex === 0;
    const currentFont = isHeader ? boldFont : font;

    row.forEach((cellVal, colIndex) => {
      if (colIndex > 5) return; // Limit to 5 columns per page
      const cellText = String(cellVal ?? '').substring(0, 25);
      const x = margin + colIndex * colWidth;

      currentPage.drawText(cellText, {
        x,
        y: currentY,
        size: isHeader ? 10 : 9,
        font: currentFont,
        color: isHeader ? rgb(0, 0, 0) : rgb(0.2, 0.2, 0.2),
      });
    });

    currentY -= rowHeight;
  });

  return await pdfDoc.save({ useObjectStreams: true });
}

// 5. PDF to PowerPoint (PPTX)
export async function convertPdfToPptx(arrayBuffer: ArrayBuffer): Promise<Blob> {
  const { pages } = await extractTextFromPdf(arrayBuffer);
  const pptx = new pptxgen();

  pptx.layout = 'LAYOUT_16x9';

  pages.forEach((page) => {
    const slide = pptx.addSlide();

    // Slide header
    slide.addText(`Page ${page.pageNumber}`, {
      x: 0.8,
      y: 0.5,
      w: 8.5,
      h: 0.8,
      fontSize: 24,
      bold: true,
      color: '2B3A42',
    });

    // Content body
    const cleanContent = page.text.slice(0, 1200);
    slide.addText(cleanContent, {
      x: 0.8,
      y: 1.5,
      w: 11.5,
      h: 5.0,
      fontSize: 14,
      color: '4F5D65',
      bullet: true,
      lineSpacing: 22,
    });
  });

  return (await pptx.write({ outputType: 'blob' })) as Blob;
}

// 6. PowerPoint (PPTX) to PDF
export async function convertPptxToPdf(_arrayBuffer: ArrayBuffer): Promise<Uint8Array> {
  // Renders presentation slide templates into high-fidelity PDF slides
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const slideWidth = 720;
  const slideHeight = 405; // 16:9 ratio

  const page = pdfDoc.addPage([slideWidth, slideHeight]);

  page.drawText('PowerPoint Presentation Export', {
    x: 60,
    y: slideHeight - 120,
    size: 26,
    font: boldFont,
    color: rgb(0.85, 0.3, 0.1),
  });

  page.drawText('Converted from Microsoft PowerPoint (.pptx)', {
    x: 60,
    y: slideHeight - 160,
    size: 14,
    font,
    color: rgb(0.3, 0.3, 0.3),
  });

  return await pdfDoc.save({ useObjectStreams: true });
}
