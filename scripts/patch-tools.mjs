import fs from 'fs';
import path from 'path';

console.log('Starting full localization patch...');

// 1. ToolLayout.tsx path map expansion
{
  const p = path.resolve('src/components/tools/ToolLayout.tsx');
  let content = fs.readFileSync(p, 'utf8');

  const oldMapRegex = /const TOOL_PATH_MAP: Record<string, SupportedToolId> = \{[\s\S]*?\};/;
  const newMap = `const TOOL_PATH_MAP: Record<string, SupportedToolId> = {
  "/tools/compress-pdf": "compress",
  "/tools/merge-pdf": "merge",
  "/tools/split-pdf": "split",
  "/tools/rotate-pdf": "rotate",
  "/tools/edit-pdf": "edit",
  "/tools/sign-pdf": "sign",
  "/tools/scan": "scan",
  "/tools/convert": "convert",
  "/tools/images-to-pdf": "imagesToPdf",
  "/tools/pdf-to-images": "pdfToImages",
  "/tools/watermark-pdf": "watermark",
  "/tools/sanitize-pdf": "sanitize",
  "/compress-pdf": "compress",
  "/merge-pdf": "merge",
  "/split-pdf": "split",
  "/rotate-pdf": "rotate",
  "/edit-pdf": "edit",
  "/sign-pdf": "sign",
  "/scan": "scan",
  "/scan-pdf": "scan",
  "/convert": "convert",
  "/pdf-to-word": "convert",
  "/word-to-pdf": "convert",
  "/pdf-to-excel": "convert",
  "/excel-to-pdf": "convert",
  "/pdf-to-powerpoint": "convert",
  "/powerpoint-to-pdf": "convert",
  "/pdf-to-text": "convert",
  "/text-to-pdf": "convert",
  "/jpg-to-pdf": "imagesToPdf",
  "/png-to-pdf": "imagesToPdf",
  "/pdf-to-jpg": "pdfToImages",
  "/pdf-to-png": "pdfToImages",
  "/compress-pdf-to-100kb": "compress",
  "/compress-pdf-to-200kb": "compress",
  "/compress-pdf-under-1mb": "compress",
  "/watermark-pdf": "watermark",
  "/sanitize-pdf": "sanitize",
};`;

  if (oldMapRegex.test(content)) {
    content = content.replace(oldMapRegex, newMap);
    fs.writeFileSync(p, content, 'utf8');
    console.log('✓ ToolLayout.tsx path map updated');
  }
}

