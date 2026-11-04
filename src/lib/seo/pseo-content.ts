/**
 * Page-specific, server-rendered content for indexed pSEO pages.
 *
 * Purpose: give every indexed variation real, distinct substance (page budget
 * maths, size-bracket advice, native OS methods) instead of a noun-swapped
 * template. Keep every statement honest: figures are presented as rough
 * guidance derived from the target size, never as measured benchmarks.
 */
import type { PseoLocale, PseoPageData } from "@/lib/pseo/pseo-data";
import { localSize } from "@/lib/pseo/pseo-data";
import { REQUIREMENT_PAGES } from "@/lib/pseo/requirements-data";
import { PDF_SIZE_SLUGS, IMAGE_SIZE_SLUGS, LOCALE_SIZE_SLUGS, sizeFromSlug, labelForSlug } from "@/lib/seo/site-index";

export interface ContentTable {
  headers: string[];
  rows: string[][];
  caption?: string;
}

export interface ContentSection {
  id: string;
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
  ordered?: string[];
  table?: ContentTable;
  links?: { href: string; label: string }[];
}

export interface PseoExtraContent {
  sections: ContentSection[];
  extraFaqs: { q: string; a: string }[];
}

type Bracket = "tiny" | "small" | "medium" | "large";

function bracketFor(kb: number): Bracket {
  if (kb <= 30) return "tiny";
  if (kb <= 300) return "small";
  if (kb <= 2048) return "medium";
  return "large";
}

function fmtPerPage(kb: number, locale: PseoLocale): string {
  if (kb < 1) return locale === "en" ? "< 1KB" : `< ${localSize(1, locale)}`;
  return localSize(kb >= 100 ? Math.round(kb) : Math.round(kb * 10) / 10, locale);
}

const BUDGET_PAGES = [1, 2, 5, 10, 20];

function fitsLabel(perPageKb: number, locale: PseoLocale): string {
  const L: Record<PseoLocale, string[]> = {
    en: [
      "Colour scans or photos at good quality",
      "Scanned pages at about 150 DPI",
      "Scanned pages at about 100 DPI, grayscale",
      "Text pages; scans only at very low resolution",
      "Plain text pages only",
    ],
    fr: [
      "Scans couleur ou photos de bonne qualité",
      "Pages scannées à environ 150 DPI",
      "Pages scannées à environ 100 DPI, en niveaux de gris",
      "Pages de texte ; scans uniquement en très basse résolution",
      "Pages de texte simple uniquement",
    ],
    es: [
      "Escaneos a color o fotos de buena calidad",
      "Páginas escaneadas a unos 150 DPI",
      "Páginas escaneadas a unos 100 DPI, en escala de grises",
      "Páginas de texto; escaneos solo a muy baja resolución",
      "Solo páginas de texto simple",
    ],
    ru: [
      "Цветные сканы или фото хорошего качества",
      "Сканы страниц примерно 150 DPI",
      "Сканы примерно 100 DPI в оттенках серого",
      "Текстовые страницы; сканы только в очень низком разрешении",
      "Только простые текстовые страницы",
    ],
    ar: [
      "مسح ضوئي ملون أو صور بجودة جيدة",
      "صفحات ممسوحة بدقة 150 DPI تقريباً",
      "صفحات ممسوحة بدقة 100 DPI تقريباً بالأبيض والأسود",
      "صفحات نصية؛ المسح الضوئي بدقة منخفضة جداً فقط",
      "صفحات نصية بسيطة فقط",
    ],
  };
  const idx = perPageKb >= 400 ? 0 : perPageKb >= 150 ? 1 : perPageKb >= 60 ? 2 : perPageKb >= 15 ? 3 : 4;
  return L[locale][idx];
}

function budgetTable(kb: number, locale: PseoLocale): ContentTable {
  const headers: Record<PseoLocale, string[]> = {
    en: ["Pages in the PDF", "Budget per page", "Rough guide to what fits"],
    fr: ["Pages du PDF", "Budget par page", "Ce qui tient, à titre indicatif"],
    es: ["Páginas del PDF", "Presupuesto por página", "Qué cabe, como referencia"],
    ru: ["Страниц в PDF", "Бюджет на страницу", "Что примерно помещается"],
    ar: ["عدد صفحات PDF", "الحجم المتاح لكل صفحة", "ما يناسب تقريباً"],
  };
  const caption: Record<PseoLocale, string> = {
    en: `Page budget for a ${localSize(kb, locale)} limit (limit ÷ number of pages). Actual results depend on the content of each page.`,
    fr: `Budget par page pour une limite de ${localSize(kb, locale)} (limite ÷ nombre de pages). Le résultat réel dépend du contenu de chaque page.`,
    es: `Presupuesto por página para un límite de ${localSize(kb, locale)} (límite ÷ número de páginas). El resultado real depende del contenido de cada página.`,
    ru: `Бюджет на страницу при лимите ${localSize(kb, locale)} (лимит ÷ число страниц). Реальный результат зависит от содержимого страниц.`,
    ar: `الحجم المتاح لكل صفحة عند حد ${localSize(kb, locale)} (الحد ÷ عدد الصفحات). تعتمد النتيجة الفعلية على محتوى كل صفحة.`,
  };
  return {
    headers: headers[locale],
    caption: caption[locale],
    rows: BUDGET_PAGES.map((n) => [String(n), fmtPerPage(kb / n, locale), fitsLabel(kb / n, locale)]),
  };
}

