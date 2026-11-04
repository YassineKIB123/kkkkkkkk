import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Mail, ArrowLeft, ShieldCheck, Globe, Cpu } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact iKnowAPDF for help, bug reports, corrections to our guides, or feature requests.",
  alternates: {
    canonical: "https://iknowapdf.lol/contact",
  },
  openGraph: { images: ["/opengraph-image.png"],
    title: "Contact iKnowAPDF",
    description:
      "Questions, bug reports or corrections for iKnowAPDF's in-browser PDF tools? Email support@iknowapdf.lol.",
    url: "https://iknowapdf.lol/contact",
    siteName: "iKnowAPDF",
    type: "website",
  },
};

const SUPPORT_EMAIL = "support@iknowapdf.lol";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl space-y-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-rose-600 hover:text-rose-500"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to iKnowAPDF Home</span>
        </Link>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-8">
          <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100 dark:bg-blue-950/50 dark:border-blue-900">
              <Mail className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                Contact
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Questions, bug reports, corrections and feature requests
              </p>
            </div>
          </div>

          <section className="space-y-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>Email</span>
            </h2>
            <p>
              iKnowAPDF is run by one developer, so email is the best way to reach us. We read every message and aim to reply within a few days.
            </p>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/50 space-y-1">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Support email
              </p>
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="text-sm font-bold text-rose-600 hover:underline"
              >
                {SUPPORT_EMAIL}
              </a>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Please don&apos;t attach confidential documents. If a file causes a problem, describe it (page count, size, which tool and browser) or send a test file without personal data.
            </p>
          </section>

          <section className="space-y-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Globe className="h-4 w-4 text-rose-600" />
              <span>About iKnowAPDF</span>
            </h2>
            <p>
              <strong>iKnowAPDF</strong> offers free PDF tools — compress, merge, split, rotate, sign, edit, scan, convert and more — that process files in your browser instead of uploading them. See the{" "}
              <Link href="/about" className="text-rose-600 underline hover:text-rose-500">
                About page
              </Link>{" "}
              for who builds it and how it is funded.
            </p>
          </section>

          <section className="space-y-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Cpu className="h-4 w-4 text-indigo-600" />
              <span>How Your Files Are Handled</span>
            </h2>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>
                <strong>No file uploads:</strong> The PDF tools process files in your browser using PDF.js, pdf-lib and the Canvas API. Your documents are not sent to our servers.
              </li>
              <li>
                <strong>No file storage:</strong> We don&apos;t keep copies of your documents. Closing or refreshing the tab releases them from memory.
              </li>
              <li>
                <strong>Partial offline support:</strong> The site can be installed as a web app, and pages you have already opened may keep working without a connection.
              </li>
            </ul>
          </section>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-5 text-xs font-semibold text-slate-500">
            <Link href="/about" className="hover:text-rose-600 underline">
              About
            </Link>
            <Link href="/privacy" className="hover:text-rose-600 underline">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-rose-600 underline">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
