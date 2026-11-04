// Cluster 1: Document Security, Privacy & Regulatory Compliance
export const cluster1Articles = [
  {
    slug: "sanitize-pdf-metadata-redaction",
    title: "How to Sanitize PDF Metadata and Hidden Layers Before Court or Public Release",
    seoTitle: "Sanitize PDF Metadata Before Court Filings",
    description: "Where hidden author names, XMP metadata, old revisions and form data live inside a PDF, and how to strip them in your browser before you publish or file.",
    category: "security",
    tags: ["Sanitize PDF", "Document Security", "Legal Tech", "Privacy", "Metadata"],
    publishedAt: "2026-03-05",
    updatedAt: "2026-11-04",
    authorId: "yassine-k",
    toolCta: {
      toolId: "sanitize",
      title: "Strip PDF Metadata & Rebuild the File Locally",
      description: "Clear the /Info fields, remove the document-level XMP stream, drop old incremental revisions and optionally flatten forms — processed in your browser.",
      buttonText: "Open PDF Sanitizer",
      href: "/tools/sanitize-pdf",
      highlightText: "No uploads"
    },
    blocks: [
      {
        type: "paragraph",
        text: "When publishing legal briefs, FOIA disclosures, investigative reports, or corporate filings, visual inspection is never enough. Sensitive data regularly leaks from PDFs because someone drew a black rectangle over confidential text, or because the file still carries hidden metadata and earlier drafts. In this guide we look at where hidden data lives inside the PDF format (ISO 32000) and how to clean a document in your browser before it leaves your hands."
      },
      {
        type: "heading2",
        id: "visual-overlays-vs-true-redaction",
        text: "The Fatal Mistake: Visual Black Boxes vs. Removing the Underlying Data"
      },
      {
        type: "paragraph",
        text: "Many people assume that placing a black rectangle over sensitive text makes it unreadable. However, a PDF page is built from separate layers and object dictionaries. When you draw a shape over text with a basic markup tool, the underlying characters remain intact in the page's /Contents stream. Anyone who opens the file can press Ctrl+A, copy the text, or run a command-line extraction utility to read everything underneath. Our guide to [true PDF redaction](/blog/permanent-pdf-redaction-vector-graphics) covers how to actually remove that text."
      },
      {
        type: "heading3",
        id: "raw-pdf-metadata-anatomy",
        text: "Inspecting Raw PDF Metadata Dictionaries"
      },
      {
        type: "paragraph",
        text: "Even when the visible text is clean, PDFs produced by Microsoft Word, macOS, Adobe InDesign, or office scanners usually embed a Document Information Dictionary (/Info) and often an XMP metadata packet (/Metadata). Inspect a typical file with a hex editor or `pdfinfo` and you will often find usernames and file names like these:"
      },
      {
        type: "code",
        title: "Example /Info Dictionary",
        language: "pdf",
        code: `12 0 obj
<<
  /Title (Settlement_Agreement_FINAL_v4_Redline.docx)
  /Author (j.miller@lawfirm-internal.local)
  /Creator (Microsoft® Word for Microsoft 365)
  /Producer (macOS Version 15.2 \(Build 24C101\) Quartz PDFContext)
  /CreationDate (D:20261014092211-04'00')
  /ModDate (D:20261024184502-04'00')
>>
endobj`
      },
      {
        type: "callout",
        variant: "warning",
        title: "Court E-Filing Risk",
        text: "Documents filed through court e-filing systems can become part of a public record. Unflattened annotations, live form fields, or leftover metadata in those files may reveal more than you intended. Check your court's own redaction rules and clean files before filing."
      },
      {
        type: "heading2",
        id: "where-metadata-hides",
        text: "5 Places Hidden Data Lives Inside a PDF"
      },
      {
        type: "list",
        ordered: false,
        items: [
          "Document Information Dictionary (/Info): Title, author, creator application, producer, and creation/modification dates.",
          "XMP Metadata Streams (/Metadata): XML packets that can persist even after you edit the basic document properties. They may contain author names, document IDs, and — in files built from photos — camera or location data.",
          "Incremental Save Sections (/Prev pointers): Appended sections at the end of the file that can preserve deleted paragraphs and earlier drafts. See [how to remove PDF revision history](/blog/remove-pdf-incremental-updates-revision-history).",
          "PieceInfo Dictionaries (/PieceInfo): Private working data from design tools such as Illustrator or Photoshop.",
          "Interactive Form Trees (/AcroForm): Field names, default values, and scripts that remain even after a form looks complete."
        ]
      },
      {
        type: "heading2",
        id: "step-by-step-sanitization",
        text: "3-Step Method to Sanitize a PDF in Your Browser"
      },
      {
        type: "step",
        number: 1,
        title: "Load the Document into the Sanitizer",
        text: "Drop your PDF into the [iKnowAPDF PDF Sanitizer](/tools/sanitize-pdf). The file is read by JavaScript in your browser tab and is not uploaded to a server."
      },
      {
        type: "step",
        number: 2,
        title: "Choose What to Remove",
        text: "Keep the options to clear the /Info fields and to strip XMP and rebuild the file enabled, and optionally turn on form flattening to bake fillable fields into the page."
      },
      {
        type: "step",
        number: 3,
        title: "Export a Clean Single-Revision PDF",
        text: "The tool copies the current pages into a new PDF, which leaves behind superseded objects and old revision sections, then downloads the result."
      },
      {
        type: "toolCta",
        toolId: "sanitize"
      },
      {
        type: "heading2",
        id: "sanitization-matrix",
        text: "Comparison of Document Sanitization Methods"
      },
      {
        type: "comparisonTable",
        headers: ["Sanitization Method", "Clears /Info & XMP?", "Removes Old Revisions?", "Keeps Text Selectable?", "Leaves Your Device?"],
        rows: [
          ["Black box drawn over text", "No", "No", "Yes (including the 'hidden' text)", "No"],
          ["Print to PDF", "Partly (adds its own producer info)", "Yes", "Often, but may rasterize", "No"],
          ["Cloud converter", "Usually", "Usually", "Depends on vendor", "Yes (uploaded to a server)"],
          ["iKnowAPDF Sanitizer (in-browser)", "Yes (document-level fields)", "Yes (pages copied into a new file)", "Yes", "No"]
        ]
      },
      {
        type: "faq",
        items: [
          {
            question: "Does sanitizing a PDF invalidate existing digital signatures?",
            answer: "Yes. Certificate-based (PKCS#7) signatures cover the exact bytes of the file. Removing metadata or rewriting the file changes those bytes, so sanitize first and sign last."
          },
          {
            question: "Why process confidential documents in the browser instead of a cloud service?",
            answer: "Uploading unredacted documents to a third-party service hands a copy to someone else's servers. Processing locally means the file never leaves your machine, which is easier to square with confidentiality obligations."
          },
          {
            question: "How can I check that metadata was removed?",
            answer: "Open the sanitized file in the sanitizer again, or run `pdfinfo sanitized_file.pdf` in a terminal. The author, title, subject, creator and keywords should be empty. Note that new creation/modification dates are written when the file is saved."
          },
          {
            question: "Does sanitizing remove EXIF data inside embedded photos?",
            answer: "No. The sanitizer works on document-level metadata. Images embedded in pages are copied as-is, so if a photo's own EXIF data matters, clean the image before putting it into the PDF."
          },
          {
            question: "Does stripping metadata affect searchable text?",
            answer: "No. Page content, fonts, and selectable text are copied unchanged. Bookmarks are not carried over when the file is rebuilt."
          }
        ]
      }
    ],
    relatedSlugs: [
      "permanent-pdf-redaction-vector-graphics",
      "remove-pdf-incremental-updates-revision-history",
      "hipaa-compliant-pdf-processing-browser"
    ]
  },
  {
    slug: "hipaa-compliant-pdf-processing-browser",
    title: "HIPAA and PDF Tools: Why Uploading Patient Records to Cloud Converters Is Risky",
    seoTitle: "HIPAA & Online PDF Tools: Cloud Upload Risks",
    description: "Why uploading patient records to free online PDF converters can create HIPAA problems, and how in-browser processing keeps files on the clinic's own computer.",
    category: "security",
    tags: ["HIPAA", "Healthcare", "Compliance", "ePHI", "Data Privacy"],
    publishedAt: "2026-03-12",
    updatedAt: "2026-11-04",
    authorId: "yassine-k",
    toolCta: {
      toolId: "compress",
      title: "Compress Medical PDFs Without Uploading Them",
      description: "Compress, merge, split, and clean PDFs in your browser so the file stays on the computer you are using.",
      buttonText: "Open PDF Compressor",
      href: "/tools/compress-pdf",
      highlightText: "Files stay on your device"
    },
    blocks: [
      {
        type: "paragraph",
        text: "Clinical staff, billing specialists, and healthcare administrators often need to merge lab results or shrink large scanned charts for insurance portals and referrals, and a quick web search leads to free online PDF converters. Uploading electronic Protected Health Information (ePHI) to a service that has not signed a Business Associate Agreement (BAA) with your organization can be an impermissible disclosure under HIPAA. This article explains the risk and how in-browser tools avoid sending files anywhere."
      },
      {
        type: "callout",
        variant: "info",
        title: "Not Legal Advice",
        text: "This article is general information, not legal or compliance advice. Your organization's privacy officer and policies decide which tools staff may use with patient data."
      },
      {
        type: "heading2",
        id: "the-hipaa-baa-trap",
        text: "The Business Associate Agreement (BAA) Question"
      },
      {
        type: "paragraph",
        text: "Under HIPAA (45 CFR § 164.502(e) and related provisions), a vendor that creates, receives, maintains, or transmits PHI on behalf of a covered entity is generally a business associate and needs a BAA — even if it says uploaded files are deleted after an hour or two. Many consumer PDF websites do not offer BAAs on free plans. Sending a patient's chart to such a service is the kind of disclosure HIPAA is designed to prevent."
      },
      {
        type: "heading3",
        id: "verifying-zero-egress-devtools",
        text: "How IT Teams Can Check That a Tool Does Not Upload Files"
      },
      {
        type: "paragraph",
        text: "In-browser tools read the file with JavaScript inside the browser tab. You do not have to take that on trust — you can watch the network activity yourself:"
      },
      {
        type: "code",
        title: "Checking for File Uploads in Browser DevTools",
        language: "text",
        code: `1. Open https://iknowapdf.lol/tools/compress-pdf
2. Press F12 -> open the "Network" tab
3. Drop a test PDF (not real patient data) and run the tool
4. Look for POST/PUT requests carrying the file: there should be none.
   (Page assets, ads and analytics requests may still appear.)`
      },
      {
        type: "callout",
        variant: "security",
        title: "Why Local Processing Matters",
        text: "iKnowAPDF's PDF tools process files in your browser, so the documents themselves are not sent to iKnowAPDF's servers. The website still loads normally (and may show ads and use analytics on the free plan), so follow your organization's policy on which websites staff may use."
      },
      {
        type: "heading2",
        id: "meeting-hipaa-safeguards",
        text: "How Local Processing Relates to HIPAA Technical Safeguards (§ 164.312)"
      },
      {
        type: "list",
        ordered: false,
        items: [
          "Access Control (§ 164.312(a)(1)): The file stays on the workstation of the signed-in staff member instead of a third-party server.",
          "Audit Controls (§ 164.312(b)): Your existing endpoint monitoring still sees the file being opened and saved locally.",
          "Integrity (§ 164.312(c)(1)): Merging and splitting copy pages without re-encoding them. Compression presets that rasterize pages reduce image quality, so check small print before sending.",
          "Transmission Security (§ 164.312(e)(1)): The document is not transmitted while it is being processed. How you send the finished file (email, portal) still needs to follow your usual safeguards."
        ]
      },
      {
        type: "heading2",
        id: "clinical-workflow",
        text: "A Simple 3-Step Workflow for Patient Records"
      },
      {
        type: "step",
        number: 1,
        title: "Combine Records Locally",
        text: "Use [Merge PDF](/tools/merge-pdf) to combine discharge summaries, reports, and consent forms into one packet in the order you choose."
      },
      {
        type: "step",
        number: 2,
        title: "Clean Workstation Metadata",
        text: "Run [Sanitize PDF](/tools/sanitize-pdf) to clear author names and other document-level metadata before the file leaves your organization."
      },
      {
        type: "step",
        number: 3,
        title: "Compress for Payer & Referral Portals",
        text: "Use [Compress PDF](/tools/compress-pdf) — or a size-targeted preset such as [compress PDF under 2MB](/compress-pdf-under-2mb) — to get large scanned packets under portal upload caps, then check that small values are still legible."
      },
      {
        type: "toolCta",
        toolId: "compress"
      },
      {
        type: "faq",
        items: [
          {
            question: "Do we need a Business Associate Agreement to use iKnowAPDF?",
            answer: "iKnowAPDF does not receive the documents you process — they are handled in your browser — and we do not sign BAAs. Whether a tool that never receives PHI is acceptable is a decision for your privacy officer."
          },
          {
            question: "Can staff use iKnowAPDF without an internet connection?",
            answer: "Partly. A service worker caches pages and scripts you have already loaded, so a previously opened tool may keep working offline, but this is not guaranteed for every tool or browser. Don't rely on it for air-gapped networks."
          },
          {
            question: "What happens to the file after the browser tab is closed?",
            answer: "The file is held in the tab's memory while you work. Closing or refreshing the tab releases it. The downloaded result is saved wherever your browser saves downloads."
          },
          {
            question: "Does compressing a medical PDF make small lab values harder to read?",
            answer: "It can. The Recommended and Extreme presets re-render each page as a JPEG image, which lowers sharpness and makes text non-selectable. For text-heavy reports, try Lossless / High Quality first and always check the output before sending."
          }
        ]
      }
    ],
    relatedSlugs: [
      "sanitize-pdf-metadata-redaction",
      "remove-pdf-incremental-updates-revision-history",
      "reduce-pdf-size-below-200kb"
    ]
  },
  {
    slug: "remove-pdf-incremental-updates-revision-history",
    title: "How to Remove Hidden Revision History and Incremental Updates from PDFs",
    seoTitle: "Remove PDF Revision History & Incremental Updates",
    description: "How PDF incremental saves can leave earlier drafts and deleted text inside the file, and how rewriting the file into a single revision removes them.",
    category: "security",
    tags: ["Revision History", "PDF Forensics", "Contract Security", "Sanitization", "XRef"],
    publishedAt: "2026-03-18",
    updatedAt: "2026-03-18",
    authorId: "yassine-k",
    toolCta: {
      toolId: "sanitize",
      title: "Remove Old Revisions from Your PDF",
      description: "Copy the current pages into a fresh single-revision PDF and leave superseded objects behind — in your browser.",
      buttonText: "Clean Document History",
      href: "/tools/sanitize-pdf",
      highlightText: "No uploads"
    },
    blocks: [
      {
        type: "paragraph",
        text: "When you delete a paragraph, change a pricing table, or crop part of a page in many PDF editors and press 'Save', the old data is not always erased. It can remain inside the file. This is caused by a feature of the PDF specification (ISO 32000-1) called incremental updates. Here is how incremental saves can expose earlier drafts and how to remove them."
      },
      {
        type: "heading2",
        id: "how-incremental-saves-work",
        text: "How Incremental Saving Leaves Old Versions in the File (ISO 32000 § 7.5.6)"
      },
      {
        type: "paragraph",
        text: "Rewriting a large PDF from scratch used to be slow, so the format allows incremental updates: instead of overwriting changed objects, the editor appends the new versions to the end of the file, writes an extra cross-reference (/XRef) section, and links it to the previous one with a /Prev byte offset. The old objects are still in the file — they are just no longer referenced by the newest section."
      },
      {
        type: "heading3",
        id: "inspecting-multiple-eof-markers",
        text: "How to Spot Incremental Saves Using %%EOF Markers"
      },
      {
        type: "paragraph",
        text: "Each incremental save usually adds another `%%EOF` marker. A file with three `%%EOF` markers may contain three versions, and an earlier version can often be recovered by truncating the file at an earlier marker:"
      },
      {
        type: "code",
        title: "Structure of an Incrementally Saved PDF",
        language: "pdf",
        code: `%PDF-1.7
1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj
... [Original Draft Objects: "$500,000 Acquisition Offer"] ...
xref
0 15
trailer << /Size 15 /Root 1 0 R >>
startxref
18420
%%EOF
... [Appended Revision 2 Objects: "$420,000 Revised Offer"] ...
xref
0 1
4 1
0000024110 00000 n
trailer << /Size 15 /Root 1 0 R /Prev 18420 >>
startxref
29850
%%EOF`
      },
      {
        type: "callout",
        variant: "warning",
        title: "Contract Negotiation Risk",
        text: "If you draft a proposal, delete internal pricing notes, and save incrementally before emailing the PDF, the recipient may be able to recover the deleted revision with freely available tools."
      },
      {
        type: "heading2",
        id: "the-rebuild-pipeline",
        text: "How Rewriting the File Removes Past Revisions"
      },
      {
        type: "step",
        number: 1,
        title: "Read Only the Current Pages",
        text: "Open your PDF in the [iKnowAPDF PDF Sanitizer](/tools/sanitize-pdf). The current page tree is read; superseded object versions are ignored."
      },
      {
        type: "step",
        number: 2,
        title: "Copy the Pages into a New PDF",
        text: "With 'strip XMP and rebuild' enabled, the current pages are copied into a brand-new PDF document in memory, leaving orphaned objects and /Prev sections behind."
      },
      {
        type: "step",
        number: 3,
        title: "Save a Single-Revision File",
        text: "The new file is written from scratch with one cross-reference section and one %%EOF marker, so earlier revisions are not carried over."
      },
      {
        type: "toolCta",
        toolId: "sanitize"
      },
      {
        type: "faq",
        items: [
          {
            question: "Does 'Save As' in a desktop PDF viewer always remove incremental updates?",
            answer: "Not always. Some desktop suites fully rewrite the file on 'Save As', but other apps append another update. Copying pages into a fresh document is a reliable way to get a single-revision file."
          },
          {
            question: "Can deleted text be recovered after the file is rewritten?",
            answer: "Not from old revisions — unreferenced objects and earlier sections are not copied into the new file. Text that is still on the current page (for example, under a black box) is of course still there; that needs [true redaction](/blog/permanent-pdf-redaction-vector-graphics)."
          },
          {
            question: "Why do cropped PDF pages sometimes still contain the cropped-out content?",
            answer: "Cropping usually only changes the visible /CropBox while the full page content stays in the file. To remove content, edit or white it out in the [PDF Editor](/tools/edit-pdf), which flattens the edited page into an image on export."
          },
          {
            question: "Does rewriting the file change its size?",
            answer: "Usually it gets smaller, because unused objects and old revisions are dropped. If you mainly want a smaller file, use [Compress PDF](/tools/compress-pdf)."
          }
        ]
      }
    ],
    relatedSlugs: [
      "sanitize-pdf-metadata-redaction",
      "permanent-pdf-redaction-vector-graphics",
      "flatten-interactive-pdf-form-fields"
    ]
  },
  {
    slug: "permanent-pdf-redaction-vector-graphics",
    title: "True PDF Redaction: How to Permanently Remove Text Behind Black Boxes",
    seoTitle: "Permanently Redact PDF Text: Real Redaction vs Boxes",
    description: "The difference between drawing a box over text and actually removing it from the PDF, plus a quick test to check whether a redaction worked.",
    category: "security",
    tags: ["Redaction", "PII Protection", "Privacy", "Security"],
    publishedAt: "2026-03-24",
    updatedAt: "2026-03-24",
    authorId: "yassine-k",
    toolCta: {
      toolId: "edit",
      title: "Edit, White Out & Flatten PDF Pages",
      description: "Delete text in place or cover areas with whiteout. Edited pages are exported as flattened images without the original text.",
      buttonText: "Open PDF Editor",
      href: "/tools/edit-pdf",
      highlightText: "Edited pages are flattened"
    },
    blocks: [
      {
        type: "paragraph",
        text: "Botched redaction is a common cause of accidental data leaks in law firms, public records offices, and financial institutions. When redaction is done with ordinary shape or highlight tools, anyone who receives the PDF can select the text under the black box, copy it, and paste the hidden names, numbers, or balances into a text editor."
      },
      {
        type: "heading2",
        id: "understanding-pdf-layers",
        text: "Why Black Rectangles Fail: Page Content vs. Annotations"
      },
      {
        type: "paragraph",
        text: "A PDF page keeps its main text in the /Contents stream and user markup in a separate /Annots array. Drawing a black box in a basic viewer usually adds a rectangle annotation on top of the text. The text-showing operators (`Tj` and `TJ`) underneath are untouched."
      },
      {
        type: "code",
        title: "Why the Text Survives Under an Annotation Box",
        language: "pdf",
        code: `% Page content stream (/Contents) - STILL SELECTABLE
BT
  /F1 11 Tf
  72 710 Td
  (Confidential SSN: 999-00-1234) Tj
ET

% Black rectangle annotation (/Annots) - only drawn on top
<< /Type /Annot /Subtype /Square /Rect [70 705 240 725] /IC [0 0 0] >>`
      },
      {
        type: "callout",
        variant: "tip",
        title: "The 5-Second Copy Test",
        text: "Before sending a redacted PDF, open the final file, press Ctrl+A (or Cmd+A), copy, and paste into a plain text editor. If the redacted words appear, the redaction failed."
      },
      {
        type: "heading2",
        id: "true-redaction-mechanics",
        text: "How the iKnowAPDF Editor Removes the Underlying Text"
      },
      {
        type: "paragraph",
        text: "When you edit a line of text or place a whiteout box in the [iKnowAPDF PDF Editor](/tools/edit-pdf), the edited page is re-drawn on a canvas at 2.5x scale with the original text hidden, and that page is replaced by a flattened image when you export. The exported page therefore contains no text operators for the words you removed. The trade-off: text on that page is no longer selectable or searchable."
      },
      {
        type: "step",
        number: 1,
        title: "Open the Document in the PDF Editor",
        text: "Load your PDF into the [PDF Editor](/tools/edit-pdf). Text lines on the page become editable."
      },
      {
        type: "step",
        number: 2,
        title: "Delete the Text or Apply Whiteout",
        text: "Click the sensitive line and delete it (or overwrite it with '[REDACTED]'), or use the Whiteout tool to cover any region."
      },
      {
        type: "step",
        number: 3,
        title: "Apply Changes, Then Clean Metadata",
        text: "Export the PDF, then run it through the [PDF Sanitizer](/tools/sanitize-pdf) to clear document-level metadata such as the title and author, and repeat the copy test."
      },
      {
        type: "toolCta",
        toolId: "edit"
      },
      {
        type: "faq",
        items: [
          {
            question: "Can someone copy text that I deleted in the iKnowAPDF Editor?",
            answer: "Not from the edited page: after you apply changes, that page is exported as a flattened image without the old text stream. Always run the copy test on the final file to confirm."
          },
          {
            question: "What if my PDF has 50 pages and I only redact page 3?",
            answer: "Untouched pages are copied as normal vector pages; only the pages you edited are flattened into images."
          },
          {
            question: "Should I also sanitize metadata after redacting?",
            answer: "Yes. The document title, author, or XMP metadata may still contain sensitive names. Running the [PDF Sanitizer](/tools/sanitize-pdf) clears those document-level fields."
          },
          {
            question: "Is my unredacted file uploaded to a server?",
            answer: "No. The PDF Editor and PDF Sanitizer process files in your browser."
          }
        ]
      }
    ],
    relatedSlugs: [
      "sanitize-pdf-metadata-redaction",
      "remove-pdf-incremental-updates-revision-history",
      "hipaa-compliant-pdf-processing-browser"
    ]
  }
];
