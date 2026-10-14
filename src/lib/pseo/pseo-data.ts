export type ToolType =
  | "compress"
  | "merge"
  | "split"
  | "rotate"
  | "sign"
  | "scan"
  | "pdf-to-word"
  | "word-to-pdf"
  | "pdf-to-excel"
  | "excel-to-pdf"
  | "pdf-to-powerpoint"
  | "powerpoint-to-pdf"
  | "jpg-to-pdf"
  | "pdf-to-jpg"
  | "png-to-pdf"
  | "pdf-to-png"
  | "pdf-to-text"
  | "text-to-pdf";

export type PseoLocale = "en" | "fr" | "es" | "ru" | "ar";

export interface PseoModifier {
  id: string;
  en: string;
  fr: string;
  es: string;
  ru: string;
  ar: string;
  category: "use-case" | "platform" | "size" | "quality";
}

export interface PseoPageData {
  slug: string;
  locale: PseoLocale;
  toolType: ToolType;
  title: string;
  h1: string;
  metaDescription: string;
  intro: string;
  benefits: string[];
  steps: { title: string; desc: string }[];
  faqs: { q: string; a: string }[];
  relatedSlugs: string[];
}

export const BASE_SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://pdftool.fenangplay.workers.dev";

// 18 Core Tool Definitions
export const CORE_TOOLS: {
  type: ToolType;
  baseSlug: string;
  names: Record<PseoLocale, string>;
  action: Record<PseoLocale, string>;
}[] = [
  {
    type: "compress",
    baseSlug: "compress-pdf",
    names: {
      en: "Compress PDF",
      fr: "Compresser PDF",
      es: "Comprimir PDF",
      ru: "Сжать PDF",
      ar: "ضغط PDF",
    },
    action: {
      en: "reduce PDF file size",
      fr: "réduire la taille du fichier PDF",
      es: "reducir el tamaño del archivo PDF",
      ru: "уменьшить размер файла PDF",
      ar: "تقليل حجم ملف PDF",
    },
  },
  {
    type: "merge",
    baseSlug: "merge-pdf",
    names: {
      en: "Merge PDF",
      fr: "Fusionner PDF",
      es: "Unir PDF",
      ru: "Объединить PDF",
      ar: "دمج PDF",
    },
    action: {
      en: "combine multiple PDF files",
      fr: "combiner plusieurs fichiers PDF",
      es: "combinar varios archivos PDF",
      ru: "объединить несколько файлов PDF",
      ar: "دمج عدة ملفات PDF",
    },
  },
  {
    type: "split",
    baseSlug: "split-pdf",
    names: {
      en: "Split PDF",
      fr: "Diviser PDF",
      es: "Dividir PDF",
      ru: "Разделить PDF",
      ar: "تقسيم PDF",
    },
    action: {
      en: "extract pages from PDF",
      fr: "extraire des pages d'un PDF",
      es: "extraer páginas de un PDF",
      ru: "извлечь страницы из PDF",
      ar: "استخراج صفحات من PDF",
    },
  },
  {
    type: "sign",
    baseSlug: "sign-pdf",
    names: {
      en: "Sign PDF",
      fr: "Signer PDF",
      es: "Firmar PDF",
      ru: "Подписать PDF",
      ar: "توقيع PDF",
    },
    action: {
      en: "add electronic signature to PDF",
      fr: "signer électroniquement un PDF",
      es: "firmar electrónicamente un PDF",
      ru: "электронно подписать PDF",
      ar: "إضافة توقيع إلكتروني إلى PDF",
    },
  },
  {
    type: "scan",
    baseSlug: "scan-pdf",
    names: {
      en: "Scan to PDF",
      fr: "Numériser en PDF",
      es: "Escanear a PDF",
      ru: "Сканировать в PDF",
      ar: "مسح إلى PDF",
    },
    action: {
      en: "scan camera documents to PDF",
      fr: "numériser des documents avec l'appareil photo en PDF",
      es: "escanear documentos con la cámara a PDF",
      ru: "сканировать документы с камеры в PDF",
      ar: "مسح المستندات بالكاميرا إلى PDF",
    },
  },
  {
    type: "rotate",
    baseSlug: "rotate-pdf",
    names: {
      en: "Rotate PDF",
      fr: "Pivoter PDF",
      es: "Rotar PDF",
      ru: "Повернуть PDF",
      ar: "تدوير PDF",
    },
    action: {
      en: "rotate PDF pages permanently",
      fr: "faire pivoter les pages PDF de façon permanente",
      es: "rotar páginas PDF permanentemente",
      ru: "навсегда повернуть страницы PDF",
      ar: "تدوير صفحات PDF بشكل دائم",
    },
  },
  {
    type: "pdf-to-word",
    baseSlug: "pdf-to-word",
    names: {
      en: "PDF to Word",
      fr: "PDF en Word",
      es: "PDF a Word",
      ru: "PDF в Word",
      ar: "تحويل PDF إلى Word",
    },
    action: {
      en: "convert PDF into editable Word DOCX",
      fr: "convertir un PDF en document Word DOCX modifiable",
      es: "convertir PDF a documento Word DOCX editable",
      ru: "конвертировать PDF в редактируемый Word DOCX",
      ar: "تحويل ملف PDF إلى مستند Word قابل للتعديل",
    },
  },
  {
    type: "word-to-pdf",
    baseSlug: "word-to-pdf",
    names: {
      en: "Word to PDF",
      fr: "Word en PDF",
      es: "Word a PDF",
      ru: "Word в PDF",
      ar: "تحويل Word إلى PDF",
    },
    action: {
      en: "convert Word DOCX documents to standard PDF",
      fr: "convertir des documents Word DOCX en PDF",
      es: "convertir documentos Word DOCX a PDF",
      ru: "конвертировать файлы Word DOCX в PDF",
      ar: "تحويل مستندات Word إلى صيغة PDF",
    },
  },
  {
    type: "pdf-to-excel",
    baseSlug: "pdf-to-excel",
    names: {
      en: "PDF to Excel",
      fr: "PDF en Excel",
      es: "PDF a Excel",
      ru: "PDF в Excel",
      ar: "تحويل PDF إلى Excel",
    },
    action: {
      en: "extract tables and data from PDF to Excel XLSX",
      fr: "extraire des tableaux et données PDF vers Excel XLSX",
      es: "extraer tablas y datos de PDF a Excel XLSX",
      ru: "извлечь таблицы и данные из PDF в Excel XLSX",
      ar: "استخراج الجداول والبيانات من PDF إلى Excel",
    },
  },
  {
    type: "excel-to-pdf",
    baseSlug: "excel-to-pdf",
    names: {
      en: "Excel to PDF",
      fr: "Excel en PDF",
      es: "Excel a PDF",
      ru: "Excel в PDF",
      ar: "تحويل Excel إلى PDF",
    },
    action: {
      en: "convert Excel spreadsheets to landscape PDF",
      fr: "convertir des feuilles de calcul Excel en PDF",
      es: "convertir hojas de cálculo Excel a PDF",
      ru: "конвертировать таблицы Excel в PDF",
      ar: "تحويل جداول بيانات Excel إلى مستند PDF",
    },
  },
  {
    type: "pdf-to-powerpoint",
    baseSlug: "pdf-to-powerpoint",
    names: {
      en: "PDF to PowerPoint",
      fr: "PDF en PowerPoint",
      es: "PDF a PowerPoint",
      ru: "PDF в PowerPoint",
      ar: "تحويل PDF إلى PowerPoint",
    },
    action: {
      en: "convert PDF pages into PowerPoint PPTX slides",
      fr: "convertir des pages PDF en diapositives PowerPoint",
      es: "convertir páginas PDF en diapositivas PowerPoint",
      ru: "конвертировать страницы PDF в слайды PowerPoint",
      ar: "تحويل صفحات PDF إلى شرائح PowerPoint",
    },
  },
  {
    type: "powerpoint-to-pdf",
    baseSlug: "powerpoint-to-pdf",
    names: {
      en: "PowerPoint to PDF",
      fr: "PowerPoint en PDF",
      es: "PowerPoint a PDF",
      ru: "PowerPoint в PDF",
      ar: "تحويل PowerPoint إلى PDF",
    },
    action: {
      en: "convert PowerPoint PPTX presentation to PDF",
      fr: "convertir des présentations PowerPoint en PDF",
      es: "convertir presentaciones PowerPoint a PDF",
      ru: "конвертировать презентации PowerPoint в PDF",
      ar: "تحويل عروض PowerPoint إلى مستندات PDF",
    },
  },
  {
    type: "jpg-to-pdf",
    baseSlug: "jpg-to-pdf",
    names: {
      en: "JPG to PDF",
      fr: "JPG en PDF",
      es: "JPG a PDF",
      ru: "JPG в PDF",
      ar: "تحويل JPG إلى PDF",
    },
    action: {
      en: "convert JPG photos into formatted PDF",
      fr: "convertir des photos JPG en PDF",
      es: "convertir fotos JPG en PDF",
      ru: "конвертировать фото JPG в PDF",
      ar: "تحويل صور JPG إلى مستند PDF",
    },
  },
  {
    type: "pdf-to-jpg",
    baseSlug: "pdf-to-jpg",
    names: {
      en: "PDF to JPG",
      fr: "PDF en JPG",
      es: "PDF a JPG",
      ru: "PDF в JPG",
      ar: "تحويل PDF إلى JPG",
    },
    action: {
      en: "export PDF pages to high-resolution JPG images",
      fr: "exporter les pages PDF en images JPG haute résolution",
      es: "exportar páginas PDF a imágenes JPG de alta resolución",
      ru: "экспортировать страницы PDF в качественные изображения JPG",
      ar: "تصدير صفحات PDF كصور JPG عالية الدقة",
    },
  },
  {
    type: "png-to-pdf",
    baseSlug: "png-to-pdf",
    names: {
      en: "PNG to PDF",
      fr: "PNG en PDF",
      es: "PNG a PDF",
      ru: "PNG в PDF",
      ar: "تحويل PNG إلى PDF",
    },
    action: {
      en: "combine PNG images into clean PDF documents",
      fr: "combiner des images PNG en PDF",
      es: "combinar imágenes PNG en documentos PDF",
      ru: "объединить изображения PNG в файлы PDF",
      ar: "دمج صور PNG في ملفات PDF",
    },
  },
  {
    type: "pdf-to-png",
    baseSlug: "pdf-to-png",
    names: {
      en: "PDF to PNG",
      fr: "PDF en PNG",
      es: "PDF a PNG",
      ru: "PDF в PNG",
      ar: "تحويل PDF إلى PNG",
    },
    action: {
      en: "render PDF pages to lossless PNG graphics",
      fr: "rendre des pages PDF en images PNG sans perte",
      es: "convertir páginas PDF a imágenes PNG sin pérdida",
      ru: "рендерить страницы PDF в графику PNG без потерь",
      ar: "تحويل صفحات PDF إلى صور PNG فائقة النقاء",
    },
  },
  {
    type: "pdf-to-text",
    baseSlug: "pdf-to-text",
    names: {
      en: "PDF to Text",
      fr: "PDF en Texte",
      es: "PDF a Texto",
      ru: "PDF в Текст",
      ar: "تحويل PDF إلى نص",
    },
    action: {
      en: "extract raw textual content from PDF files",
      fr: "extraire le texte brut de fichiers PDF",
      es: "extraer texto plano de archivos PDF",
      ru: "извлечь чистый текст из файлов PDF",
      ar: "استخراج النص الصافي من ملفات PDF",
    },
  },
  {
    type: "text-to-pdf",
    baseSlug: "text-to-pdf",
    names: {
      en: "Text to PDF",
      fr: "Texte en PDF",
      es: "Texto a PDF",
      ru: "Текст в PDF",
      ar: "تحويل النص إلى PDF",
    },
    action: {
      en: "convert plain text and notes into structured PDF",
      fr: "convertir du texte brut en document PDF structuré",
      es: "convertir texto sin formato en documento PDF",
      ru: "конвертировать простой текст в структурированный PDF",
      ar: "تحويل النصوص والملاحظات إلى مستند PDF منسق",
    },
  },
];