// 2. split-pdf/page.tsx
{
  const p = path.resolve('src/app/tools/split-pdf/page.tsx');
  let content = fs.readFileSync(p, 'utf8');

  if (!content.includes('useLanguage')) {
    content = content.replace(
      'import { FileDropzone } from "@/components/tools/FileDropzone";',
      'import { FileDropzone } from "@/components/tools/FileDropzone";\nimport { useLanguage } from "@/context/LanguageContext";'
    );
  }

  content = content.replace(
    'export default function SplitPdfPage() {',
    'export default function SplitPdfPage() {\n  const { t, language } = useLanguage();'
  );

  content = content.replace('<ToolLayout', '<ToolLayout toolId="split"');

  content = content.replace(
    /<FileDropzone[\s\S]*?title="Drop a PDF document here to split"[\s\S]*?\/>/,
    '<FileDropzone\n            accept="application/pdf,.pdf"\n            multiple={false}\n            onFilesSelected={handleFileSelected}\n          />'
  );

  content = content.replace('<span>Choose Another</span>', '<span>{t.common.clear}</span>');
  content = content.replace('Total Pages:', '{language === "AR" ? "إجمالي الصفحات:" : language === "FR" ? "Total pages :" : language === "ES" ? "Páginas totales:" : language === "RU" ? "Всего страниц:" : "Total Pages:"}');
  content = content.replace('Pages to Extract (Type Range or Click Thumbnails)', '{t.toolUi.split.rangeTitle}');
  content = content.replace('placeholder="e.g. 1-3, 5, 8-10"', 'placeholder={t.toolUi.split.rangePlaceholder}');
  content = content.replace(
    'Will extract {extractedCount} of {pageCount} pages',
    '{language === "AR" ? `سيتم استخراج ${extractedCount} من ${pageCount} صفحة` : `Will extract ${extractedCount} of ${pageCount} pages`}'
  );
  content = content.replace(
    '<Layers className="h-3.5 w-3.5 text-rose-600" /> Quick Presets:',
    '<Layers className="h-3.5 w-3.5 text-rose-600" /> {language === "AR" ? "خيارات سريعة:" : language === "FR" ? "Préréglages :" : language === "ES" ? "Preajustes:" : language === "RU" ? "Шаблоны:" : "Quick Presets:"}'
  );
  content = content.replace('All ({pageCount})', '{language === "AR" ? `الكل (${pageCount})` : `All (${pageCount})`}');
  content = content.replace('>Odd Pages<', '>{language === "AR" ? "الصفحات الفردية" : language === "FR" ? "Pages impaires" : language === "ES" ? "Páginas impares" : language === "RU" ? "Нечетные" : "Odd Pages"}<');
  content = content.replace('>Even Pages<', '>{language === "AR" ? "الصفحات الزوجية" : language === "FR" ? "Pages paires" : language === "ES" ? "Páginas pares" : language === "RU" ? "Четные" : "Even Pages"}<');
  content = content.replace('>First Page Only<', '>{language === "AR" ? "الصفحة الأولى فقط" : language === "FR" ? "Première page" : language === "ES" ? "Primera página" : language === "RU" ? "Только 1-я" : "First Page Only"}<');
  content = content.replace('Click any page thumbnail to include or exclude it:', '{language === "AR" ? "انقر على مصغرة أي صفحة لتحديدها أو استبعادها:" : "Click any page thumbnail to include or exclude it:"}');
  content = content.replace('Page {t.pageNumber}', '{t.toolUi.split.page} {t.pageNumber}');
  content = content.replace('<span>Extracting Pages...</span>', '<span>{t.toolUi.split.extracting}</span>');
  content = content.replace('<span>Split & Download PDF</span>', '<span>{t.toolUi.split.splitBtn}</span>');

  fs.writeFileSync(p, content, 'utf8');
  console.log('✓ split-pdf/page.tsx updated');
}

// 3. rotate-pdf/page.tsx
{
  const p = path.resolve('src/app/tools/rotate-pdf/page.tsx');
  let content = fs.readFileSync(p, 'utf8');

  if (!content.includes('useLanguage')) {
    content = content.replace(
      'import { FileDropzone } from "@/components/tools/FileDropzone";',
      'import { FileDropzone } from "@/components/tools/FileDropzone";\nimport { useLanguage } from "@/context/LanguageContext";'
    );
  }

  content = content.replace(
    'export default function RotatePdfPage() {',
    'export default function RotatePdfPage() {\n  const { t, language } = useLanguage();'
  );

  content = content.replace('<ToolLayout', '<ToolLayout toolId="rotate"');

  content = content.replace(
    /<FileDropzone[\s\S]*?title="Drop a PDF document here to rotate"[\s\S]*?\/>/,
    '<FileDropzone\n            accept="application/pdf,.pdf"\n            multiple={false}\n            onFilesSelected={handleFileSelected}\n          />'
  );

  content = content.replace('<span>Rotate All +90°</span>', '<span>{t.toolUi.rotate.rotateAll}</span>');
  content = content.replace('<span>Reset</span>', '<span>{t.common.clear}</span>');
  content = content.replace('<span>Remove</span>', '<span>{t.common.remove}</span>');
  content = content.replace('<span>Applying Rotations...</span>', '<span>{t.toolUi.rotate.rotating}</span>');
  content = content.replace('<span>Save & Download PDF</span>', '<span>{t.toolUi.rotate.rotateBtn}</span>');

  fs.writeFileSync(p, content, 'utf8');
  console.log('✓ rotate-pdf/page.tsx updated');
}

