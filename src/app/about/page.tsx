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
  Info,
  HeartHandshake,
  CheckCircle2,
  Mail,
} from "lucide-react";

export const metadata: Metadata = {
  title: { absolute: "About iKnowAPDF — Free In-Browser PDF Tools" },
  description:
    "Who builds iKnowAPDF, how its in-browser PDF tools work, how the site is funded, and how the guides are written.",
  alternates: {
    canonical: "https://iknowapdf.lol/about",
  },
  openGraph: { images: ["/opengraph-image.png"],
    title: "About iKnowAPDF",
    description:
      "iKnowAPDF is a free set of PDF tools that process files in your browser instead of uploading them. Built and maintained by Yassine K.",
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
                Free PDF tools that work on your files without uploading them
              </p>
            </div>
          </div>

          {/* Mission */}
          <section className="space-y-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <HeartHandshake className="h-5 w-5 text-rose-600" />
              <span>Why iKnowAPDF Exists</span>
            </h2>
            <p>
              <strong>iKnowAPDF</strong> is a free set of PDF tools — compress, merge, split, rotate, sign, edit, scan, convert, watermark and clean metadata — that you can use without creating an account. Browse them all on the{" "}
              <Link href="/pdf-tools" className="text-rose-600 underline font-semibold hover:text-rose-500">
                PDF tools page
              </Link>
              .
            </p>
            <p>
              Many online PDF tools require you to upload tax returns, contracts, medical records or résumés to someone else&apos;s server just to compress a file or sign a form. iKnowAPDF takes a different approach: the processing happens in your browser, on your device.
            </p>
          </section>

          {/* Technical Architecture */}
          <section className="space-y-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Cpu className="h-5 w-5 text-indigo-600" />
              <span>How the Tools Work</span>
            </h2>
            <p>
              The PDF tools run in your browser using open-source JavaScript libraries — <strong>pdf-lib</strong> for editing PDF structure and <strong>PDF.js</strong> for rendering pages — plus the browser&apos;s Canvas and Web Crypto APIs. Your file is read into the browser tab&apos;s memory and the result is downloaded back to your device:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-800/40 space-y-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400 font-bold text-xs">
                  <Lock className="h-4 w-4" />
                </div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                  No File Uploads
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  The documents you process are not sent to our servers. You can confirm this in your browser&apos;s developer tools (Network tab).
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-800/40 space-y-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400 font-bold text-xs">
                  <Zap className="h-4 w-4" />
                </div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                  No Upload Wait
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  There is no upload or server queue. Speed depends on your device — very large files can be slow on phones or low-memory computers.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-800/40 space-y-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400 font-bold text-xs">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                  Nothing Stored by Us
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  We don&apos;t keep copies of your files. Closing or refreshing the tab releases them from memory; downloads are saved wherever your browser saves files.
                </p>
              </div>
            </div>
          </section>

          {/* Honest notes */}
          <section className="space-y-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Info className="h-5 w-5 text-emerald-600" />
              <span>What to Expect</span>
            </h2>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                <span><strong>No watermarks:</strong> We don&apos;t add watermarks or branding to the files you download.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                <span><strong>Know the trade-offs:</strong> Some operations change how a file is stored — for example, the Recommended and Extreme compression presets turn pages into images, and merging does not carry over bookmarks. The tools and guides explain these limits.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                <span><strong>Works in modern browsers:</strong> Chrome, Edge, Firefox and Safari on desktop and mobile. The site can be installed as a web app, and pages you have already opened may keep working offline.</span>
              </li>
            </ul>
          </section>

          {/* Who builds it */}
          <section className="space-y-4 border-t border-slate-100 dark:border-slate-800 pt-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-rose-600" />
              <span>Who Builds iKnowAPDF</span>
            </h2>

            <div className="rounded-2xl border border-slate-200/90 bg-slate-50/70 p-5 dark:border-slate-800 dark:bg-slate-800/40 space-y-2">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-rose-600 text-white font-extrabold flex items-center justify-center text-sm shadow-xs">
                  Y
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">Yassine K.</h3>
                  <p className="text-[11px] font-semibold text-rose-600 dark:text-rose-400">Founder &amp; developer</p>
                </div>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                iKnowAPDF is an independent project built and maintained by Yassine, who develops the in-browser PDF engine behind the tools and writes the guides on the{" "}
                <Link href="/blog" className="text-rose-600 underline font-semibold hover:text-rose-500">
                  blog
                </Link>
                .
              </p>
            </div>

            <div className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              <h3 className="font-bold text-slate-900 dark:text-white">How the guides are written</h3>
              <p>
                Guides explain how PDF features work and how to use the tools, based on building and testing them. When a guide describes what an iKnowAPDF tool does, it should match what the tool does today — if you spot something inaccurate or out of date, tell us and we&apos;ll correct it. Guides that touch on law (signatures, privacy rules) are general information, not legal advice.
              </p>
            </div>

            <div className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              <h3 className="font-bold text-slate-900 dark:text-white">How the site is funded</h3>
              <p>
                The tools are free to use. The free version shows ads and uses analytics; an optional{" "}
                <Link href="/pricing" className="text-rose-600 underline font-semibold hover:text-rose-500">
                  ad-free pass
                </Link>{" "}
                removes the ads and helps cover hosting and development.
              </p>
            </div>
          </section>

          {/* Contact & Support */}
          <section className="space-y-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300 border-t border-slate-100 dark:border-slate-800 pt-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Mail className="h-5 w-5 text-rose-600" />
              <span>Get in Touch</span>
            </h2>
            <p>
              Feedback, bug reports and corrections are welcome. Visit the{" "}
              <Link href="/contact" className="text-rose-600 underline font-semibold hover:text-rose-500">
                contact page
              </Link>{" "}
              or email{" "}
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
              Contact
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
