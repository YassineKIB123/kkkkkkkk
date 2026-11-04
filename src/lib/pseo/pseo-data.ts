import {
  EN_INDEXED_PSEO_SLUGS,
  LOCALE_INDEXED_SLUGS,
  isEnIndexedSlug,
  isLocaleIndexedSlug,
  enPathForSlug,
  formatKb,
} from "@/lib/seo/site-index";

export type ToolType =
  | "edit"
  | "compress"
  | "compress-image"
  | "merge"
  | "split"
  | "rotate"
  | "sign"
  | "scan"
  | "watermark"
  | "sanitize"
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
  targetKb?: number;
  compatibleTools?: ToolType[];
}

export interface PseoPageData {
  slug: string;
  locale: PseoLocale;
  toolType: ToolType;
  baseSlug: string;
  modifierId?: string;
  modifierCategory?: PseoModifier["category"];
  targetKb?: number;
  title: string;
  h1: string;
  metaDescription: string;
  intro: string;
  benefits: string[];
  steps: { title: string; desc: string }[];
  faqs: { q: string; a: string }[];
  relatedSlugs: { href: string; label: string }[];
  variationLinks: { href: string; label: string }[];
}

export const BASE_SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://iknowapdf.lol";

// 18 Core Tool Definitions
export const CORE_TOOLS: {
  type: ToolType;
  baseSlug: string;
  names: Record<PseoLocale, string>;
  action: Record<PseoLocale, string>;
}[] = [
  {
    type: "edit",
    baseSlug: "edit-pdf",
    names: {
      en: "Edit PDF Text",
      fr: "Modifier le texte d'un PDF",
      es: "Editar texto de PDF",
      ru: "Редактировать текст PDF",
      ar: "تعديل النص في ملف PDF",
    },
    action: {
      en: "edit existing text, numbers, and paragraphs inside PDF files",
      fr: "modifier le texte existant, les chiffres et les paragraphes d'un PDF",
      es: "editar el texto existente, números y párrafos dentro de un PDF",
      ru: "редактировать существующий текст и абзацы прямо в файле PDF",
      ar: "تعديل النصوص والأرقام والفقرات الموجودة داخل ملفات PDF",
    },
  },
  {
    type: "watermark",
    baseSlug: "watermark-pdf",
    names: {
      en: "Add Watermark & Page Numbers to PDF",
      fr: "Filigrane et numéros de page PDF",
      es: "Marca de agua y numerar PDF",
      ru: "Водяной знак и нумерация PDF",
      ar: "إضافة علامة مائية وترقيم صفحات PDF",
    },
    action: {
      en: "stamp diagonal watermarks and page numbers onto PDF",
      fr: "ajouter un filigrane et numéroter les pages d'un PDF",
      es: "añadir marca de agua y numeración de páginas a un PDF",
      ru: "добавить водяной знак и нумерацию страниц в PDF",
      ar: "إضافة علامة مائية وترقيم الصفحات لملف PDF",
    },
  },
  {
    type: "sanitize",
    baseSlug: "sanitize-pdf",
    names: {
      en: "Remove PDF Metadata",
      fr: "Supprimer les métadonnées PDF",
      es: "Eliminar metadatos de PDF",
      ru: "Очистить метаданные PDF",
      ar: "إزالة البيانات الوصفية وتنظيف PDF",
    },
    action: {
      en: "remove hidden author, XMP, and timestamp metadata from PDF",
      fr: "supprimer les métadonnées cachées et l'auteur d'un fichier PDF",
      es: "eliminar metadatos ocultos y rastro de autor de un PDF",
      ru: "удалить скрытые метаданные автора и истории из PDF",
      ar: "إزالة البيانات الوصفية المخفية واسم المؤلف من ملف PDF",
    },
  },
  {
    type: "compress",
    baseSlug: "compress-pdf",
    names: {
      en: "Compress PDF",
      fr: "Compresser un PDF",
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
    type: "compress-image",
    baseSlug: "compress-image",
    names: {
      en: "Compress Image",
      fr: "Compresser une image",
      es: "Comprimir imagen",
      ru: "Сжать изображение",
      ar: "ضغط الصور",
    },
    action: {
      en: "reduce JPG, PNG or WebP image file size",
      fr: "réduire le poids d'une image JPG, PNG ou WebP",
      es: "reducir el tamaño de imágenes JPG, PNG o WebP",
      ru: "уменьшить размер изображения JPG, PNG или WebP",
      ar: "تقليل حجم صور JPG و PNG و WebP",
    },
  },
  {
    type: "merge",
    baseSlug: "merge-pdf",
    names: {
      en: "Merge PDF",
      fr: "Fusionner des PDF",
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
      fr: "Diviser un PDF",
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
      fr: "Signer un PDF",
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
      fr: "Faire pivoter un PDF",
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
      fr: "PDF en texte",
      es: "PDF a texto",
      ru: "PDF в текст",
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

// Programmatic Intent Modifiers with Smart Tool Compatibility Filtering
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
    id: "under-50kb",
    en: "to Under 50 KB",
    fr: "à Moins de 50 Ko",
    es: "a Menos de 50 KB",
    ru: "до 50 КБ",
    ar: "إلى أقل من 50 كيلوبايت",
    category: "size",
    targetKb: 50,
    compatibleTools: ["compress"],
  },
  {
    id: "to-100kb",
    en: "to 100 KB",
    fr: "\u00e0 100 Ko",
    es: "a 100 KB",
    ru: "\u0434\u043e 100 \u041a\u0411",
    ar: "\u0625\u0644\u0649 100 \u0643\u064a\u0644\u0648\u0628\u0627\u064a\u062a",
    category: "size",
    targetKb: 100,
    compatibleTools: ["compress-image"],
  },
  {
    id: "under-100kb",
    en: "to Under 100 KB",
    fr: "à Moins de 100 Ko",
    es: "a Menos de 100 KB",
    ru: "до 100 КБ",
    ar: "إلى أقل من 100 كيلوبايت",
    category: "size",
    targetKb: 100,
    compatibleTools: ["compress", "scan", "jpg-to-pdf", "png-to-pdf", "word-to-pdf"],
  },
  {
    id: "to-200kb",
    en: "to 200 KB",
    fr: "\u00e0 200 Ko",
    es: "a 200 KB",
    ru: "\u0434\u043e 200 \u041a\u0411",
    ar: "\u0625\u0644\u0649 200 \u0643\u064a\u0644\u0648\u0628\u0627\u064a\u062a",
    category: "size",
    targetKb: 200,
    compatibleTools: ["compress-image"],
  },
  {
    id: "under-200kb",
    en: "to Under 200 KB",
    fr: "à Moins de 200 Ko",
    es: "a Menos de 200 KB",
    ru: "до 200 КБ",
    ar: "إلى أقل من 200 كيلوبايت",
    category: "size",
    targetKb: 200,
    compatibleTools: ["compress", "scan", "jpg-to-pdf", "png-to-pdf", "word-to-pdf"],
  },
  {
    id: "under-300kb",
    en: "to Under 300 KB",
    fr: "à Moins de 300 Ko",
    es: "a Menos de 300 KB",
    ru: "до 300 КБ",
    ar: "إلى أقل من 300 كيلوبايت",
    category: "size",
    targetKb: 300,
    compatibleTools: ["compress", "scan", "jpg-to-pdf", "png-to-pdf", "word-to-pdf"],
  },
  {
    id: "under-500kb",
    en: "to Under 500 KB",
    fr: "à Moins de 500 Ko",
    es: "a Menos de 500 KB",
    ru: "до 500 КБ",
    ar: "إلى أقل من 500 كيلوبايت",
    category: "size",
    targetKb: 500,
    compatibleTools: ["compress", "scan", "jpg-to-pdf", "png-to-pdf", "word-to-pdf", "merge"],
  },
  {
    id: "under-1mb",
    en: "to Under 1 MB",
    fr: "à Moins de 1 Mo",
    es: "a Menos de 1 MB",
    ru: "до 1 МБ",
    ar: "إلى أقل من 1 ميجابايت",
    category: "size",
    targetKb: 1024,
    compatibleTools: ["compress", "scan", "jpg-to-pdf", "png-to-pdf", "word-to-pdf", "merge"],
  },
  {
    id: "under-2mb",
    en: "to Under 2 MB",
    fr: "à Moins de 2 Mo",
    es: "a Menos de 2 MB",
    ru: "до 2 МБ",
    ar: "إلى أقل من 2 ميجابايت",
    category: "size",
    targetKb: 2048,
    compatibleTools: ["compress", "scan", "jpg-to-pdf", "png-to-pdf", "word-to-pdf", "merge"],
  },
  {
    id: "under-10kb",
    en: "to Under 10 KB",
    fr: "à moins de 10 Ko",
    es: "a menos de 10 KB",
    ru: "до 10 КБ",
    ar: "إلى أقل من 10 كيلوبايت",
    category: "size",
    targetKb: 10,
    compatibleTools: ["compress"],
  },
  {
    id: "under-20kb",
    en: "to Under 20 KB",
    fr: "à moins de 20 Ko",
    es: "a menos de 20 KB",
    ru: "до 20 КБ",
    ar: "إلى أقل من 20 كيلوبايت",
    category: "size",
    targetKb: 20,
    compatibleTools: ["compress"],
  },
  {
    id: "under-30kb",
    en: "to Under 30 KB",
    fr: "à moins de 30 Ko",
    es: "a menos de 30 KB",
    ru: "до 30 КБ",
    ar: "إلى أقل من 30 كيلوبايت",
    category: "size",
    targetKb: 30,
    compatibleTools: ["compress"],
  },
  {
    id: "under-150kb",
    en: "to Under 150 KB",
    fr: "à moins de 150 Ko",
    es: "a menos de 150 KB",
    ru: "до 150 КБ",
    ar: "إلى أقل من 150 كيلوبايت",
    category: "size",
    targetKb: 150,
    compatibleTools: ["compress"],
  },
  {
    id: "under-5mb",
    en: "to Under 5 MB",
    fr: "à moins de 5 Mo",
    es: "a menos de 5 MB",
    ru: "до 5 МБ",
    ar: "إلى أقل من 5 ميجابايت",
    category: "size",
    targetKb: 5120,
    compatibleTools: ["compress"],
  },
  {
    id: "under-10mb",
    en: "to Under 10 MB",
    fr: "à moins de 10 Mo",
    es: "a menos de 10 MB",
    ru: "до 10 МБ",
    ar: "إلى أقل من 10 ميجابايت",
    category: "size",
    targetKb: 10240,
    compatibleTools: ["compress"],
  },
  {
    id: "to-10kb",
    en: "to 10 KB",
    fr: "à 10 Ko",
    es: "a 10 KB",
    ru: "до 10 КБ",
    ar: "إلى 10 كيلوبايت",
    category: "size",
    targetKb: 10,
    compatibleTools: ["compress-image"],
  },
  {
    id: "to-20kb",
    en: "to 20 KB",
    fr: "à 20 Ko",
    es: "a 20 KB",
    ru: "до 20 КБ",
    ar: "إلى 20 كيلوبايت",
    category: "size",
    targetKb: 20,
    compatibleTools: ["compress-image"],
  },
  {
    id: "to-30kb",
    en: "to 30 KB",
    fr: "à 30 Ko",
    es: "a 30 KB",
    ru: "до 30 КБ",
    ar: "إلى 30 كيلوبايت",
    category: "size",
    targetKb: 30,
    compatibleTools: ["compress-image"],
  },
  {
    id: "to-50kb",
    en: "to 50 KB",
    fr: "à 50 Ko",
    es: "a 50 KB",
    ru: "до 50 КБ",
    ar: "إلى 50 كيلوبايت",
    category: "size",
    targetKb: 50,
    compatibleTools: ["compress-image"],
  },
  {
    id: "on-mac",
    en: "on Mac",
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
    en: "on iPhone & iPad",
    fr: "sur iPhone et iPad Safari",
    es: "en iPhone y iPad Safari",
    ru: "на iPhone и iPad через Safari",
    ar: "على iPhone و iPad عبر Safari",
    category: "platform",
  },
  {
    id: "on-android",
    en: "on Android",
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
    compatibleTools: ["edit", "compress", "merge", "split", "rotate", "sign", "scan", "pdf-to-word", "word-to-pdf", "jpg-to-pdf", "png-to-pdf"],
  },
  {
    id: "lossless-quality",
    en: "with Lossless Original Quality",
    fr: "avec Qualité Originale Sans Perte",
    es: "con Calidad Original Sin Pérdida",
    ru: "с сохранением исходного качества",
    ar: "بجودة أصلية وبدون فقدان للتفاصيل",
    category: "quality",
    compatibleTools: ["compress", "merge", "split", "rotate", "jpg-to-pdf", "png-to-pdf", "pdf-to-jpg", "pdf-to-png"],
  },
  {
    id: "without-losing-quality",
    en: "Without Losing Quality",
    fr: "Sans Perte de Qualité",
    es: "Sin Perder Calidad",
    ru: "без потери качества",
    ar: "بدون فقدان الجودة",
    category: "quality",
    compatibleTools: ["compress", "merge", "split", "rotate", "jpg-to-pdf", "png-to-pdf", "pdf-to-jpg", "pdf-to-png"],
  },
  {
    id: "editable-text",
    en: "with Editable Formatting",
    fr: "avec Formatage Modifiable",
    es: "con Formato Editable",
    ru: "с возможностью редактирования текста",
    ar: "مع إمكانية تعديل النصوص وتنسيقها",
    category: "quality",
    compatibleTools: ["edit", "pdf-to-word", "pdf-to-excel", "pdf-to-powerpoint", "pdf-to-text"],
  },
  {
    id: "high-resolution-300dpi",
    en: "in High Resolution 300 DPI",
    fr: "en Haute Résolution 300 DPI",
    es: "en Alta Resolución 300 DPI",
    ru: "в высоком разрешении 300 DPI",
    ar: "بدقة فائقة 300 DPI للطباعة",
    category: "quality",
    compatibleTools: ["scan", "pdf-to-jpg", "pdf-to-png", "jpg-to-pdf", "png-to-pdf"],
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

export function isModifierCompatible(toolType: ToolType, mod: PseoModifier): boolean {
  // The image compressor only pairs with modifiers that explicitly list it.
  if (!mod.compatibleTools) return toolType !== "compress-image";
  return mod.compatibleTools.includes(toolType);
}

// Helper to generate slug strings
export function buildPseoSlug(baseSlug: string, modifierId?: string): string {
  if (!modifierId) return baseSlug;
  return `${baseSlug}-${modifierId}`;
}

/** Indexed English pSEO slugs (single source of truth: src/lib/seo/site-index.ts). */
export const INDEXED_PSEO_SLUGS = EN_INDEXED_PSEO_SLUGS;

export function isIndexedPseoSlug(slug: string): boolean {
  return isEnIndexedSlug(slug);
}

export function isIndexedPage(locale: PseoLocale, slug: string): boolean {
  return locale === "en" ? isEnIndexedSlug(slug) : isLocaleIndexedSlug(slug);
}

// Module-level memoization caches to prevent O(N^2) rebuilds during static export
let _cachedPages: PseoPageData[] | null = null;
let _cachedMap: Map<string, PseoPageData> | null = null;

export function generateAllPseoPages(): PseoPageData[] {
  if (_cachedPages) return _cachedPages;

  const pages: PseoPageData[] = [];
  const locales: PseoLocale[] = ["en", "fr", "es", "ru", "ar"];

  // Only pages that are actually built & indexed are generated. Everything
  // else was thin, noindexed template output and has been pruned (301s live
  // in public/_redirects).
  for (const locale of locales) {
    for (const tool of CORE_TOOLS) {
      const candidates: { mod?: PseoModifier; slug: string }[] = [
        { slug: tool.baseSlug },
        ...MODIFIERS.filter((m) => isModifierCompatible(tool.type, m)).map((m) => ({
          mod: m,
          slug: buildPseoSlug(tool.baseSlug, m.id),
        })),
      ];
      for (const c of candidates) {
        const isBase = !c.mod;
        const keep =
          locale === "en"
            ? isEnIndexedSlug(c.slug) || isBase
            : isLocaleIndexedSlug(c.slug);
        if (!keep) continue;
        pages.push(buildPageRecord(tool, c.mod, locale, c.slug));
      }
    }
  }

  _cachedPages = pages;
  return pages;
}

export function getPseoPage(locale: PseoLocale, slug: string): PseoPageData | undefined {
  if (!_cachedMap) {
    const all = generateAllPseoPages();
    _cachedMap = new Map<string, PseoPageData>();
    for (const p of all) {
      _cachedMap.set(`${p.locale}:${p.slug}`, p);
    }
  }
  return _cachedMap.get(`${locale}:${slug}`);
}

// ---------------------------------------------------------------------------
// Localized copy helpers
// ---------------------------------------------------------------------------

type L10n<T> = Record<PseoLocale, T>;

const TITLE_SUFFIX: L10n<{ base: string; mod: string; platform: string }> = {
  en: { base: "Free Online, No Upload", mod: "Free, No Upload", platform: "Free, No App" },
  fr: { base: "en ligne gratuit, sans envoi", mod: "gratuit, sans envoi", platform: "gratuit, sans appli" },
  es: { base: "online gratis, sin subir", mod: "gratis, sin subir archivos", platform: "gratis, sin app" },
  ru: { base: "онлайн бесплатно", mod: "бесплатно, без загрузки", platform: "бесплатно, без приложений" },
  ar: { base: "مجاناً وبدون رفع", mod: "مجاناً وبدون رفع الملفات", platform: "مجاناً وبدون تطبيق" },
};

const BRAND = "iKnowAPDF";

/** Builds a <= 60 character title, dropping the suffix/brand when needed. */
function fitTitle(h1: string, suffix: string): string {
  const candidates = [`${h1} – ${suffix} | ${BRAND}`, `${h1} – ${suffix}`, `${h1} | ${BRAND}`, h1];
  return candidates.find((c) => c.length <= 60) ?? h1.slice(0, 60);
}

/** Trims a description to <= 155 chars on a word boundary. */
function clampDescription(text: string, max = 155): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(" ")).replace(/[,;:–-]+$/, "")}…`;
}

export function localSize(kb: number, locale: PseoLocale): string {
  const mb = kb >= 1024;
  const n = mb ? +(kb / 1024).toFixed(1) : kb;
  switch (locale) {
    case "en":
      return formatKb(kb);
    case "fr":
      return `${n} ${mb ? "Mo" : "Ko"}`;
    case "ru":
      return `${n} ${mb ? "МБ" : "КБ"}`;
    case "ar":
      return `${n} ${mb ? "ميجابايت" : "كيلوبايت"}`;
    default:
      return `${n} ${mb ? "MB" : "KB"}`;
  }
}

/** Query-shaped H1 for size modifiers ("Compress PDF to 100KB"). */
function sizeH1(tool: (typeof CORE_TOOLS)[0], kb: number, locale: PseoLocale): string {
  const size = localSize(kb, locale);
  if (tool.type === "compress") {
    return {
      en: `Compress PDF to ${size}`,
      fr: `Compresser un PDF à ${size}`,
      es: `Comprimir PDF a ${size}`,
      ru: `Сжать PDF до ${size}`,
      ar: `ضغط PDF إلى ${size}`,
    }[locale];
  }
  if (tool.type === "compress-image") {
    return {
      en: `Compress Image to ${size}`,
      fr: `Compresser une image à ${size}`,
      es: `Comprimir imagen a ${size}`,
      ru: `Сжать изображение до ${size}`,
      ar: `ضغط الصورة إلى ${size}`,
    }[locale];
  }
  const under = { en: "Under", fr: "de moins de", es: "de menos de", ru: "до", ar: "بحجم أقل من" }[locale];
  return `${tool.names[locale]} ${under} ${size}`;
}

const SPECIAL_EN_H1: Record<string, string> = {
  "compress-pdf-lossless-quality": "Compress PDF Without Losing Quality",
  "compress-pdf-for-email": "Compress PDF for Email Attachments",
  "edit-pdf-without-watermark": "Edit PDF Without Watermark",
};

function getLocalizedBenefits(locale: PseoLocale, toolName: string): string[] {
  switch (locale) {
    case "fr":
      return [
        `100 % local : ${toolName} s'exécute dans votre navigateur, aucun fichier n'est envoyé sur un serveur`,
        "Aucun filigrane : vous téléchargez un document propre, prêt à être envoyé",
        "Multiplateforme : fonctionne sur Windows, macOS, Linux, iPhone/iPad et Android",
        "Sans inscription : pas de compte, pas d'e-mail demandé",
      ];
    case "es":
      return [
        `100 % local: ${toolName} se ejecuta en tu navegador, sin subir archivos a ningún servidor`,
        "Sin marcas de agua: descargas un documento limpio, listo para enviar",
        "Multiplataforma: funciona en Windows, macOS, Linux, iPhone/iPad y Android",
        "Sin registro: no necesitas cuenta ni correo electrónico",
      ];
    case "ru":
      return [
        `100 % локально: «${toolName}» работает в браузере, файлы не загружаются на сервер`,
        "Без водяных знаков: вы скачиваете чистый документ",
        "Кроссплатформенность: Windows, macOS, Linux, iPhone/iPad и Android",
        "Без регистрации: не нужен аккаунт или e-mail",
      ];
    case "ar":
      return [
        `معالجة محلية 100%: تعمل أداة ${toolName} داخل متصفحك دون رفع أي ملف إلى خادم`,
        "بدون علامة مائية: تحصل على مستند نظيف وجاهز للإرسال",
        "يعمل على جميع الأجهزة: Windows و macOS و Linux و iPhone و Android",
        "بدون تسجيل: لا حاجة إلى حساب أو بريد إلكتروني",
      ];
    default:
      return [
        `100% client-side: ${toolName} runs in your browser — nothing is uploaded to a server`,
        "No watermarks: download a clean document ready to send or submit",
        "Cross-platform: works on Windows, macOS, Linux, iPhone/iPad and Android",
        "No sign-up: no account or email address required",
      ];
  }
}

function getLocalizedSteps(
  locale: PseoLocale,
  toolName: string,
  targetKb?: number
): { title: string; desc: string }[] {
  const size = targetKb ? localSize(targetKb, locale) : "";
  switch (locale) {
    case "fr":
      return [
        { title: "1. Ajoutez votre fichier", desc: `Glissez votre document dans la zone ci-dessus ou touchez pour le choisir. ${toolName} démarre directement dans votre navigateur.` },
        { title: "2. Réglez les options", desc: targetKb ? `L'objectif de ${size} est présélectionné : l'outil cherche la meilleure qualité qui reste sous cette taille.` : "Prévisualisez le résultat et ajustez les options si nécessaire." },
        { title: "3. Téléchargez", desc: "Enregistrez le fichier final sur votre appareil, sans filigrane." },
      ];
    case "es":
      return [
        { title: "1. Añade tu archivo", desc: `Arrastra tu documento a la zona de arriba o toca para elegirlo. ${toolName} se ejecuta en tu navegador.` },
        { title: "2. Ajusta las opciones", desc: targetKb ? `El objetivo de ${size} ya está seleccionado: la herramienta busca la mejor calidad que quede por debajo de ese tamaño.` : "Previsualiza el resultado y ajusta las opciones si hace falta." },
        { title: "3. Descarga", desc: "Guarda el archivo final en tu dispositivo, sin marcas de agua." },
      ];
    case "ru":
      return [
        { title: "1. Добавьте файл", desc: `Перетащите документ в область выше или нажмите, чтобы выбрать его. «${toolName}» работает прямо в браузере.` },
        { title: "2. Настройте параметры", desc: targetKb ? `Цель ${size} уже выбрана: инструмент подбирает максимальное качество в пределах этого размера.` : "Проверьте предпросмотр и при необходимости измените настройки." },
        { title: "3. Скачайте", desc: "Сохраните готовый файл на устройство — без водяных знаков." },
      ];
    case "ar":
      return [
        { title: "1. أضف الملف", desc: `اسحب المستند إلى المنطقة أعلاه أو اضغط لاختياره. تعمل أداة ${toolName} داخل متصفحك مباشرة.` },
        { title: "2. اضبط الخيارات", desc: targetKb ? `تم تحديد الحجم المستهدف ${size} مسبقاً: تبحث الأداة عن أفضل جودة ممكنة دون تجاوز هذا الحجم.` : "عاين النتيجة واضبط الخيارات إذا لزم الأمر." },
        { title: "3. نزّل الملف", desc: "احفظ الملف النهائي على جهازك بدون أي علامة مائية." },
      ];
    default:
      return [
        { title: "1. Add your file", desc: `Drop your file into the box above or tap to choose it. ${toolName} starts right in your browser.` },
        { title: "2. Check the settings", desc: targetKb ? `The ${size} target is already selected — the tool looks for the best quality that still fits under that size.` : "Preview the result and adjust the options if you need to." },
        { title: "3. Download", desc: "Save the finished file to your device. No watermark, no account." },
      ];
  }
}

function getLocalizedFaqs(
  locale: PseoLocale,
  toolName: string,
  actionText: string,
  targetKb?: number,
  isImage?: boolean
): { q: string; a: string }[] {
  const size = targetKb ? localSize(targetKb, locale) : "";

  if (locale === "fr") {
    return [
      { q: `${toolName} est-il gratuit et privé ?`, a: `Oui. Le traitement a lieu entièrement dans votre navigateur : vous pouvez ${actionText} sans envoyer le fichier sur un serveur.` },
      targetKb
        ? { q: `Puis-je vraiment obtenir un PDF de ${size} ?`, a: `Souvent, oui. L'outil réduit la résolution et la qualité des images page par page jusqu'à passer sous ${size}. Un document très long ou riche en photos peut nécessiter d'être divisé.` }
        : { q: "Y a-t-il une limite de taille ou de pages ?", a: "Aucune limite artificielle. La seule limite est la mémoire disponible sur votre appareil." },
      { q: "Le fichier téléchargé contient-il un filigrane ?", a: "Non. Les fichiers générés sont propres, sans filigrane." },
      { q: "Cela fonctionne-t-il sur téléphone ?", a: "Oui, dans Safari sur iPhone/iPad, Chrome sur Android et tous les navigateurs récents sur ordinateur." },
    ];
  }
  if (locale === "es") {
    return [
      { q: `¿${toolName} es gratis y privado?`, a: `Sí. Todo el proceso ocurre en tu navegador: puedes ${actionText} sin subir el archivo a ningún servidor.` },
      targetKb
        ? { q: `¿De verdad puedo dejar mi PDF en ${size}?`, a: `Normalmente sí. La herramienta reduce la resolución y la calidad de las imágenes página a página hasta quedar por debajo de ${size}. Un documento muy largo o con muchas fotos puede requerir dividirlo.` }
        : { q: "¿Hay límites de tamaño o de páginas?", a: "No hay límites artificiales. El único límite es la memoria disponible en tu dispositivo." },
      { q: "¿El archivo descargado lleva marca de agua?", a: "No. Los archivos generados no llevan marcas de agua." },
      { q: "¿Funciona en el móvil?", a: "Sí, en Safari para iPhone/iPad, Chrome para Android y cualquier navegador moderno de escritorio." },
    ];
  }
  if (locale === "ru") {
    return [
      { q: `Инструмент «${toolName}» бесплатный и приватный?`, a: `Да. Вся обработка выполняется в браузере: вы можете ${actionText}, не загружая файл на сервер.` },
      targetKb
        ? { q: `Можно ли действительно уменьшить PDF до ${size}?`, a: `Обычно да. Инструмент постранично снижает разрешение и качество изображений, пока файл не станет меньше ${size}. Очень длинный документ или документ с большим количеством фото может потребоваться разделить.` }
        : { q: "Есть ли ограничения по размеру или числу страниц?", a: "Искусственных ограничений нет — всё зависит только от памяти вашего устройства." },
      { q: "Добавляется ли водяной знак?", a: "Нет. Готовые файлы не содержат водяных знаков." },
      { q: "Работает ли это на телефоне?", a: "Да: Safari на iPhone/iPad, Chrome на Android и любые современные браузеры на компьютере." },
    ];
  }
  if (locale === "ar") {
    return [
      { q: `هل أداة ${toolName} مجانية وخاصة؟`, a: `نعم. تتم المعالجة بالكامل داخل متصفحك، فيمكنك ${actionText} دون رفع الملف إلى أي خادم.` },
      targetKb
        ? { q: `هل يمكنني فعلاً تقليل ملف PDF إلى ${size}؟`, a: `غالباً نعم. تخفض الأداة دقة الصور وجودتها صفحة بصفحة حتى يصبح الملف أقل من ${size}. قد تحتاج إلى تقسيم المستندات الطويلة جداً أو المليئة بالصور.` }
        : { q: "هل توجد قيود على حجم الملف أو عدد الصفحات؟", a: "لا توجد قيود مصطنعة؛ الحد الوحيد هو الذاكرة المتاحة على جهازك." },
      { q: "هل يضاف شعار أو علامة مائية إلى الملف؟", a: "لا. الملفات الناتجة نظيفة وبدون علامة مائية." },
      { q: "هل تعمل الأداة على الهاتف؟", a: "نعم، على Safari في iPhone و iPad و Chrome على Android وجميع المتصفحات الحديثة على الحاسوب." },
    ];
  }
  return [
    { q: `Is ${toolName} free and private?`, a: `Yes. Everything runs inside your browser, so you can ${actionText} without uploading the file to any server.` },
    targetKb
      ? isImage
        ? { q: `Can every image be compressed to ${size}?`, a: `Most can. The tool lowers JPEG quality first and only then scales the image down, so it keeps as much detail as fits in ${size}. Very large photos with lots of fine detail will end up smaller in pixel size.` }
        : { q: `Can I really get my file down to ${size}?`, a: `Usually, yes. The tool lowers image resolution and quality page by page until the file fits under ${size}. Very long or photo-heavy documents may need to be split first.` }
      : { q: "Are there file size or page limits?", a: "There are no artificial limits. The only limit is the memory available on your device." },
    { q: "Will the downloaded file have a watermark?", a: "No. Files you download are clean and watermark-free." },
    { q: "Does it work on my phone?", a: "Yes — Safari on iPhone/iPad, Chrome on Android, and any modern desktop browser." },
  ];
}