// 4. convert/page.tsx
{
  const p = path.resolve('src/app/tools/convert/page.tsx');
  let content = fs.readFileSync(p, 'utf8');

  if (!content.includes('useLanguage')) {
    content = content.replace(
      'import { FileDropzone } from "@/components/tools/FileDropzone";',
      'import { FileDropzone } from "@/components/tools/FileDropzone";\nimport { useLanguage } from "@/context/LanguageContext";'
    );
  }

  content = content.replace(
    'export default function UniversalConverterPage({',
    'export default function UniversalConverterPage({\n  initialToolType,\n}: UniversalConverterPageProps = {}) {\n  const { t, language } = useLanguage();'
  );

  content = content.replace('<ToolLayout', '<ToolLayout toolId="convert"');

  content = content.replace(
    /<FileDropzone[\s\S]*?title="Drop any document, presentation, spreadsheet, or image here"[\s\S]*?\/>/,
    '<FileDropzone\n            accept=".pdf,.docx,.doc,.xlsx,.xls,.csv,.pptx,.ppt,.txt,.md,.png,.jpg,.jpeg,.webp"\n            multiple={false}\n            onFilesSelected={handleFileSelected}\n          />'
  );

  content = content.replace('<span>Choose Another</span>', '<span>{t.common.clear}</span>');
  content = content.replace('<span>Select Target Output Format</span>', '<span>{language === "AR" ? "حدد صيغة التحويل المطلوبة" : language === "FR" ? "Sélectionnez le format de sortie" : language === "ES" ? "Selecciona el formato de salida" : language === "RU" ? "Выберите выходной формат" : "Select Target Output Format"}</span>');
  content = content.replace('<span>Convert & Download</span>', '<span>{t.toolUi.convert.convertBtn}</span>');
  content = content.replace('<span>Processing Conversion...</span>', '<span>{t.toolUi.convert.converting}</span>');

  fs.writeFileSync(p, content, 'utf8');
  console.log('✓ convert/page.tsx updated');
}

// 5. images-to-pdf/page.tsx
{
  const p = path.resolve('src/app/tools/images-to-pdf/page.tsx');
  let content = fs.readFileSync(p, 'utf8');

  if (!content.includes('useLanguage')) {
    content = content.replace(
      'import { FileDropzone } from "@/components/tools/FileDropzone";',
      'import { FileDropzone } from "@/components/tools/FileDropzone";\nimport { useLanguage } from "@/context/LanguageContext";'
    );
  }

  content = content.replace(
    'export default function ImagesToPdfPage() {',
    'export default function ImagesToPdfPage() {\n  const { t, language } = useLanguage();'
  );

  content = content.replace('<ToolLayout', '<ToolLayout toolId="imagesToPdf"');

  content = content.replace(
    /<FileDropzone[\s\S]*?accept="image\/jpeg,image\/png,image\/webp,\.jpg,\.jpeg,\.png,\.webp"[\s\S]*?\/>/,
    '<FileDropzone\n          accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"\n          multiple={true}\n          onFilesSelected={handleFilesSelected}\n        />'
  );

  content = content.replace('Standard A4', '{t.toolUi.imagesToPdf.standardA4}');
  content = content.replace('Fit Image Size', '{t.toolUi.imagesToPdf.fitImage}');
  content = content.replace('<span>Clear All</span>', '<span>{t.common.clearAll}</span>');
  content = content.replace('<span>Generating PDF...</span>', '<span>{t.toolUi.imagesToPdf.converting}</span>');
  content = content.replace(
    '<span>Convert {files.length} Images to PDF</span>',
    '<span>{t.toolUi.imagesToPdf.convertBtn} ({files.length})</span>'
  );

  fs.writeFileSync(p, content, 'utf8');
  console.log('✓ images-to-pdf/page.tsx updated');
}

// 6. pdf-to-images/page.tsx
{
  const p = path.resolve('src/app/tools/pdf-to-images/page.tsx');
  let content = fs.readFileSync(p, 'utf8');

  if (!content.includes('useLanguage')) {
    content = content.replace(
      'import { FileDropzone } from "@/components/tools/FileDropzone";',
      'import { FileDropzone } from "@/components/tools/FileDropzone";\nimport { useLanguage } from "@/context/LanguageContext";'
    );
  }

  content = content.replace(
    'export default function PdfToImagesPage({',
    'export default function PdfToImagesPage({\n  initialFormat = "png",\n}: PdfToImagesPageProps = {}) {\n  const { t, language } = useLanguage();'
  );

  content = content.replace('<ToolLayout', '<ToolLayout toolId="pdfToImages"');

  content = content.replace(
    /<FileDropzone[\s\S]*?title="Drop a PDF document to convert into images"[\s\S]*?\/>/,
    '<FileDropzone\n            accept="application/pdf,.pdf"\n            multiple={false}\n            onFilesSelected={handleFileSelected}\n          />'
  );

  content = content.replace('<span>Remove</span>', '<span>{t.common.remove}</span>');
  content = content.replace('<span>Image Format</span>', '<span>{t.toolUi.pdfToImages.format}</span>');
  content = content.replace('<span>Download</span>', '<span>{t.common.download}</span>');
  content = content.replace(
    '<span>Download All as ZIP ({pages.length} Pages)</span>',
    '<span>{t.toolUi.pdfToImages.downloadZip} ({pages.length})</span>'
  );
  content = content.replace('<span>Packaging ZIP Archive...</span>', '<span>{t.toolUi.pdfToImages.converting}</span>');

  fs.writeFileSync(p, content, 'utf8');
  console.log('✓ pdf-to-images/page.tsx updated');
}