function sectionHeadings(locale: PseoLocale, size: string) {
  return {
    budget: {
      en: `How much fits in ${size}?`,
      fr: `Que peut contenir un PDF de ${size} ?`,
      es: `¿Cuánto cabe en ${size}?`,
      ru: `Что помещается в ${size}?`,
      ar: `ماذا يتسع في ${size}؟`,
    }[locale],
    realistic: {
      en: `Is ${size} realistic for your document?`,
      fr: `${size}, est-ce réaliste pour votre document ?`,
      es: `¿Es realista ${size} para tu documento?`,
      ru: `Реально ли уложиться в ${size}?`,
      ar: `هل حجم ${size} واقعي لمستندك؟`,
    }[locale],
  };
}

function realisticParagraphs(kb: number, locale: PseoLocale): string[] {
  const size = localSize(kb, locale);
  const b = bracketFor(kb);
  const scans = Math.max(1, Math.floor(kb / 75));
  if (locale === "en") {
    switch (b) {
      case "tiny":
        return [
          `${size} is a very tight limit. It is realistic for a one-page PDF that is mostly text, or for a single scanned page reduced to low resolution and grayscale.`,
          "Multi-page scans almost never fit. If the portal accepts several uploads, send pages separately; otherwise keep only the page that is actually required.",
        ];
      case "small":
        return [
          `${size} is a typical upload limit on application, exam and government portals. A handful of text pages fit easily, but scanned pages have to be reduced to roughly 100–150 DPI — and grayscale makes a big difference.`,
          `As a rough guide, plan for about ${scans} scanned page${scans > 1 ? "s" : ""} at low resolution within ${size}. Longer scanned documents usually need to be split or trimmed.`,
        ];
      case "medium":
        return [
          `${size} leaves room for dozens of text pages or several scanned pages at around 150 DPI. Job portals and online forms often use limits in this range.`,
          `If a scanned document is still too large, switching to grayscale and 150 DPI is usually enough to get under ${size} while keeping the text easy to read.`,
        ];
      default:
        return [
          `${size} is a generous limit, common for email attachments and larger upload systems. Most text documents are already below it; this target is mainly for long scans and photo-heavy PDFs.`,
          "Try a lossless clean-up first. Only use stronger image compression if the file is still above the limit, so photos and fine print stay sharp.",
        ];
    }
  }
  const small = b === "tiny" || b === "small";
  const T: Record<Exclude<PseoLocale, "en">, [string, string]> = {
    fr: small
      ? [
          `${size} est une limite courante sur les portails de candidature et d'administration. Quelques pages de texte passent facilement ; les pages scannées doivent être réduites à environ 100–150 DPI, idéalement en niveaux de gris.`,
          `À titre indicatif, comptez environ ${scans} page${scans > 1 ? "s" : ""} scannée${scans > 1 ? "s" : ""} en basse résolution dans ${size}. Au-delà, il faut généralement diviser le document.`,
        ]
      : [
          `${size} laisse de la place pour des dizaines de pages de texte ou plusieurs pages scannées à environ 150 DPI.`,
          `Si un document scanné reste trop lourd, passer en niveaux de gris et à 150 DPI suffit généralement pour descendre sous ${size}.`,
        ],
    es: small
      ? [
          `${size} es un límite habitual en portales de solicitudes y trámites. Unas cuantas páginas de texto caben sin problema; las páginas escaneadas deben reducirse a unos 100–150 DPI, mejor en escala de grises.`,
          `Como referencia, cuenta con unas ${scans} página${scans > 1 ? "s" : ""} escaneada${scans > 1 ? "s" : ""} en baja resolución dentro de ${size}. Si son más, normalmente hay que dividir el documento.`,
        ]
      : [
          `${size} deja espacio para decenas de páginas de texto o varias páginas escaneadas a unos 150 DPI.`,
          `Si un documento escaneado sigue siendo demasiado grande, pasarlo a escala de grises y 150 DPI suele bastar para bajar de ${size}.`,
        ],
    ru: small
      ? [
          `${size} — частый лимит на порталах для заявлений и госуслуг. Несколько текстовых страниц помещаются легко, а сканы нужно уменьшать примерно до 100–150 DPI, лучше в оттенках серого.`,
          `Ориентировочно в ${size} помещается около ${scans} скан. стр. в низком разрешении. Более длинные документы обычно приходится разделять.`,
        ]
      : [
          `${size} хватает на десятки текстовых страниц или несколько сканов примерно 150 DPI.`,
          `Если скан всё ещё слишком большой, обычно достаточно перевести его в оттенки серого и 150 DPI, чтобы уложиться в ${size}.`,
        ],
    ar: small
      ? [
          `يُعد ${size} حداً شائعاً في بوابات التقديم والمعاملات الحكومية. تتسع بضع صفحات نصية بسهولة، أما الصفحات الممسوحة ضوئياً فيجب خفضها إلى نحو 100–150 DPI، ويفضل بالأبيض والأسود.`,
          `كمرجع تقريبي، يتسع ${size} لنحو ${scans} صفحة ممسوحة بدقة منخفضة. أما المستندات الأطول فتحتاج عادة إلى التقسيم.`,
        ]
      : [
          `يتسع ${size} لعشرات الصفحات النصية أو عدة صفحات ممسوحة بدقة 150 DPI تقريباً.`,
          `إذا بقي المستند الممسوح كبيراً، فإن تحويله إلى الأبيض والأسود وبدقة 150 DPI يكفي عادة للوصول إلى أقل من ${size}.`,
        ],
  };
  return T[locale];
}