/** Resolves the canonical English route path for a base tool. */
export function getCanonicalToolPath(baseSlug: string): string {
  return enPathForSlug(baseSlug);
}

export function getLocaleIndexedSlugs(): readonly string[] {
  return LOCALE_INDEXED_SLUGS;
}

/** Whether a base tool slug has a built English page (dedicated /tools/* or indexed root slug). */
function isEnBaseBuilt(baseSlug: string): boolean {
  return enPathForSlug(baseSlug) !== `/${baseSlug}` || isEnIndexedSlug(baseSlug);
}

function buildPageRecord(
  tool: (typeof CORE_TOOLS)[0],
  mod: PseoModifier | undefined,
  locale: PseoLocale,
  slug: string
): PseoPageData {
  const toolName = tool.names[locale];
  const actionText = tool.action[locale];
  const suffixes = TITLE_SUFFIX[locale];

  let h1: string;
  let suffix: string;
  if (!mod) {
    h1 = toolName;
    suffix = suffixes.base;
  } else if (mod.targetKb) {
    h1 = sizeH1(tool, mod.targetKb, locale);
    suffix = suffixes.mod;
  } else if (locale === "en" && SPECIAL_EN_H1[slug]) {
    h1 = SPECIAL_EN_H1[slug];
    suffix = suffixes.mod;
  } else {
    h1 = `${toolName} ${mod[locale]}`.trim();
    suffix = mod.category === "platform" ? suffixes.platform : suffixes.mod;
  }

  const title = fitTitle(h1, suffix);
  const size = mod?.targetKb ? localSize(mod.targetKb, locale) : "";

  let metaDescription: string;
  if (locale === "fr") {
    metaDescription = mod?.targetKb
      ? `${h1} directement dans votre navigateur : l'outil vise ${size} ou moins. Gratuit, sans envoi de fichier, sans filigrane.`
      : `Outil gratuit pour ${actionText}. Traitement 100 % local dans votre navigateur : aucun fichier envoyé, aucun filigrane.`;
  } else if (locale === "es") {
    metaDescription = mod?.targetKb
      ? `${h1} en tu navegador: la herramienta apunta a ${size} o menos. Gratis, sin subir archivos y sin marcas de agua.`
      : `Herramienta gratuita para ${actionText}. Procesamiento 100 % local en tu navegador: sin subir archivos ni marcas de agua.`;
  } else if (locale === "ru") {
    metaDescription = mod?.targetKb
      ? `${h1} прямо в браузере: инструмент подбирает качество под ${size}. Бесплатно, без загрузки файлов и водяных знаков.`
      : `Бесплатный инструмент, чтобы ${actionText}. Обработка 100 % в браузере: без загрузки на сервер и без водяных знаков.`;
  } else if (locale === "ar") {
    metaDescription = mod?.targetKb
      ? `${h1} مباشرة في متصفحك: تستهدف الأداة ${size} أو أقل. مجاناً وبدون رفع الملفات أو علامة مائية.`
      : `أداة مجانية ل${actionText} مباشرة في متصفحك. معالجة محلية 100% دون رفع أي ملف ودون علامة مائية.`;
  } else if (mod?.targetKb && tool.type === "compress") {
    metaDescription = `Compress a PDF to ${size} or less in your browser. The tool aims for the best quality under your limit — free, no upload, no watermark.`;
  } else if (mod?.targetKb && tool.type === "compress-image") {
    metaDescription = `Compress JPG, PNG or WebP images to ${size} or less in your browser — handy for form photos and signatures. Free, no upload, no sign-up.`;
  } else if (mod?.targetKb) {
    metaDescription = `Convert photos into a PDF under ${size} right in your browser — handy for upload forms. Free, no upload, no watermark, no sign-up.`;
  } else if (mod?.category === "platform") {
    metaDescription = `${h1}: the built-in options, their limits, and a free browser tool that needs no app and never uploads your file.`;
  } else if (slug === "compress-pdf-lossless-quality") {
    metaDescription = "Shrink a PDF while keeping text and images sharp. Lossless clean-up runs in your browser — free, no upload, no watermark.";
  } else if (slug === "compress-pdf-for-email") {
    metaDescription = "Make a PDF small enough to email. Fit common attachment limits in your browser — free, no upload, no watermark.";
  } else if (slug === "edit-pdf-without-watermark") {
    metaDescription = "Edit existing PDF text, add text, images and signatures, then download with no watermark. Free, in your browser, no sign-up.";
  } else {
    metaDescription = `Free online tool to ${actionText}. Runs entirely in your browser — files never leave your device. No watermark, no sign-up.`;
  }
  metaDescription = clampDescription(metaDescription);

  const benefits = getLocalizedBenefits(locale, toolName);
  const steps = getLocalizedSteps(locale, toolName, mod?.targetKb);
  const faqs = getLocalizedFaqs(locale, toolName, actionText, mod?.targetKb, tool.type === "compress-image");

  const isIndexed = (s: string) => (locale === "en" ? isEnIndexedSlug(s) : isLocaleIndexedSlug(s));
  const hrefFor = (s: string) => (locale === "en" ? enPathForSlug(s) : `/${locale}/${s}`);

  // Related core tools: only link to pages that are actually built.
  const relatedSlugs = CORE_TOOLS.filter(
    (t) => t.type !== tool.type && (locale === "en" ? isEnBaseBuilt(t.baseSlug) : isLocaleIndexedSlug(t.baseSlug))
  )
    .slice(0, 10)
    .map((t) => ({ href: hrefFor(t.baseSlug), label: t.names[locale] }));

  // Links to the other indexed variations of this tool.
  const indexedVariations = MODIFIERS.filter((m) => isModifierCompatible(tool.type, m))
    .map((m) => ({ m, s: buildPseoSlug(tool.baseSlug, m.id) }))
    .filter(({ m, s }) => m.id !== mod?.id && isIndexed(s))
    .map(({ m, s }) => ({
      href: hrefFor(s),
      label: m.targetKb
        ? sizeH1(tool, m.targetKb, locale)
        : locale === "en" && SPECIAL_EN_H1[s]
          ? SPECIAL_EN_H1[s]
          : `${toolName} ${m[locale]}`,
    }));

  const baseIsBuilt = locale === "en" ? isEnBaseBuilt(tool.baseSlug) : isLocaleIndexedSlug(tool.baseSlug);
  const variationLinks = [
    ...(mod && baseIsBuilt ? [{ href: hrefFor(tool.baseSlug), label: toolName }] : []),
    ...indexedVariations,
  ].slice(0, 20);

  return {
    slug,
    locale,
    toolType: tool.type,
    baseSlug: tool.baseSlug,
    modifierId: mod?.id,
    modifierCategory: mod?.category,
    targetKb: mod?.targetKb,
    title,
    h1,
    metaDescription,
    intro: metaDescription,
    benefits,
    steps,
    faqs,
    relatedSlugs,
    variationLinks,
  };
}