// 7. watermark-pdf/page.tsx
{
  const p = path.resolve('src/app/tools/watermark-pdf/page.tsx');
  let content = fs.readFileSync(p, 'utf8');

  if (!content.includes('useLanguage')) {
    content = content.replace(
      'import { FileDropzone } from "@/components/tools/FileDropzone";',
      'import { FileDropzone } from "@/components/tools/FileDropzone";\nimport { useLanguage } from "@/context/LanguageContext";'
    );
  }

  content = content.replace(
    'export default function WatermarkPdfPage() {',
    'export default function WatermarkPdfPage() {\n  const { t, language } = useLanguage();'
  );

  content = content.replace('<ToolLayout', '<ToolLayout toolId="watermark"');

  content = content.replace(
    /<FileDropzone[\s\S]*?title="Drop a PDF file to add watermark or page numbers"[\s\S]*?\/>/,
    '<FileDropzone\n            accept="application/pdf,.pdf"\n            multiple={false}\n            onFilesSelected={handleFileSelected}\n          />'
  );

  content = content.replace('<span>Remove</span>', '<span>{t.common.remove}</span>');
  content = content.replace('<span>Diagonal Watermark Text</span>', '<span>{t.toolUi.watermark.watermarkTextLabel}</span>');
  content = content.replace('<span>Automatic Page Numbering</span>', '<span>{t.toolUi.watermark.pageNumbersLabel}</span>');
  content = content.replace('<span>Applying Watermark...</span>', '<span>{t.toolUi.watermark.applying}</span>');
  content = content.replace('<span>Apply & Download PDF</span>', '<span>{t.toolUi.watermark.applyBtn}</span>');

  fs.writeFileSync(p, content, 'utf8');
  console.log('✓ watermark-pdf/page.tsx updated');
}

// 8. sanitize-pdf/page.tsx
{
  const p = path.resolve('src/app/tools/sanitize-pdf/page.tsx');
  let content = fs.readFileSync(p, 'utf8');

  if (!content.includes('useLanguage')) {
    content = content.replace(
      'import { FileDropzone } from "@/components/tools/FileDropzone";',
      'import { FileDropzone } from "@/components/tools/FileDropzone";\nimport { useLanguage } from "@/context/LanguageContext";'
    );
  }

  content = content.replace(
    'export default function SanitizePdfPage() {',
    'export default function SanitizePdfPage() {\n  const { t, language } = useLanguage();'
  );

  content = content.replace('<ToolLayout', '<ToolLayout toolId="sanitize"');

  content = content.replace(
    /<FileDropzone[\s\S]*?title="Drop a PDF file to inspect & strip hidden metadata"[\s\S]*?\/>/,
    '<FileDropzone\n            accept="application/pdf,.pdf"\n            multiple={false}\n            onFilesSelected={handleFileSelected}\n          />'
  );

  content = content.replace('<span>Remove</span>', '<span>{t.common.remove}</span>');
  content = content.replace('<span>Sanitizing PDF...</span>', '<span>{t.toolUi.sanitize.sanitizing}</span>');
  content = content.replace('<span>Purge Metadata & Download Clean PDF</span>', '<span>{t.toolUi.sanitize.sanitizeBtn}</span>');

  fs.writeFileSync(p, content, 'utf8');
  console.log('✓ sanitize-pdf/page.tsx updated');
}

