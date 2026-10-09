# PDFStudio - Professional All-in-One PDF Tools

PDFStudio is a complete, production-quality, platform-independent PDF tool suite built with Next.js (App Router), React, TypeScript, Tailwind CSS, pdf-lib, and PDF.js.

## Core Features & Tools

### 1. Organize PDF
- **Merge PDF**: Combine multiple PDF documents with custom ordering.
- **Split PDF**: Extract page intervals (e.g., `1-3, 5`) or separate all pages.
- **Organize PDF**: Visual page thumbnail grid with drag & drop reordering, rotation, and deletion.
- **Extract Pages**: Export chosen pages to a fresh PDF.
- **Rotate PDF**: Rotate pages 90°, 180°, or 270° clockwise/counterclockwise.
- **Delete Pages**: Remove selected pages permanently.
- **Reorder Pages**: Re-sequence document pages.

### 2. Optimize PDF
- **Compress PDF**: Object stream optimization, xref cleanup, and removal of unreferenced data with before/after byte statistics.
- **Repair PDF**: Reconstruct cross-reference tables and sanitize corrupted streams.
- **Flatten PDF**: Flatten interactive AcroForm fields and annotations into static document content.
- **Compare PDF**: Dual document upload with text-level difference comparison.

### 3. Convert PDF
- **PDF to Word**: Extract headings, paragraphs, and text into Microsoft Word `.docx`.
- **Word to PDF**: Convert `.docx` documents into clean PDF pages.
- **PDF to Excel**: Tabular data detection exported into Microsoft Excel `.xlsx`.
- **Excel to PDF**: Render `.xlsx` sheets into clean printable PDF tables.
- **PDF to PowerPoint**: Convert document pages into Microsoft PowerPoint `.pptx` slides.
- **PowerPoint to PDF**: Convert slide presentations into standard PDF.
- **PDF to JPG / PNG**: Render high-fidelity images with single-image or ZIP archive downloads.
- **JPG / PNG / Image to PDF**: Combine multiple photos into a PDF with A4/Letter sizing and custom margins.
- **HTML to PDF**: Convert HTML text or code directly into a PDF.
- **PDF to Text / Markdown**: Export plain text or structured Markdown.
- **PDF to PDF/A**: ISO 19005-1 (PDF/A-1b) archival standard export.

### 4. Edit PDF
- **Edit & Annotate**: Interactive canvas to mark up documents.
- **Watermark PDF**: Add text or image watermarks with custom rotation, opacity, font size, and coordinates.
- **Page Numbers**: Add customizable page numbers (`Page {n} of {total}`) in headers or footers.
- **Header & Footer**: Insert running headers and footers with custom alignments.
- **Crop PDF**: Trim page margins in points or millimeters.
- **Sign PDF**: Interactive signature pad (draw, type, or upload) placed onto pages.
- **PDF Forms**: Inspect and fill AcroForm inputs.

### 5. Security & Utilities
- **Protect PDF**: Standard password protection.
- **Unlock PDF**: Decrypt password-protected files.
- **Redact PDF**: Permanently black out sensitive areas.
- **Remove Metadata**: Scrub Title, Author, Subject, Creator, Producer, and Date headers.
- **View Metadata**: Inspect document properties, dimensions, and version information.
- **PDF Viewer**: In-browser PDF reader with zoom controls and page navigation.
- **PDF Page Counter**: Multi-file page count analysis.
- **File Size Checker**: Detailed byte inspection.

---

## Getting Started

### Prerequisites
- Node.js 18.x or 20.x
- npm, yarn, or pnpm

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build
```bash
npm run build
npm start
```

---

## Platform-Independent Deployment

This application is designed without proprietary hosting locks:

### 1. Docker Deployment
```bash
# Build the Docker image
docker build -t pdfstudio .

# Run the container
docker run -p 3000:3000 pdfstudio
```

### 2. Conventional Linux Server / VPS
```bash
npm install
npm run build
npm run start
```
Configure Nginx or Caddy as a reverse proxy to `http://127.0.0.1:3000`.

### 3. Vercel / Netlify
Standard Next.js App Router deployment:
- Framework preset: `Next.js`
- Build command: `npm run build`
- Output directory: `.next`

### 4. Cloudflare Pages / Workers
Deployable using `@cloudflare/next-on-pages` adapter.

---

## Security & Privacy Notice
All core PDF operations and document manipulation take place directly within the user's browser memory using compiled WebAssembly and pure JavaScript engines (`pdf-lib`, `pdfjs-dist`). Files are not transmitted to or stored on remote servers.
