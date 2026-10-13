import { PDFDocument, rgb, StandardFonts, PageSizes } from "pdf-lib";
import { downloadBlob } from "./pdf-utils";

declare global {
  interface Window {
    pdfjsLib?: any;
    XLSX?: any;
    mammoth?: any;
    docx?: any;
    PptxGenJS?: any;
  }
}

// Dynamic script loader for zero-configuration browser fallbacks
async function ensureLibrary(url: string, globalKey: string): Promise<any> {
  if (typeof window === "undefined") return null;
  if ((window as any)[globalKey]) return (window as any)[globalKey];

  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${url}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve((window as any)[globalKey]));
      existing.addEventListener("error", reject);
      return;
    }

    const script = document.createElement("script");
    script.src = url;
    script.async = true;
    script.onload = () => resolve((window as any)[globalKey]);
    script.onerror = reject;
    document.body.appendChild(script);
  });
}

// ==========================================
// 1. CONVERT TO PDF
// ==========================================

/**
 * Converts Plain Text or Markdown files into a cleanly paginated PDF document.
 */
export async function textToPDF(file: File): Promise<Uint8Array> {
  const text = await file.text();
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const fontSize = 10.5;
  const lineHeight = 15;
  const margin = 45;
  const pageWidth = PageSizes.A4[0]; // 595.28
  const pageHeight = PageSizes.A4[1]; // 841.89
  const maxLineWidth = pageWidth - margin * 2;

  // Split lines and handle word wrapping
  const rawLines = text.split(/\r?\n/);
  const wrappedLines: { text: string; isHeader: boolean }[] = [];

  for (const rawLine of rawLines) {
    if (rawLine.trim() === "") {
      wrappedLines.push({ text: "", isHeader: false });
      continue;
    }

    const isHeader = rawLine.startsWith("# ") || rawLine.startsWith("## ");
    const cleanLine = rawLine.replace(/^#+\s*/, "");
    const words = cleanLine.split(" ");
    let currentLine = "";

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const testWidth = font.widthOfTextAtSize(testLine, fontSize);

      if (testWidth <= maxLineWidth) {
        currentLine = testLine;
      } else {
        wrappedLines.push({ text: currentLine, isHeader });
        currentLine = word;
      }
    }
    if (currentLine) {
      wrappedLines.push({ text: currentLine, isHeader });
    }
  }

  // Draw lines onto A4 pages
  let currentPage = pdfDoc.addPage(PageSizes.A4);
  let y = pageHeight - margin;

  // Header Title
  currentPage.drawText(file.name.replace(/\.[^/.]+$/, ""), {
    x: margin,
    y,
    size: 16,
    font: boldFont,
    color: rgb(0.1, 0.1, 0.1),
  });
  y -= 28;

  for (const line of wrappedLines) {
    if (y < margin + lineHeight) {
      currentPage = pdfDoc.addPage(PageSizes.A4);
      y = pageHeight - margin;
    }

    if (line.text.trim() !== "") {
      currentPage.drawText(line.text, {
        x: margin,
        y,
        size: line.isHeader ? fontSize + 2 : fontSize,
        font: line.isHeader ? boldFont : font,
        color: rgb(0.15, 0.15, 0.15),
      });
    }

    y -= lineHeight;
  }

  return await pdfDoc.save();
}

/**
 * Converts Microsoft Word (.docx) documents to PDF in the browser using mammoth.
 */
export async function wordToPDF(file: File): Promise<Uint8Array> {
  let mammothLib = window.mammoth;
  if (!mammothLib) {
    try {
      mammothLib = await import("mammoth");
    } catch {
      mammothLib = await ensureLibrary(
        "https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js",
        "mammoth"
      );
    }
  }

  const arrayBuffer = await file.arrayBuffer();
  const { value: rawText } = await mammothLib.extractRawText({ arrayBuffer });

  // Wrap extracted text into PDF pages
  const textFile = new File([rawText], file.name.replace(/\.docx?$/i, ".txt"), {
    type: "text/plain",
  });
  return await textToPDF(textFile);
}