// 35+ Programmatic Intent Modifiers (High Search Volume)
export const MODIFIERS: PseoModifier[] = [
  {
    id: "for-resumes",
    en: "for Resumes and CVs",
    fr: "pour CV et Candidatures",
    es: "para Currículums y CV",
    ru: "для резюме",
    ar: "للسير الذاتية",
    category: "use-case",
  },
  {
    id: "for-email",
    en: "for Email Attachments",
    fr: "pour Pièces Jointes d'Email",
    es: "para Enviar por Correo Electrónico",
    ru: "для отправки по почте",
    ar: "لمرفقات البريد الإلكتروني",
    category: "size",
  },
  {
    id: "for-contracts",
    en: "for Legal Contracts & Agreements",
    fr: "pour Contrats et Accords Juridiques",
    es: "para Contratos y Acuerdos Legales",
    ru: "для юридических договоров",
    ar: "للعقود والاتفاقيات القانونية",
    category: "use-case",
  },
  {
    id: "for-invoices",
    en: "for Invoices & Billing",
    fr: "pour Factures et Comptabilité",
    es: "para Facturas y Cobros",
    ru: "для счетов и бухгалтерии",
    ar: "للفواتير والمستندات المالية",
    category: "use-case",
  },
  {
    id: "for-bank-statements",
    en: "for Bank Statements",
    fr: "pour Relevés Bancaires",
    es: "para Extractos Bancarios",
    ru: "для банковских выписок",
    ar: "لكشوفات الحساب البنكية",
    category: "use-case",
  },
  {
    id: "for-tax-forms",
    en: "for Tax Forms & Returns",
    fr: "pour Déclarations Fiscales",
    es: "para Formularios de Impuestos",
    ru: "для налоговых деклараций",
    ar: "للإقرارات والنماذج الضريبية",
    category: "use-case",
  },
  {
    id: "for-students",
    en: "for Students & Homework",
    fr: "pour Étudiants et Devoirs",
    es: "para Estudiantes y Tareas",
    ru: "для студентов и домашних заданий",
    ar: "للطلاب والواجبات المدرسية",
    category: "use-case",
  },
  {
    id: "for-teachers",
    en: "for Teachers & Classrooms",
    fr: "pour Enseignants et Cours",
    es: "para Profesores y Aulas",
    ru: "для учителей и уроков",
    ar: "للمعلمين والأنشطة التعليمية",
    category: "use-case",
  },
  {
    id: "for-lawyers",
    en: "for Lawyers & Court Submissions",
    fr: "pour Avocats et Dossiers Judiciaires",
    es: "para Abogados y Trámites Judiciales",
    ru: "для юристов и судебных дел",
    ar: "للمحامين والملفات القضائية",
    category: "use-case",
  },
  {
    id: "for-real-estate",
    en: "for Real Estate Agents & Deeds",
    fr: "pour l'Immobilier et Actes Notariés",
    es: "para Bienes Raíces y Escrituras",
    ru: "для недвижимости и сделок",
    ar: "للعقارات والمعاملات العقارية",
    category: "use-case",
  },
  {
    id: "for-accountants",
    en: "for Accountants & Financial Audits",
    fr: "pour Comptables et Audits Financiers",
    es: "para Contadores y Auditorías",
    ru: "для бухгалтеров и финансового аудита",
    ar: "للمحاسبين والتدقيق المالي",
    category: "use-case",
  },
  {
    id: "for-medical-records",
    en: "for Medical Records & Patients",
    fr: "pour Dossiers Médicaux et Patients",
    es: "para Historiales Médicos y Pacientes",
    ru: "для медицинских карт и анализов",
    ar: "للسجلات والتقارير الطبية",
    category: "use-case",
  },
  {
    id: "for-ebooks",
    en: "for Ebooks & Digital Books",
    fr: "pour Livres Numériques et Ebooks",
    es: "para Libros Electrónicos y Ebooks",
    ru: "для электронных книг",
    ar: "للكتب الإلكترونية والروايات",
    category: "use-case",
  },
  {
    id: "for-research-papers",
    en: "for Scientific Research Papers",
    fr: "pour Articles de Recherche Scientifique",
    es: "para Artículos de Investigación Científica",
    ru: "для научных статей и исследований",
    ar: "للأوراق البحثية والأكاديمية",
    category: "use-case",
  },
  {
    id: "for-passports-and-visas",
    en: "for Passport & Visa Applications",
    fr: "pour Demandes de Passeport et Visa",
    es: "para Solicitudes de Pasaporte y Visa",
    ru: "для подачи на визы и паспорта",
    ar: "لمعاملات الجوازات والتأشيرات",
    category: "use-case",
  },
  {
    id: "under-100kb",
    en: "to Under 100 KB",
    fr: "à Moins de 100 Ko",
    es: "a Menos de 100 KB",
    ru: "до 100 КБ",
    ar: "إلى أقل من 100 كيلوبايت",
    category: "size",
  },
  {
    id: "under-200kb",
    en: "to Under 200 KB",
    fr: "à Moins de 200 Ko",
    es: "a Menos de 200 KB",
    ru: "до 200 КБ",
    ar: "إلى أقل من 200 كيلوبايت",
    category: "size",
  },
  {
    id: "under-500kb",
    en: "to Under 500 KB",
    fr: "à Moins de 500 Ko",
    es: "a Menos de 500 KB",
    ru: "до 500 КБ",
    ar: "إلى أقل من 500 كيلوبايت",
    category: "size",
  },
  {
    id: "under-1mb",
    en: "to Under 1 MB",
    fr: "à Moins de 1 Mo",
    es: "a Menos de 1 MB",
    ru: "до 1 МБ",
    ar: "إلى أقل من 1 ميجابايت",
    category: "size",
  },
  {
    id: "under-2mb",
    en: "to Under 2 MB",
    fr: "à Moins de 2 Mo",
    es: "a Menos de 2 MB",
    ru: "до 2 МБ",
    ar: "إلى أقل من 2 ميجابايت",
    category: "size",
  },
  {
    id: "on-mac",
    en: "on Mac Without Software",
    fr: "sur Mac Sans Logiciel",
    es: "en Mac Sin Instalar Programas",
    ru: "на Mac без установки программ",
    ar: "على أجهزة Mac بدون برامج",
    category: "platform",
  },
  {
    id: "on-windows",
    en: "on Windows 10 & 11",
    fr: "sur Windows 10 et 11",
    es: "en Windows 10 y 11",
    ru: "на Windows 10 и 11",
    ar: "على أنظمة Windows 10 و 11",
    category: "platform",
  },
  {
    id: "on-iphone",
    en: "on iPhone & iPad Safari",
    fr: "sur iPhone et iPad Safari",
    es: "en iPhone y iPad Safari",
    ru: "на iPhone и iPad через Safari",
    ar: "على iPhone و iPad عبر Safari",
    category: "platform",
  },
  {
    id: "on-android",
    en: "on Android Mobile Phones",
    fr: "sur Téléphones Android",
    es: "en Teléfonos Android",
    ru: "на смартфонах Android",
    ar: "على هواتف وأجهزة Android",
    category: "platform",
  },
  {
    id: "on-chromebook",
    en: "on Chromebook & ChromeOS",
    fr: "sur Chromebook et ChromeOS",
    es: "en Chromebook y ChromeOS",
    ru: "на Chromebook и ChromeOS",
    ar: "على أجهزة Chromebook",
    category: "platform",
  },
  {
    id: "offline",
    en: "Offline in Browser",
    fr: "Hors Ligne dans le Navigateur",
    es: "Sin Conexión en el Navegador",
    ru: "офлайн прямо в браузере",
    ar: "بدون إنترنت داخل المتصفح",
    category: "platform",
  },
  {
    id: "without-uploading",
    en: "Without Uploading (100% Private)",
    fr: "Sans Téléversement (100% Privé)",
    es: "Sin Subir a Servidores (100% Privado)",
    ru: "без загрузки в облако (100% приватность)",
    ar: "بدون رفع الملفات (خصوصية 100%)",
    category: "quality",
  },
  {
    id: "without-watermark",
    en: "Without Watermark (Clean Output)",
    fr: "Sans Filigrane (Sortie Propre)",
    es: "Sin Marcas de Agua (Resultado Limpio)",
    ru: "без водяных знаков и логотипов",
    ar: "بدون علامة مائية نهائياً",
    category: "quality",
  },
  {
    id: "lossless-quality",
    en: "with Lossless Original Quality",
    fr: "avec Qualité Originale Sans Perte",
    es: "con Calidad Original Sin Pérdida",
    ru: "с сохранением исходного качества",
    ar: "بجودة أصلية وبدون فقدان للتفاصيل",
    category: "quality",
  },
  {
    id: "editable-text",
    en: "with Editable Formatting",
    fr: "avec Formatage Modifiable",
    es: "con Formato Editable",
    ru: "с возможностью редактирования текста",
    ar: "مع إمكانية تعديل النصوص وتنسيقها",
    category: "quality",
  },
  {
    id: "high-resolution-300dpi",
    en: "in High Resolution 300 DPI",
    fr: "en Haute Résolution 300 DPI",
    es: "en Alta Resolución 300 DPI",
    ru: "в высоком разрешении 300 DPI",
    ar: "بدقة فائقة 300 DPI للطباعة",
    category: "quality",
  },
  {
    id: "no-file-limit",
    en: "with No File Size Limits",
    fr: "sans Limite de Taille",
    es: "sin Límites de Tamaño",
    ru: "без ограничений по объёму файла",
    ar: "بدون حد أقصى لحجم الملفات",
    category: "quality",
  },
  {
    id: "for-job-applications",
    en: "for Online Job Portals",
    fr: "pour Portails d'Emploi en Ligne",
    es: "para Portales de Empleo",
    ru: "для сайтов вакансий",
    ar: "لبوابات التوظيف والتقديم",
    category: "use-case",
  },
  {
    id: "for-court-filings",
    en: "for Court E-Filing Standards",
    fr: "pour Dépôt Électronique au Tribunal",
    es: "para Presentación Judicial Electrónica",
    ru: "для электронной подачи в суд",
    ar: "للمعاملات والمحاكم الإلكترونية",
    category: "use-case",
  },
  {
    id: "for-scholarships",
    en: "for University Admissions & Grants",
    fr: "pour Bourses et Inscriptions Universitaires",
    es: "para Becas y Matrículas Universitarias",
    ru: "для грантов и поступления в вузы",
    ar: "للمنح والتسجيل الجامعي",
    category: "use-case",
  },
];

