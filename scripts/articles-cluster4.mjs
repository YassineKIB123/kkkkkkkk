// Cluster 4: Advanced Formatting, Extraction & Archival Engineering

export const cluster4Articles = [
  {
    slug: "convert-pdf-to-pdfa-archival-standard",
    title: "PDF/A-1b & PDF/A-2b Explained: A Practical Guide to Archival PDFs",
    seoTitle: "PDF/A-1b & PDF/A-2b Explained: Archival PDF Guide",
    description: "What PDF/A (ISO 19005) requires — embedded fonts, color output intents, no encryption or scripts — and how to create and validate a compliant archival file.",
    category: "archiving",
    tags: ["PDF/A", "Archiving", "ISO 19005", "Legal Compliance"],
    publishedAt: "2026-06-02",
    updatedAt: "2026-11-04",
    authorId: "yassine-k",
    toolCta: {
      toolId: "sanitize",
      title: "Prepare a PDF for Archiving",
      description: "Flatten form fields and clear old revisions and metadata in your browser before converting the file to PDF/A with a dedicated tool.",
      buttonText: "Open PDF Sanitizer",
      href: "/tools/sanitize-pdf",
      highlightText: "No uploads"
    },
    blocks: [
      {
        type: "paragraph",
        text: "It is easy to assume any PDF will open fine in 20 years. Ordinary PDFs, however, can depend on fonts that aren't embedded, external links, scripts, or device-dependent colors. PDF/A (ISO 19005) is a restricted version of PDF designed for long-term preservation: everything needed to display the document must be inside the file."
      },
      {
        type: "heading2",
        id: "understanding-pdfa-flavors",
        text: "Understanding the PDF/A Parts"
      },
      {
        type: "list",
        ordered: false,
        items: [
          "PDF/A-1 (ISO 19005-1, based on PDF 1.4): The original standard. Level 'b' (basic) requires reliable visual reproduction; level 'a' (accessible) additionally requires tagged structure and Unicode text mapping.",
          "PDF/A-2 (ISO 19005-2, based on PDF 1.7): Allows JPEG 2000 compression, transparency, layers, and embedding other PDF/A files.",
          "PDF/A-3 (ISO 19005-3): Like PDF/A-2 but allows embedding arbitrary files such as XML or CSV — used by e-invoicing formats like ZUGFeRD / Factur-X."
        ]
      },
      {
        type: "heading2",
        id: "mandatory-conversion-requirements",
        text: "Key Requirements Under ISO 19005"
      },
      {
        type: "paragraph",
        text: "To be valid PDF/A, a file must embed all fonts it uses, include an output intent with an ICC color profile (or use only device-independent colors), carry XMP metadata that declares the PDF/A part and conformance level, and avoid features that can't be preserved — JavaScript, audio/video, external content and encryption are not allowed."
      },
      {
        type: "heading3",
        id: "output-intent-inspection",
        text: "Anatomy of a PDF/A OutputIntent Dictionary"
      },
      {
        type: "code",
        title: "OutputIntent Dictionary for PDF/A-1b",
        language: "pdf",
        code: `% Output intent referencing an embedded sRGB ICC profile
12 0 obj
<<
  /Type /OutputIntent
  /S /GTS_PDFA1
  /OutputCondition (sRGB IEC61966-2.1)
  /OutputConditionIdentifier (sRGB IEC61966-2.1)
  /RegistryName (http://www.color.org)
  /Info (sRGB IEC61966-2.1)
  /DestOutputProfile 15 0 R
>>
endobj`
      },
      {
        type: "callout",
        variant: "info",
        title: "Who Requires PDF/A?",
        text: "Many archives, public administrations and some court e-filing systems require or recommend PDF/A for records that must be kept long-term. Requirements differ, so check the exact part and level (for example PDF/A-1b or PDF/A-2b) your recipient asks for."
      },
      {
        type: "callout",
        variant: "warning",
        title: "About the 'PDF/A' Option in iKnowAPDF's Converter",
        text: "The converter's archival option currently flattens form fields and re-saves the file; it does not embed fonts or color profiles or write PDF/A identification metadata, so its output should not be treated as validated PDF/A. Use a dedicated tool for real PDF/A output."
      },
      {
        type: "heading2",
        id: "how-to-create-pdfa",
        text: "How to Create a Valid PDF/A File"
      },
      {
        type: "step",
        number: 1,
        title: "Prepare the Document",
        text: "Flatten any form fields and remove old revisions and metadata with the [PDF Sanitizer](/tools/sanitize-pdf), so only the final content remains."
      },
      {
        type: "step",
        number: 2,
        title: "Export or Convert to PDF/A",
        text: "If you have the source document, export directly to PDF/A from Microsoft Word (Save as PDF → Options → 'PDF/A compliant') or LibreOffice (Export as PDF → 'Archive (PDF/A)'). For existing PDFs, tools such as Adobe Acrobat Pro or Ghostscript can convert them."
      },
      {
        type: "step",
        number: 3,
        title: "Validate the Result",
        text: "Check the file with the free, open-source veraPDF validator or Acrobat's Preflight. Only a passing validation report shows the file actually conforms."
      },
      {
        type: "toolCta",
        toolId: "sanitize"
      },
      {
        type: "faq",
        items: [
          {
            question: "Can an encrypted PDF be PDF/A compliant?",
            answer: "No. ISO 19005 doesn't allow encryption, so future readers are never locked out by a password or an obsolete cipher."
          },
          {
            question: "Why does PDF/A-1 not allow transparency?",
            answer: "PDF/A-1 is based on PDF 1.4 and prohibits transparency to keep rendering predictable, so transparent objects must be flattened. PDF/A-2 and later allow transparency."
          },
          {
            question: "How do I verify that a file is really PDF/A?",
            answer: "Validate it with veraPDF (free and open source) or Acrobat Preflight. A file that merely claims to be PDF/A in its metadata isn't necessarily compliant."
          },
          {
            question: "Does converting to PDF/A change the layout?",
            answer: "Normally the visible layout stays the same. Converters may substitute fonts that can't be embedded or flatten transparency, so compare the result with the original."
          }
        ]
      }
    ],
    relatedSlugs: [
      "flatten-interactive-pdf-form-fields",
      "merge-pdf-preserve-bookmarks-form-fields",
      "sanitize-pdf-metadata-redaction"
    ]
  },
  {
    slug: "client-side-ocr-scanned-pdf-text-extraction",
    title: "OCR for Scanned PDFs: How Text Recognition Works and How to Keep Documents Private",
    seoTitle: "OCR for Scanned PDFs: How It Works & Privacy Tips",
    description: "How OCR turns scanned pages into searchable text, how invisible text layers work in PDFs, and how to run OCR without exposing sensitive documents.",
    category: "archiving",
    tags: ["OCR", "Scanned PDF", "Tesseract", "Searchable PDF"],
    publishedAt: "2026-06-10",
    updatedAt: "2026-11-04",
    authorId: "yassine-k",
    toolCta: {
      toolId: "scan",
      title: "Scan Paper Documents to a Clean PDF",
      description: "Capture pages with your camera or upload photos, crop and straighten them, and apply a black-and-white filter that makes OCR and compression work better.",
      buttonText: "Open Document Scanner",
      href: "/tools/scan",
      highlightText: "Camera stays on your device"
    },
    blocks: [
      {
        type: "paragraph",
        text: "Optical Character Recognition (OCR) turns pictures of text — scans, phone photos, faxes — into real, searchable text. It is the backbone of paperless workflows. It also raises a privacy question: many online OCR services require you to upload tax returns, medical bills or bank letters to their servers. This guide explains how OCR works and how to pick an approach that fits how sensitive your documents are."
      },
      {
        type: "callout",
        variant: "info",
        title: "Does iKnowAPDF Do OCR?",
        text: "Not currently. iKnowAPDF's [document scanner](/tools/scan) creates clean image-based PDFs, and [PDF to Text](/pdf-to-text) extracts text from PDFs that already contain a text layer. For OCR itself, see the options below."
      },
      {
        type: "heading2",
        id: "how-in-browser-ocr-works",
        text: "How OCR Works"
      },
      {
        type: "paragraph",
        text: "An OCR engine such as the open-source Tesseract typically cleans up the image (deskewing and thresholding it to black and white), finds lines and words, then recognizes characters with a trained model. Tesseract has also been compiled to WebAssembly (tesseract.js), so OCR can run entirely inside a browser tab — slower than a native app, but without uploading the file."
      },
      {
        type: "heading3",
        id: "invisible-text-layer-code",
        text: "How Searchable PDFs Hide Text Behind the Image (Render Mode 3 Tr)"
      },
      {
        type: "code",
        title: "Invisible Text Layer in a Searchable PDF",
        language: "pdf",
        code: `% Invisible text placed behind the scanned page image
BT
  /F1 10 Tf
  3 Tr          % 3 Tr = neither fill nor stroke (invisible text)
  1 0 0 1 72 710 Tm
  (INVOICE #94821 - TOTAL AMOUNT DUE: $4,850.00) Tj
ET`
      },
      {
        type: "callout",
        variant: "tip",
        title: "Why the Scan Looks Unchanged",
        text: "A 'searchable PDF' keeps the original page image and adds the recognized text invisibly behind it. You see the real scan, but you can search, select and copy the words."
      },
      {
        type: "heading2",
        id: "private-ocr-options",
        text: "Private Ways to OCR Sensitive Documents"
      },
      {
        type: "list",
        ordered: false,
        items: [
          "Built into your devices: Recent versions of iOS, macOS (Live Text), Android and Windows (Snipping Tool's text actions) can recognize text in images on-device.",
          "Desktop software: OCRmyPDF (free, uses Tesseract) adds a searchable text layer to existing PDFs on your own computer; Adobe Acrobat and other desktop editors also include OCR.",
          "Cloud OCR: Often the most accurate on difficult scans, but it means uploading the document — read the provider's retention and training policies first."
        ]
      },
      {
        type: "heading2",
        id: "better-scans-better-ocr",
        text: "3 Steps to Get Better OCR Results"
      },
      {
        type: "step",
        number: 1,
        title: "Capture a Clean, Flat Scan",
        text: "Use the [document scanner](/tools/scan) to crop and straighten the page and apply the 'B&W Clean' filter. High contrast and straight lines matter more to OCR than raw resolution."
      },
      {
        type: "step",
        number: 2,
        title: "Run OCR with a Tool You Trust",
        text: "Use an on-device option from the list above for sensitive documents."
      },
      {
        type: "step",
        number: 3,
        title: "Extract or Compress the Result",
        text: "Once the PDF has a text layer, [PDF to Text](/pdf-to-text) or [PDF to Word](/pdf-to-word) can pull the text out, and [Compress PDF](/tools/compress-pdf) with 'Lossless / High Quality' shrinks it while keeping the text layer."
      },
      {
        type: "toolCta",
        toolId: "scan"
      },
      {
        type: "faq",
        items: [
          {
            question: "Is on-device OCR as accurate as cloud OCR?",
            answer: "For clean, printed documents, good on-device engines are usually accurate enough for search and copy-paste. Cloud services tend to do better on handwriting, low-quality photos and complex layouts. Always proofread numbers that matter."
          },
          {
            question: "Why can't I select text in my scanned PDF?",
            answer: "Because the page is just an image. It needs OCR to add a text layer. Our 'Recommended' and 'Extreme' compression presets also turn pages into images, so use 'Lossless / High Quality' if you need to keep an existing text layer."
          },
          {
            question: "Which languages can OCR handle?",
            answer: "It depends on the engine. Tesseract supports more than 100 languages through downloadable language data; built-in OS features support fewer."
          },
          {
            question: "Can I get the recognized text into Word?",
            answer: "Yes. Once the PDF has a text layer, convert it with [PDF to Word](/pdf-to-word) or extract plain text with [PDF to Text](/pdf-to-text)."
          }
        ]
      }
    ],
    relatedSlugs: [
      "convert-pdf-to-pdfa-archival-standard",
      "flatten-interactive-pdf-form-fields",
      "sanitize-pdf-metadata-redaction"
    ]
  },
  {
    slug: "merge-pdf-preserve-bookmarks-form-fields",
    title: "Merging PDFs Without Losing Bookmarks or Form Data: What to Know",
    seoTitle: "Merge PDFs Without Losing Bookmarks or Form Data",
    description: "Why bookmarks, links and fillable fields often break when PDFs are merged, and practical steps to combine documents without losing the parts you need.",
    category: "archiving",
    tags: ["Merge PDF", "Bookmarks", "AcroForm", "Combine PDF"],
    publishedAt: "2026-06-18",
    updatedAt: "2026-11-04",
    authorId: "yassine-k",
    toolCta: {
      toolId: "merge",
      title: "Merge PDF Files in Your Browser",
      description: "Combine documents in the order you choose without uploading them.",
      buttonText: "Open PDF Merger",
      href: "/tools/merge-pdf",
      highlightText: "No uploads"
    },
    blocks: [
      {
        type: "paragraph",
        text: "Combining PDFs sounds simple, yet merged files often come out with missing bookmarks, broken internal links, or form fields that behave strangely — for example, two documents that both have a field named 'ApplicantName' end up sharing one value. Here is why that happens and how to avoid it."
      },
      {
        type: "heading2",
        id: "the-mechanics-of-lossless-merging",
        text: "Three Things That Make Merging PDFs Hard"
      },
      {
        type: "list",
        ordered: false,
        items: [
          "Bookmarks (outlines): Each file's /Outlines tree points at its own pages. A merger has to copy those trees and re-point every entry at the new page objects — many tools simply drop them.",
          "Form fields: Fields live in a document-wide /AcroForm dictionary keyed by name. When two files use the same field names, merging them without renaming causes clashes.",
          "Internal links and named destinations: Links that jump to other pages must be re-mapped to the merged page order or they break."
        ]
      },
      {
        type: "heading3",
        id: "outlines-dictionary-inspection",
        text: "What a Re-Pointed Bookmark Looks Like"
      },
      {
        type: "code",
        title: "Bookmark Entry After Merging (ISO 32000-1 § 12.3.3)",
        language: "pdf",
        code: `% Bookmark whose destination now points at the merged page object
18 0 obj
<<
  /Title (Chapter 2: Financial Exhibits)
  /Parent 2 0 R
  /Next 19 0 R
  /Dest [ 35 0 R /XYZ 0 792 0 ]
>>
endobj`
      },
      {
        type: "callout",
        variant: "info",
        title: "What iKnowAPDF's Merger Keeps",
        text: "iKnowAPDF's [Merge PDF](/tools/merge-pdf) copies every page — text, images and page content — in the file order you choose. It does not currently rebuild bookmarks, and fillable fields may not stay interactive after merging. The steps below avoid both problems."
      },
      {
        type: "heading2",
        id: "merge-safely-steps",
        text: "How to Merge Without Losing What Matters"
      },
      {
        type: "step",
        number: 1,
        title: "Flatten Filled Forms First",
        text: "If a document contains filled-in form fields, flatten it with the [PDF Sanitizer](/tools/sanitize-pdf) so the entered values become part of the page and survive the merge."
      },
      {
        type: "step",
        number: 2,
        title: "Merge in the Right Order",
        text: "Add the files to [Merge PDF](/tools/merge-pdf), arrange them in order, and merge. Use [Split PDF](/tools/split-pdf) first if you only need some pages of a file, or [Rotate PDF](/tools/rotate-pdf) to fix sideways pages."
      },
      {
        type: "step",
        number: 3,
        title: "Add Bookmarks Afterwards if You Need Them",
        text: "If navigation matters (for court bundles or long reports), add bookmarks to the merged file in a desktop editor, or include a table-of-contents page."
      },
      {
        type: "toolCta",
        toolId: "merge"
      },
      {
        type: "faq",
        items: [
          {
            question: "Why do some merge tools drop bookmarks?",
            answer: "Copying outline trees and re-pointing every entry at new page objects takes extra work, so many simple mergers only copy pages."
          },
          {
            question: "Will merging keep digital signatures valid?",
            answer: "No. Certificate-based signatures cover the exact bytes of the original file, so any merge invalidates them. Merge first, then sign the final document."
          },
          {
            question: "Can I reorder pages from different documents?",
            answer: "The merger orders whole files. To interleave individual pages, split the files into the pieces you need with [Split PDF](/tools/split-pdf) first, then merge the pieces in order."
          },
          {
            question: "Is there a limit on how many PDFs I can merge?",
            answer: "There is no fixed limit and no upload, but everything happens in your browser's memory, so very large sets may be slow on low-memory devices. If the result is too big to send, run it through [Compress PDF](/tools/compress-pdf)."
          }
        ]
      }
    ],
    relatedSlugs: [
      "flatten-interactive-pdf-form-fields",
      "convert-pdf-to-pdfa-archival-standard",
      "sanitize-pdf-metadata-redaction"
    ]
  },
  {
    slug: "flatten-interactive-pdf-form-fields",
    title: "How to Flatten Interactive PDF Forms into Uneditable, Read-Only Records",
    seoTitle: "Flatten PDF Form Fields into Read-Only Records",
    description: "Why the read-only flag doesn't protect a filled PDF form, and how flattening turns form fields into ordinary page content that is much harder to change.",
    category: "archiving",
    tags: ["Flatten PDF", "AcroForm", "Read Only", "Form Fields", "Sanitize PDF"],
    publishedAt: "2026-06-25",
    updatedAt: "2026-11-04",
    authorId: "yassine-k",
    toolCta: {
      toolId: "sanitize",
      title: "Flatten PDF Form Fields Locally",
      description: "Bake filled-in form fields into the page content in your browser, and clear document metadata at the same time.",
      buttonText: "Flatten PDF Forms",
      href: "/tools/sanitize-pdf",
      highlightText: "No uploads"
    },
    blocks: [
      {
        type: "paragraph",
        text: "When you send a completed insurance claim, lease application, or tax form as an interactive PDF, the recipient can easily change your entries, clear checkboxes, or edit text. Marking fields 'read-only' doesn't really help, because anyone with a PDF editor can switch that flag off. Flattening is the usual answer."
      },
      {
        type: "heading2",
        id: "the-illusion-of-read-only",
        text: "Why the Read-Only Flag Isn't Protection"
      },
      {
        type: "paragraph",
        text: "In a PDF, form fields are widget annotations (/Widget) layered over the page. Setting a field to read-only just sets bit 1 of its field-flags value (/Ff), which tells viewers not to accept input. Any PDF editor can clear that bit and make the field editable again."
      },
      {
        type: "heading2",
        id: "how-true-flattening-locks-data",
        text: "What Flattening Does"
      },
      {
        type: "list",
        ordered: false,
        items: [
          "Draws each field's current appearance (its /AP stream) — the text, checkmark or signature you see — onto the page itself.",
          "Removes the interactive fields, so there is nothing left to type into or toggle.",
          "Keeps text as vector text rather than turning the page into a blurry image.",
          "Makes casual editing much harder. A flattened PDF can still be edited like any other PDF with an editor, so keep your own copy if you may need to prove what you sent."
        ]
      },
      {
        type: "heading3",
        id: "acroform-appearance-stream-code",
        text: "Before and After Flattening"
      },
      {
        type: "code",
        title: "Interactive Widget vs. Flattened Page Content",
        language: "pdf",
        code: `% Before flattening: an interactive widget annotation in /Annots
<<
  /Type /Annot
  /Subtype /Widget
  /FT /Tx
  /T (ApplicantFullName)
  /V (Sarah Jenkins)
  /AP << /N 24 0 R >>  % appearance drawn on top of the page
>>

% After flattening: the widget is gone and its appearance
% is drawn as part of the page content
BT
  /F1 12 Tf
  1 0 0 1 120 650 Tm
  (Sarah Jenkins) Tj
ET`
      },
      {
        type: "step",
        number: 1,
        title: "Open the Completed Form in the Sanitizer",
        text: "Drop your filled PDF into [Sanitize PDF](/tools/sanitize-pdf)."
      },
      {
        type: "step",
        number: 2,
        title: "Enable Form Flattening",
        text: "Turn on the option to flatten interactive form fields (it is switched on automatically when the file contains fields)."
      },
      {
        type: "step",
        number: 3,
        title: "Download and Check",
        text: "Open the result and confirm the fields can no longer be edited and all values look right. Then [merge](/tools/merge-pdf) it with other documents or [sign](/tools/sign-pdf) it if needed."
      },
      {
        type: "toolCta",
        toolId: "sanitize"
      },
      {
        type: "faq",
        items: [
          {
            question: "Can a flattened PDF be unflattened?",
            answer: "Not in the sense of getting the original fields back — the values become ordinary page content. Someone could still edit that content with a PDF editor, as with any PDF."
          },
          {
            question: "Does flattening reduce file size?",
            answer: "Sometimes slightly, because field dictionaries are removed. For real size reduction, use [Compress PDF](/tools/compress-pdf)."
          },
          {
            question: "Are signatures drawn into form fields kept?",
            answer: "Signature images and text that appear in fields are kept as part of the page. Certificate-based digital signatures, however, are invalidated by any change to the file, so flatten before applying one."
          },
          {
            question: "Will form calculations still run after flattening?",
            answer: "No. Calculated fields are frozen at the values shown when you flattened the form."
          }
        ]
      }
    ],
    relatedSlugs: [
      "merge-pdf-preserve-bookmarks-form-fields",
      "convert-pdf-to-pdfa-archival-standard",
      "sanitize-pdf-metadata-redaction"
    ]
  }
];
