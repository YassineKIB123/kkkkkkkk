import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  ShieldCheck,
  ArrowLeft,
  Cpu,
  Lock,
  Zap,
  Globe,
  Users,
  HeartHandshake,
  CheckCircle2,
  Mail,
} from "lucide-react";

export const metadata: Metadata = {
  title: "About Us — 100% Client-Side Private PDF Tools",
  description:
    "Learn about iKnowAPDF's mission to provide fast, studio-grade PDF editing, compression, and conversion tools directly in your browser with zero server uploads.",
  alternates: {
    canonical: "https://iknowapdf.lol/about",
  },
  openGraph: {
    title: "About iKnowAPDF — 100% Private Client-Side PDF Suite",
    description:
      "Discover how iKnowAPDF processes sensitive PDF documents entirely in your web browser memory with WebAssembly and zero server retention.",
    url: "https://iknowapdf.lol/about",
    siteName: "iKnowAPDF",
    type: "website",
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-rose-600 hover:text-rose-500 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to iKnowAPDF Home</span>
        </Link>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-8">
          {/* Header */}
          <div className="flex items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 border border-rose-100 dark:bg-rose-950/50 dark:border-rose-900">
              <Globe className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                About iKnowAPDF
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Empowering global document productivity with unconditional client-side privacy
              </p>
            </div>
          </div>

          {/* Mission */}
          <section className="space-y-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <HeartHandshake className="h-5 w-5 text-rose-600" />
              <span>Our Mission</span>
            </h2>
            <p>
              <strong>iKnowAPDF</strong> was created with a clear purpose: to free students, legal professionals, accountants, educators, and everyday users from expensive subscription paywalls, intrusive registration forms, and dangerous cloud-upload practices.
            </p>
            <p>
              Every day, millions of people upload sensitive tax returns, confidential business agreements, medical records, and personal resumes to unfamiliar third-party cloud servers simply to compress a file or sign a form. We believe you should never have to surrender document privacy to access modern PDF tools.
            </p>
          </section>

          {/* Technical Architecture */}
          <section className="space-y-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Cpu className="h-5 w-5 text-indigo-600" />
              <span>How Our Client-Side Architecture Works</span>
            </h2>
            <p>
              Unlike legacy online PDF converters that require files to travel across remote networks to backend servers, iKnowAPDF executes every operation <strong>100% locally within your device&apos;s browser memory (RAM)</strong> using WebAssembly, HTML5 Canvas, and client-side JavaScript libraries:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-800/40 space-y-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400 font-bold text-xs">
                  <Lock className="h-4 w-4" />
                </div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                  Zero Cloud Uploads
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Your documents never touch our servers or external databases. Every byte stays inside your device.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-800/40 space-y-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400 font-bold text-xs">
                  <Zap className="h-4 w-4" />
                </div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                  Instant Processing
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  No server queue times or slow upload/download delays. Processing speed depends purely on your device hardware.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-800/40 space-y-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400 font-bold text-xs">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                  Automatic Memory Clearance
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Once you finish and close or refresh your browser tab, all document buffers in RAM are permanently released.
                </p>
              </div>
            </div>
          </section>

          {/* Key Standards */}
          <section className="space-y-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Users className="h-5 w-5 text-emerald-600" />
              <span>Our Publishing & Quality Standards</span>
            </h2>
            <p>
              We adhere to strict standards to ensure every tool in our suite delivers clean, professional output:
            </p>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                <span><strong>No Watermarks:</strong> Every file downloaded is pristine and suitable for official legal, court, and commercial use.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                <span><strong>Full PDF Specification Compliance:</strong> Merged, split, signed, and compressed files preserve standard ISO 32000 PDF tags, bookmarks, and font tables.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                <span><strong>Cross-Platform & Offline:</strong> Built as a Progressive Web App (PWA) that runs seamlessly on Chrome, Safari, Edge, and Firefox across macOS, Windows, Linux, iOS, and Android.</span>
              </li>
            </ul>
          </section>

          {/* Contact & Support */}
          <section className="space-y-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300 border-t border-slate-100 dark:border-slate-800 pt-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Mail className="h-5 w-5 text-rose-600" />
              <span>Get in Touch</span>
            </h2>
            <p>
              We welcome feedback, feature suggestions, bug reports, and partnership inquiries. Visit our{" "}
              <Link href="/contact" className="text-rose-600 underline font-semibold hover:text-rose-500">
                Contact Support page
              </Link>{" "}
              or email our team directly at{" "}
              <a href="mailto:support@iknowapdf.lol" className="text-rose-600 underline font-semibold hover:text-rose-500">
                support@iknowapdf.lol
              </a>
              .
            </p>
          </section>

          

          {/* Footer Navigation */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-5 text-xs font-semibold text-slate-500">
            <Link href="/privacy" className="hover:text-rose-600 underline">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-rose-600 underline">
              Terms of Service
            </Link>
            <Link href="/contact" className="hover:text-rose-600 underline">
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
