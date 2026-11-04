import React from "react";
import type { PseoLocale } from "@/lib/pseo/pseo-data";
import { getPseoPage } from "@/lib/pseo/pseo-data";
import { LOCALE_BASE_SLUGS, LOCALE_SIZE_SLUGS, type SiteLocale } from "@/lib/seo/site-index";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { LinkPills } from "@/components/seo/ContentSections";

export const HUB_COPY: Record<
  SiteLocale,
  { title: string; h1: string; description: string; tools: string; convert: string; sizes: string; english: string }
> = {
  fr: {
    title: "Outils PDF gratuits et privés, sans envoi | iKnowAPDF",
    h1: "Outils PDF gratuits, 100 % dans votre navigateur",
    description:
      "Compressez, fusionnez, divisez, signez et convertissez vos PDF gratuitement. Tout se passe dans votre navigateur : aucun fichier n'est envoyé.",
    tools: "Modifier et organiser",
    convert: "Convertir",
    sizes: "Compresser à une taille précise",
    english: "Version anglaise",
  },
  es: {
    title: "Herramientas PDF gratis y privadas | iKnowAPDF",
    h1: "Herramientas PDF gratis, 100 % en tu navegador",
    description:
      "Comprime, une, divide, firma y convierte PDF gratis. Todo ocurre en tu navegador: tus archivos nunca se suben a un servidor.",
    tools: "Editar y organizar",
    convert: "Convertir",
    sizes: "Comprimir a un tamaño exacto",
    english: "Versión en inglés",
  },
  ru: {
    title: "Бесплатные инструменты PDF без загрузки | iKnowAPDF",
    h1: "Бесплатные инструменты PDF прямо в браузере",
    description:
      "Сжимайте, объединяйте, разделяйте, подписывайте и конвертируйте PDF бесплатно. Всё работает в браузере — файлы не загружаются на сервер.",
    tools: "Редактирование и упорядочивание",
    convert: "Конвертация",
    sizes: "Сжать до нужного размера",
    english: "Английская версия",
  },
  ar: {
    title: "أدوات PDF مجانية وخاصة بدون رفع | iKnowAPDF",
    h1: "أدوات PDF مجانية تعمل بالكامل داخل متصفحك",
    description:
      "اضغط ملفات PDF وادمجها وقسّمها ووقّعها وحوّلها مجاناً. تتم المعالجة داخل متصفحك دون رفع أي ملف إلى خادم.",
    tools: "التعديل والتنظيم",
    convert: "التحويل",
    sizes: "الضغط إلى حجم محدد",
    english: "النسخة الإنجليزية",
  },
};

function linksFor(locale: PseoLocale, slugs: readonly string[]) {
  return slugs
    .map((s) => getPseoPage(locale, s))
    .filter((p): p is NonNullable<typeof p> => Boolean(p))
    .map((p) => ({ href: `/${locale}/${p.slug}`, label: p.h1 }));
}

/** Language home page (/fr, /es, /ru, /ar) linking every indexed page of that locale. */
export function LocaleHub({ locale }: { locale: SiteLocale }) {
  const copy = HUB_COPY[locale];
  const toolSlugs = LOCALE_BASE_SLUGS.filter((s) => !s.includes("-to-"));
  const convertSlugs = LOCALE_BASE_SLUGS.filter((s) => s.includes("-to-"));

  const groups = [
    { heading: copy.tools, links: linksFor(locale, toolSlugs) },
    { heading: copy.sizes, links: linksFor(locale, LOCALE_SIZE_SLUGS) },
    { heading: copy.convert, links: linksFor(locale, convertSlugs) },
  ];

  return (
    <ToolLayout title={copy.h1} description={copy.description} hideSeoMeta={true} hideToolSections={true}>
      <div className="space-y-8">
        {groups.map((g) => (
          <section key={g.heading} className="space-y-3">
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white">{g.heading}</h2>
            <LinkPills links={g.links} />
          </section>
        ))}
      </div>
    </ToolLayout>
  );
}