/**
 * Converts Microsoft Excel (.xlsx, .xls) files into formatted landscape PDF tables.
 */
export async function excelToPDF(file: File): Promise<Uint8Array> {
  let xlsxLib = window.XLSX;
  if (!xlsxLib) {
    try {
      xlsxLib = await import("xlsx");
    } catch {
      xlsxLib = await ensureLibrary(
        "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js",
        "XLSX"
      );
    }
  }

  const arrayBuffer = await file.arrayBuffer();
  const workbook = xlsxLib.read(arrayBuffer, { type: "array" });

  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Landscape A4 orientation
  const pageWidth = 841.89;
  const pageHeight = 595.28;
  const margin = 35;

  for (const sheetName of workbook.SheetNames) {
    const sheet = workbook.Sheets[sheetName];
    const data: any[][] = xlsxLib.utils.sheet_to_json(sheet, { header: 1 });
    if (!data || data.length === 0) continue;

    let page = pdfDoc.addPage([pageWidth, pageHeight]);
    let y = pageHeight - margin;

    // Sheet Name Title
    page.drawText(`Sheet: ${sheetName}`, {
      x: margin,
      y,
      size: 14,
      font: boldFont,
      color: rgb(0.1, 0.1, 0.1),
    });
    y -= 25;

    // Determine max columns
    const maxCols = Math.min(
      Math.max(...data.map((r) => (Array.isArray(r) ? r.length : 0))),
      8
    );
    if (maxCols === 0) continue;

    const colWidth = (pageWidth - margin * 2) / maxCols;
    const rowHeight = 18;

    for (let rIdx = 0; rIdx < data.length; rIdx++) {
      const row = data[rIdx];
      if (!row) continue;

      if (y < margin + rowHeight) {
        page = pdfDoc.addPage([pageWidth, pageHeight]);
        y = pageHeight - margin;
      }

      // Draw table row background
      if (rIdx === 0) {
        page.drawRectangle({
          x: margin,
          y: y - rowHeight + 12,
          width: pageWidth - margin * 2,
          height: rowHeight,
          color: rgb(0.9, 0.95, 0.92),
        });
      }

      for (let cIdx = 0; cIdx < maxCols; cIdx++) {
        const cellValue = row[cIdx] !== undefined ? String(row[cIdx]).slice(0, 22) : "";
        if (cellValue) {
          page.drawText(cellValue, {
            x: margin + cIdx * colWidth + 4,
            y: y - 2,
            size: 8.5,
            font: rIdx === 0 ? boldFont : font,
            color: rIdx === 0 ? rgb(0.05, 0.3, 0.15) : rgb(0.2, 0.2, 0.2),
          });
        }
      }

      y -= rowHeight;
    }
  }

  return await pdfDoc.save();
}

// ==========================================
// 2. CONVERT FROM PDF
// ==========================================

/**
 * Extracts raw textual content from all pages of a PDF document using PDF.js.
 */
export async function pdfToText(file: File): Promise<string> {
  const pdfjs =
    window.pdfjsLib ||
    (await ensureLibrary(
      "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js",
      "pdfjsLib"
    ));

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
  let fullText = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const strings = content.items.map((item: any) => item.str);
    fullText += `--- Page ${i} ---\n` + strings.join(" ") + "\n\n";
  }

  return fullText;
}

/**
 * Extracts text lines and converts a PDF into an editable Microsoft Word (.docx) document.
 */
