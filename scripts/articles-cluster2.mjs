// Cluster 2: PDF Optimization, Compression & Web Delivery
export const cluster2Articles = [
  {
    slug: "pdf-compression-lossless-lossy-guide",
    title: "The Complete Guide to PDF Compression: Lossless vs. Lossy Browser Optimization",
    seoTitle: "PDF Compression Explained: Lossless vs Lossy",
    description: "What makes PDFs large, how lossless object-stream packing differs from page rasterization, and which iKnowAPDF compression preset fits which document.",
    category: "compression",
    tags: ["Compress PDF", "Lossless", "Lossy", "Optimization"],
    publishedAt: "2026-04-02",
    updatedAt: "2026-11-04",
    authorId: "yassine-k",
    toolCta: {
      toolId: "compress",
      title: "Compress a PDF with a Live Size Comparison",
      description: "Choose Recommended, Extreme, or Lossless / High Quality and compare before-and-after sizes. Processing happens on your device.",
      buttonText: "Open PDF Compressor",
      href: "/tools/compress-pdf",
      highlightText: "Runs in your browser"
    },
    blocks: [
      {
        type: "paragraph",
        text: "Whether you are emailing a report, uploading a portfolio, or archiving scanned invoices, PDF file size matters. Most people treat compression as a black box — upload, hope, download. Understanding what actually takes up space in a PDF, and what each compression method does to it, lets you pick the right trade-off between size and quality."
      },
      {
        type: "heading2",
        id: "what-makes-a-pdf-bloated",
        text: "What Actually Makes a PDF File So Large?"
      },
      {
        type: "paragraph",
        text: "A PDF is a container of numbered objects: fonts, vector paths, metadata packets, and embedded images (/Subtype /Image). When a 5-page PDF weighs 25 MB, the size usually comes from one of these sources:"
      },
      {
        type: "list",
        ordered: false,
        items: [
          "High-resolution scans and phone photos: Scanners and phone cameras often embed 300–600 DPI full-color images, far more detail than is needed to read a page on screen.",
          "Uncompressed object structure: Older PDF generators write every object header as plain text instead of packing them into compressed object streams (/Type /ObjStm, PDF 1.5+).",
          "Application metadata and thumbnails: Design tools can embed private editing data and preview images.",
          "Duplicate fonts: Merging several PDFs can leave multiple copies of the same font embedded.",
          "Incremental-save leftovers: Repeated edits can append new object versions without removing old ones (see [removing PDF revision history](/blog/remove-pdf-incremental-updates-revision-history))."
        ]
      },
      {
        type: "heading2",
        id: "lossless-vs-lossy-mechanics",
        text: "Lossless Object-Stream Packing vs. Page Rasterization"
      },
      {
        type: "paragraph",
        text: "The iKnowAPDF compressor (`compressPDFDocument` in our source) offers three presets. It is worth knowing exactly what each one does, because two of them change how your pages are stored:"
      },
      {
        type: "heading3",
        id: "three-compression-tiers-code",
        text: "What Each Preset Does"
      },
      {
        type: "code",
        title: "iKnowAPDF Compression Presets",
        language: "text",
        code: `1. Lossless / High Quality ("low"):
   - Clears document-level metadata (title, author, producer...)
   - Re-saves with compressed object streams (useObjectStreams: true)
   - Keeps original text, vectors and image bytes untouched
   - Returns the original file if this doesn't make it smaller

2. Recommended ("recommended"):
   - Renders every page to an image at 1.4x scale (about 100 DPI)
   - Encodes each page as a JPEG at quality 0.74
   - Text becomes part of the image (no longer selectable)

3. Extreme & size targets ("extreme" / targetKb):
   - Renders pages at 1.0x scale (about 72 DPI), JPEG quality 0.5
   - With a KB target: picks scale/quality from the per-page budget,
     and runs a second, tighter pass if the first result is too big`
      },
      {
        type: "callout",
        variant: "info",
        title: "The Compressor Never Returns a Bigger File",
        text: "For Recommended and Extreme, the tool compares the original, the losslessly re-saved version, and the rasterized version, and gives you the smallest of the three. If your PDF is already well optimized, you may get the original back."
      },
      {
        type: "comparisonTable",
        headers: ["Preset", "What Changes", "Best For", "Text Selectable Afterwards?"],
        rows: [
          ["Lossless / High Quality", "Metadata cleared, structure re-packed", "Text PDFs exported from Word, Google Docs, LaTeX", "Yes"],
          ["Recommended", "Pages re-rendered as ~100 DPI JPEGs", "Scans and photo-heavy documents", "No"],
          ["Extreme / KB targets", "Pages re-rendered at ~72 DPI or lower", "Strict upload limits (e.g. 100KB–500KB portals)", "No"]
        ]
      },
      {
        type: "paragraph",
        text: "How much smaller a file gets depends entirely on its content. Scans and photo-heavy PDFs often shrink dramatically with Recommended; text-only PDFs that are already compact may barely change with any preset."
      },
      {
        type: "heading2",
        id: "how-to-compress-safely",
        text: "How to Compress Your PDF in 3 Steps"
      },
      {
        type: "step",
        number: 1,
        title: "Drop Your PDF into the Compressor",
        text: "Open [Compress PDF](/tools/compress-pdf). Your file is loaded into browser memory, not uploaded."
      },
      {
        type: "step",
        number: 2,
        title: "Choose a Preset",
        text: "Pick 'Lossless / High Quality' for text documents you want to keep searchable, 'Recommended' for scans, or 'Extreme' for strict upload limits."
      },
      {
        type: "step",
        number: 3,
        title: "Compare & Download",
        text: "Review the before-and-after size, open the result to check legibility, and download it."
      },
      {
        type: "toolCta",
        toolId: "compress"
      },
      {
        type: "faq",
        items: [
          {
            question: "What happens if a PDF is already well compressed?",
            answer: "The compressor compares the original with each compressed candidate and returns the smallest, so the file will not get bigger. In that case you may simply get the original back."
          },
          {
            question: "When should I choose Lossless over Recommended?",
            answer: "If your PDF was exported from Word, Google Docs, or LaTeX and is mostly text, choose 'Lossless / High Quality'. It keeps text selectable and sharp. Recommended turns each page into an image, which suits scans better than text documents."
          },
          {
            question: "Can I target a specific limit like 100KB or 200KB?",
            answer: "Yes. Use the size-targeted pages such as [compress PDF under 100KB](/compress-pdf-under-100kb) or [under 200KB](/compress-pdf-under-200kb). They size each page to the budget and run a second, tighter pass if needed. Very long documents may still not fit a small target — splitting them helps."
          },
          {
            question: "Are my PDFs uploaded to a server during compression?",
            answer: "No. Rendering and re-saving happen inside your browser on your device."
          }
        ]
      }
    ],
    relatedSlugs: [
      "reduce-pdf-size-below-200kb",
      "linearize-pdf-fast-web-view-streaming",
      "compress-architectural-cad-drawings-pdf"
    ]
  },
  {
    slug: "reduce-pdf-size-below-200kb",
    title: "How to Reduce PDF File Size Below 200KB for Strict Portal Uploads",
    seoTitle: "Reduce PDF Size Below 200KB for Upload Portals",
    description: "Practical steps to get scanned IDs, transcripts and forms under 200KB or 100KB for visa, university and job portals while keeping them readable.",
    category: "compression",
    tags: ["200KB Limit", "Government Portal", "Compress PDF", "Passports"],
    publishedAt: "2026-04-10",
    updatedAt: "2026-11-04",
    authorId: "yassine-k",
    toolCta: {
      toolId: "compress",
      title: "Compress a PDF Under 200KB",
      description: "Open the under-200KB preset, which sizes each page to the budget and runs a second pass if needed — in your browser.",
      buttonText: "Compress Under 200KB",
      href: "/compress-pdf-under-200kb",
      highlightText: "200KB target preset"
    },
    blocks: [
      {
        type: "paragraph",
        text: "Immigration forms, civil service applications, university transcripts, and KYC checks often mean dealing with upload portals that cap each file at 100KB or 200KB. If your scanned passport or certificate is 204KB, the upload simply fails. This guide shows how to get under those limits without making the document unreadable."
      },
      {
        type: "heading2",
        id: "why-portals-have-strict-caps",
        text: "Why Do Some Portals Enforce 100KB–200KB Limits?"
      },
      {
        type: "paragraph",
        text: "Portals rarely explain their limits. Small caps keep storage and bandwidth costs down for systems that receive very large numbers of applications, and some older systems were simply built with small limits that were never revised. Whatever the reason, reviewers still need to read fine print, stamps, and the machine-readable zone on a passport, so the goal is the smallest file that stays legible."
      },
      {
        type: "callout",
        variant: "security",
        title: "Be Careful Where You Upload Identity Documents",
        text: "Passports, birth certificates, driver's licenses and tax forms are valuable to identity thieves. Prefer tools that process the file on your own device rather than uploading it to an unknown website."
      },
      {
        type: "heading2",
        id: "two-pass-adaptive-compression",
        text: "How the iKnowAPDF Size-Target Presets Work"
      },
      {
        type: "paragraph",
        text: "When you use [compress PDF under 200KB](/compress-pdf-under-200kb) or [compress PDF under 100KB](/compress-pdf-under-100kb), the compressor divides the target budget by the number of pages, picks a rendering scale and JPEG quality for that per-page budget, and, if the first pass is still too big, runs one tighter pass:"
      },
      {
        type: "code",
        title: "Size-Target Logic (simplified from src/lib/pdf/pdf-utils.ts)",
        language: "ts",
        code: `const targetBytesPerPage = (targetKb * 1024) / Math.max(1, numPages);
// Pass 1: choose scale & JPEG quality from the per-page budget
let rasterCompressedBytes = await renderCompressedPass(scale, quality);

// Pass 2: if still over the target, tighten based on the overshoot
if (targetKb && rasterCompressedBytes.length > targetKb * 1024) {
  const ratio = (targetKb * 1024) / rasterCompressedBytes.length;
  const tighterScale = Math.max(0.55, scale * Math.sqrt(ratio) * 0.92);
  const tighterQuality = Math.max(0.28, quality * ratio * 0.9);
  rasterCompressedBytes = await renderCompressedPass(tighterScale, tighterQuality);
}`
      },
      {
        type: "paragraph",
        text: "The scale and quality have lower bounds so pages don't become unreadable, which means a long document may still end up above the target. When that happens, split it into parts."
      },
      {
        type: "heading2",
        id: "step-by-step-200kb",
        text: "3 Steps to Get a PDF Under 200KB"
      },
      {
        type: "step",
        number: 1,
        title: "Open the Under-200KB Compressor",
        text: "Go to [compress PDF under 200KB](/compress-pdf-under-200kb); the 200KB target is already set. For other limits there are presets such as [under 100KB](/compress-pdf-under-100kb), [under 300KB](/compress-pdf-under-300kb) and [under 500KB](/compress-pdf-under-500kb)."
      },
      {
        type: "step",
        number: 2,
        title: "Drop Your Scanned ID, Transcript, or Form",
        text: "Run the compressor and check the result size and legibility before uploading."
      },
      {
        type: "step",
        number: 3,
        title: "Split Long Documents if Needed",
        text: "If a 25-page scan won't fit, use [Split PDF](/tools/split-pdf) to divide it into parts and compress each part separately, if the portal allows multiple files."
      },
      {
        type: "toolCta",
        toolId: "compress"
      },
      {
        type: "faq",
        items: [
          {
            question: "Will passport details and stamps still be readable under 200KB?",
            answer: "For 1–4 page documents there is usually enough budget per page to keep text and stamps readable, but results depend on the scan. Always open the compressed file and zoom in on small print before you submit."
          },
          {
            question: "What if my portal requires under 100KB?",
            answer: "Use [compress PDF under 100KB](/compress-pdf-under-100kb), or even [under 50KB](/compress-pdf-under-50kb) for very strict forms. Fewer pages make small targets much easier to hit."
          },
          {
            question: "Why is my phone photo of a document so large?",
            answer: "Phone cameras capture 12MP or more in full color. Scanning the page with the [document scanner](/tools/scan) and its 'B&W Clean' filter usually produces a cleaner image that compresses much smaller. If you start from a JPG, [JPG to PDF under 200KB](/jpg-to-pdf-under-200kb) handles conversion and size in one step."
          },
          {
            question: "Is there a daily limit on how many files I can compress?",
            answer: "No. Compression runs on your own device, and there is no daily cap on how many files you can process."
          }
        ]
      }
    ],
    relatedSlugs: [
      "pdf-compression-lossless-lossy-guide",
      "hipaa-compliant-pdf-processing-browser",
      "client-side-ocr-scanned-pdf-text-extraction"
    ]
  },
  {
    slug: "linearize-pdf-fast-web-view-streaming",
    title: "Linearized PDFs & Object Streams Explained: Optimizing Large PDFs for the Web",
    seoTitle: "Linearized PDFs, Object Streams & Fast Web View",
    description: "How PDF object streams, Fast Web View (linearization) and HTTP byte-range requests affect how quickly large PDFs open in the browser.",
    category: "compression",
    tags: ["Fast Web View", "Object Streams", "Web Optimization", "Streaming", "PDF Spec"],
    publishedAt: "2026-04-18",
    updatedAt: "2026-11-04",
    authorId: "yassine-k",
    toolCta: {
      toolId: "compress",
      title: "Shrink PDFs Before Putting Them Online",
      description: "Pack object streams, clear metadata, and reduce the download size of PDFs you host — in your browser.",
      buttonText: "Optimize PDF for Web",
      href: "/tools/compress-pdf",
      highlightText: "Smaller downloads"
    },
    blocks: [
      {
        type: "paragraph",
        text: "Have you ever clicked a link to a 60MB catalog or annual report and waited for the first page to appear? Slow PDF loading in the browser usually comes down to two things: the total download size, and whether the file and server allow the viewer to fetch just the parts it needs. This guide explains object streams, Fast Web View (linearization), and HTTP 206 byte-range requests."
      },
      {
        type: "heading2",
        id: "the-mechanics-of-linearization",
        text: "Why Traditional PDFs Load Slowly Over HTTP"
      },
      {
        type: "paragraph",
        text: "In a classic PDF, the cross-reference table that tells a reader where each object lives is at the end of the file, just before `%%EOF`. Unless the file is linearized and the server supports range requests, a browser viewer may need to download most or all of the file before showing page 1."
      },
      {
        type: "heading3",
        id: "object-streams-vs-linearization",
        text: "Object Streams (/ObjStm) vs. Annex F Linearization"
      },
      {
        type: "paragraph",
        text: "Two different techniques help here. **Object streams** (PDF 1.5+) pack many small objects into compressed streams, shrinking the file's structural overhead. **Linearization** (ISO 32000 Annex F, often called Fast Web View) reorders the file so page 1 and a hint table come first, letting a viewer show the first page early when the server supports **HTTP 206 Partial Content**:"
      },
      {
        type: "code",
        title: "Example NGINX Config for Serving PDFs",
        language: "nginx",
        code: `# Advertise byte-range support so viewers can request parts of the file
location ~* \\.pdf$ {
  add_header Accept-Ranges bytes;
  add_header Cache-Control "public, max-age=31536000, immutable";
  # PDF streams are already compressed; gzip gains little and can
  # interfere with range requests on some setups
  gzip off;
}`
      },
      {
        type: "callout",
        variant: "info",
        title: "iKnowAPDF Does Not Linearize Files",
        text: "Our compressor writes object streams and reduces size, but it does not produce linearized (Fast Web View) output. If you need true linearization, use a desktop tool such as qpdf (`qpdf --linearize in.pdf out.pdf`) after compressing."
      },
      {
        type: "heading2",
        id: "optimizing-web-pdfs-steps",
        text: "3 Steps to Make Large PDFs Open Faster Online"
      },
      {
        type: "step",
        number: 1,
        title: "Reduce the Download Size",
        text: "Run the file through [Compress PDF](/tools/compress-pdf). 'Lossless / High Quality' re-packs object streams and keeps text selectable; 'Recommended' shrinks scan-heavy files much more by converting pages to images."
      },
      {
        type: "step",
        number: 2,
        title: "Split Very Large Manuals into Chapters",
        text: "If you host a 200MB manual, use [Split PDF](/tools/split-pdf) to create chapter-level files so mobile readers download only what they need."
      },
      {
        type: "step",
        number: 3,
        title: "Serve with Byte-Range Support",
        text: "Host the file on a server or CDN that sends `Accept-Ranges: bytes` and a correct Content-Length, and linearize it with a desktop tool if first-page speed matters."
      },
      {
        type: "toolCta",
        toolId: "compress"
      },
      {
        type: "faq",
        items: [
          {
            question: "What does `useObjectStreams: true` do?",
            answer: "Instead of writing every object as a separate plain-text block (`12 0 obj ... endobj`), it packs objects into compressed /ObjStm streams and writes a compact cross-reference stream."
          },
          {
            question: "Why does total file size matter even with byte-range requests?",
            answer: "Many mobile browsers and in-app webviews download the whole PDF before rendering it. A smaller file opens faster everywhere."
          },
          {
            question: "Will compressing change how my PDF prints?",
            answer: "'Lossless / High Quality' keeps text and vectors unchanged, so print quality is unaffected. 'Recommended' and 'Extreme' turn pages into lower-resolution images, which is fine on screen but can look soft when printed."
          },
          {
            question: "Is there a file size limit?",
            answer: "We don't impose one, but everything runs in your browser's memory, so very large files can be slow or fail on devices with little RAM."
          }
        ]
      }
    ],
    relatedSlugs: [
      "pdf-compression-lossless-lossy-guide",
      "compress-architectural-cad-drawings-pdf",
      "reduce-pdf-size-below-200kb"
    ]
  },
  {
    slug: "compress-architectural-cad-drawings-pdf",
    title: "How to Fix Bloated Architectural and CAD Vector PDFs That Lag Your Viewer",
    seoTitle: "Fix Laggy CAD & Architectural PDFs",
    description: "Why PDFs exported from AutoCAD or Revit can freeze tablets and viewers, and when flattening drawings into images is a sensible fix.",
    category: "compression",
    tags: ["CAD PDF", "Architecture", "Vector Bloat", "Blueprints", "Performance"],
    publishedAt: "2026-04-26",
    updatedAt: "2026-11-04",
    authorId: "yassine-k",
    toolCta: {
      toolId: "compress",
      title: "Flatten Heavy CAD Drawings for Field Viewing",
      description: "Re-render dense vector sheets as images so they pan and zoom faster on tablets — or keep vectors with the lossless preset.",
      buttonText: "Optimize CAD PDF",
      href: "/tools/compress-pdf",
      highlightText: "Runs in your browser"
    },
    blocks: [
      {
        type: "paragraph",
        text: "Architects, engineers, and site supervisors know the problem: you open a 35MB plan set exported from AutoCAD, Revit, or Civil 3D on a tablet, zoom into a detail, and the screen stalls while the viewer redraws. Running the file through a lossless compressor barely changes it. Here is why CAD PDFs lag and what you can do about it."
      },
      {
        type: "heading2",
        id: "vector-bloat-vs-raster",
        text: "The Root Cause: Huge Numbers of Vector Paths"
      },
      {
        type: "paragraph",
        text: "When CAD software exports a detailed plan — hatch patterns, contours, insulation symbols, and SHX text exploded into strokes — it can write enormous numbers of individual path operators (`m` moveto, `l` lineto, `c` curveto, `S` stroke) into the page. Every pan or zoom forces the viewer to redraw all of them."
      },
      {
        type: "code",
        title: "Why Exploded CAD Hatching Is Slow to Render",
        language: "pdf",
        code: `% A dense hatch can turn into a very long run of tiny strokes:
0.12 w
412.40 288.15 m 412.55 288.30 l S
412.80 288.10 m 412.92 288.25 l S
... [repeated many thousands of times on one sheet] ...`
      },
      {
        type: "callout",
        variant: "tip",
        title: "Why Flattening Helps on Tablets",
        text: "Re-rendering a dense vector sheet as a single page image (the 'Recommended' preset) means the viewer draws one bitmap instead of re-processing every path, which typically makes panning and zooming much smoother. The trade-off is that you lose vector precision and selectable text."
      },
      {
        type: "heading2",
        id: "cad-optimization-strategy",
        text: "Choosing Between Lossless Packing and Flattened Field Sets"
      },
      {
        type: "list",
        ordered: false,
        items: [
          "For field review on tablets (use 'Recommended'): Flattens each sheet into an image that scrolls easily. Check that small dimensions are still readable at about 100 DPI.",
          "For vector submittals (use 'Lossless / High Quality'): Clears metadata and re-packs the file while keeping every vector line for measurement on desktop.",
          "For sending only a few sheets (use [Split PDF](/tools/split-pdf)): Extract the 5 relevant sheets instead of emailing the full 120-sheet set."
        ]
      },
      {
        type: "step",
        number: 1,
        title: "Load Your Drawing Set into the Compressor",
        text: "Drop your architectural or engineering PDF into [Compress PDF](/tools/compress-pdf)."
      },
      {
        type: "step",
        number: 2,
        title: "Pick 'Recommended' for Speed or 'Lossless' for Vectors",
        text: "'Recommended' flattens heavy sheets into images; 'Lossless / High Quality' keeps the vector paths."
      },
      {
        type: "step",
        number: 3,
        title: "Check & Distribute",
        text: "Open the result on the target device, zoom into fine details, and share it with the field team."
      },
      {
        type: "toolCta",
        toolId: "compress"
      },
      {
        type: "faq",
        items: [
          {
            question: "Does iKnowAPDF keep large sheet sizes like Arch D (24x36) and Arch E (36x48)?",
            answer: "Yes. The compressor reads each page's width and height in PDF points and creates the output page at the same size."
          },
          {
            question: "Why did AutoCAD create so many comments in my PDF?",
            answer: "Depending on settings, AutoCAD can export SHX text as comment annotations so it remains searchable. The `PDFSHX` system variable controls this behaviour — check your AutoCAD version's documentation before changing it."
          },
          {
            question: "Can I rotate sideways sheets before sending them?",
            answer: "Yes. Use [Rotate PDF](/tools/rotate-pdf) to rotate individual sheets by 90° or 180°."
          },
          {
            question: "Are confidential drawings uploaded anywhere?",
            answer: "No. Drawings are processed in your browser on your own device."
          }
        ]
      }
    ],
    relatedSlugs: [
      "pdf-compression-lossless-lossy-guide",
      "linearize-pdf-fast-web-view-streaming",
      "sanitize-pdf-metadata-redaction"
    ]
  }
];