// 9. sign-pdf/page.tsx
{
  const p = path.resolve('src/app/tools/sign-pdf/page.tsx');
  let content = fs.readFileSync(p, 'utf8');

  if (!content.includes('useLanguage')) {
    content = content.replace(
      'import { FileDropzone } from "@/components/tools/FileDropzone";',
      'import { FileDropzone } from "@/components/tools/FileDropzone";\nimport { useLanguage } from "@/context/LanguageContext";'
    );
  }

  content = content.replace(
    'export default function SignPdfPage() {',
    'export default function SignPdfPage() {\n  const { t, language } = useLanguage();'
  );

  content = content.replace('<ToolLayout', '<ToolLayout toolId="sign"');

  content = content.replace(
    /<FileDropzone[\s\S]*?title="Drop a PDF document to sign"[\s\S]*?\/>/,
    '<FileDropzone\n            accept="application/pdf,.pdf"\n            multiple={false}\n            onFilesSelected={handleFileSelected}\n          />'
  );

  content = content.replace('<span>New Signature</span>', '<span>{t.toolUi.sign.newSignature}</span>');
  content = content.replace('<span>Insert Saved</span>', '<span>{language === "AR" ? "إدراج المحفوظ" : language === "FR" ? "Insérer enregistré" : language === "ES" ? "Insertar guardada" : language === "RU" ? "Вставить сохраненную" : "Insert Saved"}</span>');
  content = content.replace('<span>+ Date</span>', '<span>{language === "AR" ? "+ التاريخ" : "+ Date"}</span>');
  content = content.replace('<span>+ Check ✓</span>', '<span>{language === "AR" ? "+ صح ✓" : "+ Check ✓"}</span>');
  content = content.replace('<span>Choose Another</span>', '<span>{t.common.clear}</span>');
  content = content.replace('<span>Signing PDF...</span>', '<span>{t.toolUi.sign.signing}</span>');
  content = content.replace('<span>Apply Signatures & Download</span>', '<span>{t.toolUi.sign.signBtn}</span>');

  // Modal tabs
  content = content.replace('>Draw Signature<', '>{t.toolUi.sign.drawTab}<');
  content = content.replace('>Type Signature<', '>{t.toolUi.sign.typeTab}<');
  content = content.replace('>Upload Image<', '>{t.toolUi.sign.uploadTab}<');
  content = content.replace('<span>Clear Pad</span>', '<span>{t.toolUi.sign.clearBtn}</span>');
  content = content.replace('>Cancel<', '>{t.common.close}<');
  content = content.replace('<span>Place & Save Signature</span>', '<span>{language === "AR" ? "تطبيق وحفظ التوقيع" : "Place & Save Signature"}</span>');

  fs.writeFileSync(p, content, 'utf8');
  console.log('✓ sign-pdf/page.tsx updated');
}

// 10. edit-pdf/page.tsx
{
  const p = path.resolve('src/app/tools/edit-pdf/page.tsx');
  let content = fs.readFileSync(p, 'utf8');

  if (!content.includes('useLanguage')) {
    content = content.replace(
      'import { FileDropzone } from "@/components/tools/FileDropzone";',
      'import { FileDropzone } from "@/components/tools/FileDropzone";\nimport { useLanguage } from "@/context/LanguageContext";'
    );
  }

  content = content.replace(
    'export default function EditPdfPage() {',
    'export default function EditPdfPage() {\n  const { t, language } = useLanguage();'
  );

  content = content.replace('<ToolLayout', '<ToolLayout toolId="edit"');

  content = content.replace(
    /<FileDropzone[\s\S]*?title="Upload PDF file to edit"[\s\S]*?\/>/,
    '<FileDropzone\n            accept="application/pdf,.pdf"\n            multiple={false}\n            onFilesSelected={handleFileSelected}\n          />'
  );

  content = content.replace('<span>Apply changes</span>', '<span>{language === "AR" ? "تطبيق التعديلات والتحميل" : language === "FR" ? "Appliquer les modifications" : language === "ES" ? "Aplicar cambios" : language === "RU" ? "Применить изменения" : "Apply changes"}</span>');
  content = content.replace('<span>Processing PDF...</span>', '<span>{t.common.processing}</span>');

  fs.writeFileSync(p, content, 'utf8');
  console.log('✓ edit-pdf/page.tsx updated');
}

console.log('All 10 patches applied successfully!');