// Helper to generate slug strings
export function buildPseoSlug(baseSlug: string, modifierId?: string): string {
  if (!modifierId) return baseSlug;
  return `${baseSlug}-${modifierId}`;
}

// Generate the complete programmatic dataset
export function generateAllPseoPages(): PseoPageData[] {
  const pages: PseoPageData[] = [];
  const locales: PseoLocale[] = ["en", "fr", "es", "ru", "ar"];

  for (const locale of locales) {
    for (const tool of CORE_TOOLS) {
      // 1. Base Tool Page
      const baseSlug = tool.baseSlug;
      pages.push(buildPageRecord(tool, undefined, locale, baseSlug));

      // 2. Programmatic Modifier Pages
      for (const mod of MODIFIERS) {
        const slug = buildPseoSlug(tool.baseSlug, mod.id);
        pages.push(buildPageRecord(tool, mod, locale, slug));
      }
    }
  }

  return pages;
}

function buildPageRecord(
  tool: (typeof CORE_TOOLS)[0],
  mod: PseoModifier | undefined,
  locale: PseoLocale,
  slug: string
): PseoPageData {
  const toolName = tool.names[locale];
  const modLabel = mod ? ` ${mod[locale]}` : "";
  const actionText = tool.action[locale];

  let title = `${toolName}${modLabel} — Free & 100% Private | PDFStudio`;
  let h1 = `${toolName} ${modLabel}`.trim();
  let metaDescription = `Free online tool to ${actionText} ${mod ? mod[locale] : ""}. 100% private client-side processing directly in your browser. Files never leave your device.`;

  if (locale === "fr") {
    title = `${toolName} ${modLabel} — Gratuit & 100% Privé | PDFStudio`;
    metaDescription = `Outil en ligne gratuit pour ${actionText} ${mod ? mod[locale] : ""}. Traitement 100% local dans votre navigateur. Zéro fichier envoyé au serveur.`;
  } else if (locale === "es") {
    title = `${toolName} ${modLabel} — Gratis y 100% Privado | PDFStudio`;
    metaDescription = `Herramienta en línea gratuita para ${actionText} ${mod ? mod[locale] : ""}. Procesamiento 100% local en tu navegador con total privacidad.`;
  } else if (locale === "ru") {
    title = `${toolName} ${modLabel} — Бесплатно и приватно | PDFStudio`;
    metaDescription = `Бесплатный онлайн инструмент, чтобы ${actionText} ${mod ? mod[locale] : ""}. 100% локальная обработка в браузере без серверов.`;
  } else if (locale === "ar") {
    title = `${toolName} ${modLabel} — مجاني وخاص 100% | PDFStudio`;
    metaDescription = `أداة مجانية للقيام بـ ${actionText} ${mod ? mod[locale] : ""}. معالجة آمنة محلياً 100% داخل المتصفح دون رفع أي ملفات.`;
  }

  const benefits = [
    locale === "ar"
      ? "معالجة فورية داخل ذاكرة المتصفح دون انتظار أو طوابير"
      : "100% Client-Side: Zero server uploads, zero logs, absolute confidentiality",
    locale === "ar"
      ? "بدون علامة مائية وبدون اشتراكات أو قيود على حجم الملفات"
      : "No Watermarks: Export clean, professional documents ready for submission",
    locale === "ar"
      ? "يعمل على كافة الأجهزة (الهاتف، الحاسوب، الأجهزة اللوحية)"
      : "Cross-Platform: Works smoothly across macOS, Windows, iOS, and Android",
    locale === "ar"
      ? "إمكانية العمل دون اتصال بالإنترنت بعد تحميل الصفحة"
      : "Offline Capable: WebAssembly engine runs even without an active connection",
  ];

  const steps = [
    {
      title: locale === "ar" ? "1. اختر المستند" : "1. Select or Drop File",
      desc:
        locale === "ar"
          ? "اسحب الملف المطلوب وأفلته في المربع المخصص للمعالجة الفورية."
          : "Drag and drop your file directly into the local browser viewport.",
    },
    {
      title: locale === "ar" ? "2. اضبط الخيارات" : "2. Configure Settings",
      desc:
        locale === "ar"
          ? "خصص الإعدادات المناسبة وفقاً لاحتياجاتك بدون أي تعقيد."
          : "Preview and fine-tune your parameters with real-time feedback.",
    },
    {
      title: locale === "ar" ? "3. تنزيل فوري" : "3. Instant Local Download",
      desc:
        locale === "ar"
          ? "احصل على المستند المعالج بنقرة واحدة مباشرة من جهازك."
          : "Save the processed document straight to your device storage.",
    },
  ];

  const faqs = [
    {
      q:
        locale === "ar"
          ? `هل عملية ${toolName} آمنة ومجانية؟`
          : `Is this ${toolName} tool completely free and secure?`,
      a:
        locale === "ar"
          ? "نعم، كافة الأدوات مجانية بالكامل وتعمل داخل جهازك فقط دون رفع أي بيانات إلى خوادم سحابية."
          : "Yes. Processing runs entirely inside your device RAM using WebAssembly and HTML5 Canvas. Zero bytes are uploaded to remote servers.",
    },
    {
      q:
        locale === "ar"
          ? "هل توجد قيود على عدد الصفحات أو حجم الملف؟"
          : "Are there any file size or page limitations?",
      a:
        locale === "ar"
          ? "لا توجد قيود اصطناعية. يمكنك معالجة أي حجم يدعمه جهازك."
          : "No artificial limits. As long as your device has sufficient memory, you can process large documents with ease.",
    },
    {
      q:
        locale === "ar"
          ? "هل يضيف الموقع علامات مائية على الملفات الناتجة؟"
          : "Will my downloaded document contain watermarks?",
      a:
        locale === "ar"
          ? "أبداً. الملفات الناتجة تظل نظيفة ومهنية تماماً."
          : "Never. All generated PDFs and documents are standard, watermark-free files.",
    },
    {
      q:
        locale === "ar"
          ? "هل يمكن استخدام هذه الأداة على الهواتف الذكية؟"
          : "Can I use this tool on mobile phones and tablets?",
      a:
        locale === "ar"
          ? "نعم، متوافق بالكامل مع متصفحات هواتف Android و iPhone و iPad."
          : "Yes, fully responsive on Safari iOS, Chrome Android, Edge, and modern desktop browsers.",
    },
  ];

  const relatedSlugs = CORE_TOOLS.filter((t) => t.type !== tool.type)
    .slice(0, 6)
    .map((t) => (locale === "en" ? `/${t.baseSlug}` : `/${locale}/${t.baseSlug}`));

  return {
    slug,
    locale,
    toolType: tool.type,
    title,
    h1,
    metaDescription,
    intro: metaDescription,
    benefits,
    steps,
    faqs,
    relatedSlugs,
  };
}