function troubleshootingEn(kb: number): string[] {
  const b = bracketFor(kb);
  const common = [
    "Remove pages that are not required (blank pages, instructions, duplicate copies).",
    "Convert colour scans to grayscale — it is often the single biggest saving.",
  ];
  switch (b) {
    case "tiny":
      return [
        "Keep the PDF to one page if you possibly can.",
        ...common,
        "Re-scan at a lower resolution (around 100 DPI) and crop away the margins before converting to PDF.",
        "If text is still needed at this size, a typed or exported PDF is far smaller than a photo of the page.",
      ];
    case "small":
      return [
        ...common,
        "Re-scan at 100–150 DPI instead of 300 DPI; phone photos are usually far larger than needed.",
        "Split a long document into parts if the portal allows more than one upload.",
        "Use the strongest preset only as a last resort and check that small print is still legible.",
      ];
    case "medium":
      return [
        ...common,
        "Re-scan at 150 DPI if the document was scanned at 300 DPI or higher.",
        "Replace full-page photos with cropped images where possible.",
      ];
    default:
      return [
        "Run the lossless clean-up first — it removes unused objects and metadata without touching image quality.",
        "If that is not enough, use the recommended preset, which re-compresses large images.",
        "For very long scans, split the document into two attachments.",
      ];
  }
}

function sizeFaqsEn(kb: number): { q: string; a: string }[] {
  const size = localSize(kb, "en");
  const per5 = fmtPerPage(kb / 5, "en");
  const per10 = fmtPerPage(kb / 10, "en");
  const b = bracketFor(kb);
  return [
    {
      q: `How many pages can a ${size} PDF have?`,
      a: `There is no fixed number — it depends on what is on the pages. Divide the limit by the page count: a 5-page file has about ${per5} per page and a 10-page file about ${per10}. Text pages need little space, so the scanned pages are what decide whether the file fits.`,
    },
    {
      q: `Will my document still be readable at ${size}?`,
      a:
        b === "tiny"
          ? "Plain text stays readable, but scans at this size become soft. Check small print and signatures before submitting, and keep the original."
          : b === "small"
            ? "Usually yes for typed text and clear scans at 100–150 DPI. Very small print or detailed photos may blur, so check the preview before you submit."
            : "Yes in most cases — at this size the tool rarely needs aggressive image compression.",
    },
    {
      q: `Why is my PDF still bigger than ${size} after compressing?`,
      a: "Either the pages are made of images that cannot shrink further without becoming unreadable, or there are too many pages for the limit. Try grayscale, re-scanning at a lower DPI, removing pages, or splitting the file.",
    },
  ];
}

function neighbourLinks(slug: string, list: readonly string[], hrefPrefix = "/"): { href: string; label: string }[] {
  const i = list.indexOf(slug);
  if (i < 0) return [];
  return [list[i - 1], list[i + 1]].filter(Boolean).map((s) => ({ href: `${hrefPrefix}${s}`, label: labelForSlug(s as string) }));
}

export function requirementLinksForSize(kb: number, kind: "pdf" | "image"): { href: string; label: string }[] {
  const tools = kind === "pdf" ? ["compress-pdf", "jpg-to-pdf"] : ["compress-image"];
  return REQUIREMENT_PAGES.filter((p) =>
    p.specs.some((s) => tools.includes(s.tool) && (s.maxKb === kb || s.targetKb === kb))
  ).map((p) => ({ href: `/${p.slug}`, label: p.h1 }));
}

// ---------------------------------------------------------------------------
// Image size pages
// ---------------------------------------------------------------------------

function dimsFor(kb: number, bitsPerPixelLow: number, bitsPerPixelHigh: number, aspectW: number, aspectH: number): string {
  const px = (bpp: number) => (kb * 1024 * 8) / bpp;
  const toDims = (pixels: number) => {
    const w = Math.sqrt((pixels * aspectW) / aspectH);
    const h = (w * aspectH) / aspectW;
    const r = (n: number) => Math.max(10, Math.round(n / 10) * 10);
    return `${r(w)} × ${r(h)} px`;
  };
  return `${toDims(px(bitsPerPixelHigh))} – ${toDims(px(bitsPerPixelLow))}`;
}