export async function pdfToWord(file: File): Promise<Blob> {
  let docxLib = window.docx;
  if (!docxLib) {
    try {
      docxLib = await import("docx");
    } catch {
      docxLib = await ensureLibrary(
        "https://cdn.jsdelivr.net/npm/docx@8.5.0/build/index.umd.js",
        "docx"
      );
    }
  }

  const { Document, Packer, Paragraph, TextRun, HeadingLevel } = docxLib;
  const pdfjs =
    window.pdfjsLib ||
    (await ensureLibrary(
      "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js",
      "pdfjsLib"
    ));

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
  const docChildren: any[] = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();

    docChildren.push(
      new Paragraph({
        text: `Page ${i}`,
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 100 },
      })
    );

    // Group items into lines based on Y coordinates
    const items = content.items;
    let currentY: number | null = null;
    let lineBuffer: string[] = [];

    for (const item of items) {
      if (!item.str || item.str.trim() === "") continue;

      if (currentY !== null && Math.abs(item.transform[5] - currentY) > 6) {
        docChildren.push(
          new Paragraph({
            children: [new TextRun(lineBuffer.join(" "))],
            spacing: { after: 80 },
          })
        );
        lineBuffer = [];
      }

      lineBuffer.push(item.str);
      currentY = item.transform[5];
    }

    if (lineBuffer.length > 0) {
      docChildren.push(
        new Paragraph({
          children: [new TextRun(lineBuffer.join(" "))],
          spacing: { after: 120 },
        })
      );
    }
  }

  const doc = new Document({
    sections: [{ properties: {}, children: docChildren }],
  });

  return await Packer.toBlob(doc);
}

/**
 * Extracts tabulated text data from a PDF and converts it into a Microsoft Excel (.xlsx) file.
 */
export async function pdfToExcel(file: File): Promise<Blob> {
  let xlsxLib = window.XLSX;
  if (!xlsxLib) {
    try {
      xlsxLib = await import("xlsx");
    } catch {
      xlsxLib = await ensureLibrary(
        "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js",
        "XLSX"
      );
    }
  }

  const pdfjs =
    window.pdfjsLib ||
    (await ensureLibrary(
      "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js",
      "pdfjsLib"
    ));

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
  const workbook = xlsxLib.utils.book_new();

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const rows: string[][] = [];

    let currentY: number | null = null;
    let currentRow: string[] = [];

    for (const item of content.items) {
      if (!item.str) continue;

      if (currentY !== null && Math.abs(item.transform[5] - currentY) > 8) {
        if (currentRow.length > 0) rows.push(currentRow);
        currentRow = [];
      }

      currentRow.push(item.str.trim());
      currentY = item.transform[5];
    }
    if (currentRow.length > 0) rows.push(currentRow);

    const worksheet = xlsxLib.utils.aoa_to_sheet(rows.length > 0 ? rows : [["No tabular text detected"]]);
    xlsxLib.utils.book_append_sheet(workbook, worksheet, `Page ${i}`);
  }

  const excelBuffer = xlsxLib.write(workbook, { bookType: "xlsx", type: "array" });
  return new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
}

/**
 * Renders PDF pages into slide images and packages them into a PowerPoint (.pptx) presentation.
 */
export async function pdfToPowerPoint(file: File): Promise<Blob> {
  let PptxGen = window.PptxGenJS;
  if (!PptxGen) {
    try {
      PptxGen = (await import("pptxgenjs")).default;
    } catch {
      PptxGen = await ensureLibrary(
        "https://cdn.jsdelivr.net/npm/pptxgenjs@3.12.0/dist/pptxgen.bundle.js",
        "PptxGenJS"
      );
    }
  }

  const pdfjs =
    window.pdfjsLib ||
    (await ensureLibrary(
      "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js",
      "pdfjsLib"
    ));

  const pptx = new PptxGen();
  pptx.layout = "LAYOUT_WIDE"; // 16:9

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: 1.5 });

    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext("2d");

    if (ctx) {
      await page.render({ canvasContext: ctx, viewport }).promise;
      const dataUrl = canvas.toDataURL("image/png");

      const slide = pptx.addSlide();
      slide.addImage({
        data: dataUrl,
        x: 0.5,
        y: 0.3,
        w: 12.33,
        h: 6.9,
      });
    }
  }

  const out = await pptx.write({ outputType: "blob" });
  return out as Blob;
}