function imageContent(kb: number): PseoExtraContent {
  const size = localSize(kb, "en");
  return {
    sections: [
      {
        id: "pixel-guide",
        heading: `What pixel size fits in ${size}?`,
        paragraphs: [
          "File size depends on pixel dimensions and on how much detail the image has. These are rough starting points for a JPEG at medium quality — the tool finds the exact settings for you.",
        ],
        table: {
          headers: ["Type of image", `Approximate size that fits in ${size}`],
          rows: [
            ["Portrait photo (passport / ID style, 3:4)", dimsFor(kb, 1, 2, 3, 4)],
            ["Square photo (1:1)", dimsFor(kb, 1, 2, 1, 1)],
            ["Signature on a white background (3:1)", dimsFor(kb, 0.3, 0.8, 3, 1)],
          ],
          caption: "Estimates assume roughly 1–2 bits per pixel for photos and 0.3–0.8 for mostly-white signatures. Detailed images need more space.",
        },
      },
      {
        id: "quality",
        heading: "How the image is made smaller",
        paragraphs: [
          `The tool searches for the highest JPEG quality that still fits in ${size}. If the quality would have to drop too far, it reduces the pixel dimensions instead — unless you have set exact dimensions, which are always kept.`,
          "PNG files are lossless and usually much larger than a JPEG of the same picture, so the output is saved as JPG (or WebP if you choose it). Transparent areas are filled with white.",
        ],
      },
      {
        id: "uses",
        heading: `Where ${size} limits are common`,
        paragraphs: [
          "Online application forms, exam registrations and ID or visa portals often set a maximum (and sometimes a minimum) file size for photos and signatures, together with required pixel dimensions. Check the official instructions for both: a photo can be rejected for its dimensions even when the file size is right.",
        ],
      },
    ],
    extraFaqs: [
      {
        q: `What pixel size should a ${size} photo be?`,
        a: `For a typical portrait photo, roughly ${dimsFor(kb, 1, 2, 3, 4)} fits in ${size}. If the form specifies exact dimensions, resize to those first and then compress.`,
      },
      {
        q: "Is JPG or PNG better for a small file size?",
        a: "JPG. It is designed for photos and compresses far better than PNG. Use PNG only when a form explicitly requires it.",
      },
      {
        q: `Why was my photo rejected even though it is under ${size}?`,
        a: "Portals usually check more than the file size: pixel dimensions, a minimum file size, file format, and background or framing rules. Compare your file with every requirement in the official notice.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// Platform guides (native OS methods)
// ---------------------------------------------------------------------------

interface PlatformGuide {
  nativeHeading: string;
  nativeSteps: string[];
  limits: string[];
  browserHeading: string;
  browserReasons: string[];
  faqs: { q: string; a: string }[];
}

const PLATFORM_GUIDES: Record<string, PlatformGuide> = {
  "compress-pdf-on-mac": {
    nativeHeading: "The built-in way: Preview's “Reduce File Size” filter",
    nativeSteps: [
      "Open the PDF in Preview.",
      "Choose File › Export…",
      "In the Quartz Filter menu, pick “Reduce File Size”.",
      "Save under a new name so you keep the original.",
    ],
    limits: [
      "You cannot choose a target size — the filter applies one fixed setting.",
      "It can make scanned pages very blurry, and on some text-only PDFs the file even gets bigger.",
    ],
    browserHeading: "When the browser tool is the better choice on a Mac",
    browserReasons: [
      "You need to hit a specific limit such as 100KB, 200KB or 1MB.",
      "You want to compare presets (lossless, recommended, strongest) before downloading.",
      "It runs in Safari, Chrome or Firefox and the file stays on your Mac.",
    ],
    faqs: [
      { q: "Does Preview's Reduce File Size work well?", a: "It works for some image-heavy PDFs, but it has no size target and can over-compress scans or barely change text documents. Check the result before sending it." },
      { q: "Do I need to install anything on my Mac?", a: "No. Open this page in any browser, drop the PDF in and download the smaller copy." },
    ],
  },
  "compress-pdf-on-iphone": {
    nativeHeading: "The built-in way on iPhone: the Shortcuts app",
    nativeSteps: [
      "iOS has no “compress” button in the Files app.",
      "The Shortcuts app includes an “Optimize File Size of PDF” action you can add to a shortcut and run from the share sheet.",
    ],
    limits: [
      "Building a shortcut takes a few minutes and there is no target-size option.",
      "You cannot preview the quality before saving.",
    ],
    browserHeading: "The quicker way: compress in Safari",
    browserReasons: [
      "Open this page in Safari, tap the upload box and choose the PDF from Files.",
      "Pick a target size and download — the compressed copy is saved to Files.",
      "Nothing is uploaded; the PDF is processed on your iPhone.",
    ],
    faqs: [
      { q: "Can I compress a PDF on iPhone without an app?", a: "Yes. Use this page in Safari — no App Store download or account needed." },
      { q: "Where does the compressed PDF go on my iPhone?", a: "Safari saves downloads to the Downloads folder in the Files app by default." },
    ],
  },
  "edit-pdf-on-mac": {
    nativeHeading: "What Preview can and cannot do",
    nativeSteps: [
      "Open the PDF in Preview and click the Markup (pen) button.",
      "Use the Text tool to add a text box, or fill in form fields if the PDF has them.",
      "Use Sign to add a signature, and Shapes to cover or highlight areas.",
    ],
    limits: [
      "Preview cannot change text that is already in the PDF — it can only add new text on top.",
      "Covering text with a white box does not remove it; the original text can still be selected and copied.",
    ],
    browserHeading: "When you need to change existing text",
    browserReasons: [
      "The browser editor lets you click into existing text and change it in place.",
      "You can still add text, images and signatures, then download without a watermark.",
    ],
    faqs: [
      { q: "Can I edit existing text in a PDF with Preview?", a: "No. Preview adds annotations and text boxes on top of the page but does not edit the original text." },
      { q: "Is the edited PDF watermarked?", a: "No. The downloaded file has no watermark and no account is required." },
    ],
  },
  "edit-pdf-on-iphone": {
    nativeHeading: "Editing a PDF with Markup in the Files app",
    nativeSteps: [
      "Open the PDF in the Files app and tap the Markup (pen) icon.",
      "Tap + to add text, a signature, shapes or a magnifier.",
      "Tap Done to save the changes to the file.",
    ],
    limits: [
      "Markup adds content on top of the page; it cannot change text that is already there.",
      "Precise layout work is fiddly on a small screen.",
    ],
    browserHeading: "When the browser editor helps",
    browserReasons: [
      "You need to correct a typo or number in existing text.",
      "You want to edit on any device and download a clean PDF without installing an app.",
    ],
    faqs: [
      { q: "Can I change existing text in a PDF on iPhone?", a: "Not with Markup — it only adds annotations. Use the editor on this page in Safari to change existing text." },
      { q: "Does it work on iPad too?", a: "Yes, the editor works in Safari on iPad and iPhone." },
    ],
  },
  "sign-pdf-on-mac": {
    nativeHeading: "Signing with Preview on a Mac",
    nativeSteps: [
      "Open the PDF in Preview and click the Markup (pen) button.",
      "Click Sign and create a signature with the trackpad, the camera, or your iPhone.",
      "Choose the signature, then drag and resize it into place.",
    ],
    limits: [
      "This places an image of your handwritten signature; it is not a certificate-based digital signature.",
      "Your signature is stored in Preview on that Mac.",
    ],
    browserHeading: "When to use the browser tool instead",
    browserReasons: [
      "You are on a computer that is not yours and do not want to store a signature on it.",
      "You also want to add initials, dates or stamps and download without a watermark.",
    ],
    faqs: [
      { q: "Is a signature added in Preview legally valid?", a: "An image of a handwritten signature is accepted for many everyday documents, but some processes require a certificate-based digital signature. Check what the recipient requires." },
      { q: "Is my signature uploaded anywhere?", a: "No. The browser tool processes the PDF on your device." },
    ],
  },
  "sign-pdf-on-iphone": {
    nativeHeading: "Signing with Markup in the Files app",
    nativeSteps: [
      "Open the PDF in Files (or from a Mail attachment) and tap the Markup (pen) icon.",
      "Tap + and choose Add Signature.",
      "Draw your signature with your finger, tap Done, then move it into place.",
    ],
    limits: [
      "Drawing a neat signature with a finger is hard, and the result is an image, not a certificate-based signature.",
      "Placing dates and initials on several pages takes many taps.",
    ],
    browserHeading: "When the browser tool is easier",
    browserReasons: [
      "You want to type, draw or upload a signature and reuse it on several pages.",
      "You need initials or a date stamp and a watermark-free download.",
    ],
    faqs: [
      { q: "Can I sign a PDF on iPhone for free?", a: "Yes — with Markup in the Files app, or with the browser tool on this page. Neither needs an account." },
      { q: "Where is the signed PDF saved?", a: "Downloads from Safari go to the Downloads folder in Files by default." },
    ],
  },
  "scan-pdf-on-iphone": {
    nativeHeading: "The built-in document scanner on iPhone",
    nativeSteps: [
      "In the Notes app, open a note, tap the camera icon and choose Scan Documents.",
      "Or in the Files app, tap ⋯ (More) and choose Scan Documents to save straight to a folder.",
      "Hold the phone over the page; it captures automatically, then tap Save.",
    ],
    limits: [
      "Scans are often several megabytes per page — too large for many upload portals.",
      "There is no option to target a file size.",
    ],
    browserHeading: "When to use the browser scanner",
    browserReasons: [
      "You need the PDF under a specific size for a form upload.",
      "You want black-and-white cleanup and the file kept on your device, with no app or account.",
    ],
    faqs: [
      { q: "How do I scan a document to PDF on iPhone?", a: "Use Scan Documents in Notes or Files, or open this page in Safari and use the camera scanner here." },
      { q: "Why is my iPhone scan so large?", a: "Scans are saved at high resolution. Compress the PDF afterwards or scan in black and white to make it smaller." },
    ],
  },
  "scan-pdf-on-android": {
    nativeHeading: "Scanning with Google Drive on Android",
    nativeSteps: [
      "Open the Google Drive app and tap the Scan (camera) button.",
      "Capture the page, adjust the crop, and add more pages if needed.",
      "Tap Save; the scan is saved as a PDF in your Drive.",
    ],
    limits: [
      "The scan is stored in your Google Drive account, so it leaves your phone.",
      "You need to be signed in to a Google account, and there is no file-size target.",
    ],
    browserHeading: "When the browser scanner is the better fit",
    browserReasons: [
      "You do not want the document stored in the cloud.",
      "You need a small PDF for a portal upload, with black-and-white cleanup and no sign-in.",
    ],
    faqs: [
      { q: "Can I scan to PDF on Android without an app?", a: "Yes. Open this page in Chrome and use the camera scanner — the PDF is created on your phone." },
      { q: "Does Google Drive's scanner upload my document?", a: "Yes, Drive scans are saved to your Google Drive account. The browser scanner here keeps the file on your device." },
    ],
  },
};

function platformContent(slug: string): PseoExtraContent | null {
  const g = PLATFORM_GUIDES[slug];
  if (!g) return null;
  return {
    sections: [
      { id: "native", heading: g.nativeHeading, ordered: g.nativeSteps },
      { id: "limits", heading: "Limitations to know about", bullets: g.limits },
      { id: "browser", heading: g.browserHeading, bullets: g.browserReasons },
    ],
    extraFaqs: g.faqs,
  };
}

// ---------------------------------------------------------------------------
// Special one-off pages
// ---------------------------------------------------------------------------

const SPECIAL_CONTENT: Record<string, PseoExtraContent> = {
  "compress-pdf-lossless-quality": {
    sections: [
      {
        id: "lossless",
        heading: "What “without losing quality” actually means",
        paragraphs: [
          "There are two ways to make a PDF smaller. Lossless clean-up strips document metadata and repacks the file structure more compactly. Text, vector graphics and images are left exactly as they were, and text stays selectable.",
          "Stronger presets re-render each page as a compressed image. That saves far more space, but fine detail softens and text can no longer be selected or searched.",
        ],
      },
      {
        id: "expect",
        heading: "What to expect",
        bullets: [
          "Lossless clean-up helps most on files saved inefficiently by other software; on an already well-optimised PDF the saving can be small.",
          "Scanned documents are mostly images, so lossless clean-up saves little; use the recommended preset if you need a bigger reduction.",
          "If the lossless result is not smaller than your original, you simply get the original back.",
        ],
      },
    ],
    extraFaqs: [
      { q: "Can a PDF be compressed without any quality loss?", a: "Yes, with lossless clean-up — but the saving depends on how efficiently the original was saved. Large savings on scans require lossy image compression." },
      { q: "Which preset should I choose?", a: "Start with lossless. If the file is still too big, try the recommended preset and check the preview." },
    ],
  },
  "compress-pdf-for-email": {
    sections: [
      {
        id: "limits",
        heading: "Common attachment limits",
        bullets: [
          "Gmail: 25 MB per message for attachments.",
          "Outlook.com: 20 MB per message.",
          "Many company mail servers use 10–25 MB limits.",
        ],
        paragraphs: [
          "Email encodes attachments as text, which makes them roughly a third larger in transit. Aim comfortably below the limit — for a 25 MB limit, keep attachments under about 18 MB.",
        ],
      },
      {
        id: "tips",
        heading: "Getting a PDF under the limit",
        ordered: [
          "Try the lossless preset first — it can shrink a file without any visible change.",
          "For scans, use the recommended preset or a size target such as 5MB or 10MB.",
          "Still too big? Split the PDF and send it in two emails, or share it via a link.",
        ],
      },
    ],
    extraFaqs: [
      { q: "What is the maximum PDF size I can email?", a: "It depends on the provider: Gmail allows 25 MB and Outlook.com 20 MB per message. Leave headroom because attachments grow during sending." },
      { q: "Why does my email bounce even though the PDF is under 25 MB?", a: "Attachments are encoded during sending and grow by roughly a third, and the recipient's server may have a lower limit than yours." },
    ],
  },
  "edit-pdf-without-watermark": {
    sections: [
      {
        id: "what",
        heading: "What you can do — and download clean",
        bullets: [
          "Change existing text in place, or add new text boxes.",
          "Add images, signatures and shapes.",
          "Download the edited PDF with no watermark, no sign-up and no trial limit.",
        ],
        paragraphs: [
          "Many free editors add a watermark or ask you to create an account before downloading. Here the editing happens in your browser and the download is the finished file.",
        ],
      },
    ],
    extraFaqs: [
      { q: "Is there a page or file limit?", a: "There is no artificial limit; very large files depend on your device's memory." },
      { q: "Do I need an account?", a: "No. Open the editor, make your changes and download." },
    ],
  },
};

// ---------------------------------------------------------------------------
// Conversion pages: what the in-browser converter actually produces
// ---------------------------------------------------------------------------

function conversion(what: string[], know: string[], faqs: { q: string; a: string }[]): PseoExtraContent {
  return {
    sections: [
      { id: "result", heading: "What you get", bullets: what },
      { id: "limits", heading: "Good to know before converting", bullets: know },
    ],
    extraFaqs: faqs,
  };
}

const NO_OCR = "Scanned PDFs are pictures of text with no text layer, so there is nothing to extract — this converter does not do OCR.";

const CONVERSION_CONTENT: Record<string, PseoExtraContent> = {
  "pdf-to-word": conversion(
    ["An editable .docx file with the text of each page as paragraphs.", "Page breaks between the original pages, so text is easy to find."],
    ["Images, tables and the exact layout are not recreated — this is for getting the text into Word to edit it.", NO_OCR],
    [{ q: "Will the Word file look exactly like my PDF?", a: "No. You get the text as editable paragraphs; images and complex layouts are not rebuilt. To change a few words while keeping the layout, use the PDF editor instead." }]
  ),
  "word-to-pdf": conversion(
    [".docx headings, paragraphs, lists and basic formatting converted into a PDF.", "A file that opens the same way on every device."],
    ["Only .docx files (Word 2007 and later) are supported.", "Complex layouts — text boxes, multi-column pages, headers and footers — may not be reproduced exactly. Check the result before sending it."],
    [{ q: "Can I convert an old .doc file?", a: "Not directly. Open it in Word, Google Docs or LibreOffice, save it as .docx, then convert." }]
  ),
  "pdf-to-excel": conversion(
    ["An .xlsx workbook with one sheet per PDF page.", "Text grouped into rows and columns based on its position on the page."],
    ["Works best on PDFs with clearly aligned tables; merged or multi-line cells may need tidying in Excel.", NO_OCR],
    [{ q: "Will my table columns line up?", a: "For simple, well-aligned tables usually yes. Irregular layouts may put values in the wrong column, so review the sheet before using it." }]
  ),
  "excel-to-pdf": conversion(
    ["Each worksheet converted into PDF pages.", "A read-only copy you can share without exposing formulas."],
    ["Charts, images and some formatting (colours, conditional formatting) may not carry over.", "Very wide sheets are harder to fit on a page — hide columns you do not need first."],
    [{ q: "Are my formulas included?", a: "The PDF shows the values, not the formulas, which is usually what you want when sharing a spreadsheet." }]
  ),
  "pdf-to-powerpoint": conversion(
    ["A .pptx presentation with one slide per PDF page.", "Each slide shows the page as an image, so it looks like the original."],
    ["Slides are images: the text is not editable in PowerPoint.", "Good for presenting a PDF; not for rebuilding a deck."],
    [{ q: "Can I edit the text after converting?", a: "No — each slide is an image of the page. Add new text boxes on top in PowerPoint, or edit the PDF first." }]
  ),
  "powerpoint-to-pdf": conversion(
    ["A PDF with one page per slide containing the slide text."],
    ["Only the text of each slide is carried over; slide designs, images and animations are not reproduced.", "For a pixel-perfect PDF, export from PowerPoint or Google Slides (File › Download › PDF)."],
    [{ q: "Why do my slides look plain?", a: "This converter extracts the text of each slide in your browser. Designs and images are not rendered, so use PowerPoint's own export when the look matters." }]
  ),
  "jpg-to-pdf": conversion(
    ["One PDF with each image as a page, in the order you choose.", "Works with JPG, PNG and WebP photos."],
    ["Phone photos are large; if the PDF must be small, use a size target such as 100KB or 200KB.", "Crop photos to the document before converting for a cleaner result."],
    [{ q: "How many images can I combine?", a: "There is no fixed limit; very large batches depend on your device's memory." }]
  ),
  "png-to-pdf": conversion(
    ["One PDF with each PNG as a page, in the order you choose.", "Screenshots and graphics stay sharp."],
    ["PNG screenshots can make large PDFs; compress the result if you need a smaller file."],
    [{ q: "Is transparency kept?", a: "PDF pages have a white background, so transparent areas appear white." }]
  ),
  "pdf-to-jpg": conversion(
    ["Every page exported as a JPG image.", "Download pages one by one or all together as a ZIP."],
    ["JPG is smaller than PNG but slightly lossy — use PDF to PNG for crisp text or line art."],
    [{ q: "What resolution are the images?", a: "Pages are rendered at a high resolution suitable for viewing and sharing; choose PNG if you need lossless output." }]
  ),
  "pdf-to-png": conversion(
    ["Every page exported as a lossless PNG image.", "Download pages one by one or all together as a ZIP."],
    ["PNG files are larger than JPG; choose PDF to JPG if file size matters more than sharpness."],
    [{ q: "Why are PNG files so big?", a: "PNG is lossless, so it keeps every pixel. That is ideal for text and diagrams but larger than JPG for photos." }]
  ),
  "pdf-to-text": conversion(
    ["The plain text of every page, ready to copy or download as a .txt file."],
    ["Layout, images and fonts are dropped — only the words remain.", NO_OCR],
    [{ q: "Why is the output empty?", a: "The PDF is probably a scan (an image of text). Without OCR there is no text to extract." }]
  ),
  "text-to-pdf": conversion(
    ["A clean PDF from plain text or Markdown files.", "Non-Latin scripts such as Arabic or Cyrillic are supported."],
    ["Formatting is plain: use Word to PDF if you need headings, lists and styling."],
    [{ q: "Can I convert a .md file?", a: "Yes — Markdown files are accepted and converted as text." }]
  ),
};

function jpgToPdfContent(kb: number): PseoExtraContent {
  const size = localSize(kb, "en");
  return {
    sections: [
      {
        id: "budget",
        heading: `How many photos fit in a ${size} PDF?`,
        table: budgetTable(kb, "en"),
        paragraphs: [
          "Each image becomes a page, so the limit is shared between them. Phone photos are usually several megabytes each and have to be reduced a lot to fit.",
        ],
      },
      {
        id: "tips",
        heading: "Tips for staying under the limit",
        bullets: [
          "Crop each photo to the document itself before converting.",
          "Use fewer images — one clear photo per page is enough.",
          "If the PDF is still too large, compress it afterwards with a size target.",
        ],
      },
    ],
    extraFaqs: [
      { q: `Can I convert several photos into one PDF under ${size}?`, a: `Yes, as long as the combined budget allows it. With ${size}, two images have about ${fmtPerPage(kb / 2, "en")} each.` },
    ],
  };
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export function getPseoExtraContent(page: PseoPageData): PseoExtraContent {
  const { slug, locale } = page;
  const kb = page.targetKb ?? sizeFromSlug(slug);

  // PDF size pages
  if (page.toolType === "compress" && kb && slug.includes("-under-")) {
    const size = localSize(kb, locale);
    const h = sectionHeadings(locale, size);
    const sections: ContentSection[] = [
      { id: "budget", heading: h.budget, table: budgetTable(kb, locale) },
      { id: "realistic", heading: h.realistic, paragraphs: realisticParagraphs(kb, locale) },
    ];
    if (locale === "en") {
      sections.push({
        id: "how",
        heading: "What happens to your PDF",
        paragraphs: [
          `First the file is repacked and its metadata removed without touching the content. If that alone gets it under ${size}, you get that version and the text stays selectable.`,
          `If not, each page is re-rendered as a compressed image, with resolution and quality lowered step by step to fit ${size}. The pages look the same at normal zoom, but text can no longer be selected or searched — so keep your original file.`,
        ],
      });
      sections.push({ id: "troubleshooting", heading: `Still above ${size}? Try this`, bullets: troubleshootingEn(kb) });
      const reqLinks = requirementLinksForSize(kb, "pdf");
      const neighbours = neighbourLinks(slug, PDF_SIZE_SLUGS);
      if (reqLinks.length > 0) {
        sections.push({ id: "portals", heading: `Upload limits of ${size}`, links: reqLinks });
      }
      if (neighbours.length > 0) {
        sections.push({ id: "other-sizes", heading: "Need a different size?", links: neighbours });
      }
      return { sections, extraFaqs: sizeFaqsEn(kb) };
    }
    const neighbours = neighbourLinks(slug, LOCALE_SIZE_SLUGS, `/${locale}/`).map((l) => ({
      ...l,
      label: {
        fr: `Compresser un PDF à ${localSize(sizeFromSlug(l.href)!, locale)}`,
        es: `Comprimir PDF a ${localSize(sizeFromSlug(l.href)!, locale)}`,
        ru: `Сжать PDF до ${localSize(sizeFromSlug(l.href)!, locale)}`,
        ar: `ضغط PDF إلى ${localSize(sizeFromSlug(l.href)!, locale)}`,
        en: l.label,
      }[locale],
    }));
    if (neighbours.length > 0) {
      sections.push({
        id: "other-sizes",
        heading: { fr: "Autres tailles", es: "Otros tamaños", ru: "Другие размеры", ar: "أحجام أخرى", en: "Other sizes" }[locale],
        links: neighbours,
      });
    }
    return { sections, extraFaqs: [] };
  }

  if (locale !== "en") return { sections: [], extraFaqs: [] };

  if (page.toolType === "compress-image" && kb) {
    const c = imageContent(kb);
    const reqLinks = requirementLinksForSize(kb, "image");
    if (reqLinks.length > 0) c.sections.push({ id: "portals", heading: `Forms that use a ${localSize(kb, "en")} limit`, links: reqLinks });
    const neighbours = neighbourLinks(slug, IMAGE_SIZE_SLUGS);
    if (neighbours.length > 0) c.sections.push({ id: "other-sizes", heading: "Need a different size?", links: neighbours });
    return c;
  }

  if ((page.toolType === "jpg-to-pdf" || page.toolType === "png-to-pdf") && kb) {
    return jpgToPdfContent(kb);
  }

  return platformContent(slug) ?? SPECIAL_CONTENT[slug] ?? CONVERSION_CONTENT[slug] ?? { sections: [], extraFaqs: [] };
}
